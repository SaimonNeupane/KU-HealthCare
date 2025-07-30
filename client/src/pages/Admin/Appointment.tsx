import React from "react";
import { useQuery } from "@tanstack/react-query";
import { adminAppointmentsAPI } from "../../utils/api";
import LoadingScreen from "./LoadingComponent";

interface Appointment {
  patient: {
    first_name: string;
    last_name: string;
    patient_id: string;
  };
  department: {
    name: String;
  };
  doctor: {
    first_name: string;
    last_name: string;
    doctor_id: string;
    room: {
      room_number: number;
    };
  };
  created_at: string;
  appointment_id: string;
}
const useAppointmentQuery = () => {
  return useQuery<Appointment[]>({
    queryKey: ["appointments"],
    queryFn: async () => {
      const response = await adminAppointmentsAPI();
      return response.data.appointments;
    },
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 3,
  });
};

export default function Appointment() {
  const { data, isLoading } = useAppointmentQuery();
  if (isLoading) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <LoadingScreen ram={60} />
      </div>
    );
  }
  return (
    <main className="flex-1 p-6">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Doctor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Room
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {data?.map((appointment) => (
              <tr key={appointment.appointment_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {appointment.patient.first_name}{" "}
                  {appointment.patient.last_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Dr. {appointment.doctor.first_name}{" "}
                  {appointment.doctor.last_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {appointment.department.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {appointment.doctor.room.room_number}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(appointment.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
