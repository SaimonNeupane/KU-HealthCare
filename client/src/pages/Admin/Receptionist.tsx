import React, { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';

const ReceptionistsList = () => {
  const [receptionists, setReceptionists] = useState([
    {
      id: 1,
      name: "Brooklyn Simmons",
      phone: "(217) 555-0113",
      email: "brooklyn@gmail.com",
      department: "Cardiology",
      sex: "Female"
    },
    {
      id: 2,
      name: "Kristin Watson",
      phone: "(308) 555-0121",
      email: "kristin@gmail.com",
      department: "Neurology",
      sex: "Female"
    },
    {
      id: 3,
      name: "Jacob Jones",
      phone: "(219) 555-0114",
      email: "jacob@gmail.com",
      department: "Orthopedics",
      sex: "Male"
    }
  ]);

  interface HandleEdit {
    (id: number): void;
  }

  const handleEdit: HandleEdit = (id) => {
    console.log('Edit receptionist with id:', id);
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
    if (window.confirm('Are you sure you want to delete this receptionist?')) {
      setReceptionists(receptionists.filter((receptionist: Receptionist) => receptionist.id !== id));
    }
  };

  const handleAddReceptionist = () => {
    console.log('Add new receptionist');
    // Add new receptionist functionality here
  };

  return (
    <div className="p-6">
      {/* Title and Add Button */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold text-gray-900">List of Receptionists</h1>
        <button
          onClick={handleAddReceptionist}
          className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Add Receptionist...
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
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
                  Sex
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {receptionists.map((receptionist) => (
                <tr key={receptionist.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{receptionist.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{receptionist.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                      {receptionist.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{receptionist.department}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{receptionist.sex}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(receptionist.id)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(receptionist.id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                        title="Delete"
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
    </div>
  );
};

export default ReceptionistsList;