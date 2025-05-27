import React from "react";
import { FaUserMd, FaCalendarCheck, FaUserInjured, FaFlask, FaBed } from "react-icons/fa";

const dashboardData = [
  { title: "Patients", subtitle: "Total: 1245", icon: <FaUserInjured /> },
  { title: "Appointments", subtitle: "Upcoming: 320", icon: <FaCalendarCheck /> },
  { title: "Doctors", subtitle: "Active: 45", icon: <FaUserMd /> },
  { title: "Lab Reports", subtitle: "Pending: 12", icon: <FaFlask /> },
  { title: "Beds", subtitle: "23/45", icon: <FaBed /> },
];

const notifications = [
  {
    message: "New patient registered: John Doe",
    sub: "Auto-assigned Patient ID: 12345",
    time: "2 mins ago",
  },
  {
    message: "Doctor assigned to patient: Jane Smith",
    sub: "Assigned to Dr. Adams",
    time: "5 mins ago",
  },
  {
    message: "Lab report Arrived: Parichit Sen",
    sub: "Assigned to Dr. Adams",
    time: "20 mins ago",
  },
];

export default function Dashboard() {
  return (
    <div className="p-6 bg-[#F5F5F5] min-h-screen">
      <div className="bg-white p-6 rounded-2xl shadow">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-gray-500">Overview of hospital operations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {dashboardData.map((card, i) => (
            <div
              key={i}
              className="bg-gray-100 p-4 rounded-xl flex items-center gap-3 shadow hover:shadow-md transition"
            >
              <div className="text-2xl text-green-600">{card.icon}</div>
              <div>
                <div className="text-sm text-gray-700 font-semibold">{card.title}</div>
                <div className="text-xs text-gray-500">{card.subtitle}</div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Notifications</h2>
          <div className="space-y-3">
            {notifications.map((note, idx) => (
              <div
                key={idx}
                className="bg-green-50 border-l-4 border-green-400 p-4 rounded-md flex justify-between items-start"
              >
                <div>
                  <p className="text-sm font-medium text-green-800">{note.message}</p>
                  <p className="text-xs text-gray-600">{note.sub}</p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">{note.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
 