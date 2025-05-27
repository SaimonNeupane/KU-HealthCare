import React from "react";
const notifications = [
  "Receptionist appointment created",
  "New doctor registered",
  "Patient record updated",
];
function AdminNotification() {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">Notifications</h3>
      <ul className="list-disc pl-5 space-y-1 text-gray-700">
        {notifications.map((note, idx) => (
          <li key={idx}>{note}</li>
        ))}
      </ul>
    </div>
  );
}

export default AdminNotification;
