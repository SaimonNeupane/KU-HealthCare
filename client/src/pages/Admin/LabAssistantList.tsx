import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import LoadingScreen from "./LoadingComponent";
import { useNavigate } from "react-router";
import {
  deleteLabAssAPI,
  updateLabAssAPI,
  labAssistantsAPI,
} from "../../utils/api";

// Updated interface to match your actual data structure
interface LabAssistantData {
  lab_assistant_id: string;
  first_name: string;
  last_name: string;
  created_at: string;
  userId: string;
}

interface LabAssistant {
  email?: string; // Make optional since it might be missing
  labAssistant: LabAssistantData;
}

interface UpdateLabAssistantForm {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password?: string;
}

// Updated fetch function to handle your actual API response
const fetchLabAssistants = async (): Promise<LabAssistant[]> => {
  try {
    const response = await labAssistantsAPI();
    console.log("Lab Assistants API Response:", response.data);

    // If your API returns just an array (like the data you showed)
    if (Array.isArray(response.data)) {
      return response.data.map((item: LabAssistantData) => ({
        email: `${item.first_name.toLowerCase()}.${item.last_name.toLowerCase()}@hospital.com`, // Generate email
        labAssistant: item,
      }));
    }

    // If your API returns { labAssistants: [...] }
    if (response.data.labAssistants) {
      return response.data.labAssistants;
    }

    return [];
  } catch (error) {
    console.error("Error fetching lab assistants:", error);
    // Return empty array on error
    return [];
  }
};

const useLabQuery = () => {
  return useQuery<LabAssistant[]>({
    queryKey: ["labAssistants"],
    queryFn: fetchLabAssistants,
  });
};

const LabAssistantList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useLabQuery();

  // State for modal and form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLabAssistant, setSelectedLabAssistant] =
    useState<LabAssistant | null>(null);
  const [formData, setFormData] = useState<UpdateLabAssistantForm>({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
  });

  // Update lab assistant mutation
  const updateLabAssistantMutation = useMutation({
    mutationFn: async ({
      labAssistantId,
      data,
    }: {
      labAssistantId: string;
      data: UpdateLabAssistantForm;
    }) => {
      console.log(
        "Updating lab assistant with ID:",
        labAssistantId,
        "Data:",
        data
      );
      if (!labAssistantId || labAssistantId === "undefined") {
        throw new Error("Invalid lab assistant ID");
      }
      const response = await updateLabAssAPI(labAssistantId, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labAssistants"] });
      setIsModalOpen(false);
      setSelectedLabAssistant(null);
      alert("Lab Assistant updated successfully!");
    },
    onError: (error: any) => {
      console.error("Error updating lab assistant:", error);
      alert(
        `Error updating lab assistant: ${
          error.response?.data?.error || error.message
        }`
      );
    },
  });

  // Delete lab assistant mutation
  const deleteLabAssistantMutation = useMutation({
    mutationFn: async (labAssistantId: string) => {
      console.log("Deleting lab assistant with ID:", labAssistantId);
      if (!labAssistantId || labAssistantId === "undefined") {
        throw new Error("Invalid lab assistant ID");
      }
      const response = await deleteLabAssAPI(labAssistantId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labAssistants"] });
      alert("Lab Assistant deleted successfully!");
    },
    onError: (error: any) => {
      console.error("Error deleting lab assistant:", error);
      alert(
        `Error deleting lab assistant: ${
          error.response?.data?.error || error.message
        }`
      );
    },
  });

  const handleAddLabAssistant = () => {
    navigate("/signup/lab-assistant");
  };

  const handleEditClick = (labAssistant: LabAssistant) => {
    console.log("Selected lab assistant:", labAssistant);

    const labAssistantId = labAssistant.labAssistant.lab_assistant_id;

    if (!labAssistantId) {
      alert(
        "Cannot edit: Lab Assistant ID not found. Please refresh the page and try again."
      );
      return;
    }

    setSelectedLabAssistant(labAssistant);

    // Generate username and email
    const email =
      labAssistant.email ||
      `${labAssistant.labAssistant.first_name.toLowerCase()}.${labAssistant.labAssistant.last_name.toLowerCase()}@hospital.com`;
    const username =
      email.split("@")[0] ||
      `${labAssistant.labAssistant.first_name.toLowerCase()}.${labAssistant.labAssistant.last_name.toLowerCase()}`;

    setFormData({
      first_name: labAssistant.labAssistant.first_name,
      last_name: labAssistant.labAssistant.last_name,
      username: username,
      email: email,
      password: "",
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (labAssistant: LabAssistant) => {
    console.log("Delete lab assistant:", labAssistant);

    const labAssistantId = labAssistant.labAssistant.lab_assistant_id;

    if (!labAssistantId) {
      alert(
        "Cannot delete: Lab Assistant ID not found. Please refresh the page and try again."
      );
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to delete ${labAssistant.labAssistant.first_name} ${labAssistant.labAssistant.last_name}?`
      )
    ) {
      deleteLabAssistantMutation.mutate(labAssistantId);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedLabAssistant) {
      alert("Error: No lab assistant selected for update");
      return;
    }

    const labAssistantId = selectedLabAssistant.labAssistant.lab_assistant_id;

    if (!labAssistantId) {
      alert("Error: Lab Assistant ID not found");
      return;
    }

    // Remove password if it's empty
    const updateData = { ...formData };
    if (!updateData.password?.trim()) {
      delete updateData.password;
    }

    updateLabAssistantMutation.mutate({
      labAssistantId: labAssistantId,
      data: updateData,
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLabAssistant(null);
    setFormData({
      first_name: "",
      last_name: "",
      username: "",
      email: "",
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
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.length ? (
                data.map((item) => (
                  <tr
                    key={item.labAssistant.lab_assistant_id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {item.labAssistant.first_name}{" "}
                        {item.labAssistant.last_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {item.labAssistant.lab_assistant_id.slice(0, 8)}...
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-blue-600 hover:text-blue-800">
                        {item.email ||
                          `${item.labAssistant.first_name.toLowerCase()}.${item.labAssistant.last_name.toLowerCase()}@hospital.com`}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditClick(item)}
                          className={`p-1 rounded transition-colors ${
                            item.labAssistant.lab_assistant_id
                              ? "text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                              : "text-gray-400 cursor-not-allowed"
                          }`}
                          title="Edit"
                          disabled={
                            !item.labAssistant.lab_assistant_id ||
                            updateLabAssistantMutation.isPending
                          }
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(item)}
                          className={`p-1 rounded transition-colors ${
                            item.labAssistant.lab_assistant_id
                              ? "text-red-600 hover:text-red-800 hover:bg-red-50"
                              : "text-gray-400 cursor-not-allowed"
                          }`}
                          title="Delete"
                          disabled={
                            !item.labAssistant.lab_assistant_id ||
                            deleteLabAssistantMutation.isPending
                          }
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
                    colSpan={3}
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

      {/* Update Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                Update Lab Assistant
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
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
                    Last Name <span className="text-red-500">*</span>
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

                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
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
                    disabled={updateLabAssistantMutation.isPending}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400"
                  >
                    {updateLabAssistantMutation.isPending
                      ? "Updating..."
                      : "Update"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabAssistantList;
