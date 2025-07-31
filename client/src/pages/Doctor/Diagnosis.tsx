import React, { useState } from "react";
import {
  Search,
  Bell,
  FileText,
  CheckCircle,
  Bed,
  UserCheck,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import {
  doctorDiagnosisOnePatientAPI,
  requestLabReportAPI,
  bedManagementAPI,
  completeDiagnosisAPI,
} from "../../utils/api";

// TypeScript interfaces
interface Bed {
  bed_id: string;
  room_number: string;
}

interface Appointment {
  appointment_id: string;
  date: string;
  appointment_time: string;
  status: string;
  diagnosis?: string;
  prescription?: string;
  notes?: string;
  completed_at?: string;
}

interface LabTest {
  test_id: string;
  test_name: string;
  status: string;
  requested_at?: string;
}

interface Patient {
  patient_id: string;
  first_name: string;
  last_name: string;
  age: number;
  gender: string;
  contact_number: string;
  address: string;
  bedId?: string | null;
  created_at?: string;
  Appointment?: Appointment[];
  LabTest?: LabTest[];
  bed?: Bed | null;
}

interface DiagnosisResponse {
  appointment_id: string;
  status: string;
  diagnosis?: string;
  prescription?: string;
  notes?: string;
  completed_at?: string;
  patient: Patient;
}

// Lab Report Request Modal
const LabReportModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (testNames: string[]) => void;
  isLoading: boolean;
}> = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [customTest, setCustomTest] = useState("");

  const commonTests = [
    "Complete Blood Count (CBC)",
    "Basic Metabolic Panel",
    "Lipid Panel",
    "Liver Function Tests",
    "Thyroid Function Tests",
    "Urinalysis",
    "Chest X-Ray",
    "ECG",
  ];

  const handleTestToggle = (testName: string) => {
    setSelectedTests((prev) =>
      prev.includes(testName)
        ? prev.filter((t) => t !== testName)
        : [...prev, testName]
    );
  };

  const handleAddCustomTest = () => {
    if (customTest.trim() && !selectedTests.includes(customTest.trim())) {
      setSelectedTests((prev) => [...prev, customTest.trim()]);
      setCustomTest("");
    }
  };

  const handleSubmit = () => {
    if (selectedTests.length > 0) {
      onSubmit(selectedTests);
      setSelectedTests([]);
      setCustomTest("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-96 overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Request Lab Reports</h3>

        <div className="space-y-2 mb-4">
          {commonTests.map((test) => (
            <label key={test} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedTests.includes(test)}
                onChange={() => handleTestToggle(test)}
                className="rounded"
              />
              <span className="text-sm">{test}</span>
            </label>
          ))}
        </div>

        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            value={customTest}
            onChange={(e) => setCustomTest(e.target.value)}
            placeholder="Add custom test..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            onKeyPress={(e) => e.key === "Enter" && handleAddCustomTest()}
          />
          <button
            onClick={handleAddCustomTest}
            className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
          >
            Add
          </button>
        </div>

        {selectedTests.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">Selected Tests:</p>
            <div className="flex flex-wrap gap-2">
              {selectedTests.map((test) => (
                <span
                  key={test}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full cursor-pointer"
                  onClick={() => handleTestToggle(test)}
                >
                  {test} ×
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={selectedTests.length === 0 || isLoading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300"
          >
            {isLoading ? "Requesting..." : "Request Tests"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Complete Diagnosis Modal
const CompleteDiagnosisModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    diagnosis: string;
    prescription: string;
    notes: string;
  }) => void;
  isLoading: boolean;
}> = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    if (diagnosis.trim()) {
      onSubmit({ diagnosis, prescription, notes });
      setDiagnosis("");
      setPrescription("");
      setNotes("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h3 className="text-lg font-semibold mb-4">Complete Diagnosis</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Diagnosis *
            </label>
            <textarea
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              rows={3}
              placeholder="Enter diagnosis..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prescription
            </label>
            <textarea
              value={prescription}
              onChange={(e) => setPrescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              rows={3}
              placeholder="Enter prescription..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              rows={2}
              placeholder="Additional notes..."
            />
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!diagnosis.trim() || isLoading}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300"
          >
            {isLoading ? "Completing..." : "Complete Diagnosis"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Custom hook to fetch single patient data
const usePatientQuery = (id: string) => {
  return useQuery({
    queryKey: ["patient", id],
    queryFn: async (): Promise<DiagnosisResponse> => {
      const response = await doctorDiagnosisOnePatientAPI({ id });
      return response?.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

const Diagnosis: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const [labModalOpen, setLabModalOpen] = useState(false);
  const [diagnosisModalOpen, setDiagnosisModalOpen] = useState(false);

  const {
    data: diagnosisData,
    isLoading,
    isError,
    error,
  } = usePatientQuery(id || "");

  // Lab Report Request Mutation
  const labReportMutation = useMutation({
    mutationFn: async (testNames: string[]) => {
      return await requestLabReportAPI({ patientId: id!, testNames });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient", id] });
      setLabModalOpen(false);
    },
    onError: (error) => {
      console.error("Error requesting lab report:", error);
    },
  });

  // Bed Management Mutation (Assign/Free)
  const bedManagementMutation = useMutation({
    mutationFn: async () => {
      return await bedManagementAPI({ patientId: id! });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient", id] });
    },
    onError: (error) => {
      console.error("Error managing bed:", error);
    },
  });

  // Complete Diagnosis Mutation
  const completeDiagnosisMutation = useMutation({
    mutationFn: async (data: {
      diagnosis: string;
      prescription: string;
      notes: string;
    }) => {
      return await completeDiagnosisAPI({ patientId: id!, ...data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient", id] });
      setDiagnosisModalOpen(false);
    },
    onError: (error) => {
      console.error("Error completing diagnosis:", error);
    },
  });

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleLabReportRequest = (testNames: string[]): void => {
    labReportMutation.mutate(testNames);
  };

  const handleBedManagement = (): void => {
    bedManagementMutation.mutate();
  };

  const handleCompleteDiagnosis = (data: {
    diagnosis: string;
    prescription: string;
    notes: string;
  }): void => {
    completeDiagnosisMutation.mutate(data);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading Patient Details...
          </h2>
          <p className="text-gray-600">
            Please wait while we fetch the patient information.
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Patient
          </h2>
          <p className="text-gray-600 mb-4">
            {error instanceof Error
              ? error.message
              : "Failed to load patient details"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Patient not found
  if (!diagnosisData || !diagnosisData.patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Patient Not Found
          </h2>
          <p className="text-gray-600">
            The patient with ID "{id}" could not be found.
          </p>
        </div>
      </div>
    );
  }

  const { patient, status: appointmentStatus } = diagnosisData;
  const isCompleted = appointmentStatus === "completed";

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
        {/* Page Title */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Patient Details
            </h1>
            {isCompleted && (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Diagnosis Completed</span>
              </div>
            )}
          </div>
        </div>

        {/* Patient Info Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                {patient.first_name} {patient.last_name}
              </h2>
              <p className="text-sm text-gray-500">ID: {patient.patient_id}</p>
            </div>

            <button
              onClick={() => setLabModalOpen(true)}
              disabled={labReportMutation.isPending}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md px-3 py-2 disabled:opacity-50"
            >
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">
                {labReportMutation.isPending
                  ? "Requesting..."
                  : "Request Lab Report"}
              </span>
            </button>
          </div>

          {/* Patient Details Grid */}
          <div className="grid grid-cols-2 gap-8 mb-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Age</p>
              <p className="text-gray-900 font-medium">{patient.age}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Gender</p>
              <p className="text-gray-900 font-medium">{patient.gender}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Contact Number</p>
              <p className="text-gray-900 font-medium">
                {patient.contact_number}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Bed Status</p>
              <p className="text-gray-900 font-medium">
                {patient.bedId
                  ? `Bed ${patient.bed?.room_number || patient.bedId}`
                  : "Not Assigned"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-8">
            <div>
              <p className="text-sm text-gray-500 mb-1">Address</p>
              <p className="text-gray-900 font-medium">{patient.address}</p>
            </div>
            {patient.created_at && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Admission Date</p>
                <p className="text-gray-900 font-medium">
                  {formatDate(patient.created_at)}
                </p>
              </div>
            )}
          </div>

          {/* Diagnosis Details (if completed) */}
          {isCompleted && diagnosisData.diagnosis && (
            <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                Diagnosis Details
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-green-800">
                    Diagnosis:
                  </p>
                  <p className="text-green-700">{diagnosisData.diagnosis}</p>
                </div>
                {diagnosisData.prescription && (
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      Prescription:
                    </p>
                    <p className="text-green-700">
                      {diagnosisData.prescription}
                    </p>
                  </div>
                )}
                {diagnosisData.notes && (
                  <div>
                    <p className="text-sm font-medium text-green-800">Notes:</p>
                    <p className="text-green-700">{diagnosisData.notes}</p>
                  </div>
                )}
                {diagnosisData.completed_at && (
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      Completed At:
                    </p>
                    <p className="text-green-700">
                      {formatDate(diagnosisData.completed_at)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Lab Tests Section */}
          {patient.LabTest && patient.LabTest.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Lab Tests
              </h3>
              <div className="space-y-2">
                {patient.LabTest.map((test) => (
                  <div
                    key={test.test_id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-gray-900">{test.test_name}</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        test.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : test.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {test.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Appointments Section */}
          {patient.Appointment && patient.Appointment.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Appointments
              </h3>
              <div className="space-y-2">
                {patient.Appointment.map((appointment) => (
                  <div
                    key={appointment.appointment_id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-gray-900">
                      {formatDate(
                        appointment.appointment_time || appointment.date
                      )}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        appointment.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleBedManagement}
              disabled={bedManagementMutation.isPending}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Bed className="w-4 h-4" />
              <span>
                {bedManagementMutation.isPending
                  ? "Processing..."
                  : patient.bedId
                  ? "Free Bed"
                  : "Assign Bed"}
              </span>
            </button>

            {!isCompleted && (
              <button
                onClick={() => setDiagnosisModalOpen(true)}
                disabled={completeDiagnosisMutation.isPending}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <UserCheck className="w-4 h-4" />
                <span>
                  {completeDiagnosisMutation.isPending
                    ? "Completing..."
                    : "Complete Diagnosis"}
                </span>
              </button>
            )}

            {isCompleted && (
              <div className="w-full bg-gray-100 text-gray-500 font-medium py-3 px-4 rounded-lg text-center flex items-center justify-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>Diagnosis Already Completed</span>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      <LabReportModal
        isOpen={labModalOpen}
        onClose={() => setLabModalOpen(false)}
        onSubmit={handleLabReportRequest}
        isLoading={labReportMutation.isPending}
      />

      <CompleteDiagnosisModal
        isOpen={diagnosisModalOpen}
        onClose={() => setDiagnosisModalOpen(false)}
        onSubmit={handleCompleteDiagnosis}
        isLoading={completeDiagnosisMutation.isPending}
      />
    </div>
  );
};

export default Diagnosis;
