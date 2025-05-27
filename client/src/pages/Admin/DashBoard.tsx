import React from 'react';


import StatsCards from '../../components/DashBoard/Statcard';
import AdminNotification from '../../components/DashBoard/AdminNotification';

export default function Dashboard() {
  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <StatsCards />
      <div className="mt-6">
        <AdminNotification />
      </div>
    </>
  );
}
