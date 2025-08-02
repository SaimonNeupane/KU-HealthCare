import { Router } from "express";
import {
  appointments,
  createDoctor,
  createLabAssistant,
  createReceptionist,
  dashboard,
  deleteLabAssistant,
  deleteReceptionist,
  doctorData,
  labAssistants,
  patients,
  receptionists,
  updateDoctor,
  updateLabAssistant,
  updateReceptionist,
} from "../controllers/admin/adminController";

const router = Router();

// GET routes
router.get("/docDetails", doctorData);
router.get("/dashboard", dashboard);
router.get("/appointments", appointments);
router.get("/patients", patients);
router.get("/receptionists", receptionists);
router.get("/labassistant", labAssistants);

// POST routes (Create)
router.post("/create/doctor", createDoctor);
router.post("/create/recep", createReceptionist);
router.post("/create/lab", createLabAssistant);

// PATCH routes (Update)
router.patch("/update/doctor/:id", updateDoctor);
router.patch("/update/recep/:id", updateReceptionist);
router.patch("/update/lab/:id", updateLabAssistant);

// DELETE routes
router.delete("/delete/recep/:id", deleteReceptionist);
router.delete("/delete/lab/:id", deleteLabAssistant);

export default router;
