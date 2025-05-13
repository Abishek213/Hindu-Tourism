import React from 'react';
import { Calendar, User, Phone, Info } from 'lucide-react';

const FollowUpCard = ({ followUps }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'high':
        return <Info size={14} />;
      case 'medium':
        return <Info size={14} />;
      case 'low':
        return <Info size={14} />;
      default:
        return <Info size={14} />;
    }
  };

  return (
    <div className="bg-white p-2 rounded-xl shadow-md border border-gray-100 h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-medium text-gray-800">Follow-up Reminders</h3>
        <button className="text-sm text-orange-600 hover:text-orange-800">View All</button>
      </div>
      
      <div className="space-y-4">
        {followUps.map((followUp, index) => (
          <div 
            key={index} 
            className="p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-gray-800">{followUp.name}</h4>
                <div className="flex items-center mt-1 text-sm text-gray-500">
                  <User size={14} className="mr-1" />
                  <span>{followUp.assignedTo}</span>
                </div>
              </div>
              <div className={`px-2 py-1 text-xs font-medium rounded-full flex items-center ${getStatusColor(followUp.priority)}`}>
                {getStatusIcon(followUp.priority)}
                <span className="ml-1">{followUp.priority}</span>
              </div>
            </div>
            
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center text-gray-500">
                <Calendar size={14} className="mr-1" />
                <span>{followUp.date}</span>
              </div>
              <div className="flex items-center text-gray-500">
                <Phone size={14} className="mr-1" />
                <span>{followUp.phone}</span>
              </div>
            </div>
            
            {followUp.notes && (
              <div className="mt-3 text-sm text-gray-600 border-t border-gray-100 pt-2">
                {followUp.notes}
              </div>
            )}
            
            <div className="mt-3 flex space-x-2">
              <button className="px-3 py-1 bg-orange-50 text-orange-600 rounded-md text-sm hover:bg-orange-100 transition-colors">
                Complete
              </button>
              <button className="px-3 py-1 bg-gray-50 text-gray-600 rounded-md text-sm hover:bg-gray-100 transition-colors">
                Reschedule
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FollowUpCard;