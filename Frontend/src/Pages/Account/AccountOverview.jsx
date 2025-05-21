import { useState } from "react";
import { CreditCard, FileText, DollarSign, Receipt, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const stats = [
  {
    label: "Total Revenue",
    value: "$120,000",
    change: "+12%",
    isPositive: true,
    icon: <DollarSign className="text-blue-600" />,
    bg: "bg-blue-50",
    border: "border-blue-200",
    chartData: 120000,
  },
  {
    label: "Payments Processed",
    value: "$110,000",
    change: "+8%",
    isPositive: true,
    icon: <CreditCard className="text-green-600" />,
    bg: "bg-green-50",
    border: "border-green-200",
    chartData: 110000,
  },
  {
    label: "Invoices Generated",
    value: "124",
    change: "+5%",
    isPositive: true,
    icon: <FileText className="text-purple-600" />,
    bg: "bg-purple-50",
    border: "border-purple-200",
    chartData: 124,
  },
  {
    label: "Refunds Processed",
    value: "$5,000",
    change: "-3%",
    isPositive: false,
    icon: <Receipt className="text-red-600" />,
    bg: "bg-red-50",
    border: "border-red-200",
    chartData: 5000,
  },
];

// Prepare chart data
const chartData = [
  { name: "Revenue", value: 120000, color: "#3b82f6" },
  { name: "Payments", value: 110000, color: "#10b981" },
  { name: "Invoices", value: 12400, color: "#8b5cf6" },
  { name: "Refunds", value: 5000, color: "#ef4444" }
];

const AccountOverview = () => {
  const [timeFrame, setTimeFrame] = useState("monthly");
  
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Account Overview</h2>
        <div className="flex space-x-2">
          <button 
            className={`px-4 py-2 text-sm rounded-md transition-colors ${timeFrame === "weekly" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            onClick={() => setTimeFrame("weekly")}
          >
            Weekly
          </button>
          <button 
            className={`px-4 py-2 text-sm rounded-md transition-colors ${timeFrame === "monthly" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            onClick={() => setTimeFrame("monthly")}
          >
            Monthly
          </button>
          <button 
            className={`px-4 py-2 text-sm rounded-md transition-colors ${timeFrame === "yearly" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            onClick={() => setTimeFrame("yearly")}
          >
            Yearly
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((item, index) => (
          <div
            key={index}
            className={`p-5 rounded-xl flex flex-col ${item.bg} border ${item.border} transition-all duration-200 hover:shadow-md`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-sm bg-white">
                {item.icon}
              </div>
              <div className={`flex items-center ${item.isPositive ? "text-green-600" : "text-red-600"}`}>
                {item.isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                <span className="text-sm font-medium ml-1">{item.change}</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{item.label}</p>
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Financial Chart Section */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Financial Overview</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']}
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                  padding: '8px'
                }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AccountOverview;