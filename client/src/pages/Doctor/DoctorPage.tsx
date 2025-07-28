import { Routes, Route } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import MyPatients from "./MyPatients";
import Notification from "./Notification";
import { useSocket } from "../../contexts/socketContext";

export default function DoctorPage() {
  const socket = useSocket();

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-[25%] bg-gray-200 p-4">
        <Sidebar variant="doctor" />
      </div>

      <main className="flex-1 p-6">
        <Routes>
          <Route index element={<MyPatients />} />
          <Route path="mypatients" element={<MyPatients />} />
          <Route path="notification" element={<Notification />} />
        </Routes>
      </main>
    </div>
  );
}
