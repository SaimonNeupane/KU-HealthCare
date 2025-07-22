import { Routes, Route } from "react-router-dom";
import Dashboard from "./DashBoard";
import NewPatient from "./NewPatient";
import { useAuth } from "../../contexts/AuthContext";

export default function ReceptionistPage() {
  const { username, role } = useAuth();
  return (
    <>
      <div>{username}</div>
      <div className="text text-neutral-500">{role}</div>
      <main className="flex-1 p-6">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="newpatient" element={<NewPatient />} />
        </Routes>
      </main>
    </>
  );
}
