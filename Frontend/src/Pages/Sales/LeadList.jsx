import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Filter, RefreshCw, User, Calendar, 
  Tag, MapPin, Users, ChevronDown, ChevronUp, Phone
} from 'lucide-react';

export default function LeadList() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'desc'
  });

  // Status color mapping
  const statusColors = {
    new: 'bg-blue-100 text-blue-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    interested: 'bg-purple-100 text-purple-800',
    booked: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  };

  // Status label mapping
  const statusLabels = {
    new: 'New',
    contacted: 'Contacted',
    interested: 'Interested',
    booked: 'Booked',
    rejected: 'Rejected'
  };

  // Load leads from localStorage
  useEffect(() => {
    const fetchLeads = () => {
      setLoading(true);
      try {
        const storedLeads = localStorage.getItem('leads');
        const parsedLeads = storedLeads ? JSON.parse(storedLeads) : [];
        setLeads(parsedLeads);
        setFilteredLeads(parsedLeads);
      } catch (error) {
        console.error('Error loading leads:', error);
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
        lead.fullName.toLowerCase().includes(lowerSearchTerm) ||
        lead.email.toLowerCase().includes(lowerSearchTerm) ||
        lead.phone.toLowerCase().includes(lowerSearchTerm) ||
        lead.destination.toLowerCase().includes(lowerSearchTerm)
      );
    }

    // Apply status filter
    if (statusFilter) {
      result = result.filter(lead => lead.status === statusFilter);
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredLeads(result);
  }, [leads, searchTerm, statusFilter, sortConfig]);

  // Handle sorting when column header is clicked
  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setSortConfig({
      key: 'createdAt',
      direction: 'desc'
    });
  };

  // Render sort indicator
  const renderSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="h-4 w-4 inline ml-1" /> 
      : <ChevronDown className="h-4 w-4 inline ml-1" />;
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-orange-600 mb-4 sm:mb-0">
            Lead Management
          </h2>
          
          <Link to="/leads/new" className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition">
            + Add New Lead
          </Link>
        </div>

        {/* Filters and search */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="text-gray-500 h-5 w-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="interested">Interested</option>
              <option value="booked">Booked</option>
              <option value="rejected">Rejected</option>
            </select>
            
            <button 
              onClick={resetFilters}
              className="p-2 text-gray-600 hover:text-orange-600 flex items-center gap-1"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading leads...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No leads found. Add a new lead to get started.</p>
            <Link to="/leads/new" className="mt-4 inline-block px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition">
              + Add New Lead
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('fullName')}>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      Client Name
                      {renderSortIndicator('fullName')}
                    </div>
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell cursor-pointer" onClick={() => handleSort('destination')}>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      Destination
                      {renderSortIndicator('destination')}
                    </div>
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell cursor-pointer" onClick={() => handleSort('phone')}>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      Phone
                      {renderSortIndicator('phone')}
                    </div>
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      People
                    </div>
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('status')}>
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 mr-1" />
                      Status
                      {renderSortIndicator('status')}
                    </div>
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hidden sm:table-cell" onClick={() => handleSort('createdAt')}>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Date
                      {renderSortIndicator('createdAt')}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLeads.map((lead) => (
                  <tr 
                    key={lead.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      // In a real application, this would navigate to a lead detail page
                      console.log('View lead details for:', lead.id);
                      // navigate(`/leads/${lead.id}`);
                    }}
                  >
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{lead.fullName}</div>
                      <div className="text-sm text-gray-500">{lead.nationality}</div>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-sm text-gray-900">{lead.destination}</div>
                      <div className="text-xs text-gray-500">{lead.packageType}</div>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap hidden lg:table-cell">
                      <div className="text-sm text-gray-900">{lead.phone}</div>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell">
                      {lead.numPeople}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[lead.status]}`}>
                        {statusLabels[lead.status]}
                      </span>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                      {formatDate(lead.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Pagination would go here */}
            <div className="flex justify-between mt-4 text-sm text-gray-600">
              <div>Showing {filteredLeads.length} of {leads.length} leads</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}