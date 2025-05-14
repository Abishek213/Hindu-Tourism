import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

const StatsCard = ({ title, value, icon, change, changeType, changeText }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <h3 className="text-2xl font-bold mt-2 text-gray-800">{value}</h3>
        </div>
        <div className={`p-3 rounded-full ${
          ['leads', 'customers'].includes(title.toLowerCase()) ? 'bg-orange-100 text-orange-600' : 
          ['revenue', 'conversion'].includes(title.toLowerCase()) ? 'bg-green-100 text-green-600' : 
          'bg-blue-100 text-blue-600'
        }`}>
          {icon}
        </div>
      </div>
      
      {(change || changeText) && (
        <div className="mt-4 flex items-center">
          {change && (
            <span className={`flex items-center text-sm ${
              changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              {changeType === 'increase' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
              {change}
            </span>
          )}
          {changeText && (
            <span className="text-sm text-gray-500 ml-2">{changeText}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatsCard;