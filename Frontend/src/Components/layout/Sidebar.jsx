import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, ChevronDown, ChevronRight } from 'lucide-react';
import { useTheme } from '../../context/themeContext';
import { useSidebar } from '../../context/sidebarContext';
import {
  adminDashboardConfig,
  operationDashboardConfig,
  accountDashboardConfig,
  salesDashboardConfig,
} from '../Dashboard/DashboardConfig';

const Sidebar = ({ config, user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme() || { isDarkMode: false };
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar() || {
    isSidebarOpen: true,
    setIsSidebarOpen: () => {},
  };

  const [activeDropdown, setActiveDropdown] = useState(null);

  const userRole = user?.role || localStorage.getItem("userRole") || "Sales Agent";
  const userName = user?.fullname || localStorage.getItem("userName") || "User";

  const dashboardConfig = config || (() => {
    const role = userRole?.toLowerCase() || 'admin';
    if (role.includes('admin')) return adminDashboardConfig;
    if (role.includes('sales')) return salesDashboardConfig;
    if (role.includes('operation')) return operationDashboardConfig;
    if (role.includes('accounts')) return accountDashboardConfig;
  })();

  const currentPath = location.pathname;
  const currentTab = currentPath.split('/').pop();

  const userInfo = {
    role: userRole,
    fullname: userName,
    email: `${userName.toLowerCase().replace(' ', '.')}@hinducrm.com`
  };

  const handleNavigate = (fullPath) => {
    navigate(fullPath);
    setActiveDropdown(null);
  };

  const handleTabClick = (key, hasChildren) => {
    if (hasChildren) {
      setActiveDropdown((prev) => (prev === key ? null : key));
    } else {
      navigate(`${dashboardConfig.basePath}/${key}`);
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 h-screen z-50 transition-all duration-300 
      ${isSidebarOpen ? 'w-64' : 'w-16'} 
      ${isDarkMode ? 'bg-gray-900 text-gray-100 border-r border-gray-800' : 'bg-white text-gray-800 border-r border-gray-200'}`}
    >
      {/* Logo + Toggle */}
      <div className={`flex items-center justify-between p-4 ${isDarkMode ? 'border-b border-gray-800' : 'border-b border-gray-200'}`}>
        {isSidebarOpen && (
          <img
            src="/logo.png"
            alt="TheHinduCRM Logo"
            className="h-10 w-auto transition-all"
          />
        )}
        <Menu
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="cursor-pointer"
        />
      </div>

      {/* Tabs */}
      <ul className="space-y-1 mt-8 relative">
        {Object.entries(dashboardConfig.tabs).map(([key, tab]) => {
          const isActive = currentTab === key;
          const Icon = tab.icon;
          const hasChildren = !!tab.children;
          const isDropdownOpen = activeDropdown === key;

          return (
            <div key={key} className="relative">
              <li
                className={`flex items-center justify-between px-4 py-3 mx-2 cursor-pointer rounded-lg transition-all
                  ${isActive
                    ? 'bg-primary-saffron text-white'
                    : isDarkMode
                      ? 'text-orange-400 hover:bg-gray-800'
                      : 'text-gray-700 hover:bg-orange-400'}`}
                onClick={() => handleTabClick(key, hasChildren)}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5" />
                  {isSidebarOpen && <span className="text-sm font-medium">{tab.title}</span>}
                </div>
                {hasChildren && isSidebarOpen && (
                  isDropdownOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
                )}
              </li>

              {/* Dropdown items */}
              {hasChildren && isDropdownOpen && (
                <ul className={`ml-8 mt-1 space-y-1 ${isSidebarOpen ? '' : 'hidden'}`}>
                  {Object.entries(tab.children).map(([childKey, childTab]) => {
                    const childPath = `${dashboardConfig.basePath}/${key}/${childKey}`;
                    return (
                      <li
                        key={childKey}
                        onClick={() => handleNavigate(childPath)}
                        className="text-sm px-3 py-2 rounded-md cursor-pointer hover:bg-orange-400 hover:text-white dark:hover:bg-gray-700"
                      >
                        {childTab.title}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
