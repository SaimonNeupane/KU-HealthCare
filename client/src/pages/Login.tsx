import { useState } from "react";
import { Eye, EyeOff, Hospital } from "lucide-react";
import { useNavigate } from 'react-router-dom';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState({
    email: false,
    password: false
  });
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const validateForm = () => {
    const errors = {
      email: email.trim() !== "" && !isValidEmail(email),
      password: password.trim() === ""
    };

    setFormErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  const handleLogin = () => {
    if (validateForm()) {
      // Handle login logic here
      console.log("Login attempt with:", { email, password, rememberMe });
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevents page refresh
    console.log("Submitted email:", email);
    navigate("/registration")
  };

  return (
    <form action="" onSubmit={handleSubmit}>
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm p-4">
          <div className="container mx-auto">
            <div className="flex items-center">
              <Hospital size={24} className="text-green-600 mr-2" />
              <span className="font-bold text-xl text-green-600">KU HealthCare</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <Hospital size={64} className="text-green-600 mx-auto mb-4" />
              <h1 className="text-2xl font-semibold text-gray-800">Login to KU HealthCare</h1>
            </div>

            <div className="space-y-6">
              {/* Username/Email field */}
              <div className="space-y-2">
                <label htmlFor="email" itemType="email" className="block text-sm font-medium text-gray-700">
                  Username or email <span className="text-red-500">*</span>
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
                  placeholder="krskeshav01@gmail.com"
                  className={`w-full px-3 py-2 rounded-md bg-green-50 border ${formErrors.email ? "border-red-500" : "border-green-100"
                    } focus:outline-none focus:ring-2 focus:ring-green-500`}
                  required
                />
                {formErrors.email && (
                  <p className="text-red-500 text-xs mt-1">Email is required</p>
                )}
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
                    className={`w-full px-3 py-2 rounded-md bg-green-50 border ${formErrors.password ? "border-red-500" : "border-green-100"
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
                  <p className="text-red-500 text-xs mt-1">Password is required</p>
                )}
              </div>

              {/* Remember me checkbox */}
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              {/* Login button */}
              <div>
                <button
                  onClick={handleLogin}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Log In
                </button>
              </div>

              {/* Forgot password link */}
              <div className="text-center">
                <a
                  href="#"
                  className="text-sm text-green-600 hover:text-green-500"
                >
                  Forgot password?
                </a>
              </div>

              {/* Sign up link */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  New user?{" "}
                  <a href="/Signup" className="text-green-600 hover:text-green-500">
                    Sign up
                  </a>
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </form>
  );
}
export default Login;