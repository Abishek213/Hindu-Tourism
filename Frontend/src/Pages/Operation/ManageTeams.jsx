import { useState, useEffect } from "react";
import api from '../../api/auth'; 
import { toast } from 'react-toastify';

export default function ManageTeamForm() {
  const [showGuideForm, setShowGuideForm] = useState(false);
  const [showTransportForm, setShowTransportForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);

  const [guides, setGuides] = useState([]);
  const [transports, setTransports] = useState([]);

  const [guideSearchQuery, setGuideSearchQuery] = useState("");
  const [transportSearchQuery, setTransportSearchQuery] = useState("");

  const [newGuide, setNewGuide] = useState({
    name: "",
    phone: "",
    email: "",
    is_active: true
  });

  const [newTransport, setNewTransport] = useState({
    name: "",
    type: "",
    contact_info: "",
    is_active: true
  });


  useEffect(() => {
    fetchGuides();
    fetchTransports();
  }, []);

  const fetchGuides = async () => {
    try {
      setFetchingData(true);
      const response = await api.get('/guide');
      setGuides(response.data);
    } catch (error) {
      toast.error('Failed to fetch guides: ' + (error.response?.data?.error || error.message));
      console.error('Error fetching guides:', error);
    } finally {
      setFetchingData(false);
    }
  };

  const fetchTransports = async () => {
    try {
      setFetchingData(true);
      const response = await api.get('/transport');
      setTransports(response.data);
    } catch (error) {
      toast.error('Failed to fetch transports: ' + (error.response?.data?.error || error.message));
      console.error('Error fetching transports:', error);
    } finally {
      setFetchingData(false);
    }
  };

  const createGuide = async () => {
    try {
      setLoading(true);
      
      if (!newGuide.name.trim() || !newGuide.phone.trim()) {
        toast.error('Name and phone are required for guides');
        return;
      }

      const response = await api.post('/guide/create', newGuide);
      
      toast.success('Guide created successfully!');
      
      setNewGuide({ name: "", phone: "", email: "", is_active: true });
      setShowGuideForm(false);
      await fetchGuides();
      
    } catch (error) {
      toast.error('Failed to create guide: ' + (error.response?.data?.error || error.message));
      console.error('Error creating guide:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTransport = async () => {
    try {
      setLoading(true);
      
      if (!newTransport.name.trim() || !newTransport.type.trim()) {
        toast.error('Name and type are required for transports');
        return;
      }

      const response = await api.post('/transport/create', newTransport);
      
      toast.success('Transport created successfully!');
      
      setNewTransport({ name: "", type: "", contact_info: "", is_active: true });
      setShowTransportForm(false);
      await fetchTransports();
      
    } catch (error) {
      toast.error('Failed to create transport: ' + (error.response?.data?.error || error.message));
      console.error('Error creating transport:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleGuideStatus = async (guideId, currentStatus) => {
    try {
      setLoading(true);
      const newStatus = !currentStatus;
      
      await api.put(`/guide/${guideId}/status`, { is_active: newStatus });
      
      toast.success(`Guide ${newStatus ? 'activated' : 'deactivated'} successfully!`);
      await fetchGuides();
      
    } catch (error) {
      toast.error('Failed to update guide status: ' + (error.response?.data?.error || error.message));
      console.error('Error updating guide status:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTransportStatus = async (transportId, currentStatus) => {
    try {
      setLoading(true);
      const newStatus = !currentStatus;
      
      await api.put(`/transport/${transportId}/status`, { is_active: newStatus });
      
      toast.success(`Transport ${newStatus ? 'activated' : 'deactivated'} successfully!`);
      await fetchTransports();
      
    } catch (error) {
      toast.error('Failed to update transport status: ' + (error.response?.data?.error || error.message));
      console.error('Error updating transport status:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleGuideChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewGuide(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleTransportChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewTransport(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const refreshData = async () => {
    setFetchingData(true);
    await Promise.all([fetchGuides(), fetchTransports()]);
    setFetchingData(false);
    toast.success('Data refreshed successfully!');
  };

  const filteredGuides = guides.filter((guide) => {
    const query = guideSearchQuery.toLowerCase();
    return (
      guide.name.toLowerCase().includes(query) ||
      (guide.email && guide.email.toLowerCase().includes(query)) ||
      guide.phone.toLowerCase().includes(query)
    );
  });

  const filteredTransports = transports.filter((transport) => {
    const query = transportSearchQuery.toLowerCase();
    return (
      transport.name.toLowerCase().includes(query) ||
      transport.type.toLowerCase().includes(query) ||
      (transport.contact_info && transport.contact_info.toLowerCase().includes(query))
    );
  });

  const clearGuideSearch = () => {
    setGuideSearchQuery("");
  };

  const clearTransportSearch = () => {
    setTransportSearchQuery("");
  };

  return (
    <div className="p-4  bg-white rounded-lg shadow-md">
      {/* Header Actions */}
      <div className="mb-6 flex justify-between items-center px-6 py-8 border-b border-gray-100
       bg-primary-saffron">
        <h1 className="text-xl font-bold text-white">Manage Guide and Transport</h1>
        <div className="flex space-x-4">
          <button
            onClick={refreshData}
            disabled={fetchingData}
            className="px-4 py-2 text-sm rounded-md  text-orange-600 transition-all duration-200
                  bg-white shadow-lg sm:mt-0 hover:bg-orange-100"
          >
            {fetchingData ? 'Refreshing...' : 'Refresh Data'}
          </button>
          <button
            onClick={() => setShowGuideForm(!showGuideForm)}
            className="px-4 py-2 text-sm rounded-md  text-orange-600 transition-all duration-200
                  bg-white shadow-lg sm:mt-0 hover:bg-orange-100"
          >
            {showGuideForm ? "Cancel Guide" : "Create Guide"}
          </button>
          <button
            onClick={() => setShowTransportForm(!showTransportForm)}
            className="px-4 py-2 text-sm rounded-md  text-orange-600 transition-all duration-200
                  bg-white shadow-lg sm:mt-0 hover:bg-orange-100"
          >
            {showTransportForm ? "Cancel Transport" : "Create Transport"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {showGuideForm && (
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-x-secondary-green">
            <h3 className="text-xl font-bold mb-4 text-black">Create New Guide</h3>
            <div className="space-y-4">
              <input
                name="name"
                value={newGuide.name}
                onChange={handleGuideChange}
                placeholder="Guide Name *"
                  className="w-full p-3 border border-gray-300 rounded-lg"
              />
              <input
                name="phone"
                value={newGuide.phone}
                onChange={handleGuideChange}
                placeholder="Phone Number *"
                  className="w-full p-3 border border-gray-300 rounded-lg"
              />
              <input
                name="email"
                value={newGuide.email}
                onChange={handleGuideChange}
                placeholder="Email Address"
                type="email"
                  className="w-full p-3 border border-gray-300 rounded-lg"
              />
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={newGuide.is_active}
                  onChange={handleGuideChange}
                  className="mr-2"
                />
                <label className="text-black">Active Guide</label>
              </div>
              <button
                onClick={createGuide}
                disabled={loading}
                className="w-full bg-primary-saffron text-white py-3 rounded-lg hover:bg-orange-600 disabled:opacity-50 font-semibold"
              >
                {loading ? 'Creating...' : 'Create Guide'}
              </button>
            </div>
          </div>
        )}

        {/* Transport Creation Form */}
        {showTransportForm && (
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-secondary-green">
            <h3 className="text-xl font-bold mb-4 text-black">Create New Transport</h3>
            <div className="space-y-4">
              <input
                name="name"
                value={newTransport.name}
                onChange={handleTransportChange}
                placeholder="Transport Name *"
                  className="w-full p-3 border border-gray-300 rounded-lg"
              />
              <input
                name="type"
                value={newTransport.type}
                onChange={handleTransportChange}
                placeholder="Transport Type *"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
              <input
                name="contact_info"
                value={newTransport.contact_info}
                onChange={handleTransportChange}
                placeholder="Contact Information"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={newTransport.is_active}
                  onChange={handleTransportChange}
                  className="mr-2"
                />
                <label className="text-black">Active Transport</label>
              </div>
              <button
                onClick={createTransport}
                disabled={loading}
                className="w-full bg-primary-saffron text-white py-3 rounded-lg hover:bg-amber-600 disabled:opacity-50 font-semibold"
              >
                {loading ? 'Creating...' : 'Create Transport'}
              </button>
            </div>
          </div>
        )}



        {/* Guides List */}
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-x-secondary-green">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-black">
              Guides ({filteredGuides.length}/{guides.length})
            </h3>
            {fetchingData && <span className="text-sm text-gray-500">Loading...</span>}
          </div>
          
          {/* Guide Search */}
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search guides by name, email, or phone..."
                value={guideSearchQuery}
                onChange={(e) => setGuideSearchQuery(e.target.value)}
                       className="w-full p-3 pl-10 pr-10 border border-gray-300 rounded-lg "
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {guideSearchQuery && (
                <button
                  onClick={clearGuideSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            {guideSearchQuery && (
              <p className="text-sm text-gray-500 mt-2">
                Showing {filteredGuides.length} result{filteredGuides.length !== 1 ? 's' : ''} for "{guideSearchQuery}"
              </p>
            )}
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredGuides.length > 0 ? (
              filteredGuides.map((guide) => (
                <div 
                  key={guide._id} 
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    guide.is_active 
                      ? 'bg-orange-50 border-orange-200 hover:bg-orange-100' 
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-lg">{guide.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          guide.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {guide.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        <strong>Phone:</strong> {guide.phone}
                      </p>
                      {guide.email && (
                        <p className="text-sm text-gray-600">
                          <strong>Email:</strong> {guide.email}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        Created: {new Date(guide.createdAt || Date.now()).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleGuideStatus(guide._id, guide.is_active)}
                      disabled={loading}
                      className={`ml-4 px-3 py-1 rounded text-sm font-medium disabled:opacity-50 ${
                        guide.is_active
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                    >
                      {guide.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                {guideSearchQuery ? (
                  <>
                    <p>No guides found matching "{guideSearchQuery}"</p>
                    <button 
                      onClick={clearGuideSearch}
                      className="mt-2 text-orange-500 hover:text-orange-600 underline"
                    >
                      Clear search
                    </button>
                  </>
                ) : (
                  <p>No guides found. Create your first guide!</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Transports List */}
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-x-secondary-green">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-black">
              Transports ({filteredTransports.length}/{transports.length})
            </h3>
            {fetchingData && <span className="text-sm text-gray-500">Loading...</span>}
          </div>
          
          {/* Transport Search */}
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search transports by name, type, or contact..."
                value={transportSearchQuery}
                onChange={(e) => setTransportSearchQuery(e.target.value)}
                className="w-full p-3 pl-10 pr-10 border border-gray-300 rounded-lg "
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {transportSearchQuery && (
                <button
                  onClick={clearTransportSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            {transportSearchQuery && (
              <p className="text-sm text-gray-500 mt-2">
                Showing {filteredTransports.length} result{filteredTransports.length !== 1 ? 's' : ''} for "{transportSearchQuery}"
              </p>
            )}
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredTransports.length > 0 ? (
              filteredTransports.map((transport) => (
                <div 
                  key={transport._id} 
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    transport.is_active 
                      ? 'bg-amber-50 border-amber-200 hover:bg-amber-100' 
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-lg">{transport.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transport.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transport.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        <strong>Type:</strong> {transport.type}
                      </p>
                      {transport.contact_info && (
                        <p className="text-sm text-gray-600">
                          <strong>Contact:</strong> {transport.contact_info}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        Created: {new Date(transport.createdAt || Date.now()).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleTransportStatus(transport._id, transport.is_active)}
                      disabled={loading}
                      className={`ml-4 px-3 py-1 rounded text-sm font-medium disabled:opacity-50 ${
                        transport.is_active
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                    >
                      {transport.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                {transportSearchQuery ? (
                  <>
                    <p>No transports found matching "{transportSearchQuery}"</p>
                    <button 
                      onClick={clearTransportSearch}
                      className="mt-2 text-amber-500 hover:text-amber-600 underline"
                    >
                      Clear search
                    </button>
                  </>
                ) : (
                  <p>No transports found. Create your first transport!</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
              <span className="text-gray-700">Processing...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}