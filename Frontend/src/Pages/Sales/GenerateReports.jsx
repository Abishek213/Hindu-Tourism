import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { CalendarDays, Users, TrendingUp } from "lucide-react";
import api from "../../api/auth"; // Your axios instance

const GenerateReport = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reportData, setReportData] = useState({
    metrics: {
      totalLeads: 0,
      totalConversions: 0,
    },
    monthlyData: [],
  });
  const [loading, setLoading] = useState(false);

  // Load initial data on component mount
  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async (startDate = null, endDate = null) => {
    setLoading(true);
    try {
      // Fetch all leads from your backend
      const response = await api.get('/lead');
      let leads = response.data;

      // Filter by date range if provided
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        
        leads = leads.filter(lead => {
          const leadDate = new Date(lead.created_date);
          return leadDate >= start && leadDate <= end;
        });
      }

      // Calculate metrics
      const totalLeads = leads.length;
      const totalConversions = leads.filter(lead => lead.status === 'converted').length;

      // Process monthly data
      const monthlyStats = processMonthlyData(leads);

      setReportData({
        metrics: {
          totalLeads,
          totalConversions,
        },
        monthlyData: monthlyStats,
      });

    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processMonthlyData = (leads) => {
    const monthlyMap = {};
    
    leads.forEach(lead => {
      const date = new Date(lead.created_date);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
      
      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = {
          month: monthKey,
          leads: 0,
          conversions: 0
        };
      }
      
      monthlyMap[monthKey].leads++;
      if (lead.status === 'converted') {
        monthlyMap[monthKey].conversions++;
      }
    });

    // Convert to array and sort by month order
    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return monthOrder
      .filter(month => monthlyMap[month])
      .map(month => monthlyMap[month]);
  };

  const handleFilter = () => {
    if (!fromDate || !toDate) {
      console.log("Please select both dates");
      return;
    }
    
    console.log("Filtering report from", fromDate, "to", toDate);
    fetchReportData(fromDate, toDate);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Generate Report</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center gap-2 mb-2">
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
          disabled={loading}
          className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-4 py-2 rounded-md"
        >
          {loading ? "Loading..." : "Apply Filter"}
        </button>
      </div>

    {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2 w-[320px]">
          <div className="bg-orange-50 border border-orange-200 rounded-md p-2 flex items-center gap-2 shadow-sm">
            <Users className="text-orange-500 w-5 h-5" />
            <div>
              <p className="text-[11px] text-gray-600">Total Leads</p>
              <p className="text-base font-medium text-gray-800">{reportData.metrics.totalLeads}</p>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-md p-2 flex items-center gap-2 shadow-sm">
            <TrendingUp className="text-orange-500 w-5 h-5" />
            <div>
              <p className="text-[11px] text-gray-600">Conversions</p>
              <p className="text-base font-medium text-gray-800">{reportData.metrics.totalConversions}</p>
            </div>
          </div>
        </div>



        {/* Bar Chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm w-[1050px]">
          <h2 className="text-base font-medium text-gray-800 mb-3">Monthly Lead & Conversion Trends</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={reportData.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" fontSize={10} />
              <YAxis fontSize={10} />
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