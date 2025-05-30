import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import api from '../../api/auth';

const sources = ['website', 'referral', 'social_media', 'walk_in', 'other'];
const statuses = ['new', 'contacted', 'qualified', 'lost', 'converted'];

const AdminLead = () => {
  const [leads, setLeads] = useState([]);
  const [displayedLeads, setDisplayedLeads] = useState([]);
  const [convertingLead, setConvertingLead] = useState(null);
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    source: '', 
    status: 'new', 
    notes: '' 
  });
  const [analytics, setAnalytics] = useState({ total: 0, converted: 0, conversionRate: 0 });

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await api.get('/lead');
        const allLeads = response.data;
        const unconvertedLeads = allLeads.filter(lead => lead.status !== 'converted');
        const convertedCount = allLeads.filter(lead => lead.status === 'converted').length;
        
        setLeads(allLeads);
        setDisplayedLeads(unconvertedLeads);
        setAnalytics({
          total: allLeads.length,
          converted: convertedCount,
          conversionRate: allLeads.length > 0 ? (convertedCount / allLeads.length * 100) : 0
        });
      } catch (error) {
        console.error('Failed to fetch leads:', error);
      }
    };
    fetchLeads();
  }, []);

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
      const newLead = response.data;
      
      setLeads(prev => [...prev, newLead]);
      setDisplayedLeads(prev => [...prev, newLead]);
      setAnalytics(prev => ({
        ...prev,
        total: prev.total + 1,
        conversionRate: prev.converted / (prev.total + 1) * 100
      }));
      
      alert('Lead added successfully');
      setForm({ name: '', email: '', phone: '', source: '', status: 'new', notes: '' });
    } catch (error) {
      alert('Failed to add lead: ' + (error.response?.data?.error || 'Server error'));
    }
  };

  const handleConvertLead = async (leadId) => {
    if (!window.confirm('Are you sure you want to convert this lead to customer?')) return;

    try {
      setConvertingLead(leadId);
      
      const response = await api.post(`/lead/${leadId}/convert`);
      const { message, customer } = response.data;

      setTimeout(() => {
        setDisplayedLeads(prev => prev.filter(lead => lead._id !== leadId));
        setLeads(prev => prev.map(lead => 
          lead._id === leadId ? { ...lead, status: 'converted' } : lead
        ));
        setAnalytics(prev => ({
          total: prev.total,
          converted: prev.converted + 1,
          conversionRate: (prev.converted + 1) / prev.total * 100
        }));
        setConvertingLead(null);
      }, 2000);

      alert(`${message}\nCustomer ID: ${customer.id}\nName: ${customer.name}`);
    } catch (error) {
      setConvertingLead(null);
      alert('Conversion failed: ' + (error.response?.data?.error || 'Server error'));
    }
  };

  return (
    <div style={{ padding: 16, display: 'grid', gap: 16 }}>
      <h2>🧭 Lead Management</h2>

      <section style={{ border: '1px solid #ccc', padding: 16, borderRadius: 8 }}>
        <h3>📊 Analytics</h3>
        <p>Total Leads: {analytics.total}</p>
        <p>Converted: {analytics.converted}</p>
        <p>Conversion Rate: {analytics.conversionRate.toFixed(2)}%</p>
      </section>

      <section style={{ border: '1px solid #ccc', padding: 16, borderRadius: 8 }}>
        <h3>Add / Edit Lead</h3>
        <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))' }}>
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={e => handleFormChange('name', e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={e => handleFormChange('email', e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Phone"
            value={form.phone}
            onChange={e => handleFormChange('phone', e.target.value)}
            required
          />
          <select
            value={form.source}
            onChange={e => handleFormChange('source', e.target.value)}
            required
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
        </div>
      </section>

      <section style={{ border: '1px solid #ccc', padding: 16, borderRadius: 8 }}>
        <h3>📋 Leads List ({displayedLeads.length})</h3>
        {displayedLeads.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666' }}>No unconverted leads to display</p>
        ) : (
          <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))' }}>
            {displayedLeads.map(lead => (
              <div 
                key={lead._id} 
                style={{ 
                  border: '1px solid #aaa', 
                  padding: 8, 
                  borderRadius: 6,
                  transition: 'all 0.5s ease',
                  opacity: convertingLead === lead._id ? 0 : 1,
                  transform: convertingLead === lead._id ? 'translateY(-20px)' : 'none'
                }}
              >
                <p><strong>{lead.name}</strong> ({lead.source})</p>
                <p>Status: {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}</p>
                <p>Email: {lead.email}</p>
                <p>Phone: {lead.phone}</p>
                <p>Agent: {lead.staff_id?.name || 'N/A'}</p>
                {lead.notes && <p>Notes: {lead.notes}</p>}
                
                <button 
                  onClick={() => handleConvertLead(lead._id)}
                  disabled={convertingLead === lead._id}
                  style={{ 
                    marginTop: 8,
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: 4,
                    cursor: 'pointer',
                    opacity: convertingLead === lead._id ? 0.5 : 1
                  }}
                >
                  {convertingLead === lead._id ? 'Converting...' : 'Convert to Customer'}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminLead;