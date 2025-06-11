import { useState, useEffect } from "react";
import { PlusCircle, X, Save, Calendar, User, DollarSign, FileText, Edit, Eye } from "lucide-react";

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
              <p className="text-gray-600 mt-2">Manage your invoices with ease and efficiency</p>
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
                  <option value="paid">Paid ({getStatusCount("paid")})</option>
                  <option value="unpaid">Unpaid ({getStatusCount("unpaid")})</option>
                  <option value="overdue">Overdue ({getStatusCount("overdue")})</option>
                </select>
               
              </div>
              
              <button 
                onClick={handleCreateInvoice}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Create Invoice
              </button>
            </div>
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
                        className="inline-flex items-center text-orange-500 hover:text-orange-700 font-semibold transition-colors duration-150"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        {/* Edit */}
                      </button>
                      <button 
                        onClick={() => handleViewInvoice(invoice)}
                        className="inline-flex items-center text-orange-500 hover:text-orange-700 font-semibold transition-colors duration-150"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        {/* View */}
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
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">
                    {showEditForm ? 'Edit Invoice' : 'Create New Invoice'}
                  </h2>
                  <button 
                    onClick={handleCloseForm}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-150"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  {showEditForm && selectedInvoice && (
                    <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 mb-4">
                      <p className="text-sm text-orange-600 font-semibold">
                        Invoice Number: {selectedInvoice.invoiceNo}
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Customer Name</label>
                    <input
                      type="text"
                      name="customer"
                      value={formData.customer}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200"
                      placeholder="Enter customer name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Amount</label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200"
                    >
                      <option value="unpaid">Unpaid</option>
                      <option value="paid">Paid</option>
                      <option value="overdue">Overdue</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={handleSubmit}
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                      <Save className="w-4 h-4 mr-2" />
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
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Invoice Number</h3>
                        <p className="text-lg font-bold text-orange-600">{selectedInvoice.invoiceNo}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Customer</h3>
                        <p className="text-lg font-semibold text-gray-800">{selectedInvoice.customer}</p>
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
                        <p className="text-lg font-semibold text-gray-700">{selectedInvoice.date}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Invoice ID</h3>
                        <p className="text-sm font-medium text-gray-600">#{selectedInvoice.id}</p>
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
                    onClick={() => {
                      handleCloseForm();
                    }}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Send Invoice
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