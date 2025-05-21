import { useState, useEffect } from "react";
import { Search, PlusCircle } from "lucide-react";

const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Dummy invoice data — replace with API calls
  useEffect(() => {
    const dummyInvoices = [
      { id: 1, invoiceNo: "INV-2025-001", customer: "Jane Smith", amount: 1500, status: "paid", date: "2025-05-01" },
      { id: 2, invoiceNo: "INV-2025-002", customer: "John Doe", amount: 2300, status: "unpaid", date: "2025-05-05" },
      { id: 3, invoiceNo: "INV-2025-003", customer: "Alex Johnson", amount: 1800, status: "paid", date: "2025-05-10" },
      { id: 4, invoiceNo: "INV-2025-004", customer: "Maria Garcia", amount: 2500, status: "overdue", date: "2025-04-28" },
    ];
    setInvoices(dummyInvoices);
  }, []);

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || invoice.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const statusBadge = (status) => {
    switch (status) {
      case "paid":
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Paid</span>;
      case "unpaid":
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Unpaid</span>;
      case "overdue":
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Overdue</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Invoice Management</h1>
        <button className="flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md">
          <PlusCircle className="w-5 h-5 mr-2" />
          Create Invoice
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search invoices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
        </div>

        <div className="flex space-x-2">
          {["all", "paid", "unpaid", "overdue"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 rounded-md ${
                filterStatus === status ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice No.</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredInvoices.map((invoice) => (
              <tr key={invoice.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">{invoice.invoiceNo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{invoice.customer}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">${invoice.amount.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{statusBadge(invoice.status)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{invoice.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button className="text-orange-500 hover:text-orange-600">Edit</button>
                  <button className="text-orange-500 hover:text-orange-600">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredInvoices.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No invoices found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceManagement;
