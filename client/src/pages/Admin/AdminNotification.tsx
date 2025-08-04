import { useAuth } from "../../contexts/AuthContext";
import { useSocket } from "../../contexts/socketContext";
import { useEffect, useState } from "react";

export default function Notifications() {
  const socket = useSocket();
  const [name, setName] = useState();
  const [patientId, setPatientId] = useState();
  const [name1, setName1] = useState();
  const [doctorName, setDoctorName] = useState();
  const { role, user_id } = useAuth();

  useEffect(() => {
    if (!socket) return;

    socket.emit("join-room", { role, roomId: user_id });

    socket.on(
      "emit-lab-report-arrived",
      async ({ patientName, patientId, doctorName }) => {
        setName(patientName);
        setPatientId(patientId);
        setDoctorName(doctorName);
      }
    );

    socket.on("emit-patient-registered", async ({ patientName }) => {
      setName1(patientName);
    });
  }, [socket]);

  const notifications = [
    {
      id: 1,
      icon: "patient.svg",
      title: `New patient registered: ${!!name1 ? name1 : "Jhon Doe"}`,
      subtitle: "Auto-assigned Patient ID: 12345",
      time: "2 min",
      bgColor: "#BBF7D0",
      iconColor: "text-black-600",
    },
    {
      id: 2,
      icon: "bed.svg",
      title: "Doctor assigned to patient: Jane Smith",
      subtitle: "Assigned to Dr. Adams",
      time: "5 min",
      bgColor: "#BBF7D0",
      iconColor: "text-black-600",
    },
    {
      id: 3,
      icon: "report.svg",
      title: `Lab report Arrived: ${!!name ? name : "parikchit"}`,
      subtitle: `Assigned to ${
        !!doctorName ? `Dr. ${doctorName}` : "Dr. Adams"
      }`,
      time: "20 min",
      bgColor: "#BBF7D0",
      iconColor: "text-black-600",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Notifications
      </h3>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div key={notification.id} className="flex items-start gap-4">
            <div
              className={`p-2 rounded-full  bg-[${notification.bgColor}] ${notification.iconColor}`}
            >
              <img src={`/${notification.icon}`} alt="logo" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">
                {notification.title}
              </p>
              <p className="text-xs text-gray-500">{notification.subtitle}</p>
            </div>
            <span className="text-xs text-gray-400">{notification.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
