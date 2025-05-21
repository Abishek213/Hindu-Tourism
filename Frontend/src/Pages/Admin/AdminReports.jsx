import { useState } from 'react';
import { Trash2, Eye } from 'lucide-react';

const sampleReports = [
  {
    id: 1,
    title: 'Monthly Bookings Report',
    type: 'Booking',
    createdAt: '2025-05-01',
    description: 'Overview of all bookings in April.',
  },
  {
    id: 2,
    title: 'Customer Complaints',
    type: 'Complaint',
    createdAt: '2025-05-10',
    description: 'Report containing complaints for early May.',
  },
  {
    id: 3,
    title: 'Revenue Summary',
    type: 'Revenue',
    createdAt: '2025-05-15',
    description: 'Total revenue generated in April.',
  },
];

const reportTypes = ['All', 'Booking', 'Complaint', 'Revenue'];

export default function AdminReports() {
  const [reports, setReports] = useState(sampleReports);
  const [filterType, setFilterType] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleDelete = (id) => {
    setReports(prev => prev.filter(r => r.id !== id));
  };

  const filteredReports = reports.filter((report) => {
    const matchesType = filterType === 'All' || report.type === filterType;
    const date = new Date(report.createdAt);
    const matchesStart = startDate ? new Date(startDate) <= date : true;
    const matchesEnd = endDate ? date <= new Date(endDate) : true;
    return matchesType && matchesStart && matchesEnd;
  });

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Reports</h2>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border p-2 rounded"
        >
          {reportTypes.map((type, idx) => (
            <option key={idx} value={type}>{type}</option>
          ))}
        </select>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Created At</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredReports.map(report => (
              <tr key={report.id}>
                <td className="px-4 py-2 font-medium">{report.title}</td>
                <td className="px-4 py-2">{report.type}</td>
                <td className="px-4 py-2">{report.createdAt}</td>
                <td className="px-4 py-2">{report.description}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button className="text-blue-500 hover:text-blue-700">
                    <Eye size={18} />
                  </button>
                  <button onClick={() => handleDelete(report.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredReports.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center px-4 py-6 text-gray-500">
                  No reports found for the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
