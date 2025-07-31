import { Routes, Route } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import AdminDashboard from "./DashBoard";
import DoctorsList from "./DoctorsList";
import PatientsList from "./PatientList";
import Appointments from "./Appointment";
import Receptionists from "./Receptionist";
import LabAssistantList from "./LabAssistantList";

export default function AdminPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-[25%] bg-gray-200 p-4">
        <Sidebar variant="admin" />
      </div>

      <main className="flex-1 p-6">
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="doctors" element={<DoctorsList />} />
          <Route path="patients" element={<PatientsList />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="receptionists" element={<Receptionists />} />
          <Route path="labassistants" element={<LabAssistantList />} />
        </Routes>
      </main>
    </div>
  );
}
