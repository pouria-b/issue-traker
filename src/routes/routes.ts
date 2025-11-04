import { Router } from "express";
import { login, Signup, refreshHandler } from "../modules/auth/auth.controller";
import { auth } from "../modules/auth/auth.middleware";

import {  createProjectHandler, getProjectByIdHandler, getUserProjectsHandler,}from "../modules/project/project.controller";

import { createIssueHandler, listIssuesHandler, getIssueHandler, updateIssueHandler } from "../modules/issue/issue.controller";
const router = Router();

// مسیرهای احراز هویت
router.post("/signup", Signup);
router.post("/login", login);
router.post("/refresh", refreshHandler);


router.post("/createProject", auth, createProjectHandler);
// router.get("/:projectId", getProjectByIdHandler);
// router.get("/user/:username", getUserProjectsHandler);


router.post("/createIssue", auth, createIssueHandler);
router.get("/project/:projectId", auth, listIssuesHandler);
router.get("/:issueId", auth, getIssueHandler);
router.put("/:issueId", auth, updateIssueHandler);

export default router;
