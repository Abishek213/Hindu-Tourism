import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, Filter, RefreshCw, User, Calendar, 
  Tag, MapPin, Users, ChevronDown, ChevronUp, Phone
} from 'lucide-react';
import api from '../../api/auth'; // Adjust the import path as necessary

export default function LeadList() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'desc'
  });

  // Status color mapping
  const statusColors = {
    new: 'bg-blue-100 text-blue-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    qualified: 'bg-purple-100 text-purple-800',
    converted: 'bg-green-100 text-green-800',
    lost: 'bg-red-100 text-red-800'
  };

  // Status label mapping
  const statusLabels = {
    new: 'New',
    contacted: 'Contacted',
    qualified: 'Qualified',
    converted: 'Converted',
    lost: 'Lost'
  };

  // Source label mapping
  const sourceLabels = {
    website: 'Website',
    referral: 'Referral',
    social_media: 'Social Media',
    walk_in: 'Walk-in',
    other: 'Other'
  };

  // Load leads from API
  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      setError('');
      try {
        // Using GET /lead endpoint (same base as POST /lead)
        const response = await api.get('/lead');
        const leadsData = Array.isArray(response.data) ? response.data : [];
        
        // Ensure the data structure matches what we expect
        const formattedLeads = leadsData.map(lead => ({
          id: lead.id || lead._id || Math.random().toString(36),
          name: lead.name || lead.fullName || 'Unknown',
          email: lead.email || '',
          phone: lead.phone || '',
          source: lead.source || 'unknown',
          status: lead.status || 'new',
          notes: lead.notes || '',
          createdAt: lead.createdAt || lead.created_at || new Date().toISOString(),
        }));
        
        setLeads(formattedLeads);
        setFilteredLeads(formattedLeads);
      } catch (error) {
        console.error('Error loading leads:', error);
        if (error.response?.status === 404) {
          setError('Backend GET endpoint not found. Please add a GET route for /api/lead in your backend to fetch all leads.');
        } else if (error.response?.status === 500) {
          setError('Server error while fetching leads. Check your backend logs.');
        } else {
          setError('Failed to load leads. Please check your backend connection.');
        }
        // Set empty arrays so UI doesn't break
        setLeads([]);
        setFilteredLeads([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  // Handle search and filtering
  useEffect(() => {
    let result = [...leads];

    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(lead => 
        (lead.name && lead.name.toLowerCase().includes(lowerSearchTerm)) ||
        (lead.email && lead.email.toLowerCase().includes(lowerSearchTerm)) ||
        (lead.phone && lead.phone.toLowerCase().includes(lowerSearchTerm)) ||
        (lead.notes && lead.notes.toLowerCase().includes(lowerSearchTerm))
      );
    }

    // Apply status filter
    if (statusFilter) {
      result = result.filter(lead => lead.status === statusFilter);
    }

    // Apply source filter
    if (sourceFilter) {
      result = result.filter(lead => lead.source === sourceFilter);
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        // Handle date sorting
        if (sortConfig.key === 'createdAt') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }
        
        // Handle string comparison
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredLeads(result);
  }, [leads, searchTerm, statusFilter, sourceFilter, sortConfig]);

  // Handle sorting when column header is clicked
  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch {
      return 'Invalid Date';
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setSourceFilter('');
    setSortConfig({
      key: 'createdAt',
      direction: 'desc'
    });
  };

  // Refresh leads data
  const refreshLeads = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/lead');
      const leadsData = Array.isArray(response.data) ? response.data : [];
      
      const formattedLeads = leadsData.map(lead => ({
        id: lead.id || lead._id || Math.random().toString(36),
        name: lead.name || lead.fullName || 'Unknown',
        email: lead.email || '',
        phone: lead.phone || '',
        source: lead.source || 'unknown',
        status: lead.status || 'new',
        notes: lead.notes || '',
        createdAt: lead.createdAt || lead.created_at || new Date().toISOString(),
      }));
      
      setLeads(formattedLeads);
      setFilteredLeads(formattedLeads);
    } catch (error) {
      console.error('Error refreshing leads:', error);
      if (error.response?.status === 404) {
        setError('Backend GET endpoint not found. Please add a GET route for /api/lead in your backend.');
      } else {
        setError('Failed to refresh leads.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Render sort indicator
  const renderSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="inline w-4 h-4 ml-1" /> 
      : <ChevronDown className="inline w-4 h-4 ml-1" />;
  };

  // Handle lead row click
  const handleLeadClick = (leadId) => {
    console.log('View lead details for:', leadId);
    // navigate(`/leads/${leadId}`);
  };

  return (
    <div className="p-4 mx-auto max-w-7xl sm:p-6">
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col items-center justify-between mb-6 sm:flex-row">
          <h2 className="mb-4 text-2xl font-bold text-orange-600 sm:mb-0">
            Lead Management
          </h2>
          
          <div className="flex gap-2">
            <button
              onClick={refreshLeads}
              className="flex items-center gap-2 px-4 py-2 text-orange-600 border border-orange-600 rounded-md hover:bg-orange-50"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <Link 
              to="/leads/new" 
              className="px-4 py-2 text-white transition bg-orange-600 rounded-md hover:bg-orange-700"
            >
              + Add New Lead
            </Link>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-4 mb-6 text-red-700 bg-red-100 border border-red-300 rounded-md">
            <div className="font-medium">Error:</div>
            <div>{error}</div>
            {error.includes('GET route') && (
              <div className="mt-2 text-sm">
                <strong>Backend Setup Required:</strong>
                <pre className="p-2 mt-1 overflow-x-auto text-xs bg-red-50">
{`// Add this to your backend (Express.js example):
app.get('/api/lead', async (req, res) => {
  try {
    // Replace with your database query
    const leads = await YourLeadModel.findAll();
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});`}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Filters and search */}
        <div className="flex flex-col gap-4 mb-6 md:flex-row">
          <div className="relative flex-grow">
            <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              placeholder="Search leads by name, email, phone, or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>

            {/* Source Filter */}
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">All Sources</option>
              <option value="website">Website</option>
              <option value="referral">Referral</option>
              <option value="social_media">Social Media</option>
              <option value="walk_in">Walk-in</option>
              <option value="other">Other</option>
            </select>
            
            <button 
              onClick={resetFilters}
              className="flex items-center gap-1 p-2 text-gray-600 transition-colors hover:text-orange-600"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="py-10 text-center">
            <div className="w-12 h-12 mx-auto border-b-2 border-orange-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading leads...</p>
          </div>
        ) : filteredLeads.length === 0 && !error ? (
          <div className="py-10 text-center rounded-lg bg-gray-50">
            <User className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="mb-2 text-lg text-gray-600">
              {leads.length === 0 
                ? "No leads found" 
                : "No leads match your current filters"
              }
            </p>
            <p className="mb-4 text-sm text-gray-500">
              {leads.length === 0 
                ? "Add your first lead to get started with lead management." 
                : "Try adjusting your search or filter criteria."
              }
            </p>
            {leads.length === 0 && (
              <Link 
                to="/leads/new" 
                className="inline-block px-6 py-3 text-white transition bg-orange-600 rounded-md hover:bg-orange-700"
              >
                + Add Your First Lead
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer hover:bg-gray-100" 
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      Client Name
                      {renderSortIndicator('name')}
                    </div>
                  </th>
                  <th className="hidden px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase md:table-cell">
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      Contact
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer hover:bg-gray-100" 
                    onClick={() => handleSort('source')}
                  >
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      Source
                      {renderSortIndicator('source')}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer hover:bg-gray-100" 
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center">
                      <Tag className="w-4 h-4 mr-1" />
                      Status
                      {renderSortIndicator('status')}
                    </div>
                  </th>
                  <th 
                    className="hidden px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer hover:bg-gray-100 sm:table-cell" 
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Created
                      {renderSortIndicator('createdAt')}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLeads.map((lead) => (
                  <tr 
                    key={lead.id} 
                    className="transition-colors cursor-pointer hover:bg-gray-50"
                    onClick={() => handleLeadClick(lead.id)}
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{lead.name}</div>
                      <div className="max-w-xs text-sm text-gray-500 truncate">
                        {lead.notes && lead.notes.length > 50 
                          ? `${lead.notes.substring(0, 50)}...` 
                          : lead.notes || 'No notes'
                        }
                      </div>
                    </td>
                    <td className="hidden px-4 py-4 whitespace-nowrap md:table-cell">
                      <div className="text-sm text-gray-900">{lead.email}</div>
                      <div className="text-sm text-gray-500">{lead.phone}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {sourceLabels[lead.source] || lead.source}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[lead.status] || 'bg-gray-100 text-gray-800'}`}>
                        {statusLabels[lead.status] || lead.status}
                      </span>
                    </td>
                    <td className="hidden px-4 py-4 text-sm text-gray-500 whitespace-nowrap sm:table-cell">
                      {formatDate(lead.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Results summary */}
            <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
              <div>
                Showing {filteredLeads.length} of {leads.length} leads
                {(searchTerm || statusFilter || sourceFilter) && (
                  <span className="ml-2 text-orange-600">
                    (filtered)
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500">
                Click on a lead to view details
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}