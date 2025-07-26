import { Router } from "express";
import { PatientDetails,labRequest } from "../controllers/Doctor/doctorController";

const router: Router = Router();
router.get("/patientdetails", PatientDetails);
router.post('/requestlab',labRequest)

export default router;
