import { Router } from "express";
import {
  OnePatientForDiagnosis,
  PatientDetails,
  bedQuery,
  changeOnlineStatus,
  completeDiagnosis,
  labRequest,
} from "../controllers/Doctor/doctorController";
import authorization from "../middleware/authorization";
import AuthenticateToken from "../middleware/authenticateToken";

const router: Router = Router();
router.get(
  "/patientdetails",
  AuthenticateToken,
  authorization(["doctor"]),
  PatientDetails
);
router.post("/requestlab", AuthenticateToken, labRequest);
router.post("/querybed/:id", bedQuery);
router.post("/completeDiagnosis/:id", completeDiagnosis);
router.post("/changeOnlineStatus/:d", changeOnlineStatus);
router.get("/onePatientForDiagnosis/:id", OnePatientForDiagnosis);

export default router;
