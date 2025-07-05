import { Request,Response,NextFunction, Router } from "express";
import { check } from "../controllers/labAssistantController";

const router:Router=Router();

router.get('/assist',check)
export default router