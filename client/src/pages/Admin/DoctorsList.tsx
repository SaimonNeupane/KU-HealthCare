import { Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";

export default function DoctorsList() {
  const navigate = useNavigate();
  const doctors = [
    {
      id: 1,
      name: "Dr. Brooklyn Simmons",
      phone: "872345623",
      email: "brooklyn@gmail.com",
      department: "Cardiology",
      specialization: "Heart Specialist",
      sex: "Female",
    },
    {
      id: 2,
      name: "Dr. Kristin Watson",
      phone: "908246123",
      email: "kristinw@gmail.com",
      department: "Neurology",
      specialization: "Brain Specialist",
      sex: "Female",
    },
    {
      id: 3,
      name: "Dr. Jacob Jones",
      phone: "234876543",
      email: "jacob@gmail.com",
      department: "Orthopedics",
      specialization: "Bone Specialist",
      sex: "Male",
    },
    {
      id: 4,
      name: "Dr. Cody Fisher",
      phone: "234856432",
      email: "cody@gmail.com",
      department: "Pediatrics",
      specialization: "Child Specialist",
      sex: "Male",
    },
    {
      id: 5,
      name: "Dr. Esther Howard",
      phone: "678456432",
      email: "esther@gmail.com",
      department: "Dermatology",
      specialization: "Skin Specialist",
      sex: "Female",
    },
  ];

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
                Sex
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {doctors.map((doctor) => (
              <tr key={doctor.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {doctor.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{doctor.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{doctor.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {doctor.department}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {doctor.specialization}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{doctor.sex}</div>
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
