import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { adminRecepAPI, updateRecepAPI, deleteRecepAPI } from "../../utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import LoadingScreen from "./LoadingComponent";
import { useNavigate } from "react-router";

interface ReceptionistData {
  receptionist_id?: string; // Make it optional since it might not be in response
  first_name: string;
  last_name: string;
  phone: string;
}

interface Receptionist {
  email: string;
  receptionist: ReceptionistData;
}

interface UpdateReceptionistForm {
  first_name: string;
  last_name: string;
  phone: string;
  username: string;
  email: string;
  password?: string;
}

const useRecepQuery = () => {
  return useQuery({
    queryKey: ["recep"],
    queryFn: async (): Promise<Receptionist[]> => {
      const res = await adminRecepAPI();
      console.log("API Response:", res.data); // Debug log
      return res.data.receptionists;
    },
  });
};

const ReceptionistsList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useRecepQuery();

  // State for modal and form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReceptionist, setSelectedReceptionist] =
    useState<Receptionist | null>(null);
  const [selectedReceptionistId, setSelectedReceptionistId] =
    useState<string>("");
  const [formData, setFormData] = useState<UpdateReceptionistForm>({
    first_name: "",
    last_name: "",
    phone: "",
    username: "",
    email: "",
    password: "",
  });

  // Update receptionist mutation
  const updateReceptionistMutation = useMutation({
    mutationFn: async ({
      receptionistId,
      data,
    }: {
      receptionistId: string;
      data: UpdateReceptionistForm;
    }) => {
      console.log(
        "Updating receptionist with ID:",
        receptionistId,
        "Data:",
        data
      );
      if (!receptionistId || receptionistId === "undefined") {
        throw new Error("Invalid receptionist ID");
      }
      const response = await updateRecepAPI(receptionistId, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recep"] });
      setIsModalOpen(false);
      setSelectedReceptionist(null);
      setSelectedReceptionistId("");
      alert("Receptionist updated successfully!");
    },
    onError: (error: any) => {
      console.error("Error updating receptionist:", error);
      alert(
        `Error updating receptionist: ${
          error.response?.data?.error || error.message
        }`
      );
    },
  });

  // Delete receptionist mutation
  const deleteReceptionistMutation = useMutation({
    mutationFn: async (receptionistId: string) => {
      console.log("Deleting receptionist with ID:", receptionistId);
      if (!receptionistId || receptionistId === "undefined") {
        throw new Error("Invalid receptionist ID");
      }
      const response = await deleteRecepAPI(receptionistId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recep"] });
      alert("Receptionist deleted successfully!");
    },
    onError: (error: any) => {
      console.error("Error deleting receptionist:", error);
      alert(
        `Error deleting receptionist: ${
          error.response?.data?.error || error.message
        }`
      );
    },
  });

  const handleEditClick = (receptionist: Receptionist, index: number) => {
    console.log("Selected receptionist:", receptionist);

    // Check if receptionist_id exists, if not, use a fallback
    const receptionistId = receptionist.receptionist.receptionist_id;

    if (!receptionistId) {
      alert(
        "Cannot edit: Receptionist ID not found. Please refresh the page and try again."
      );
      return;
    }

    setSelectedReceptionist(receptionist);
    setSelectedReceptionistId(receptionistId);

    // Generate username from email or name
    const username =
      receptionist.email.split("@")[0] ||
      `${receptionist.receptionist.first_name.toLowerCase()}.${receptionist.receptionist.last_name.toLowerCase()}`;

    setFormData({
      first_name: receptionist.receptionist.first_name,
      last_name: receptionist.receptionist.last_name,
      phone: receptionist.receptionist.phone,
      username: username,
      email: receptionist.email,
      password: "",
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (receptionist: Receptionist, index: number) => {
    console.log("Delete receptionist:", receptionist);

    const receptionistId = receptionist.receptionist.receptionist_id;

    if (!receptionistId) {
      alert(
        "Cannot delete: Receptionist ID not found. Please refresh the page and try again."
      );
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to delete ${receptionist.receptionist.first_name} ${receptionist.receptionist.last_name}?`
      )
    ) {
      deleteReceptionistMutation.mutate(receptionistId);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedReceptionistId) {
      alert("Error: No receptionist selected for update");
      return;
    }

    // Remove password if it's empty
    const updateData = { ...formData };
    if (!updateData.password?.trim()) {
      delete updateData.password;
    }

    updateReceptionistMutation.mutate({
      receptionistId: selectedReceptionistId,
      data: updateData,
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReceptionist(null);
    setSelectedReceptionistId("");
    setFormData({
      first_name: "",
      last_name: "",
      phone: "",
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

  if (isError || !data) {
    return <p>Error loading receptionists.</p>;
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
              {data?.map((item: Receptionist, index: number) => (
                <tr
                  key={item.receptionist.receptionist_id || index}
                  className="hover:bg-gray-50"
                >
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
                        className={`p-1 ${
                          item.receptionist.receptionist_id
                            ? "text-blue-600 hover:text-blue-800"
                            : "text-gray-400 cursor-not-allowed"
                        }`}
                        title={
                          item.receptionist.receptionist_id
                            ? "Edit"
                            : "ID not available"
                        }
                        onClick={() => handleEditClick(item, index)}
                        disabled={
                          !item.receptionist.receptionist_id ||
                          updateReceptionistMutation.isPending
                        }
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className={`p-1 ${
                          item.receptionist.receptionist_id
                            ? "text-red-600 hover:text-red-800"
                            : "text-gray-400 cursor-not-allowed"
                        }`}
                        title={
                          item.receptionist.receptionist_id
                            ? "Delete"
                            : "ID not available"
                        }
                        onClick={() => handleDeleteClick(item, index)}
                        disabled={
                          !item.receptionist.receptionist_id ||
                          deleteReceptionistMutation.isPending
                        }
                      >
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

      {/* Update Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                Update Receptionist
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

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone <span className="text-red-500">*</span>
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

                {/* Debug info - remove in production */}
                <div className="text-xs text-gray-500">
                  Receptionist ID: {selectedReceptionistId || "Not available"}
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
                    disabled={
                      updateReceptionistMutation.isPending ||
                      !selectedReceptionistId
                    }
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400"
                  >
                    {updateReceptionistMutation.isPending
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

export default ReceptionistsList;
