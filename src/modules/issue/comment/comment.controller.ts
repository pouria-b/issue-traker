// Minimal Comment Controller
import { Request, Response } from "express";
import { createComment, updateOwnComment, deleteOwnComment } from "./comment.service";
import { ApiResponse, CreateCommentRequest, UpdateCommentRequest, CommentDTO } from "./comment.types";
import { AuthRequest } from "../../auth/auth.middleware";

function bad(res: Response, message: string, code = 400) {
  return res.status(code).json({ success: false, message } as ApiResponse);
}

export async function createCommentHandler(req: AuthRequest, res: Response<ApiResponse<CommentDTO>>) {
  try {
    const { issueId } = req.params as { issueId: string };
    const userId = req.user!.id;
    const { content, parentId } = (req.body || {}) as CreateCommentRequest;

    if (!content || !content.trim()) return bad(res, "متن کامنت الزامی است");

    const dto = await createComment(issueId, userId, content.trim(), parentId ?? null);
    return res.status(201).json({ success: true, message: "کامنت ایجاد شد", data: dto });
  } catch (e: any) {
    return bad(res, e?.message || "خطا در ایجاد کامنت");
  }
}

export async function updateCommentHandler(req: AuthRequest, res: Response<ApiResponse<CommentDTO>>) {
  try {
    const { commentId } = req.params as { commentId: string };
    const userId = req.user!.id;
    const { content } = (req.body || {}) as UpdateCommentRequest;

    if (!content || !content.trim()) return bad(res, "متن کامنت الزامی است");

    const dto = await updateOwnComment(commentId, userId, content.trim());
    return res.json({ success: true, message: "کامنت ویرایش شد", data: dto });
  } catch (e: any) {
    return bad(res, e?.message || "خطا در ویرایش کامنت");
  }
}

export async function deleteCommentHandler(req: AuthRequest, res: Response<ApiResponse>) {
  try {
    const { commentId } = req.params as { commentId: string };
    const userId = req.user!.id;
    await deleteOwnComment(commentId, userId);
    return res.json({ success: true, message: "کامنت حذف شد" });
  } catch (e: any) {
    return bad(res, e?.message || "خطا در حذف کامنت");
  }
}
