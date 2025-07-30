import { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { adminPatientssAPI } from "../../utils/api";
interface LabTest {
  status: "completed" | "pending" | "in-progress"; // example statuses
}
import LoadingScreen from "./LoadingComponent";
interface Appointment {
  status: "in-progress" | "completed" | "cancelled"; // example statuses
}

interface Patient {
  patient_id: string;
  first_name: string;
  last_name: string;
  contact_number: string;
  LabTest: LabTest[];
  Appointment: Appointment[];
}

const usePatientQuery = () => {
  return useQuery({
    queryKey: ["patients"],
    queryFn: async (): Promise<Patient[]> => {
      const response = await adminPatientssAPI();
      return response.data.patients;
    },
  });
};

const PatientsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: patients, isLoading, error } = usePatientQuery();

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Processing":
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "Processed":
      case "completed":
        return "bg-green-100 text-green-800";
      case "In Queue":
      case "pending":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredPatients = patients?.filter((patient: any) => {
    const fullName = `${patient.first_name} ${patient.last_name}`;
    return (
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patient_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.contact_number.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (isLoading)
    return (
      <div className="h-full w-full flex justify-center items-center">
        <LoadingScreen ram={60} />
      </div>
    );
  if (error)
    return <div className="p-6 text-red-500">Failed to load patients.</div>;

  return (
    <div className="px-6 py-6">
      <div className="mb-6 flex justify-between ">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          List of Patients
        </h1>
        <input
          type="text"
          placeholder="Search by name, ID or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-2 rounded px-3 py-2 text-sm mb-4"
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lab Test Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Checkup Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients?.map((patient: any) => (
                <tr key={patient.patient_id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {patient.first_name} {patient.last_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {patient.patient_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {patient.contact_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        patient.LabTest[0]?.status || "pending"
                      )}`}
                    >
                      {patient.LabTest[0]?.status || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        patient.Appointment[0]?.status || "pending"
                      )}`}
                    >
                      {patient.Appointment[0]?.status || "N/A"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatientsList;
