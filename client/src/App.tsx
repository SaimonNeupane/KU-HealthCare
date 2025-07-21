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
import ProtectedRoute from "./utils/ProtectedRoute.tsx";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}></Route>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/receptionist/newpatient"
        element={
          <ProtectedRoute>
            <NewPatient />
          </ProtectedRoute>
        }
      />
      <Route
        path="/receptionist"
        element={<Navigate to="/receptionist/dashboard" />}
      />
      <Route
        path="/receptionist/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctorNotification"
        element={
          <ProtectedRoute>
            <Notification />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctorMyPatients"
        element={
          <ProtectedRoute>
            <MyPatients />
          </ProtectedRoute>
        }
      />
      <Route
        path="/labassistant/reportstatus"
        element={
          <ProtectedRoute>
            <LabReports />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
