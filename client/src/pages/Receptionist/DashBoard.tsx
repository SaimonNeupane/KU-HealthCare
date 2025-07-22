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
  id: number;
  name: string;
  workingHours: string;
  email: string;
  department: string;
  status: "Online" | "Offline";
}

interface Patient {
  id: number;
  name: string;
  roomNumber: string;
  bedAssignment: string;
  treatmentStatus: "Ongoing" | "Completed" | "In queue";
  labReportStatus: "Arrived" | "Pending";
}

function Dashboard() {
  const [activeSection, setActiveSection] = useState<"doctor" | "patient">(
    "doctor"
  );

  const doctors: Doctor[] = [
    {
      id: 101,
      name: "Dr. Prabesh Sharma",
      workingHours: "9 AM - 5 PM",
      email: "prabesh10@gmail.com",
      department: "Cardiology",
      status: "Online",
    },
    {
      id: 102,
      name: "Dr. Parikshit Sen",
      workingHours: "10 AM - 6 PM",
      email: "parikshitsen77@gmail.com",
      department: "Neurology",
      status: "Offline",
    },
    {
      id: 103,
      name: "Dr. Keshav Raj Sharma",
      workingHours: "8 AM - 4 PM",
      email: "jdkeshav01@gmail.com",
      department: "Orthopedics",
      status: "Online",
    },
    {
      id: 104,
      name: "Dr. Saimon Neupane",
      workingHours: "11 AM - 7 PM",
      email: "saimonbro00007@gmail.com",
      department: "Pediatrics",
      status: "Online",
    },
    {
      id: 105,
      name: "Dr. Risham Raj Byahut",
      workingHours: "7 AM - 3 PM",
      email: "rajrisham06@gmail.com",
      department: "General Medicine",
      status: "Offline",
    },
    {
      id: 106,
      name: "Dr. Sijan Bhandari",
      workingHours: "9 AM - 3 PM",
      email: "sijan54@gmail.com",
      department: "Dental",
      status: "Offline",
    },
  ];

  const patients: Patient[] = [
    {
      id: 1,
      name: "Piyush Bhatta",
      roomNumber: "101",
      bedAssignment: "Yes - Bed 1",
      treatmentStatus: "Ongoing",
      labReportStatus: "Arrived",
    },
    {
      id: 2,
      name: "Prabesh Ojha",
      roomNumber: "102",
      bedAssignment: "No",
      treatmentStatus: "In queue",
      labReportStatus: "Pending",
    },
    {
      id: 3,
      name: "Salon Timilsina",
      roomNumber: "103",
      bedAssignment: "Yes - Bed 2",
      treatmentStatus: "Completed",
      labReportStatus: "Arrived",
    },
    {
      id: 4,
      name: "Nimita Paudel",
      roomNumber: "104",
      bedAssignment: "No",
      treatmentStatus: "Ongoing",
      labReportStatus: "Pending",
    },
    {
      id: 5,
      name: "Gaurav Bista",
      roomNumber: "105",
      bedAssignment: "Yes - Bed 3",
      treatmentStatus: "In queue",
      labReportStatus: "Arrived",
    },
  ];

  const getStatusBadge = (
    status: string,
    type: "status" | "treatment" | "lab" | "bed"
  ) => {
    const statusLower = status.toLowerCase();

    const baseClasses =
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium";

    if (type === "status") {
      return statusLower === "online"
        ? `${baseClasses} bg-green-100 text-green-800`
        : `${baseClasses} bg-yellow-100 text-yellow-800`;
    }

    if (type === "treatment") {
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
      return statusLower === "arrived"
        ? `${baseClasses} bg-green-100 text-green-800`
        : `${baseClasses} bg-yellow-100 text-yellow-800`;
    }

    if (type === "bed") {
      return status.startsWith("Yes")
        ? `${baseClasses} bg-green-100 text-green-800`
        : `${baseClasses} bg-gray-100 text-gray-800`;
    }

    return `${baseClasses} bg-gray-100 text-gray-800`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-6">
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
                  {doctors.map((doctor) => (
                    <tr
                      key={doctor.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">
                          {doctor.name}
                        </div>
                        <div className="text-sm text-gray-500 lg:hidden">
                          {doctor.department}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {doctor.workingHours}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">
                        <a
                          href={`mailto:${doctor.email}`}
                          className="hover:text-green-600 transition-colors"
                        >
                          {doctor.email}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell">
                        {doctor.department}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={getStatusBadge(doctor.status, "status")}
                        >
                          {doctor.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                  {patients.map((patient) => (
                    <tr
                      key={patient.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">
                          {patient.name}
                        </div>
                        <div className="text-sm text-gray-500 md:hidden">
                          {patient.bedAssignment}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {patient.roomNumber}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span
                          className={getStatusBadge(
                            patient.bedAssignment,
                            "bed"
                          )}
                        >
                          {patient.bedAssignment}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={getStatusBadge(
                            patient.treatmentStatus,
                            "treatment"
                          )}
                        >
                          {patient.treatmentStatus}
                        </span>
                        <div className="text-sm text-gray-500 lg:hidden mt-1">
                          Lab: {patient.labReportStatus}
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span
                          className={getStatusBadge(
                            patient.labReportStatus,
                            "lab"
                          )}
                        >
                          {patient.labReportStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                  {doctors.filter((d) => d.status === "Online").length}
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
                  {
                    patients.filter((p) => p.bedAssignment.startsWith("Yes"))
                      .length
                  }
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
