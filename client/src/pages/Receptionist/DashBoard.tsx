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
    const map: { [key: string]: string } = {
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
      backgroundColor: map[lower as string] || "#ccc",
      color: "white",
      padding: "4px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "bold"
    };
  };

  return (
    <div style={{ 
      backgroundColor: "#f8fafc", 
      minHeight: "100vh", 
      padding: "40px 20px", 
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" 
    }}>
      {/* Main Container */}
      <div style={{ 
        maxWidth: "1000px", 
        margin: "0 auto"
      }}>
        
        {/* Toggle Buttons */}
        <div style={{ 
          display: "flex",
          marginBottom: "24px"
        }}>
          <button
            onClick={() => setActiveSection("doctor")}
            style={{
              width: "50%",
              padding: "12px 24px",
              backgroundColor: "transparent",
              color: activeSection === "doctor" ? "#22c55e" : "#64748b",
              border: "none",
              borderBottom: activeSection === "doctor" ? "3px solid #22c55e" : "3px solid transparent",
              fontWeight: "600",
              fontSize: "16px",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            Doctors
          </button>
          <button
            onClick={() => setActiveSection("patient")}
            style={{
              width: "50%",
              padding: "12px 24px",
              backgroundColor: "transparent",
              color: activeSection === "patient" ? "#22c55e" : "#64748b",
              border: "none",
              borderBottom: activeSection === "patient" ? "3px solid #22c55e" : "3px solid transparent",
              fontWeight: "600",
              fontSize: "16px",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            Patients
          </button>
        </div>

        {/* Table Container */}
        <div style={{ 
          backgroundColor: "white", 
          borderRadius: "16px", 
          padding: "24px",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          border: "1px solid #e2e8f0"
        }}>

          {/* Doctors Table */}
          {activeSection === "doctor" && (
            <div style={{ overflowX: "auto" }}>
              <table style={{ 
                width: "100%", 
                borderCollapse: "collapse",
                fontSize: "14px"
              }}>
                <thead>
                  <tr style={{ backgroundColor: "#f8fafc" }}>
                    <th style={{ 
                      padding: "16px 12px", 
                      textAlign: "left", 
                      fontWeight: "600",
                      color: "#374151",
                      borderBottom: "2px solid #e5e7eb"
                    }}>
                      Doctor's Name
                    </th>
                    <th style={{ 
                      padding: "16px 12px", 
                      textAlign: "left", 
                      fontWeight: "600",
                      color: "#374151",
                      borderBottom: "2px solid #e5e7eb"
                    }}>
                      Working Hours
                    </th>
                    <th style={{ 
                      padding: "16px 12px", 
                      textAlign: "left", 
                      fontWeight: "600",
                      color: "#374151",
                      borderBottom: "2px solid #e5e7eb"
                    }}>
                      Email
                    </th>
                    <th style={{ 
                      padding: "16px 12px", 
                      textAlign: "left", 
                      fontWeight: "600",
                      color: "#374151",
                      borderBottom: "2px solid #e5e7eb"
                    }}>
                      Department
                    </th>
                    <th style={{ 
                      padding: "16px 12px", 
                      textAlign: "left", 
                      fontWeight: "600",
                      color: "#374151",
                      borderBottom: "2px solid #e5e7eb"
                    }}>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doc, index) => (
                    <tr key={doc.id} style={{ 
                      borderBottom: "1px solid #f1f5f9",
                      backgroundColor: index % 2 === 0 ? "#ffffff" : "#fafbfc"
                    }}>
                      <td style={{ 
                        padding: "16px 12px",
                        fontWeight: "500",
                        color: "#1f2937"
                      }}>
                        {doc.name}
                      </td>
                      <td style={{ 
                        padding: "16px 12px",
                        color: "#6b7280"
                      }}>
                        {doc.workingHours}
                      </td>
                      <td style={{ 
                        padding: "16px 12px",
                        color: "#6b7280"
                      }}>
                        {doc.email}
                      </td>
                      <td style={{ 
                        padding: "16px 12px",
                        color: "#6b7280"
                      }}>
                        {doc.department}
                      </td>
                      <td style={{ padding: "16px 12px" }}>
                        <span style={getStatusStyle(doc.status)}>
                          {doc.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Patients Table */}
          {activeSection === "patient" && (
            <div style={{ overflowX: "auto" }}>
              <table style={{ 
                width: "100%", 
                borderCollapse: "collapse",
                fontSize: "14px"
              }}>
                <thead>
                  <tr style={{ backgroundColor: "#f8fafc" }}>
                    <th style={{ 
                      padding: "16px 12px", 
                      textAlign: "left", 
                      fontWeight: "600",
                      color: "#374151",
                      borderBottom: "2px solid #e5e7eb"
                    }}>
                      Patient's Name
                    </th>
                    <th style={{ 
                      padding: "16px 12px", 
                      textAlign: "left", 
                      fontWeight: "600",
                      color: "#374151",
                      borderBottom: "2px solid #e5e7eb"
                    }}>
                      Room Number
                    </th>
                    <th style={{ 
                      padding: "16px 12px", 
                      textAlign: "left", 
                      fontWeight: "600",
                      color: "#374151",
                      borderBottom: "2px solid #e5e7eb"
                    }}>
                      Bed Assignment
                    </th>
                    <th style={{ 
                      padding: "16px 12px", 
                      textAlign: "left", 
                      fontWeight: "600",
                      color: "#374151",
                      borderBottom: "2px solid #e5e7eb"
                    }}>
                      Treatment Status
                    </th>
                    <th style={{ 
                      padding: "16px 12px", 
                      textAlign: "left", 
                      fontWeight: "600",
                      color: "#374151",
                      borderBottom: "2px solid #e5e7eb"
                    }}>
                      Lab Report Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient, index) => (
                    <tr key={patient.id} style={{ 
                      borderBottom: "1px solid #f1f5f9",
                      backgroundColor: index % 2 === 0 ? "#ffffff" : "#fafbfc"
                    }}>
                      <td style={{ 
                        padding: "16px 12px",
                        fontWeight: "500",
                        color: "#1f2937"
                      }}>
                        {patient.name}
                      </td>
                      <td style={{ 
                        padding: "16px 12px",
                        color: "#6b7280"
                      }}>
                        {patient.roomNumber}
                      </td>
                      <td style={{ padding: "16px 12px" }}>
                        <span
                          style={{
                            backgroundColor: patient.bedAssignment.startsWith("Yes") ? "#10b981" : "#9ca3af",
                            color: "white",
                            padding: "4px 12px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "bold"
                          }}
                        >
                          {patient.bedAssignment}
                        </span>
                      </td>
                      <td style={{ padding: "16px 12px" }}>
                        <span style={getStatusStyle(patient.treatmentStatus)}>
                          {patient.treatmentStatus}
                        </span>
                      </td>
                      <td style={{ padding: "16px 12px" }}>
                        <span style={getStatusStyle(patient.labReportStatus)}>
                          {patient.labReportStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;