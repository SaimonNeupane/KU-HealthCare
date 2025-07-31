import {
  FaUserMd,
  FaUserInjured,
  FaCalendarAlt,
  FaBed,
  FaFlask,
} from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { adminDashboardAPI } from "../../utils/api";
import LoadingScreen from "./LoadingComponent";
interface statType {
  patientCount: number;
  doctorCount: number;
  labCount: number;
  appointmentCount: number;
  bedCount: number;
}

const useDashboardQuery = () => {
  return useQuery<statType>({
    queryKey: ["stats"],
    queryFn: async () => {
      const response = await adminDashboardAPI();
      return response.data;
    },
    staleTime: 60 * 1000 * 3,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 3,
  });
};

export default function StatsCards() {
  const { data, isLoading } = useDashboardQuery();

  const stats = [
    {
      label: "Patients",
      mainValue: isLoading ? <LoadingScreen ram={15} /> : data?.patientCount,
      subValue: "Total",
      icon: <FaUserInjured />,
    },
    {
      label: "Appointments",
      mainValue: isLoading ? (
        <LoadingScreen ram={15} />
      ) : (
        data?.appointmentCount
      ),
      subValue: "Upcoming",
      icon: <FaCalendarAlt />,
    },
    {
      label: "Doctors",
      mainValue: isLoading ? <LoadingScreen ram={15} /> : data?.doctorCount,
      subValue: "Active",
      icon: <FaUserMd />,
    },
    {
      label: "Lab Reports",
      mainValue: isLoading ? <LoadingScreen ram={15} /> : data?.labCount,
      subValue: "Pending",
      icon: <FaFlask />,
    },
    {
      label: "Beds",
      mainValue: isLoading ? <LoadingScreen ram={15} /> : data?.bedCount,
      subValue: "",
      icon: <FaBed />,
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
            <div className="p-3 bg-[#BBF7D0] text-black-700 rounded-full text-xl">
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">
                {stat.mainValue}
              </p>
              {stat.subValue && (
                <p className="text-xs text-gray-400">{stat.subValue}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
