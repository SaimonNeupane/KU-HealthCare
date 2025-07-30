import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminAppointmentsAPI } from "../../utils/api";
import LoadingScreen from "./LoadingComponent";

interface Patient {
  first_name: string;
  last_name: string;
  patient_id: string;
  contact_number?: string;
}

interface Department {
  name: string;
}

interface Room {
  room_number: number;
}

interface Doctor {
  first_name: string;
  last_name: string;
  doctor_id: string;
  room: Room;
}

interface Appointment {
  patient: Patient;
  department: Department;
  doctor: Doctor;
  created_at: string;
  appointment_id: string;
}

const useAppointmentQuery = () => {
  return useQuery<Appointment[], Error>({
    queryKey: ["appointments"],
    queryFn: async () => {
      try {
        const response = await adminAppointmentsAPI();
        return response.data.appointments;
      } catch (error) {
        throw new Error("Failed to fetch appointments");
      }
    },
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 3,
  });
};

export default function Appointment() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, isError, error } = useAppointmentQuery();

  if (isLoading) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <LoadingScreen ram={60} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <div className="text-red-500 text-center p-4 rounded-lg bg-red-50 max-w-md">
          <h2 className="text-xl font-semibold mb-2">
            Error loading appointments
          </h2>
          <p>{error?.message || "Unknown error occurred"}</p>
        </div>
      </div>
    );
  }

  const filteredAppointments = data?.filter((appointment) => {
    const fullName =
      `${appointment.patient.first_name} ${appointment.patient.last_name}`.toLowerCase();
    const patientId = appointment.patient.patient_id.toLowerCase();
    const contactNumber =
      appointment.patient.contact_number?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();

    return (
      fullName.includes(search) ||
      patientId.includes(search) ||
      contactNumber.includes(search)
    );
  });

  return (
    <main className="flex-1 p-4 md:p-6">
      <div className="mb-6 flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
            List of Appointments
          </h1>
          {filteredAppointments && (
            <p className="text-sm text-gray-500 mt-1">
              Showing {filteredAppointments.length} appointment(s)
            </p>
          )}
        </div>
        <div className="w-full md:w-64">
          <input
            type="text"
            placeholder="Search by name, ID or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        {filteredAppointments?.length ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Department
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Room
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppointments.map((appointment) => (
                <tr
                  key={appointment.appointment_id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {appointment.patient.first_name}{" "}
                      {appointment.patient.last_name}
                    </div>
                    <div className="text-xs text-gray-500">
                      ID: {appointment.patient.patient_id}
                    </div>
                    {appointment.patient.contact_number && (
                      <div className="text-xs text-gray-500">
                        {appointment.patient.contact_number}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      Dr. {appointment.doctor.first_name}{" "}
                      {appointment.doctor.last_name}
                    </div>
                    <div className="text-xs text-gray-500 sm:hidden">
                      {appointment.department.name}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                    {appointment.department.name}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                    {appointment.doctor.room.room_number}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(appointment.created_at).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center text-gray-500">
            {searchTerm
              ? "No appointments match your search"
              : "No appointments found"}
          </div>
        )}
      </div>
    </main>
  );
}
