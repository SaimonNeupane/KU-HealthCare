import { Router } from "express";
import {
  getNotifications,
  deleteNotification,
} from "../controllers/notification/notificationController";

const router = Router();

// Get all notifications for a user
router.get("/:id", getNotifications);

// Delete a specific notification
router.delete("/:notificationId", deleteNotification);

export default router;
