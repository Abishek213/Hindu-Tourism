import { useState, useEffect } from 'react';
import { Eye, EyeOff, User, Lock, Sun, Moon } from 'lucide-react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [darkMode, setDarkMode] = useState(false);

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

  const handleSubmit = () => {
    console.log('Login attempted with:', username, password);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen flex flex-col md:flex-row ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-orange-50 to-orange-100'}`}>
      {/* Theme toggle button - positioned absolutely */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-200"
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
          <div className="flex items-center justify-center md:justify-start mb-6">
            <img 
              src="/api/placeholder/80/80" 
              alt="Logo" 
              className="h-16 w-16 rounded-full bg-white p-2"
            />
            <h1 className="text-3xl md:text-4xl font-bold text-white ml-4">
              TheHinduTourism
            </h1>
          </div>
          <h2 className="text-2xl text-white font-light mb-6">
            Customer Relationship Management
          </h2>
          <p className="text-orange-100 mb-8 max-w-md">
            Managing pilgrimage journeys to Pashupatinath and Muktinath with excellence and devotion.
          </p>
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mt-8">
              <h3 className="text-white text-xl mb-4">Sacred Destinations</h3>
              <div className="flex space-x-4">
                <div className="bg-orange-700/30 p-4 rounded-lg text-white flex-1">
                  <p className="font-bold">Pashupatinath</p>
                  <p className="text-sm">Kathmandu, Nepal</p>
                </div>
                <div className="bg-orange-700/30 p-4 rounded-lg text-white flex-1">
                  <p className="font-bold">Muktinath</p>
                  <p className="text-sm">Mustang, Nepal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form with background slideshow */}
      <div className="md:w-1/2 relative flex items-center justify-center p-8 md:p-16 overflow-hidden">
        {/* Background transition */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
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
                  <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
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
                  <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
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
                  <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
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
                    className="h-3 w-3 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
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
                onClick={handleSubmit}
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