import { useState } from "react";
import { 
  CreditCard, 
  FileText, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp,
  Users,
  Bell,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3
} from "lucide-react";
import { 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";
import FinancialReport from './FinancialReports';

// Enhanced data structure
const stats = [
  {
    label: "Total Revenue",
    value: "$120,000",
    change: "+12%",
    isPositive: true,
    icon: <DollarSign className="text-amber-600" />,
    bg: "bg-gradient-to-br from-amber-50 to-orange-50",
    border: "border-amber-200",
    target: "$150,000",
    period: "This Month"
  },
  {
    label: "Payments Processed",
    value: "$110,000",
    change: "+8%",
    isPositive: true,
    icon: <CreditCard className="text-orange-600" />,
    bg: "bg-gradient-to-br from-orange-50 to-red-50",
    border: "border-orange-200",
    target: "$125,000",
    period: "This Month"
  },
  {
    label: "Active Customers",
    value: "1,247",
    change: "+15%",
    isPositive: true,
    icon: <Users className="text-yellow-600" />,
    bg: "bg-gradient-to-br from-yellow-50 to-amber-50",
    border: "border-yellow-200",
    target: "1,500",
    period: "Total"
  },
  {
    label: "Net Profit",
    value: "$45,750",
    change: "+18%",
    isPositive: true,
    icon: <TrendingUp className="text-green-600" />,
    bg: "bg-gradient-to-br from-green-50 to-emerald-50",
    border: "border-green-200",
    target: "$60,000",
    period: "This Month"
  },
];

// Financial data for detailed reports
const financialData = [
  { month: "Jan", revenue: 95000, payments: 87000, customers: 1100, refunds: 2400, expenses: 15000 },
  { month: "Feb", revenue: 102000, payments: 94000, customers: 1150, refunds: 1800, expenses: 16000 },
  { month: "Mar", revenue: 108000, payments: 98000, customers: 1200, refunds: 2100, expenses: 17000 },
  { month: "Apr", revenue: 115000, payments: 105000, customers: 1230, refunds: 1900, expenses: 18000 },
  { month: "May", revenue: 120000, payments: 110000, customers: 1247, refunds: 1600, expenses: 19000 },
];

const categoryData = [
  { name: "Subscriptions", value: 45000, color: "#f59e0b" },
  { name: "One-time Sales", value: 35000, color: "#ea580c" },
  { name: "Services", value: 25000, color: "#d97706" },
  { name: "Products", value: 15000, color: "#92400e" }
];

const recentTransactions = [
  { id: "TXN-001", customer: "Acme Corp", amount: "$2,500", status: "completed", date: "2 hours ago", type: "payment" },
  { id: "TXN-002", customer: "Tech Solutions", amount: "$1,800", status: "pending", date: "4 hours ago", type: "payment" },
  { id: "TXN-003", customer: "Design Studio", amount: "$3,200", status: "completed", date: "6 hours ago", type: "payment" },
  { id: "REF-001", customer: "Marketing Pro", amount: "-$950", status: "refunded", date: "8 hours ago", type: "refund" },
  { id: "TXN-005", customer: "StartupXYZ", amount: "$4,100", status: "completed", date: "1 day ago", type: "payment" },
];

const alerts = [
  { type: "success", message: "Monthly revenue target achieved!", time: "2h ago" },
  { type: "warning", message: "Payment failure rate increased by 2%", time: "4h ago" },
  { type: "info", message: "New financial report available", time: "1d ago" },
];

const AccountOverview = () => {
  const [timeFrame, setTimeFrame] = useState("monthly");
  const [activeChart, setActiveChart] = useState("revenue");
  const [currentView, setCurrentView] = useState("overview");

  const renderOverview = () => (
    <>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((item, index) => (
          <div
            key={index}
            className={`p-6 rounded-2xl ${item.bg} border ${item.border} backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md bg-white/90 group-hover:scale-110 transition-transform duration-200">
                {item.icon}
              </div>
              <div className={`flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                item.isPositive 
                  ? "bg-green-100 text-green-700" 
                  : "bg-red-100 text-red-700"
              }`}>
                {item.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                <span className="ml-1">{item.change}</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-amber-700/80">{item.label}</p>
              <p className="text-2xl font-bold text-amber-900">{item.value}</p>
              <div className="flex justify-between items-center text-xs">
                <span className="text-amber-600">{item.period}</span>
                <span className="text-amber-500">Target: {item.target}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Trend Chart */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-amber-200 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-amber-900">Performance Trend</h3>
            <div className="flex space-x-2">
              {["revenue", "customers", "payments"].map((metric) => (
                <button 
                  key={metric}
                  className={`px-3 py-1 text-xs rounded-lg transition-colors capitalize ${
                    activeChart === metric 
                      ? "bg-amber-500 text-white" 
                      : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                  }`}
                  onClick={() => setActiveChart(metric)}
                >
                  {metric}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financialData}>
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  formatter={(value) => [
                    activeChart === "customers" ? value.toLocaleString() : `$${value.toLocaleString()}`,
                    activeChart.charAt(0).toUpperCase() + activeChart.slice(1)
                  ]}
                  contentStyle={{ 
                    backgroundColor: '#fffbeb',
                    border: '1px solid #f59e0b',
                    borderRadius: '0.75rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey={activeChart} 
                  stroke="#f59e0b" 
                  fillOpacity={1} 
                  fill="url(#colorGradient)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Distribution */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-amber-200 shadow-lg">
          <h3 className="text-lg font-semibold text-amber-900 mb-6">Revenue Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']}
                  contentStyle={{ 
                    backgroundColor: '#fffbeb',
                    border: '1px solid #f59e0b',
                    borderRadius: '0.75rem'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {categoryData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }}></div>
                <span className="text-xs text-amber-700">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-amber-200 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-amber-900">Recent Transactions</h3>
            <button className="text-amber-600 hover:text-amber-700 flex items-center space-x-1 text-sm">
              <Eye size={16} />
              <span>View All</span>
            </button>
          </div>
          <div className="space-y-4">
            {recentTransactions.map((transaction, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-amber-50/50 rounded-xl hover:bg-amber-50 transition-colors duration-200">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    transaction.type === 'refund' 
                      ? 'bg-gradient-to-br from-red-400 to-red-500' 
                      : 'bg-gradient-to-br from-amber-400 to-orange-400'
                  }`}>
                    <CreditCard className="text-white" size={16} />
                  </div>
                  <div>
                    <p className="font-medium text-amber-900">{transaction.customer}</p>
                    <p className="text-sm text-amber-600">{transaction.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.type === 'refund' ? 'text-red-600' : 'text-amber-900'
                  }`}>{transaction.amount}</p>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                      transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      transaction.status === 'refunded' ? 'bg-red-100 text-red-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {transaction.status === 'completed' && <CheckCircle size={12} className="mr-1" />}
                      {transaction.status === 'pending' && <Clock size={12} className="mr-1" />}
                      {(transaction.status === 'failed' || transaction.status === 'refunded') && <AlertCircle size={12} className="mr-1" />}
                      {transaction.status}
                    </span>
                    <span className="text-xs text-amber-500">{transaction.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-amber-200 shadow-lg">
          <h3 className="text-lg font-semibold text-amber-900 mb-6">Alerts & Updates</h3>
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <div key={index} className={`p-4 rounded-xl border-l-4 ${
                alert.type === 'success' ? 'bg-green-50 border-green-400' :
                alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                'bg-blue-50 border-blue-400'
              }`}>
                <div className="flex items-start space-x-3">
                  {alert.type === 'success' && <CheckCircle className="text-green-500 mt-0.5" size={16} />}
                  {alert.type === 'warning' && <AlertCircle className="text-yellow-500 mt-0.5" size={16} />}
                  {alert.type === 'info' && <Bell className="text-blue-500 mt-0.5" size={16} />}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            {currentView === "overview" ? "Dashboard Overview" : "Financial Reports"}
          </h1>
          <p className="text-amber-700 mt-1">
            {currentView === "overview" 
              ? "Welcome back! Here's your business overview." 
              : "Detailed financial analysis and reporting."}
          </p>
        </div>
        
        {/* View Toggle */}
        <div className="flex bg-white/80 backdrop-blur-sm p-1 rounded-xl border border-amber-200 shadow-sm">
          <button 
            className={`flex items-center px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
              currentView === "overview" 
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md" 
                : "text-amber-700 hover:bg-amber-100"
            }`}
            onClick={() => setCurrentView("overview")}
          >
            <BarChart3 size={16} className="mr-2" />
            Overview
          </button>
          <button 
            className={`flex items-center px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
              currentView === "reports" 
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md" 
                : "text-amber-700 hover:bg-amber-100"
            }`}
            onClick={() => setCurrentView("reports")}
          >
            <FileText size={16} className="mr-2" />
            Reports
          </button>
        </div>
      </div>

      {/* Time Frame Selector - Only show on overview */}
      {currentView === "overview" && (
        <div className="flex justify-center mb-8">
          <div className="flex bg-white/80 backdrop-blur-sm p-1 rounded-xl border border-amber-200 shadow-sm">
            {["weekly", "monthly", "yearly"].map((period) => (
              <button 
                key={period}
                className={`px-6 py-2 text-sm rounded-lg transition-all duration-200 capitalize ${
                  timeFrame === period 
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md" 
                    : "text-amber-700 hover:bg-amber-100"
                }`}
                onClick={() => setTimeFrame(period)}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Dynamic Content */}
      {currentView === "overview" ? renderOverview() : <FinancialReport />}
    </div>
  );
};

export default AccountOverview;