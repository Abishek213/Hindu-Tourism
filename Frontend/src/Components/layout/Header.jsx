import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../api/auth';

const Header = ({ title = "Dashboard", userName = "User" }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const userMenuRef = useRef();

  // Get current user info on component mount
  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    localStorage.removeItem("tokenExpiration");
    alert("Logged out successfully!");
    navigate("/login");
  };

  const handleSettingsClick = () => {
    setUserMenuOpen(false);
    navigate("settings");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get display name - use username from currentUser or fallback to "User"
  const displayName = currentUser?.username || "User";

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white shadow-md dark:bg-gray-900">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">{title}</h1>

      {/* User Menu */}
      <div className="relative" ref={userMenuRef}>
        <button
          className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          onClick={() => setUserMenuOpen(!userMenuOpen)}
        >
          <div className="flex items-center justify-center w-9 h-9 text-primary-saffron bg-orange-50 rounded-full dark:bg-orange-900 dark:text-primary-saffron">
            <User size={18} />
          </div>
          <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-white">
            {displayName}
          </span>
          <ChevronDown size={16} className="hidden md:block text-gray-500" />
        </button>

        {userMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl dark:bg-gray-800 dark:border-gray-700 z-40 animate-fade-in-down">
            <button
              onClick={handleSettingsClick}
              className="w-full text-left block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 dark:text-white dark:hover:bg-gray-700 transition-colors"
            >
              Settings
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
