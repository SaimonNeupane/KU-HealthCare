import React from 'react';

export default function Appointment() {
  const appointments = [
    {
      id : 1,
      pname : "John Doe",
      dname : "Dr. Brooklyn Simmons",
      rname : "Jane Smith",
      department : "Cardiology",
      room_id :"101",
      created_At : "2023-10-01"
    },
    {
      id : 1,
      pname : "John Doe",
      dname : "Dr. Brooklyn Simmons",
      rname : "Jane Smith",
      department : "Cardiology",
      room_id :"101",
      created_At : "2023-10-01"
    },
    {
      id : 2,
      pname : "Tony Stark",
      dname : "Dr. Kristin Watson",
      rname : "Marry christ",
      department : "Neurology",
      room_id :"102",
      created_At : "2023-10-11"
    },
    {
      id : 3,
      pname : "Alice tim",
      dname : "Dr. Jacob Jones",
      rname : "Mark Zuckerberg",
      department : "Orthopedics",
      room_id :"103",
      created_At : "2023-09-01"
    },
    {
      id : 4,
      pname : "Krisha Sharma",
      dname : "Dr. David Simmons",
      rname : "Jane Smith",
      department : "Cardiology",
      room_id :"104",
      created_At : "2024-10-01"
    }
  ];
  return (
    <div className="w-full bg-gray-50 min-h-screen p-6">
      <h1 className="text-4xl  font-bold text-gray-800">Create Appointments</h1>
      <h3 className='mt-1.5 text-gray-500'>Manage and view details of appointments</h3>

      {/* Table */}
      <div className='bg-white rounded-lg shadow overflow-hidden mt-8'>
        <table className='min-w-full'>
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Doctor Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Receptionist 
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Room ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created at
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {appointments.map((appointment) => (
              <tr key={appointment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{appointment.pname}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{appointment.dname}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{appointment.rname}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{appointment.department}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{appointment.room_id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{appointment.created_At}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
