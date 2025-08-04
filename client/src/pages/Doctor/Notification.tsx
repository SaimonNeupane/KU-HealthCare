import React, { useEffect, useState } from "react";
import { FaUserPlus, FaClipboardList } from "react-icons/fa";
import { useSocket } from "../../contexts/socketContext";
import { LogOut } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router";

interface NotificationItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  timeAgo: string;
  onView: () => void;
}

type NotificationType =
  | {
      type: "patient-registered";
      patientName: string;
      patientId?: string;
      createdAt: Date;
    }
  | {
      type: "lab-report";
      patientName: string;
      patientId: string;
      createdAt: Date;
    };

const NotificationItem: React.FC<NotificationItemProps> = ({
  icon,
  title,
  subtitle,
  timeAgo,
  onView,
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-100 mb-3">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
          {icon}
        </div>
        <div>
          <h3 className="text-gray-900 font-medium">{title}</h3>
          {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-gray-400 text-sm">{timeAgo}</span>
        <button
          onClick={onView}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          View
        </button>
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

const Notification: React.FC = () => {
  const navigate = useNavigate();
  const socket = useSocket();
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  const { user_id, logout } = useAuth();

  useEffect(() => {
    if (!socket || !user_id) return;

    socket.emit("join-room", {
      roomId: user_id,
      role: "doctor",
    });

    // Optionally, join other relevant rooms here if needed

    // eslint-disable-next-line
  }, [socket, user_id]);

  useEffect(() => {
    if (!socket) return;

    // Handler for lab report arrived
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

    // Handler for patient registered
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
      console.log(patientId, patientName);
    };

    socket.on("emit-lab-report-arrived", handleLabReportArrived);
    socket.on("emit-patient-registered", handlePatientRegistered);

    return () => {
      socket.off("emit-lab-report-arrived", handleLabReportArrived);
      socket.off("emit-patient-registered", handlePatientRegistered);
    };
  }, [socket]);

  const handleView = (patientId?: string) => {
    if (patientId) {
      navigate(`../patient/${patientId}`);
    } else {
      // fallback, no patientId available
      navigate("../patients");
    }
  };

  // Sort notifications by newest first
  const sortedNotifications = [...notifications].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex:col justify-between ">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Notifications
            </h1>
            <LogOut onClick={logout} />
          </div>
          <div className="space-y-3">
            {sortedNotifications.length === 0 && (
              <div className="text-gray-500 text-center py-8">
                No notifications yet.
              </div>
            )}
            {sortedNotifications.map((notification, index) => {
              if (notification.type === "lab-report") {
                return (
                  <NotificationItem
                    key={`${notification.type}-${notification.patientId}-${index}`}
                    icon={<FaClipboardList className="w-6 h-6" />}
                    title={`Lab report arrived: ${notification.patientName}`}
                    subtitle={
                      notification.patientId
                        ? `Auto-assigned Patient ID: ${notification.patientId}`
                        : undefined
                    }
                    timeAgo={getRelativeTime(notification.createdAt)}
                    onView={() => handleView(notification.patientId)}
                  />
                );
              } else if (notification.type === "patient-registered") {
                return (
                  <NotificationItem
                    key={`${notification.type}-${notification.patientName}-${index}`}
                    icon={<FaUserPlus className="w-6 h-6" />}
                    title={`New patient registered: ${notification.patientName}`}
                    subtitle={
                      notification.patientId
                        ? `Auto-assigned Patient ID: ${notification.patientId}`
                        : undefined
                    }
                    timeAgo={getRelativeTime(notification.createdAt)}
                    onView={() => handleView(notification.patientId)}
                  />
                );
              }
              return null;
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Notification;
