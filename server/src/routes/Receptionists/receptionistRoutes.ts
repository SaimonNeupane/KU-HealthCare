import { Router } from "express";
import {
  DoctorDetails,
  PatientDetials,
} from "../../controllers/Receptionists/ReceptionistDeskController";
const router: Router = Router();

router.get("/doctor", DoctorDetails);
router.get("/patient", PatientDetials);
export default router;
