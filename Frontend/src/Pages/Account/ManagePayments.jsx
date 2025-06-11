import { useState, useEffect, useCallback } from "react";
import { 
  CreditCard, 
  Plus, 
  Edit3, 
  Eye, 
  X, 
  Save, 
  Calendar,
  User,
  DollarSign,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowLeft,
  Filter
} from "lucide-react";
//comapct payment
// Compact PaymentForm component
const PaymentForm = ({ 
  formData, 
  setFormData, 
  selectedPayment, 
  isEditing, 
  onCancel, 
  onSave,
  getStatusBadge 
}) => {
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg border border-amber-200 shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <button 
            onClick={onCancel}
            className="p-1 hover:bg-amber-100 rounded-md transition-colors duration-200"
          >
            <ArrowLeft className="text-amber-600" size={18} />
          </button>
          <h2 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            {isEditing ? "Edit Payment" : "New Payment"}
          </h2>
        </div>
        {isEditing && selectedPayment && getStatusBadge(selectedPayment.status)}
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-amber-700 mb-1">Booking ID</label>
            <input
              type="text"
              value={formData.bookingId}
              onChange={(e) => handleInputChange("bookingId", e.target.value)}
              className="w-full p-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white/80 text-sm"
              placeholder="BK-2023-XXX"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-amber-700 mb-1">Customer Name</label>
            <input
              type="text"
              value={formData.customer}
              onChange={(e) => handleInputChange("customer", e.target.value)}
              className="w-full p-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white/80 text-sm"
              placeholder="Customer Name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-amber-700 mb-1">Amount</label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => handleInputChange("amount", e.target.value)}
              className="w-full p-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white/80 text-sm"
              placeholder="0.00"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-amber-700 mb-1">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              className="w-full p-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white/80 text-sm"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-amber-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              className="w-full p-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white/80 text-sm"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-amber-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50 transition-all duration-200 text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-200 flex items-center space-x-2 text-sm"
          >
            <Save size={14} />
            <span>{isEditing ? "Update Payment" : "Create Payment"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Compact PaymentDetails component
const PaymentDetails = ({ 
  selectedPayment, 
  onCancel, 
  onEdit, 
  getStatusBadge 
}) => {
  if (!selectedPayment) return null;

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg border border-amber-200 shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <button 
            onClick={onCancel}
            className="p-1 hover:bg-amber-100 rounded-md transition-colors duration-200"
          >
            <ArrowLeft className="text-amber-600" size={18} />
          </button>
          <h2 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Payment Details
          </h2>
        </div>
        {getStatusBadge(selectedPayment.status)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-amber-700 mb-1">Booking ID</label>
          <p className="text-sm text-amber-900 font-medium">{selectedPayment.bookingId}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-amber-700 mb-1">Customer</label>
          <p className="text-sm text-amber-900">{selectedPayment.customer}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-amber-700 mb-1">Amount</label>
          <p className="text-sm text-amber-900 font-semibold">${selectedPayment.amount.toFixed(2)}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-amber-700 mb-1">Date</label>
          <p className="text-sm text-amber-900">{selectedPayment.date}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-amber-700 mb-1">Email</label>
          <p className="text-sm text-amber-900">{selectedPayment.email}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-amber-700 mb-1">Phone</label>
          <p className="text-sm text-amber-900">{selectedPayment.phone}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-amber-700 mb-1">Payment Method</label>
          <p className="text-sm text-amber-900">{selectedPayment.paymentMethod}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-amber-700 mb-1">Transaction ID</label>
          <p className="text-sm text-amber-900 font-mono">{selectedPayment.transactionId}</p>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-amber-700 mb-1">Description</label>
          <p className="text-sm text-amber-900">{selectedPayment.description}</p>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-amber-200">
        <button
          onClick={() => onEdit(selectedPayment)}
          className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-all duration-200 flex items-center space-x-2 text-sm"
        >
          <Edit3 size={14} />
          <span>Edit Payment</span>
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-200 text-sm"
        >
          Back to List
        </button>
      </div>
    </div>
  );
};

const ManagePayments = () => {
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState("all");
  const [currentView, setCurrentView] = useState("list"); // list, form, details, edit
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [formData, setFormData] = useState({
    bookingId: "",
    customer: "",
    amount: "",
    status: "pending",
    date: ""
  });
  
  // Sample data - replace with actual API call
  useEffect(() => {
    const dummyPayments = [
      { 
        id: 1, 
        bookingId: "BK-2023-001", 
        customer: "Jane Smith", 
        amount: 1250.00, 
        status: "completed", 
        date: "2025-05-10",
        email: "jane.smith@email.com",
        phone: "+1 (555) 123-4567",
        paymentMethod: "Credit Card",
        transactionId: "TXN-001-ABC",
        description: "Wedding Photography Package"
      },
      { 
        id: 2, 
        bookingId: "BK-2023-002", 
        customer: "John Doe", 
        amount: 945.50, 
        status: "pending", 
        date: "2025-05-15",
        email: "john.doe@email.com",
        phone: "+1 (555) 987-6543",
        paymentMethod: "Bank Transfer",
        transactionId: "TXN-002-DEF",
        description: "Portrait Session"
      },
      { 
        id: 3, 
        bookingId: "BK-2023-003", 
        customer: "Alex Johnson", 
        amount: 2100.00, 
        status: "processing", 
        date: "2025-05-18",
        email: "alex.johnson@email.com",
        phone: "+1 (555) 456-7890",
        paymentMethod: "Credit Card",
        transactionId: "TXN-003-GHI",
        description: "Corporate Event Coverage"
      },
      { 
        id: 4, 
        bookingId: "BK-2023-004", 
        customer: "Maria Garcia", 
        amount: 1575.25, 
        status: "completed", 
        date: "2025-05-12",
        email: "maria.garcia@email.com",
        phone: "+1 (555) 321-9876",
        paymentMethod: "PayPal",
        transactionId: "TXN-004-JKL",
        description: "Family Portrait Session"
      }
    ];
    setPayments(dummyPayments);
  }, []);
  
  const filteredPayments = payments.filter(payment => {
    return filter === "all" || payment.status === filter;
  });
  
  const getStatusBadge = (status) => {
    switch(status) {
      case "completed":
        return (
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 flex items-center">
            <CheckCircle size={12} className="mr-1" />
            Completed
          </span>
        );
      case "pending":
        return (
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 flex items-center">
            <Clock size={12} className="mr-1" />
            Pending
          </span>
        );
      case "processing":
        return (
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 flex items-center">
            <AlertCircle size={12} className="mr-1" />
            Processing
          </span>
        );
      default:
        return <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const handleNewPayment = () => {
    setCurrentView("form");
    setSelectedPayment(null);
    setFormData({
      bookingId: "",
      customer: "",
      amount: "",
      status: "pending",
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleEditPayment = (payment) => {
    setSelectedPayment(payment);
    setCurrentView("edit");
    setFormData({
      bookingId: payment.bookingId,
      customer: payment.customer,
      amount: payment.amount.toString(),
      status: payment.status,
      date: payment.date
    });
  };

  const handleSaveEdit = () => {
    setPayments(prevPayments => 
      prevPayments.map(payment => 
        payment.id === selectedPayment.id 
          ? { ...payment, ...formData, amount: parseFloat(formData.amount) }
          : payment
      )
    );
    setCurrentView("list");
    setSelectedPayment(null);
  };

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setCurrentView("details");
  };

  const handleSubmitForm = () => {
    const newPayment = {
      id: Date.now(),
      ...formData,
      amount: parseFloat(formData.amount),
      email: "new@email.com",
      phone: "+1 (555) 000-0000",
      paymentMethod: "Credit Card",
      transactionId: `TXN-${Date.now()}`,
      description: "New Payment"
    };
    setPayments(prevPayments => [...prevPayments, newPayment]);
    setCurrentView("list");
  };

  const handleCancel = () => {
    setCurrentView("list");
  };

  if (currentView === "form") {
    return (
      <div className="min-h-screen p-6">
        <PaymentForm
          formData={formData}
          setFormData={setFormData}
          selectedPayment={selectedPayment}
          isEditing={false}
          onCancel={handleCancel}
          onSave={handleSubmitForm}
          getStatusBadge={getStatusBadge}
        />
      </div>
    );
  }

  if (currentView === "edit") {
    return (
      <div className="min-h-screen p-6">
        <PaymentForm
          formData={formData}
          setFormData={setFormData}
          selectedPayment={selectedPayment}
          isEditing={true}
          onCancel={handleCancel}
          onSave={handleSaveEdit}
          getStatusBadge={getStatusBadge}
        />
      </div>
    );
  }

  if (currentView === "details") {
    return (
      <div className="min-h-screen p-6">
        <PaymentDetails
          selectedPayment={selectedPayment}
          onCancel={handleCancel}
          onEdit={handleEditPayment}
          getStatusBadge={getStatusBadge}
        />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen p-6">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-amber-200 shadow-xl p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Manage Payments
            </h1>
            <p className="text-amber-700 mt-1">Track and manage all payment transactions</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Filter Dropdown */}
            <div className="flex items-center space-x-2">
              <Filter className="text-amber-600" size={16} />
              <div className="relative">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-2 pr-8 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white/80 text-amber-700 text-sm appearance-none cursor-pointer"
                  style={{
                    backgroundImage: 'none',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none'
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            
            {/* New Payment Button */}
            <button 
              onClick={handleNewPayment}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>New Payment</span>
            </button>
          </div>
        </div>
        
        {/* Payments Table */}
        <div className="overflow-x-auto rounded-xl border border-amber-200">
          <table className="min-w-full divide-y divide-amber-200">
            <thead className="bg-gradient-to-r from-amber-100 to-orange-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">Booking ID</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-amber-800 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white/50 backdrop-blur-sm divide-y divide-amber-100">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-amber-50/50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium text-amber-900">{payment.bookingId}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-amber-800">{payment.customer}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-semibold text-amber-900">${payment.amount.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(payment.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-amber-700">{payment.date}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => handleEditPayment(payment)}
                        className="text-amber-600 hover:text-amber-700 p-2 hover:bg-amber-100 rounded-lg transition-colors duration-200"
                        title="Edit"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => handleViewDetails(payment)}
                        className="text-orange-600 hover:text-orange-700 p-2 hover:bg-orange-100 rounded-lg transition-colors duration-200"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredPayments.length === 0 && (
            <div className="text-center py-12 bg-white/50">
              <CreditCard className="mx-auto text-amber-400 mb-4" size={48} />
              <p className="text-amber-600 text-lg">No payments found</p>
              <p className="text-amber-500 text-sm">Try adjusting your filter or create a new payment</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagePayments;