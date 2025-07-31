import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./Layouts/MainLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminPage from "./pages/Admin/AdminPage.tsx";
import LabAssistantPage from "./pages/Lab_Assistant/LabAssistantPage.tsx";
import DoctorPage from "./pages/Doctor/DoctorPage.tsx";
import ReceptionistPage from "./pages/Receptionist/ReceptionistPage.tsx";
import ProtectedRoute from "./utils/ProtectedRoute.tsx";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}></Route>
      <Route path="/*" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/signup/:role"
        element={
          <ProtectedRoute>
            <Signup />
          </ProtectedRoute>
        }
      />

      <Route
        path="/receptionist/*"
        element={
          <ProtectedRoute>
            <ReceptionistPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/*"
        element={
          <ProtectedRoute>
            <DoctorPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/labassistant/*"
        element={
          <ProtectedRoute>
            <LabAssistantPage />
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
