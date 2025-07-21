import { Routes, Route } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import Dashboard from "./DashBoard";
import NewPatient from "./NewPatient";

export default function ReceptionistPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-[25%] bg-gray-200 p-4">
        <Sidebar variant="receptionist" />
      </div>

      <main className="flex-1 p-6">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="newpatient" element={<NewPatient />} />
        </Routes>
      </main>
    </div>
  );
}
