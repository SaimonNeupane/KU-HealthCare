import { useAuth } from "../../contexts/AuthContext";
import { useSocket } from "../../contexts/socketContext";
import { useEffect, useState } from "react";

// Notification item type
interface NotificationItem {
  id: number;
  icon: string;
  title: string;
  subtitle?: string;
  time: string;
  bgColor: string;
  iconColor: string;
}

export default function Notifications() {
  const socket = useSocket();
  const { role, user_id } = useAuth();

  // Dynamic notifications array
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // For generating unique IDs
  const [counter, setCounter] = useState(1);

  // Helper to get current time in "X min ago" format
  function getTimeAgo(date: Date) {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "just now";
    if (diffMins === 1) return "1 min ago";
    return `${diffMins} min ago`;
  }

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
          id: counter,
          icon: "report.svg",
          title: `Lab report arrived: ${patientName}`,
          subtitle: doctorName ? `Assigned to Dr. ${doctorName}` : undefined,
          time: getTimeAgo(new Date()),
          bgColor: "#BBF7D0",
          iconColor: "text-black-600",
        },
        ...prev,
      ]);
      setCounter((c) => c + 1);
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
          id: counter,
          icon: "patient.svg",
          title: `New patient registered: ${patientName}`,
          subtitle: patientId
            ? `Auto-assigned Patient ID: ${patientId}`
            : undefined,
          time: getTimeAgo(new Date()),
          bgColor: "#BBF7D0",
          iconColor: "text-black-600",
        },
        ...prev,
      ]);
      setCounter((c) => c + 1);
    }

    // Handler for Doctor Assigned (example)
    function handleDoctorAssigned({
      patientName,
      doctorName,
    }: {
      patientName: string;
      doctorName: string;
    }) {
      setNotifications((prev) => [
        {
          id: counter,
          icon: "bed.svg",
          title: `Doctor assigned to patient: ${patientName}`,
          subtitle: `Assigned to Dr. ${doctorName}`,
          time: getTimeAgo(new Date()),
          bgColor: "#BBF7D0",
          iconColor: "text-black-600",
        },
        ...prev,
      ]);
      setCounter((c) => c + 1);
    }

    socket.on("emit-lab-report-arrived", handleLabReportArrived);
    socket.on("emit-patient-registered", handlePatientRegistered);
    socket.on("emit-doctor-assigned", handleDoctorAssigned); // optional

    return () => {
      socket.off("emit-lab-report-arrived", handleLabReportArrived);
      socket.off("emit-patient-registered", handlePatientRegistered);
      socket.off("emit-doctor-assigned", handleDoctorAssigned);
    };
    // eslint-disable-next-line
  }, [socket, user_id, role, counter]);

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Notifications
      </h3>
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-gray-500 text-center py-6">No notifications</div>
        ) : (
          notifications.map((notification) => (
            <div key={notification.id} className="flex items-start gap-4">
              <div
                className={`p-2 rounded-full`}
                style={{ background: notification.bgColor }}
              >
                <img src={`/${notification.icon}`} alt="logo" />
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
              <span className="text-xs text-gray-400">{notification.time}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
