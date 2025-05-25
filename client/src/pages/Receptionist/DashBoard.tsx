import React, { useState } from "react";

function Dashboard() {
  const [activeSection, setActiveSection] = useState("doctor");

  const doctors = [
    { id: 101, name: "Dr. Prabesh Sharma", workingHours: "9 AM - 5 PM", email: "prabesh10@gmail.com", department: "Cardiology", status: "Online" },
    { id: 102, name: "Dr. Parikshit Sen", workingHours: "10 AM - 6 PM", email: "parikshitsen77@gmail.com", department: "Neurology", status: "Offline" },
    { id: 103, name: "Dr. Keshav Raj Sharma", workingHours: "8 AM - 4 PM", email: "jdkeshav01@gmail.com", department: "Orthopedics", status: "Online" },
    { id: 104, name: "Dr. Saimon Neupane", workingHours: "11 AM - 7 PM", email: "saimonbro00007@gmail.com", department: "Pediatrics", status: "Online" },
    { id: 105, name: "Dr. Risham Raj Byahut", workingHours: "7 AM - 3 PM", email: "rajrisham06@gmail.com", department: "General Medicine", status: "Offline" },
    { id: 106, name: "Dr. Sijan Bhandari", workingHours: "9 AM - 3 PM", email: "sijan54@gmail.com", department: "Dental", status: "Offline" }
  ];

  const patients = [
    { id: 1, name: "Piyush Bhatta", roomNumber: "101", bedAssignment: "Yes - Bed 1", treatmentStatus: "Ongoing", labReportStatus: "Arrived" },
    { id: 2, name: "Prabesh Ojha", roomNumber: "102", bedAssignment: "No", treatmentStatus: "In queue", labReportStatus: "Pending" },
    { id: 3, name: "Salon Timilsina", roomNumber: "103", bedAssignment: "Yes - Bed 2", treatmentStatus: "Completed", labReportStatus: "Arrived" },
    { id: 4, name: "Nimita Paudel", roomNumber: "104", bedAssignment: "No", treatmentStatus: "Ongoing", labReportStatus: "Pending" },
    { id: 5, name: "Gaurav Bista", roomNumber: "105", bedAssignment: "Yes - Bed 3", treatmentStatus: "In queue", labReportStatus: "Arrived" }
  ];

  const getStatusStyle = (status: string) => {
    const map: Record<string, string> = {
      online: "#4CAF50",
      offline: "#f0ad4e",
      ongoing: "#0275d8",
      completed: "#5cb85c",
      "in queue": "#f0ad4e",
      arrived: "#5cb85c",
      pending: "#f0ad4e"
    };
    const lower = status.toLowerCase();
    return {
      backgroundColor: map[lower] || "#ccc",
      color: "white",
      padding: "4px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "bold"
    };
  };

  return (
    <div style={{ backgroundColor: "#f2f4f7", minHeight: "100vh", padding: "40px 20px", fontFamily: "sans-serif" }}>
      {/* Centered Card Container */}
      <div style={{ maxWidth: "900px", margin: "0 auto", backgroundColor: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
        
        {/* Tab Button Container */}
        <div style={{ display: "flex", backgroundColor: "#f3f4f6", borderRadius: "8px", overflow: "hidden", marginBottom: "24px" }}>
          <button
            onClick={() => setActiveSection("doctor")}
            style={{
              flex: 1,
              backgroundColor: activeSection === "doctor" ? "#f0fdf4" : "#f3f4f6",
              border: "none",
              borderBottom: activeSection === "doctor" ? "4px solid #22c55e" : "none",
              padding: "12px 0",
              fontWeight: "600",
              color: activeSection === "doctor" ? "#15803d" : "#4b5563",
              cursor: "pointer",
              transition: "background-color 0.3s ease"
            }}
          >
            Doctors
          </button>
          <button
            onClick={() => setActiveSection("patient")}
            style={{
              flex: 1,
              backgroundColor: activeSection === "patient" ? "#f0fdf4" : "#f3f4f6",
              border: "none",
              borderBottom: activeSection === "patient" ? "4px solid #22c55e" : "none",
              padding: "12px 0",
              fontWeight: "600",
              color: activeSection === "patient" ? "#15803d" : "#4b5563",
              cursor: "pointer",
              transition: "background-color 0.3s ease"
            }}
          >
            Patients
          </button>
        </div>

        {/* Content Sections */}
        {activeSection === "doctor" && (
          <div>
            <h2 style={{ marginBottom: "20px", fontSize: "20px", fontWeight: "600" }}>Doctor Section</h2>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ backgroundColor: "#f9fafb" }}>
                <tr>
                  <th style={{ padding: "12px", textAlign: "left" }}>Doctor's Name</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Working Hours</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Email</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Department</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doc) => (
                  <tr key={doc.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "12px" }}>{doc.name}</td>
                    <td style={{ padding: "12px" }}>{doc.workingHours}</td>
                    <td style={{ padding: "12px" }}>{doc.email}</td>
                    <td style={{ padding: "12px" }}>{doc.department}</td>
                    <td style={{ padding: "12px" }}>
                      <span style={getStatusStyle(doc.status)}>{doc.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSection === "patient" && (
          <div>
            <h2 style={{ marginBottom: "20px", fontSize: "20px", fontWeight: "600" }}>Patient Section</h2>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ backgroundColor: "#f9fafb" }}>
                <tr>
                  <th style={{ padding: "12px", textAlign: "left" }}>Patient's Name</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Room Number</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Bed Assignment</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Treatment Status</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Lab Report Status</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "12px" }}>{patient.name}</td>
                    <td style={{ padding: "12px" }}>{patient.roomNumber}</td>
                    <td style={{ padding: "12px" }}>
                      <span
                        style={{
                          backgroundColor: patient.bedAssignment.startsWith("Yes") ? "#f0ad4e" : "#ddd",
                          color: patient.bedAssignment.startsWith("Yes") ? "white" : "#555",
                          padding: "4px 12px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "bold"
                        }}
                      >
                        {patient.bedAssignment}
                      </span>
                    </td>
                    <td style={{ padding: "12px" }}>
                      <span style={getStatusStyle(patient.treatmentStatus)}>{patient.treatmentStatus}</span>
                    </td>
                    <td style={{ padding: "12px" }}>
                      <span style={getStatusStyle(patient.labReportStatus)}>{patient.labReportStatus}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
      </div>
    </div>
  );
}

export default Dashboard;
