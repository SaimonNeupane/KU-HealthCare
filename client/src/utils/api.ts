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

export const LoginAPI = (data: loginDataType) =>
  baseURL.post("/user/login", data);

export const GetUserInfo = () => {
  return baseURL.get("/user/getinfo", {
    headers: getAuthHeaders(),
  });
};

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

export const completeDiagnosisAPI = ({ patientId }: { patientId: string }) => {
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

// ✅ FIXED: Added Authorization headers to receptionist APIs
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

// ✅ FIXED: Added Authorization headers to lab APIs
export const LabAssistantAPI = () => {
  return baseURL.get("/lab/labreport", {
    headers: getAuthHeaders(),
  });
};

// ✅ FIXED: Added Authorization headers to admin APIs
export const adminDashboardAPI = (): any => {
  return baseURL.get("/admin/dashboard", {
    headers: getAuthHeaders(),
  });
};

export const adminDocDetialsAPI = (): any => {
  return baseURL.get("/admin/docDetails", {
    headers: getAuthHeaders(),
  });
};

export const adminAppointmentsAPI = (): any => {
  return baseURL.get("/admin/appointments", {
    headers: getAuthHeaders(),
  });
};

export const adminPatientssAPI = (): any => {
  return baseURL.get("/admin/patients", {
    headers: getAuthHeaders(),
  });
};

export const adminRecepAPI = (): any => {
  return baseURL.get("/admin/receptionists", {
    headers: getAuthHeaders(),
  });
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
