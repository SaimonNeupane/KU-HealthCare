import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./Layouts/MainLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NewPatient from "./pages/Receptionist/NewPatient.tsx";
import Dashboard from "./pages/Receptionist/DashBoard.tsx";
import Notification from "./pages/Doctor/Notification.tsx";
import AdminPage from "./pages/Admin/AdminPage.tsx";
import MyPatients from "./pages/Doctor/MyPatients.tsx";
import LabReports from "./pages/Lab_Assistant/LabReports.tsx";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}></Route>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/receptionist/newpatient" element={<NewPatient />} />
      <Route
        path="/receptionist"
        element={<Navigate to="/receptionist/dashboard" />}
      />
      <Route path="/receptionist/dashboard" element={<Dashboard />} />
      <Route path="/doctorNotification" element={<Notification />} />
      <Route path="/doctorMyPatients" element={<MyPatients />} />
      <Route path="/doctorLabreports" element={<LabReports />} />

      <Route path="/admin" element={<AdminPage />} />
      <Route path="/admin/*" element={<AdminPage />} />
    </Routes>
  );
}

export default App;
