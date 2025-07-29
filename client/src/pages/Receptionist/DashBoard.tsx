import React, { useState } from "react";
import { FaSearch, FaCalendarAlt } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import {
  User,
  Clock,
  Mail,
  Building2,
  Activity,
  Bed,
  FileText,
  UserCheck,
  Users,
  Stethoscope,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { RecepDoctorAPI, RecepPatientAPI } from "../../utils/api";
import { useQuery } from "@tanstack/react-query";

const Header: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isActive, setIsActive] = useState("1");
  const { logout } = useAuth();

  const navigate = useNavigate();
  const handleRegisterPatient = (a: string) => {
    setIsActive(a);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Side - Logo and Navigation */}
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">◆</span>
            </div>
            <span className="text-gray-900 font-semibold text-lg">
              KU Health Care
            </span>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/receptionist/dashboard")}
              className="flex items-center space-x-2 px-4 py-2 bg-green-900 text-white rounded-full font-medium hover:bg-green-700 transition-colors"
            >
              <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-green-900 rounded-full"></div>
              </div>
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => {
                handleRegisterPatient("2");
                navigate("/receptionist/newpatient");
              }}
              className={`flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-white-900 transition-colors ${
                isActive == "2" ? "bg-green-900" : "bg-white"
              }`}
            >
              <FaCalendarAlt className="w-4 h-4" />
              <span className="font-medium">Register Patient</span>
            </button>
          </div>
        </div>

        {/* Right Side - Search and Export */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors w-64"
            />
          </div>

          <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
            <LuLogOut className="w-5 h-5" onClick={logout} />
          </button>
        </div>
      </div>
    </header>
  );
};

interface Doctor {
  email: string;
  doctor: {
    first_name: string;
    last_name: string;
    workingFrom?: string;
    workingTo?: string;
    is_online: boolean;
    doctor_id: string;
    department?: {
      name?: string;
      department_id?: string;
    };
  };
}

interface Patient {
  first_name: string;
  last_name: string;
  bed: {
    bed_number: number;
  } | null;
  Appointment: any[];
}

interface DashboardData {
  doctors: Doctor[];
  patients: Patient[];
}

// Custom hooks for data fetching
const useDoctorsQuery = () => {
  return useQuery({
    queryKey: ["doctors"],
    queryFn: async (): Promise<Doctor[]> => {
      const response = await RecepDoctorAPI();
      console.log("Doctor API Response:", response.data);
      return response.data?.doctors || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 3,
  });
};

const usePatientsQuery = () => {
  return useQuery({
    queryKey: ["patients"],
    queryFn: async (): Promise<Patient[]> => {
      const response = await RecepPatientAPI();
      console.log("Patient API Response:", response);
      return response.data?.patients || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 3,
  });
};

// Combined dashboard data hook
const useDashboardData = () => {
  const doctorsQuery = useDoctorsQuery();
  const patientsQuery = usePatientsQuery();

  return {
    doctors: doctorsQuery.data || [],
    patients: patientsQuery.data || [],
    isLoading: doctorsQuery.isLoading || patientsQuery.isLoading,
    isError: doctorsQuery.isError || patientsQuery.isError,
    error: doctorsQuery.error || patientsQuery.error,
    refetchDoctors: doctorsQuery.refetch,
    refetchPatients: patientsQuery.refetch,
    refetchAll: async () => {
      await Promise.all([doctorsQuery.refetch(), patientsQuery.refetch()]);
    },
  };
};

function Dashboard() {
  const [activeSection, setActiveSection] = useState<"doctor" | "patient">(
    "doctor"
  );

  // Use TanStack Query for data fetching
  const { doctors, patients, isLoading, isError, error, refetchAll } =
    useDashboardData();

  const getStatusBadge = (
    status: string | boolean | null | undefined,
    type: "status" | "treatment" | "lab" | "bed"
  ) => {
    const baseClasses =
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium";

    // Handle null/undefined cases
    if (status === null || status === undefined) {
      return `${baseClasses} bg-gray-100 text-gray-800`;
    }

    if (type === "status") {
      const isOnline =
        typeof status === "boolean"
          ? status
          : status.toString().toLowerCase() === "online";
      return isOnline
        ? `${baseClasses} bg-green-100 text-green-800`
        : `${baseClasses} bg-yellow-100 text-yellow-800`;
    }

    if (type === "treatment") {
      const statusLower = status.toString().toLowerCase();
      switch (statusLower) {
        case "ongoing":
          return `${baseClasses} bg-blue-100 text-blue-800`;
        case "completed":
          return `${baseClasses} bg-green-100 text-green-800`;
        case "in queue":
          return `${baseClasses} bg-yellow-100 text-yellow-800`;
        default:
          return `${baseClasses} bg-gray-100 text-gray-800`;
      }
    }

    if (type === "lab") {
      const statusLower = status.toString().toLowerCase();
      return statusLower === "arrived"
        ? `${baseClasses} bg-green-100 text-green-800`
        : `${baseClasses} bg-yellow-100 text-yellow-800`;
    }

    if (type === "bed") {
      return status && status.toString() !== "No"
        ? `${baseClasses} bg-green-100 text-green-800`
        : `${baseClasses} bg-gray-100 text-gray-800`;
    }

    return `${baseClasses} bg-gray-100 text-gray-800`;
  };

  // Helper functions to process patient data
  const getPatientTreatmentStatus = (patient: Patient): string => {
    if (patient.Appointment && patient.Appointment.length > 0) {
      return "Ongoing";
    }
    return "In queue";
  };

  const getPatientBedAssignment = (patient: Patient): string => {
    if (patient.bed && patient.bed.bed_number) {
      return `Yes - Bed ${patient.bed.bed_number}`;
    }
    return "No";
  };

  const getPatientRoomNumber = (patient: Patient): string => {
    if (patient.bed && patient.bed.bed_number) {
      return `10${patient.bed.bed_number}`;
    }
    return "N/A";
  };

  const formatWorkingHours = (
    workingFrom: string | undefined,
    workingTo: string | undefined
  ): string => {
    if (!workingFrom || !workingTo) {
      return "N/A";
    }

    const formatHour = (hour: string) => {
      const num = parseInt(hour);
      if (isNaN(num)) return "N/A";

      // Handle 24-hour format
      if (num === 0) return "12 AM";
      if (num < 12) return `${num} AM`;
      if (num === 12) return "12 PM";
      return `${num - 12} PM`;
    };

    return `${formatHour(workingFrom)} - ${formatHour(workingTo)}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
              <div className="text-lg text-gray-600">
                Loading dashboard data...
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-lg text-red-600 mb-4">
                Error: {error?.message || "Failed to load dashboard data"}
              </div>
              <button
                onClick={() => refetchAll()}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-6">
        {/* Header with Refresh Button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={() => refetchAll()}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Refresh Data
          </button>
        </div>

        {/* Toggle Buttons */}
        <div className="flex mb-6 bg-white rounded-lg p-1 shadow-sm border border-gray-200 max-w-2xl mx-auto">
          <button
            onClick={() => setActiveSection("doctor")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
              activeSection === "doctor"
                ? "bg-green-500 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Stethoscope className="w-5 h-5" />
            <span className="hidden sm:inline">Doctors</span>
          </button>
          <button
            onClick={() => setActiveSection("patient")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
              activeSection === "patient"
                ? "bg-green-500 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="hidden sm:inline">Patients</span>
          </button>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          {/* Doctors Table */}
          {activeSection === "doctor" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Doctor's Name
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Working Hours
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        Department
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Status
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {doctors.map((doctorRecord) => (
                    <tr
                      key={doctorRecord.doctor.doctor_id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">
                          Dr. {doctorRecord.doctor.first_name}{" "}
                          {doctorRecord.doctor.last_name}
                        </div>
                        <div className="text-sm text-gray-500 lg:hidden">
                          {doctorRecord.doctor.department?.name || "N/A"}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatWorkingHours(
                          doctorRecord.doctor.workingFrom,
                          doctorRecord.doctor.workingTo
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">
                        <a
                          href={`mailto:${doctorRecord.email}`}
                          className="hover:text-green-600 transition-colors"
                        >
                          {doctorRecord.email}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell">
                        {doctorRecord.doctor.department?.name || "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={getStatusBadge(
                            doctorRecord.doctor.is_online,
                            "status"
                          )}
                        >
                          {doctorRecord.doctor.is_online ? "Online" : "Offline"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {doctors.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No doctors found
                </div>
              )}
            </div>
          )}

          {/* Patients Table */}
          {activeSection === "patient" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4" />
                        Patient's Name
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        Room
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <Bed className="w-4 h-4" />
                        Bed Assignment
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Treatment
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Lab Report
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {patients.map((patient, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">
                          {patient.first_name} {patient.last_name}
                        </div>
                        <div className="text-sm text-gray-500 md:hidden">
                          {getPatientBedAssignment(patient)}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {getPatientRoomNumber(patient)}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span
                          className={getStatusBadge(
                            getPatientBedAssignment(patient),
                            "bed"
                          )}
                        >
                          {getPatientBedAssignment(patient)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={getStatusBadge(
                            getPatientTreatmentStatus(patient),
                            "treatment"
                          )}
                        >
                          {getPatientTreatmentStatus(patient)}
                        </span>
                        <div className="text-sm text-gray-500 lg:hidden mt-1">
                          Lab: Pending
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className={getStatusBadge("Pending", "lab")}>
                          Pending
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {patients.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No patients found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Doctors</p>
                <p className="text-xl font-bold text-gray-900">
                  {doctors.length}
                </p>
              </div>
              <Stethoscope className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Online Doctors</p>
                <p className="text-xl font-bold text-gray-900">
                  {doctors.filter((d) => d.doctor.is_online).length}
                </p>
              </div>
              <Activity className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Patients</p>
                <p className="text-xl font-bold text-gray-900">
                  {patients.length}
                </p>
              </div>
              <Users className="w-6 h-6 text-purple-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Beds Occupied</p>
                <p className="text-xl font-bold text-gray-900">
                  {patients.filter((p) => p.bed && p.bed.bed_number).length}
                </p>
              </div>
              <Bed className="w-6 h-6 text-orange-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
