import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", revenue: 4000, payments: 2400, refunds: 200 },
  { month: "Feb", revenue: 3000, payments: 1398, refunds: 100 },
  { month: "Mar", revenue: 2000, payments: 9800, refunds: 500 },
  { month: "Apr", revenue: 2780, payments: 3908, refunds: 250 },
  { month: "May", revenue: 1890, payments: 4800, refunds: 150 },
  { month: "Jun", revenue: 2390, payments: 3800, refunds: 300 },
  { month: "Jul", revenue: 3490, payments: 4300, refunds: 400 },
];

const FinancialReports = () => {
  const [totals, setTotals] = useState({
    revenue: 0,
    payments: 0,
    refunds: 0,
  });

  useEffect(() => {
    const revenueTotal = data.reduce((acc, item) => acc + item.revenue, 0);
    const paymentsTotal = data.reduce((acc, item) => acc + item.payments, 0);
    const refundsTotal = data.reduce((acc, item) => acc + item.refunds, 0);

    setTotals({
      revenue: revenueTotal,
      payments: paymentsTotal,
      refunds: refundsTotal,
    });
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Financial Reports</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="p-4 bg-orange-100 rounded-lg">
          <h3 className="text-sm font-semibold text-orange-700 uppercase mb-1">
            Total Revenue
          </h3>
          <p className="text-3xl font-bold text-orange-900">${totals.revenue.toLocaleString()}</p>
        </div>

        <div className="p-4 bg-yellow-100 rounded-lg">
          <h3 className="text-sm font-semibold text-yellow-700 uppercase mb-1">
            Total Payments
          </h3>
          <p className="text-3xl font-bold text-yellow-900">${totals.payments.toLocaleString()}</p>
        </div>

        <div className="p-4 bg-red-100 rounded-lg">
          <h3 className="text-sm font-semibold text-red-700 uppercase mb-1">
            Total Refunds
          </h3>
          <p className="text-3xl font-bold text-red-900">${totals.refunds.toLocaleString()}</p>
        </div>
      </div>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F97316" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPayments" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FBBF24" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#FBBF24" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorRefunds" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#F97316"
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
            <Area
              type="monotone"
              dataKey="payments"
              stroke="#FBBF24"
              fillOpacity={1}
              fill="url(#colorPayments)"
            />
            <Area
              type="monotone"
              dataKey="refunds"
              stroke="#EF4444"
              fillOpacity={1}
              fill="url(#colorRefunds)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FinancialReports;
