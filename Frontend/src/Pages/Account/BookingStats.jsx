// BookingStatusViewer.jsx
import React from 'react';

const sampleBookings = [
  { id: 'BK-001', customer: 'John Doe', amount: 1200, status: 'Paid', date: '2025-05-10' },
  { id: 'BK-002', customer: 'Jane Smith', amount: 950, status: 'Pending', date: '2025-05-15' },
];

export const BookingStats = () => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h2 className="text-xl font-bold text-orange-600 mb-4">Booking Status Viewer</h2>
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-orange-100">
          <th className="p-2 text-left">Booking ID</th>
          <th className="p-2 text-left">Customer</th>
          <th className="p-2 text-left">Amount</th>
          <th className="p-2 text-left">Status</th>
          <th className="p-2 text-left">Date</th>
        </tr>
      </thead>
      <tbody>
        {sampleBookings.map(b => (
          <tr key={b.id} className="border-b">
            <td className="p-2">{b.id}</td>
            <td className="p-2">{b.customer}</td>
            <td className="p-2">${b.amount.toFixed(2)}</td>
            <td className="p-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${b.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{b.status}</span>
            </td>
            <td className="p-2">{b.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
export default BookingStats;