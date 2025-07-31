import React, { useState } from "react";
import { Search, Bell, FileText } from "lucide-react";

// TypeScript interfaces based on Prisma model
interface Bed {
  bed_id: string;
  room_number: string;
}

interface Appointment {
  appointment_id: string;
  date: string;
  // Add other appointment fields as needed
}

interface LabTest {
  test_id: string;
  test_name: string;
  // Add other lab test fields as needed
}

interface Patient {
  patient_id: string;
  first_name: string;
  last_name: string;
  age: number;
  gender: string;
  contact_number: string;
  address: string;
  bedId: string | null;
  created_at: string;
  Appointment: Appointment[];
  LabTest: LabTest[];
  bed: Bed | null;
}

// Sample patient data based on the Prisma model
const samplePatients: Patient[] = [
  {
    patient_id: "456-123-7890",
    first_name: "Jane",
    last_name: "Doe",
    age: 40,
    gender: "Female",
    contact_number: "9841234567",
    address: "123 Main St, Kathmandu, Nepal",
    bedId: null,
    created_at: "2022-12-30T00:00:00Z",
    Appointment: [],
    LabTest: [],
    bed: null,
  },
  {
    patient_id: "789-456-1230",
    first_name: "John",
    last_name: "Smith",
    age: 35,
    gender: "Male",
    contact_number: "9851234567",
    address: "456 Oak Ave, Pokhara, Nepal",
    bedId: "bed-001",
    created_at: "2023-01-15T00:00:00Z",
    Appointment: [],
    LabTest: [],
    bed: { bed_id: "bed-001", room_number: "101" },
  },
];

interface PatientDetailsProps {
  patients?: Patient[];
  initialPatientId?: string;
}

const Diagnosis: React.FC<PatientDetailsProps> = ({
  patients = samplePatients,
  initialPatientId,
}) => {
  const [selectedPatient, setSelectedPatient] = useState<Patient>(() => {
    if (initialPatientId) {
      return (
        patients.find((p) => p.patient_id === initialPatientId) || patients[0]
      );
    }
    return patients[0];
  });

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handlePatientChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const patientId = event.target.value;
    const patient = patients.find((p) => p.patient_id === patientId);
    if (patient) {
      setSelectedPatient(patient);
    }
  };

  const handleLabReportRequest = (): void => {
    // Handle lab report request logic
    console.log(
      `Requesting lab report for patient: ${selectedPatient.patient_id}`
    );
  };

  const handleBedEnrollment = (): void => {
    // Handle bed enrollment logic
    console.log(
      `Requesting bed enrollment for patient: ${selectedPatient.patient_id}`
    );
  };

  const handleCompleteDiagnosis = (): void => {
    // Handle complete diagnosis logic
    console.log(
      `Completing diagnosis for patient: ${selectedPatient.patient_id}`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-black rounded"></div>
            <span className="text-xl font-semibold text-gray-900">
              HealthCo
            </span>
          </div>

          <nav className="flex items-center space-x-8">
            <a
              href="#"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Dashboard
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              My patients
            </a>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Bell className="w-5 h-5" />
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Page Title and Patient Selector */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Patient details</h1>
          <select
            value={selectedPatient.patient_id}
            onChange={handlePatientChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {patients.map((patient: Patient) => (
              <option key={patient.patient_id} value={patient.patient_id}>
                {patient.first_name} {patient.last_name}
              </option>
            ))}
          </select>
        </div>

        {/* Patient Info Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                {selectedPatient.first_name} {selectedPatient.last_name}
              </h2>
              <p className="text-sm text-gray-500">
                ID: {selectedPatient.patient_id}
              </p>
            </div>

            <button
              onClick={handleLabReportRequest}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md px-3 py-2"
            >
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">request lab report</span>
            </button>
          </div>

          {/* Patient Details Grid */}
          <div className="grid grid-cols-2 gap-8 mb-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Age</p>
              <p className="text-gray-900 font-medium">{selectedPatient.age}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Gender</p>
              <p className="text-gray-900 font-medium">
                {selectedPatient.gender}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Contact Number</p>
              <p className="text-gray-900 font-medium">
                {selectedPatient.contact_number}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Bed Status</p>
              <p className="text-gray-900 font-medium">
                {selectedPatient.bedId
                  ? `Bed ${
                      selectedPatient.bed?.room_number || selectedPatient.bedId
                    }`
                  : "Not Assigned"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-8">
            <div>
              <p className="text-sm text-gray-500 mb-1">Address</p>
              <p className="text-gray-900 font-medium">
                {selectedPatient.address}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Admission date</p>
              <p className="text-gray-900 font-medium">
                {formatDate(selectedPatient.created_at)}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleBedEnrollment}
              className={`w-full font-medium py-3 px-4 rounded-lg transition-colors ${
                selectedPatient.bedId
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
              disabled={!!selectedPatient.bedId}
            >
              {selectedPatient.bedId
                ? "Bed Already Assigned"
                : "Request Bed Enrollment"}
            </button>
            <button
              onClick={handleCompleteDiagnosis}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Complete Diagnosis
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Diagnosis;
