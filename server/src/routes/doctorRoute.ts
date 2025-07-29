import { Router } from "express";
import { PatientDetails,bedQuery,changeOnlineStatus,completeDiagnosis,labRequest } from "../controllers/Doctor/doctorController";

const router: Router = Router();
router.get("/patientdetails", PatientDetails);
router.post('/requestlab',labRequest)
router.post('/querybed/:id',bedQuery)
router.post('/completeDiagnosis/:id',completeDiagnosis)
router.post('/changeOnlineStatus/:d',changeOnlineStatus)

export default router;
