import axios from "axios";

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
  baseURL: "http://localhost:3000",
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
