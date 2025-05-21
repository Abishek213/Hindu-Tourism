// Leads.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LeadForm from '../../Components/Leads/LeadForm';
import LeadList from './LeadList'; // Adjust if the path is different
import { LeadProvider } from '../../context/LeadContext'; // Make sure this path is correct

// If you don't have a LeadList component yet, use this placeholder
const DefaultLeadList = () => (
  <div className="p-4 bg-white shadow rounded">
    <h2 className="text-xl font-semibold mb-4">All Leads List</h2>
    {/* Your lead list goes here */}
  </div>
);

// Use the actual LeadList component if available, otherwise use the placeholder
const LeadListComponent = typeof LeadList !== 'undefined' ? LeadList : DefaultLeadList;

const Leads = ({ defaultTab = 'all' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const location = useLocation();

  // Update the active tab based on the URL path
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/leads/add')) {
      setActiveTab('add');
    } else if (path.includes('/leads/all') || path.includes('/leads')) {
      setActiveTab('all');
    }
  }, [location.pathname]);

  // Handle tab change manually (for the dropdown)
  const handleTabChange = (e) => {
    setActiveTab(e.target.value);
  };

  // Check if LeadProvider exists
  const ProviderComponent = typeof LeadProvider !== 'undefined' ? LeadProvider : React.Fragment;

  return (
    <ProviderComponent>
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-6">
          <label htmlFor="leadTab" className="sr-only">Lead Tabs</label>
          <select
            id="leadTab"
            className="border rounded p-2"
            value={activeTab}
            onChange={handleTabChange}
          >
            <option value="all">All Leads</option>
            <option value="add">Add Lead</option>
          </select>
        </div>

        {activeTab === 'all' ? <LeadListComponent /> : <LeadForm />}
      </div>
    </ProviderComponent>
  );
};

export default Leads;