// src/components/Sidebar/Sidebar.tsx
import { NavLink } from 'react-router-dom';
export default function Sidebar() {
  return (
    <aside className="w-64 bg-white p-4">
      <h1 className="text-lg font-bold mb-6">KU HealthCare</h1>
      <nav className="flex flex-col space-y-2">
        <NavLink to="dashboard" className={({ isActive }) => isActive ? 'font-semibold text-green-600' : ''}>
          Dashboard
        </NavLink>
        <NavLink to="doctors" className={({ isActive }) => isActive ? 'font-semibold text-green-600' : ''}>
          Doctors
        </NavLink>
        <NavLink to="patients" className={({ isActive }) => isActive ? 'font-semibold text-green-600' : ''}>
          Patients
        </NavLink>
        <NavLink to="appointments" className={({ isActive }) => isActive ? 'font-semibold text-green-600' : ''}>
          Appointments
        </NavLink>
        <NavLink to="receptionists" className={({ isActive }) => isActive ? 'font-semibold text-green-600' : ''}>
          Receptionists
        </NavLink>
      </nav>
    </aside>
  );
}
