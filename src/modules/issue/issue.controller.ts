import { Response } from "express";
import { AuthRequest } from "../auth/auth.middleware";
import { ApiResponse, CreateIssueRequest, IssueDTO, UpdateIssueRequest } from "./issue.types";
import { createIssue, listProjectIssues, getIssue, updateIssue } from "./issue.service";

function bad(res: Response, message: string, code = 400) {
  return res.status(code).json({ success: false, message } as ApiResponse);
}

export async function createIssueHandler(req: AuthRequest, res: Response<ApiResponse<IssueDTO>>) {
  try {
    const { id: projectId } = req.params as { id: string };
    const userId = req.user!.id;
    const { title, description, priority, assignedToId } = (req.body || {}) as CreateIssueRequest;
    if (!title || !title.trim()) return bad(res, "عنوان الزامی است");

    const dto = await createIssue(projectId, userId, {
      title: title.trim(),
      description: (description ?? null),
      priority,
      assignedToId: assignedToId ?? null,
    });
    return res.status(201).json({ success: true, message: "ایشو ایجاد شد", data: dto });
  } catch (e: any) {
    return bad(res, e?.message || "خطا در ایجاد ایشو");
  }
}

export async function listIssuesHandler(req: AuthRequest, res: Response<ApiResponse<IssueDTO[]>>) {
  try {
    const { id: projectId } = req.params as { id: string };
    const rows = await listProjectIssues(projectId);
    return res.json({ success: true, message: "لیست ایشوها", data: rows });
  } catch (e: any) {
    return bad(res, e?.message || "خطا در دریافت ایشوها");
  }
}

export async function getIssueHandler(req: AuthRequest, res: Response<ApiResponse<IssueDTO>>) {
  try {
    const { issueId } = req.params as { issueId: string };
    const row = await getIssue(issueId);
    if (!row) return bad(res, "یافت نشد", 404);
    return res.json({ success: true, message: "دریافت شد", data: row });
  } catch (e: any) {
    return bad(res, e?.message || "خطا در دریافت ایشو");
  }
}

export async function updateIssueHandler(req: AuthRequest, res: Response<ApiResponse<IssueDTO>>) {
  try {
    const { issueId } = req.params as { issueId: string };
    const userId = req.user!.id;
    const patch = (req.body || {}) as UpdateIssueRequest;
    const dto = await updateIssue(issueId, userId, patch);
    return res.json({ success: true, message: "بروزرسانی شد", data: dto });
  } catch (e: any) {
    return bad(res, e?.message || "خطا در بروزرسانی ایشو");
  }
}
