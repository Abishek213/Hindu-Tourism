import { useState, useEffect } from 'react';
import { Tag, Bell } from 'lucide-react';

export default function LeadManagementForm({ form, handleChange, showFollowUpFields }) {
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    // Mock staff data - this would come from an API in a real application
    setStaff([
      { id: '1', name: 'Ankit Sharma' },
      { id: '2', name: 'Priya Patel' },
      { id: '3', name: 'Rajesh Kumar' },
      { id: '4', name: 'Meera Singh' }
    ]);
  }, []);

  // Source options
  const sources = [
    { value: "website", label: "Website Form" },
    { value: "whatsapp", label: "WhatsApp" },
    { value: "phone", label: "Phone Call" },
    { value: "email", label: "Email" },
    { value: "walk_in", label: "Walk-in" },
    { value: "referral", label: "Referral" },
    { value: "social_media", label: "Social Media" },
    { value: "other", label: "Other" }
  ];

  // Status options
  const statusOptions = [
    { value: "new", label: "New" },
    { value: "contacted", label: "Contacted" },
    { value: "interested", label: "Interested" },
    { value: "booked", label: "Booked" },
    { value: "rejected", label: "Rejected/Not Interested" }
  ];

  return (
    <div className="space-y-4 lg:col-span-1">
      <h3 className="flex items-center gap-2 font-semibold text-gray-700">
        <Tag className="w-5 h-5 text-orange-500" />
        Lead Management
      </h3>
      
      <div>
        <label htmlFor="source" className="block text-sm font-medium text-gray-700">
          Lead Source*
        </label>
        <select
          id="source"
          name="source"
          required
          value={form.source}
          onChange={handleChange}
          className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
        >
          {sources.map((source) => (
            <option key={source.value} value={source.value}>
              {source.label}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700">
          Assign To*
        </label>
        <select
          id="assignedTo"
          name="assignedTo"
          required
          value={form.assignedTo}
          onChange={handleChange}
          className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
        >
          <option value="">Select Staff</option>
          {staff.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Status*
        </label>
        <select
          id="status"
          name="status"
          required
          value={form.status}
          onChange={handleChange}
          className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
        >
          {statusOptions.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>
      
      {showFollowUpFields && (
        <div>
          <label htmlFor="followUpDate" className="block text-sm font-medium text-gray-700">
            Follow-up Date <Bell className="inline w-4 h-4 text-gray-500" />
          </label>
          <input
            type="date"
            id="followUpDate"
            name="followUpDate"
            value={form.followUpDate}
            onChange={handleChange}
            className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
      )}
    </div>
  );
}