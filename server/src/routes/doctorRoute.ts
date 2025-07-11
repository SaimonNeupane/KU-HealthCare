import { Router } from "express";
import { PatientDetails } from "../controllers/Doctor/doctorController";

const router: Router = Router();
router.get("/patientdetails", PatientDetails);

export default router;
