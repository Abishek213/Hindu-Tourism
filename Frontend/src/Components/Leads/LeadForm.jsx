// src/components/LeadForm/index.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientInfoForm from './ClientInfo';
import TravelDetailsForm from './TravelDetail';
import LeadManagementForm from './LeadManagement';
import NotesSection from './Notes';

export default function LeadForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    nationality: '',
    phone: '',
    destination: '',
    packageType: '',
    numPeople: 1,
    transport: '',
    source: 'website',
    assignedTo: '',
    status: 'new',
    followUpDate: '',
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [showFollowUpFields, setShowFollowUpFields] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // If status changes to anything other than 'new', show follow-up fields
    if (name === 'status' && value !== 'new') {
      setShowFollowUpFields(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Here you would typically send the data to your backend
    console.log('Submitting lead data:', form);
    
    // Get existing leads from localStorage or initialize empty array
    const existingLeads = JSON.parse(localStorage.getItem('leads') || '[]');
    
    // Add the new lead with a unique ID and timestamp
    const newLead = {
      ...form,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    // Add to list and save back to localStorage
    existingLeads.push(newLead);
    localStorage.setItem('leads', JSON.stringify(existingLeads));
    
    // Set submitted to true
    setSubmitted(true);
    
    // Navigate to lead list page after a short delay
    setTimeout(() => {
      navigate('/leads');
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-orange-600 mb-6 text-center">
        New Lead Registration
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Three-column layout for larger screens, two for medium, one for small */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Client Information Column */}
          <ClientInfoForm 
            form={form} 
            handleChange={handleChange} 
          />
          
          {/* Travel Details Column */}
          <TravelDetailsForm 
            form={form} 
            handleChange={handleChange} 
          />
          
          {/* Lead Management Column */}
          <LeadManagementForm 
            form={form} 
            handleChange={handleChange}
            showFollowUpFields={showFollowUpFields}
          />
        </div>
        
        {/* Notes section - full width */}
        <NotesSection 
          notes={form.notes} 
          handleChange={handleChange} 
        />
        
        {/* Submit button */}
        <div className="flex justify-center mt-6">
          <button 
            type="submit" 
            className="py-2 px-6 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-md shadow-md transition duration-300 ease-in-out flex items-center"
          >
            Submit Lead
          </button>
        </div>
      </form>
      
      {/* Status indicator */}
      {submitted && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-700 text-center">
            Lead successfully submitted! Redirecting to leads list...
          </p>
        </div>
      )}
    </div>
  );
}