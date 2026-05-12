import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { companiesAPI } from '../services/api';
import { Search, Building2, MapPin, Users, Filter, Briefcase } from 'lucide-react';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [industries, setIndustries] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [companiesRes, industriesRes] = await Promise.all([
        companiesAPI.getAll(),
        companiesAPI.getIndustries()
      ]);
      setCompanies(companiesRes.data.companies);
      setIndustries(industriesRes.data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(search.toLowerCase()) ||
      company.industry?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !filter || company.hiringStatus === filter;
    const matchesIndustry = !industryFilter || company.industry === industryFilter;
    return matchesSearch && matchesStatus && matchesIndustry;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Actively Hiring' };
      case 'upcoming':
        return { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Coming Soon' };
      case 'completed':
        return { bg: 'bg-gray-500/20', text: 'text-gray-400', label: 'Completed' };
      case 'not-hiring':
        return { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Not Hiring' };
      default:
        return { bg: 'bg-gray-500/20', text: 'text-gray-400', label: status };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Company Portal</h1>
        <p className="text-gray-400 mt-1">Explore companies, interview experiences, and placement patterns</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {companies.filter(c => c.hiringStatus === 'active').length}
              </p>
              <p className="text-sm text-gray-400">Actively Hiring</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{companies.length}</p>
              <p className="text-sm text-gray-400">Total Companies</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{industries.length}</p>
              <p className="text-sm text-gray-400">Industries</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {companies.filter(c => c.hiringStatus === 'upcoming').length}
              </p>
              <p className="text-sm text-gray-400">Upcoming</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search companies..."
              className="w-full pl-10 pr-4 py-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-primary-500 focus:outline-none"
            />
          </div>
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-primary-500 focus:outline-none"
          >
            <option value="">All Status</option>
            <option value="active">Actively Hiring</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="not-hiring">Not Hiring</option>
          </select>

          <select
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            className="px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-primary-500 focus:outline-none"
          >
            <option value="">All Industries</option>
            {industries.map(ind => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Companies Grid */}
      {filteredCompanies.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => {
            const status = getStatusBadge(company.hiringStatus);
            return (
              <Link
                key={company._id}
                to={`/companies/${company._id}`}
                className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-primary-500/50 transition-all group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-gray-700 rounded-xl flex items-center justify-center text-2xl">
                      {company.logo || '🏢'}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                      {status.label}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary-400 transition-colors">
                    {company.name}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      {company.industry || 'Technology'}
                    </span>
                    {company.headquarters && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {company.headquarters}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                    {company.description || 'No description available'}
                  </p>

                  {company.eligibilityCriteria?.minCGPA && (
                    <div className="pt-4 border-t border-gray-700">
                      <p className="text-sm text-gray-400">
                        Min. CGPA: <span className="text-white">{company.eligibilityCriteria.minCGPA}</span>
                      </p>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <h3 className="text-xl font-medium mb-2">No companies found</h3>
          <p className="text-gray-400">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default Companies;