import React, { useState } from 'react';
import { format } from 'date-fns';

const samplePayments = [
  { id: 'PMT1001', name: 'John Doe', amount: 500, status: 'Paid', method: 'Credit Card', date: new Date() },
  { id: 'PMT1002', name: 'Jane Smith', amount: 800, status: 'Pending', method: 'UPI', date: new Date() },
  { id: 'PMT1003', name: 'Mark Lee', amount: 1200, status: 'Failed', method: 'Bank Transfer', date: new Date() },
  { id: 'PMT1004', name: 'Alice Ray', amount: 300, status: 'Paid', method: 'Cash', date: new Date() },
];

const AdminPayment = () => {
  const [payments] = useState(samplePayments);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('');

  const filteredPayments = payments
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter(p => (filterStatus ? p.status === filterStatus : true))
    .sort((a, b) => {
      if (sortBy === 'amount') return b.amount - a.amount;
      if (sortBy === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime();
      return 0;
    });

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">💰 Payment Records</h2>

      <div className="bg-white p-6 rounded shadow">
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by name"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sort By</option>
            <option value="amount">Amount</option>
            <option value="date">Date</option>
          </select>
        </div>

        <table className="w-full border-collapse border border-gray-300 text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Payment ID</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Method</th>
              <th className="border border-gray-300 px-4 py-2">Amount</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length > 0 ? (
              filteredPayments.map(payment => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{payment.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{payment.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{payment.method}</td>
                  <td className="border border-gray-300 px-4 py-2">₹{payment.amount}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        payment.status === 'Paid'
                          ? 'bg-green-200 text-green-800'
                          : payment.status === 'Pending'
                          ? 'bg-yellow-200 text-yellow-800'
                          : 'bg-red-200 text-red-800'
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{format(payment.date, 'dd MMM yyyy')}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center text-gray-500 py-6">
                  No payment records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPayment;
