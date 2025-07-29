import { Router } from "express";
import { appointments, dashboard, doctorData, patients, receptionists } from "../controllers/admin/adminController";


const router= Router();

router.get("/dodDetails",doctorData)
router.get("/dashboard",dashboard)
router.get("/appointments",appointments)
router.get("/patients",patients)
router.get("/receptionists",receptionists)


export default router
