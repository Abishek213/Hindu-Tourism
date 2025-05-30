// components/DashboardSection.jsx
import React from 'react';
import StatCardGroup from '../ui/StatCardGroup';

const DashboardSection = ({ title, subtitle = 'Overview & quick actions', stats }) => (
  <div className="mb-12">
    <header className="mb-6">
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
    </header>
    <StatCardGroup stats={stats} />
  </div>
);

export default DashboardSection;
