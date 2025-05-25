import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import api from '../../api/auth';

const sources = ['website', 'referral', 'social_media', 'walk_in', 'other'];
const statuses = ['new', 'contacted', 'qualified', 'lost', 'converted'];

const AdminLead = () => {
  const [leads, setLeads] = useState([]);
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    source: '', 
    status: 'new', 
    notes: '' 
  });
  const [analytics, setAnalytics] = useState({ total: 0, conversion: 0 });

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await api.get('/lead');
        setLeads(response.data);
      } catch (error) {
        console.error('Failed to fetch leads:', error);
      }
    };
    fetchLeads();
  }, []);

  useEffect(() => {
    const converted = leads.filter(l => l.status === 'converted').length;
    setAnalytics({
      total: leads.length,
      conversion: leads.length ? ((converted / leads.length) * 100).toFixed(2) : 0
    });
  }, [leads]);

  const handleFormChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleAddLead = async () => {
    if (!form.name || !form.email || !form.phone || !form.source) {
      alert('Please fill in all required fields');
      return;
    }
    try {
      const response = await api.post('/lead', {
        ...form,
        staff_id: localStorage.getItem('userId')
      });
      setLeads([...leads, response.data]);
      alert('Lead added successfully');
      setForm({ name: '', email: '', phone: '', source: '', status: 'new', notes: '' });
    } catch (error) {
      alert('Failed to add lead: ' + (error.response?.data?.error || 'Server error'));
    }
  };

  const handleConvertLead = async (leadId) => {
    if (!window.confirm('Are you sure you want to convert this lead to customer?')) return;

    try {
      const response = await api.post(`/lead/${leadId}/convert`);
      const { message, customer } = response.data;

      setLeads(prev => prev.map(lead => 
        lead._id === leadId ? { ...lead, status: 'converted' } : lead
      ));

      alert(`${message}\nCustomer ID: ${customer.id}\nName: ${customer.name}`);
    } catch (error) {
      alert('Conversion failed: ' + (error.response?.data?.error || 'Server error'));
    }
  };

  const handleCSVImport = e => {
    alert('CSV imported: 5 leads imported successfully');
  };

  return (
    <div style={{ padding: 16, display: 'grid', gap: 16 }}>
      <h2>🧭 Lead Management</h2>

      <section style={{ border: '1px solid #ccc', padding: 16, borderRadius: 8 }}>
        <h3>📊 Analytics</h3>
        <p>Total Leads: {analytics.total}</p>
        <p>Conversion Rate: {analytics.conversion}%</p>
      </section>

      <section style={{ border: '1px solid #ccc', padding: 16, borderRadius: 8 }}>
        <h3>Add / Edit Lead</h3>
        <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))' }}>
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={e => handleFormChange('name', e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={e => handleFormChange('email', e.target.value)}
          />
          <input
            type="tel"
            placeholder="Phone"
            value={form.phone}
            onChange={e => handleFormChange('phone', e.target.value)}
          />
          <select
            value={form.source}
            onChange={e => handleFormChange('source', e.target.value)}
          >
            <option value="">Select Source</option>
            {sources.map(s => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <select
            value={form.status}
            onChange={e => handleFormChange('status', e.target.value)}
          >
            {statuses.map(s => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <textarea
            placeholder="Notes"
            value={form.notes}
            onChange={e => handleFormChange('notes', e.target.value)}
            style={{ gridColumn: '1 / -1' }}
          />
        </div>

        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={handleAddLead}>Add Lead</button>

          <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            📤
            <input
              type="file"
              accept=".csv"
              style={{ display: 'none' }}
              onChange={handleCSVImport}
            />
            Import CSV
          </label>
        </div>
      </section>

      <section style={{ border: '1px solid #ccc', padding: 16, borderRadius: 8 }}>
        <h3>📋 Leads List</h3>
        <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))' }}>
          {leads.map(lead => (
            <div key={lead._id} style={{ border: '1px solid #aaa', padding: 8, borderRadius: 6 }}>
              <p><strong>{lead.name}</strong> ({lead.source})</p>
              <p>Status: {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}</p>
              <p>Email: {lead.email}</p>
              <p>Phone: {lead.phone}</p>
              <p>Agent: {lead.staff_id?.name || 'N/A'}</p>
              {lead.notes && <p>Notes: {lead.notes}</p>}
              
              {lead.status !== 'converted' ? (
                <button 
                  onClick={() => handleConvertLead(lead._id)}
                  style={{ 
                    marginTop: 8,
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: 4,
                    cursor: 'pointer'
                  }}
                >
                  Convert to Customer
                </button>
              ) : (
                <p style={{ color: 'green', marginTop: 8 }}>✓ Converted to Customer</p>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default AdminLead;
// i only want to see the lead that are left to be converted so after being converted make it disiper in 2 sec animation after that dont get displayed in nxt reload  make sure u provide me full code with no functionality lost