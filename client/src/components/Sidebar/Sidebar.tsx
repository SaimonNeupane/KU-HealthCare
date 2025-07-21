import { NavLink } from "react-router-dom";
import {
  Home,
  Users,
  CalendarDays,
  Stethoscope,
  ClipboardList,
  UserCircle2,
  Bell,
  FileText,
  UserPlus,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

type SidebarVariant = "admin" | "doctor" | "labassistant" | "receptionist";

interface SidebarProps {
  variant: SidebarVariant;
  userName?: string;
}

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const sidebarConfig: Record<
  SidebarVariant,
  {
    title: string;
    role: string;
    navItems: NavItem[];
  }
> = {
  admin: {
    title: "Admin",
    role: "Administrator",
    navItems: [
      {
        to: "/admin/dashboard",
        icon: <Home className="w-4 h-4" />,
        label: "Dashboard",
      },
      {
        to: "/admin/doctors",
        icon: <Stethoscope className="w-4 h-4" />,
        label: "Doctors",
      },
      {
        to: "/admin/appointments",
        icon: <CalendarDays className="w-4 h-4" />,
        label: "Appointments",
      },
      {
        to: "/admin/patients",
        icon: <Users className="w-4 h-4" />,
        label: "Patients",
      },
      {
        to: "/admin/receptionists",
        icon: <ClipboardList className="w-4 h-4" />,
        label: "Receptionists",
      },
    ],
  },
  doctor: {
    title: "Doctor's Name",
    role: "Doctor",
    navItems: [
      {
        to: "/doctor/mypatients",
        icon: <Users className="w-4 h-4" />,
        label: "My Patients",
      },
      {
        to: "/doctor/notification",
        icon: <Bell className="w-4 h-4" />,
        label: "Notifications",
      },
    ],
  },
  labassistant: {
    title: "Lab Assistant's Name",
    role: "Lab Assistant",
    navItems: [
      {
        to: "/labassistant/dashboard",
        icon: <Home className="w-4 h-4" />,
        label: "Dashboard",
      },
      {
        to: "/labassistant/labreports",
        icon: <FileText className="w-4 h-4" />,
        label: "Lab Reports",
      },
    ],
  },
  receptionist: {
    title: "Receptionist's Name",
    role: "Receptionist",
    navItems: [
      {
        to: "/receptionist/dashboard",
        icon: <Home className="w-4 h-4" />,
        label: "Dashboard",
      },
      {
        to: "/receptionist/newpatient",
        icon: <UserPlus className="w-4 h-4" />,
        label: "New Patient",
      },
    ],
  },
};

export default function Sidebar({ variant }: SidebarProps) {
  const config = sidebarConfig[variant];
  const { username } = useAuth();

  if (!config) {
    console.error(`Invalid sidebar variant: ${variant}`);
    return null;
  }

  return (
    <aside className="w-full min-h-screen bg-white shadow-md p-6 flex flex-col">
      {/* Profile Section */}
      <div className="flex items-center gap-3 mb-10">
        <UserCircle2 className="w-10 h-10 text-gray-500" />
        <div>
          <p className="text-sm font-medium text-gray-800">
            {username || config.title}
          </p>
          <p className="text-xs text-gray-500">{config.role}</p>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex flex-col gap-2">
        {config.navItems.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
          />
        ))}
      </nav>
    </aside>
  );
}

function NavItem({
  to,
  icon,
  label,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-full transition-all duration-200 text-sm font-medium
        ${
          isActive
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
