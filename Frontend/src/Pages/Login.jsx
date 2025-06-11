import { useState, useEffect } from 'react';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { login } from '../api/auth';
import { toast } from "react-toastify";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    
    if (token && userRole) {
      redirectToDashboard(userRole);
    }
  }, []);

  const redirectToDashboard = (role) => {
    if (role === "Admin") {
      navigate("/admindashboard");
    } else if (role === "Sales") {
      navigate("/salesdashboard");
    } else if (role === "Operation") {
      navigate("/ops");
    } else if (role === "Accounts") {
      navigate("/accounts");
    }  
    else {
      navigate("/salesdashboard");
    }
  };

  const handleLogin = async () => {
    if (!username || !password) {
      toast.error("Please enter both username and password");
      return;
    }

    setIsLoading(true);
    try {
      const { success, role } = await login({ username, password });
      
      if (success) {
        toast.success("Login successful!");
        redirectToDashboard(role);
      }
    } catch (error) {
      toast.error(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="h-screen flex flex-col md:flex-row bg-gradient-to-br from-orange-50 to-orange-100 relative overflow-hidden">
      {/* Centered Logo spanning both sides */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 bg-white rounded-full p-3 shadow-lg border-4 border-orange-200">
        <img 
          src="/logo.png" 
          alt="TheHinduTourism Logo" 
          className="w-12 h-12 md:w-16 md:h-16 object-contain"
        />
      </div>

     {/* Left side - Branding */}
      <div className="md:w-1/2 flex items-center justify-center bg-gradient-to-br from-light to-light p-4 md:p-8 pt-20 md:pt-16 overflow-y-auto">
        <div className="text-center md:text-left">
         {/* Text section with background image */}
          <div
            className="p-6 rounded-lg bg-cover bg-center bg-no-repeat mb-8"
            style={{ backgroundImage: "url('/aarati.jpg')" }}
          >
            <div className="bg-black/50 p-6 rounded-lg">
              <div className="flex items-center justify-center mb-6 md:justify-start">
                <h1 className="ml-4 text-3xl font-bold text-white md:text-4xl">
                  TheHinduTourism
                </h1>
              </div>
              <h2 className="mb-6 text-2xl font-light text-white">
                Customer Relationship Management
              </h2>
              <p className="max-w-md text-orange-100">
                Managing pilgrimage journeys to Pashupatinath and Muktinath with excellence and devotion.
              </p>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="p-6 mt-8 rounded-lg bg-dark/80 backdrop-blur-sm shadow-lg">
              <h3 className="mb-4 text-xl font-semibold text-white">Sacred Destinations</h3>
              <div className="flex space-x-4">
                {/* Destination Card 1 - Light color base */}
                <div className="flex-1 p-4 rounded-lg bg-light/30 text-white border border-white/10">
                  <p className="font-bold text-lg">Pashupatinath</p>
                  <p className="text-sm text-white/90">Kathmandu, Nepal</p>
                </div>

                {/* Destination Card 2 - Primary saffron base */}
                <div className="flex-1 p-4 rounded-lg bg-primary-saffron/30 text-white border border-white/10">
                  <p className="font-bold text-lg">Muktinath</p>
                  <p className="text-sm text-white/90">Mustang, Nepal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="relative flex items-center justify-center p-4 md:p-8 overflow-hidden md:w-1/2 pt-20 md:pt-16">

        <div className="z-10 w-full max-w-xs">
          <div className="bg-white shadow-lg rounded-lg p-4">
            <h2 className="text-lg font-bold text-darkx mb-3 text-center">
              Login to CRM
            </h2>

            <div>
              <div className="mb-3">
                <label htmlFor="username" className="block text-xs font-medium text-gray-700 mb-1">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                    <User size={14} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-7 block w-full rounded border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-200 focus:ring-opacity-50 bg-orange-50 text-gray-900 text-xs py-1.5"
                    placeholder="Enter your username"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                    <Lock size={14} className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-7 block w-full rounded border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-200 focus:ring-opacity-50 bg-orange-50 text-gray-900 text-xs py-1.5"
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3 text-xs">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="w-3 h-3 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    disabled={isLoading}
                  />
                  <label htmlFor="remember-me" className="ml-1 block text-gray-700 text-xs">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-orange-600 hover:text-orange-800 text-xs">
                  Forgot password?
                </a>
              </div>

              <button
                onClick={handleLogin}
                disabled={isLoading}
                className={`w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium py-1.5 px-3 rounded shadow transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-300 text-xs ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Logging in...' : 'Log In'}
              </button>
            </div>

            <div className="mt-3 text-center">
              <p className="text-xs text-gray-600">
                Need help? Contact <a href="#" className="text-orange-600 font-medium">IT Support</a>
              </p>
            </div>
          </div>

          <div className="mt-4 text-center">
            <div className="flex items-center justify-center space-x-1">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-600"></div>
              <p className="text-xs text-gray-600">
                © 2025 TheHinduTourism.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}