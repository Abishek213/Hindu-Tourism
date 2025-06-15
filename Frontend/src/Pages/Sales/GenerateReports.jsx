import { useState, useEffect, useRef } from "react";
import {
  CalendarDays,
  Users,
  TrendingUp,
  Percent,
  Printer,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  fetchLeadStats,
  fetchMonthlyLeadTrends,
} from "../../services/SalesOverviewService";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const GenerateReport = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reportData, setReportData] = useState({
    totalLeads: 0,
    totalConversions: 0,
    conversionRate: 0,
  });
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [loading, setLoading] = useState(false);
  const chartRef = useRef(null);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const [stats, trends] = await Promise.all([
        fetchLeadStats(),
        fetchMonthlyLeadTrends(fromDate, toDate),
      ]);

      setReportData({
        totalLeads: stats.total || 0,
        totalConversions: stats.converted || 0,
        conversionRate: stats.conversion || 0,
      });

      setMonthlyTrends(trends);
    } catch (error) {
      console.error("Error fetching report data:", error);
      toast.error("Failed to load report data");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    if (!fromDate || !toDate) {
      toast.warning("Please select both date ranges");
      return;
    }

    if (new Date(fromDate) > new Date(toDate)) {
      toast.warning("End date must be after start date");
      return;
    }

    fetchReportData();
  };

  const handlePrint = async () => {
    if (!chartRef.current) {
      toast.error("Chart is not ready for printing");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 600;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const chartInstance = chartRef.current;

    await new Promise((resolve) => {
      setTimeout(() => {
        ctx.drawImage(chartInstance.canvas, 0, 0, canvas.width, canvas.height);
        resolve();
      }, 500);
    });

    const chartImage = canvas.toDataURL("image/png");

    const printWindow = window.open("", "_blank");
    const reportTitle =
      fromDate && toDate
        ? `Lead Conversion Report (${new Date(
            fromDate
          ).toLocaleDateString()} - ${new Date(toDate).toLocaleDateString()})`
        : "Lead Conversion Report (All Time Data)";

    printWindow.document.write(`
      <html>
        <head>
          <title>${reportTitle}</title>
          <style>
            @page { size: auto; margin: 10mm; }
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
            .print-container { max-width: 1000px; margin: 0 auto; }
            .print-header { text-align: center; margin-bottom: 30px; }
            .print-header h1 { font-size: 24px; margin-bottom: 5px; }
            .print-header p { font-size: 14px; color: #666; }
            .metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 30px; }
            .metric-card { border: 1px solid #ddd; padding: 15px; border-radius: 5px; text-align: center; }
            .metric-value { font-size: 24px; font-weight: bold; margin: 10px 0; }
            .print-footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
            .chart-container { width: 100%; height: auto; margin: 30px 0; }
            .chart-title { text-align: center; font-size: 18px; margin-bottom: 10px; }
            .chart-img { width: 100%; height: auto; }
          </style>
        </head>
        <body onload="window.print();window.close()">
          <div class="print-container">
            <div class="print-header">
              <h1>${reportTitle}</h1>
              <p>Generated on ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div class="metrics-grid">
              <div class="metric-card">
                <div>Total Leads</div>
                <div class="metric-value">${reportData.totalLeads}</div>
              </div>
              <div class="metric-card">
                <div>Total Conversions</div>
                <div class="metric-value">${reportData.totalConversions}</div>
              </div>
              <div class="metric-card">
                <div>Remaining Leads</div>
                <div class="metric-value">${
                  reportData.totalLeads - reportData.totalConversions
                }</div>
              </div>
              <div class="metric-card">
                <div>Conversion Rate</div>
                <div class="metric-value">${reportData.conversionRate}%</div>
              </div>
            </div>

            <div class="chart-container">
              <div class="chart-title">Monthly Lead Trends</div>
              <img class="chart-img" src="${chartImage}" />
            </div>
          </div>
          
          <div class="print-footer">
            Report generated by Sales Dashboard
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  const chartData = {
    labels: monthlyTrends.map((trend) => trend.month),
    datasets: [
      {
        label: "Total Leads",
        data: monthlyTrends.map((trend) => trend.totalLeads),
        backgroundColor: "rgba(255, 159, 64, 0.7)",
      },
      {
        label: "Converted Leads",
        data: monthlyTrends.map((trend) => trend.convertedLeads),
        backgroundColor: "rgba(75, 192, 192, 0.7)",
      },
      {
        label: "Remaining Leads",
        data: monthlyTrends.map((trend) => trend.remainingLeads),
        backgroundColor: "rgba(255, 99, 132, 0.7)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Lead Trends",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Leads",
        },
      },
      x: {
        title: {
          display: true,
          text: "Month",
        },
      },
    },
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="mb-6 px-6 py-6 border-b border-gray-100 bg-primary-saffron">
        <div className="flex flex-col items-center justify-between sm:flex-row">
          <div>
            <h2 className="text-xl font-bold text-white">Generate Report</h2>
            <p className="text-white">Track lead conversion metrics</p>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-white text-orange-600 px-4 py-2 rounded-md hover:bg-orange-50 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print Report
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center gap-2 mb-6">
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
          className="bg-primary-saffron hover:bg-black text-white px-4 py-2 rounded-md"
        >
          {loading ? "Loading..." : "Apply Filter"}
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-orange-50 border border-orange-200 rounded-md p-4 flex items-center gap-4 shadow-sm">
          <div className="p-2 bg-orange-100 rounded-full">
            <Users className="text-orange-500 w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Leads</p>
            <p className="text-xl font-semibold text-gray-800">
              {reportData.totalLeads}
            </p>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-md p-4 flex items-center gap-4 shadow-sm">
          <div className="p-2 bg-orange-100 rounded-full">
            <TrendingUp className="text-orange-500 w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Converted</p>
            <p className="text-xl font-semibold text-gray-800">
              {reportData.totalConversions}
            </p>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-md p-4 flex items-center gap-4 shadow-sm">
          <div className="p-2 bg-orange-100 rounded-full">
            <Users className="text-orange-500 w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Remaining Leads</p>
            <p className="text-xl font-semibold text-gray-800">
              {reportData.totalLeads - reportData.totalConversions}
            </p>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-md p-4 flex items-center gap-4 shadow-sm">
          <div className="p-2 bg-orange-100 rounded-full">
            <Percent className="text-orange-500 w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Conversion Rate</p>
            <p className="text-xl font-semibold text-gray-800">
              {reportData.conversionRate}%
            </p>
          </div>
        </div>
      </div>

      {/* Monthly Trends Chart */}
      <div className="mt-8 p-4 bg-white rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Monthly Lead Trends</h3>
        {monthlyTrends.length > 0 ? (
          <div className="h-96">
            {" "}
            {/* Increased height */}
            <Bar
              ref={chartRef}
              data={chartData}
              options={chartOptions}
              redraw
            />
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No data available for the selected period
          </p>
        )}
      </div>
    </div>
  );
};

export default GenerateReport;
