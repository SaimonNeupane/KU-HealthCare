import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./Layouts/MainLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import NewPatient from "./pages/Receptionist/NewPatient.tsx";
import Dashboard from "./pages/Receptionist/DashBoard.tsx";
import Notification from "./pages/Doctor/Notification.tsx";
import AdminPage from "./pages/Admin/AdminPage.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}></Route>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/receptionist/newpatient" element={<NewPatient />} />
        <Route path="/receptionist/dashboard" element={<Dashboard />} />
        <Route path= "/doctor" element={< Notification/>}/>
        <Route path= "/admin" element={< AdminPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;