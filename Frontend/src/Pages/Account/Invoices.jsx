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
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">Paid</span>;
      case "draft":
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700 border border-gray-200">Draft</span>;
      case "sent":
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 border border-blue-200">Sent</span>;
      case "cancelled":
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700 border border-red-200">Cancelled</span>;
      default:
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700 border border-gray-200">{status}</span>;
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
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Amount</th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Date</th>
                  <th className="px-8 py-6 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredInvoices.map((invoice, index) => (
                  <tr key={invoice._id} className={`hover:bg-orange-25 transition-colors duration-150 ${index % 2 === 0 ? 'bg-gray-25' : ''}`}>
                    <td className="px-8 py-6 whitespace-nowrap font-medium text-gray-800">{getCustomerName(invoice)}</td>
                    <td className="px-8 py-6 whitespace-nowrap font-semibold text-gray-700">${invoice.amount.toLocaleString()}</td>
                    <td className="px-8 py-6 whitespace-nowrap">{statusBadge(invoice.status)}</td>
                    <td className="px-8 py-6 whitespace-nowrap text-gray-700">{new Date(invoice.invoice_date).toLocaleDateString()}</td>
                    <td className="px-8 py-6 whitespace-nowrap text-right text-sm font-medium space-x-4">
                      <button 
                        onClick={() => handleViewInvoice(invoice)}
                        className="inline-flex items-center text-orange-500 hover:text-orange-700 font-semibold transition-colors duration-150"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                      </button>
                      <button 
                        onClick={() => handleDownloadPDF(invoice._id)}
                        className="inline-flex items-center text-blue-500 hover:text-blue-700 font-semibold transition-colors duration-150"
                      >
                        <FileText className="w-4 h-4 mr-1" />
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

        {/* View Invoice Modal */}
        {showViewModal && selectedInvoice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">
                    Invoice Details
                  </h2>
                  <button 
                    onClick={handleCloseForm}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-150"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Customer</h3>
                        <p className="text-lg font-semibold text-gray-800">{getCustomerName(selectedInvoice)}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Status</h3>
                        <div className="flex">
                          {statusBadge(selectedInvoice.status)}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Amount</h3>
                        <p className="text-2xl font-bold text-gray-800">${selectedInvoice.amount.toLocaleString()}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Date</h3>
                        <p className="text-lg font-semibold text-gray-700">{new Date(selectedInvoice.invoice_date).toLocaleDateString()}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Booking Date</h3>
                        <p className="text-sm font-medium text-gray-600">
                          {selectedInvoice.booking_id?.booking_date ? 
                            new Date(selectedInvoice.booking_id.booking_date).toLocaleDateString() : 
                            'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-orange-200">
                    <div className="flex justify-between items-center">
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

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => handleDownloadPDF(selectedInvoice._id)}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
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