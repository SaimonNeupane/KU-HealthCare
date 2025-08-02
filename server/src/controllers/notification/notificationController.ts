import { PrismaClient } from "@prisma/client";
import { Request, Response, RequestHandler } from "express";

const prisma = new PrismaClient();

// Get notifications for a user
export const getNotifications: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }

    const notifications = await prisma.notification.findMany({
      select: {
        notification_id: true,
        message: true,
        sender_user_id: true,
        created_at: true,
        sender: {
          select: {
            username: true,
          },
        },
      },
      where: {
        recipient_user_id: id,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({
      error: "Internal server error while fetching notifications",
    });
  }
};

// Delete a notification
export const deleteNotification: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { notificationId } = req.params;

    if (!notificationId) {
      res.status(400).json({ error: "Notification ID is required" });
      return;
    }

    const existingNotification = await prisma.notification.findUnique({
      where: {
        notification_id: notificationId,
      },
    });

    if (!existingNotification) {
      res.status(404).json({
        error: "Notification not found",
      });
      return;
    }

    await prisma.notification.delete({
      where: {
        notification_id: notificationId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({
      error: "Internal server error while deleting notification",
    });
  }
};
