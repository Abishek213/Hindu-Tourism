// components/StatCardGroup.jsx
import React from 'react';

const StatCardGroup = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
      {stats.map((card, index) => (
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
  );
};

export default StatCardGroup;
