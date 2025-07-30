import { Router } from "express";
import {
  appointments,
  createDoctor,
  createReceptionist,
  dashboard,
  deleteDoctor,
  deleteReceptionist,
  doctorData,
  patients,
  receptionists,
  updateDoctor,
  updateReceptionist,
} from "../controllers/admin/adminController";

const router = Router();

router.get("/docDetails", doctorData);
router.get("/dashboard", dashboard);
router.get("/appointments", appointments);
router.get("/patients", patients);
router.get("/receptionists", receptionists);
router.post("/createDoctor", createDoctor);
router.post("/updateDoctor", updateDoctor);
router.delete("/doctor/:id", deleteDoctor);
router.post("/createReceptionist", createReceptionist);
router.delete("/receptionist/:id", deleteReceptionist);
router.post("/updateReceptionist/:id", updateReceptionist);

export default router;
