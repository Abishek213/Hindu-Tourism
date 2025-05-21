import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import {
  salesDashboardConfig,
  adminDashboardConfig,
  operationDashboardConfig,
  accountDashboardConfig,
} from '../Dashboard/DashboardConfig';

// Get dashboard config based on URL prefix
const getDashboardConfig = (pathname) => {
  if (pathname.startsWith('/salesdashboard')) return salesDashboardConfig;
  if (pathname.startsWith('/admindashboard')) return adminDashboardConfig;
  if (pathname.startsWith('/ops')) return operationDashboardConfig;
  if (pathname.startsWith('/accounts')) return accountDashboardConfig;
  return adminDashboardConfig; // Default fallback
};

// Get page title from path, supports nested children tabs too
const getPageTitle = (pathname) => {
  const segments = pathname.split('/').filter(Boolean); // Remove empty
  if (segments.length >= 2) {
    const config = getDashboardConfig(`/${segments[0]}`);
    const tabKey = segments[1];
    const tab = config.tabs[tabKey];
    if (!tab) return 'Dashboard';

    // If this tab has children, try to get title of sub-tab (third segment)
    if (tab.children && segments.length >= 3) {
      const childKey = segments[2];
      const childTab = tab.children[childKey];
      return childTab ? childTab.title : tab.title;
    }

    return tab.title;
  }
  return 'Dashboard';
};

const MainLayout = () => {
  const { pathname } = useLocation();
  const dashboardConfig = getDashboardConfig(pathname);
  const pageTitle = getPageTitle(pathname);

  //Mock user for demo; replace with real user data from auth context/state
  const mockUser = {
    role: pathname.startsWith('/admindashboard') ? 'Admin' :
          pathname.startsWith('/salesdashboard') ? 'Sales Agent' :
          pathname.startsWith('/ops') ? 'Operation Team' : 'Accounts',
    fullname: 'Demo User',
  };

  return (
    <div className="flex h-screen">
      <Sidebar config={dashboardConfig} user={mockUser} />
      {/* Margin-left matches sidebar width: 16 for collapsed, 64 for expanded */}
      <div className="flex flex-col flex-1 overflow-hidden ml-16 md:ml-64">
        <Header title={pageTitle} userName={mockUser.fullname} />
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
