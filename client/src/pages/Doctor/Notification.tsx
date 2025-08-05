import React, { useEffect, useState } from "react";
import { FaUserPlus, FaClipboardList } from "react-icons/fa";
import { useSocket } from "../../contexts/socketContext";
import { LogOut } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router";
import { deleteNotificationAPI, getNotificationsAPI } from "../../utils/api";

interface NotificationItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  timeAgo: string;
  onView: () => void;
  onDelete: () => void;
  canDelete: boolean;
}

type NotificationType =
  | {
      type: "patient-registered";
      patientName: string;
      patientId?: string;
      createdAt: Date;
      backendId?: string;
    }
  | {
      type: "lab-report";
      patientName: string;
      patientId: string;
      createdAt: Date;
      backendId?: string;
    }
  | {
      type: "doctor-assigned";
      patientName: string;
      doctorName: string;
      createdAt: Date;
      backendId?: string;
    };

// Type guard for notifications with patientId
function hasPatientId(
  notification: NotificationType
): notification is Extract<
  NotificationType,
  { patientId: string | undefined }
> {
  return (
    notification.type === "lab-report" ||
    notification.type === "patient-registered"
  );
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  icon,
  title,
  subtitle,
  timeAgo,
  onView,
  onDelete,
  canDelete,
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-100 mb-3">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
          {icon}
        </div>
        <div>
          <h3 className="text-gray-900 font-medium cursor-pointer hover:text-blue-800 hover:underline">
            {title}
          </h3>
          {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-gray-400 text-sm">{timeAgo}</span>
        <button
          onClick={onView}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
        >
          View
        </button>
        {canDelete && (
          <button
            onClick={onDelete}
            className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors cursor-pointer"
            title="Delete"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // in seconds

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
  return date.toLocaleDateString();
}

function getNotificationIcon(type: string, message?: string) {
  if (
    type === "lab-report" ||
    (message?.toLowerCase().includes("lab report") ?? false)
  ) {
    return <FaClipboardList className="w-6 h-6" />;
  } else if (
    type === "patient-registered" ||
    (message?.toLowerCase().includes("patient registered") ?? false)
  ) {
    return <FaUserPlus className="w-6 h-6" />;
  } else if (
    type === "doctor-assigned" ||
    (message?.toLowerCase().includes("doctor assigned") ?? false)
  ) {
    return (
      <span role="img" aria-label="doctor">
        🩺
      </span>
    );
  }
  return <FaClipboardList className="w-6 h-6" />;
}

const Notification: React.FC = () => {
  const navigate = useNavigate();
  const socket = useSocket();
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const { user_id, logout } = useAuth();

  // Fetch notifications from backend on mount
  useEffect(() => {
    if (!user_id) return;
    getNotificationsAPI(user_id)
      .then((res) => {
        console.log(res.data);

        const backendNotifs = res.data.notifications ?? [];
        const mapped: NotificationType[] = backendNotifs.map((n: any) => {
          let type: NotificationType["type"] = "lab-report";
          const msg = n.message?.toLowerCase() || "";
          if (msg.includes("lab report")) type = "lab-report";
          else if (msg.includes("patient registered"))
            type = "patient-registered";
          else if (msg.includes("doctor assigned")) type = "doctor-assigned";

          // Always use n.userUser_id for patientId!
          if (type === "lab-report" || type === "patient-registered") {
            let patientName = n.message;
            // Try to extract patient name from the message if available
            const match =
              n.message.match(/lab report arrived (.+)/i) ||
              n.message.match(/patient registered (.+)/i);
            if (match && match[1]) patientName = match[1].trim();

            return {
              type,
              patientName,
              patientId: n.userUser_id, // <-- THIS IS THE PATIENT ID
              createdAt: new Date(n.created_at),
              backendId: n.notification_id,
            };
          } else if (type === "doctor-assigned") {
            return {
              type,
              patientName: n.message,
              doctorName: n.sender?.username ?? "",
              createdAt: new Date(n.created_at),
              backendId: n.notification_id,
            };
          }
          return {
            type: "lab-report",
            patientName: n.message,
            patientId: n.userUser_id,
            createdAt: new Date(n.created_at),
            backendId: n.notification_id,
          };
        });
        setNotifications(mapped); // <-- FIXED: Replace (prev) => [...mapped, ...prev] with mapped
      })
      .catch((err) => {
        console.error("Failed to fetch notifications", err);
      });
  }, [user_id]);

  // Real-time notifications from socket
  useEffect(() => {
    if (!socket || !user_id) return;

    socket.emit("join-room", {
      roomId: user_id,
      role: "doctor",
    });

    const handleLabReportArrived = ({
      patientName,
      patientId,
    }: {
      patientName: string;
      patientId: string;
    }) => {
      setNotifications((prev) => [
        ...prev,
        {
          type: "lab-report",
          patientName,
          patientId,
          createdAt: new Date(),
        },
      ]);
    };

    const handlePatientRegistered = ({
      patientName,
      patientId,
    }: {
      patientName: string;
      patientId?: string;
    }) => {
      setNotifications((prev) => [
        ...prev,
        {
          type: "patient-registered",
          patientName,
          patientId,
          createdAt: new Date(),
        },
      ]);
    };

    const handleDoctorAssigned = ({
      patientName,
      doctorName,
    }: {
      patientName: string;
      doctorName: string;
    }) => {
      setNotifications((prev) => [
        ...prev,
        {
          type: "doctor-assigned",
          patientName,
          doctorName,
          createdAt: new Date(),
        },
      ]);
    };

    socket.on("emit-lab-report-arrived", handleLabReportArrived);
    socket.on("emit-patient-registered", handlePatientRegistered);
    socket.on("emit-doctor-assigned", handleDoctorAssigned);

    return () => {
      socket.off("emit-lab-report-arrived", handleLabReportArrived);
      socket.off("emit-patient-registered", handlePatientRegistered);
      socket.off("emit-doctor-assigned", handleDoctorAssigned);
    };
  }, [socket, user_id]);

  // This is the ONLY place that handles "View"
  const handleView = (patientId?: string) => {
    if (patientId) {
      navigate(`../patient/${patientId}`);
    } else {
      // fallback, no patientId available
      navigate("../patients");
    }
  };

  const handleDelete = (backendId?: string) => {
    if (!backendId) return;
    deleteNotificationAPI(backendId)
      .then(() => {
        setNotifications((prev) =>
          prev.filter((n) => n.backendId !== backendId)
        );
      })
      .catch((err) => {
        console.error("Failed to delete notification", err);
      });
  };

  const sortedNotifications = [...notifications].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex:col justify-between ">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Notifications
            </h1>
            <LogOut onClick={logout} className="cursor-pointer" />
          </div>
          <div className="space-y-3">
            {sortedNotifications.length === 0 && (
              <div className="text-gray-500 text-center py-8">
                No notifications yet.
              </div>
            )}
            {sortedNotifications.map((notification, index) => {
              let icon = getNotificationIcon(notification.type);
              let title = "";
              let subtitle: string | undefined = undefined;
              let canDelete = !!notification.backendId;

              if (notification.type === "lab-report") {
                title = `Lab report arrived: ${notification.patientName}`;
                subtitle = notification.patientId
                  ? `Auto-assigned Patient ID: ${notification.patientId}`
                  : undefined;
              } else if (notification.type === "patient-registered") {
                title = `New patient registered: ${notification.patientName}`;
                subtitle = notification.patientId
                  ? `Auto-assigned Patient ID: ${notification.patientId}`
                  : undefined;
              } else if (notification.type === "doctor-assigned") {
                title = `Doctor assigned to patient: ${notification.patientName}`;
                subtitle = (notification as any).doctorName
                  ? `Assigned to Dr. ${(notification as any).doctorName}`
                  : undefined;
              }

              return (
                <NotificationItem
                  key={
                    notification.backendId ||
                    `${notification.type}-${notification.patientName}-${index}`
                  }
                  icon={icon}
                  title={title}
                  subtitle={subtitle}
                  timeAgo={getRelativeTime(notification.createdAt)}
                  onView={() =>
                    handleView(
                      hasPatientId(notification)
                        ? notification.patientId
                        : undefined
                    )
                  }
                  onDelete={() => handleDelete(notification.backendId)}
                  canDelete={canDelete}
                />
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Notification;
