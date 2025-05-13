import { useState } from 'react';
import {
  PieChart,
  BarChart,
  LineChart,
  Pie,
  Cell,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  Users,
  Calendar,
  Package,
  CreditCard,
  Inbox,
  Compass,
  Settings,
  Menu,
  X,
  UserPlus,
  Edit,
  Trash2
} from 'lucide-react';

// Mock data for visualization
const leadData = [
  { name: 'New', value: 42, color: '#FF9933' },
  { name: 'Contacted', value: 25, color: '#f39c12' },
  { name: 'Qualified', value: 18, color: '#2ecc71' },
  { name: 'Proposal', value: 12, color: '#9b59b6' },
  { name: 'Converted', value: 8, color: '#1abc9c' },
  { name: 'Lost', value: 6, color: '#e74c3c' },
];

const revenueData = [
  { name: 'Jan', amount: 42000 },
  { name: 'Feb', amount: 51000 },
  { name: 'Mar', amount: 63000 },
  { name: 'Apr', amount: 75000 },
  { name: 'May', amount: 90000 },
  { name: 'Jun', amount: 85000 },
];

const bookingData = [
  { name: 'Varanasi Tour', count: 25 },
  { name: 'Golden Triangle', count: 40 },
  { name: 'Kerala Backwaters', count: 18 },
  { name: 'Rajasthan Heritage', count: 32 },
  { name: 'Himalayan Trek', count: 15 },
];

// Mock data for staff management
const initialStaffData = [
  { id: 1, name: 'Rajiv Sharma', email: 'rajiv@hindutourism.com', role: 'Sales Manager', status: 'Active' },
  { id: 2, name: 'Priya Patel', email: 'priya@hindutourism.com', role: 'Customer Service', status: 'Active' },
  { id: 3, name: 'Amit Singh', email: 'amit@hindutourism.com', role: 'Guide Coordinator', status: 'Active' },
  { id: 4, name: 'Meera Kumar', email: 'meera@hindutourism.com', role: 'Accountant', status: 'Inactive' },
];

// Recent activity data
const recentActivity = [
  { id: 1, activity: 'New booking created for Golden Triangle Tour', time: '10 minutes ago' },
  { id: 2, activity: 'Payment received from customer #1089', time: '35 minutes ago' },
  { id: 3, activity: 'Lead #245 converted to customer', time: '1 hour ago' },
  { id: 4, activity: 'Staff account created for Sanjay Gupta', time: '3 hours ago' },
  { id: 5, activity: 'New package "Spiritual Varanasi" created', time: '5 hours ago' },
];

// Available roles data
const availableRoles = [
  { id: 1, name: 'Sales Manager', description: 'Manage leads and sales processes' },
  { id: 2, name: 'Customer Service', description: 'Handle customer inquiries and support' },
  { id: 3, name: 'Guide Coordinator', description: 'Manage guides and tour assignments' },
  { id: 4, name: 'Accountant', description: 'Handle payments and financial reports' },
  { id: 5, name: 'Content Manager', description: 'Manage package descriptions and marketing content' },
  { id: 6, name: 'Administrator', description: 'Full system access and user management' },
];

// Admin Dashboard Component
export default function AdminDashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [staffData, setStaffData] = useState(initialStaffData);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showEditStaffModal, setShowEditStaffModal] = useState(false);
  const [staffFormData, setStaffFormData] = useState({
    id: null,
    name: '',
    email: '',
    password: '',
    phone: '',
    role: '',
    status: 'Active'
  });
  const [editingStaffId, setEditingStaffId] = useState(null);

  // Handle add new staff
  const handleAddStaff = () => {
    setStaffFormData({
      id: null,
      name: '',
      email: '',
      password: '',
      phone: '',
      role: '',
      status: 'Active'
    });
    setShowAddStaffModal(true);
  };

  // Handle edit staff
  const handleEditStaff = (staffId) => {
    const staffToEdit = staffData.find(staff => staff.id === staffId);
    setEditingStaffId(staffId);
    setStaffFormData({
      ...staffToEdit,
      password: '' // Don't show existing password
    });
    setShowEditStaffModal(true);
  };

  // Handle delete staff
  const handleDeleteStaff = (staffId) => {
    setStaffData(staffData.filter(staff => staff.id !== staffId));
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStaffFormData({
      ...staffFormData,
      [name]: value
    });
  };

  // Submit new staff form
  const handleSubmitNewStaff = () => {
    const newStaff = {
      ...staffFormData,
      id: staffData.length + 1
    };
    setStaffData([...staffData, newStaff]);
    setShowAddStaffModal(false);
  };

  // Submit edit staff form
  const handleSubmitEditStaff = () => {
    setStaffData(staffData.map(staff => 
      staff.id === editingStaffId ? { ...staffFormData } : staff
    ));
    setShowEditStaffModal(false);
  };

  // Components for different sections
  const DashboardContent = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Revenue Overview */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Revenue Overview</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${value}`} />
              <Legend />
              <Line type="monotone" dataKey="amount" stroke="#FF9933" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Lead Status */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Lead Status</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={leadData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                dataKey="value"
                nameKey="name"
              >
                {leadData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} leads`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Top Packages */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Top Packages</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bookingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `${value} bookings`} />
              <Legend />
              <Bar dataKey="count" fill="#FF9933" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="col-span-1 lg:col-span-3 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <ul className="divide-y divide-gray-200">
          {recentActivity.map((activity) => (
            <li key={activity.id} className="py-3">
              <div className="flex justify-between">
                <p>{activity.activity}</p>
                <p className="text-gray-500 text-sm">{activity.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
  
  const StaffManagementContent = () => (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Staff Management</h2>
        <button
          onClick={handleAddStaff}
          className="bg-orange-500 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-orange-600"
        >
          <UserPlus size={18} />
          <span>Add Staff</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {staffData.map((staff) => (
              <tr key={staff.id}>
                <td className="px-6 py-4 whitespace-nowrap">{staff.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{staff.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{staff.role}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${staff.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {staff.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEditStaff(staff.id)}
                    className="text-orange-500 hover:text-orange-700 mr-3"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteStaff(staff.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Staff Modal */}
      {showAddStaffModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Add New Staff</h3>
              <button onClick={() => setShowAddStaffModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Full Name
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="name"
                  type="text"
                  name="name"
                  value={staffFormData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  type="email"
                  name="email"
                  value={staffFormData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  name="password"
                  value={staffFormData.password}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                  Phone
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="phone"
                  type="text"
                  name="phone"
                  value={staffFormData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                  Role
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="role"
                  name="role"
                  value={staffFormData.role}
                  onChange={handleInputChange}
                >
                  <option value="">Select a role</option>
                  {availableRoles.map(role => (
                    <option key={role.id} value={role.name}>{role.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                  Status
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="status"
                  name="status"
                  value={staffFormData.status}
                  onChange={handleInputChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowAddStaffModal(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md mr-2 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitNewStaff}
                  className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Staff Modal */}
      {showEditStaffModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Edit Staff</h3>
              <button onClick={() => setShowEditStaffModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-name">
                  Full Name
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="edit-name"
                  type="text"
                  name="name"
                  value={staffFormData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-email">
                  Email
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="edit-email"
                  type="email"
                  name="email"
                  value={staffFormData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-password">
                  Password (Leave blank to keep unchanged)
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="edit-password"
                  type="password"
                  name="password"
                  value={staffFormData.password}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-phone">
                  Phone
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="edit-phone"
                  type="text"
                  name="phone"
                  value={staffFormData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-role">
                  Role
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="edit-role"
                  name="role"
                  value={staffFormData.role}
                  onChange={handleInputChange}
                >
                  <option value="">Select a role</option>
                  {availableRoles.map(role => (
                    <option key={role.id} value={role.name}>{role.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-status">
                  Status
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="edit-status"
                  name="status"
                  value={staffFormData.status}
                  onChange={handleInputChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowEditStaffModal(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md mr-2 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitEditStaff}
                  className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-orange-600 text-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
             <img src="/blacklogo.png" alt="Logo" width="50" height="50" />



              <h1 className="text-xl font-bold">TheHindutourism CRM</h1>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold">Admin User</p>
                <p className="text-sm text-orange-200">admin@hindutourism.com</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-orange-700 flex items-center justify-center">
                <span className="font-bold">A</span>
              </div>
            </div>
            <button
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className={`bg-white w-64 shadow-md fixed inset-y-0 left-0 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out z-10 pt-16`}>
          <div className="h-full overflow-y-auto">
            <nav className="px-4 py-4">
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`flex items-center gap-3 px-4 py-3 w-full rounded-md transition-colors ${activeTab === 'dashboard' ? 'bg-orange-100 text-orange-700' : 'hover:bg-gray-100'}`}
                  >
                    <Users size={20} />
                    <span>Dashboard</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('staff')}
                    className={`flex items-center gap-3 px-4 py-3 w-full rounded-md transition-colors ${activeTab === 'staff' ? 'bg-orange-100 text-orange-700' : 'hover:bg-gray-100'}`}
                  >
                    <Users size={20} />
                    <span>Staff Management</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('leads')}
                    className={`flex items-center gap-3 px-4 py-3 w-full rounded-md transition-colors ${activeTab === 'leads' ? 'bg-orange-100 text-orange-700' : 'hover:bg-gray-100'}`}
                  >
                    <Inbox size={20} />
                    <span>Leads</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className={`flex items-center gap-3 px-4 py-3 w-full rounded-md transition-colors ${activeTab === 'bookings' ? 'bg-orange-100 text-orange-700' : 'hover:bg-gray-100'}`}
                  >
                    <Calendar size={20} />
                    <span>Bookings</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('packages')}
                    className={`flex items-center gap-3 px-4 py-3 w-full rounded-md transition-colors ${activeTab === 'packages' ? 'bg-orange-100 text-orange-700' : 'hover:bg-gray-100'}`}
                  >
                    <Package size={20} />
                    <span>Packages</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('payments')}
                    className={`flex items-center gap-3 px-4 py-3 w-full rounded-md transition-colors ${activeTab === 'payments' ? 'bg-orange-100 text-orange-700' : 'hover:bg-gray-100'}`}
                  >
                    <CreditCard size={20} />
                    <span>Payments</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`flex items-center gap-3 px-4 py-3 w-full rounded-md transition-colors ${activeTab === 'settings' ? 'bg-orange-100 text-orange-700' : 'hover:bg-gray-100'}`}
                  >
                    <Settings size={20} />
                    <span>Settings</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:ml-50">
          <div className="container mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-orange-800">
                {activeTab === 'dashboard' && 'Admin Dashboard'}
                {activeTab === 'staff' && 'Staff Management'}
                {activeTab === 'leads' && 'Lead Management'}
                {activeTab === 'bookings' && 'Booking Management'}
                {activeTab === 'packages' && 'Package Management'}
                {activeTab === 'payments' && 'Payment Management'}
                {activeTab === 'settings' && 'System Settings'}
              </h1>
              <p className="text-gray-600">
                {activeTab === 'dashboard' && 'Overview of key metrics and recent activities'}
                {activeTab === 'staff' && 'Create and manage staff accounts'}
                {activeTab === 'leads' && 'Track and manage sales leads'}
                {activeTab === 'bookings' && 'View and manage bookings'}
                {activeTab === 'packages' && 'Create and edit tour packages'}
                {activeTab === 'payments' && 'Track payments and invoices'}
                {activeTab === 'settings' && 'Configure system settings'}
              </p>
            </div>

            {activeTab === 'dashboard' && <DashboardContent />}
            {activeTab === 'staff' && <StaffManagementContent />}
            {activeTab === 'leads' && <div className="bg-white p-6 rounded-lg shadow"><p>Lead Management Content</p></div>}
            {activeTab === 'bookings' && <div className="bg-white p-6 rounded-lg shadow"><p>Booking Management Content</p></div>}
            {activeTab === 'packages' && <div className="bg-white p-6 rounded-lg shadow"><p>Package Management Content</p></div>}
            {activeTab === 'payments' && <div className="bg-white p-6 rounded-lg shadow"><p>Payment Management Content</p></div>}
            {activeTab === 'settings' && <div className="bg-white p-6 rounded-lg shadow"><p>Settings Content</p></div>}
          </div>
        </main>
      </div>
    </div>
  );
}