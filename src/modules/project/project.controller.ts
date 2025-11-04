import { Request, Response } from "express";
import { CreateProjectRequest, CreateProjectResponse, ProjectApiResponse, UserProjectsResponse } from "./project.types";
import { createProject, getProjectById, getUserProjects } from "./project.service";
import { AuthRequest } from "../auth/auth.middleware";

function badRequest(res: Response, message: string) {
  return res.status(400).json({ success: false, message });
}

export async function createProjectHandler(req: AuthRequest, res: Response<CreateProjectResponse>) {
  try {
    const userId = req.user!.id;
    const { name, description, members } = req.body as CreateProjectRequest;

    if (!name || !name.trim()) return badRequest(res, "نام پروژه الزامی است");

    const project = await createProject(userId, name.trim(), description ?? null, members);
    return res.status(201).json({
      success: true,
      message: "پروژه با موفقیت ایجاد شد",
      data: project,
    });
  } catch (error: any) {
    const msg = error?.message || "خطا در ایجاد پروژه";
    return res.status(500).json({ success: false, message: msg });
  }
}

export async function getProjectByIdHandler(req: Request, res: Response<ProjectApiResponse>) {
  try {
    const { projectId } = req.params as { projectId: string };
    const currentUserId = (req as AuthRequest).user?.id ?? null;

    if (!projectId) return badRequest(res, "شناسه پروژه الزامی است");

    const project = await getProjectById(projectId, currentUserId);
    if (!project) return res.status(404).json({ success: false, message: "پروژه یافت نشد" });

    return res.json({ success: true, message: "پروژه با موفقیت دریافت شد", data: project });
  } catch (error: any) {
    const msg = error?.message || "خطا در دریافت پروژه";
    return res.status(500).json({ success: false, message: msg });
  }
}

export async function getUserProjectsHandler(req: Request, res: Response<UserProjectsResponse>) {
  try {
    const { username } = req.params as { username: string };
    const currentUserId = (req as AuthRequest).user?.id ?? null;

    const page = parseInt((req.query.page as string) || "1", 10);
    const limit = parseInt((req.query.limit as string) || "10", 10);

    if (!username) return badRequest(res, "نام کاربری الزامی است");

    const result = await getUserProjects(username, currentUserId, page, limit);
    if (!result) return res.status(404).json({ success: false, message: "کاربر یافت نشد" });

    return res.json({
      success: true,
      message: "پروژه‌های کاربر با موفقیت دریافت شد",
      data: {
        user: result.user,
        projects: result.projects,
        meta: result.meta,
      },
    });
  } catch (error: any) {
    const msg = error?.message || "خطا در دریافت پروژه‌های کاربر";
    return res.status(500).json({ success: false, message: msg });
  }
}
