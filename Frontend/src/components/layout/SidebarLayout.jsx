// components/layout/SidebarLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const SidebarLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 ml-64 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default SidebarLayout;
