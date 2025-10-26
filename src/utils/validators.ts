
import { z } from "zod";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const RegisterSchema = z.object({
  username: z
    .string()
    .min(5, "نام کاربری الزامی است و باید حداقل ۵ کاراکتر باشد")
    .refine(
      (val) => val.trim().length > 0,
      "نام کاربری الزامی است و باید حداقل ۵ کاراکتر باشد"
    ),
  email: z
    .string()
    .email("ایمیل معتبر الزامی است")
    .refine((val) => val.trim().length > 0, "ایمیل معتبر الزامی است"),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/,
      "رمز عبور ضعیف است"
    ),
});

export const LoginSchema = z.object({
  identifier: z.string().min(1, "شناسه الزامی است"),
  password: z.string().min(1, "رمز عبور الزامی است"),
});

export const normEmail = (email: string) => email.trim().toLowerCase();




// schema baraye comment
export const CreateCommentSchema = z.object({
  content: z
    .string()
    .min(1, "محتوای کامنت الزامی است")
    .max(500, "محتوای کامنت باید کمتر از ۵۰۰ کاراکتر باشد"),
});

export async function validateCreateComment(data: {
  content: string;
}): Promise<{ content?: string | null }> {
  try {
    CreateCommentSchema.parse(data);
    return { content: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { content: error.issues[0].message };
    }
    return { content: "خطا در اعتبارسنجی کامنت" };
  }
}

// schema baraye reply
export const CreateReplySchema = z.object({
  content: z
    .string()
    .min(1, "محتوای ریپلای الزامی است")
    .max(500, "محتوای ریپلای باید کمتر از ۵۰۰ کاراکتر باشد"),
});

export async function validateCreateReply(data: {
  content: string;
  commentId: string;
}): Promise<{ content?: string | null; commentId?: string | null }> {
  try {
    CreateReplySchema.parse({ content: data.content });
    z.string().uuid("شناسه کامنت نامعتبر است").parse(data.commentId);
    const comment = await prisma.comment.findUnique({
      where: { id: data.commentId },
    });
    if (!comment) return { commentId: "کامنت یافت نشد" };
    return { content: null, commentId: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues.reduce(
        (acc, issue) => ({ ...acc, [issue.path[0]]: issue.message }),
        {}
      );
    }
    return { commentId: "خطا در اعتبارسنجی ریپلای" };
  }
}

export async function validateCommentId(data: {
  commentId: string;
}): Promise<{ commentId?: string | null }> {
  try {
    z.string().uuid("شناسه کامنت نامعتبر است").parse(data.commentId);
    const comment = await prisma.comment.findUnique({
      where: { id: data.commentId },
    });
    if (!comment) return { commentId: "کامنت یافت نشد" };
    return { commentId: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { commentId: error.issues[0].message };
    }
    return { commentId: "خطا در اعتبارسنجی شناسه کامنت" };
  }
}

// validator baraye GET /issue/:id/comments
export async function validateGetissueComments(data: {
  issueID: string;
  page: number;
  limit: number;
}): Promise<{
  issueID?: string | null;
  page?: string | null;
  limit?: string | null;
}> {
  const schema = z.object({
    issueID: z.string().uuid("شناسه باگ‌ نامعتبر است"),
    page: z.number().int().min(1, "صفحه باید حداقل ۱ باشد"),
    limit: z
      .number()
      .int()
      .min(1, "حد باید حداقل ۱ باشد")
      .max(50, "حد حداکثر ۵۰ است"),
  });

  try {
    schema.parse(data);
    const issue = await prisma.issue.findUnique({ where: { id: data.issueID } });
    if (!issue) return { issueID: "باگ‌ یافت نشد" };
    return { issueID: null, page: null, limit: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues.reduce(
        (acc, issue) => ({ ...acc, [issue.path[0]]: issue.message }),
        {}
      );
    }
    return { issueID: "خطا در اعتبارسنجی" };
  }
}
