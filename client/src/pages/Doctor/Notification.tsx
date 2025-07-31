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
  const navigate = useNavigate();
  const socket = useSocket();
  const [name, setName] = useState();
  const [patientId, setPatientId] = useState(); // Add state for patient ID

  const handleView = (userId: string) => {
    // Remove "doctor/" prefix since you're already inside the doctor routes
    navigate(`../patient/${userId}`);
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("lab-report-arrived", async ({ patientName, patientId }) => {
      setName(patientName);
      setPatientId(patientId); // Store the actual patient ID from backend
      console.log(patientName, patientId);
    });
  }, [socket]);

  const { logout } = useAuth();

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
            {!!name ? (
              <NotificationItem
                icon={<FaUserPlus className="w-6 h-6" />}
                title={`New patient appointed: ${name}`}
                subtitle="Auto-assigned Patient ID: 12345"
                timeAgo="2 mins ago"
                onView={() => handleView(patientId || "12345")} // Use actual patient ID
              />
            ) : (
              <div />
            )}

            <NotificationItem
              icon={<FaClipboardList className="w-6 h-6" />}
              title="Lab report Arrived: Parikchit Sen"
              timeAgo="20 mins ago"
              onView={() => handleView("userid")} // Replace with actual patient ID when available
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Notification;
