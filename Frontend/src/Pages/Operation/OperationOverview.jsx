import React, { useState } from 'react';
import { 
  Truck, Package, Compass, Users, Calendar, MapPin, 
  TrendingUp, Eye, Settings, Bell, Filter, Download,
  CheckCircle, Clock, AlertTriangle, Star
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';

export default function EnhancedOperationDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30days');

  // Enhanced dummy data for charts
  const monthlyBookingsData = [
    { month: 'Jan', bookings: 45, revenue: 1125000 },
    { month: 'Feb', bookings: 52, revenue: 1300000 },
    { month: 'Mar', bookings: 48, revenue: 1200000 },
    { month: 'Apr', bookings: 61, revenue: 1525000 },
    { month: 'May', bookings: 55, revenue: 1375000 },
    { month: 'Jun', bookings: 67, revenue: 1675000 },
  ];

  const packageDistributionData = [
    { name: 'Pashupatinath Darshan', value: 35, bookings: 28, color: '#FF6B35' },
    { name: 'Muktinath Yatra', value: 30, bookings: 24, color: '#F7931E' },
    { name: 'Combined Package', value: 20, bookings: 16, color: '#FFD23F' },
    { name: 'Custom Tours', value: 15, bookings: 12, color: '#FFAB00' },
  ];

  const guidePerformanceData = [
    { guide: 'Rajesh Kumar', tours: 18, rating: 4.9, revenue: 450000 },
    { guide: 'Priya Sharma', tours: 15, rating: 4.8, revenue: 375000 },
    { guide: 'Amit Singh', tours: 12, rating: 4.7, revenue: 300000 },
    { guide: 'Sunita Devi', tours: 10, rating: 4.6, revenue: 250000 },
  ];

  const statusDistributionData = [
    { status: 'Confirmed', count: 45, color: '#10B981' },
    { status: 'In Progress', count: 12, color: '#F59E0B' },
    { status: 'Completed', count: 38, color: '#3B82F6' },
    { status: 'Cancelled', count: 5, color: '#EF4444' },
  ];

  // Enhanced stats
  const stats = {
    activeTours: 12,
    guidesAssigned: 18,
    tripsCompleted: 38,
    totalRevenue: 9500000,
    monthlyGrowth: 15.2,
    customerSatisfaction: 4.8,
    pendingAssignments: 5,
    vehicles: 8
  };

  const tabs = [
    { id: 'overview', label: 'Dashboard Overview', icon: TrendingUp },
  
  ];

  const StatCard = ({ icon: Icon, title, value, subtitle, color, trend }) => (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
            trend > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
          }`}>
            <TrendingUp className="w-3 h-3" />
            {trend > 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-1">{value}</h3>
        <p className="text-gray-600 font-medium">{title}</p>
        {subtitle && <p className="text-sm text-orange-600 mt-1">{subtitle}</p>}
      </div>
    </div>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-xl border border-orange-200">
          <p className="font-semibold text-orange-800">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'revenue' ? `₹${(entry.value/1000).toFixed(0)}K` : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Truck}
          title="Active Tours"
          value={stats.activeTours}
          subtitle="Currently running"
          color="from-orange-500 to-red-500"
          trend={8.5}
        />
        <StatCard
          icon={Users}
          title="Guides Assigned"
          value={stats.guidesAssigned}
          subtitle="Active guides"
          color="from-amber-500 to-orange-500"
          trend={12.3}
        />
        <StatCard
          icon={CheckCircle}
          title="Trips Completed"
          value={stats.tripsCompleted}
          subtitle="This month"
          color="from-green-500 to-emerald-500"
          trend={15.2}
        />
        <StatCard
          icon={TrendingUp}
          title="Total Revenue"
          value={`₹${(stats.totalRevenue/100000).toFixed(1)}L`}
          subtitle="This month"
          color="from-purple-500 to-indigo-500"
          trend={18.7}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Bookings Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Monthly Bookings & Revenue</h3>
            <select className="px-3 py-2 border border-orange-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
              <option>Last 6 months</option>
              <option>Last year</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyBookingsData}>
              <defs>
                <linearGradient id="bookingsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#FF6B35" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="bookings" 
                stroke="#FF6B35" 
                fillOpacity={1} 
                fill="url(#bookingsGradient)" 
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Package Distribution */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Package Distribution</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={packageDistributionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {packageDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Guide Performance & Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Guide Performance */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Top Guide Performance</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={guidePerformanceData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" stroke="#666" />
              <YAxis dataKey="guide" type="category" width={100} stroke="#666" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="tours" fill="#FF6B35" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Overview */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Booking Status</h3>
          <div className="space-y-4">
            {statusDistributionData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="font-medium text-gray-700">{item.status}</span>
                </div>
                <span className="font-bold text-gray-800">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
     

      <div className="px-6 py-8">
        {/* Navigation Tabs */}
        <nav className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-2 border border-orange-100">
            <div className="flex flex-wrap gap-2">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === id
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden md:inline">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {activeTab === 'overview' && renderOverview()}
         
        </div>
      </div>
    </div>
  );
}