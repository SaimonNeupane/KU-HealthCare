import { useEffect, useState } from "react";
import { Eye, EyeOff, Hospital } from "lucide-react";
import { useParams, useNavigate } from "react-router";
import { addDocAPI, addLabAssAPI, addRecepAPI } from "../utils/api";

// Exact department data from your database
const departments = [
  {
    department_id: "e1adf3b5-9499-46fb-8681-a76ebd0deda4",
    name: "Cardiology",
    description: "Heart and cardiovascular system specialists",
  },
  {
    department_id: "47b6d72f-c7ff-4709-b587-4d5949c709dc",
    name: "Gastroenterology",
    description: "Digestive system and liver specialists",
  },
  {
    department_id: "aa5b0204-dfb9-4d3e-8cc3-2f1a8e16eeb5",
    name: "Psychiatry",
    description: "Mental health and behavioral specialists",
  },
  {
    department_id: "577a10c7-78a7-458a-b35f-1ad71cd37927",
    name: "Emergency Medicine",
    description: "Emergency and urgent care services",
  },
  {
    department_id: "75ad83bf-c2bc-4425-bfc3-a17ec9dc1f33",
    name: "Dermatology",
    description: "Skin, hair, and nail specialists",
  },
  {
    department_id: "976f9896-f8b3-4a8e-8d2f-5c44b4cf9f40",
    name: "Neurology",
    description: "Brain and nervous system specialists",
  },
  {
    department_id: "6d432e89-06fd-4184-a1e0-e3021ba0ba9b",
    name: "Pediatrics",
    description: "Medical care for infants, children, and adolescents",
  },
  {
    department_id: "2f5f36b8-92d9-410c-ba4b-a8dd334755fe",
    name: "Oncology",
    description: "Cancer treatment and care specialists",
  },
  {
    department_id: "7759a8fa-42a5-429a-8411-69b6b468aa70",
    name: "General Medicine",
    description: "General medical care and consultation services",
  },
  {
    department_id: "cd69dfd6-5894-4aca-be6e-f0f58d5f3c25",
    name: "Orthopedics",
    description: "Bone, joint, and musculoskeletal system care",
  },
];

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userRole, setUserRole] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [workingFrom, setWorkingFrom] = useState("09:00");
  const [workingTo, setWorkingTo] = useState("17:00");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({
    fullName: false,
    username: false,
    email: false,
    phone: false,
    password: false,
    confirmPassword: false,
    userRole: false,
    passwordMatch: false,
    specialization: false,
    departmentName: false,
    roomNumber: false,
  });

  const { role } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(role);
    if (!role) return;
    setUserRole(role);
  }, [role]);

  // Auto-generate username when full name or email changes
  useEffect(() => {
    if (fullName) {
      const nameParts = fullName.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      const autoUsername =
        `${firstName.toLowerCase()}.${lastName.toLowerCase()}`.replace(
          /\s+/g,
          ""
        );
      setUsername(autoUsername);
    } else if (email) {
      const emailUsername = email.split("@")[0];
      setUsername(emailUsername);
    }
  }, [fullName, email]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateForm = () => {
    const errors = {
      fullName: fullName.trim() === "",
      username: username.trim() === "",
      email: email.trim() === "",
      password: password.trim() === "",
      confirmPassword: confirmPassword.trim() === "",
      userRole: userRole.trim() === "",
      phone: phone.trim() === "",
      passwordMatch:
        password !== confirmPassword &&
        password.trim() !== "" &&
        confirmPassword.trim() !== "",
      // Additional validation for doctor role
      specialization:
        role?.toLowerCase() === "doctor" && specialization.trim() === "",
      departmentName: role?.toLowerCase() === "doctor" && departmentName === "",
      roomNumber: role?.toLowerCase() === "doctor" && roomNumber.trim() === "",
    };

    setFormErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  const getAPIFunction = () => {
    switch (role?.toLowerCase()) {
      case "doctor":
        return addDocAPI;
      case "labassistant":
      case "lab-assistant":
      case "lab_assistant":
      case "lab":
        return addLabAssAPI;
      case "receptionist":
      case "recep":
        return addRecepAPI;
      default:
        throw new Error(`Invalid role: ${role}`);
    }
  };

  const formatUserData = () => {
    // Split full name into first and last name
    const nameParts = fullName.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const baseData = {
      first_name: firstName,
      last_name: lastName,
      username: username.trim(),
      email: email.trim(),
      password: password,
      phone: phone.trim(),
    };

    // Add role-specific data based on the role
    switch (role?.toLowerCase()) {
      case "doctor":
        return {
          ...baseData,
          role: "doctor",
          specialization: specialization.trim(),
          department_name: departmentName, // This will now be the correct name from database
          room_number: roomNumber.trim(),
          workingFrom: workingFrom,
          workingTo: workingTo,
        };

      case "labassistant":
      case "lab-assistant":
      case "lab_assistant":
      case "lab":
        return {
          ...baseData,
        };

      case "receptionist":
      case "recep":
        return {
          ...baseData,
        };

      default:
        return baseData;
    }
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const apiFunction = getAPIFunction();
      const userData = formatUserData();

      console.log("Submitting user data:", userData);

      const response = await apiFunction(userData);

      if (response.status === 201 || response.data.status === "success") {
        console.log(`${role} added successfully!`);
        // Navigate back to admin dashboard or appropriate page
        navigate("/admin/dashboard");
      } else {
        console.log(response.data.message || `Failed to add ${role}`);
      }
    } catch (error: any) {
      console.error(`Error adding ${role}:`, error);

      if (error.response?.data?.error) {
        console.log(`Error: ${error.response.data.error}`);
      } else if (error.response?.data?.message) {
        console.log(`Error: ${error.response.data.message}`);
      } else if (error.message) {
        console.log(`Error: ${error.message}`);
      } else {
        console.log(`Failed to add ${role}. Please try again.`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDoctorRole = role?.toLowerCase() === "doctor";

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center py-8 px-4">
        {/* Hospital Icon Banner */}
        <div className="text-center mb-6">
          <Hospital size={96} className="text-green-600 mx-auto" />
        </div>

        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-800">
              Add New {role}
            </h1>
          </div>

          <div className="space-y-6">
            {/* Full Name field */}
            <div className="space-y-2">
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (e.target.value.trim() !== "") {
                    setFormErrors({ ...formErrors, fullName: false });
                  }
                }}
                placeholder="Enter full name"
                className={`w-full px-3 py-2 rounded-md bg-white border ${
                  formErrors.fullName ? "border-red-500" : "border-gray-200"
                } focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-500`}
                required
                disabled={isSubmitting}
              />
              {formErrors.fullName && (
                <p className="text-red-500 text-xs mt-1">
                  Full name is required
                </p>
              )}
            </div>

            {/* Username field */}
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (e.target.value.trim() !== "") {
                    setFormErrors({ ...formErrors, username: false });
                  }
                }}
                placeholder="Enter username"
                className={`w-full px-3 py-2 rounded-md bg-white border ${
                  formErrors.username ? "border-red-500" : "border-gray-200"
                } focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-500`}
                required
                disabled={isSubmitting}
              />
              {formErrors.username && (
                <p className="text-red-500 text-xs mt-1">
                  Username is required
                </p>
              )}
              <p className="text-gray-500 text-xs">
                Username will be auto-generated from your name
              </p>
            </div>

            {/* Email field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (e.target.value.trim() !== "") {
                    setFormErrors({ ...formErrors, email: false });
                  }
                }}
                placeholder="Enter email address"
                className={`placeholder:text-gray-500 w-full px-3 py-2 rounded-md bg-white border ${
                  formErrors.email ? "border-red-500" : "border-gray-200"
                } focus:outline-none focus:ring-2 focus:ring-green-500`}
                required
                disabled={isSubmitting}
              />
              {formErrors.email && (
                <p className="text-red-500 text-xs mt-1">Email is required</p>
              )}
            </div>

            {/* Phone Number field */}
            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="phone"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (e.target.value.trim() !== "") {
                    setFormErrors({ ...formErrors, phone: false });
                  }
                }}
                placeholder="Enter phone number"
                className={`w-full px-3 py-2 rounded-md bg-white border ${
                  formErrors.phone ? "border-red-500" : "border-gray-200"
                } focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-500`}
                required
                disabled={isSubmitting}
              />
              {formErrors.phone && (
                <p className="text-red-500 text-xs mt-1">Phone is required</p>
              )}
            </div>

            {/* Doctor-specific fields */}
            {isDoctorRole && (
              <>
                {/* Department Selection */}
                <div className="space-y-2">
                  <label
                    htmlFor="departmentName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="departmentName"
                    value={departmentName}
                    onChange={(e) => {
                      setDepartmentName(e.target.value);
                      if (e.target.value !== "") {
                        setFormErrors({ ...formErrors, departmentName: false });
                      }
                    }}
                    className={`w-full px-3 py-2 rounded-md bg-white border ${
                      formErrors.departmentName
                        ? "border-red-500"
                        : "border-gray-200"
                    } focus:outline-none focus:ring-2 focus:ring-green-500`}
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.department_id} value={dept.name}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.departmentName && (
                    <p className="text-red-500 text-xs mt-1">
                      Department is required
                    </p>
                  )}
                  {departmentName && (
                    <p className="text-gray-500 text-xs mt-1">
                      {
                        departments.find((d) => d.name === departmentName)
                          ?.description
                      }
                    </p>
                  )}
                </div>

                {/* Specialization field */}
                <div className="space-y-2">
                  <label
                    htmlFor="specialization"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Specialization <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="specialization"
                    value={specialization}
                    onChange={(e) => {
                      setSpecialization(e.target.value);
                      if (e.target.value.trim() !== "") {
                        setFormErrors({ ...formErrors, specialization: false });
                      }
                    }}
                    placeholder="Enter specialization"
                    className={`w-full px-3 py-2 rounded-md bg-white border ${
                      formErrors.specialization
                        ? "border-red-500"
                        : "border-gray-200"
                    } focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-500`}
                    required
                    disabled={isSubmitting}
                  />
                  {formErrors.specialization && (
                    <p className="text-red-500 text-xs mt-1">
                      Specialization is required
                    </p>
                  )}
                </div>

                {/* Room Number field */}
                <div className="space-y-2">
                  <label
                    htmlFor="roomNumber"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Room Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="roomNumber"
                    value={roomNumber}
                    onChange={(e) => {
                      setRoomNumber(e.target.value);
                      if (e.target.value.trim() !== "") {
                        setFormErrors({ ...formErrors, roomNumber: false });
                      }
                    }}
                    placeholder="Enter room number"
                    className={`w-full px-3 py-2 rounded-md bg-white border ${
                      formErrors.roomNumber
                        ? "border-red-500"
                        : "border-gray-200"
                    } focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-500`}
                    required
                    disabled={isSubmitting}
                  />
                  {formErrors.roomNumber && (
                    <p className="text-red-500 text-xs mt-1">
                      Room number is required
                    </p>
                  )}
                </div>

                {/* Working Hours */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="workingFrom"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Working From
                    </label>
                    <input
                      type="time"
                      id="workingFrom"
                      value={workingFrom}
                      onChange={(e) => setWorkingFrom(e.target.value)}
                      className="w-full px-3 py-2 rounded-md bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="workingTo"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Working To
                    </label>
                    <input
                      type="time"
                      id="workingTo"
                      value={workingTo}
                      onChange={(e) => setWorkingTo(e.target.value)}
                      className="w-full px-3 py-2 rounded-md bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Password field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (e.target.value.trim() !== "") {
                      setFormErrors({ ...formErrors, password: false });
                    }
                  }}
                  placeholder="Enter password"
                  className={`placeholder:text-gray-500 w-full px-3 py-2 rounded-md bg-white border ${
                    formErrors.password ? "border-red-500" : "border-gray-200"
                  } focus:outline-none focus:ring-2 focus:ring-green-500`}
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={togglePasswordVisibility}
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {formErrors.password && (
                <p className="text-red-500 text-xs mt-1">
                  Password is required
                </p>
              )}
            </div>

            {/* Confirm Password field */}
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (e.target.value.trim() !== "") {
                      setFormErrors({ ...formErrors, confirmPassword: false });
                    }
                  }}
                  placeholder="Confirm password"
                  className={`placeholder:text-gray-500 w-full px-3 py-2 rounded-md bg-white border ${
                    formErrors.confirmPassword || formErrors.passwordMatch
                      ? "border-red-500"
                      : "border-gray-200"
                  } focus:outline-none focus:ring-2 focus:ring-green-500`}
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={toggleConfirmPasswordVisibility}
                  disabled={isSubmitting}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {formErrors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  Confirm password is required
                </p>
              )}
              {formErrors.passwordMatch && (
                <p className="text-red-500 text-xs mt-1">
                  Passwords do not match
                </p>
              )}
            </div>

            {/* User Role Display (Read-only) */}
            <div className="space-y-2">
              <label
                htmlFor="userRole"
                className="block text-sm font-medium text-gray-700"
              >
                User Role <span className="text-red-500">*</span>
              </label>
              <div className="w-full px-3 py-2 rounded-md bg-gray-100 border border-gray-200 text-gray-700">
                {role || "Role not specified"}
              </div>
            </div>

            {/* Submit button */}
            <div>
              <button
                onClick={handleSignup}
                disabled={isSubmitting}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
              >
                {isSubmitting ? `Adding ${role}...` : `Add ${role}`}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Signup;
