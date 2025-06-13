import { useState, useEffect } from "react";
import { X, Calendar, User, FileText, Eye, Search } from "lucide-react";
import { invoiceService } from "../../services/invoiceService";
import { toast } from 'react-hot-toast';

const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const getCustomerName = (invoice) => {
    return invoice.booking_id?.customer_id?.name || 'Unknown Customer';
  };

  const getBookingReference = (invoice) => {
    const bookingId = invoice.booking_id?._id;
    if (!bookingId) return 'N/A';
    return bookingId.toString().slice(-6).toUpperCase();
  };

  const getBookingStatus = (invoice) => {
    return invoice.booking_id?.status || 'unknown';
  };

  const getPaymentStatus = (invoice) => {
    if (!invoice.payments || invoice.payments.length === 0) return 'pending';
    
    const totalPaid = invoice.payments.reduce((sum, payment) => sum + payment.amount, 0);
    
    if (totalPaid >= invoice.amount) return 'paid';
    if (totalPaid > 0) return 'partial';
    return 'pending';
  };
  
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
    const matchesStatus = filterStatus === "all" || invoice.status === filterStatus;
    const matchesSearch = searchTerm === "" || 
      getCustomerName(invoice).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getBookingReference(invoice).toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
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
    
    // Get current status before optimistic update
    const currentInvoice = invoices.find(inv => inv._id === invoiceId);
    const currentStatus = currentInvoice.status;
    
    // Only show optimistic UI update for non-email transitions
    if (newStatus !== 'sent') {
      setInvoices(prev => 
        prev.map(inv => 
          inv._id === invoiceId ? { ...inv, status: newStatus } : inv
        )
      );
    }
    
    const updatedInvoice = await invoiceService.updateInvoiceStatus(invoiceId, newStatus);
    
    // Always update with server response
    setInvoices(prev => 
      prev.map(inv => 
        inv._id === invoiceId ? updatedInvoice : inv
      )
    );
    
    if (newStatus !== 'sent') {
      toast.success('Invoice status updated successfully');
    } else {
      toast.success('Invoice sent successfully');
    }
  } catch (err) {
    // Revert only if we did optimistic update
    if (newStatus !== 'sent') {
      setInvoices(prev => 
        prev.map(inv => 
          inv._id === invoiceId ? { ...inv, status: currentStatus } : inv
        )
      );
    }
    toast.error(err.message);
  } finally {
    setIsLoading(false);
  }
};

  const getStatusCount = (status) => {
    if (status === "all") return invoices.length;
    return invoices.filter(inv => inv.status === status).length;
  };

  const getGuideStatus = (invoice) => {
    return invoice.booking_id?.guide_id ? 'Assigned' : 'Not Assigned';
  };

  const getTransportStatus = (invoice) => {
    return invoice.booking_id?.transport_id ? 'Assigned' : 'Not Assigned';
  };

  if (isLoading && invoices.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-t-2 border-b-2 border-orange-500 rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading invoices...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="w-full max-w-md p-6 text-center bg-white shadow-lg rounded-xl">
          <h2 className="mb-2 text-xl font-bold text-red-500">Error</h2>
          <p className="mb-4 text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 text-white transition-colors bg-orange-500 rounded-lg hover:bg-orange-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="p-8 mb-6 bg-white border border-orange-100 shadow-lg rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text">
                Invoice Management
              </h1>
              <p className="mt-2 text-gray-600">View and manage your invoices</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 pr-8 font-medium text-gray-700 bg-white border border-gray-300 appearance-none rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
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

        {/* Search Bar */}
        <div className="p-6 mb-8 bg-white border border-orange-100 shadow-lg rounded-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by booking reference or customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Invoice Table */}
        <div className="overflow-hidden bg-white border border-orange-100 shadow-lg rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary-green bg-gray-50 px-8 py-6">
                <tr>
                  <th className="px-4 py-4 text-left text-sm font-bold text-gray-100 uppercase tracking-wider whitespace-nowrap">Booking Ref</th>
                  <th className="px-4 py-4 text-left text-sm font-bold text-gray-100 uppercase tracking-wider whitespace-nowrap">Customer</th>
                  <th className="px-4 py-4 text-left text-sm font-bold text-gray-100 uppercase tracking-wider whitespace-nowrap">Booking Status</th>
                  <th className="px-4 py-4 text-left text-sm font-bold text-gray-100 uppercase tracking-wider whitespace-nowrap">Guide</th>
                  <th className="px-4 py-4 text-left text-sm font-bold text-gray-100 uppercase tracking-wider whitespace-nowrap">Transport</th>
                  <th className="px-4 py-4 text-left text-sm font-bold text-gray-100 uppercase tracking-wider whitespace-nowrap">Payment</th>
                  <th className="px-4 py-4 text-left text-sm font-bold text-gray-100 uppercase tracking-wider whitespace-nowrap">Invoice</th>
                  <th className="px-4 py-4 text-right text-sm font-bold text-gray-100 uppercase tracking-wider whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredInvoices.map((invoice, index) => (
                  <tr key={invoice._id} className={`hover:bg-orange-25 transition-colors duration-150 ${index % 2 === 0 ? 'bg-gray-25' : ''}`}>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {getBookingReference(invoice)}
                      </span>
                    </td>
                    <td className="px-4 py-4 max-w-[200px] truncate font-medium text-gray-800">
                      {getCustomerName(invoice)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {bookingStatusBadge(getBookingStatus(invoice))}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {assignmentBadge(!!invoice.booking_id?.guide_id)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {assignmentBadge(!!invoice.booking_id?.transport_id)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {paymentStatusBadge(getPaymentStatus(invoice))}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
  <select
    value={invoice.status}
    onChange={(e) => handleStatusChange(invoice._id, e.target.value)}
    className={`appearance-none bg-transparent border rounded-md px-3 py-1 text-xs font-semibold ${statusColors[invoice.status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}
    disabled={invoice.status === 'paid' || invoice.status === 'cancelled'}
  >
    {['draft', 'sent', 'paid', 'cancelled'].includes(invoice.status) && (
      <option value={invoice.status} disabled>
        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
      </option>
    )}
    {invoice.status !== 'sent' && <option value="sent">Sent</option>}
    {invoice.status !== 'paid' && <option value="paid">Paid</option>}
    {invoice.status !== 'cancelled' && <option value="cancelled">Cancel Invoice</option>}
  </select>
</td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button 
                        onClick={() => handleDownloadPDF(invoice._id)}
                        className="inline-flex items-center font-semibold text-blue-500 transition-colors duration-150 hover:text-blue-700"
                        title="Download PDF"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredInvoices.length === 0 && (
            <div className="py-16 text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg text-gray-500">
                {searchTerm ? 'No invoices found matching your search' : 'No invoices found for the selected filter'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceManagement;