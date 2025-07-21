import { Router} from "express";
import { DoctorDetails,PatientDetials,RegisterPatient } from "../../controllers/Receptionists/ReceptionistDeskController";
const router:Router= Router();

router.get('/dashboard',DoctorDetails)
router.get('/patient',PatientDetials)
router.post('/register', RegisterPatient)
export default router;