import { useState, useEffect } from "react";
import { X, Calendar, User, DollarSign, FileText, Edit, Eye } from "lucide-react";
import api, { getCurrentUser } from "../../api/auth";

const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookings, setBookings] = useState([]);

  // Fetch invoices and bookings from backend
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Check authentication
        const user = getCurrentUser();
        if (!user) {
          throw new Error('Not authenticated');
        }

        // Fetch invoices
        const invoicesResponse = await api.get('/invoice');
        setInvoices(invoicesResponse.data);

        // Fetch bookings for reference
        const bookingsResponse = await api.get('/booking');
        setBookings(bookingsResponse.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
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
    switch (status) {
      case "paid":
        return <span className="px-3 py-1 text-xs font-semibold border rounded-full bg-emerald-100 text-emerald-700 border-emerald-200">Paid</span>;
      case "draft":
        return <span className="px-3 py-1 text-xs font-semibold text-gray-700 bg-gray-100 border border-gray-200 rounded-full">Draft</span>;
      case "sent":
        return <span className="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 border border-blue-200 rounded-full">Sent</span>;
      case "cancelled":
        return <span className="px-3 py-1 text-xs font-semibold text-red-700 bg-red-100 border border-red-200 rounded-full">Cancelled</span>;
      default:
        return <span className="px-3 py-1 text-xs font-semibold text-gray-700 bg-gray-100 border border-gray-200 rounded-full">{status}</span>;
    }
  };

  const handleCloseForm = () => {
    setShowViewModal(false);
    setSelectedInvoice(null);
    setError(null);
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowViewModal(true);
  };

  const handleDownloadPDF = async (invoiceId) => {
    try {
      const response = await api.get(`/invoice/${invoiceId}/download`, {
        responseType: 'blob'
      });
      
      // Create a blob URL for the PDF
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${invoiceId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to download invoice');
    }
  };

  const getStatusCount = (status) => {
    if (status === "all") return invoices.length;
    return invoices.filter(inv => inv.status === status).length;
  };

  const getCustomerName = (invoice) => {
    return invoice.booking_id?.customer_id?.name || 'Unknown Customer';
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
        <div className="p-8 mb-8 bg-white border border-orange-100 shadow-lg rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text">
                Invoice Management
              </h1>
              <p className="mt-2 text-gray-600">View and manage your invoices</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Filter Dropdown */}
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

        {/* Invoice Table */}
        <div className="overflow-hidden bg-white border border-orange-100 shadow-lg rounded-2xl">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-orange-50 to-yellow-50">
                <tr>
                  <th className="px-8 py-6 text-sm font-bold tracking-wider text-left text-gray-700 uppercase">Customer</th>
                  <th className="px-8 py-6 text-sm font-bold tracking-wider text-left text-gray-700 uppercase">Amount</th>
                  <th className="px-8 py-6 text-sm font-bold tracking-wider text-left text-gray-700 uppercase">Status</th>
                  <th className="px-8 py-6 text-sm font-bold tracking-wider text-left text-gray-700 uppercase">Date</th>
                  <th className="px-8 py-6 text-sm font-bold tracking-wider text-right text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredInvoices.map((invoice, index) => (
                  <tr key={invoice._id} className={`hover:bg-orange-25 transition-colors duration-150 ${index % 2 === 0 ? 'bg-gray-25' : ''}`}>
                    <td className="px-8 py-6 font-medium text-gray-800 whitespace-nowrap">{getCustomerName(invoice)}</td>
                    <td className="px-8 py-6 font-semibold text-gray-700 whitespace-nowrap">${invoice.amount.toLocaleString()}</td>
                    <td className="px-8 py-6 whitespace-nowrap">{statusBadge(invoice.status)}</td>
                    <td className="px-8 py-6 text-gray-700 whitespace-nowrap">{new Date(invoice.invoice_date).toLocaleDateString()}</td>
                    <td className="px-8 py-6 space-x-4 text-sm font-medium text-right whitespace-nowrap">
                      <button 
                        onClick={() => handleViewInvoice(invoice)}
                        className="inline-flex items-center font-semibold text-orange-500 transition-colors duration-150 hover:text-orange-700"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                      </button>
                      <button 
                        onClick={() => handleDownloadPDF(invoice._id)}
                        className="inline-flex items-center font-semibold text-blue-500 transition-colors duration-150 hover:text-blue-700"
                      >
                        <FileText className="w-4 h-4 mr-1" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredInvoices.length === 0 && (
              <div className="py-16 text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg text-gray-500">No invoices found for the selected filter</p>
              </div>
            )}
          </div>
        </div>

        {/* View Invoice Modal */}
        {showViewModal && selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text">
                    Invoice Details
                  </h2>
                  <button 
                    onClick={handleCloseForm}
                    className="text-gray-400 transition-colors duration-150 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-6 border border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div>
                        <h3 className="mb-1 text-xs font-semibold tracking-wider text-gray-500 uppercase">Customer</h3>
                        <p className="text-lg font-semibold text-gray-800">{getCustomerName(selectedInvoice)}</p>
                      </div>
                      
                      <div>
                        <h3 className="mb-1 text-xs font-semibold tracking-wider text-gray-500 uppercase">Status</h3>
                        <div className="flex">
                          {statusBadge(selectedInvoice.status)}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="mb-1 text-xs font-semibold tracking-wider text-gray-500 uppercase">Amount</h3>
                        <p className="text-2xl font-bold text-gray-800">${selectedInvoice.amount.toLocaleString()}</p>
                      </div>
                      
                      <div>
                        <h3 className="mb-1 text-xs font-semibold tracking-wider text-gray-500 uppercase">Date</h3>
                        <p className="text-lg font-semibold text-gray-700">{new Date(selectedInvoice.invoice_date).toLocaleDateString()}</p>
                      </div>
                      
                      <div>
                        <h3 className="mb-1 text-xs font-semibold tracking-wider text-gray-500 uppercase">Booking Date</h3>
                        <p className="text-sm font-medium text-gray-600">
                          {selectedInvoice.booking_id?.booking_date ? 
                            new Date(selectedInvoice.booking_id.booking_date).toLocaleDateString() : 
                            'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-6 border-t border-orange-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700">Invoice Summary</h3>
                        <p className="text-xs text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Total Amount</p>
                        <p className="text-xl font-bold text-orange-600">${selectedInvoice.amount.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex mt-6 space-x-3">
                  <button
                    onClick={() => handleDownloadPDF(selectedInvoice._id)}
                    className="flex items-center justify-center flex-1 px-4 py-2 font-semibold text-white transition-all duration-200 transform rounded-lg shadow-lg bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 hover:shadow-xl hover:scale-105"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Download Invoice
                  </button>
                </div> 
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceManagement;