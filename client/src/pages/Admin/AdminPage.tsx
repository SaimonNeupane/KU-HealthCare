// src/pages/AdminPage.tsx
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import AdminDashboard from './DashBoard'
import DoctorsList from './DoctorsList';
import PatientsList from './PatientList';
import Appointments from './Appointment';
import Receptionists from './Receptionist';

export default function AdminPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6">
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="doctors" element={<DoctorsList />} />
          <Route path="patients" element={<PatientsList />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="receptionists" element={<Receptionists />} />
        </Routes>
      </main>
    </div>
  );
}
