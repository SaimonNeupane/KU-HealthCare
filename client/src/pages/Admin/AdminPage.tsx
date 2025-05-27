import React from "react";

import Sidebar from "../../components/Sidebar/Sidebar"
import AdminNotification from "../../components/DashBoard/AdminNotification";
import StatsCards from "../../components/DashBoard/Statcard";

const AdminPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        
        {/* Stats Cards Section */}
        <StatsCards />

        {/* Notifications Section */}
        <div className="mt-6">
          <AdminNotification />
        </div>
      </main>
    </div>
  );
};

export default AdminPage;