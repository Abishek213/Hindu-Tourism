import { useState, useEffect } from 'react';
import { UserPlus, Edit, Trash2, X } from 'lucide-react';
import api from '../../api/auth';
import { toast } from 'react-toastify';

const availableRoles = [
  { id: 1, name: 'Admin' },
  { id: 2, name: 'Sales Agent' },
  { id: 3, name: 'Operation Team' },
  { id: 4, name: 'Accountant' },
];

export default function AdminStaffManagement() {
  const [staffData, setStaffData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    email: '',
    username: '',
    password: '',
    phone: '',
    role: '',
    status: 'Active',
  });


  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await api.get('/staff', {
        params: { role: selectedRole || undefined }
      });
        const staff = response.data.staff.map(s => ({
          id: s._id,
          name: s.name,
          email: s.email,
          role: s.role_id?.role_name || 'No Role',
          status: s.is_active ? 'Active' : 'Inactive',
        }));
        setStaffData(staff);
      } catch (error) {
        toast.error('Failed to fetch staff');
      }
    };
    fetchStaff();
  }, [selectedRole]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const openAddModal = () => {
    setFormData({
      id: null,
      name: '',
      email: '',
      username: '',
      password: '',
      phone: '',
      role: '',
      status: 'Active',
    });
    setEditing(false);
    setShowModal(true);
  };

  const openEditModal = (staff) => {
    setFormData({ ...staff, password: '' });
    setEditing(true);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        username: formData.username,
        phone: formData.phone,
        role: formData.role,
        is_active: formData.status === 'Active',
      };
      if (formData.password) payload.password = formData.password;

      let updatedStaff;
      if (editing) {
        const response = await api.put(`/staff/${formData.id}`, payload);
        updatedStaff = {
          ...response.data,
          id: response.data._id,
          role: response.data.role_id?.role_name,
          status: response.data.is_active ? 'Active' : 'Inactive',
        };
        setStaffData(prev => prev.map(s => s.id === formData.id ? updatedStaff : s));
      } else {
        const response = await api.post('/staff', payload);
        updatedStaff = {
          ...response.data,
          id: response.data._id,
          role: response.data.role_id?.role_name,
          status: 'Active',
        };
        setStaffData(prev => [...prev, updatedStaff]);
      }
      setShowModal(false);
      toast.success(`Staff ${editing ? 'updated' : 'added'}`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/staff/${id}`);
      setStaffData(prev => prev.map(s => 
        s.id === id ? { ...s, status: 'Inactive' } : s
      ));
      toast.success('Staff deactivated');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Deactivation failed');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Staff Management</h1>
        <button
          onClick={openAddModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <UserPlus size={18} className="mr-2" />
          Add Staff
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left text-sm font-semibold">Name</th>
              <th className="p-3 text-left text-sm font-semibold">Email</th>
              <th className="p-3 text-left text-sm font-semibold">
      <select
        value={selectedRole}
        onChange={(e) => setSelectedRole(e.target.value)}
        className="p-1 border rounded focus:ring-2 focus:ring-blue-500 bg-transparent"
      >
        <option value="">Role</option>
        {availableRoles.map((role) => (
          <option key={role.id} value={role.name}>{role.name}</option>
        ))}
      </select>
    </th>
              <th className="p-3 text-left text-sm font-semibold">Status</th>
              <th className="p-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffData.map((staff) => (
              <tr key={staff.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{staff.name}</td>
                <td className="p-3">{staff.email}</td>
                <td className="p-3">{staff.role}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      staff.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {staff.status}
                  </span>
                </td>
                <td className="p-3 flex space-x-2">
                  <button
                    onClick={() => openEditModal(staff)}
                    className="text-blue-600 hover:text-blue-800 p-1 rounded"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(staff.id)}
                    className="text-red-600 hover:text-red-800 p-1 rounded"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {staffData.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            No staff members found
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editing ? 'Edit Staff' : 'Add New Staff'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Role</option>
                {availableRoles.map((role) => (
                  <option key={role.id} value={role.name}>
                    {role.name}
                  </option>
                ))}
              </select>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                minLength="6"
                required={!editing}
              />
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {editing ? 'Save Changes' : 'Create Staff'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}