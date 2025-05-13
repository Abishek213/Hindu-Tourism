import React, { useState } from 'react';
import { Bell, User, Search, ChevronDown } from 'lucide-react';

const Header = ({ title, userName = "Sales Agent" }) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Mock notifications
  const notifications = [
    { id: 1, message: "New lead assigned to you", time: "10 min ago" },
    { id: 2, message: "Follow-up reminder: Mr. Sharma", time: "1 hour ago" },
    { id: 3, message: "Booking confirmed for Pashupatinath", time: "3 hours ago" },
  ];

  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-gray-800 lg:ml-55">{title}</h1>
      </div>
      
      <div className="flex items-center">
        {/* Search Bar */}
        <div className="relative hidden md:block mr-4">
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <Search size={18} />
          </div>
        </div>
        
        {/* Notifications */}
        <div className="relative mr-4">
          <button
            className="p-2 rounded-full hover:bg-gray-100 relative"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 bg-orange-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </button>
          
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg py-2 border border-gray-200 z-20">
              <div className="px-4 py-2 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800">Notifications</h3>
              </div>
              {notifications.map(notification => (
                <div key={notification.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                  <p className="text-sm text-gray-800">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
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
            <div className="bg-orange-100 rounded-full h-8 w-8 flex items-center justify-center text-orange-700">
              <User size={18} />
            </div>
            <span className="hidden md:block text-sm text-gray-700">{userName}</span>
            <ChevronDown size={16} className="hidden md:block text-gray-500" />
          </button>
          
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200 z-20">
              <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Profile
              </a>
              <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Settings
              </a>
              <a href="/logout" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                Logout
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;