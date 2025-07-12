import { Request, Response, NextFunction, Router } from "express";
import { login } from "../controllers/loginController";

const router: Router = Router();

router.post("/login", login);

export default router;
