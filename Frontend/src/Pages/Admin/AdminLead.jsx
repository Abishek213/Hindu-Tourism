import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const sampleLeads = [
  { id: 1, name: 'John Doe', source: 'Website', status: 'New', date: new Date(), agent: 'Agent A' },
  { id: 2, name: 'Jane Smith', source: 'WhatsApp', status: 'Interested', date: new Date(), agent: 'Agent B' },
];

const sources = ['Website', 'WhatsApp', 'Phone Call', 'Email'];
const statuses = ['New', 'Contacted', 'Interested', 'Booked', 'Rejected'];

const AdminLead = () => {
  const [leads, setLeads] = useState(sampleLeads);
  const [form, setForm] = useState({ name: '', source: '', agent: '', status: 'New', date: new Date().toISOString().substring(0, 10) }); // yyyy-MM-dd for input type=date
  const [showCalendar, setShowCalendar] = useState(false);
  const [analytics, setAnalytics] = useState({ total: 0, conversion: 0 });

  useEffect(() => {
    const booked = leads.filter(l => l.status === 'Booked').length;
    setAnalytics({
      total: leads.length,
      conversion: leads.length ? ((booked / leads.length) * 100).toFixed(2) : 0
    });
  }, [leads]);

  const handleFormChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleAddLead = () => {
    if (!form.name || !form.source || !form.agent) {
      alert('Please fill in all fields');
      return;
    }
    const newLead = { 
      ...form, 
      id: leads.length ? leads[leads.length - 1].id + 1 : 1,
      date: new Date(form.date),
    };
    setLeads([...leads, newLead]);
    alert(`Lead added. Follow-up set for ${format(newLead.date, 'PPP')}`);
    setForm({ name: '', source: '', agent: '', status: 'New', date: new Date().toISOString().substring(0, 10) });
    setShowCalendar(false);
  };

  const handleCSVImport = e => {
    // Simulated import for demo
    alert('CSV imported: 5 leads imported successfully');
  };

  return (
    <div style={{ padding: 16, display: 'grid', gap: 16 }}>
      <h2>🧭 Lead Management</h2>

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
            type="text"
            placeholder="Agent"
            value={form.agent}
            onChange={e => handleFormChange('agent', e.target.value)}
          />
          <select
            value={form.source}
            onChange={e => handleFormChange('source', e.target.value)}
          >
            <option value="">Select Source</option>
            {sources.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            value={form.status}
            onChange={e => handleFormChange('status', e.target.value)}
          >
            {statuses.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div style={{ marginTop: 8 }}>
          <button onClick={() => setShowCalendar(prev => !prev)}>📅 Set Follow-Up Date</button>
          {showCalendar && (
            <input
              type="date"
              value={form.date}
              onChange={e => handleFormChange('date', e.target.value)}
              style={{ marginLeft: 8 }}
            />
          )}
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
        <h3>📋 Leads Calendar</h3>
        <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))' }}>
          {leads.map(lead => (
            <div key={lead.id} style={{ border: '1px solid #aaa', padding: 8, borderRadius: 6 }}>
              <p><strong>{lead.name}</strong> ({lead.source})</p>
              <p>Status: {lead.status}</p>
              <p>Follow-Up: {format(lead.date, 'PPP')}</p>
              <p>Agent: {lead.agent}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ border: '1px solid #ccc', padding: 16, borderRadius: 8 }}>
        <h3>📊 Analytics</h3>
        <p>Total Leads: {analytics.total}</p>
        <p>Conversion Rate: {analytics.conversion}%</p>
      </section>

      <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
        <button onClick={() => alert('🔔 Reminder sent via email!')}>
          Send Email Reminder 🔔
        </button>
        <button onClick={() => alert('🔔 Local reminder triggered')}>
          Trigger Local Alert 🔔
        </button>
      </div>
    </div>
  );
};

export default AdminLead;
