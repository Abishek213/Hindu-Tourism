const StatusBadge = ({ status }) => {
  const statusClasses = {
    New: 'bg-blue-100 text-blue-800',
    Contacted: 'bg-yellow-100 text-yellow-800',
    Interested: 'bg-green-100 text-green-800',
    Booked: 'bg-purple-100 text-purple-800',
    'Not Interested': 'bg-gray-100 text-gray-800',
    Confirmed: 'bg-green-100 text-green-800',
    'Pending Payment': 'bg-yellow-100 text-yellow-800',
    'Documents Pending': 'bg-orange-100 text-orange-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Overdue: 'bg-red-100 text-red-800'
  };

  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
};

export default StatusBadge;