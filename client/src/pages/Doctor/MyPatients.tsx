import { LogOut } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FaCog, FaUser, FaExclamationTriangle } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import { DoctorPatientAPI } from "../../utils/api";

interface PatientData {
  patient_id: string;
  age: number;
  gender: string;
  first_name: string;
  last_name: string;
  LabTest: Array<{
    status: string;
  }>;
  bed: {
    bed_number?: string;
  } | null;
  Appointment: Array<{
    appointment_time: string;
    room: {
      room_number: string;
    } | null;
  }>;
}

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
  const [patients, setPatients] = useState<PatientRowProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const currentDateTime = "2025-07-28 08:20:07";
  const currentUser = "Prabesh-Sharma";

  useEffect(() => {
    async function fetchPatient() {
      try {
        const res = await DoctorPatientAPI();
        console.log("API Response:", res.data); // Add this to debug API response

        // Transform API data to match the PatientRowProps format
        const formattedPatients = res.data.map((patient: PatientData) => {
          // Get full name from first_name and last_name
          const fullName =
            `${patient.first_name || ""} ${patient.last_name || ""}`.trim() ||
            `Patient ${patient.patient_id.substring(0, 8)}`;

          // Determine if patient has lab test results with "completed" status
          const hasLabResults =
            patient.LabTest &&
            patient.LabTest.some((test) => test.status === "completed");

          // Safely handle potentially null bed data
          const hasBed = patient.bed !== null;

          // Get bed number if available
          const bedNumber =
            hasBed && patient.bed?.bed_number ? patient.bed.bed_number : "";

          // Set bed assignment text
          const bedAssignment = hasBed ? `Yes - Bed ${bedNumber}` : "No";

          // Get room number from the latest appointment if available
          let roomNumber = "Not Assigned";
          if (patient.Appointment && patient.Appointment.length > 0) {
            // Sort appointments by time (newest first) and get the room number
            const latestAppointment = [...patient.Appointment].sort(
              (a, b) =>
                new Date(b.appointment_time).getTime() -
                new Date(a.appointment_time).getTime()
            )[0];

            if (latestAppointment.room && latestAppointment.room.room_number) {
              roomNumber = latestAppointment.room.room_number;
            }
          }

          // Format appointment date for admission date if available
          let admissionDate = "Not Available";
          if (patient.Appointment && patient.Appointment.length > 0) {
            const firstAppointment = [...patient.Appointment].sort(
              (a, b) =>
                new Date(a.appointment_time).getTime() -
                new Date(b.appointment_time).getTime()
            )[0];

            if (firstAppointment.appointment_time) {
              const appointmentDate = new Date(
                firstAppointment.appointment_time
              );
              admissionDate = appointmentDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });
            }
          }

          return {
            name: fullName,
            hasAlert: false, // Set based on your criteria if available
            roomNumber: roomNumber,
            bedAssignment: bedAssignment,
            bedAssignmentType: hasBed
              ? ("assigned" as const)
              : ("not-assigned" as const),
            labReportStatus: hasLabResults
              ? ("arrived" as const)
              : ("pending" as const),
            patientId: patient.patient_id,
            age: patient.age,
            admissionDate: admissionDate,
          };
        });

        setPatients(formattedPatients);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching patient data:", error);
        setLoading(false);
      }
    }
    fetchPatient();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Patients</h1>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span>{currentUser}</span> | <span>{currentDateTime}</span>
              </div>
              <LogOut onClick={logout} className="cursor-pointer" />
            </div>
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
              {loading ? (
                <div className="py-8 text-center text-gray-500">
                  Loading patients...
                </div>
              ) : patients.length > 0 ? (
                patients.map((patient, index) => (
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
                ))
              ) : (
                <div className="py-8 text-center text-gray-500">
                  No patients found
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyPatients;
