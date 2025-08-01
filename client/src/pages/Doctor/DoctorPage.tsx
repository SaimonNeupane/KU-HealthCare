import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import MyPatients from "./MyPatients";
import Notification from "./Notification";
import Diagnosis from "./Diagnosis";

export default function DoctorPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-[25%] bg-gray-200 p-4">
        <Sidebar variant="doctor" />
      </div>

      <main className="flex-1 p-6">
        <Routes>
          <Route index element={<Navigate to="/doctor/mypatients" replace />} />
          <Route path="mypatients" element={<MyPatients />} />
          <Route path="patient/:id" element={<Diagnosis />} />
          <Route path="notification" element={<Notification />} />
        </Routes>
      </main>
    </div>
  );
}
