import { Router} from "express";
import { DoctorDetails } from "../../controllers/Receptionists/ReceptionistDeskController";
const router:Router= Router();

router.get('/dashboard',DoctorDetails)

export default router;