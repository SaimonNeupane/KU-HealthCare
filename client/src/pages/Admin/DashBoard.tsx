import StatsCards from '../../components/DashBoard/Statcard';
import AdminNotification from '../../components/DashBoard/AdminNotification';

export default function AdminDashboard() {
  return (
    <div className="w-full bg-gray-50 min-h-screen p-6">
      {/* Page Header */}
      <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
      <h3 style={{ color: '#6C6C6C' }}>Overview of hospital operations</h3>

      {/* Stats Cards */}
      <StatsCards />

      {/* Notifications */}
      <div>
        <AdminNotification />
      </div>
    </div>
  );
}
