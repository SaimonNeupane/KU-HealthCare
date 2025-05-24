import { BrowserRouter, Routes, Route } from "react-router";
import MainLayout from "./Layouts/MainLayout";
import { Navigate } from "react-router";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}></Route>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* <Route path="/receptionist" element={<Receptionist />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
