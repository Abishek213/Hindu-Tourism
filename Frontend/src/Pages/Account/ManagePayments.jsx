import { useState, useEffect, useCallback } from "react";
import {
  CreditCard,
  Eye,
  X,
  Calendar,
  User,
  DollarSign,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowLeft,
  Filter,
  Phone,
  Mail,
  MapPin,
  Tag,
  Info,
  Banknote,
  Receipt,
  BadgeDollarSign
} from "lucide-react";
import api from "../../api/auth"; // Make sure this is properly configured

// PaymentDetails component - Modified to show payment summary
const PaymentDetails = ({
  selectedPayment,
  paymentSummary,
  onCancel,
  getStatusBadge
}) => {
  if (!selectedPayment || !paymentSummary) return null;

  // Format date for display
  const formattedPaymentDate = new Date(selectedPayment.payment_date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-3xl p-8 mx-auto border shadow-xl rounded-2xl bg-white/90 backdrop-blur-sm border-amber-200">
      <div className="flex items-center justify-between pb-4 mb-8 border-b border-amber-200">
        <div className="flex items-center space-x-3">
          <button
            onClick={onCancel}
            className="p-2 transition-colors duration-200 rounded-full hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            aria-label="Back to Payments"
          >
            <ArrowLeft className="text-amber-600" size={20} />
          </button>
          <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text">
            Payment Details
          </h2>
        </div>
        {getStatusBadge(selectedPayment.status)}
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Customer Information */}
        <div className="flex flex-col items-start p-4 rounded-lg shadow-sm bg-amber-50/50">
          <h3 className="flex items-center mb-3 text-lg font-semibold text-amber-800">
            <User size={20} className="mr-2 text-amber-500" /> Customer
          </h3>
          <p className="font-medium text-amber-900">{selectedPayment.booking_id?.customer_id?.name || "N/A"}</p>
          <p className="flex items-center mt-1 text-sm text-amber-700">
            <Mail size={14} className="mr-2 opacity-75" />
            {selectedPayment.booking_id?.customer_id?.email || "N/A"}
          </p>
          <p className="flex items-center mt-1 text-sm text-amber-700">
            <Phone size={14} className="mr-2 opacity-75" />
            {selectedPayment.booking_id?.customer_id?.phone || "N/A"}
          </p>
        </div>

        {/* Package / Booking Information */}
        <div className="flex flex-col items-start p-4 rounded-lg shadow-sm bg-orange-50/50">
          <h3 className="flex items-center mb-3 text-lg font-semibold text-orange-800">
            <MapPin size={20} className="mr-2 text-orange-500" /> Destination
          </h3>
          <p className="font-medium text-orange-900">{selectedPayment.booking_id?.package_id?.title || "N/A"}</p>
          <p className="flex items-center mt-1 text-sm text-orange-700">
            <Tag size={14} className="mr-2 opacity-75" />
            Booking Ref: <span className="ml-1 font-mono">{selectedPayment.booking_id?.booking_ref_id || "N/A"}</span>
          </p>
        </div>

        {/* Payment Specifics */}
        <div className="flex flex-col items-start p-4 rounded-lg shadow-sm bg-amber-50/50">
          <h3 className="flex items-center mb-3 text-lg font-semibold text-amber-800">
            <Receipt size={20} className="mr-2 text-amber-500" /> Current Payment
          </h3>
          <p className="text-lg font-medium text-amber-900">
            Amount: <span className="font-semibold text-orange-600">${selectedPayment.amount?.toFixed(2) || "0.00"}</span>
          </p>
          <p className="flex items-center mt-1 text-sm text-amber-700">
            <Calendar size={14} className="mr-2 opacity-75" />
            Date: {formattedPaymentDate}
          </p>
          <p className="flex items-center mt-1 text-sm text-amber-700">
            <Banknote size={14} className="mr-2 opacity-75" />
            Method: {selectedPayment.payment_method || "N/A"}
          </p>
          <p className="flex items-center mt-1 text-sm text-amber-700">
            <Info size={14} className="mr-2 opacity-75" />
            Transaction ID: <span className="font-mono">{selectedPayment.transaction_id || "N/A"}</span>
          </p>
        </div>
      </div>

      {/* Payment Summary Section */}
      <div className="p-6 border rounded-lg shadow-inner bg-amber-100/70 border-amber-200">
        <h3 className="flex items-center mb-4 text-xl font-bold text-amber-800">
          <BadgeDollarSign size={24} className="mr-2 text-amber-600" /> Overall Payment Status
        </h3>
        <div className="grid grid-cols-1 gap-4 text-center md:grid-cols-3">
          <div className="p-3 bg-white rounded-lg shadow-sm">
            <p className="mb-1 text-sm text-amber-700">Total Package Amount</p>
            <p className="text-xl font-bold text-amber-900">${paymentSummary.total_amount?.toFixed(2) || "0.00"}</p>
          </div>
          <div className="p-3 bg-white rounded-lg shadow-sm">
            <p className="mb-1 text-sm text-amber-700">Total Paid</p>
            <p className="text-xl font-bold text-green-600">${paymentSummary.total_paid_amount?.toFixed(2) || "0.00"}</p>
          </div>
          <div className="p-3 bg-white rounded-lg shadow-sm">
            <p className="mb-1 text-sm text-amber-700">Amount Due</p>
            <p className="text-xl font-bold text-red-600">${paymentSummary.due_amount?.toFixed(2) || "0.00"}</p>
          </div>
        </div>
        {paymentSummary.due_amount > 0 && (
          <p className="mt-4 text-sm text-center text-amber-700">
            A remaining balance of <span className="font-bold text-red-600">${paymentSummary.due_amount.toFixed(2)}</span> is due.
          </p>
        )}
      </div>

      <div className="flex justify-center pt-8 mt-8 border-t border-amber-200">
        <button
          onClick={onCancel}
          className="px-6 py-3 text-lg font-medium text-white transition-all duration-200 shadow-lg rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 hover:shadow-xl"
        >
          Back to Payments List
        </button>
      </div>
    </div>
  );
};

// Main ManagePayments component
const ManagePayments = () => {
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState("all");
  const [currentView, setCurrentView] = useState("list");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentSummary, setPaymentSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch all payments from the API
  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/payment");
      
      if (!response.data) {
        throw new Error("No data received from server");
      }

      setPayments(response.data);
    } catch (e) {
      console.error("Error fetching payments:", e);
      let errorMessage = "Failed to load payments. Please try again later.";
      
      if (e.response) {
        // The request was made and the server responded with a status code
        if (e.response.status === 401) {
          errorMessage = "Authentication required. Please login again.";
        } else if (e.response.status === 404) {
          errorMessage = "Payments endpoint not found.";
        } else if (e.response.data?.message) {
          errorMessage = e.response.data.message;
        }
      } else if (e.request) {
        // The request was made but no response was received
        errorMessage = "Network error. Please check your connection.";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to fetch payment summary for a booking
  const fetchPaymentSummary = useCallback(async (bookingId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/payment/summary/${bookingId}`);
      
      if (!response.data) {
        throw new Error("No payment summary data received");
      }

      setPaymentSummary(response.data);
    } catch (e) {
      console.error("Error fetching payment summary:", e);
      let errorMessage = "Failed to load payment summary. Please try again.";
      
      if (e.response) {
        if (e.response.status === 404) {
          errorMessage = "Payment summary not found for this booking.";
        } else if (e.response.data?.message) {
          errorMessage = e.response.data.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const filteredPayments = payments.filter(payment => {
    return filter === "all" || payment.status === filter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <span className="flex items-center px-3 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
            <CheckCircle size={12} className="mr-1" />
            Completed
          </span>
        );
      case "pending":
        return (
          <span className="flex items-center px-3 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">
            <Clock size={12} className="mr-1" />
            Pending
          </span>
        );
      case "processing":
        return (
          <span className="flex items-center px-3 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
            <AlertCircle size={12} className="mr-1" />
            Processing
          </span>
        );
      case "failed":
        return (
            <span className="flex items-center px-3 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">
                <X size={12} className="mr-1" />
                Failed
            </span>
        );
      case "refunded":
        return (
            <span className="flex items-center px-3 py-1 text-xs font-medium text-purple-800 bg-purple-100 rounded-full">
                <ArrowLeft size={12} className="mr-1" />
                Refunded
            </span>
        );
      case "advance":
        return (
            <span className="flex items-center px-3 py-1 text-xs font-medium text-indigo-800 bg-indigo-100 rounded-full">
                <DollarSign size={12} className="mr-1" />
                Advance
            </span>
        );
      default:
        return <span className="px-3 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full">{status}</span>;
    }
  };

  const handleViewDetails = async (payment) => {
    if (!payment?.booking_id?._id) {
      setError("Invalid booking reference");
      return;
    }
    
    setSelectedPayment(payment);
    await fetchPaymentSummary(payment.booking_id._id);
    setCurrentView("details");
  };

  const handleCancel = () => {
    setCurrentView("list");
    setSelectedPayment(null);
    setPaymentSummary(null);
  };

  if (currentView === "details") {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        {loading && (
          <div className="flex items-center justify-center">
            <svg className="w-8 h-8 mr-3 animate-spin text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-lg text-amber-600">Loading payment details...</p>
          </div>
        )}
        {error && (
          <div className="p-6 text-center border border-red-200 bg-red-50/50 rounded-xl">
            <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
            <p className="text-lg text-red-700">{error}</p>
            <button
              onClick={handleCancel}
              className="px-4 py-2 mt-4 text-white bg-red-500 rounded-lg hover:bg-red-600"
            >
              Back to List
            </button>
          </div>
        )}
        {!loading && !error && selectedPayment && paymentSummary && (
          <PaymentDetails
            selectedPayment={selectedPayment}
            paymentSummary={paymentSummary}
            onCancel={handleCancel}
            getStatusBadge={getStatusBadge}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-amber-50 to-orange-100 font-inter">
      <div className="p-8 mx-auto border shadow-xl bg-white/90 backdrop-blur-sm rounded-2xl border-amber-200 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text">
              Manage Payments
            </h1>
            <p className="mt-2 text-lg text-amber-700">Track and manage all payment transactions</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="text-amber-600" size={18} />
              <div className="relative">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-2 pr-10 text-base border rounded-lg shadow-sm appearance-none cursor-pointer border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white/80 text-amber-700"
                  style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 20 20\' fill=\'currentColor\'%3E%3Cpath fill-rule=\'evenodd\' d=\'M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z\' clip-rule=\'evenodd\' /%3E%3C/svg%3E")',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.5rem center',
                    backgroundSize: '1.5em 1.5em',
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                  <option value="advance">Advance</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <div className="py-12 text-center bg-white/50 rounded-xl">
            <div className="flex items-center justify-center">
              <svg className="w-8 h-8 mr-3 -ml-1 animate-spin text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-lg text-amber-600">Loading payments...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="py-12 text-center border border-red-200 bg-red-50/50 rounded-xl">
            <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
            <p className="text-lg text-red-700">Error: {error}</p>
            <button
              onClick={fetchPayments}
              className="px-4 py-2 mt-4 text-white bg-red-500 rounded-lg hover:bg-red-600"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="overflow-x-auto border shadow-md rounded-xl border-amber-200">
            <table className="min-w-full divide-y divide-amber-200">
              <thead className="bg-gradient-to-r from-amber-100 to-orange-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-amber-800">Customer Name</th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-amber-800">Contact</th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-amber-800">Destination</th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-amber-800">Total Amount</th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-amber-800">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-amber-800">Payment Date</th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-right uppercase text-amber-800">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y bg-white/50 backdrop-blur-sm divide-amber-100">
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((payment) => (
                    <tr key={payment._id} className="transition-colors duration-200 hover:bg-amber-50/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium text-amber-900">{payment.booking_id?.customer_id?.name || "N/A"}</span>
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-amber-800">
                        <p>{payment.booking_id?.customer_id?.phone || "N/A"}</p>
                        <p className="text-xs text-amber-600">{payment.booking_id?.customer_id?.email || "N/A"}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-amber-800">{payment.booking_id?.package_id?.title || "N/A"}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-semibold text-amber-900">
                          ${payment.booking_id?.package_id?.base_price?.toFixed(2) || "0.00"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(payment.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-amber-700">
                          {new Date(payment.payment_date).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleViewDetails(payment)}
                            className="p-2 text-orange-600 transition-colors duration-200 rounded-lg hover:text-orange-700 hover:bg-orange-100"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-12 text-center bg-white/50">
                      <CreditCard className="mx-auto mb-4 text-amber-400" size={48} />
                      <p className="text-lg text-amber-600">No payments found</p>
                      <p className="text-sm text-amber-500">Try adjusting your filter.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagePayments;