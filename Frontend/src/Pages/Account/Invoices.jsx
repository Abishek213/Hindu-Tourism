import { useState, useEffect } from "react";
import { X, Calendar, User, FileText, Eye } from "lucide-react";
import { invoiceService } from "../../services/invoiceService";

const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Status colors mapping
  const statusColors = {
    paid: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    draft: 'bg-gray-100 text-gray-700 border-gray-200',
    sent: 'bg-blue-100 text-blue-700 border-blue-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200',
    partial: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    pending: 'bg-orange-100 text-orange-700 border-orange-200'
  };

  const assignmentStatusColors = {
    Assigned: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Not Assigned': 'bg-gray-100 text-gray-700 border-gray-200'
  };

  const bookingStatusColors = {
    confirmed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    completed: 'bg-gray-100 text-gray-700 border-gray-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200',
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200'
  };

  const paymentStatusColors = {
    paid: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    partial: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    pending: 'bg-orange-100 text-orange-700 border-orange-200'
  };

  // Fetch invoices from backend
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const invoicesData = await invoiceService.getInvoices();
        setInvoices(invoicesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredInvoices = invoices.filter((invoice) => {
    return filterStatus === "all" || invoice.status === filterStatus;
  });

  const statusBadge = (status) => {
    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${statusColors[status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
        {status}
      </span>
    );
  };

  const assignmentBadge = (isAssigned) => {
    const status = isAssigned ? 'Assigned' : 'Not Assigned';
    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${assignmentStatusColors[status]}`}>
        {status}
      </span>
    );
  };

  const bookingStatusBadge = (status) => {
    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${bookingStatusColors[status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
        {status}
      </span>
    );
  };

  const paymentStatusBadge = (status) => {
    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${paymentStatusColors[status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
        {status}
      </span>
    );
  };

  const handleDownloadPDF = async (invoiceId) => {
    try {
      await invoiceService.downloadInvoicePDF(invoiceId);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStatusChange = async (invoiceId, newStatus) => {
    try {
      setIsLoading(true);
      const updatedInvoice = await invoiceService.updateInvoiceStatus(invoiceId, newStatus);
      
      // Update the invoice in state
      const updatedInvoices = invoices.map(inv => 
        inv._id === invoiceId ? updatedInvoice : inv
      );
      setInvoices(updatedInvoices);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusCount = (status) => {
    if (status === "all") return invoices.length;
    return invoices.filter(inv => inv.status === status).length;
  };

  const getCustomerName = (invoice) => {
    return invoice.booking_id?.customer_id?.name || 'Unknown Customer';
  };

  const getBookingStatus = (invoice) => {
    return invoice.booking_id?.status || 'unknown';
  };

  const getGuideStatus = (invoice) => {
    return invoice.booking_id?.guide_id ? 'Assigned' : 'Not Assigned';
  };

  const getTransportStatus = (invoice) => {
    return invoice.booking_id?.transport_id ? 'Assigned' : 'Not Assigned';
  };

  const getPaymentStatus = (invoice) => {
    // Calculate payment status based on payments
    if (!invoice.payments || invoice.payments.length === 0) return 'pending';
    
    const totalPaid = invoice.payments.reduce((sum, payment) => sum + payment.amount, 0);
    
    if (totalPaid >= invoice.amount) return 'paid';
    if (totalPaid > 0) return 'partial';
    return 'pending';
  };

  if (isLoading && invoices.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invoices...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-4 flex items-center justify-center">
        <div className="bg-white rounded-xl p-6 shadow-lg max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-red-500 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-orange-100">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">
                Invoice Management
              </h1>
              <p className="text-gray-600 mt-2">View and manage your invoices</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Filter Dropdown */}
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent font-medium text-gray-700"
                >
                  <option value="all">All ({getStatusCount("all")})</option>
                  <option value="draft">Draft ({getStatusCount("draft")})</option>
                  <option value="sent">Sent ({getStatusCount("sent")})</option>
                  <option value="paid">Paid ({getStatusCount("paid")})</option>
                  <option value="cancelled">Cancelled ({getStatusCount("cancelled")})</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-orange-50 to-yellow-50">
                <tr>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Customer</th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Booking Status</th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Guide Status</th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Transport Status</th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Payment Status</th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Invoice Status</th>
                  <th className="px-8 py-6 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredInvoices.map((invoice, index) => (
                  <tr key={invoice._id} className={`hover:bg-orange-25 transition-colors duration-150 ${index % 2 === 0 ? 'bg-gray-25' : ''}`}>
                    <td className="px-8 py-6 whitespace-nowrap font-medium text-gray-800">{getCustomerName(invoice)}</td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      {bookingStatusBadge(getBookingStatus(invoice))}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      {assignmentBadge(!!invoice.booking_id?.guide_id)}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      {assignmentBadge(!!invoice.booking_id?.transport_id)}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      {paymentStatusBadge(getPaymentStatus(invoice))}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <select
                        value={invoice.status}
                        onChange={(e) => handleStatusChange(invoice._id, e.target.value)}
                        className={`appearance-none bg-transparent border rounded-md px-3 py-1 text-xs font-semibold ${statusColors[invoice.status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}
                        disabled={invoice.status === 'paid' || invoice.status === 'cancelled'}
                      >
                        <option value="draft">Draft</option>
                        <option value="sent">Sent</option>
                        <option value="paid">Paid</option>
                        <option value="cancelled">Cancel</option>
                      </select>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-right text-sm font-medium space-x-4">
                      <button 
                        onClick={() => handleDownloadPDF(invoice._id)}
                        className="inline-flex items-center text-blue-500 hover:text-blue-700 font-semibold transition-colors duration-150"
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredInvoices.length === 0 && (
              <div className="text-center py-16">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No invoices found for the selected filter</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceManagement;