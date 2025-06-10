import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { useSidebar } from '../../context/sidebarContext';
import {
  salesDashboardConfig,
  adminDashboardConfig,
  operationDashboardConfig,
  accountDashboardConfig,
} from '../Dashboard/DashboardConfig';

// Dashboard config selection
const getDashboardConfig = (pathname) => {
  if (pathname.startsWith('/salesdashboard')) return salesDashboardConfig;
  if (pathname.startsWith('/admindashboard')) return adminDashboardConfig;
  if (pathname.startsWith('/ops')) return operationDashboardConfig;
  if (pathname.startsWith('/account')) return accountDashboardConfig;
  return adminDashboardConfig;
};

// Title extraction based on path
const getPageTitle = (pathname) => {
  if (pathname.includes('/settings')) {
    return 'Settings';
  }
  
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length >= 2) {
    const config = getDashboardConfig(`/${segments[0]}`);
    const tabKey = segments[1];
    const tab = config.tabs[tabKey];
    if (!tab) return 'Dashboard';

    if (tab.children && segments.length >= 3) {
      const childKey = segments[2];
      const childTab = tab.children[childKey];
      return childTab ? childTab.title : tab.title;
    }

    return tab.title;
  }
  return 'Dashboard';
};

// Role display name
const getRoleDisplayName = (role) => {
  switch (role?.toLowerCase()) {
    case 'admin':
    case 'administrator':
      return 'Admin';

    case 'sales':
    case 'sales_agent':
    case 'sales_manager':
      return 'Sales';

    case 'ops':
    case 'operation':
    case 'ops_manager':
    case 'operation_manager':
      return 'Operation';

    case 'account':
    case 'finance_accountant':
    case 'accountant':
    case 'account_manager':
      return 'Accountant';

    default:
      return 'User';
  }
};


// Fallback name if not set
const getDefaultUserName = (role) => {
  switch (role.toLowerCase()) {
    case 'admin':
    case 'administrator':
      return 'Admin';

    case 'sales':
    case 'sales_agent':
    case 'sales_manager':
      return 'Sales';

    case 'ops':
    case 'operation':
    case 'ops_manager':
    case 'operation_manager':
      return 'Operation';

    case 'account':
    case 'finance_accountant':
    case 'accountant':
    case 'account_manager':
      return 'Accountant';

    default:
      return 'User';
  }
};

const MainLayout = () => {
  const { pathname } = useLocation();
  const { isSidebarOpen } = useSidebar() || { isSidebarOpen: true };
  const dashboardConfig = getDashboardConfig(pathname);
  const pageTitle = getPageTitle(pathname);

  const storedRole = localStorage.getItem('userRole') || '';
  const storedName = localStorage.getItem('userName') || getDefaultUserName(storedRole);

  const isSettingsPage = pathname.includes('/settings');

  const mockUser = {
    fullname: storedName,
    role: getRoleDisplayName(storedRole),
  };

  

return (
    <div className="flex h-screen">
      {/* Conditionally render sidebar - hide on settings page */}
      {!isSettingsPage && <Sidebar config={dashboardConfig} user={mockUser} />}
      
      {/* Adjust margin based on sidebar visibility and state */}
      <div className={`flex flex-col flex-1 overflow-hidden ${
        isSettingsPage 
          ? 'ml-0' 
          : isSidebarOpen 
            ? 'ml-52' // Match sidebar width when open (w-52 = 208px)
            : 'ml-16'  // Match sidebar width when collapsed (w-16 = 64px)
      }`}>
        <Header title={pageTitle} userName={mockUser.fullname} />
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
