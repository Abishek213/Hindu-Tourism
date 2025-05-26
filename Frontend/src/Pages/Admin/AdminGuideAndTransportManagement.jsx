import { useState, useEffect } from 'react';
import { UserPlus, Edit, Trash2, X, Bus } from 'lucide-react';
import api from '../../api/auth'; // Adjust API import path
import { toast } from 'react-toastify';

export default function AdminGuideAndTransportManagement() {
  const [guides, setGuides] = useState([]);
  const [transports, setTransports] = useState([]);

  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showTransportModal, setShowTransportModal] = useState(false);
  const [editingGuide, setEditingGuide] = useState(false);
  const [editingTransport, setEditingTransport] = useState(false);

  const [guideForm, setGuideForm] = useState({
    id: null,
    name: '',
    email: '',
    phone: '',
    details: '',
    status: 'Active',
  });

  const [transportForm, setTransportForm] = useState({
    id: null,
    vehicle_number: '',
    driver_name: '',
    contact: '',
    capacity: '',
    status: 'Active',
  });

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const guideRes = await api.get('/guides');
        const transportRes = await api.get('/transports');

        setGuides(guideRes.data.guides.map(g => ({
          id: g._id,
          name: g.name,
          email: g.email,
          phone: g.phone,
          details: g.details,
          status: g.is_active ? 'Active' : 'Inactive',
        })));

        setTransports(transportRes.data.transports.map(t => ({
          id: t._id,
          vehicle_number: t.vehicle_number,
          driver_name: t.driver_name,
          contact: t.contact,
          capacity: t.capacity,
          status: t.is_active ? 'Active' : 'Inactive',
        })));
      } catch (error) {
        toast.error('Failed to fetch data');
      }
    };

    fetchData();
  }, []);

  // Handlers
  const handleGuideChange = e => setGuideForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleTransportChange = e => setTransportForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const openAddGuide = () => {
    setGuideForm({ id: null, name: '', email: '', phone: '', details: '', status: 'Active' });
    setEditingGuide(false);
    setShowGuideModal(true);
  };

  const openEditGuide = guide => {
    setGuideForm({ ...guide });
    setEditingGuide(true);
    setShowGuideModal(true);
  };

  const openAddTransport = () => {
    setTransportForm({ id: null, vehicle_number: '', driver_name: '', contact: '', capacity: '', status: 'Active' });
    setEditingTransport(false);
    setShowTransportModal(true);
  };

  const openEditTransport = transport => {
    setTransportForm({ ...transport });
    setEditingTransport(true);
    setShowTransportModal(true);
  };

  const handleGuideSubmit = async () => {
    const payload = {
      name: guideForm.name,
      email: guideForm.email,
      phone: guideForm.phone,
      details: guideForm.details,
      is_active: guideForm.status === 'Active',
    };

    try {
      if (editingGuide) {
        const res = await api.put(`/guides/${guideForm.id}`, payload);
        setGuides(prev => prev.map(g => g.id === guideForm.id ? {
          ...res.data,
          id: res.data._id,
          status: res.data.is_active ? 'Active' : 'Inactive',
        } : g));
        toast.success('Guide updated');
      } else {
        const res = await api.post('/guides', payload);
        setGuides(prev => [...prev, {
          ...res.data,
          id: res.data._id,
          status: 'Active',
        }]);
        toast.success('Guide added');
      }
      setShowGuideModal(false);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Operation failed');
    }
  };

  const handleTransportSubmit = async () => {
    const payload = {
      vehicle_number: transportForm.vehicle_number,
      driver_name: transportForm.driver_name,
      contact: transportForm.contact,
      capacity: transportForm.capacity,
      is_active: transportForm.status === 'Active',
    };

    try {
      if (editingTransport) {
        const res = await api.put(`/transports/${transportForm.id}`, payload);
        setTransports(prev => prev.map(t => t.id === transportForm.id ? {
          ...res.data,
          id: res.data._id,
          status: res.data.is_active ? 'Active' : 'Inactive',
        } : t));
        toast.success('Transport updated');
      } else {
        const res = await api.post('/transports', payload);
        setTransports(prev => [...prev, {
          ...res.data,
          id: res.data._id,
          status: 'Active',
        }]);
        toast.success('Transport added');
      }
      setShowTransportModal(false);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Operation failed');
    }
  };

  const deactivateGuide = async id => {
    try {
      await api.delete(`/guides/${id}`);
      setGuides(prev => prev.map(g => g.id === id ? { ...g, status: 'Inactive' } : g));
      toast.success('Guide deactivated');
    } catch (err) {
      toast.error('Failed to deactivate guide');
    }
  };

  const deactivateTransport = async id => {
    try {
      await api.delete(`/transports/${id}`);
      setTransports(prev => prev.map(t => t.id === id ? { ...t, status: 'Inactive' } : t));
      toast.success('Transport deactivated');
    } catch (err) {
      toast.error('Failed to deactivate transport');
    }
  };

  // Reusable Modal
  const Modal = ({ title, children, onClose, onSubmit, editing }) => (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><X size={24} /></button>
        </div>
        {children}
        <div className="mt-6 flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button>
          <button onClick={onSubmit} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            {editing ? 'Save Changes' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      {/* Guide Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Guide Management</h1>
        <button onClick={openAddGuide} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center">
          <UserPlus size={18} className="mr-2" /> Add Guide
        </button>
      </div>

      {/* Guide Table */}
      <table className="w-full mb-10 border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Phone</th>
            <th className="p-3 text-left">Details</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {guides.map(g => (
            <tr key={g.id} className="border-t">
              <td className="p-3">{g.name}</td>
              <td className="p-3">{g.email}</td>
              <td className="p-3">{g.phone}</td>
              <td className="p-3">{g.details}</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded-full text-xs ${g.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {g.status}
                </span>
              </td>
              <td className="p-3 flex space-x-2">
                <button onClick={() => openEditGuide(g)} className="text-blue-600 hover:text-blue-800"><Edit size={18} /></button>
                <button onClick={() => deactivateGuide(g.id)} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Transport Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Transport Management</h1>
        <button onClick={openAddTransport} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center">
          <Bus size={18} className="mr-2" /> Add Transport
        </button>
      </div>

      {/* Transport Table */}
      <table className="w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Vehicle</th>
            <th className="p-3 text-left">Driver</th>
            <th className="p-3 text-left">Contact</th>
            <th className="p-3 text-left">Capacity</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transports.map(t => (
            <tr key={t.id} className="border-t">
              <td className="p-3">{t.vehicle_number}</td>
              <td className="p-3">{t.driver_name}</td>
              <td className="p-3">{t.contact}</td>
              <td className="p-3">{t.capacity}</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded-full text-xs ${t.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {t.status}
                </span>
              </td>
              <td className="p-3 flex space-x-2">
                <button onClick={() => openEditTransport(t)} className="text-blue-600 hover:text-blue-800"><Edit size={18} /></button>
                <button onClick={() => deactivateTransport(t.id)} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modals */}
      {showGuideModal && (
        <Modal
          title={editingGuide ? 'Edit Guide' : 'Add Guide'}
          onClose={() => setShowGuideModal(false)}
          onSubmit={handleGuideSubmit}
          editing={editingGuide}
        >
          <div className="space-y-3">
            <input name="name" value={guideForm.name} onChange={handleGuideChange} placeholder="Name" className="w-full border p-2 rounded" />
            <input name="email" value={guideForm.email} onChange={handleGuideChange} placeholder="Email" className="w-full border p-2 rounded" />
            <input name="phone" value={guideForm.phone} onChange={handleGuideChange} placeholder="Phone" className="w-full border p-2 rounded" />
            <textarea name="details" value={guideForm.details} onChange={handleGuideChange} placeholder="Details" className="w-full border p-2 rounded" />
            <select name="status" value={guideForm.status} onChange={handleGuideChange} className="w-full border p-2 rounded">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </Modal>
      )}

      {showTransportModal && (
        <Modal
          title={editingTransport ? 'Edit Transport' : 'Add Transport'}
          onClose={() => setShowTransportModal(false)}
          onSubmit={handleTransportSubmit}
          editing={editingTransport}
        >
          <div className="space-y-3">
            <input name="vehicle_number" value={transportForm.vehicle_number} onChange={handleTransportChange} placeholder="Vehicle Number" className="w-full border p-2 rounded" />
            <input name="driver_name" value={transportForm.driver_name} onChange={handleTransportChange} placeholder="Driver Name" className="w-full border p-2 rounded" />
            <input name="contact" value={transportForm.contact} onChange={handleTransportChange} placeholder="Contact" className="w-full border p-2 rounded" />
            <input name="capacity" value={transportForm.capacity} onChange={handleTransportChange} placeholder="Capacity" className="w-full border p-2 rounded" />
            <select name="status" value={transportForm.status} onChange={handleTransportChange} className="w-full border p-2 rounded">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </Modal>
      )}
    </div>
  );
}
