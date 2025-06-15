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
  BarChart3,
  ChevronDown,
  Filter,
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
  Tooltip,
} from "recharts";

// Enhanced data structure
const stats = [
  {
    label: "Total Revenue",
    value: "$120,000",
    change: "+12%",
    isPositive: true,
    icon: <DollarSign className="text-orange-500" />, // Changed icon color to align with theme
    bg: "bg-gradient-to-br from-orange-50 to-yellow-50",
    // Removed border from here, handled by parent div
    target: "$150,000",
    period: "This Month",
  },
  {
    label: "Payments Processed",
    value: "$110,000",
    change: "+8%",
    isPositive: true,
    icon: <CreditCard className="text-orange-500" />,
    bg: "bg-gradient-to-br from-orange-50 to-red-50",
    target: "$125,000",
    period: "This Month",
  },
  {
    label: "Active Customers",
    value: "1,247",
    change: "+15%",
    isPositive: true,
    icon: <Users className="text-orange-500" />,
    bg: "bg-gradient-to-br from-yellow-50 to-orange-50",
    target: "1,500",
    period: "Total",
  },
  {
    label: "Net Profit",
    value: "$45,750",
    change: "+18%",
    isPositive: true,
    icon: <TrendingUp className="text-green-500" />, // Green can remain for profit
    bg: "bg-gradient-to-br from-green-50 to-emerald-50",
    target: "$60,000",
    period: "This Month",
  },
];

// Financial data for detailed reports
const financialData = [
  {
    month: "Jan",
    revenue: 95000,
    payments: 87000,
    customers: 1100,
    refunds: 2400,
    expenses: 15000,
  },
  {
    month: "Feb",
    revenue: 102000,
    payments: 94000,
    customers: 1150,
    refunds: 1800,
    expenses: 16000,
  },
  {
    month: "Mar",
    revenue: 108000,
    payments: 98000,
    customers: 1200,
    refunds: 2100,
    expenses: 17000,
  },
  {
    month: "Apr",
    revenue: 115000,
    payments: 105000,
    customers: 1230,
    refunds: 1900,
    expenses: 18000,
  },
  {
    month: "May",
    revenue: 120000,
    payments: 110000,
    customers: 1247,
    refunds: 1600,
    expenses: 19000,
  },
];

const categoryData = [
  { name: "Subscriptions", value: 45000, color: "#FF7B25" }, // Changed colors to match Overview's PieChart scheme
  { name: "One-time Sales", value: 35000, color: "#EA580C" },
  { name: "Services", value: 25000, color: "#FF9A52" },
  { name: "Products", value: 15000, color: "#FACC15" },
];

const recentTransactions = [
  {
    id: "TXN-001",
    customer: "Acme Corp",
    amount: "$2,500",
    status: "completed",
    date: "2 hours ago",
    type: "payment",
  },
  {
    id: "TXN-002",
    customer: "Tech Solutions",
    amount: "$1,800",
    status: "pending",
    date: "4 hours ago",
    type: "payment",
  },
  {
    id: "TXN-003",
    customer: "Design Studio",
    amount: "$3,200",
    status: "completed",
    date: "6 hours ago",
    type: "payment",
  },
  {
    id: "REF-001",
    customer: "Marketing Pro",
    amount: "-$950",
    status: "refunded",
    date: "8 hours ago",
    type: "refund",
  },
  {
    id: "TXN-005",
    customer: "StartupXYZ",
    amount: "$4,100",
    status: "completed",
    date: "1 day ago",
    type: "payment",
  },
];

const alerts = [
  {
    type: "success",
    message: "Monthly revenue target achieved!",
    time: "2h ago",
  },
  {
    type: "warning",
    message: "Payment failure rate increased by 2%",
    time: "4h ago",
  },
  { type: "info", message: "New financial report available", time: "1d ago" },
];

const timeFrameOptions = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
];

const AccountOverview = () => {
  const [timeFrame, setTimeFrame] = useState("monthly");
  const [activeChart, setActiveChart] = useState("revenue");
  const [currentView, setCurrentView] = useState("overview");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const renderOverview = () => (
    <>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((item, index) => (
          <div
            key={index}
            // Applying consistent card styling from Overview
            className={`p-6 rounded-2xl ${item.bg} border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-md bg-white group-hover:scale-105 transition-transform duration-200 ease-in-out">
                {item.icon}
              </div>
              <div
                className={`flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                  item.isPositive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                } shadow-sm`}
              >
                {item.isPositive ? (
                  <ArrowUpRight size={14} />
                ) : (
                  <ArrowDownRight size={14} />
                )}
                <span className="ml-1">{item.change}</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700"> {/* Adjusted text color */}
                {item.label}
              </p>
              <p className="text-3xl font-extrabold text-gray-900"> {/* Adjusted text color */}
                {item.value}
              </p>
              <div className="flex justify-between items-center text-xs pt-1">
                <span className="text-gray-600 font-medium"> {/* Adjusted text color */}
                  {item.period}
                </span>
                <span className="text-gray-500">Target: {item.target}</span> {/* Adjusted text color */}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Trend Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg"> {/* Consistent panel styling */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900"> {/* Adjusted text color */}
              Performance Trend
            </h3>
            <div className="flex space-x-2 bg-orange-50 rounded-lg p-1 shadow-inner"> {/* Consistent button group styling */}
              {["revenue", "customers", "payments"].map((metric) => (
                <button
                  key={metric}
                  className={`px-4 py-2 text-sm rounded-lg transition-all duration-300 ease-in-out font-semibold capitalize ${
                    activeChart === metric
                      ? "bg-orange-500 text-white shadow-md" // Primary saffron/orange
                      : "text-orange-700 hover:bg-orange-100" // Consistent hover
                  }`}
                  onClick={() => setActiveChart(metric)}
                >
                  {metric}
                </button>
              ))}
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financialData}>
                <defs>
                  <linearGradient
                    id="colorGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#FF7B25" stopOpacity={0.8} /> {/* Primary orange */}
                    <stop offset="95%" stopColor="#FF7B25" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  className="text-sm text-gray-600" // Adjusted text color
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  className="text-sm text-gray-600" // Adjusted text color
                />
                <Tooltip
                  formatter={(value) => [
                    activeChart === "customers"
                      ? value.toLocaleString()
                      : `$${value.toLocaleString()}`,
                    activeChart.charAt(0).toUpperCase() + activeChart.slice(1),
                  ]}
                  contentStyle={{
                    backgroundColor: "#fffbeb", // Light orange tint for tooltips
                    border: "1px solid #FF7B25", // Orange border for tooltips
                    borderRadius: "0.75rem",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)", // Softer shadow
                    padding: "10px",
                  }}
                  labelStyle={{ color: "#78350f", fontWeight: "bold" }}
                />
                <Area
                  type="monotone"
                  dataKey={activeChart}
                  stroke="#FF7B25" // Primary orange stroke
                  fillOpacity={1}
                  fill="url(#colorGradient)"
                  strokeWidth={3}
                  activeDot={{ r: 6, fill: "#EA580C", stroke: "#fff", strokeWidth: 2 }} // Darker orange for active dot
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg"> {/* Consistent panel styling */}
          <h3 className="text-xl font-bold text-gray-900 mb-6"> {/* Adjusted text color */}
            Revenue Distribution
          </h3>
          <div className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={4}
                  dataKey="value"
                  cornerRadius={5}
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [
                    `$${value.toLocaleString()}`,
                    "Amount",
                  ]}
                  contentStyle={{
                    backgroundColor: "#fffbeb", // Light orange tint for tooltips
                    border: "1px solid #FF7B25", // Orange border for tooltips
                    borderRadius: "0.75rem",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)", // Softer shadow
                    padding: "10px",
                  }}
                  labelStyle={{ color: "#78350f", fontWeight: "bold" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-y-3 gap-x-2 mt-4 px-4">
            {categoryData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className={`w-4 h-4 rounded-full shadow-sm`}
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-800 font-medium"> {/* Adjusted text color */}
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-lg"> {/* Consistent panel styling */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900"> {/* Adjusted text color */}
              Recent Transactions
            </h3>
            <button className="text-orange-700 hover:text-orange-800 flex items-center space-x-2 text-sm font-medium px-4 py-2 rounded-lg bg-orange-100 hover:bg-orange-200 transition-colors duration-200 shadow-sm">
              <Eye size={16} />
              <span>View All</span>
            </button>
          </div>
          <div className="space-y-4">
            {recentTransactions.map((transaction, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-orange-50/70 rounded-xl hover:bg-orange-100 transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md ${ // Changed to rounded-full for softer look
                      transaction.type === "refund"
                        ? "bg-gradient-to-br from-red-500 to-red-600"
                        : "bg-gradient-to-br from-orange-500 to-orange-600" // Primary orange gradient
                    }`}
                  >
                    <CreditCard className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-base"> {/* Adjusted text color */}
                      {transaction.customer}
                    </p>
                    <p className="text-sm text-gray-700 mt-0.5"> {/* Adjusted text color */}
                      {transaction.id}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-bold text-lg ${
                      transaction.type === "refund"
                        ? "text-red-700"
                        : "text-gray-950" // Adjusted text color
                    }`}
                  >
                    {transaction.amount}
                  </p>
                  <div className="flex items-center space-x-2 justify-end mt-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : transaction.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : transaction.status === "refunded"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800" // Fallback for unknown status
                      } shadow-sm`}
                    >
                      {transaction.status === "completed" && (
                        <CheckCircle size={12} className="mr-1" />
                      )}
                      {transaction.status === "pending" && (
                        <Clock size={12} className="mr-1" />
                      )}
                      {(transaction.status === "failed" ||
                        transaction.status === "refunded") && (
                        <AlertCircle size={12} className="mr-1" />
                      )}
                      {transaction.status}
                    </span>
                    <span className="text-xs text-gray-600"> {/* Adjusted text color */}
                      {transaction.date}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg"> {/* Consistent panel styling */}
          <h3 className="text-xl font-bold text-gray-900 mb-6"> {/* Adjusted text color */}
            Alerts & Updates
          </h3>
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border-l-4 ${ // Consistent alert styling
                  alert.type === "success"
                    ? "bg-green-50 border-green-400"
                    : alert.type === "warning"
                    ? "bg-yellow-50 border-yellow-400"
                    : "bg-blue-50 border-blue-400"
                } shadow-sm`}
              >
                <div className="flex items-start space-x-3">
                  {alert.type === "success" && (
                    <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={18} />
                  )}
                  {alert.type === "warning" && (
                    <AlertCircle className="text-yellow-500 mt-0.5 flex-shrink-0" size={18} />
                  )}
                  {alert.type === "info" && (
                    <Bell className="text-blue-500 mt-0.5 flex-shrink-0" size={18} />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800"> {/* Adjusted text color */}
                      {alert.message}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">{alert.time}</p> {/* Adjusted text color */}
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
    <div className="p-4  bg-white rounded-lg shadow-md">
      <div className="">
        {/* Header */}
            <div className="mb-6 flex justify-between items-center px-6 py-6 border-b border-gray-100
       bg-primary-saffron">
          <div className="">
            <h1 className="text-xl font-bold text-white"> {/* Adjusted font size and weight */}
              {currentView === "overview"
                ? "Dashboard Overview"
                : "Financial Reports"}
            </h1>
            <p className="text-white "> {/* Adjusted font size and weight */}
              {currentView === "overview"
                ? "Welcome back! Here's your business overview."
                : "Detailed financial analysis and reporting."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Time Frame Filter Dropdown */}
            <div className="relative">
              <button
                className="flex items-center bg-white px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-orange-700 hover:bg-orange-100 font-semibold" // Consistent button styling
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <Filter size={16} className="mr-2" />
                <span>
                  Time Frame:{" "}
                  {
                    timeFrameOptions.find((option) => option.value === timeFrame)
                      ?.label
                  }
                </span>
                <ChevronDown
                  size={18}
                  className={`ml-3 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-10 overflow-hidden transform animate-fade-in-down"> {/* Consistent dropdown styling */}
                  {timeFrameOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`w-full px-6 py-3 text-left text-sm hover:bg-orange-50 transition-colors duration-150 ${
                        timeFrame === option.value
                          ? "bg-orange-100 text-orange-800 font-bold" // Consistent active state
                          : "text-gray-700" // Consistent inactive text color
                      }`}
                      onClick={() => {
                        setTimeFrame(option.value);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* View Toggle */}
            <div className="flex bg-white p-0.5 rounded-xl border border-gray-100 shadow-md"> {/* Consistent button group styling */}
              <button
                className={`flex items-center px-5 py-2 text-sm rounded-lg transition-all duration-300 ease-in-out font-semibold ${
                  currentView === "overview"
                    ? "bg-orange-500 text-white shadow-lg" // Primary saffron/orange
                    : "text-orange-700 hover:bg-orange-100" // Consistent hover
                }`}
                onClick={() => setCurrentView("overview")}
              >
                <BarChart3 size={18} className="mr-2" />
                Overview
              </button>
              <button
                className={`flex items-center px-5 py-2.5 text-sm rounded-lg transition-all duration-300 ease-in-out font-semibold ${
                  currentView === "reports"
                    ? "bg-orange-500 text-white shadow-lg" // Primary saffron/orange
                    : "text-orange-700 hover:bg-orange-100" // Consistent hover
                }`}
                onClick={() => setCurrentView("reports")}
              >
                <FileText size={18} className="mr-2" />
                Reports
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Content */}
        {currentView === "overview" ? (
          renderOverview()
        ) : (
          <div className="text-center text-gray-800 py-20 bg-white rounded-2xl shadow-lg border border-gray-100"> {/* Consistent panel styling */}
            <FileText size={48} className="mx-auto mb-4 text-orange-500" /> {/* Icon color to match theme */}
            <h2 className="text-3xl font-bold mb-2">Financial Reports</h2>
            <p className="text-lg">Detailed financial analysis and reporting will be available here.</p>
            <p className="text-sm text-gray-500 mt-4">Stay tuned for more updates!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountOverview;