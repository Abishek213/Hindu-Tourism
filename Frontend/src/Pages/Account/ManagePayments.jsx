import { useState, useEffect, useCallback } from "react";
import {
  CreditCard,
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
  BadgeDollarSign,
  PlusCircle, // Added for new payment button
} from "lucide-react";
import api from "../../api/auth"; // Make sure this is properly configured

// PaymentOverlay component - New component for adding payments and showing summary
const PaymentOverlay = ({
  selectedBooking, // Renamed from selectedPayment as we are now selecting a booking
  paymentSummary,
  setPaymentSummary,
  setSelectedBooking,
  onCancel,
  getStatusBadge,
  onPaymentRecorded, // Callback after a new payment is recorded
  initialLoading, // Added to indicate initial load for overlay
  initialError,   // Added to indicate initial error for overlay
}) => {
  const [newPaymentAmount, setNewPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [transactionId, setTransactionId] = useState("");
  const [notes, setNotes] = useState("");
  const [recordingPayment, setRecordingPayment] = useState(false);
  const [recordError, setRecordError] = useState(null);
  const [recordSuccess, setRecordSuccess] = useState(false);

  // Derive total amount from selectedBooking's package_id.base_price
  const totalPackageAmount = selectedBooking?.package_id?.base_price || 0;
  const totalPaidAmount = paymentSummary?.total_paid_amount || 0;
  const dueAmount = Math.max(0, totalPackageAmount - totalPaidAmount);

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    setRecordingPayment(true);
    setRecordError(null);
    setRecordSuccess(false);

    try {
      const paymentAmount = parseFloat(newPaymentAmount);

      if (isNaN(paymentAmount)) {
        throw new Error("Please enter a valid payment amount");
      }

      if (paymentAmount <= 0) {
        throw new Error("Payment amount must be greater than zero.");
      }

      if (paymentAmount > dueAmount) {
        throw new Error(`Payment amount cannot exceed due amount of $${dueAmount.toFixed(2)}`);
      }

      const paymentData = {
        booking_id: selectedBooking._id,
        amount: paymentAmount,
        payment_method: paymentMethod,
        transaction_id: transactionId,
        notes,
        status: paymentAmount >= dueAmount ? 'completed' : 'advance'
      };

      const response = await api.put('/payment/record', paymentData).catch(e => {
        throw e;
      });

      if (response.data) {
        setRecordSuccess(true);
        setNewPaymentAmount("");
        setTransactionId("");
        setNotes("");

        // Calculate new amounts
        const updatedTotalPaid = totalPaidAmount + paymentAmount;
        const updatedDueAmount = Math.max(0, totalPackageAmount - updatedTotalPaid);

        // Determine new overall status
        const newOverallStatus = updatedDueAmount <= 0 ? 'completed' :
          (updatedTotalPaid > 0 ? 'advance' : 'pending');

        // Update the local state with all changes
        setPaymentSummary({
          ...paymentSummary,
          total_paid_amount: updatedTotalPaid,
          due_amount: updatedDueAmount,
          overall_payment_status: newOverallStatus
        });

        // Also update the selected booking's status
        setSelectedBooking(prev => ({
          ...prev,
          overallPaymentStatus: newOverallStatus
        }));

        onPaymentRecorded(selectedBooking._id);
      }
    } catch (e) {
      console.error("Error recording new payment:", e);
      let errorMessage = "Failed to record payment. Please try again.";

      if (e.response?.data?.error) {
        errorMessage = e.response.data.error;
      } else if (e.message) {
        errorMessage = e.message;
      }

      setRecordError(errorMessage);
    } finally {
      setRecordingPayment(false);
    }
  };

  if (!selectedBooking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative max-w-4xl w-full p-8 mx-auto border shadow-xl rounded-2xl bg-white/90 border-amber-200 overflow-y-auto max-h-[90vh]">
        {initialLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
            <svg className="w-10 h-10 mr-3 animate-spin text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-xl text-amber-600">Loading payment summary...</p>
          </div>
        )}
        {initialError && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 bg-red-50/70 rounded-xl">
            <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
            <p className="text-xl font-semibold text-red-700">{initialError}</p>
            <button
              onClick={onCancel}
              className="px-6 py-3 mt-4 text-lg font-medium text-white transition-all duration-200 bg-red-500 shadow-lg rounded-xl hover:bg-red-600"
            >
              Close
            </button>
          </div>
        )}

        {!initialLoading && !initialError && (
          <>
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
                  Manage Payments for Booking
                </h2>
              </div>
              {/* Display booking status here - using the overall payment status from selectedBooking */}
              {getStatusBadge(paymentSummary?.overall_payment_status || selectedBooking.overallPaymentStatus || 'pending')}          
               </div>

            <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2">
              {/* Customer Information */}
              <div className="flex flex-col items-start p-4 rounded-lg shadow-sm bg-amber-50/50">
                <h3 className="flex items-center mb-3 text-lg font-semibold text-amber-800">
                  <User size={20} className="mr-2 text-amber-500" /> Customer
                </h3>
                <p className="font-medium text-amber-900">{selectedBooking.customer_id?.name || "N/A"}</p>
                <p className="flex items-center mt-1 text-sm text-amber-700">
                  <Mail size={14} className="mr-2 opacity-75" />
                  {selectedBooking.customer_id?.email || "N/A"}
                </p>
                <p className="flex items-center mt-1 text-sm text-amber-700">
                  <Phone size={14} className="mr-2 opacity-75" />
                  {selectedBooking.customer_id?.phone || "N/A"}
                </p>
              </div>

              {/* Package / Booking Information */}
              <div className="flex flex-col items-start p-4 rounded-lg shadow-sm bg-orange-50/50">
                <h3 className="flex items-center mb-3 text-lg font-semibold text-orange-800">
                  <MapPin size={20} className="mr-2 text-orange-500" /> Destination
                </h3>
                <p className="font-medium text-orange-900">{selectedBooking.package_id?.title || "N/A"}</p>
                <p className="flex items-center mt-1 text-sm text-orange-700">
                  <Tag size={14} className="mr-2 opacity-75" />
                  Booking Ref: <span className="ml-1 font-mono">{selectedBooking.booking_ref_id || selectedBooking._id || "N/A"}</span>
                </p>
                <p className="flex items-center mt-1 text-sm text-orange-700">
                  <Calendar size={14} className="mr-2 opacity-75" />
                  Travel Dates: {new Date(selectedBooking.travel_start_date).toLocaleDateString()} - {new Date(selectedBooking.travel_end_date).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Payment Summary Section */}
            <div className="p-6 mb-8 border rounded-lg shadow-inner bg-amber-100/70 border-amber-200">
              <h3 className="flex items-center mb-4 text-xl font-bold text-amber-800">
                <BadgeDollarSign size={24} className="mr-2 text-amber-600" /> Overall Payment Status
              </h3>
              <div className="grid grid-cols-1 gap-4 text-center md:grid-cols-3">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <p className="mb-1 text-sm text-amber-700">Total Package Amount</p>
                  <p className="text-xl font-bold text-amber-900">${totalPackageAmount.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <p className="mb-1 text-sm text-amber-700">Total Paid</p>
                  <p className="text-xl font-bold text-green-600">${totalPaidAmount.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <p className="mb-1 text-sm text-amber-700">Amount Due</p>
                  <p className="text-xl font-bold text-red-600">${dueAmount.toFixed(2)}</p>
                </div>
              </div>
              {dueAmount > 0 && (
                <p className="mt-4 text-sm text-center text-amber-700">
                  A remaining balance of <span className="font-bold text-red-600">${dueAmount.toFixed(2)}</span> is due.
                </p>
              )}
              {dueAmount <= 0 && (
                <p className="mt-4 text-sm font-semibold text-center text-green-700">
                  This booking is fully paid!
                </p>
              )}
            </div>

            {/* Record New Payment Section */}
            <div className="p-6 border border-blue-200 rounded-lg shadow-inner bg-blue-50/50">
              <h3 className="flex items-center mb-4 text-xl font-bold text-blue-800">
                <PlusCircle size={24} className="mr-2 text-blue-600" /> Record New Payment
              </h3>
              <form onSubmit={handleRecordPayment} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="amount" className="block mb-1 text-sm font-medium text-gray-700">
                    Amount to Pay ($)
                  </label>
                  <input
                    type="number"
                    id="amount"
                    value={newPaymentAmount}
                    onChange={(e) => setNewPaymentAmount(e.target.value)}
                    min="0.01"
                    step="0.01"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="paymentMethod" className="block mb-1 text-sm font-medium text-gray-700">
                    Payment Method
                  </label>
                  <select
                    id="paymentMethod"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="credit_card">Credit Card</option>
                    <option value="debit_card">Debit Card</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cash">Cash</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="transactionId" className="block mb-1 text-sm font-medium text-gray-700">
                    Transaction ID (Optional)
                  </label>
                  <input
                    type="text"
                    id="transactionId"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="notes" className="block mb-1 text-sm font-medium text-gray-700">
                    Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows="2"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>
                {recordError && (
                  <div className="flex items-center text-sm text-red-700 md:col-span-2">
                    <AlertCircle size={16} className="mr-2" /> {recordError}
                  </div>
                )}
                {recordSuccess && (
                  <div className="flex items-center text-sm text-green-700 md:col-span-2">
                    <CheckCircle size={16} className="mr-2" /> Payment recorded successfully!
                  </div>
                )}
                <div className="flex justify-end md:col-span-2">
                  <button
                    type="submit"
                    className="px-6 py-3 text-lg font-medium text-white transition-all duration-200 shadow-lg rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={recordingPayment}
                  >
                    {recordingPayment ? "Recording..." : "Record Payment"}
                  </button>
                </div>
              </form>
            </div>

            <div className="flex justify-center pt-8 mt-8 border-t border-amber-200">
              <button
                onClick={onCancel}
                className="px-6 py-3 text-lg font-medium text-white transition-all duration-200 shadow-lg rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 hover:shadow-xl"
              >
                Done
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};


// Main ManagePayments component
const ManagePayments = () => {
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState("all");
  const [currentView, setCurrentView] = useState("list");
  const [selectedBookingForPayment, setSelectedBookingForPayment] = useState(null);
  const [paymentSummary, setPaymentSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState(null);


  // Function to fetch all payments from the API
  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {

      const response = await api.get("/payment/latest-per-booking");

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
  // This is crucial for the overlay
  const fetchPaymentSummary = useCallback(async (bookingId) => {
    setSummaryLoading(true);
    setSummaryError(null);
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
      } else if (e.request) {
        errorMessage = "Network error while fetching summary. Check connection.";
      }

      setSummaryError(errorMessage);
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const filteredPayments = payments.filter(payment => {
    // Check if booking_id exists before accessing its properties
    if (!payment.booking_id) return false;

    // Filter by the overall payment status of the booking
    const statusMatch = filter === "all" || (payment.booking_id.overallPaymentStatus || payment.status) === filter;

    return statusMatch;
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

  // When 'Select' button is clicked, we set the selectedBookingForPayment
  // and fetch its summary before opening the overlay.
  const handleSelectBooking = async (paymentRecord) => {
    // The paymentRecord itself contains booking_id populated
    if (!paymentRecord?.booking_id?._id) {
      setError("Invalid booking reference for payment record.");
      return;
    }
    // Set the selected payment record which has the populated booking details
    setSelectedBookingForPayment(paymentRecord.booking_id); // Pass the booking object
    setCurrentView("details"); // Go to details view which now shows the overlay
    await fetchPaymentSummary(paymentRecord.booking_id._id); // Fetch summary for THIS booking
  };

  const handleCancel = () => {
    setCurrentView("list");
    setSelectedBookingForPayment(null);
    setPaymentSummary(null);
  };

  // This function is called from PaymentOverlay when a new payment is recorded
 const handlePaymentRecorded = async (bookingId) => {
  // Run these in parallel instead of sequentially
  await Promise.all([
    fetchPaymentSummary(bookingId),
    fetchPayments()
  ]);
  
  // Only fetch booking if needed
  if (selectedBookingForPayment?._id === bookingId) {
    const updatedBooking = await api.get(`/booking/${bookingId}`);
    setSelectedBookingForPayment(updatedBooking.data);
  }
};

  // Render the PaymentOverlay when in "details" view
  if (currentView === "details") {
    return (
      <PaymentOverlay
        selectedBooking={selectedBookingForPayment}
        paymentSummary={paymentSummary}
        setPaymentSummary={setPaymentSummary}
         setSelectedBooking={setSelectedBookingForPayment}
        onCancel={handleCancel}
        getStatusBadge={getStatusBadge}
        onPaymentRecorded={handlePaymentRecorded}
        initialLoading={summaryLoading}
        initialError={summaryError}
      />
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
              <thead className="bg-gray-50 px-8 py-6 bg-secondary-green">
                <tr>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Customer Name</th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Contact</th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Destination</th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Payment Status</th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Latest Payment Date</th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y bg-white/50 backdrop-blur-sm divide-amber-100">
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((payment) => (
                    // Ensure booking_id and customer_id are populated
                    payment.booking_id && payment.booking_id.customer_id && payment.booking_id.package_id && (
                      <tr key={payment._id} className="transition-colors duration-200 hover:bg-amber-50/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-medium text-amber-900">{payment.booking_id.customer_id.name}</span>
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-amber-800 w-40 max-w-40">
                          <div className="overflow-hidden">
                            <p className="truncate" title={payment.booking_id.customer_id.phone}>
                              {payment.booking_id.customer_id.phone}
                            </p>
                            <p className="text-xs truncate text-amber-600" title={payment.booking_id.customer_id.email}>
                              {payment.booking_id.customer_id.email}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-amber-800">{payment.booking_id.package_id.title}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {/* Use the overallPaymentStatus from the populated booking_id */}
                          {getStatusBadge(payment.booking_id.overallPaymentStatus || 'pending')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-amber-700">
                            {new Date(payment.payment_date).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleSelectBooking(payment)} // Pass the whole payment object
                              className="px-4 py-2 text-white transition-colors duration-200 bg-blue-500 rounded-lg hover:bg-blue-600"
                              title="Manage Payments for this Booking"
                            >
                              Manage
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-12 text-center bg-white/50">
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