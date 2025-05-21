import { useState, useEffect } from "react";
import { Search, CreditCard } from "lucide-react";

const ManagePayments = () => {
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Sample data - replace with actual API call
  useEffect(() => {
    const dummyPayments = [
      { id: 1, bookingId: "BK-2023-001", customer: "Jane Smith", amount: 1250.00, status: "completed", date: "2025-05-10" },
      { id: 2, bookingId: "BK-2023-002", customer: "John Doe", amount: 945.50, status: "pending", date: "2025-05-15" },
      { id: 3, bookingId: "BK-2023-003", customer: "Alex Johnson", amount: 2100.00, status: "processing", date: "2025-05-18" },
      { id: 4, bookingId: "BK-2023-004", customer: "Maria Garcia", amount: 1575.25, status: "completed", date: "2025-05-12" }
    ];
    setPayments(dummyPayments);
  }, []);
  
  const filteredPayments = payments.filter(payment => {
    const matchesFilter = filter === "all" || payment.status === filter;
    const matchesSearch = 
      payment.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.customer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  
  const getStatusBadge = (status) => {
    switch(status) {
      case "completed":
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Completed</span>;
      case "pending":
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      case "processing":
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Processing</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Payments</h1>
        <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md flex items-center">
          <CreditCard className="w-4 h-4 mr-2" />
          New Payment
        </button>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search payments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-md ${filter === "all" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700"}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-3 py-1 rounded-md ${filter === "pending" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700"}`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter("processing")}
            className={`px-3 py-1 rounded-md ${filter === "processing" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700"}`}
          >
            Processing
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-3 py-1 rounded-md ${filter === "completed" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700"}`}
          >
            Completed
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPayments.map((payment) => (
              <tr key={payment.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">{payment.bookingId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{payment.customer}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">${payment.amount.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(payment.status)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{payment.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-orange-500 hover:text-orange-600 mr-3">Edit</button>
                  <button className="text-orange-500 hover:text-orange-600">Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredPayments.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No payments found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagePayments;
