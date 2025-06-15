import React, { useState, useEffect } from "react";
import {
  Truck,
  Package,
  Compass,
  Users,
  Calendar,
  MapPin,
  TrendingUp,
  Eye,
  Settings,
  Bell,
  Filter,
  Download,
  CheckCircle,
  Clock,
  AlertTriangle,
  Star,
  Map,
  User,
  CheckCircle2,
  ChevronRight,
  Car,
  UserX,
  Plus,
  ShoppingBag,
  DollarSign,
  BarChart3
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { toast } from "react-toastify";
import {
  fetchDashboardData,
  updateTravelStatus,
  calculateStats,
  processBookingsData,
  processPackageDistribution,
  processGuidePerformance,
  processStatusDistribution,
} from "../../services/OperationOverviewServices";

import api from "../../api/auth";

// Optional Services API functions
const optionalServiceService = {
  getAllServices: async () => {
    const response = await api.get("/optService");
    return response.data;
  },

  getActiveServices: async () => {
    const response = await api.get("/optService/active");
    return response.data;
  },

  getServiceStats: async () => {
    const response = await api.get("/optService/stats");
    return response.data;
  },
};


export default function EnhancedOperationDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [travelerStatuses, setTravelerStatuses] = useState([]);
  const [stats, setStats] = useState({
    activeTours: 0,
    guidesAssigned: 0,
    tripsCompleted: 0,
    customerSatisfaction: 0,
    pendingAssignments: 0,
    vehicles: 0,
    onSchedule: 0,
    delayed: 0,
    unassignedGuides: 0,
    unassignedTransport: 0,
    totalGuides: 0,
    totalTransport: 0,
  });
  const [packageDistributionData, setPackageDistributionData] = useState([]);
  const [guidePerformanceData, setGuidePerformanceData] = useState([]);
  const [statusDistributionData, setStatusDistributionData] = useState([]);
  const [optionalServices, setOptionalServices] = useState([]);
  const [serviceStats, setServiceStats] = useState({
    totalServices: 0,
    activeServices: 0,
    totalRevenue: 0,
    popularServices: [],
  });
  const [expanded, setExpanded] = useState(false);
  const [servicesExpanded, setServicesExpanded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const { bookings, guides, transports, packages } =
        await fetchDashboardData();

      setTravelerStatuses(processBookingsData(bookings));
      setStats(calculateStats(bookings, guides, transports));
      setPackageDistributionData(processPackageDistribution(packages));
      setGuidePerformanceData(processGuidePerformance(guides));
      setStatusDistributionData(processStatusDistribution(bookings));

      // Load optional services data
      await loadOptionalServicesData();
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const loadOptionalServicesData = async () => {
    try {
      // Fetch all services first to get total count and active count
      const allServicesResponse = await optionalServiceService.getAllServices();

      if (allServicesResponse.success) {
        const allServices = allServicesResponse.data || [];
        const activeServices = allServices.filter(
          (service) => service.is_active
        );

        // Set the services state with active services only
        setOptionalServices(activeServices);

        // Try to get stats if the endpoint exists
        try {
          const statsResponse = await optionalServiceService.getServiceStats();

          if (statsResponse.success && Array.isArray(statsResponse.data)) {
            // Calculate total revenue from stats data
            const totalRevenue = statsResponse.data.reduce(
              (sum, service) => sum + (service.totalRevenue || 0),
              0
            );

            setServiceStats({
              totalServices: allServices.length,
              activeServices: activeServices.length,
            });
          } else {
            throw new Error("Stats endpoint returned invalid data");
          }
        } catch (statsError) {
          // Fallback: calculate basic stats from services data
          console.log("Stats API not available, using fallback calculation");

          setServiceStats({
            totalServices: allServices.length,
            activeServices: activeServices.length,
            totalRevenue: activeServices.reduce(
              (sum, service) => sum + (service.price || 0),
              0
            ),
            popularServices: activeServices.slice(0, 5),
          });
        }
      } else {
        throw new Error(
          allServicesResponse.message || "Failed to fetch services"
        );
      }
    } catch (error) {
      console.error("Failed to load optional services:", error);

      // Set default values if everything fails
      setOptionalServices([]);
      setServiceStats({
        totalServices: 0,
        activeServices: 0,
      });
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await updateTravelStatus(bookingId, newStatus);
      toast.success("Status updated successfully");
      loadData(); // Refresh data
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-1">{value}</h3>
        <p className="text-gray-600 font-medium">{title}</p>
        {subtitle && <p className="text-sm text-orange-600 mt-1">{subtitle}</p>}
      </div>
    </div>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "on-schedule":
        return "bg-green-100 text-green-800 border-green-200";
      case "on-route":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "delayed":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "issue":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "on-schedule":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "on-route":
        return <Compass className="w-4 h-4 text-blue-500" />;
      case "delayed":
        return <Clock className="w-4 h-4 text-orange-500" />;
      case "issue":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Compass className="w-4 h-4 text-gray-500" />;
    }
  };

  const renderOptionalServicesSection = () => (
    <div className="bg-white rounded-xl shadow-md border border-orange-100 overflow-hidden">
      <div className="p-3 border-b border-orange-200">
        <h2 className="text-lg font-bold text-gray-800 flex items-center">
          <ShoppingBag className="mr-2 text-orange-500 w-5 h-5" />
          Optional Services
        </h2>
      </div>

      <div className="p-4">
        {/* Service Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                <Package className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">
                {serviceStats.totalServices}
              </h3>
              <p className="text-gray-600 font-medium text-sm">
                Total Services
              </p>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">
                {serviceStats.activeServices}
              </h3>
              <p className="text-gray-600 font-medium text-sm">
                Active Services
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-8">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={Truck}
              title="Active Tours"
              value={stats.activeTours}
              subtitle="Currently running"
              color="from-orange-500 to-red-500"
            />
            <StatCard
              icon={Users}
              title="Guides Assigned"
              value={stats.guidesAssigned}
              subtitle={`${stats.unassignedGuides} unassigned`}
              color="from-amber-500 to-orange-500"
            />
            <StatCard
              icon={Car}
              title="Transport Assigned"
              value={stats.vehicles}
              subtitle={`${stats.unassignedTransport} unassigned`}
              color="from-blue-500 to-indigo-500"
            />
            <StatCard
              icon={CheckCircle}
              title="Trips Completed"
              value={stats.tripsCompleted}
              subtitle="This month"
              color="from-purple-500 to-indigo-500"
            />
          </div>

          {/* Optional Services Section */}
          {renderOptionalServicesSection()}

          {/* Resource Management Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Unassigned Resources */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <UserX className="mr-2 text-red-500" />
                Unassigned Resources
              </h3>
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Unassigned Guides
                    </span>
                    <span className="text-2xl font-bold text-red-600">
                      {stats.unassignedGuides}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Total Guides: {stats.totalGuides} | Available:{" "}
                    {stats.unassignedGuides}
                  </div>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Unassigned Transport
                    </span>
                    <span className="text-2xl font-bold text-orange-600">
                      {stats.unassignedTransport}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Total Vehicles: {stats.totalTransport} | Available:{" "}
                    {stats.unassignedTransport}
                  </div>
                </div>
              </div>
            </div>

            {/* Assignment Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <CheckCircle className="mr-2 text-green-500" />
                Assignment Summary
              </h3>
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Completed Trips
                    </span>
                    <span className="text-2xl font-bold text-green-600">
                      {stats.tripsCompleted}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">This month</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Pending Assignments
                    </span>
                    <span className="text-2xl font-bold text-blue-600">
                      {stats.pendingAssignments}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Awaiting assignment
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Travel Status Monitor Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-secondary-green overflow-hidden">
            <div className="p-4 border-b border-orange-400 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <Map className="mr-2 text-blue-500" />
                Travel Status Monitor
              </h2>
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center"
              >
                {expanded ? "Show Less" : "Show More"}
                <ChevronRight
                  className={`ml-1 w-4 h-4 transition-transform ${
                    expanded ? "transform rotate-90" : ""
                  }`}
                />
              </button>
            </div>

            <div className="p-4">
              {/* Mini Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="text-2xl font-bold text-gray-800">
                    {stats.onSchedule}
                  </div>
                  <div className="text-sm text-gray-600 flex items-center">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-1" />
                    On Schedule
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="text-2xl font-bold text-gray-800">
                    {
                      travelerStatuses.filter((t) => t.status === "on-route")
                        .length
                    }
                  </div>
                  <div className="text-sm text-gray-600 flex items-center">
                    <Compass className="w-4 h-4 text-blue-500 mr-1" />
                    On Route
                  </div>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <div className="text-2xl font-bold text-gray-800">
                    {stats.delayed}
                  </div>
                  <div className="text-sm text-gray-600 flex items-center">
                    <Clock className="w-4 h-4 text-orange-500 mr-1" />
                    Delayed
                  </div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <div className="text-2xl font-bold text-gray-800">
                    {travelerStatuses.length}
                  </div>
                  <div className="text-sm text-gray-600">Active Groups</div>
                </div>
              </div>

              {/* Enhanced Traveler Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-gray-700 font-medium">
                        Group
                      </th>
                      <th className="px-4 py-3 text-left text-gray-700 font-medium">
                        Package
                      </th>
                      <th className="px-4 py-3 text-left text-gray-700 font-medium">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-gray-700 font-medium">
                        Transport
                      </th>
                      <th className="px-4 py-3 text-left text-gray-700 font-medium">
                        Guide
                      </th>
                      <th className="px-4 py-3 text-left text-gray-700 font-medium">
                        Last Update
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {travelerStatuses
                      .slice(0, expanded ? travelerStatuses.length : 2)
                      .map((traveler) => (
                        <tr
                          key={traveler.id}
                          className="border-t border-gray-100 hover:bg-orange-50"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div>
                                <div className="font-medium">
                                  {traveler.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {traveler.travelers} travelers
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-gray-800">
                              {traveler.package}

                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              {getStatusIcon(traveler.status)}
                              <select
                                value={traveler.status}
                                onChange={(e) =>
                                  handleStatusUpdate(
                                    traveler.id,
                                    e.target.value
                                  )
                                }
                                className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                                  traveler.status
                                )}`}
                              >
                                <option value="on-schedule">On Schedule</option>
                                <option value="on-route">On Route</option>
                                <option value="delayed">Delayed</option>
                                <option value="issue">Issue</option>
                              </select>

                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center">

                              <Car className="w-4 h-4 text-blue-500 mr-1" />
                              <span className="text-sm text-gray-700">
                                {traveler.assignedTransport}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <User className="w-4 h-4 text-green-500 mr-1" />
                              <span className="text-sm text-gray-700">
                                {traveler.assignedGuide}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-600">
                              {traveler.lastUpdate}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {!expanded && travelerStatuses.length > 2 && (
                <div className="text-center mt-4 text-sm text-blue-500">
                  +{travelerStatuses.length - 2} more groups
                </div>
              )}
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Package Distribution */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                Package Distribution
              </h3>
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
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
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

            {/* Guide Performance */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                Top Guide Performance
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={guidePerformanceData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" stroke="#666" />
                  <YAxis
                    dataKey="guide"
                    type="category"
                    width={100}
                    stroke="#666"
                  />
                  <Tooltip />
                  <Bar dataKey="tours" fill="#FF6B35" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status Overview */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Booking Status
            </h3>
            <div className="space-y-4">
              {statusDistributionData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="font-medium text-gray-700">
                      {item.status}
                    </span>
                  </div>
                  <span className="font-bold text-gray-800">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className=" p-4  bg-white rounded-lg shadow-md">
      <div>
        <div
          className="mb-6 flex justify-between items-center px-6 py-9 border-b border-gray-100

              bg-primary-saffron"
        >
          <h2 className="text-xl font-bold text-white">Operation Overview</h2>
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px] ">
          {activeTab === "overview" && renderOverview()}
        </div>
      </div>
    </div>
  );
}
