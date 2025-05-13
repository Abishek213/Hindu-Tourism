import React from 'react';
import LeadForm from '@components/Leads/LeadForm';


const AddLeadPage = () => {
  const handleNewLead = (leadData) => {
    console.log('New lead submitted:', leadData);
    // TODO: Send data to API or backend
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Add New Lead</h2>
      <LeadForm onSubmit={handleNewLead} />
    </div>
  );
};

export default AddLeadPage;
