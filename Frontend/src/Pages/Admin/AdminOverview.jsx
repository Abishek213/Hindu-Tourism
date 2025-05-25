import React, { useState } from 'react';
import {
  BarChart3,
  CalendarCheck2,
  Users,
  FileText,
  Banknote,
  ClipboardList,
} from 'lucide-react';

const AdminOverview = () => {
  const [activeTab, setActiveTab] = useState('reports');

  const stats = {
    totalReports: 12,
    bookings: 34,
    leads: 50,
    packages: 8,
    payments: 75,
    staff: 6,
  };

  const tabs = [
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'bookings', label: 'Bookings', icon: CalendarCheck2 },
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'packages', label: 'Packages', icon: FileText },
    { id: 'payments', label: 'Payments', icon: Banknote },
    { id: 'staff', label: 'Staff', icon: ClipboardList },
  ];

  const statCards = [
    { label: 'Reports', value: stats.totalReports, icon: <BarChart3 size={20} className="text-orange-500" /> },
    { label: 'Bookings', value: stats.bookings, icon: <CalendarCheck2 size={20} className="text-blue-500" /> },
    { label: 'Leads', value: stats.leads, icon: <Users size={20} className="text-green-500" /> },
    { label: 'Packages', value: stats.packages, icon: <FileText size={20} className="text-yellow-500" /> },
    { label: 'Payments', value: stats.payments, icon: <Banknote size={20} className="text-pink-500" /> },
    { label: 'Staff', value: stats.staff, icon: <ClipboardList size={20} className="text-purple-500" /> },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">Overview & quick actions</p>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-white rounded-xl shadow border border-gray-100"
          >
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">{card.label}</span>
              <span className="text-xl font-semibold text-gray-800">{card.value}</span>
            </div>
            <div className="bg-gray-100 p-2 rounded-lg">{card.icon}</div>
          </div>
        ))}
      </div>

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
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Reports Overview</h3>
            <p className="text-gray-600 text-sm">View and generate performance or financial reports.</p>
          </div>
        )}
        {activeTab === 'bookings' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Bookings Overview</h3>
            <p className="text-gray-600 text-sm">Manage and review all customer bookings.</p>
          </div>
        )}
        {activeTab === 'leads' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Leads Overview</h3>
            <p className="text-gray-600 text-sm">Track and handle sales leads for better conversion.</p>
          </div>
        )}
        {activeTab === 'packages' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Packages Management</h3>
            <p className="text-gray-600 text-sm">Update and maintain travel packages.</p>
          </div>
        )}
        {activeTab === 'payments' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Payments Overview</h3>
            <p className="text-gray-600 text-sm">Monitor incoming and outgoing payments.</p>
          </div>
        )}
        {activeTab === 'staff' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Staff Management</h3>
            <p className="text-gray-600 text-sm">View and manage staff records and assignments.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOverview;
