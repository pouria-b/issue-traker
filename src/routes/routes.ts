import { Router } from "express";
import { login, register } from "../modules/auth/auth.controller";
// import { auth } from "../modules/auth/auth.middleware";
const router = Router();

// مسیرهای احراز هویت
router.post("/register", register);
router.post("/login", login);

export default router;