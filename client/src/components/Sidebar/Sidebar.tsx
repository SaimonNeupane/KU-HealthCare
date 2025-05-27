const Sidebar = () => {
  return (
    <div className="w-64 bg-white shadow min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6">KU HealthCare</h2>
      <ul className="space-y-4">
        <li className="font-semibold text-green-600">Dashboard</li>
        <li>Doctors</li>
        <li>Patients</li>
        <li>Appointments</li>
        <li>Receptionists</li>
      </ul>
    </div>
  );
};

export default Sidebar;
