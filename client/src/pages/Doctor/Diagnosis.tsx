import React, { useState } from "react";
import {
  Search,
  Bell,
  FileText,
  CheckCircle,
  Bed,
  UserCheck,
  Loader2,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { doctorDiagnosisOnePatientAPI } from "../../utils/api";
import { toast } from "sonner";
import { requestLabReportAPI } from "../../utils/api";
import { bedQueryAPI } from "../../utils/api";

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

const usePatientQuery = (id: any) => {
  return useQuery({
    queryKey: ["patient", id],
    queryFn: async (): Promise<any> => {
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
  const [bedLoading, setBedLoading] = useState(false);

  const {
    data: diagnosisData,
    isLoading,
    isError,
    error,
    refetch, // Add refetch to update data after bed management
  } = usePatientQuery(id || "");

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const requestLabReport = async ({
    patientId,
    appointment_id,
  }: {
    patientId: string;
    appointment_id: string;
  }) => {
    const toastId = toast.loading("Requesting lab report...");
    try {
      await requestLabReportAPI({ patientId, appointment_id });

      toast.success("Lab report requested successfully", {
        id: toastId,
      });
    } catch (error) {
      toast.error("Failed to request lab report", {
        id: toastId,
      });
      console.error("Error requesting lab report:", error);
    }
  };

  const handleBedManagement = async ({ id }: { id: string }) => {
    setBedLoading(true);
    const toastId = toast.loading("Processing bed request...");

    try {
      const response = await bedQueryAPI(id);

      // Check the response to determine success message
      if (response.data.status === "success") {
        toast.success("Bed released successfully", { id: toastId });
      } else if (response.data.status === "Success") {
        toast.success("Bed assigned successfully", { id: toastId });
      } else {
        toast.success("Bed managed successfully", { id: toastId });
      }

      // Refetch patient data to get updated bed status
      await refetch();
    } catch (error: any) {
      console.error("Error requesting bed:", error);

      // Handle specific error cases
      if (error?.response?.status === 404) {
        toast.error("All beds are currently reserved", { id: toastId });
      } else if (error?.response?.data?.message) {
        toast.error(error.response.data.message, { id: toastId });
      } else {
        toast.error("Failed to manage bed", { id: toastId });
      }
    } finally {
      setBedLoading(false);
    }
  };

  const handleCompleteDiagnosis = () => {
    console.log("requested");
  };

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
  const hasBed = !!patient.bedId;

  return (
    <div className="min-h-screen bg-gray-50">
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

      <main className="max-w-4xl mx-auto px-6 py-8">
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

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                {patient.first_name} {patient.last_name}
              </h2>
              <p className="text-sm text-gray-500">ID: {patient.patient_id}</p>
            </div>

            <button
              onClick={() =>
                requestLabReport({
                  patientId: patient.patient_id,
                  appointment_id: diagnosisData.appointment_id,
                })
              }
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md px-3 py-2"
            >
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">Request Lab Report</span>
            </button>
          </div>

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
              <div className="flex items-center space-x-2">
                <p className="text-gray-900 font-medium">
                  {hasBed
                    ? `Bed ${patient.bed?.room_number || patient.bedId}`
                    : "Not Assigned"}
                </p>
                {hasBed && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Assigned
                  </span>
                )}
              </div>
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

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => handleBedManagement({ id: patient.patient_id })}
              disabled={bedLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <span>
                {bedLoading
                  ? "Processing..."
                  : hasBed
                  ? "Manage Bed"
                  : "Manage Bed"}
              </span>
            </button>

            {!isCompleted && (
              <button
                onClick={handleCompleteDiagnosis}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>Complete Diagnosis</span>
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
    </div>
  );
};

export default Diagnosis;
