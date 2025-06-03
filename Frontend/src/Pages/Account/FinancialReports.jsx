import { 
  DollarSign, 
  CreditCard, 
  Receipt, 
  TrendingUp,
  Download
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

// Financial data for detailed reports
const financialData = [
  { month: "Jan", revenue: 95000, payments: 87000, customers: 1100, refunds: 2400, expenses: 15000 },
  { month: "Feb", revenue: 102000, payments: 94000, customers: 1150, refunds: 1800, expenses: 16000 },
  { month: "Mar", revenue: 108000, payments: 98000, customers: 1200, refunds: 2100, expenses: 17000 },
  { month: "Apr", revenue: 115000, payments: 105000, customers: 1230, refunds: 1900, expenses: 18000 },
  { month: "May", revenue: 120000, payments: 110000, customers: 1247, refunds: 1600, expenses: 19000 },
];

const FinancialReport = () => {
  // Calculate financial totals
  const financialTotals = financialData.reduce((acc, item) => ({
    revenue: acc.revenue + item.revenue,
    payments: acc.payments + item.payments,
    refunds: acc.refunds + item.refunds,
    expenses: acc.expenses + item.expenses,
    netProfit: acc.netProfit + (item.revenue - item.expenses - item.refunds)
  }), { revenue: 0, payments: 0, refunds: 0, expenses: 0, netProfit: 0 });

  const handleExport = () => {
    console.log("Exporting financial data...");
    // Create CSV content
    const csvContent = [
      ['Month', 'Revenue', 'Payments', 'Refunds', 'Expenses', 'Net Profit'],
      ...financialData.map(item => [
        item.month,
        item.revenue,
        item.payments,
        item.refunds,
        item.expenses,
        item.revenue - item.expenses - item.refunds
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'financial-report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { title: "Total Revenue", value: financialTotals.revenue, color: "bg-green-100 text-green-800", icon: <DollarSign size={20} /> },
          { title: "Total Payments", value: financialTotals.payments, color: "bg-blue-100 text-blue-800", icon: <CreditCard size={20} /> },
          { title: "Total Refunds", value: financialTotals.refunds, color: "bg-red-100 text-red-800", icon: <Receipt size={20} /> },
          { title: "Net Profit", value: financialTotals.netProfit, color: "bg-purple-100 text-purple-800", icon: <TrendingUp size={20} /> }
        ].map((stat, index) => (
          <div key={index} className={`p-6 rounded-2xl ${stat.color} backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300`}>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-white/50 rounded-lg">
                {stat.icon}
              </div>
            </div>
            <h3 className="text-sm font-medium mb-2 opacity-80">{stat.title}</h3>
            <p className="text-2xl font-bold">${stat.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Detailed Financial Chart */}
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-amber-200 shadow-lg mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-amber-900">Financial Performance</h3>
          <button 
            onClick={handleExport}
            className="flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
          >
            <Download size={16} className="mr-2" />
            Export Report
          </button>
        </div>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={financialData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#4ade80" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorPayments" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f87171" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f87171" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip 
                formatter={(value, name) => [`$${value.toLocaleString()}`, name.charAt(0).toUpperCase() + name.slice(1)]}
                contentStyle={{ 
                  backgroundColor: '#fffbeb',
                  border: '1px solid #f59e0b',
                  borderRadius: '0.75rem',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area type="monotone" dataKey="revenue" stackId="1" stroke="#4ade80" fill="url(#colorRevenue)" strokeWidth={2} />
              <Area type="monotone" dataKey="payments" stackId="2" stroke="#60a5fa" fill="url(#colorPayments)" strokeWidth={2} />
              <Area type="monotone" dataKey="expenses" stackId="3" stroke="#f87171" fill="url(#colorExpenses)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <span className="text-sm text-gray-600">Revenue</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-400"></div>
            <span className="text-sm text-gray-600">Payments</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <span className="text-sm text-gray-600">Expenses</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default FinancialReport;