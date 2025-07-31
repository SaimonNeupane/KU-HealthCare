import { Router } from "express";
import {
  OnePatientForDiagnosis,
  PatientDetails,
  bedQuery,
  changeOnlineStatus,
  completeDiagnosis,
  labRequest,
} from "../controllers/Doctor/doctorController";

const router: Router = Router();
router.get("/patientdetails", PatientDetails);
router.post("/requestlab", labRequest);
router.post("/querybed/:id", bedQuery);
router.post("/completeDiagnosis/:id", completeDiagnosis);
router.post("/changeOnlineStatus/:d", changeOnlineStatus);
router.get("/onePatientForDiagnosis/:id", OnePatientForDiagnosis);

export default router;
