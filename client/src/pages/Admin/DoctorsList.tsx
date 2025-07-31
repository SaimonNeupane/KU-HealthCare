import { Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";
import { adminDocDetialsAPI } from "../../utils/api";
import { useQuery } from "@tanstack/react-query";
import LoadingScreen from "./LoadingComponent";

interface Department {
  department_id: string;
  name: string;
  description: string;
  created_at: string;
}

interface DoctorData {
  doctor_id: string;
  first_name: string;
  last_name: string;
  department: Department;
  departmentId: string;
  specialization: string;
  phone: string;
}

interface Doctor {
  email: string;
  doctor: DoctorData;
}

const useDoctorQuery = () => {
  return useQuery<Doctor[]>({
    queryKey: ["doctor"],
    queryFn: async (): Promise<Doctor[]> => {
      const response = await adminDocDetialsAPI();
      console.log(response.data.doctors);
      return response.data.doctors;
    },
  });
};

export default function DoctorsList() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useDoctorQuery();

  if (isLoading) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <LoadingScreen ram={60} />
      </div>
    );
  }

  if (isError || !data) {
    return <p>Error loading doctors.</p>;
  }

  // `data` is an array of Doctor objects
  const doctors = data;

  return (
    <div className="w-full bg-gray-50 min-h-screen p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">List of Doctors</h1>
        <button
          className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          onClick={() => navigate("/signup/doctor")}
        >
          + Add Doctor
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Specialization
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {doctors.map(({ email, doctor }) => (
              <tr key={doctor.doctor_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {doctor.first_name} {doctor.last_name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{doctor.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {doctor.department.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {doctor.specialization}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-900 p-1">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
