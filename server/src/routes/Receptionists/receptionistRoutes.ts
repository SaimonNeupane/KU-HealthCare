import { Router} from "express";
import { DoctorDetails,PatientDetials,RegisterPatient,showDoctors } from "../../controllers/Receptionists/ReceptionistDeskController";
const router:Router= Router();

router.get('/dashboard',DoctorDetails)
router.get('/patient',PatientDetials)
router.post('/register', RegisterPatient)
router.get('/availableDocs/:dep_id',showDoctors)
export default router;

