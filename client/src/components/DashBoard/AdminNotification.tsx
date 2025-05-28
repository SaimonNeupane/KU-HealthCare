import {  FaUserMd, FaFileAlt } from "react-icons/fa";
import { IoManOutline } from "react-icons/io5";


export default function Notifications() {
  const notifications = [
    {
      id: 1,
      icon: 'patient.svg',
      title: "New patient registered: John Doe",
      subtitle: "Auto-assigned Patient ID: 12345",
      time: "2 min",
      bgColor: '#BBF7D0',
      iconColor: "text-black-600"
    },
    {
      id: 2,
      icon: 'bed.svg',
      title: "Doctor assigned to patient: Jane Smith",
      subtitle: "Assigned to Dr. Adams",
      time: "5 min",
      bgColor: '#BBF7D0',
      iconColor: "text-black-600"
    },
    {
      id: 3,
      icon: 'report.svg',
      title: "Lab report Arrived: Parikchit Sen",
      subtitle: "Assigned to Dr. Adams",
      time: "20 min",
      bgColor: '#BBF7D0',
      iconColor: "text-black-600"
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Notifications</h3>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div key={notification.id} className="flex items-start gap-4">
            <div className={`p-2 rounded-full  bg-[${notification.bgColor}] ${notification.iconColor}`}>
              <img src={`/${notification.icon}`} alt="logo" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">{notification.title}</p>
              <p className="text-xs text-gray-500">{notification.subtitle}</p>
            </div>
            <span className="text-xs text-gray-400">{notification.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}