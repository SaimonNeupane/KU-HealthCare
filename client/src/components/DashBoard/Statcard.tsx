import { FaUserMd, FaUserInjured, FaCalendarAlt, FaBed, FaFlask } from "react-icons/fa";

export default function StatsCards() {
  const stats = [
    { 
      label: "Patients", 
      mainValue: "1,245",
      subValue: "Total",
      icon: <FaUserInjured /> 
    },
    { 
      label: "Appointments", 
      mainValue: "320",
      subValue: "Upcoming",
      icon: <FaCalendarAlt /> 
    },
    { 
      label: "Doctors", 
      mainValue: "45",
      subValue: "Active",
      icon: <FaUserMd /> 
    },
    { 
      label: "Lab Reports", 
      mainValue: "12",
      subValue: "Pending",
      icon: <FaFlask /> 
    },
    { 
      label: "Beds", 
      mainValue: "23/45",
      subValue: "",
      icon: <FaBed /> 
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="bg-white p-5 rounded-xl shadow hover:shadow-md transition"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-700 rounded-full text-xl">
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.mainValue}</p>
              {stat.subValue && <p className="text-xs text-gray-400">{stat.subValue}</p>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}