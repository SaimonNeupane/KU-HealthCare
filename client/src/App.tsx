import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./Layouts/MainLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
<<<<<<< HEAD
=======
import NewPatient from "./pages/Receptionist/NewPatient.tsx";

>>>>>>> 68cf044 (Updated ./Receptionist/NewPatient.tsx to level basics in UI and minor changes in routing path)
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}></Route>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
<<<<<<< HEAD
        {/* <Route path="/receptionist" element={<Receptionist />} /> */}
=======
        <Route path="/receptionist/newpatient" element={<NewPatient/>} />
>>>>>>> 68cf044 (Updated ./Receptionist/NewPatient.tsx to level basics in UI and minor changes in routing path)
      </Routes>
    </BrowserRouter>
  );
}

export default App;