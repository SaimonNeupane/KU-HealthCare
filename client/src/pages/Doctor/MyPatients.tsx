import { LogOut } from "lucide-react";
import React from "react";
import { FaCog, FaUser, FaExclamationTriangle } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";

interface PatientRowProps {
  name: string;
  hasAlert?: boolean;
  roomNumber: string;
  bedAssignment: string;
  bedAssignmentType: "assigned" | "not-assigned";
  labReportStatus: "arrived" | "pending";
  patientId?: string;
  age?: number;
  admissionDate?: string;
}

const PatientRow: React.FC<PatientRowProps> = ({
  name,
  hasAlert,
  roomNumber,
  bedAssignment,
  bedAssignmentType,
  labReportStatus,
  patientId,
  age,
  admissionDate,
}) => {
  return (
    <div className="border-b border-gray-100 py-6">
      <div className="grid grid-cols-4 gap-8 items-center">
        {/* Patient Name */}
        <div className="flex items-center space-x-2">
          <span className="text-gray-900 font-medium">{name}</span>
          {hasAlert && (
            <FaExclamationTriangle className="w-4 h-4 text-red-500" />
          )}
        </div>

        {/* Room Number */}
        <div className="text-gray-600">{roomNumber}</div>

        {/* Bed Assignment */}
        <div>
          {bedAssignmentType === "assigned" ? (
            <span className="px-4 py-2 bg-orange-400 text-white rounded-full text-sm font-medium">
              {bedAssignment}
            </span>
          ) : (
            <span className="px-4 py-2 bg-gray-200 text-gray-600 rounded-full text-sm font-medium">
              {bedAssignment}
            </span>
          )}
        </div>

        {/* Lab Report Status */}
        <div>
          {labReportStatus === "arrived" ? (
            <span className="px-4 py-2 bg-green-200 text-green-800 rounded-full text-sm font-medium">
              Arrived
            </span>
          ) : (
            <span className="px-4 py-2 bg-gray-200 text-gray-600 rounded-full text-sm font-medium">
              Pending
            </span>
          )}
        </div>
      </div>

      {/* Additional Info Row */}
      {(patientId || age || admissionDate) && (
        <div className="grid grid-cols-4 gap-8 mt-3">
          <div className="text-sm text-gray-500">
            {patientId && `ID: ${patientId}`}
          </div>
          <div className="text-sm text-gray-500">
            {age && (
              <>
                <span className="text-gray-400">Age</span>
                <br />
                <span className="text-gray-600 font-medium">{age}</span>
              </>
            )}
          </div>
          <div></div>
          <div className="text-sm text-gray-500">
            {admissionDate && (
              <>
                <span className="text-gray-400">Admission date</span>
                <br />
                <span className="text-gray-600 font-medium">
                  {admissionDate}
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const MyPatients: React.FC = () => {
  const { logout } = useAuth();
  const patients = [
    {
      name: "Ramesh Shah",
      hasAlert: true,
      roomNumber: "101",
      bedAssignment: "Yes - Bed 1",
      bedAssignmentType: "assigned" as const,
      labReportStatus: "arrived" as const,
      patientId: "456-123-7890",
      age: 40,
      admissionDate: "Dec 30th, 2022",
    },
    {
      name: "Bob Williams",
      roomNumber: "102",
      bedAssignment: "No",
      bedAssignmentType: "not-assigned" as const,
      labReportStatus: "pending" as const,
    },
    {
      name: "Catherine Lee",
      roomNumber: "103",
      bedAssignment: "Yes - Bed 2",
      bedAssignmentType: "assigned" as const,
      labReportStatus: "arrived" as const,
    },
    {
      name: "Prabesh Sharma",
      roomNumber: "104",
      bedAssignment: "No",
      bedAssignmentType: "not-assigned" as const,
      labReportStatus: "pending" as const,
    },
    {
      name: "Emma Martinez",
      hasAlert: true,
      roomNumber: "105",
      bedAssignment: "Yes - Bed 3",
      bedAssignmentType: "assigned" as const,
      labReportStatus: "arrived" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex:col justify-between">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              My Patients
            </h1>
            <LogOut onClick={logout} />
          </div>

          {/* Table Header */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="grid grid-cols-4 gap-8 px-6 py-4 bg-gray-50 rounded-t-lg border-b border-gray-200">
              <div className="text-sm font-medium text-gray-600">
                Patient's Name
              </div>
              <div className="text-sm font-medium text-gray-600">
                Room Number
              </div>
              <div className="text-sm font-medium text-gray-600">
                Bed Assignment
              </div>
              <div className="text-sm font-medium text-gray-600">
                Lab Report Status
              </div>
            </div>

            {/* Patient Rows */}
            <div className="px-6">
              {patients.map((patient, index) => (
                <PatientRow
                  key={index}
                  name={patient.name}
                  hasAlert={patient.hasAlert}
                  roomNumber={patient.roomNumber}
                  bedAssignment={patient.bedAssignment}
                  bedAssignmentType={patient.bedAssignmentType}
                  labReportStatus={patient.labReportStatus}
                  patientId={patient.patientId}
                  age={patient.age}
                  admissionDate={patient.admissionDate}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyPatients;
