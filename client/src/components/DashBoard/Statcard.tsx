import React from "react";

const stats = [
  { label: "Doctors", value: 25 },
  { label: "Patients", value: 124 },
  { label: "Appointments", value: 50 },
  { label: "Receptionists", value: 5 },
];

const StatsCards = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((item, idx) => (
        <div key={idx} className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-700 text-sm">{item.label}</h3>
          <p className="text-2xl font-bold">{item.value}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
