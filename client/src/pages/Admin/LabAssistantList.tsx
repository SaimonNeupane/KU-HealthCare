import { Edit, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import LoadingScreen from "./LoadingComponent";
import { useNavigate } from "react-router";

interface LabAssistant {
  email: string;
  lab_assistant: {
    first_name: string;
    last_name: string;
    lab_assistant_id: string;
    phone?: string;
  };
}

// Mock data fetch function (replace with actual API call)
const fetchLabAssistants = async (): Promise<LabAssistant[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return [
    {
      email: "john.doe@hospital.com",
      lab_assistant: {
        first_name: "John",
        last_name: "Doe",
        lab_assistant_id: "1",
        phone: "(123) 456-7890",
      },
    },
    {
      email: "jane.smith@hospital.com",
      lab_assistant: {
        first_name: "Jane",
        last_name: "Smith",
        lab_assistant_id: "2",
        phone: "(234) 567-8901",
      },
    },
    {
      email: "robert.johnson@hospital.com",
      lab_assistant: {
        first_name: "Robert",
        last_name: "Johnson",
        lab_assistant_id: "3",
        phone: "(345) 678-9012",
      },
    },
  ];
};

const useLabQuery = () => {
  return useQuery<LabAssistant[]>({
    queryKey: ["labAssistants"],
    queryFn: fetchLabAssistants,
  });
};

const LabAssistantList = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useLabQuery();

  const handleAddLabAssistant = () => {
    navigate("/signup/lab-assistant");
  };

  const handleEdit = (id: string) => {
    console.log("Edit lab assistant with id:", id);
    // Navigate to edit page or open modal
    // navigate(`/lab-assistants/edit/${id}`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this lab assistant?")) {
      console.log("Delete lab assistant with id:", id);
      // In a real app, you would call an API here
    }
  };

  if (isLoading) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <LoadingScreen ram={60} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        Error loading lab assistants: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          List of Lab Assistants
        </h1>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap"
          onClick={handleAddLabAssistant}
        >
          + Add Lab Assistant
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.length ? (
                data.map((item) => (
                  <tr
                    key={item.lab_assistant.lab_assistant_id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {item.lab_assistant.first_name}{" "}
                        {item.lab_assistant.last_name}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-blue-600 hover:text-blue-800">
                        <a href={`mailto:${item.email}`}>{item.email}</a>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.lab_assistant.phone || "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            handleEdit(item.lab_assistant.lab_assistant_id)
                          }
                          className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(item.lab_assistant.lab_assistant_id)
                          }
                          className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-4 text-center text-gray-500"
                  >
                    No lab assistants found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LabAssistantList;
