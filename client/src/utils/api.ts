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

export const PateintDetials = () => baseURL.get("/receptionist/patient");
export const LoginAPI = (data: loginDataType) =>
  baseURL.post("/user/login", data);
export const GetUserInfo = () => {
  const token = localStorage.getItem("token");
  return baseURL.get("/user/getinfo", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const RegisterPatientAPI = (patientDetails: patientDataType) =>
  baseURL.post("/receptionist/register", patientDetails);

export const ShowDoctorsAPI = (dep_id: string) =>
  baseURL.get(`/receptionist/availableDocs/${dep_id}`);

export const LabAssistantAPI = () => baseURL.get("/lab/labreport");

export const RecepPatientAPI = () => baseURL.get("/receptionist/patient");

export const RecepDoctorAPI = () => baseURL.get("/receptionist/dashboard");

export const DoctorPatientAPI = () => baseURL.get("/doctor/patientdetails");

export const adminDashboardAPI = (): any => baseURL.get("/admin/dashboard");
export const adminDocDetialsAPI = (): any => baseURL.get("/admin/docDetails");
export const adminAppointmentsAPI = (): any =>
  baseURL.get("/admin/appointments");
export const adminPatientssAPI = (): any => baseURL.get("/admin/patients");
export const adminRecepAPI = (): any => baseURL.get("/admin/receptionists");

export const doctorDiagnosisOnePatientAPI = ({ id }: { id: String }) => {
  return baseURL.get(`/doctor/onePatientForDiagnosis/${id}`);
};

export const completeDiagnosisAPI = ({ patientId }: { patientId: string }) => {
  return baseURL.post(`/doctor/completediagnosis/${patientId}`);
};
export const bedManagementAPI = ({ patientId }: { patientId: string }) => {
  return baseURL.post(`/doctor/bedquery/${patientId}`);
};
export const requestLabReportAPI = ({
  patientId,
  appointment_id,
  doctorId,
}: {
  patientId: string;
  appointment_id: string;
  doctorId: string;
}) => {
  return baseURL.post("/doctor/labrequest", {
    appointment_id,
    patientId,
    doctorId,
  });
};
