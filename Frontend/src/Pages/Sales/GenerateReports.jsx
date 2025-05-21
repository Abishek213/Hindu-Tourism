import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { CalendarDays, DollarSign, Users, TrendingUp } from "lucide-react";

const dummyData = {
  metrics: {
    totalLeads: 120,
    totalConversions: 45,
    revenue: 86500,
  },
  monthlyData: [
    { month: "Jan", leads: 20, conversions: 5 },
    { month: "Feb", leads: 25, conversions: 10 },
    { month: "Mar", leads: 30, conversions: 8 },
    { month: "Apr", leads: 22, conversions: 7 },
    { month: "May", leads: 23, conversions: 15 },
  ],
};

const GenerateReport = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleFilter = () => {
    // TODO: Add logic to filter actual data from backend
    console.log("Filtering report from", fromDate, "to", toDate);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Generate Report</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <CalendarDays className="text-orange-500 w-5 h-5" />
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays className="text-orange-500 w-5 h-5" />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
        </div>
        <button
          onClick={handleFilter}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md"
        >
          Apply Filter
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <Users className="text-orange-500 w-8 h-8" />
          <div>
            <p className="text-sm text-gray-600">Total Leads</p>
            <p className="text-xl font-bold text-gray-800">{dummyData.metrics.totalLeads}</p>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <TrendingUp className="text-orange-500 w-8 h-8" />
          <div>
            <p className="text-sm text-gray-600">Conversions</p>
            <p className="text-xl font-bold text-gray-800">{dummyData.metrics.totalConversions}</p>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <DollarSign className="text-orange-500 w-8 h-8" />
          <div>
            <p className="text-sm text-gray-600">Revenue</p>
            <p className="text-xl font-bold text-gray-800">₹{dummyData.metrics.revenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Lead & Conversion Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dummyData.monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="leads" fill="#fb923c" name="Leads" />
            <Bar dataKey="conversions" fill="#f97316" name="Conversions" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GenerateReport;
