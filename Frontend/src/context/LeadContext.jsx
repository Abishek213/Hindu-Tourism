// LeadContext.jsx
import React, { createContext, useContext, useState } from 'react';

// Create context
const LeadContext = createContext();

// Create a custom hook to use the lead context
export const useLeads = () => {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error('useLeads must be used within a LeadProvider');
  }
  return context;
};

// Create provider component
export const LeadProvider = ({ children }) => {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Add a new lead
  const addLead = async (leadData) => {
    setIsLoading(true);
    try {
      // Here you would make an API call to add the lead
      // For now, we'll just simulate adding to the state
      setLeads((prevLeads) => [...prevLeads, { id: Date.now(), ...leadData }]);
      setError(null);
      return true;
    } catch (err) {
      setError(err.message || 'Failed to add lead');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch leads (for the listing page)
  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      // Here you would make an API call to fetch leads
      // For now, we'll just use what's in state
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch leads');
    } finally {
      setIsLoading(false);
    }
  };

  // Value to be provided to the context consumers
  const value = {
    leads,
    isLoading,
    error,
    addLead,
    fetchLeads
  };

  return <LeadContext.Provider value={value}>{children}</LeadContext.Provider>;
};