import axios from "axios";
const apiUrl = import.meta.env.VITE_URL;

interface loginDataType {
  email: string;
  password: string;
}

interface patientDataType {
  is_emergency: boolean;
  doctorId: string;
  departmentId: string;
  patientDetails: {
    first_name: string;
    last_name: string;
    age: number;
    gender: string;
    contact_number: string;
    address: string;
  };
}

const baseURL = axios.create({
  baseURL: apiUrl,
});

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// AUTH API
export const LoginAPI = (data: loginDataType) =>
  baseURL.post("/user/login", data);

export const GetUserInfo = () => {
  return baseURL.get("/user/getinfo", {
    headers: getAuthHeaders(),
  });
};

// DOCTOR APIs
export const DoctorPatientAPI = () => {
  return baseURL.get("/doctor/patientdetails", {
    headers: getAuthHeaders(),
  });
};

export const doctorDiagnosisOnePatientAPI = ({ id }: { id: String }) => {
  return baseURL.get(`/doctor/onePatientForDiagnosis/${id}`, {
    headers: getAuthHeaders(),
  });
};

export const completeDiagnosisAPI = (patientId: string) => {
  return baseURL.post(
    `/doctor/completediagnosis/${patientId}`,
    {},
    {
      headers: getAuthHeaders(),
    }
  );
};

export const bedManagementAPI = ({ patientId }: { patientId: string }) => {
  return baseURL.post(
    `/doctor/bedquery/${patientId}`,
    {},
    {
      headers: getAuthHeaders(),
    }
  );
};

export const requestLabReportAPI = ({
  patientId,
  appointment_id,
}: {
  patientId: string;
  appointment_id: string;
}) => {
  return baseURL.post(
    "/doctor/requestlab",
    {
      appointment_id,
      patientId,
    },
    {
      headers: getAuthHeaders(),
    }
  );
};

export const bedQueryAPI = (patientId: string) => {
  return baseURL.post(
    `/doctor/querybed/${patientId}`,
    {},
    {
      headers: getAuthHeaders(),
    }
  );
};

// RECEPTIONIST APIs
export const PateintDetials = () => {
  return baseURL.get("/receptionist/patient", {
    headers: getAuthHeaders(),
  });
};

export const RegisterPatientAPI = (patientDetails: patientDataType) => {
  return baseURL.post("/receptionist/register", patientDetails, {
    headers: getAuthHeaders(),
  });
};

export const ShowDoctorsAPI = (dep_id: string) => {
  return baseURL.get(`/receptionist/availableDocs/${dep_id}`, {
    headers: getAuthHeaders(),
  });
};

export const RecepPatientAPI = () => {
  return baseURL.get("/receptionist/patient", {
    headers: getAuthHeaders(),
  });
};

export const RecepDoctorAPI = () => {
  return baseURL.get("/receptionist/dashboard", {
    headers: getAuthHeaders(),
  });
};

// LAB ASSISTANT APIs
export const LabAssistantAPI = () => {
  return baseURL.get("/lab/labreport", {
    headers: getAuthHeaders(),
  });
};

export const labStatusAPI = (id: string) =>
  baseURL.patch(`/lab/labreport/status/${id}`);

export const adminDashboardAPI = () => {
  return baseURL.get("/admin/dashboard");
};

export const adminDocDetialsAPI = () => {
  return baseURL.get("/admin/docDetails");
};

export const labAssistantsAPI = () => {
  return baseURL.get("/admin/labassistant").then((response) => {
    return response;
  });
};

export const adminAppointmentsAPI = () => {
  return baseURL.get("/admin/appointments");
};

export const adminPatientssAPI = () => {
  return baseURL.get("/admin/patients");
};

export const adminRecepAPI = () => {
  return baseURL.get("/admin/receptionists");
};

export const addDocAPI = (data: any) =>
  baseURL.post("/admin/create/doctor", data);

export const addRecepAPI = (data: any) =>
  baseURL.post("/admin/create/recep", data);

export const addLabAssAPI = (data: any) =>
  baseURL.post("/admin/create/lab", data);

// ADMIN UPDATE APIs (NO AUTH HEADERS)
export const updateDocAPI = (id: string, data: any) =>
  baseURL.patch(`/admin/update/doctor/${id}`, data);

export const updateRecepAPI = (id: string, data: any) =>
  baseURL.patch(`/admin/update/recep/${id}`, data);

export const updateLabAssAPI = (id: string, data: any) =>
  baseURL.patch(`/admin/update/lab/${id}`, data);

export const deleteRecepAPI = (id: string) =>
  baseURL.delete(`/admin/delete/recep/${id}`);

export const deleteLabAssAPI = (id: string) =>
  baseURL.delete(`/admin/delete/lab/${id}`);

export const deleteNotifAPI = (id: string) =>
  baseURL.delete(`/notifications/${id}`);

export const getNotifAPI = (id: string) => baseURL.get(`/notifications/${id}`);

export const getNotificationsAPI = (userId: string) => {
  return baseURL.get(`/notification/${userId}`);
};

export const deleteNotificationAPI = (notificationId: string) => {
  return baseURL.delete(`/notification/${notificationId}`);
};

// Aliases for signup component
export const addLabAssistantAPI = addLabAssAPI;
export const addReceptionistAPI = addRecepAPI;
