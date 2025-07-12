import { useEffect, useState } from "react";
import { FaSearch, FaExternalLinkAlt, FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {PateintDetials} from '../../utils/api'
// import PatientsList from "../Admin/PatientList";

const Header: React.FC = () => {
  const [response,setResponse]=useState(null)
  
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isActive, setIsActive] = useState("2");
  const navigate = useNavigate();
  const handleChange = (a: string) => {
    setIsActive(a);
  };
  useEffect(()=>{
    PateintDetials().then((res:any)=>{
    setResponse(res.data)
  })
  
  },[])
  
  useEffect(()=>{
    console.log(response)
  },[response])

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Side - Logo and Navigation */}
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">◆</span>
            </div>
            <span className="text-gray-900 font-semibold text-lg">
              KU Health Care
            </span>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center space-x-4">
            <button
              className={`flex items-center space-x-2 px-4 py-2 ${
                isActive == "1" ? " bg-green-900" : "bg-white"
              } text-gray-600 rounded-full font-medium hover:bg-white-900 transition-colors`}
              onClick={() => {
                handleChange("1");
                navigate("/receptionist/dashboard");
              }}
            >
              <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                <div className={`w-2 h-2  rounded-full`}></div>
              </div>
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => {
                handleChange("2");
                navigate("/receptionist/newpatient");
              }}
              className={`flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-white-900 transition-colors ${
                isActive == "2"
                  ? "bg-green-900 rounded-full text-white"
                  : "bg-white"
              }`}
            >
              <FaCalendarAlt className="w-4 h-4" />
              <span className="font-medium">Register Patient</span>
            </button>
          </div>
        </div>

        {/* Right Side - Search and Export */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors w-64"
            />
          </div>

          <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
            <FaExternalLinkAlt className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

type DepartmentName =
  | "cardiology"
  | "neurology"
  | "orthopedics"
  | "pediatrics"
  | "general"
  | "emergency";

const departments: Record<DepartmentName, string[]> = {
  cardiology: ["Dr. Parikchit Sen", "Dr. Keshav Raj Sharma"],
  neurology: ["Dr. Saimon Neupane", "Dr. Risham Raj Byahut"],
  orthopedics: ["Dr. Prabesh Sharma", "Dr. Pitambar Chaudhary"],
  pediatrics: ["Dr. Salon Timilsina", "Dr. Udaya Ojha"],
  general: ["Dr. Gaurav Bista", "Dr. Shriharsha Acharya"],
  emergency: ["Dr. Prabesh Ojha", "Dr. Piyush Bhat"],
};

function NewPatient() {
  const [patientData, setPatientData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
    department: "",
    doctor: "",
    age: "",
    emergency: false,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-6 py-2">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Register New Patient
            </h1>
            <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
              Collect patient's name, email, phone number, date of birth,
              gender, and address. Display created at timestamp. Include a field
              to indicate if the patient is admitted to emergency, alongside the
              number of available beds.
            </p>
          </div>

          {/* Emergency Checkbox */}
          <div className="mb-8">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={patientData.emergency}
                onChange={(e) =>
                  setPatientData({
                    ...patientData,
                    emergency: e.target.checked,
                  })
                }
                className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
              />
              <span className="text-sm font-medium text-gray-700">
                Emergency
              </span>
            </label>
          </div>

          <div className="max-w-2xl space-y-6">
            {/* Name and Email Row */}
            <div className="flex gap-4">
              {/* Name - 25% */}
              <div className="w-1/1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={patientData.name}
                  onChange={(e) =>
                    setPatientData({ ...patientData, name: e.target.value })
                  }
                  placeholder="Enter name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors text-sm"
                />
              </div>

              {/* Email - 25% */}
              <div className="w-1/1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={patientData.email}
                  onChange={(e) =>
                    setPatientData({ ...patientData, email: e.target.value })
                  }
                  placeholder="Enter email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors text-sm"
                />
              </div>

              {/* Spacer - 50% blank */}
              <div className="w-1/2" />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={patientData.phone}
                onChange={(e) =>
                  setPatientData({ ...patientData, phone: e.target.value })
                }
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors text-sm"
              />
            </div>

            {/* Gender */}
            <div className="flex items-center space-x-4">
              <label className="block text-sm font-medium text-gray-700 w-20">
                Gender
              </label>
              <div className="flex space-x-4 w-full">
                {["male", "female", "others"].map((gender) => (
                  <label
                    key={gender}
                    className="flex items-center space-x-2 border border-gray-300 rounded-lg px-3 py-2 w-full max-w-[120px] cursor-pointer focus-within:ring-2 focus-within:ring-green-500"
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={gender}
                      checked={patientData.gender === gender}
                      onChange={(e) =>
                        setPatientData({
                          ...patientData,
                          gender: e.target.value,
                        })
                      }
                      className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">
                      {gender}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              <input
                type="number"
                name="age"
                value={patientData.age}
                onChange={(e) =>
                  setPatientData({ ...patientData, age: e.target.value })
                }
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors text-sm"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={patientData.address}
                onChange={(e) =>
                  setPatientData({ ...patientData, address: e.target.value })
                }
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors text-sm"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <select
                name="department"
                value={patientData.department}
                onChange={(e) =>
                  setPatientData({
                    ...patientData,
                    department: e.target.value,
                    doctor: "",
                  })
                }
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors bg-white text-sm"
              >
                <option value="">Select Department</option>
                {Object.keys(departments).map((dept) => (
                  <option key={dept} value={dept}>
                    {dept.charAt(0).toUpperCase() + dept.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Doctor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Doctor
              </label>
              <select
                name="doctor"
                value={patientData.doctor}
                onChange={(e) =>
                  setPatientData({ ...patientData, doctor: e.target.value })
                }
                disabled={!patientData.department}
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors bg-white disabled:bg-gray-50 disabled:text-gray-500 text-sm"
              >
                <option value="">Select available Doctor</option>
                {patientData.department &&
                  departments[patientData.department as DepartmentName].map(
                    (doctor) => (
                      <option key={doctor} value={doctor}>
                        {doctor}
                      </option>
                    )
                  )}
              </select>
            </div>

            {/* Submit Button */}
            <div className="pt-4 ">
              <button
                type="button"
                className="w-[50%] bg-[#009963] hover:bg-green-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewPatient;
