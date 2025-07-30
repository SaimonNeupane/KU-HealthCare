import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { adminRecepAPI } from "../../utils/api";
import { useQuery } from "@tanstack/react-query";
import LoadingScreen from "./LoadingComponent";
import { useNavigate } from "react-router";
interface Receptionist {
  email: string;
  receptionist: {
    first_name: string;
    last_name: string;
    phone: string;
  };
}

const useRecepQuery = () => {
  return useQuery({
    queryKey: ["recep"],
    queryFn: async (): Promise<Receptionist[]> => {
      const res = await adminRecepAPI();
      return res.data.receptionists;
    },
  });
};

const ReceptionistsList = () => {
  const navigate = useNavigate();
  const [receptionists, setReceptionists] = useState([
    {
      id: 1,
      name: "Brooklyn Simmons",
      phone: "(217) 555-0113",
      email: "brooklyn@gmail.com",
      department: "Cardiology",
      sex: "Female",
    },
    {
      id: 2,
      name: "Kristin Watson",
      phone: "(308) 555-0121",
      email: "kristin@gmail.com",
      department: "Neurology",
      sex: "Female",
    },
    {
      id: 3,
      name: "Jacob Jones",
      phone: "(219) 555-0114",
      email: "jacob@gmail.com",
      department: "Orthopedics",
      sex: "Male",
    },
  ]);

  interface HandleEdit {
    (id: number): void;
  }

  const handleEdit: HandleEdit = (id) => {
    console.log("Edit receptionist with id:", id);
    // Add edit functionality here
  };

  interface Receptionist {
    id: number;
    name: string;
    phone: string;
    email: string;
    department: string;
    sex: string;
  }

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this receptionist?")) {
      setReceptionists(
        receptionists.filter(
          (receptionist: Receptionist) => receptionist.id !== id
        )
      );
    }
  };

  const handleAddReceptionist = () => {
    console.log("Add new receptionist");
    // Add new receptionist functionality here
  };

  const { data, isLoading } = useRecepQuery();
  if (isLoading) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <LoadingScreen ram={60} />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold text-gray-900">
          List of Receptionists
        </h1>
        <button
          className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          onClick={() => navigate("/signup/receptionist")}
        >
          + Add Receptionist
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.map(
                (
                  item: any,
                  index: number // error is on the data?.map fix this
                ) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {item.receptionist.first_name}{" "}
                        {item.receptionist.last_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.receptionist.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-blue-600">{item.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReceptionistsList;
