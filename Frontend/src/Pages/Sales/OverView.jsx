import React, { useState, useEffect } from 'react';
import CompactStatsCard from '../../Components/Widgets/CompactStatCard';
import DataTable from "../../Components/Widgets/DataTable";
import PieChart from "../../Components/Widgets//PieChart";
import BarChartComponent from '../../Components/Widgets//BarChart';
import { toast } from 'react-toastify';

import { Users, UserPlus, TrendingUp } from 'lucide-react';

import {
  fetchLeadStats,
  fetchLeadSources,
  fetchLeadStatusData,
  fetchRecentLeads,
  fetchPackagePopularity,
  fetchCommunicationMethods
} from '../../services/SalesOverviewService';

const Overview = () => {
  const [dateRange, setDateRange] = useState('This Month');
  const [leadStats, setLeadStats] = useState({});
  const [leadSources, setLeadSources] = useState([]);
  const [packagePopularity, setPackagePopularity] = useState([]);
  const [leadStatusData, setLeadStatusData] = useState([]);
  const [recentLeads, setRecentLeads] = useState([]);
  const [communicationLogs, setCommunicationLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          stats, 
          sources, 
          packages, 
          status, 
          leads, 
          communications
        ] = await Promise.all([
          fetchLeadStats(),
          fetchLeadSources(),
          fetchPackagePopularity(),
          fetchLeadStatusData(),
          fetchRecentLeads(),
          fetchCommunicationMethods()
        ]);
        
        setLeadStats(stats);
        setLeadSources(sources);
        setPackagePopularity(packages);
        setLeadStatusData(status);
        setRecentLeads(leads);
        setCommunicationLogs(communications);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  const leadsColumns = [
    { key: 'name', title: 'Name', sortable: true },
    { key: 'email', title: 'Email', sortable: true },
    { key: 'phone', title: 'Phone', sortable: true },
    { 
      key: 'source', 
      title: 'Source', 
      sortable: true,
      render: (row) => (
        <span className="px-2 py-1 bg-orange-50 text-orange-600 rounded-full text-xs capitalize">
          {row.source}
        </span>
      )
    },
    { 
      key: 'status', 
      title: 'Status', 
      sortable: true,
      render: (row) => {
        const statusColors = {
          'new': 'bg-blue-50 text-blue-600',
          'contacted': 'bg-purple-50 text-purple-600',
          'qualified': 'bg-green-50 text-green-600',
          'converted': 'bg-green-50 text-green-700',
          'lost': 'bg-red-50 text-red-600'
        };

        const status = row.status.toLowerCase();
        const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1);
        const statusColor = statusColors[status] || 'bg-gray-50 text-gray-600';

        return (
          <span className={`px-2 py-1 ${statusColor} rounded-full text-xs`}>
            {formattedStatus}
          </span>
        );
      }
    },
    { key: 'date', title: 'Date', sortable: true },
    { key: 'assignedTo', title: 'Assigned To', sortable: true }
  ];

  const dateRanges = ['Today', 'This Week', 'This Month', 'This Year'];

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4  bg-white rounded-lg shadow-md">
      {/* Date Filter */}
      <div className="mb-6 flex justify-between items-center px-6 py-8 border-b border-gray-100
       bg-primary-saffron">
        <h2 className="text-xl font-bold text-white">Sales Overview</h2>
        <div className="flex space-x-2">
          {dateRanges.map((range) => (
           <button
            key={range}
            className={`px-4 py-2 text-sm rounded-md  text-orange-600 transition-all duration-200
                  bg-white shadow-lg sm:mt-0 hover:bg-orange-100`}
            onClick={() => setDateRange(range)}
          >
            {range}
          </button>

          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <CompactStatsCard 
          title="Total Leads" 
          value={leadStats.total || 0} 
          icon={<Users size={20} />} 
          change={`${leadStats.changePercentage || 0}%`} 
          changeType="increase" 
          changeText="vs last month" 
        />
        <CompactStatsCard 
          title="New Leads Today" 
          value={leadStats.newToday || 0} 
          icon={<UserPlus size={20} />} 
        />
        <CompactStatsCard 
          title="Conversion Rate" 
          value={`${leadStats.conversion || 0}%`} 
          icon={<TrendingUp size={20} />} 
          change="5%" 
          changeType="increase" 
          changeText="vs last month" 
        />
      </div>

      {/* Lead Status Bar Chart */}
      <div className="mb-6">
        <BarChartComponent 
          data={leadStatusData}
          title="Lead Status Distribution"
          xAxisKey="name"
          bars={[
            { dataKey: 'value', fill: '#FF7B25', name: 'Leads' }
          ]}
          height={300}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <PieChart 
          data={leadSources}
          title="Lead Sources"
          height={300}
          colorScheme={['#FF7B25', '#25d366', '#34B7F1', '#D93025', '#4C8BF5']}
        />
        <PieChart
          data={packagePopularity}
          title="Package Popularity"
          height={300}
          colorScheme={['#EA580C', '#FF7B25', '#FF9A52']}
        />
        <PieChart
          data={communicationLogs}
          title="Communication Methods"
          height={300}
          colorScheme={['#FF7B25', '#25d366', '#34B7F1', '#D93025', '#4C8BF5']}
        />
      </div>

      {/* Recent Leads Table */}
      <div className="mb-6">
        <DataTable 
          columns={leadsColumns}
          data={recentLeads}
          title="Recent Leads"
          pageSize={5}
        />
      </div>
    </div>
  );
};

export default Overview;