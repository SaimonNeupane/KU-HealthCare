import StatsCards from "./Statcard";
import AdminNotification from "./AdminNotification";
import { LuLogOut } from "react-icons/lu";
import { useAuth } from "../../contexts/AuthContext";

export default function AdminDashboard() {
  const { logout } = useAuth();

  return (
    <div className="w-full bg-gray-50 min-h-screen p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
          <h3 style={{ color: "#6C6C6C" }}>Overview of hospital operations</h3>
        </div>
        <button
          className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
          onClick={logout}
          title="Logout"
        >
          <LuLogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Notifications */}
      <div>
        <AdminNotification />
      </div>
    </div>
  );
}
