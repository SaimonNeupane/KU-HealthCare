import { Router} from "express";
import { DoctorDetails,PatientDetials } from "../../controllers/Receptionists/ReceptionistDeskController";
const router:Router= Router();

router.get('/dashboard',DoctorDetails)
router.get('/patient',PatientDetials)
export default router;