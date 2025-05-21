// src/pages/accounts/ProcessRefunds.jsx
import { useState, useEffect } from "react";
import { Search, RefreshCcw, AlertTriangle, Check } from "lucide-react";

export const ProcessRefunds = () => {
  const [refunds, setRefunds] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Sample data - replace with actual API call
  useEffect(() => {
    const dummyRefunds = [
      { 
        id: 201, 
        bookingId: "BK-2023-001", 
        customer: "Jane Smith", 
        amount: 750.00, 
        status: "approved", 
        requestDate: "2025-05-08", 
        processedDate: "2025-05-10",
        reason: "Trip cancellation due to weather"
      },
      { 
        id: 202, 
        bookingId: "BK-2023-005", 
        customer: "Sam Wong", 
        amount: 350.00, 
        status: "pending", 
        requestDate: "2025-05-15", 
        processedDate: null,
        reason: "Package change request"
      },
      { 
        id: 203, 
        bookingId: "BK-2023-008", 
        customer: "Lisa Brown", 
        amount: 1200.00, 
        status: "rejected", 
        requestDate: "2025-05-12", 
        processedDate: "2025-05-14",
        reason: "Out of refund window"
      },
      { 
        id: 204, 
        bookingId: "BK-2023-012", 
        customer: "Tom Harris", 
        amount: 500.00, 
        status: "processing", 
        requestDate: "2025-05-18", 
        processedDate: null,
        reason: "Service not as described"
      }
    ];
    setRefunds(dummyRefunds);
  }, []);
  
  const filteredRefunds = refunds.filter(refund => {
    const matchesFilter = filter === "all" || refund.status === filter;
    const matchesSearch = 
      refund.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      refund.customer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  
  const getStatusBadge = (status) => {
    switch(status) {
      case "approved":
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Approved</span>;
      case "pending":
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      case "processing":
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Processing</span>;
      case "rejected":
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Rejected</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Process Refunds</h1>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search refunds..."
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
            onClick={() => setFilter("approved")}
            className={`px-3 py-1 rounded-md ${filter === "approved" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700"}`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter("rejected")}
            className={`px-3 py-1 rounded-md ${filter === "rejected" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700"}`}
          >
            Rejected
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Refund #</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRefunds.map((refund) => (
              <tr key={refund.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">RF-{refund.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{refund.bookingId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{refund.customer}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">${refund.amount.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(refund.status)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{refund.requestDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700 truncate max-w-xs">{refund.reason}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {refund.status === "pending" && (
                    <>
                      <button className="text-green-600 hover:text-green-800 mr-3">
                        <Check className="w-5 h-5" />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <AlertTriangle className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  {refund.status === "processing" && (
                    <button className="text-blue-600 hover:text-blue-800">
                      <RefreshCcw className="w-5 h-5" />
                    </button>
                  )}
                  {(refund.status === "approved" || refund.status === "rejected") && (
                    <button className="text-gray-600 hover:text-gray-800">
                      View Details
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredRefunds.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No refunds found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};
  export default ProcessRefunds;