import { Edit } from "lucide-react";
import { useNavigate } from "react-router";
import { adminDocDetialsAPI } from "../../utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import LoadingScreen from "./LoadingComponent";
import { updateDocAPI } from "../../utils/api";
import { useState } from "react";

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

// Department data from your database
const departments = [
  {
    department_id: "e1adf3b5-9499-46fb-8681-a76ebd0deda4",
    name: "Cardiology",
    description: "Heart and cardiovascular system specialists",
  },
  {
    department_id: "47b6d72f-c7ff-4709-b587-4d5949c709dc",
    name: "Gastroenterology",
    description: "Digestive system and liver specialists",
  },
  {
    department_id: "aa5b0204-dfb9-4d3e-8cc3-2f1a8e16eeb5",
    name: "Psychiatry",
    description: "Mental health and behavioral specialists",
  },
  {
    department_id: "577a10c7-78a7-458a-b35f-1ad71cd37927",
    name: "Emergency Medicine",
    description: "Emergency and urgent care services",
  },
  {
    department_id: "75ad83bf-c2bc-4425-bfc3-a17ec9dc1f33",
    name: "Dermatology",
    description: "Skin, hair, and nail specialists",
  },
  {
    department_id: "976f9896-f8b3-4a8e-8d2f-5c44b4cf9f40",
    name: "Neurology",
    description: "Brain and nervous system specialists",
  },
  {
    department_id: "6d432e89-06fd-4184-a1e0-e3021ba0ba9b",
    name: "Pediatrics",
    description: "Medical care for infants, children, and adolescents",
  },
  {
    department_id: "2f5f36b8-92d9-410c-ba4b-a8dd334755fe",
    name: "Oncology",
    description: "Cancer treatment and care specialists",
  },
  {
    department_id: "7759a8fa-42a5-429a-8411-69b6b468aa70",
    name: "General Medicine",
    description: "General medical care and consultation services",
  },
  {
    department_id: "cd69dfd6-5894-4aca-be6e-f0f58d5f3c25",
    name: "Orthopedics",
    description: "Bone, joint, and musculoskeletal system care",
  },
];

interface UpdateDoctorForm {
  first_name: string;
  last_name: string;
  specialization: string;
  departmentId: string;
  phone: string;
  workingFrom: string;
  workingTo: string;
  password?: string;
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
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useDoctorQuery();

  // State for modal and form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [formData, setFormData] = useState<UpdateDoctorForm>({
    first_name: "",
    last_name: "",
    specialization: "",
    departmentId: "",
    phone: "",
    workingFrom: "09:00",
    workingTo: "17:00",
    password: "",
  });

  // Update doctor mutation
  const updateDoctorMutation = useMutation({
    mutationFn: async ({
      doctorId,
      data,
    }: {
      doctorId: string;
      data: UpdateDoctorForm;
    }) => {
      const response = await updateDocAPI(doctorId, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctor"] });
      setIsModalOpen(false);
      setSelectedDoctor(null);
      alert("Doctor updated successfully!");
    },
    onError: (error: any) => {
      console.error("Error updating doctor:", error);
      alert(
        `Error updating doctor: ${error.response?.data?.error || error.message}`
      );
    },
  });

  const handleEditClick = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setFormData({
      first_name: doctor.doctor.first_name,
      last_name: doctor.doctor.last_name,
      specialization: doctor.doctor.specialization,
      departmentId: doctor.doctor.departmentId,
      phone: doctor.doctor.phone,
      workingFrom: "09:00", // Default values since these aren't in the response
      workingTo: "17:00",
      password: "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor) return;

    // Remove password if it's empty
    const updateData = { ...formData };
    if (!updateData.password?.trim()) {
      delete updateData.password;
    }

    updateDoctorMutation.mutate({
      doctorId: selectedDoctor.doctor.doctor_id,
      data: updateData,
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDoctor(null);
    setFormData({
      first_name: "",
      last_name: "",
      specialization: "",
      departmentId: "",
      phone: "",
      workingFrom: "09:00",
      workingTo: "17:00",
      password: "",
    });
  };

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
                    <button
                      className="text-blue-600 hover:text-blue-900 p-1"
                      onClick={() => handleEditClick({ email, doctor })}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Update Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Update Doctor</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) =>
                      setFormData({ ...formData, first_name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) =>
                      setFormData({ ...formData, last_name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                {/* Specialization */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specialization
                  </label>
                  <input
                    type="text"
                    value={formData.specialization}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specialization: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <select
                    value={formData.departmentId}
                    onChange={(e) =>
                      setFormData({ ...formData, departmentId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option
                        key={dept.department_id}
                        value={dept.department_id}
                      >
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                {/* Working Hours */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Working From
                    </label>
                    <input
                      type="time"
                      value={formData.workingFrom}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          workingFrom: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Working To
                    </label>
                    <input
                      type="time"
                      value={formData.workingTo}
                      onChange={(e) =>
                        setFormData({ ...formData, workingTo: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                {/* Password (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password (Optional)
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Leave blank to keep current password"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateDoctorMutation.isPending}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400"
                  >
                    {updateDoctorMutation.isPending
                      ? "Updating..."
                      : "Update Doctor"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
