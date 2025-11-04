import { PrismaClient, IssueStatus as PrismaIssueStatus, IssuePriority as PrismaIssuePriority } from "@prisma/client";
import { CreateIssueRequest, IssueDTO, UpdateIssueRequest } from "./issue.types";

const prisma = new PrismaClient();

function toDTO(row: any): IssueDTO {
  return {
    id: row.id,
    projectId: row.projectId,
    title: row.title,
    description: row.description,
    status: row.status,
    priority: row.priority,
    createdById: row.createdById,
    assignedToId: row.assignedToId,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function createIssue(projectId: string, userId: string, data: CreateIssueRequest): Promise<IssueDTO> {
  // creator must be project member
  const member = await prisma.projectMember.findFirst({ where: { projectId, userId } });
  if (!member) throw new Error("عضو پروژه نیستید");

  if (data.assignedToId) {
    const assignee = await prisma.projectMember.findFirst({ where: { projectId, userId: data.assignedToId } });
    if (!assignee) throw new Error("کاربر انتخاب‌ شده عضو پروژه نیست");
  }

  const created = await prisma.issue.create({
    data: {
      projectId,
      title: data.title,
      description: data.description ?? null,
      createdById: userId,
      assignedToId: data.assignedToId ?? null,
      priority: (data.priority as PrismaIssuePriority) ?? PrismaIssuePriority.MEDIUM,
    },
  });

  return toDTO(created);
}

export async function listProjectIssues(projectId: string): Promise<IssueDTO[]> {
  const rows = await prisma.issue.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toDTO);
}

export async function getIssue(issueId: string): Promise<IssueDTO | null> {
  const row = await prisma.issue.findUnique({ where: { id: issueId } });
  return row ? toDTO(row) : null;
}

export async function updateIssue(issueId: string, userId: string, patch: UpdateIssueRequest): Promise<IssueDTO> {
  const issue = await prisma.issue.findUnique({
    where: { id: issueId },
    include: { project: { include: { members: true } } },
  });
  if (!issue) throw new Error("ایشو یافت نشد");

  const membership = issue.project.members.find((m) => m.userId === userId);
  if (!membership) throw new Error("عضو پروژه نیستید");

  const isAdmin = membership.roleInProject === "ADMIN";
  const isCreator = issue.createdById === userId;

  const data: any = {};

  if (isAdmin) {
    if (patch.title !== undefined) data.title = patch.title;
    if (patch.description !== undefined) data.description = patch.description ?? null;
    if (patch.status !== undefined) data.status = patch.status as PrismaIssueStatus;
    if (patch.priority !== undefined) data.priority = patch.priority as PrismaIssuePriority;
    if (patch.assignedToId !== undefined) {
      if (patch.assignedToId) {
        const ok = issue.project.members.some((m) => m.userId === patch.assignedToId);
        if (!ok) throw new Error("کاربر انتخاب‌ شده عضو پروژه نیست");
      }
      data.assignedToId = patch.assignedToId;
    }
  } else {
    if ((patch.title !== undefined || patch.description !== undefined) && !isCreator) {
      throw new Error("اجازه ویرایش عنوان و توضیحات را ندارید");
    }
    if (patch.title !== undefined) data.title = patch.title;
    if (patch.description !== undefined) data.description = patch.description ?? null;

    if (patch.status !== undefined) data.status = patch.status as PrismaIssueStatus;
    if (patch.priority !== undefined) data.priority = patch.priority as PrismaIssuePriority;
    if (patch.assignedToId !== undefined) {
      if (patch.assignedToId) {
        const ok = issue.project.members.some((m) => m.userId === patch.assignedToId);
        if (!ok) throw new Error("کاربر انتخاب‌ شده عضو پروژه نیست");
      }
      data.assignedToId = patch.assignedToId;
    }
  }

  const updated = await prisma.issue.update({ where: { id: issueId }, data });
  return toDTO(updated);
}
