import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createComment(issueId: string, authorId: string, content: string, parentId?: string | null) {
  const issue = await prisma.issue.findUnique({
    where: { id: issueId },
    include: { project: { include: { members: true } } },
  });
  if (!issue) throw new Error("ایشو یافت نشد");

  const isMember = issue.project.members.some((m) => m.userId === authorId);
  if (!isMember) throw new Error("عضو پروژه نیستید");

  if (parentId) {
    const parent = await prisma.comment.findUnique({ where: { id: parentId } });
    if (!parent || parent.issueId !== issueId) throw new Error("parent نامعتبر");
  }

  const created = await prisma.comment.create({
    data: { issueId, authorId, content, parentId: parentId ?? null },
  });

  return {
    id: created.id,
    issueId: created.issueId,
    authorId: created.authorId,
    content: created.content,
    parentId: created.parentId,
    createdAt: created.createdAt.toISOString(),
  };
}

export async function updateOwnComment(commentId: string, userId: string, content: string) {
  const c = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!c) throw new Error("کامنت یافت نشد");
  if (c.authorId !== userId) throw new Error("اجازه ویرایش ندارید");

  const updated = await prisma.comment.update({ where: { id: commentId }, data: { content } });
  return {
    id: updated.id,
    issueId: updated.issueId,
    authorId: updated.authorId,
    content: updated.content,
    parentId: updated.parentId,
    createdAt: updated.createdAt.toISOString(),
  };
}

export async function deleteOwnComment(commentId: string, userId: string) {
  const c = await prisma.comment.findUnique({ where: { id: commentId }, include: { children: true } });
  if (!c) throw new Error("کامنت یافت نشد");
  if (c.authorId !== userId) throw new Error("اجازه حذف ندارید");
  if (c.children.length > 0) throw new Error("این کامنت پاسخ دارد؛ ابتدا پاسخ‌ها را حذف کنید");

  await prisma.comment.delete({ where: { id: commentId } });
  return true;
}
