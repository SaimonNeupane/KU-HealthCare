import { NavLink } from "react-router-dom";
import {
  Home,
  Users,
  CalendarDays,
  Stethoscope,
  ClipboardList,
  UserCircle2,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-full min-h-screen bg-white shadow-md p-6 flex flex-col">

      {/* Admin Profile Section */}
      <div className="flex items-center gap-3 mb-10">
        <UserCircle2 className="w-10 h-10 text-gray-500" />
        <div>
          <p className="text-sm font-medium text-gray-800">Admin's Name</p>
          <p className="text-xs text-gray-500">Administrator</p>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex flex-col gap-2">
        <NavItem to="/admin/dashboard" icon={<Home className="w-4 h-4" />} label="Dashboard" />
        <NavItem to="/admin/doctors" icon={<Stethoscope className="w-4 h-4" />} label="Doctors" />
        <NavItem to="/admin/appointments" icon={<CalendarDays className="w-4 h-4" />} label="Appointments" />
        <NavItem to="/admin/patients" icon={<Users className="w-4 h-4" />} label="Patients" />
        <NavItem to="/admin/receptionists" icon={<ClipboardList className="w-4 h-4" />} label="Receptionists" />
      </nav>
    </aside>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-full transition-all duration-200 text-sm font-medium
        ${isActive 
          ? "bg-green-800 text-white"
          : "text-gray-800 hover:bg-green-900 hover:text-white"
        }`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}