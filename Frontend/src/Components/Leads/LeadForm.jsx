import { useState } from 'react';
import api from '../../api/auth'; // Adjust the import path as necessary
import { useNavigate } from 'react-router-dom';

export default function LeadForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    source: 'website',
    // status: 'new',
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      
      const response = await api.post('/lead', form);

      console.log('Lead created successfully:', response.data);
      setSubmitted(true);

      // Redirect after a delay (optional)
      setTimeout(() => {
        navigate('/leads'); 
      }, 2000);
    } catch (error) {
      console.error('Failed to submit lead:', error.response?.data || error.message);
      alert('Error submitting lead. Please check your input and try again.');
    }
  };


  return (
    <div className="max-w-xl p-6 mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-center text-orange-600">
        Create New Lead
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Full Name *</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Email *</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Phone *</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Source */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Lead Source *</label>
          <select
            name="source"
            value={form.source}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="website">Website</option>
            <option value="referral">Referral</option>
            <option value="social_media">Social Media</option>
            <option value="walk_in">Walk-in</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Status */}
        {/* <div>
          <label className="block mb-1 font-medium text-gray-700">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="converted">Converted</option>
            <option value="lost">Lost</option>
          </select>
        </div> */}

        {/* Notes */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Notes</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            rows="4"
            placeholder="Enter any notes..."
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="px-6 py-2 font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700"
          >
            Submit Lead
          </button>
        </div>
      </form>
      {submitted && (
        <div className="p-4 mt-6 text-center border border-green-200 rounded-md bg-green-50">
          <p className="text-green-700">Lead successfully submitted! Redirecting...</p>
        </div>
      )}

    </div>
  );
}
