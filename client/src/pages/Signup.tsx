import { useEffect, useState } from "react";
import { Eye, EyeOff, Hospital } from "lucide-react";
import { useParams } from "react-router";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userRole, setUserRole] = useState("");
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [formErrors, setFormErrors] = useState({
    fullName: false,
    email: false,
    phone: false,
    password: false,
    confirmPassword: false,
    userRole: false,
    passwordMatch: false,
  });
  const { role } = useParams();

  useEffect(() => {
    console.log(role);
    if (!role) return;
    setUserRole(role);
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateForm = () => {
    const errors = {
      fullName: fullName.trim() === "",
      email: email.trim() === "",
      password: password.trim() === "",
      confirmPassword: confirmPassword.trim() === "",
      userRole: userRole.trim() === "",
      phone: phone.trim() === "",
      passwordMatch:
        password !== confirmPassword &&
        password.trim() !== "" &&
        confirmPassword.trim() !== "",
    };

    setFormErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  const handleSignup = () => {
    if (validateForm()) {
      // poxi api call garne
      alert("Submitted");
      console.log("Signup attempt with:", {
        fullName,
        email,
        password,
        confirmPassword,
        userRole,
      });
    }
  };

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
            {/* <span className="font-bold text-xl text-green-600 px-5 py-3">KU HealthCare</span> */}
            <h1 className="text-2xl font-semibold text-gray-800">
              Create your account
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
                placeholder="Enter your full name"
                className={`w-full px-3 py-2 rounded-md bg-white border ${
                  formErrors.fullName ? "border-red-500" : "border-gray-200"
                } focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-500`}
                required
              />
              {formErrors.fullName && (
                <p className="text-red-500 text-xs mt-1">
                  Full name is required
                </p>
              )}
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
                placeholder="Enter your email address"
                className={`placeholder:text-gray-500 w-full px-3 py-2 rounded-md bg-white border ${
                  formErrors.email ? "border-red-500" : "border-gray-200"
                } focus:outline-none focus:ring-2 focus:ring-green-500`}
                required
              />
              {formErrors.email && (
                <p className="text-red-500 text-xs mt-1">Email is required</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
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
                placeholder="Enter your Phone Number"
                className={`w-full px-3 py-2 rounded-md bg-white border ${
                  formErrors.phone ? "border-red-500" : "border-gray-200"
                } focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-500`}
                required
              />
              {formErrors.phone && (
                <p className="text-red-500 text-xs mt-1">Phone is required</p>
              )}
            </div>

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
                  placeholder="Enter your password"
                  className={`placeholder:text-gray-500 w-full px-3 py-2 rounded-md bg-white border ${
                    formErrors.password ? "border-red-500" : "border-gray-200"
                  } focus:outline-none focus:ring-2 focus:ring-green-500`}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={togglePasswordVisibility}
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
                  placeholder="Enter your password again"
                  className={`placeholder:text-gray-500 w-full px-3 py-2 rounded-md bg-white border ${
                    formErrors.confirmPassword || formErrors.passwordMatch
                      ? "border-red-500"
                      : "border-gray-200"
                  } focus:outline-none focus:ring-2 focus:ring-green-500`}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={toggleConfirmPasswordVisibility}
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

            {/* User Role Dropdown */}
            <div className="space-y-2">
              <label
                htmlFor="userRole"
                className="block text-sm font-medium text-gray-700"
              >
                User Role <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div
                  onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                  className={`w-full px-3 py-2 rounded-md bg-white border ${
                    formErrors.userRole ? "border-red-500" : "border-gray-200"
                  } focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer flex justify-between items-center`}
                >
                  <span
                    className={userRole ? "text-gray-900" : "text-gray-500"}
                  >
                    {userRole || "Select a Role"}
                  </span>
                  {/* <ChevronDown size={20} className="text-gray-400" /> */}
                </div>

                {/* {showRoleDropdown && (
                  <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    {userRoles.map((role) => (
                      <div
                        key={role}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setUserRole(role);
                          setShowRoleDropdown(false);
                          setFormErrors({ ...formErrors, userRole: false });
                        }}
                      >
                        {role}
                      </div>
                    ))}
                  </div>
                )} */}
              </div>
              {formErrors.userRole && (
                <p className="text-red-500 text-xs mt-1">
                  User role is required
                </p>
              )}
            </div>

            {/* Sign up button */}
            <div>
              <button
                onClick={handleSignup}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {`Add ${role}`}
              </button>
            </div>

            {/* Login link
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <a href="/" className="text-green-600 hover:text-green-500">
                  Login
                </a>
              </p>
            </div> */}
          </div>
        </div>
      </main>
    </div>
  );
}
export default Signup;
