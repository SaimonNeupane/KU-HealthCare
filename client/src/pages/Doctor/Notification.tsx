import React, { useEffect, useState } from "react";
import {
  FaUserPlus,
  FaClipboardList,
  FaBell,
  FaCog,
  FaUser,
} from "react-icons/fa";
import { useSocket } from "../../contexts/socketContext";

interface NotificationItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  timeAgo: string;
  onView: () => void;
}

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

const Notification: React.FC = () => {
  const socket = useSocket();
  const [name, setName] = useState();
  const handleView = (notification: string) => {
    console.log(`Viewing ${notification}`);
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("lab-report-arrived", async ({ patientName }) => {
      setName(patientName);
      console.log(patientName);
    });
  }, [socket]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">KU</span>
            </div>
            <span className="text-gray-900 font-semibold text-lg">
              KU HealthCare
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 cursor-pointer">
              <FaBell className="w-5 h-5" />
              <span className="font-medium">Notifications</span>
            </div>

            <div className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 cursor-pointer">
              <FaUser className="w-5 h-5" />
              <span className="font-medium">My patients</span>
            </div>

            <button className="p-2 text-gray-600 hover:text-gray-900">
              <FaCog className="w-5 h-5" />
            </button>

            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face"
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Notifications
          </h1>

          <div className="space-y-3">
            {!!name ? (
              <NotificationItem
                icon={<FaUserPlus className="w-6 h-6" />}
                title={`New patient appointed: ${name}`}
                subtitle="Auto-assigned Patient ID: 12345"
                timeAgo="2 mins ago"
                onView={() => handleView("John Doe appointment")}
              />
            ) : (
              <div />
            )}

            <NotificationItem
              icon={<FaClipboardList className="w-6 h-6" />}
              title="Lab report Arrived: Parikchit Sen"
              timeAgo="20 mins ago"
              onView={() => handleView("Parikchit Sen lab report")}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Notification;
