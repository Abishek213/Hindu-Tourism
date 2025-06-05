import { useState, useEffect } from "react";
import { PlusCircle, X, Save, Calendar, User, DollarSign, FileText } from "lucide-react";

const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [formData, setFormData] = useState({
    customer: "",
    amount: "",
    status: "unpaid",
    date: new Date().toISOString().split('T')[0]
  });

  // Dummy invoice data
  useEffect(() => {
    const dummyInvoices = [
      { id: 1, invoiceNo: "INV-2025-001", customer: "Jane Smith", amount: 1500, status: "paid", date: "2025-05-01" },
      { id: 2, invoiceNo: "INV-2025-002", customer: "John Doe", amount: 2300, status: "unpaid", date: "2025-05-05" },
      { id: 3, invoiceNo: "INV-2025-003", customer: "Alex Johnson", amount: 1800, status: "paid", date: "2025-05-10" },
      { id: 4, invoiceNo: "INV-2025-004", customer: "Maria Garcia", amount: 2500, status: "overdue", date: "2025-04-28" },
      { id: 5, invoiceNo: "INV-2025-005", customer: "David Wilson", amount: 1200, status: "unpaid", date: "2025-05-15" },
      { id: 6, invoiceNo: "INV-2025-006", customer: "Sarah Brown", amount: 3200, status: "paid", date: "2025-05-12" },
    ];
    setInvoices(dummyInvoices);
  }, []);

  const filteredInvoices = invoices.filter((invoice) => {
    return filterStatus === "all" || invoice.status === filterStatus;
  });

  const statusBadge = (status) => {
    switch (status) {
      case "paid":
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">Paid</span>;
      case "unpaid":
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-700 border border-amber-200">Unpaid</span>;
      case "overdue":
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700 border border-red-200">Overdue</span>;
      default:
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700 border border-gray-200">{status}</span>;
    }
  };

  const handleCreateInvoice = () => {
    setShowCreateForm(true);
  };

  const handleCloseForm = () => {
    setShowCreateForm(false);
    setShowEditForm(false);
    setShowViewModal(false);
    setSelectedInvoice(null);
    setFormData({
      customer: "",
      amount: "",
      status: "unpaid",
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleEditInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setFormData({
      customer: invoice.customer,
      amount: invoice.amount.toString(),
      status: invoice.status,
      date: invoice.date
    });
    setShowEditForm(true);
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowViewModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (!formData.customer || !formData.amount) return;

    if (showEditForm && selectedInvoice) {
      // Update existing invoice
      const updatedInvoice = {
        ...selectedInvoice,
        customer: formData.customer,
        amount: parseFloat(formData.amount),
        status: formData.status,
        date: formData.date
      };

      setInvoices(prev => prev.map(inv => 
        inv.id === selectedInvoice.id ? updatedInvoice : inv
      ));
    } else {
      // Create new invoice
      const newInvoice = {
        id: invoices.length + 1,
        invoiceNo: `INV-2025-${String(invoices.length + 1).padStart(3, '0')}`,
        customer: formData.customer,
        amount: parseFloat(formData.amount),
        status: formData.status,
        date: formData.date
      };

      setInvoices(prev => [newInvoice, ...prev]);
    }

    handleCloseForm();
  };

  const getStatusCount = (status) => {
    if (status === "all") return invoices.length;
    return invoices.filter(inv => inv.status === status).length;
  };

  const getTotalRevenue = () => {
    return invoices.filter(inv => inv.status === "paid").reduce((sum, inv) => sum + inv.amount, 0);
  };

  const getPendingAmount = () => {
    return invoices.filter(inv => inv.status === "unpaid").reduce((sum, inv) => sum + inv.amount, 0);
  };

  const getOverdueAmount = () => {
    return invoices.filter(inv => inv.status === "overdue").reduce((sum, inv) => sum + inv.amount, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-orange-100">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">
                Invoice Management
              </h1>
              <p className="text-gray-600 mt-2">Manage your invoices with ease and efficiency</p>
            </div>
            <button 
              onClick={handleCreateInvoice}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <PlusCircle className="w-6 h-6 mr-2" />
              Create Invoice
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl border border-emerald-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-600 text-sm font-medium">Total Revenue</p>
                  <p className="text-2xl font-bold text-emerald-700">${getTotalRevenue().toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-emerald-500" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl border border-amber-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-600 text-sm font-medium">Pending</p>
                  <p className="text-2xl font-bold text-amber-700">${getPendingAmount().toLocaleString()}</p>
                </div>
                <Calendar className="w-8 h-8 text-amber-500" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-600 text-sm font-medium">Overdue</p>
                  <p className="text-2xl font-bold text-red-700">${getOverdueAmount().toLocaleString()}</p>
                </div>
                <FileText className="w-8 h-8 text-red-500" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-yellow-100 p-6 rounded-xl border border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Total Invoices</p>
                  <p className="text-2xl font-bold text-orange-700">{invoices.length}</p>
                </div>
                <User className="w-8 h-8 text-orange-500" />
              </div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3">
            {["all", "paid", "unpaid", "overdue"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  filterStatus === status 
                    ? "bg-gradient-to-r from-orange-400 to-yellow-500 text-white shadow-lg" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)} ({getStatusCount(status)})
              </button>
            ))}
          </div>
        </div>

        {/* Invoice Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-orange-50 to-yellow-50">
                <tr>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Invoice No.</th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Customer</th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Amount</th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Date</th>
                  <th className="px-8 py-6 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredInvoices.map((invoice, index) => (
                  <tr key={invoice.id} className={`hover:bg-orange-25 transition-colors duration-150 ${index % 2 === 0 ? 'bg-gray-25' : ''}`}>
                    <td className="px-8 py-6 whitespace-nowrap font-bold text-orange-600">{invoice.invoiceNo}</td>
                    <td className="px-8 py-6 whitespace-nowrap font-medium text-gray-800">{invoice.customer}</td>
                    <td className="px-8 py-6 whitespace-nowrap font-semibold text-gray-700">${invoice.amount.toLocaleString()}</td>
                    <td className="px-8 py-6 whitespace-nowrap">{statusBadge(invoice.status)}</td>
                    <td className="px-8 py-6 whitespace-nowrap text-gray-700">{invoice.date}</td>
                    <td className="px-8 py-6 whitespace-nowrap text-right text-sm font-medium space-x-4">
                      <button 
                        onClick={() => handleEditInvoice(invoice)}
                        className="text-orange-500 hover:text-orange-700 font-semibold transition-colors duration-150"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleViewInvoice(invoice)}
                        className="text-orange-500 hover:text-orange-700 font-semibold transition-colors duration-150"
                      >
                        View
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

        {/* Create/Edit Invoice Modal */}
        {(showCreateForm || showEditForm) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-screen overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">
                    {showEditForm ? 'Edit Invoice' : 'Create New Invoice'}
                  </h2>
                  <button 
                    onClick={handleCloseForm}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-150"
                  >
                    <X className="w-8 h-8" />
                  </button>
                </div>

                <div className="space-y-6">
                  {showEditForm && selectedInvoice && (
                    <div className="bg-orange-50 p-4 rounded-xl border border-orange-200 mb-6">
                      <p className="text-sm text-orange-600 font-semibold">
                        Invoice Number: {selectedInvoice.invoiceNo}
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Customer Name</label>
                    <input
                      type="text"
                      name="customer"
                      value={formData.customer}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200"
                      placeholder="Enter customer name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Amount</label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200"
                    >
                      <option value="unpaid">Unpaid</option>
                      <option value="paid">Paid</option>
                      <option value="overdue">Overdue</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div className="flex space-x-4 pt-6">
                    <button
                      onClick={handleCloseForm}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="flex-1 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                      <Save className="w-5 h-5 mr-2" />
                      {showEditForm ? 'Update Invoice' : 'Create Invoice'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Invoice Modal */}
        {showViewModal && selectedInvoice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">
                    Invoice Details
                  </h2>
                  <button 
                    onClick={handleCloseForm}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-150"
                  >
                    <X className="w-8 h-8" />
                  </button>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-8 border border-orange-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Invoice Number</h3>
                        <p className="text-2xl font-bold text-orange-600">{selectedInvoice.invoiceNo}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Customer</h3>
                        <p className="text-xl font-semibold text-gray-800">{selectedInvoice.customer}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Status</h3>
                        <div className="flex">
                          {statusBadge(selectedInvoice.status)}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Amount</h3>
                        <p className="text-3xl font-bold text-gray-800">${selectedInvoice.amount.toLocaleString()}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Date</h3>
                        <p className="text-xl font-semibold text-gray-700">{selectedInvoice.date}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Invoice ID</h3>
                        <p className="text-lg font-medium text-gray-600">#{selectedInvoice.id}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-orange-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-700">Invoice Summary</h3>
                        <p className="text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="text-2xl font-bold text-orange-600">${selectedInvoice.amount.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4 mt-8">
                  <button
                    onClick={handleCloseForm}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      handleCloseForm();
                      handleEditInvoice(selectedInvoice);
                    }}
                    className="flex-1 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    <FileText className="w-5 h-5 mr-2" />
                    Edit Invoice
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