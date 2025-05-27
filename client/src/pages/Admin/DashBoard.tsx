import StatsCards from '../../components/DashBoard/Statcard';
import AdminNotification from '../../components/DashBoard/AdminNotification';

export default function DashBoard() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
      <h3 style={{ color: '#6C6C6C' }}>Overview of hospital operations</h3>

      {/* Test each component one by one */}
      <div>Testing StatsCards:</div>
      <StatsCards />
      
      {/* Comment out AdminNotification for now */}
      {/* <AdminNotification /> */}
    </div>
  );
}