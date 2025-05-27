import React, { useState } from 'react';
import { Search } from 'lucide-react';

const PatientsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const patients = [
    {
      name: "John Doe",
      id: "123456",
      email: "john.doe@gmail.com",
      phone: "(302) 456-7890",
      labStatus: "Processing",
      checkupStatus: "In Queue"
    },
    {
      name: "Jane Smith",
      id: "654321",
      email: "jane.smith@gmail.com",
      phone: "(302) 654-7087",
      labStatus: "Processed",
      checkupStatus: "Completed"
    },
    {
      name: "Alice Johnson",
      id: "789012",
      email: "alice.johnson@gmail.com",
      phone: "(789) 012-3456",
      labStatus: "Processing",
      checkupStatus: "Completed"
    },
    {
      name: "Robert Brown",
      id: "345678",
      email: "robert.brown@gmail.com",
      phone: "(345) 678-9012",
      labStatus: "Processed",
      checkupStatus: "In Queue"
    },
    {
      name: "Emily Davis",
      id: "567890",
      email: "emily.davis@gmail.com",
      phone: "(567) 890-1234",
      labStatus: "Processed",
      checkupStatus: "Completed"
    }
  ];

  interface Patient {
    name: string;
    id: string;
    email: string;
    phone: string;
    labStatus: string;
    checkupStatus: string;
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Processed':
        return 'bg-green-100 text-green-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Queue':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter patients based on searchTerm
  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Main Content */}
      <div className="px-6 py-6">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">List of Patients</h1>
          <p className="text-gray-600 text-sm">View and manage patient details</p>
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
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lab Report Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Checkup Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPatients.map((patient, index) => (
                  <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{patient.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                        {patient.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{patient.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(patient.labStatus)}`}>
                        {patient.labStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(patient.checkupStatus)}`}>
                        {patient.checkupStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientsList;