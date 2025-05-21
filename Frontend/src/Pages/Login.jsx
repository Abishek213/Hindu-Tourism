import { useState, useEffect } from 'react';
import { Eye, EyeOff, User, Lock, Sun, Moon } from 'lucide-react';
import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { jwtDecode } from "jwt-decode";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  // useEffect(() => {
  //   // Check if user is already logged in
  //   const token = localStorage.getItem("token");
  //   const userRole = localStorage.getItem("userRole");
    
  //   if (token && userRole) {
  //     // Redirect based on role
  //     redirectToDashboard(userRole);
  //   }
  // }, []);

  // const redirectToDashboard = (role) => {
  //   if (role === "Admin") {
  //     navigate("/admindashboard");
  //   } else if (role === "Sales Agent") {
  //     navigate("/salesdashboard");
  //   } else if (role === "Operation Team") {
  //     navigate("/ops");
  //   } else if (role === "Accounts") {
  //     navigate("/accounts");
  //   } else {
  //     navigate("/salesdashboard"); // Default fallback
  //   }
  // };

  // const handleLogin = () => {
  //   // Basic validation
  //   if (!username || !password) {
  //     alert("Please enter both username and password");
  //     return;
  //   }

  //   // Mock authentication - in a real app, this would call your API
  //   let userRole;
  //   if (username === "admin") {
  //     userRole = "Admin";
  //   } else if (username === "sales") {
  //     userRole = "Sales Agent";
  //   } else if (username === "ops") {
  //     userRole = "Operation Team";
  //   } else if (username === "accounts") {
  //     userRole = "Accounts";
  //   } else {
  //     // For demo purposes, default to Sales Agent
  //     userRole = "Sales Agent";
  //   }

  //   // Store authentication data in localStorage
  //   localStorage.setItem("token", "mock-jwt-token");
  //   localStorage.setItem("userRole", userRole);
  //   localStorage.setItem("userName", username);

  //   console.log('Logged in as:', userRole);
  //   // alert("Login successful!");

  //   // Redirect based on role
  //   redirectToDashboard(userRole);
  // };

  const backgroundImages = [
    '/assets/images/pashupati1.jpg.jpg',
    '/assets/images/muktinath1.jpg'
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex + 1) % backgroundImages.length
      );
    }, 5000); // 5 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen flex flex-col md:flex-row ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-orange-50 to-orange-100'}`}>
      {/* Theme toggle button - positioned absolutely */}
      <button
        onClick={toggleTheme}
        className="absolute z-20 p-2 transition-all duration-200 bg-white rounded-full shadow-md top-4 right-4 dark:bg-gray-800 hover:shadow-lg"
        aria-label="Toggle theme"
      >
        {darkMode ? 
          <Sun size={18} className="text-yellow-400" /> : 
          <Moon size={18} className="text-gray-700" />
        }
      </button>

      {/* Left side - Branding */}
      <div className={`md:w-1/2 flex items-center justify-center ${darkMode ? 'bg-gradient-to-br from-orange-800 to-orange-900' : 'bg-gradient-to-br from-orange-500 to-orange-600'} p-8 md:p-16`}>
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center mb-6 md:justify-start">
           
            <h1 className="ml-4 text-3xl font-bold text-white md:text-4xl">
              TheHinduTourism
            </h1>
          </div>
          <h2 className="mb-6 text-2xl font-light text-white">
            Customer Relationship Management
          </h2>
          <p className="max-w-md mb-8 text-orange-100">
            Managing pilgrimage journeys to Pashupatinath and Muktinath with excellence and devotion.
          </p>
          <div className="hidden md:block">
            <div className="p-6 mt-8 rounded-lg bg-white/10 backdrop-blur-sm">
              <h3 className="mb-4 text-xl text-white">Sacred Destinations</h3>
              <div className="flex space-x-4">
                <div className="flex-1 p-4 text-white rounded-lg bg-orange-700/30">
                  <p className="font-bold">Pashupatinath</p>
                  <p className="text-sm">Kathmandu, Nepal</p>
                </div>
                <div className="flex-1 p-4 text-white rounded-lg bg-orange-700/30">
                  <p className="font-bold">Muktinath</p>
                  <p className="text-sm">Mustang, Nepal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form with background slideshow */}
      <div className="relative flex items-center justify-center p-8 overflow-hidden md:w-1/2 md:p-16">
        {/* Background transition */}
        <div
          className="absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out bg-center bg-cover"
          style={{
            backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
            opacity: darkMode ? 0.2 : 0.3
          }}
        ></div>

        {/* Login form */}
        <div className="z-10 w-full max-w-xs">
          <div className={`${darkMode ? 'bg-gray-800 shadow-lg' : 'bg-white shadow-lg'} rounded-lg p-4`}>
            <h2 className={`text-lg font-bold ${darkMode ? 'text-orange-400' : 'text-orange-800'} mb-3 text-center`}>
              Login to CRM
            </h2>

            <div>
              <div className="mb-3">
                <label htmlFor="username" className={`block text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
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
                    className={`pl-7 block w-full rounded border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-200 focus:ring-opacity-50 ${darkMode ? 'bg-gray-700 text-white' : 'bg-orange-50 text-gray-900'} text-xs py-1.5`}
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="password" className={`block text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
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
                    className={`pl-7 block w-full rounded border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-200 focus:ring-opacity-50 ${darkMode ? 'bg-gray-700 text-white' : 'bg-orange-50 text-gray-900'} text-xs py-1.5`}
                    placeholder="Enter your password"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className={`flex items-center justify-between mb-3 text-xs ${darkMode ? 'text-gray-300' : ''}`}>
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="w-3 h-3 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="remember-me" className={`ml-1 block ${darkMode ? 'text-gray-300' : 'text-gray-700'} text-xs`}>
                    Remember me
                  </label>
                </div>
                <a href="#" className={`${darkMode ? 'text-orange-400' : 'text-orange-600'} hover:text-orange-800 text-xs`}>
                  Forgot password?
                </a>
              </div>

              <button
                // onClick={handleLogin}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium py-1.5 px-3 rounded shadow transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-300 text-xs"
              >
                Log In 
              </button>
            </div>

            <div className="mt-3 text-center">
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Need help? Contact <a href="#" className={`${darkMode ? 'text-orange-400' : 'text-orange-600'} font-medium`}>IT Support</a>
              </p>
            </div>
          </div>

          <div className="mt-4 text-center">
            <div className="flex items-center justify-center space-x-1">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-600"></div>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                © 2025 TheHinduTourism.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}