import { Request, Response, NextFunction, Router } from "express";
import { login } from "../controllers/loginController";
import { getUserInfo } from "../controllers/getUserInfo";
import AuthenticateToken from "../middleware/authenticateToken";
import AsyncError from "../Errors/asyncError";

const router: Router = Router();

router.post("/login", login);
router.get("/getinfo", AuthenticateToken, AsyncError(getUserInfo));

export default router;
