import { FaUser, FaUserMd, FaFileAlt } from "react-icons/fa";

export default function Notifications() {
  const notifications = [
    {
      id: 1,
      icon: <FaUser />,
      title: "New patient registered: John Doe",
      subtitle: "Auto-assigned Patient ID: 12345",
      time: "2 min",
      bgColor: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      id: 2,
      icon: <FaUserMd />,
      title: "Doctor assigned to patient: Jane Smith",
      subtitle: "Assigned to Dr. Adams",
      time: "5 min",
      bgColor: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      id: 3,
      icon: <FaFileAlt />,
      title: "Lab report Arrived: Parikchit Sen",
      subtitle: "Assigned to Dr. Adams",
      time: "20 min",
      bgColor: "bg-green-100",
      iconColor: "text-green-600"
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Notifications</h3>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div key={notification.id} className="flex items-start gap-4">
            <div className={`p-2 rounded-full ${notification.bgColor} ${notification.iconColor}`}>
              {notification.icon}
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