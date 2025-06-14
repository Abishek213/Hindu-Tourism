import { useState, useEffect } from "react";
import {
  RefreshCcw,
  AlertTriangle,
  Check,
  Plus,
  Eye,
  Edit,
  X,
  ChevronDown,
  Filter,
} from "lucide-react";

export const ProcessRefunds = () => {
  const [refunds, setRefunds] = useState([]);
  const [filter, setFilter] = useState("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [formData, setFormData] = useState({
    bookingId: "",
    customer: "",
    amount: "",
    reason: "",
  });

  // Sample data - replace with actual API call
  useEffect(() => {
    const dummyRefunds = [
      {
        id: 201,
        bookingId: "BK-2023-001",
        customer: "Jane Smith",
        amount: 750.0,
        status: "approved",
        requestDate: "2025-05-08",
        processedDate: "2025-05-10",
        reason:
          "Trip cancellation due to weather conditions and safety concerns",
      },
      {
        id: 202,
        bookingId: "BK-2023-005",
        customer: "Sam Wong",
        amount: 350.0,
        status: "pending",
        requestDate: "2025-05-15",
        processedDate: null,
        reason: "Package change request",
      },
      {
        id: 203,
        bookingId: "BK-2023-008",
        customer: "Lisa Brown",
        amount: 1200.0,
        status: "rejected",
        requestDate: "2025-05-12",
        processedDate: "2025-05-14",
        reason: "Out of refund window",
      },
      {
        id: 204,
        bookingId: "BK-2023-012",
        customer: "Tom Harris",
        amount: 500.0,
        status: "processing",
        requestDate: "2025-05-18",
        processedDate: null,
        reason: "Service not as described, multiple issues reported",
      },
    ];
    setRefunds(dummyRefunds);
  }, []);

  const filteredRefunds = refunds.filter((refund) => {
    return filter === "all" || refund.status === filter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            Approved
          </span>
        );
      case "pending":
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      case "processing":
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
            Processing
          </span>
        );
      case "rejected":
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const handleCreateRefund = () => {
    const newRefund = {
      id: Date.now(),
      bookingId: formData.bookingId,
      customer: formData.customer,
      amount: parseFloat(formData.amount),
      status: "pending",
      requestDate: new Date().toISOString().split("T")[0],
      processedDate: null,
      reason: formData.reason,
    };
    setRefunds([...refunds, newRefund]);
    setShowCreateModal(false);
    setFormData({ bookingId: "", customer: "", amount: "", reason: "" });
  };

  const handleEditRefund = () => {
    const updatedRefunds = refunds.map((refund) =>
      refund.id === selectedRefund.id
        ? { ...refund, ...formData, amount: parseFloat(formData.amount) }
        : refund
    );
    setRefunds(updatedRefunds);
    setShowEditModal(false);
    setSelectedRefund(null);
    setFormData({ bookingId: "", customer: "", amount: "", reason: "" });
  };

  const handleStatusChange = (id, newStatus) => {
    const updatedRefunds = refunds.map((refund) =>
      refund.id === id
        ? {
            ...refund,
            status: newStatus,
            processedDate:
              newStatus === "approved" || newStatus === "rejected"
                ? new Date().toISOString().split("T")[0]
                : null,
          }
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
      reason: refund.reason,
    });
    setShowEditModal(true);
  };

  const getFilterLabel = () => {
    switch (filter) {
      case "all":
        return "All Refunds";
      case "pending":
        return "Pending";
      case "processing":
        return "Processing";
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      default:
        return "All Refunds";
    }
  };

  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div
        className="mb-6 px-6 py-8 border-b border-gray-100 bg-primary-saffron
        flex flex-col items-center justify-between sm:flex-row"
      >
        <h1 className="text-xl font-bold text-white">Process Refunds</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-2 text-sm rounded-md text-orange-600 transition-all duration-200
                      bg-white shadow-lg sm:mt-0 hover:bg-orange-100 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" /> {/* Plus icon moved here */}
          <span>Create Refund</span>
        </button>
      </div>

      {/* Filter Dropdown */}
      <div className="mb-8 relative">
        <button
          onClick={() => setShowFilterDropdown(!showFilterDropdown)}
     className="bg-secondary-green text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200 border border-yellow-200 hover:bg-green-700 hover:text-white"
>
          <Filter className="w-4 h-4" />
          <span>{getFilterLabel()}</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              showFilterDropdown ? "rotate-180" : ""
            }`}
          />
        </button>

        {showFilterDropdown && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-48">
            <div className="py-1">
              {[
                { value: "all", label: "All Refunds" },
                { value: "pending", label: "Pending" },
                { value: "processing", label: "Processing" },
                { value: "approved", label: "Approved" },
                { value: "rejected", label: "Rejected" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setFilter(option.value);
                    setShowFilterDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-orange-200 transition-colors duration-150 ${
                    filter === option.value
                      ? "bg-orange-500 text-white font-medium"
                      : "text-gray-700"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="overflow-x-auto border shadow-md rounded-xl">
        <div className="">
          <table className="min-w-full table-auto">
            <thead className="bg-secondary-green">
              <tr className="text-white">
                <th className="px-3 py-3 border-r text-left border-green-700">
                  Refund #
                </th>
                <th className="px-3 py-3 border-r text-left border-green-700">
                  Booking ID
                </th>
                <th className="px-3 py-3 border-r text-left border-green-700">
                  Customer
                </th>
                <th className="px-3 py-3 border-r text-left border-green-700">
                  Amount
                </th>
                <th className="px-3 py-3 border-r text-left border-green-700">
                  Status
                </th>
                <th className="px-3 py-3 border-r text-left border-green-700">
                  Request Date
                </th>
                <th className="px-3 py-3 border-r text-left border-green-700">
                  Reason
                </th>
                <th className="px-3 py-3 border-r text-left border-green-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-yellow-100">
              {filteredRefunds.map((refund, index) => (
                <tr
                  key={refund.id}
                  className={index % 2 === 0 ? "bg-yellow-25" : "bg-white"}
                >
                  <td className="px-3 py-3 whitespace-nowrap font-semibold text-gray-800">
                    RF-{refund.id}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-gray-700">
                    {refund.bookingId}
                  </td>
                  <td className="px-3 py-3 text-gray-700 font-medium">
                    {refund.customer}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-gray-700 font-semibold">
                    ${refund.amount.toFixed(2)}
                  </td>
                  <td className="px-3 py-3">
                    <select
                      value={refund.status}
                      onChange={(e) =>
                        handleStatusChange(refund.id, e.target.value)
                      }
                      className="bg-white border border-gray-300 rounded-md px-2 py-1 pr-7 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 appearance-none cursor-pointer min-w-[100px]"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: "right 0.4rem center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "1.2em 1.2em",
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-gray-700">
                    {refund.requestDate}
                  </td>
                  <td className="px-3 py-3 text-gray-700 max-w-[12rem]">
                    <div className="truncate" title={refund.reason}>
                      {refund.reason}
                    </div>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-center">
                    <div className="flex justify-center items-center space-x-1">
                      <button
                        onClick={() => openViewModal(refund)}
                        className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 p-1.5 rounded-md transition-colors duration-200 border border-yellow-200"
                        title="View Details"
                      >
                        {/* Assuming Eye icon component is imported */}
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(refund)}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-1.5 rounded-md transition-colors duration-200 border border-blue-200"
                        title="Edit"
                      >
                        {/* Assuming Edit icon component is imported */}
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredRefunds.length === 0 && (
            <div className="text-center py-12 bg-white">
              <p className="text-gray-500 text-lg">
                No refunds found matching your criteria
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create Refund Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Refund"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Booking ID
            </label>
            <input
              type="text"
              value={formData.bookingId}
              onChange={(e) =>
                setFormData({ ...formData, bookingId: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="BK-2023-XXX"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Name
            </label>
            <input
              type="text"
              value={formData.customer}
              onChange={(e) =>
                setFormData({ ...formData, customer: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Enter customer name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Refund Amount
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="0.00"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
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
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Refund Details"
      >
        {selectedRefund && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Refund ID
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  RF-{selectedRefund.id}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <div className="mt-1">
                  {getStatusBadge(selectedRefund.status)}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Booking ID
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedRefund.bookingId}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Customer
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedRefund.customer}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Amount
                </label>
                <p className="mt-1 text-sm text-gray-900 font-semibold">
                  ${selectedRefund.amount.toFixed(2)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Request Date
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedRefund.requestDate}
                </p>
              </div>
            </div>
            {selectedRefund.processedDate && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Processed Date
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedRefund.processedDate}
                </p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Reason
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {selectedRefund.reason}
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Refund Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Refund"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Booking ID
            </label>
            <input
              type="text"
              value={formData.bookingId}
              onChange={(e) =>
                setFormData({ ...formData, bookingId: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Name
            </label>
            <input
              type="text"
              value={formData.customer}
              onChange={(e) =>
                setFormData({ ...formData, customer: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Refund Amount
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
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
