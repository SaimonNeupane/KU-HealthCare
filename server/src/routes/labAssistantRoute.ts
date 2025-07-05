import { Router } from "express";
import { labReport } from "../controllers/labAssistantController";

const router: Router = Router();
router.get("/labreport", labReport);

export default router;
