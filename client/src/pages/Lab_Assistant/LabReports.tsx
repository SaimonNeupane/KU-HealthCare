import React, { useEffect, useState } from "react";
import { FaSearch, FaCheck, FaClock } from "react-icons/fa";
import { useSocket } from "../../contexts/socketContext";
import { useAuth } from "../../contexts/AuthContext";
import { LabAssistantAPI } from "../../utils/api";
import { LogOut } from "lucide-react";

interface LabReport {
  patient: string;
  id: string;
  status: "completed" | "processing";
}

interface LabReportRowProps extends LabReport {
  onChangeStatus: () => void;
}

const LabReportRow: React.FC<LabReportRowProps> = ({
  patient,
  id,
  status,
  onChangeStatus,
}) => (
  <div className="grid grid-cols-3 gap-8 items-center py-4 border-b border-gray-100">
    <div className="text-gray-900 font-medium">{patient}</div>
    <div className="text-gray-500">{id}</div>
    <div>
      {status === "completed" ? (
        <span className="px-4 py-2 bg-green-200 text-green-800 rounded-full text-sm font-medium">
          Completed
        </span>
      ) : (
        <span className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm font-medium">
          Processing
        </span>
      )}
      {status !== "completed" && (
        <button
          className="border-amber-700 text-black border-4 rounded-lg px-1 ml-3 cursor-pointer"
          onClick={onChangeStatus}
        >
          change status
        </button>
      )}
    </div>
  </div>
);

const LabReports: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<
    "all" | "completed" | "processing"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { username, role } = useAuth();
  const socket = useSocket();
  const [reports, setReports] = useState<LabReport[]>([]);
  const { logout } = useAuth();

  useEffect(() => {
    async function fetchReportStatus() {
      try {
        const res = await LabAssistantAPI();
        const mapped: LabReport[] = res.data.map((item: any) => ({
          patient: `${item.patient.first_name} ${item.patient.last_name}`,
          id: item.patientId,
          status: item.status === "pending" ? "processing" : item.status,
        }));
        setReports(mapped);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    }
    fetchReportStatus();
  }, []);

  const handleChangeStatus = (id: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "completed" } : r))
    );
    const patientName = reports.find((r) => r.id === id)?.patient;
    socket?.emit("send-lab-report", { patientName });
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      activeFilter === "all" || report.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const allCount = reports.length;
  const completedCount = reports.filter((r) => r.status === "completed").length;
  const processingCount = reports.filter(
    (r) => r.status === "processing"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">KU</span>
            </div>
            <span className="text-gray-900 font-semibold text-lg">
              KU Health Care
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <div className="font-medium flex flex-col items-end mr-10">
              <span className="font-medium">{username}</span>
              <span className="text-neutral-500">{role}</span>
            </div>
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-5">
              <img
                src="vite.svg"
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
            </div>
            <LogOut onClick={logout} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Lab Reports</h1>

          {/* Filter Tabs */}
          <div className="flex space-x-6 mb-6">
            <button
              onClick={() => setActiveFilter("all")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeFilter === "all"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <FaSearch className="w-4 h-4" />
              <span>All ({allCount})</span>
            </button>
            <button
              onClick={() => setActiveFilter("completed")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeFilter === "completed"
                  ? "bg-green-100 text-green-700"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <FaCheck className="w-4 h-4" />
              <span>Completed ({completedCount})</span>
            </button>
            <button
              onClick={() => setActiveFilter("processing")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeFilter === "processing"
                  ? "bg-orange-100 text-orange-700"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <FaClock className="w-4 h-4" />
              <span>Processing ({processingCount})</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search reports"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
            />
          </div>

          {/* Reports Table */}
          <div className="bg-white rounded-lg shadow-sm">
            {/* Table Header */}
            <div className="grid grid-cols-3 gap-8 px-6 py-4 bg-gray-50 rounded-t-lg border-b border-gray-200">
              <div className="text-sm font-medium text-gray-600">Patient</div>
              <div className="text-sm font-medium text-gray-600">ID</div>
              <div className="text-sm font-medium text-gray-600">Status</div>
            </div>

            {/* Table Body */}
            <div className="px-6">
              {filteredReports.map((report) => (
                <LabReportRow
                  key={report.id}
                  patient={report.patient}
                  id={report.id}
                  status={report.status}
                  onChangeStatus={() => handleChangeStatus(report.id)}
                />
              ))}
              {filteredReports.length === 0 && (
                <div className="text-gray-500 text-center py-8">
                  No reports found.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LabReports;
