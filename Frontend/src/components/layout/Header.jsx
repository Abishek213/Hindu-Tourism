//Updated Header.jsx with functioning logout
import React, { useState, useRef, useEffect } from 'react';
import { Bell, User, Search, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';

const Header = ({ title = "Dashboard", userName = "User" }) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Use localStorage to get user name or use the props default
  const displayName = localStorage.getItem("userName") || userName;

  const userMenuRef = useRef();
  const notificationRef = useRef();

  const notifications = [
    { id: 1, message: "New lead assigned to you", time: "10 min ago" },
    { id: 2, message: "Follow-up reminder: Mr. Sharma", time: "1 hour ago" },
    { id: 3, message: "Booking confirmed for Pashupatinath", time: "3 hours ago" },
  ];

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    
    // Alert instead of toast for simpler implementation
    alert("Logged out successfully!");
    
    // Navigate to login
    navigate("/login");
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userMenuRef.current && !userMenuRef.current.contains(event.target)
      ) {
        setUserMenuOpen(false);
      }
      if (
        notificationRef.current && !notificationRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700">
      <h1 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h1>

      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Search..."
            className="py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <Search size={18} />
          </div>
        </div>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
          >
            <Bell size={20} />
            <span className="absolute flex items-center justify-center w-4 h-4 text-xs text-white bg-orange-500 rounded-full top-0 right-0">
              {notifications.length}
            </span>
          </button>
          {notificationsOpen && (
            <div className="absolute right-0 z-20 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-600">
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                <h3 className="font-semibold text-gray-800 dark:text-white">Notifications</h3>
              </div>
              {notifications.map((n) => (
                <div key={n.id} className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700">
                  <p className="text-sm text-gray-800 dark:text-gray-100">{n.message}</p>
                  <p className="mt-1 text-xs text-gray-500">{n.time}</p>
                </div>
              ))}
              <div className="px-4 py-2 text-center">
                <button className="text-sm text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-500">
                  View all
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          >
            <div className="flex items-center justify-center w-8 h-8 text-orange-700 bg-orange-100 rounded-full dark:bg-orange-900 dark:text-orange-300">
              <User size={18} />
            </div>
            <span className="hidden text-sm font-medium text-gray-700 dark:text-white md:block">
              {displayName}
            </span>
            <ChevronDown size={16} className="hidden text-gray-500 md:block" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 z-20 w-48 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-600">
              <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                Profile
              </a>
              <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                Settings
              </a>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;