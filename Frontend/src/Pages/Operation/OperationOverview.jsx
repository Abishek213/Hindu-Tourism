import React, { useState } from 'react';
import { Truck, Package, Compass } from 'lucide-react';

export default function OperationDashboardOverview() {
  const [activeTab, setActiveTab] = useState('assign');

  // Dummy stats data (replace with real API data)
  const stats = {
    activeTours: 8,
    guidesAssigned: 12,
    tripsCompleted: 20,
  };

  // Simple tab buttons
  const tabs = [
    { id: 'assign', label: 'Assign Guides/Transport', icon: Truck },
    { id: 'packages', label: 'Manage Packages', icon: Package },
    { id: 'progress', label: 'Update Travel Progress', icon: Compass },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Operation Team Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview & quick actions</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-5 flex flex-col items-center">
          <Truck className="w-10 h-10 text-blue-600 mb-2" />
          <h2 className="text-xl font-semibold">{stats.activeTours}</h2>
          <p className="text-gray-500">Active Tours</p>
        </div>
        <div className="bg-white rounded-lg shadow p-5 flex flex-col items-center">
          <Package className="w-10 h-10 text-green-600 mb-2" />
          <h2 className="text-xl font-semibold">{stats.guidesAssigned}</h2>
          <p className="text-gray-500">Guides Assigned</p>
        </div>
        <div className="bg-white rounded-lg shadow p-5 flex flex-col items-center">
          <Compass className="w-10 h-10 text-purple-600 mb-2" />
          <h2 className="text-xl font-semibold">{stats.tripsCompleted}</h2>
          <p className="text-gray-500">Trips Completed</p>
        </div>
      </div>

      {/* Tabs */}
      <nav className="mb-6 flex space-x-4 border-b border-gray-300">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 pb-2 font-medium ${
              activeTab === id
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <Icon className="w-5 h-5" />
            {label}
          </button>
        ))}
      </nav>

      {/* Tab Content Placeholder */}
      <div className="bg-white p-6 rounded-lg shadow min-h-[200px]">
        {activeTab === 'assign' && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Assign Guides & Transport</h3>
            <p>Manage guide and transport assignments for tours here.</p>
            {/* Replace with AssignGuidePage component or content */}
          </div>
        )}
        {activeTab === 'packages' && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Manage Packages</h3>
            <p>Edit or update tour packages details.</p>
            {/* Replace with PackageForm component or content */}
          </div>
        )}
        {activeTab === 'progress' && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Update Travel Progress</h3>
            <p>Track and update the status of ongoing tours.</p>
            {/* Replace with TravelProgressUpdater component or content */}
          </div>
        )}
      </div>
    </div>
  );
}
