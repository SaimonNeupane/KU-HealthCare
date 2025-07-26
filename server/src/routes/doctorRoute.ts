import { Router } from "express";
import { PatientDetails,bedQuery,labRequest } from "../controllers/Doctor/doctorController";

const router: Router = Router();
router.get("/patientdetails", PatientDetails);
router.post('/requestlab',labRequest)
router.post('/querybed/:id',bedQuery)

export default router;
