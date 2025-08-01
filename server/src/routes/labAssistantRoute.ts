import { Router } from "express";
import { labReport, labStatus } from "../controllers/labAssistantController";

const router: Router = Router();
router.get("/labreport", labReport);
router.patch("/labreport/status/:id", labStatus);

export default router;
