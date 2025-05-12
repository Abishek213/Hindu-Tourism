import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  Phone, Mail, Calendar, Users, Package, FileText, User, Clock, Filter, Search,
  Bell, ChevronDown, MessageSquare, CheckCircle, AlertCircle, Clock3, LogOut,
  X, Save, UserPlus, CalendarPlus
} from 'lucide-react';

// Sample data - in real implementation this would come from API
const leadsData = [
  { id: 1, name: 'Rajesh Kumar', email: 'rajesh@gmail.com', phone: '+91 9876543210', source: 'Website', status: 'New', createdDate: '2025-05-10' },
  { id: 2, name: 'Priya Singh', email: 'priya@outlook.com', phone: '+91 8765432109', source: 'WhatsApp', status: 'Contacted', createdDate: '2025-05-09' },
  { id: 3, name: 'Amit Patel', email: 'amit@yahoo.com', phone: '+91 7654321098', source: 'Phone Call', status: 'Interested', createdDate: '2025-05-08' },
  { id: 4, name: 'Meera Joshi', email: 'meera@gmail.com', phone: '+91 6543210987', source: 'Email', status: 'Booked', createdDate: '2025-05-07' },
  { id: 5, name: 'Suresh Shah', email: 'suresh@hotmail.com', phone: '+91 5432109876', source: 'Website', status: 'Not Interested', createdDate: '2025-05-06' }
];

const bookingsData = [
  { id: 101, customerName: 'Anjali Sharma', package: 'Pashupatinath Special', travelDates: '10-15 Jun', travelers: 4, status: 'Confirmed' },
  { id: 102, customerName: 'Vikram Malhotra', package: 'Muktinath Darshan', travelDates: '20-25 Jun', travelers: 2, status: 'Pending Payment' },
  { id: 103, customerName: 'Deepak Verma', package: 'Pashupatinath & Muktinath', travelDates: '5-12 Jul', travelers: 6, status: 'Documents Pending' }
];

const remindersData = [
  { id: 1, type: 'Follow-up', lead: 'Rajesh Kumar', dueDate: '2025-05-13', status: 'Pending' },
  { id: 2, type: 'Document Collection', lead: 'Priya Singh', dueDate: '2025-05-14', status: 'Pending' },
  { id: 3, type: 'Payment Reminder', lead: 'Amit Patel', dueDate: '2025-05-12', status: 'Overdue' }
];

const monthlyStats = [
  { name: 'Jan', leads: 45, conversions: 12 },
  { name: 'Feb', leads: 52, conversions: 15 },
  { name: 'Mar', leads: 48, conversions: 18 },
  { name: 'Apr', leads: 70, conversions: 25 },
  { name: 'May', leads: 40, conversions: 14 }
];

const leadSourceData = [
  { name: 'Website', value: 45 },
  { name: 'WhatsApp', value: 28 },
  { name: 'Phone', value: 15 },
  { name: 'Email', value: 12 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notifications, setNotifications] = useState(3);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeadStatus, setSelectedLeadStatus] = useState('All');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    phone: '',
    source: 'Website',
    status: 'New',
    notes: ''
  });
  const [newBooking, setNewBooking] = useState({
    customerId: '',
    customerName: '',
    packageId: '',
    packageName: '',
    travelStartDate: '',
    travelEndDate: '',
    numTravelers: 1,
    specialRequirements: ''
  });
  
  const filteredLeads = leadsData.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         lead.phone.includes(searchTerm);
    const matchesStatus = selectedLeadStatus === 'All' || lead.status === selectedLeadStatus;
    return matchesSearch && matchesStatus;
  });
  
  const handleNewLeadChange = (e) => {
    const { name, value } = e.target;
    setNewLead(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNewBookingChange = (e) => {
    const { name, value } = e.target;
    setNewBooking(prev => ({ ...prev, [name]: value }));
  };
  
  const handleLeadSubmit = (e) => {
    e.preventDefault();
    console.log('New Lead Submitted:', newLead);
    // Here you would normally submit to your API
    setShowLeadForm(false);
    setNewLead({
      name: '',
      email: '',
      phone: '',
      source: 'Website',
      status: 'New',
      notes: ''
    });
  };
  
  const handleBookingSubmit = (e) => {
    e.preventDefault();
    console.log('New Booking Submitted:', newBooking);
    // Here you would normally submit to your API
    setShowBookingForm(false);
    setNewBooking({
      customerId: '',
      customerName: '',
      packageId: '',
      packageName: '',
      travelStartDate: '',
      travelEndDate: '',
      numTravelers: 1,
      specialRequirements: ''
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-orange-800 text-white">
        <div className="p-4">
          <h1 className="text-2xl font-bold">TheHinduTourism</h1>
          <p className="text-sm opacity-75">Sales Agent Portal</p>
        </div>
        <nav className="mt-6">
          <button 
            className={`flex items-center px-6 py-3 w-full ${activeTab === 'dashboard' ? 'bg-orange-900' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <FileText className="mr-3 h-5 w-5" />
            <span>Dashboard</span>
          </button>
          <button 
            className={`flex items-center px-6 py-3 w-full ${activeTab === 'leads' ? 'bg-orange-900' : ''}`}
            onClick={() => setActiveTab('leads')}
          >
            <User className="mr-3 h-5 w-5" />
            <span>Lead Management</span>
          </button>
          <button 
            className={`flex items-center px-6 py-3 w-full ${activeTab === 'bookings' ? 'bg-orange-900' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            <Calendar className="mr-3 h-5 w-5" />
            <span>Bookings</span>
          </button>
          <button 
            className={`flex items-center px-6 py-3 w-full ${activeTab === 'customers' ? 'bg-orange-900' : ''}`}
            onClick={() => setActiveTab('customers')}
          >
            <Users className="mr-3 h-5 w-5" />
            <span>Customers</span>
          </button>
          <button 
            className={`flex items-center px-6 py-3 w-full ${activeTab === 'packages' ? 'bg-orange-900' : ''}`}
            onClick={() => setActiveTab('packages')}
          >
            <Package className="mr-3 h-5 w-5" />
            <span>Packages</span>
          </button>
          <button 
            className={`flex items-center px-6 py-3 w-full ${activeTab === 'communications' ? 'bg-orange-900' : ''}`}
            onClick={() => setActiveTab('communications')}
          >
            <MessageSquare className="mr-3 h-5 w-5" />
            <span>Communications</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center rounded-md bg-gray-100 p-2">
              <Search className="h-5 w-5 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="ml-2 bg-transparent border-none focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center">
              <div className="relative mr-4">
                <Bell className="h-6 w-6 text-gray-500" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-medium">
                  SA
                </div>
                <div className="ml-2">
                  <p className="text-sm font-medium text-gray-700">Sales Agent</p>
                  <p className="text-xs text-gray-500">Online</p>
                </div>
                <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === 'dashboard' && (
            <div>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-4 flex items-center">
                  <div className="rounded-full bg-blue-100 p-3 mr-4">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Leads</p>
                    <p className="text-xl font-bold">127</p>
                    <p className="text-xs text-green-500">+12% from last month</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4 flex items-center">
                  <div className="rounded-full bg-green-100 p-3 mr-4">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Converted</p>
                    <p className="text-xl font-bold">36</p>
                    <p className="text-xs text-green-500">+8% from last month</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4 flex items-center">
                  <div className="rounded-full bg-yellow-100 p-3 mr-4">
                    <Clock3 className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Pending Follow-ups</p>
                    <p className="text-xl font-bold">18</p>
                    <p className="text-xs text-red-500">4 overdue</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4 flex items-center">
                  <div className="rounded-full bg-purple-100 p-3 mr-4">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Upcoming Bookings</p>
                    <p className="text-xl font-bold">9</p>
                    <p className="text-xs text-gray-500">Next 7 days</p>
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-4">
                  <h2 className="text-lg font-medium mb-4">Monthly Performance</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="leads" fill="#8884d8" name="Leads" />
                      <Bar dataKey="conversions" fill="#82ca9d" name="Conversions" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <h2 className="text-lg font-medium mb-4">Lead Sources</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={leadSourceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {leadSourceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Reminders and Recent Leads */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow">
                  <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium">Today's Reminders</h2>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {remindersData.map(reminder => (
                      <div key={reminder.id} className="p-4 flex items-center justify-between">
                        <div className="flex items-start">
                          <div className={`rounded-full p-2 mr-3 ${
                            reminder.status === 'Overdue' ? 'bg-red-100' : 'bg-yellow-100'
                          }`}>
                            <Clock className={`h-4 w-4 ${
                              reminder.status === 'Overdue' ? 'text-red-600' : 'text-yellow-600'
                            }`} />
                          </div>
                          <div>
                            <p className="font-medium">{reminder.type}</p>
                            <p className="text-sm text-gray-500">Lead: {reminder.lead}</p>
                            <p className="text-xs text-gray-400">Due: {reminder.dueDate}</p>
                          </div>
                        </div>
                        <div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            reminder.status === 'Overdue' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {reminder.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-gray-200">
                    <button className="text-orange-600 hover:text-orange-800 text-sm font-medium">
                      View All Reminders
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow">
                  <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium">Recent Leads</h2>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {leadsData.slice(0, 3).map(lead => (
                      <div key={lead.id} className="p-4">
                        <div className="flex justify-between">
                          <p className="font-medium">{lead.name}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            lead.status === 'New' ? 'bg-blue-100 text-blue-800' :
                            lead.status === 'Contacted' ? 'bg-yellow-100 text-yellow-800' :
                            lead.status === 'Interested' ? 'bg-green-100 text-green-800' :
                            lead.status === 'Booked' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {lead.status}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <Mail className="h-4 w-4 mr-1" /> {lead.email}
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <Phone className="h-4 w-4 mr-1" /> {lead.phone}
                        </div>
                        <div className="mt-1 flex items-center justify-between">
                          <div className="text-xs text-gray-400">Source: {lead.source}</div>
                          <div className="text-xs text-gray-400">Created: {lead.createdDate}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-gray-200">
                    <button className="text-orange-600 hover:text-orange-800 text-sm font-medium"
                            onClick={() => setActiveTab('leads')}>
                      View All Leads
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'leads' && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-medium">Lead Management</h2>
                <button 
                  className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 flex items-center"
                  onClick={() => setShowLeadForm(true)}
                >
                  <UserPlus className="h-4 w-4 mr-2" /> Add New Lead
                </button>
              </div>
              <div className="p-4 flex flex-wrap gap-2 border-b border-gray-200">
                <div className="flex items-center">
                  <label htmlFor="status" className="mr-2 text-sm text-gray-500">Filter by Status:</label>
                  <select 
                    id="status" 
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                    value={selectedLeadStatus}
                    onChange={(e) => setSelectedLeadStatus(e.target.value)}
                  >
                    <option value="All">All Statuses</option>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Interested">Interested</option>
                    <option value="Booked">Booked</option>
                    <option value="Not Interested">Not Interested</option>
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLeads.map(lead => (
                      <tr key={lead.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{lead.email}</div>
                          <div className="text-sm text-gray-500">{lead.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{lead.source}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            lead.status === 'New' ? 'bg-blue-100 text-blue-800' :
                            lead.status === 'Contacted' ? 'bg-yellow-100 text-yellow-800' :
                            lead.status === 'Interested' ? 'bg-green-100 text-green-800' :
                            lead.status === 'Booked' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{lead.createdDate}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                          <button className="text-orange-600 hover:text-orange-900">Follow-up</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing {filteredLeads.length} of {leadsData.length} leads
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-sm">Previous</button>
                  <button className="px-3 py-1 border border-gray-300 rounded-md bg-orange-50 text-orange-600 text-sm">1</button>
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-sm">Next</button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'bookings' && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-medium">Booking Management</h2>
                <button 
                  className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 flex items-center"
                  onClick={() => setShowBookingForm(true)}
                >
                  <CalendarPlus className="h-4 w-4 mr-2" /> Create New Booking
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Travel Dates</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Travelers</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookingsData.map(booking => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">#{booking.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{booking.customerName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{booking.package}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{booking.travelDates}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{booking.travelers}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'Pending Payment' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                          <button className="text-orange-600 hover:text-orange-900">Update</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
      
      {/* Modal Form for New Lead */}
      {showLeadForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md relative">
            <button 
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" 
              onClick={() => setShowLeadForm(false)}
            >
              <X className="h-5 w-5" />
            </button>
            <div className="p-3 border-b border-gray-200">
              <h3 className="text-lg font-medium">Add New Lead</h3>
            </div>
            <form onSubmit={handleLeadSubmit} className="text-sm">
              <div className="p-3">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Full Name*</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={newLead.name} 
                      onChange={handleNewLeadChange} 
                      className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-orange-500"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Email*</label>
                      <input 
                        type="email" 
                        name="email" 
                        value={newLead.email} 
                        onChange={handleNewLeadChange} 
                        className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-orange-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number*</label>
                      <input 
                        type="tel" 
                        name="phone" 
                        value={newLead.phone} 
                        onChange={handleNewLeadChange} 
                        className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-orange-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Lead Source</label>
                      <select 
                        name="source" 
                        value={newLead.source} 
                        onChange={handleNewLeadChange} 
                        className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-orange-500"
                      >
                        <option value="Website">Website</option>
                        <option value="WhatsApp">WhatsApp</option>
                        <option value="Phone Call">Phone Call</option>
                        <option value="Email">Email</option>
                        <option value="Referral">Referral</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                      <select 
                        name="status" 
                        value={newLead.status} 
                        onChange={handleNewLeadChange} 
                        className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-orange-500"
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Interested">Interested</option>
                        <option value="Not Interested">Not Interested</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
                    <textarea 
                      name="notes" 
                      value={newLead.notes} 
                      onChange={handleNewLeadChange} 
                      rows="2" 
                      className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="p-3 border-t border-gray-200 flex justify-end">
                <button 
                  type="submit" 
                  className="px-3 py-1 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-1 focus:ring-orange-500 flex items-center text-sm"
                >
                  <Save className="h-3 w-3 mr-1" /> Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
     {/* Modal Form for New Booking */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-3 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium">Create New Booking</h3>
              <button 
                className="text-gray-500 hover:text-gray-700" 
                onClick={() => setShowBookingForm(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleBookingSubmit} className="text-sm">
              <div className="p-3">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name*</label>
                    <div className="flex space-x-2">
                      <input 
                        type="text" 
                        name="customerName" 
                        value={newBooking.customerName} 
                        onChange={handleNewBookingChange} 
                        className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-orange-500"
                        required
                      />
                      <button 
                        type="button"
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none"
                      >
                        Select
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Package*</label>
                    <select 
                      name="packageName" 
                      value={newBooking.packageName} 
                      onChange={handleNewBookingChange} 
                      className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-orange-500"
                      required
                    >
                      <option value="">Select Package</option>
                      <option value="Pashupatinath Special">Pashupatinath Special</option>
                      <option value="Muktinath Darshan">Muktinath Darshan</option>
                      <option value="Pashupatinath & Muktinath">Pashupatinath & Muktinath</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date*</label>
                      <input 
                        type="date" 
                        name="travelStartDate" 
                        value={newBooking.travelStartDate} 
                        onChange={handleNewBookingChange} 
                        className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-orange-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date*</label>
                      <input 
                        type="date" 
                        name="travelEndDate" 
                        value={newBooking.travelEndDate} 
                        onChange={handleNewBookingChange} 
                        className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-orange-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Travelers*</label>
                      <input 
                        type="number" 
                        name="numTravelers" 
                        value={newBooking.numTravelers} 
                        onChange={handleNewBookingChange} 
                        min="1"
                        className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-orange-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
                      <select 
                        className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-orange-500"
                      >
                        <option value="">Select if needed</option>
                        <option value="wheelchair">Wheelchair</option>
                        <option value="vegetarian">Vegetarian Food</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                    <textarea 
                      name="specialRequirements" 
                      value={newBooking.specialRequirements} 
                      onChange={handleNewBookingChange} 
                      rows="2" 
                      className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    ></textarea>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-2">
                    <h4 className="font-medium mb-1 text-sm">Optional Services</h4>
                    <div className="grid grid-cols-2 gap-1">
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="helicopter" 
                          className="h-4 w-4 text-orange-600 focus:ring-orange-500" 
                        />
                        <label htmlFor="helicopter" className="ml-2 block text-xs text-gray-700">Helicopter ride (+₹25,000/person)</label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="hotel" 
                          className="h-4 w-4 text-orange-600 focus:ring-orange-500" 
                        />
                        <label htmlFor="hotel" className="ml-2 block text-xs text-gray-700">Hotel upgrade (+₹5,000/night)</label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="nurse" 
                          className="h-4 w-4 text-orange-600 focus:ring-orange-500" 
                        />
                        <label htmlFor="nurse" className="ml-2 block text-xs text-gray-700">Nurse support (+₹3,000/day)</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-3 py-2 border-t border-gray-200 flex justify-end">
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-1 focus:ring-orange-500 flex items-center text-sm"
                >
                  <Save className="h-4 w-4 mr-2" /> Submit Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;