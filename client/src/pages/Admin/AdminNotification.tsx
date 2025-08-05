import { useAuth } from "../../contexts/AuthContext";
import { useSocket } from "../../contexts/socketContext";
import { useEffect, useState } from "react";
import { getNotificationsAPI, deleteNotificationAPI } from "../../utils/api";

// Backend notification item type (from API)
interface BackendNotification {
  notification_id: string;
  message: string;
  sender?: { username?: string };
  created_at: string;
}

// UI Notification item type for socket or transformed backend notifications
interface NotificationItem {
  id: string | number;
  icon: string;
  title: string;
  subtitle?: string;
  time: string;
  bgColor: string;
  iconColor: string;
  isRealtime?: boolean; // mark if this notification is from socket
}

export default function Notifications() {
  const socket = useSocket();
  const { role, user_id } = useAuth();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper to get current time in "X min ago" format
  function getTimeAgo(date: Date) {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "just now";
    if (diffMins === 1) return "1 min ago";
    return `${diffMins} min ago`;
  }

  // Fetch backend notifications
  useEffect(() => {
    if (!user_id) return;
    setLoading(true);
    getNotificationsAPI(user_id)
      .then((res) => {
        const backendNotifs: BackendNotification[] =
          res.data.notifications ?? [];
        // Choose icon based on message content
        const mapped = backendNotifs.map((n) => {
          let icon = "notification.svg";
          const msg = n.message?.toLowerCase() || "";
          if (msg.includes("lab report")) icon = "report.svg";
          else if (msg.includes("patient registered")) icon = "patient.svg";
          else if (msg.includes("doctor assigned")) icon = "bed.svg";
          // Add more conditions if needed

          return {
            id: n.notification_id,
            icon,
            title: n.message,
            subtitle: n.sender?.username
              ? `From: ${n.sender.username}`
              : undefined,
            time: getTimeAgo(new Date(n.created_at)),
            bgColor: "#BBF7D0",
            iconColor: "text-black-600",
          };
        });
        setNotifications(mapped);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user_id]);

  // Real-time updates from socket
  useEffect(() => {
    if (!socket || !user_id) return;

    socket.emit("join-room", { role, roomId: user_id });

    // Handler for Lab Report Arrived
    function handleLabReportArrived({
      patientName,
      patientId,
      doctorName,
    }: {
      patientName: string;
      patientId: string;
      doctorName?: string;
    }) {
      setNotifications((prev) => [
        {
          id: `lab-${Date.now()}`,
          icon: "report.svg",
          title: `Lab report arrived: ${patientName}`,
          subtitle: doctorName ? `Assigned to Dr. ${doctorName}` : undefined,
          time: getTimeAgo(new Date()),
          bgColor: "#BBF7D0",
          iconColor: "text-black-600",
          isRealtime: true,
        },
        ...prev,
      ]);
    }

    // Handler for Patient Registered
    function handlePatientRegistered({
      patientName,
      patientId,
      doctorName,
    }: {
      patientName: string;
      patientId?: string;
      doctorName?: string;
    }) {
      setNotifications((prev) => [
        {
          id: `pat-${Date.now()}`,
          icon: "patient.svg",
          title: `New patient registered: ${patientName}`,
          subtitle: patientId
            ? `Auto-assigned Patient ID: ${patientId}`
            : undefined,
          time: getTimeAgo(new Date()),
          bgColor: "#BBF7D0",
          iconColor: "text-black-600",
          isRealtime: true,
        },
        ...prev,
      ]);
    }

    // Handler for Doctor Assigned
    function handleDoctorAssigned({
      patientName,
      doctorName,
    }: {
      patientName: string;
      doctorName: string;
    }) {
      setNotifications((prev) => [
        {
          id: `doc-${Date.now()}`,
          icon: "bed.svg",
          title: `Doctor assigned to patient: ${patientName}`,
          subtitle: `Assigned to Dr. ${doctorName}`,
          time: getTimeAgo(new Date()),
          bgColor: "#BBF7D0",
          iconColor: "text-black-600",
          isRealtime: true,
        },
        ...prev,
      ]);
    }

    socket.on("emit-lab-report-arrived", handleLabReportArrived);
    socket.on("emit-patient-registered", handlePatientRegistered);
    socket.on("emit-doctor-assigned", handleDoctorAssigned);

    return () => {
      socket.off("emit-lab-report-arrived", handleLabReportArrived);
      socket.off("emit-patient-registered", handlePatientRegistered);
      socket.off("emit-doctor-assigned", handleDoctorAssigned);
    };
    // eslint-disable-next-line
  }, [socket, user_id, role]);

  // Delete notification handler (only works for backend notifications)
  function handleDelete(id: string | number, isRealtime?: boolean) {
    if (isRealtime) {
      // Remove from state only, not sent to backend
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } else {
      // Backend notification
      deleteNotificationAPI(id as string)
        .then(() => {
          setNotifications((prev) => prev.filter((n) => n.id !== id));
        })
        .catch((err) => {
          // Optionally show error
          console.error("Failed to delete notification", err);
        });
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Notifications
      </h3>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="text-gray-500 text-center py-6">
              No notifications
            </div>
          ) : (
            notifications.map((notification) => (
              <div key={notification.id} className="flex items-start gap-4">
                <div
                  className={`p-2 rounded-full`}
                  style={{ background: notification.bgColor }}
                >
                  <img
                    src={`/${notification.icon}`}
                    alt="logo"
                    onError={(e) => {
                      // fallback to a generic notification icon if missing
                      (e.target as HTMLImageElement).src = "/notification.svg";
                    }}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    {notification.title}
                  </p>
                  {notification.subtitle && (
                    <p className="text-xs text-gray-500">
                      {notification.subtitle}
                    </p>
                  )}
                </div>
                <span className="text-xs text-gray-400">
                  {notification.time}
                </span>
                <button
                  onClick={() =>
                    handleDelete(notification.id, notification.isRealtime)
                  }
                  className="text-red-500 text-xs ml-2"
                  title="Delete"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
