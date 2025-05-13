import React, { useState } from 'react';
import Header from '@components/layout/Header';
import Sidebar from '@components/layout/Sidebar';
import StatsCard from '@components/common/StatCard';
import DataTable from "@components/common/DataTable";

import BarChartComponent from '@components/common/BarChart';
import LineChartComponent from '@components/common/LineChart';
import FollowUpCard from '@components/common/FollowUp';

// Import mock data
import {
  mockLeadStats,
  mockRevenueStats,
  mockLeadSource,
  mockPackagePopularity,
  mockLeadStatusData,
  mockMonthlyBookings,
  mockMonthlySales,
  mockRecentLeads,
  mockUpcomingFollowUps,
  mockTeamPerformance
}  from '../../api/MockData';

// Import icons
import { 
  Users, 
  UserPlus, 
  TrendingUp, 
  IndianRupee, 
  Calendar
} from 'lucide-react';

const SalesDashboard = () => {
  const [dateRange, setDateRange] = useState('This Month');
  
  // Columns for recent leads table
  const leadsColumns = [
    { key: 'name', title: 'Name', sortable: true },
    { key: 'email', title: 'Email', sortable: true },
    { key: 'phone', title: 'Phone', sortable: true },
    { 
      key: 'source', 
      title: 'Source', 
      sortable: true,
      render: (row) => (
        <span className="px-2 py-1 bg-orange-50 text-orange-600 rounded-full text-xs">
          {row.source}
        </span>
      )
    },
    { 
      key: 'status', 
      title: 'Status', 
      sortable: true,
      render: (row) => {
        let statusColor = '';
        switch (row.status) {
          case 'New':
            statusColor = 'bg-blue-50 text-blue-600';
            break;
          case 'Contacted':
            statusColor = 'bg-purple-50 text-purple-600';
            break;
          case 'Interested':
            statusColor = 'bg-green-50 text-green-600';
            break;
          case 'Booked':
            statusColor = 'bg-green-50 text-green-700';
            break;
          case 'Not Interested':
            statusColor = 'bg-red-50 text-red-600';
            break;
          default:
            statusColor = 'bg-gray-50 text-gray-600';
        }
        
        return (
          <span className={`px-2 py-1 ${statusColor} rounded-full text-xs`}>
            {row.status}
          </span>
        );
      }
    },
    { key: 'date', title: 'Date', sortable: true },
    { key: 'assignedTo', title: 'Assigned To', sortable: true }
  ];
  
  // Columns for team performance table
  const teamColumns = [
    { key: 'name', title: 'Name', sortable: true },
    { key: 'leadsAssigned', title: 'Leads Assigned', sortable: true },
    { key: 'conversions', title: 'Conversions', sortable: true },
    { key: 'conversionRate', title: 'Rate', sortable: true }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 ml-0 lg:ml-64">
        <Header title="Sales Dashboard" userName="Sales Agent" />
        
        <main className="p-4 md:p-6">
          {/* Date Range Selector */}
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Sales Overview</h2>
            <div className="flex space-x-2">
              {['Today', 'This Week', 'This Month', 'This Year'].map((range) => (
                <button
                  key={range}
                  className={`px-4 py-2 text-sm rounded-md ${
                    dateRange === range
                      ? 'bg-orange-500 text-white'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-orange-50'
                  }`}
                  onClick={() => setDateRange(range)}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatsCard 
              title="Total Leads" 
              value={mockLeadStats.total} 
              icon={<Users size={20} />} 
              change={`${mockLeadStats.changePercentage}%`} 
              changeType="increase" 
              changeText="vs last month" 
            />
            
            <StatsCard 
              title="New Leads Today" 
              value={mockLeadStats.newToday} 
              icon={<UserPlus size={20} />} 
            />
            
            <StatsCard 
              title="Conversion Rate" 
              value={`${mockLeadStats.conversion}%`} 
              icon={<TrendingUp size={20} />} 
              change="5%" 
              changeType="increase" 
              changeText="vs last month" 
            />
            
            <StatsCard 
              title="Revenue" 
              value={mockRevenueStats.totalRevenue} 
              icon={<IndianRupee size={20} />} 
              change={`${mockRevenueStats.changePercentage}%`} 
              changeType="increase" 
              changeText="vs last month" 
            />
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <LineChartComponent 
              data={mockMonthlySales}
              title="Monthly Performance"
              xAxisKey="name"
              lines={[
                { dataKey: 'revenue', stroke: '#FF7B25', name: 'Revenue (₹)' },
                { dataKey: 'bookings', stroke: '#22C55E', name: 'Bookings' }
              ]}
              height={300}
            />
            
            <BarChartComponent 
              data={mockLeadStatusData}
              title="Lead Status Distribution"
              xAxisKey="name"
              bars={[
                { dataKey: 'value', fill: '#FF7B25', name: 'Leads' }
              ]}
              height={300}
            />
          </div>
          
          {/*<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <PieChartComponent 
              data={mockLeadSource}
              title="Lead Sources"
              height={300}
              colorScheme={['#FF7B25', '#FF9A52', '#FFB980', '#FFDBAC']}
            />
            
            <PieChartComponent 
              data={mockPackagePopularity}
              title="Package Popularity"
              height={300}
              colorScheme={['#EA580C', '#FF7B25', '#FF9A52']}
            />
          </div>*/}
          
          {/* Recent Leads */}
          <div className="mb-6">
            <DataTable 
              columns={leadsColumns}
              data={mockRecentLeads}
              title="Recent Leads"
              pageSize={5}
            />
          </div>
          
          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FollowUpCard followUps={mockUpcomingFollowUps} />
            
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-medium text-gray-800">Team Performance</h3>
                <button className="text-sm text-orange-600 hover:text-orange-800">View Details</button>
              </div>
              
              <DataTable 
                columns={teamColumns}
                data={mockTeamPerformance}
                pageSize={4}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SalesDashboard;