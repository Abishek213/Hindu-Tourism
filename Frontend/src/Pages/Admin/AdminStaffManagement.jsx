import { useState } from 'react';
import { UserPlus, Edit, Trash2, X } from 'lucide-react';

// Available roles
const availableRoles = [
  { id: 1, name: 'Sales Manager' },
  { id: 2, name: 'Customer Service' },
  { id: 3, name: 'Guide Coordinator' },
  { id: 4, name: 'Accountant' },
  { id: 5, name: 'Content Manager' },
  { id: 6, name: 'Administrator' },
];

// Initial staff data
const initialStaffData = [
  { id: 1, name: 'Rajiv Sharma', email: 'rajiv@tourism.com', role: 'Sales Manager', status: 'Active' },
  { id: 2, name: 'Priya Patel', email: 'priya@tourism.com', role: 'Customer Service', status: 'Active' },
  { id: 3, name: 'Amit Singh', email: 'amit@tourism.com', role: 'Guide Coordinator', status: 'Inactive' },
];

export default function AdminStaffManagement() {
  const [staffData, setStaffData] = useState(initialStaffData);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    email: '',
    password: '',
    phone: '',
    role: '',
    status: 'Active',
  });

  // Handle form input
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Open Add Modal
  const openAddModal = () => {
    setFormData({
      id: null,
      name: '',
      email: '',
      password: '',
      phone: '',
      role: '',
      status: 'Active',
    });
    setEditing(false);
    setShowModal(true);
  };

  // Open Edit Modal
  const openEditModal = (staff) => {
    setFormData({ ...staff, password: '' });
    setEditing(true);
    setShowModal(true);
  };

  // Add or Update Staff
  const handleSubmit = () => {
    if (editing) {
      setStaffData(prev => prev.map(staff => (staff.id === formData.id ? formData : staff)));
    } else {
      const newStaff = { ...formData, id: staffData.length + 1 };
      setStaffData(prev => [...prev, newStaff]);
    }
    setShowModal(false);
  };

  // Delete Staff
  const handleDelete = (id) => {
    setStaffData(prev => prev.filter(staff => staff.id !== id));
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Staff Management</h2>
        <button
          onClick={openAddModal}
          className="bg-orange-500 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-orange-600"
        >
          <UserPlus size={18} />
          Add Staff
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {staffData.map((staff) => (
              <tr key={staff.id}>
                <td className="px-4 py-2">{staff.name}</td>
                <td className="px-4 py-2">{staff.email}</td>
                <td className="px-4 py-2">{staff.role}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 text-xs rounded-full font-semibold ${staff.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {staff.status}
                  </span>
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <button onClick={() => openEditModal(staff)} className="text-orange-500 hover:text-orange-700">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(staff.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button onClick={() => setShowModal(false)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
            <h3 className="text-lg font-semibold mb-4">{editing ? 'Edit Staff' : 'Add Staff'}</h3>
            <div className="space-y-3">
              <input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="w-full p-2 border rounded" />
              <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" type="email" className="w-full p-2 border rounded" />
              <input name="password" value={formData.password} onChange={handleChange} placeholder="Password" type="password" className="w-full p-2 border rounded" />
              <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="w-full p-2 border rounded" />
              <select name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border rounded">
                <option value="">Select Role</option>
                {availableRoles.map(role => (
                  <option key={role.id} value={role.name}>{role.name}</option>
                ))}
              </select>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <button onClick={handleSubmit} className="bg-orange-500 w-full py-2 text-white rounded hover:bg-orange-600">
                {editing ? 'Update Staff' : 'Add Staff'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
