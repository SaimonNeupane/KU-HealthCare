import axios from "axios";

interface dataType {
  email: string;
  password: string;
}

const baseURL = axios.create({
  baseURL: "http://localhost:3000",
});

export const PateintDetials = () => baseURL.get("/receptionist/patient");
export const LoginAPI = (data: dataType) => baseURL.post("/user/login", data);
export const GetUserInfo = () => {
  const token = localStorage.getItem("token");
  return baseURL.get("/user/getinfo", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
