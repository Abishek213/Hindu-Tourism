import React, { useState } from 'react';
import {
  BarChart3,
  CalendarCheck2,
  Users,
  FileText,
  Banknote,
  ClipboardList,
  Truck,
  Folder,
  BusIcon,
  ReceiptIndianRupee
} from 'lucide-react';

import DashboardSection from '../../Components/Dashboard/DashboardSection';

const AdminOverview = () => {
  const [activeTab, setActiveTab] = useState('reports');

  const tabs = [
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'bookings', label: 'Bookings', icon: CalendarCheck2 },
    { id: 'documents', label: 'Documents', icon: ClipboardList },
    { id: 'guideandtransport', label: 'Guide/Transport', icon: Users },
    { id: 'packages', label: 'Packages', icon: FileText },
    { id: 'payments', label: 'Payments', icon: Banknote },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'staff', label: 'Staff', icon: ClipboardList },
    { id: 'travel', label: 'TravelProgress', icon: ClipboardList },
    { id: 'tripschedule', label: 'TripSchedule', icon: ClipboardList },

  ];

  // Sample stats for each section
   const adminStats= [

    { label: 'Leads', value: 56, icon: <Users size={20} className="text-green-500" /> },
    { label: 'Booking', value: 22, icon: <CalendarCheck2 size={20} className="text-yellow-500" /> },
    { label: 'Guide/Transport', value: 11, icon: <Users size={20} className="text-purple-500" /> },
    { label: 'Packages', value: 34, icon: <FileText size={20} className="text-orange-500" /> },
    { label: 'Payments', value: 45, icon: <Banknote size={20} className="text-blue-500" /> },
    { label: 'Report', value: 11, icon: <ClipboardList size={20} className="text-green-500" /> },
    { label: 'Staff Management', value: 22, icon: <Users size={20} className="text-yellow-500" /> },

  ];

  const salesStats = [
    { label: 'Leads', value: 56, icon: <Users size={20} className="text-green-500" /> },
   { label: 'Booking', value: 22, icon: <CalendarCheck2 size={20} className="text-yellow-500" /> },
    { label: 'Document', value: 34, icon: <FileText size={20} className="text-pink-500" /> },
    { label: 'Report', value: 11, icon: <ClipboardList size={20} className="text-green-500" /> },
    { label: 'Trip Schedule', value: 11, icon: <Truck size={20} className="text-purple-500" /> },
  ];

  const accountStats = [
    { label: 'Booking', value: 22, icon: <CalendarCheck2 size={20} className="text-yellow-500" /> },
    { label: 'Document', value: 34, icon: <FileText size={20} className="text-pink-500" /> },
    { label: 'Finance Report', value: 34, icon: <ReceiptIndianRupee size={20} className="text-orange-500" /> },
    { label: 'Invoices', value: 45, icon: <FileText size={20} className="text-blue-500" /> },
    { label: 'Payments', value: 11, icon: <Banknote size={20} className="text-green-500" /> },
    { label: 'Refunds', value: 34, icon: <Banknote size={20} className="text-pink-500" /> },
    { label: 'Trip Schedule', value: 11, icon: <Truck size={20} className="text-purple-500" /> },
  
  ];

  const operationStats = [
     { label: 'Booking', value: 22, icon: <CalendarCheck2 size={20} className="text-yellow-500" /> },
    { label: 'Guide/Transport', value: 11, icon: <Users size={20} className="text-purple-500" /> },
    { label: 'Packages', value: 34, icon: <FileText size={20} className="text-orange-500" /> },
    { label: 'Travel', value: 34, icon: <BusIcon size={20} className="text-pink-500" /> },

  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Admin Dashboard Header */}
      <header className="mb-6">
        <h1 className=" flex justify-center text-2xl font-bold text-gray-800">Admin Dashboard</h1>
      </header>

      {/* Dashboard Sections */}
      <DashboardSection title=" Overview" stats={adminStats} />
      <DashboardSection title="Sales Overview" stats={salesStats} />
      <DashboardSection title="Account Overview" stats={accountStats} />
      <DashboardSection title="Operation Overview" stats={operationStats} />

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-4 overflow-x-auto">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center px-4 py-2 rounded-t-md border-b-2 transition ${
                activeTab === id
                  ? 'text-orange-600 border-orange-500 bg-white'
                  : 'text-gray-600 hover:text-orange-600 border-transparent'
              }`}
            >
              <Icon className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
        {activeTab === 'reports' && (
          <p className="text-sm text-gray-600">View and generate performance or financial reports.</p>
        )}
        {activeTab === 'bookings' && (
          <p className="text-sm text-gray-600">Manage and review all customer bookings.</p>
        )}
        {activeTab === 'leads' && (
          <p className="text-sm text-gray-600">Track and handle sales leads for better conversion.</p>
        )}
        {activeTab === 'packages' && (
          <p className="text-sm text-gray-600">Update and maintain travel packages.</p>
        )}
        {activeTab === 'payments' && (
          <p className="text-sm text-gray-600">Monitor incoming and outgoing payments.</p>
        )}
        {activeTab === 'staff' && (
          <p className="text-sm text-gray-600">View and manage staff records and assignments.</p>
        )}
        {activeTab === 'document' && (
          <p className="text-sm text-gray-600">Manage document record.</p>
        )}
        {activeTab === 'travel' && (
          <p className="text-sm text-gray-600">Manage travel and tripschedule.</p>
        )}
        {activeTab === 'guideandtransport' && (
          <p className="text-sm text-gray-600">Manage guide and transport assignments.</p>
        )}
      </div>
    </div>
  );
};

export default AdminOverview;







