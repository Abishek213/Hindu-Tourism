import { useState, useEffect } from "react";
import { RefreshCcw, AlertTriangle, Check, Plus, Eye, Edit, X } from "lucide-react";

export const ProcessRefunds = () => {
  const [refunds, setRefunds] = useState([]);
  const [filter, setFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [formData, setFormData] = useState({
    bookingId: "",
    customer: "",
    amount: "",
    reason: ""
  });
  
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
    return filter === "all" || refund.status === filter;
  });
  
  const getStatusBadge = (status) => {
    switch(status) {
      case "approved":
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Approved</span>;
      case "pending":
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      case "processing":
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Processing</span>;
      case "rejected":
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Rejected</span>;
      default:
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const handleCreateRefund = () => {
    const newRefund = {
      id: Date.now(),
      bookingId: formData.bookingId,
      customer: formData.customer,
      amount: parseFloat(formData.amount),
      status: "pending",
      requestDate: new Date().toISOString().split('T')[0],
      processedDate: null,
      reason: formData.reason
    };
    setRefunds([...refunds, newRefund]);
    setShowCreateModal(false);
    setFormData({ bookingId: "", customer: "", amount: "", reason: "" });
  };

  const handleEditRefund = () => {
    const updatedRefunds = refunds.map(refund => 
      refund.id === selectedRefund.id 
        ? { ...refund, ...formData, amount: parseFloat(formData.amount) }
        : refund
    );
    setRefunds(updatedRefunds);
    setShowEditModal(false);
    setSelectedRefund(null);
    setFormData({ bookingId: "", customer: "", amount: "", reason: "" });
  };

  const handleApproveRefund = (id) => {
    const updatedRefunds = refunds.map(refund => 
      refund.id === id 
        ? { ...refund, status: "approved", processedDate: new Date().toISOString().split('T')[0] }
        : refund
    );
    setRefunds(updatedRefunds);
  };

  const handleRejectRefund = (id) => {
    const updatedRefunds = refunds.map(refund => 
      refund.id === id 
        ? { ...refund, status: "rejected", processedDate: new Date().toISOString().split('T')[0] }
        : refund
    );
    setRefunds(updatedRefunds);
  };

  const openViewModal = (refund) => {
    setSelectedRefund(refund);
    setShowViewModal(true);
  };

  const openEditModal = (refund) => {
    setSelectedRefund(refund);
    setFormData({
      bookingId: refund.bookingId,
      customer: refund.customer,
      amount: refund.amount.toString(),
      reason: refund.reason
    });
    setShowEditModal(true);
  };

  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Process Refunds</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
        >
          <Plus className="w-5 h-5" />
          <span>Create Refund</span>
        </button>
      </div>
      
      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
            filter === "all" 
              ? "bg-yellow-600 text-white shadow-md" 
              : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
          }`}
        >
          All Refunds
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
            filter === "pending" 
              ? "bg-yellow-600 text-white shadow-md" 
              : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter("processing")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
            filter === "processing" 
              ? "bg-yellow-600 text-white shadow-md" 
              : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
          }`}
        >
          Processing
        </button>
        <button
          onClick={() => setFilter("approved")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
            filter === "approved" 
              ? "bg-yellow-600 text-white shadow-md" 
              : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
          }`}
        >
          Approved
        </button>
        <button
          onClick={() => setFilter("rejected")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
            filter === "rejected" 
              ? "bg-yellow-600 text-white shadow-md" 
              : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
          }`}
        >
          Rejected
        </button>
      </div>
      
      <div className="bg-yellow-50 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-yellow-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-800">Refund #</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-800">Booking ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-800">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-800">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-800">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-800">Request Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-800">Reason</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-yellow-800">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-yellow-100">
              {filteredRefunds.map((refund, index) => (
                <tr key={refund.id} className={index % 2 === 0 ? "bg-yellow-25" : "bg-white"}>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-800">RF-{refund.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{refund.bookingId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-medium">{refund.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-semibold">${refund.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(refund.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{refund.requestDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 truncate max-w-xs">{refund.reason}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center space-x-2">
                      {refund.status === "pending" && (
                        <>
                          <button 
                            onClick={() => handleApproveRefund(refund.id)}
                            className="text-green-600 hover:text-green-800 hover:bg-green-50 p-1 rounded transition-colors duration-200"
                            title="Approve"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleRejectRefund(refund.id)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1 rounded transition-colors duration-200"
                            title="Reject"
                          >
                            <AlertTriangle className="w-5 h-5" />
                          </button>
                        </>
                      )}
                      {refund.status === "processing" && (
                        <button className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1 rounded transition-colors duration-200">
                          <RefreshCcw className="w-5 h-5" />
                        </button>
                      )}
                      <button 
                        onClick={() => openViewModal(refund)}
                        className="text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 p-1 rounded transition-colors duration-200"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => openEditModal(refund)}
                        className="text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 p-1 rounded transition-colors duration-200"
                        title="Edit"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredRefunds.length === 0 && (
            <div className="text-center py-12 bg-white">
              <p className="text-gray-500 text-lg">No refunds found matching your criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Refund Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Refund">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Booking ID</label>
            <input
              type="text"
              value={formData.bookingId}
              onChange={(e) => setFormData({...formData, bookingId: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="BK-2023-XXX"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
            <input
              type="text"
              value={formData.customer}
              onChange={(e) => setFormData({...formData, customer: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Enter customer name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Refund Amount</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="0.00"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Enter refund reason"
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateRefund}
              className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
            >
              Create Refund
            </button>
          </div>
        </div>
      </Modal>

      {/* View Details Modal */}
      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Refund Details">
        {selectedRefund && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Refund ID</label>
                <p className="mt-1 text-sm text-gray-900">RF-{selectedRefund.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <div className="mt-1">{getStatusBadge(selectedRefund.status)}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Booking ID</label>
                <p className="mt-1 text-sm text-gray-900">{selectedRefund.bookingId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Customer</label>
                <p className="mt-1 text-sm text-gray-900">{selectedRefund.customer}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <p className="mt-1 text-sm text-gray-900 font-semibold">${selectedRefund.amount.toFixed(2)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Request Date</label>
                <p className="mt-1 text-sm text-gray-900">{selectedRefund.requestDate}</p>
              </div>
            </div>
            {selectedRefund.processedDate && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Processed Date</label>
                <p className="mt-1 text-sm text-gray-900">{selectedRefund.processedDate}</p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700">Reason</label>
              <p className="mt-1 text-sm text-gray-900">{selectedRefund.reason}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Refund Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Refund">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Booking ID</label>
            <input
              type="text"
              value={formData.bookingId}
              onChange={(e) => setFormData({...formData, bookingId: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
            <input
              type="text"
              value={formData.customer}
              onChange={(e) => setFormData({...formData, customer: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Refund Amount</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setShowEditModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleEditRefund}
              className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
            >
              Update Refund
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProcessRefunds;