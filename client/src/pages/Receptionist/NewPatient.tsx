import { useEffect, useState } from "react";
import { FaSearch, FaExternalLinkAlt, FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { RegisterPatientAPI, ShowDoctorsAPI } from "../../utils/api";
import { useSocket } from "../../contexts/socketContext";
import DoctorsList from "../Admin/DoctorsList";
import { toast } from "sonner";
// import PatientsList from "../Admin/PatientList";

const Header: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isActive, setIsActive] = useState("2");
  const navigate = useNavigate();
  const handleChange = (a: string) => {
    setIsActive(a);
  };

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
            {/* <FaExternalLinkAlt className="w-5 h-5" /> */}
          </button>
        </div>
      </div>
    </header>
  );
};

type DepartmentName =
  | "oncology"
  | "gastroenterology"
  | "emergency-medicine"
  | "pediatrics"
  | "dermatology"
  | "general-medicine"
  | "neurology"
  | "psychiatry"
  | "orthopedics"
  | "cardiology";

const departments: DepartmentName[] = [
  "oncology",
  "gastroenterology",
  "emergency-medicine",
  "pediatrics",
  "dermatology",
  "general-medicine",
  "neurology",
  "psychiatry",
  "orthopedics",
  "cardiology",
];

const deptId: Record<DepartmentName, string> = {
  oncology: "2f5f36b8-92d9-410c-ba4b-a8dd334755fe",
  gastroenterology: "47b6d72f-c7ff-4709-b587-4d5949c709dc",
  "emergency-medicine": "577a10c7-78a7-458a-b35f-1ad71cd37927",
  pediatrics: "6d432e89-06fd-4184-a1e0-e3021ba0ba9b",
  dermatology: "75ad83bf-c2bc-4425-bfc3-a17ec9dc1f33",
  "general-medicine": "7759a8fa-42a5-429a-8411-69b6b468aa70",
  neurology: "976f9896-f8b3-4a8e-8d2f-5c44b4cf9f40",
  psychiatry: "aa5b0204-dfb9-4d3e-8cc3-2f1a8e16eeb5",
  orthopedics: "cd69dfd6-5894-4aca-be6e-f0f58d5f3c25",
  cardiology: "e1adf3b5-9499-46fb-8681-a76ebd0deda4",
};

interface Doctor {
  doctor_id: string;
  first_name: string;
  last_name: string;
  departmentId: string;
  department: any;
  roomId: any;
  room: {
    room_number: any;
  };
}

function NewPatient() {
  const [patientData, setPatientData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
    department: "",
    doctor: "",
    age: "",
    emergency: false,
  });

  const socket = useSocket();
  const [availableDocs, setAvailableDocs] = useState<Doctor[]>([]);
  const [showError, setShowError] = useState(false);
  const [error, setErr] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => {
        setShowError(false);
      }, 5000);
      return () => clearTimeout(timer); // Cleanup
    }
  }, [error]);

  useEffect(() => {
    console.log(availableDocs);
  }, [availableDocs]);

  // Validation function
  const validateFields = () => {
    const errors: Record<string, string> = {};

    if (!patientData.firstName.trim()) {
      errors.firstName = "First name is required";
    }

    if (!patientData.lastName.trim()) {
      errors.lastName = "Last name is required";
    }

    if (!patientData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(patientData.email)) {
      errors.email = "Email format is invalid";
    }

    if (!patientData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(patientData.phone.replace(/\D/g, ""))) {
      errors.phone = "Phone number must be 10 digits";
    }

    if (!patientData.gender) {
      errors.gender = "Gender is required";
    }

    if (!patientData.age.trim()) {
      errors.age = "Age is required";
    } else if (
      parseInt(patientData.age) <= 0 ||
      parseInt(patientData.age) > 150
    ) {
      errors.age = "Age must be between 1 and 150";
    }

    if (!patientData.address.trim()) {
      errors.address = "Address is required";
    }

    if (!patientData.department) {
      errors.department = "Department is required";
    }

    if (!patientData.doctor) {
      errors.doctor = "Doctor is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const selectedDoctor = availableDocs.find(
    (doc) => doc.doctor_id === patientData.doctor
  );

  // Create finalData dynamically when needed
  const getFinalData = () => {
    return {
      is_emergency: patientData.emergency,
      doctorId: patientData.doctor,
      roomId: selectedDoctor?.roomId || null,
      departmentId: deptId[patientData.department as DepartmentName],
      patientDetails: {
        first_name: patientData.firstName,
        last_name: patientData.lastName,
        age: parseInt(patientData.age),
        gender: patientData.gender,
        contact_number: patientData.phone,
        address: patientData.address,
      },
    };
  };

  useEffect(() => {
    async function fetchDocs() {
      if (patientData.department) {
        try {
          const res = await ShowDoctorsAPI(
            deptId[patientData.department as DepartmentName]
          );
          if (res.data.status === "success") {
            setAvailableDocs(res.data.AvailableDoctor);
            console.log(availableDocs);
          }
        } catch (error: any) {
          console.error("Error fetching doctors:", error);
          setShowError(true);
          setErr(true);

          setAvailableDocs([]);
        }
      } else {
        setAvailableDocs([]);
      }
    }
    fetchDocs();
  }, [patientData.department]);

  async function handleSubmit() {
    if (!validateFields()) {
      return;
    }

    if (!socket) return;
    const toastId = toast.loading("Registraion in progress");

    try {
      socket.emit("new-patient-registered", {
        patientName: `${patientData.firstName} ${patientData.lastName}`,
        email: `${patientData.email}`,
      });
      const finalData = getFinalData();
      console.log(finalData);
      const response = await RegisterPatientAPI(finalData);
      toast.success("Registration successful", {
        id: toastId,
      });
      console.log("Patient registered successfully:", response.data);
      // Reset form on success
      setPatientData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        gender: "",
        address: "",
        department: "",
        doctor: "",
        age: "",
        emergency: false,
      });
      setValidationErrors({});
    } catch (err: any) {
      toast.error(`Registration failed: ${err.response.data.message}`, {
        id: toastId,
      });
      console.error("Error registering patient:", error);
      // Handle error (show error message to user)
    }
  }

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
              {/* First Name */}
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={patientData.firstName}
                  onChange={(e) =>
                    setPatientData({
                      ...patientData,
                      firstName: e.target.value,
                    })
                  }
                  placeholder="Enter first name"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors text-sm ${
                    validationErrors.firstName
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {validationErrors.firstName && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationErrors.firstName}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={patientData.lastName}
                  onChange={(e) =>
                    setPatientData({ ...patientData, lastName: e.target.value })
                  }
                  placeholder="Enter last name"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors text-sm ${
                    validationErrors.lastName
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {validationErrors.lastName && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationErrors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
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
                className={`w-1/2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors text-sm ${
                  validationErrors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {validationErrors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.email}
                </p>
              )}
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
                placeholder="Enter phone number"
                className={`w-1/2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors text-sm ${
                  validationErrors.phone ? "border-red-500" : "border-gray-300"
                }`}
              />
              {validationErrors.phone && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.phone}
                </p>
              )}
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
                    className={`flex items-center space-x-2 border rounded-lg px-3 py-2 w-full max-w-[120px] cursor-pointer focus-within:ring-2 focus-within:ring-green-500 ${
                      validationErrors.gender
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
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
            {validationErrors.gender && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.gender}
              </p>
            )}

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
                placeholder="Enter age"
                className={`w-1/2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors text-sm ${
                  validationErrors.age ? "border-red-500" : "border-gray-300"
                }`}
              />
              {validationErrors.age && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.age}
                </p>
              )}
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
                placeholder="Enter address"
                className={`w-1/2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors text-sm ${
                  validationErrors.address
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {validationErrors.address && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.address}
                </p>
              )}
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
                className={`w-1/2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors bg-white text-sm ${
                  validationErrors.department
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept.charAt(0).toUpperCase() + dept.slice(1)}
                  </option>
                ))}
              </select>
              {validationErrors.department && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.department}
                </p>
              )}
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
                disabled={
                  !patientData.department ||
                  !availableDocs ||
                  availableDocs.length === 0
                }
                className={`w-1/2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors bg-white disabled:bg-gray-50 disabled:text-gray-500 text-sm ${
                  validationErrors.doctor ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select available Doctor</option>
                {availableDocs.length > 0 &&
                  availableDocs.map((doctor) => (
                    <option key={doctor.doctor_id} value={doctor.doctor_id}>
                      Dr.{doctor.first_name} {doctor.last_name}__
                      {doctor.room.room_number}
                    </option>
                  ))}
              </select>
              {validationErrors.doctor && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.doctor}
                </p>
              )}
              {showError && (
                <p className="text-red-500 text-xs mt-1">No doctor online</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4 ">
              <button
                type="button"
                className="w-[50%] bg-[#009963] hover:bg-green-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                onClick={handleSubmit}
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
