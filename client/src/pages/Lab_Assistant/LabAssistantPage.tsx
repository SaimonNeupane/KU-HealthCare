import { Routes, Route } from "react-router-dom";
// import Sidebar from "../../components/Sidebar/Sidebar";
import LabReports from "./LabReports";
// import DashboardLab from "./DashboardLab";

export default function LabAssistantPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* <div className="w-[25%] bg-gray-200 p-4">
        <Sidebar variant="labassistant" />
      </div> */}

      <main className="flex-1 p-6">
        <Routes>
          <Route index element={<LabReports />} />
          {/* <Route path="dashboard" element={<DashboardLab />} /> */}
          <Route path="labreports" element={<LabReports />} />
        </Routes>
      </main>
    </div>
  );
}
