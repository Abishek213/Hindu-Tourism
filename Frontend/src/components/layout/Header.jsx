import React, { useState } from 'react';
import { Bell, User, Search, ChevronDown } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const Header = ({ title, userName = "Sales Agent" }) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Mock notifications
  const notifications = [
    { id: 1, message: "New lead assigned to you", time: "10 min ago" },
    { id: 2, message: "Follow-up reminder: Mr. Sharma", time: "1 hour ago" },
    { id: 3, message: "Booking confirmed for Pashupatinath", time: "3 hours ago" },
  ];
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // if you store this separately
    localStorage.removeItem("theme"); // optional

    toast.success("Logged out successfully!");
    navigate("/login"); // Redirect to login page
  };


  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-gray-800 lg:ml-55">{title}</h1>
      </div>

      <div className="flex items-center">
        {/* Search Bar */}
        <div className="relative hidden mr-4 md:block">
          <input
            type="text"
            placeholder="Search..."
            className="py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <Search size={18} />
          </div>
        </div>

        {/* Notifications */}
        <div className="relative mr-4">
          <button
            className="relative p-2 rounded-full hover:bg-gray-100"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
          >
            <Bell size={20} />
            <span className="absolute flex items-center justify-center w-4 h-4 text-xs text-white bg-orange-500 rounded-full top-1 right-1">
              3
            </span>
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 z-20 py-2 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-72">
              <div className="px-4 py-2 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800">Notifications</h3>
              </div>
              {notifications.map(notification => (
                <div key={notification.id} className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50">
                  <p className="text-sm text-gray-800">{notification.message}</p>
                  <p className="mt-1 text-xs text-gray-500">{notification.time}</p>
                </div>
              ))}
              <div className="px-4 py-2 text-center">
                <button className="text-sm text-orange-600 hover:text-orange-800">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            className="flex items-center space-x-2"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          >
            <div className="flex items-center justify-center w-8 h-8 text-orange-700 bg-orange-100 rounded-full">
              <User size={18} />
            </div>
            <span className="hidden text-sm text-gray-700 md:block">{userName}</span>
            <ChevronDown size={16} className="hidden text-gray-500 md:block" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 z-20 w-48 py-2 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
              <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Profile
              </a>
              <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Settings
              </a>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100"
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