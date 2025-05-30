import React, { useState } from 'react';
import { Search, Calendar, User, Package, Filter, Eye, Download } from 'lucide-react';

const dummyBookings = [
  {
    id: 1,
    customer: 'Ramesh Yadav',
    package: 'Pashupatinath Darshan',
    date: '2025-05-20',
    status: 'Confirmed',
    amount: '₹15,000',
    phone: '+977-9841234567'
  },
  {
    id: 2,
    customer: 'Sunita Joshi',
    package: 'Muktinath Yatra',
    date: '2025-05-22',
    status: 'Pending',
    amount: '₹25,000',
    phone: '+977-9851234567'
  },
  {
    id: 3,
    customer: 'Amit Sharma',
    package: 'Combined Package',
    date: '2025-05-18',
    status: 'Completed',
    amount: '₹35,000',
    phone: '+977-9861234567'
  },
  {
    id: 4,
    customer: 'Priya Maharjan',
    package: 'Pashupatinath Darshan',
    date: '2025-05-25',
    status: 'Confirmed',
    amount: '₹15,000',
    phone: '+977-9821234567'
  },
  {
    id: 5,
    customer: 'Krishna Thapa',
    package: 'Muktinath Yatra',
    date: '2025-05-15',
    status: 'Cancelled',
    amount: '₹25,000',
    phone: '+977-9811234567'
  }
];

export default function ViewBookingStatus() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [hoveredRow, setHoveredRow] = useState(null);

  const filteredBookings = dummyBookings.filter(booking => {
    const matchesSearch = booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.package.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-gradient-to-r from-green-400 to-green-500 text-white shadow-lg';
      case 'Pending':
        return 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg';
      case 'Completed':
        return 'bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-lg';
      case 'Cancelled':
        return 'bg-gradient-to-r from-red-400 to-red-500 text-white shadow-lg';
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg';
    }
  };

  const getStatusCount = (status) => {
    return dummyBookings.filter(booking => booking.status === status).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-500 shadow-2xl">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                Booking Management
              </h1>
              <p className="text-orange-100 text-lg">
                Monitor and manage all your pilgrimage bookings
              </p>
            </div>
           
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 -mt-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {['Confirmed', 'Pending', 'Completed', 'Cancelled'].map((status, index) => (
            <div
              key={status}
              className="bg-white rounded-2xl shadow-xl p-6 border border-orange-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{status}</p>
                  <p className="text-3xl font-bold text-gray-800">{getStatusCount(status)}</p>
                </div>
                <div className={`w-12 h-12 rounded-full ${getStatusStyle(status)} flex items-center justify-center`}>
                  <Package size={24} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 pb-8">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-orange-100">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search customers or packages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-300"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-300 bg-white"
                >
                  <option value="All">All Status</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-orange-100">
          <div className="px-6 py-4 bg-gradient-to-r from-orange-400 to-amber-500">
            <h2 className="text-xl font-semibold text-white">Booking Details</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-orange-50 to-amber-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-orange-100">
                    <div className="flex items-center space-x-2">
                      <User size={16} />
                      <span>Customer Details</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-orange-100">
                    <div className="flex items-center space-x-2">
                      <Package size={16} />
                      <span>Package</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-orange-100">
                    <div className="flex items-center space-x-2">
                      <Calendar size={16} />
                      <span>Travel Date</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-orange-100">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-orange-100">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-orange-100">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-100">
                {filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className={`hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 transition-all duration-300 ${
                      hoveredRow === booking.id ? 'transform scale-[1.01] shadow-lg' : ''
                    }`}
                    onMouseEnter={() => setHoveredRow(booking.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td className="px-6 py-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                          {booking.customer.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{booking.customer}</p>
                          <p className="text-sm text-gray-500">{booking.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-lg px-3 py-2 inline-block">
                        <span className="font-medium text-orange-800">{booking.package}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center space-x-2">
                        <Calendar size={16} className="text-orange-500" />
                        <span className="font-medium text-gray-700">{booking.date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="font-bold text-green-600 text-lg">{booking.amount}</span>
                    </td>
                    <td className="px-6 py-6">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusStyle(booking.status)} transform hover:scale-105 transition-all duration-300`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <button className="bg-gradient-to-r from-orange-400 to-amber-500 text-white p-2 rounded-lg hover:from-orange-500 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredBookings.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gradient-to-r from-orange-200 to-amber-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={32} className="text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No bookings found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>

        {/* Footer Summary */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 border border-orange-100">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-600 mb-4 md:mb-0">
              Showing {filteredBookings.length} of {dummyBookings.length} bookings
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Total Revenue:</span>
              <span className="text-2xl font-bold text-green-600">
                ₹{dummyBookings.reduce((sum, booking) => 
                  sum + parseInt(booking.amount.replace('₹', '').replace(',', '')), 0
                ).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}