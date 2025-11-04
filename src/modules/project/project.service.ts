import { PrismaClient, ProjectRole } from "@prisma/client";
import { PageMeta, ProjectDTO } from "./project.types";

const prisma = new PrismaClient();

function toProjectDTO(project: any, currentUserId?: string | null): ProjectDTO {
  const adminMembers = (project.members ?? []).filter((m: any) => m.roleInProject === "ADMIN");
  const ownerMember = adminMembers[0] ?? project.members[0];
  const ownerUser = ownerMember?.user;

  const isOwner = !!currentUserId && (project.members ?? []).some(
    (m: any) => m.userId === currentUserId && m.roleInProject === "ADMIN"
  );

  return {
    id: project.id,
    name: project.name,
    description: project.description ?? null,
    createdAt: project.createdAt.toISOString(),
    user: ownerUser
      ? {
          id: ownerUser.id,
          username: ownerUser.username,
          firstname: ownerUser.firstname,
          lastname: ownerUser.lastname,
        }
      : { id: "", username: "", firstname: null, lastname: null },
    isOwner,
    members: (project.members ?? []).map((m: any) => ({
      userId: m.userId,
      username: m.user.username,
      roleInProject: m.roleInProject,
    })),
    issues: (project.issues ?? []).map((i: any) => ({
      id: i.id,
      title: i.title,
      status: i.status,
      priority: i.priority,
    })),
  };
}

export async function createProject(
  creatorUserId: string,
  name: string,
  description?: string | null,
  memberIds?: string[]
): Promise<ProjectDTO> {
  const creator = await prisma.user.findUnique({ where: { id: creatorUserId } });
  if (!creator) throw new Error("کاربر معتبر نیست");

  const uniqueMemberIds = Array.from(new Set((memberIds ?? []).filter((id) => id && id !== creatorUserId)));

  const project = await prisma.project.create({
    data: {
      name,
      description: description ?? null,
      members: {
        create: [
          { userId: creatorUserId, roleInProject: ProjectRole.ADMIN },
          ...uniqueMemberIds.map((uid) => ({ userId: uid, roleInProject: ProjectRole.MEMBER })),
        ],
      },
    },
    include: {
      members: { include: { user: true } },
      issues: true,
    },
  });

  return toProjectDTO(project, creatorUserId);
}

export async function getProjectById(projectId: string, currentUserId?: string | null): Promise<ProjectDTO | null> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      members: { include: { user: true } },
      issues: true,
    },
  });
  if (!project) return null;
  return toProjectDTO(project, currentUserId);
}

export async function getUserProjects(
  username: string,
  currentUserId?: string | null,
  page: number = 1,
  limit: number = 10
): Promise<{ user: any; projects: ProjectDTO[]; meta: PageMeta } | null> {
  const user = await prisma.user.findUnique({
    where: { username },
  });
  if (!user) return null;

  const skip = (page - 1) * limit;

  const baseWhere = {
    members: {
      some: { userId: user.id, roleInProject: "ADMIN" as const },
    },
  };

  const [total, rows] = await Promise.all([
    prisma.project.count({ where: baseWhere }),
    prisma.project.findMany({
      where: baseWhere,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        members: { include: { user: true } },
        issues: true,
      },
    }),
  ]);

  const projects = rows.map((p) => toProjectDTO(p, currentUserId));
  const meta: PageMeta = {
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };

  return {
    user: {
      id: user.id,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
    },
    projects,
    meta,
  };
}
