import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  Award, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  LogOut,
  BarChart3,
  Settings,
  Plus,
  Filter,
  Calendar,
  DollarSign,
  ExternalLink,
  BookOpen,
  GraduationCap
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [schemes, setSchemes] = useState([]);
  const [scholarships, setScholarships] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken');
    const adminInfo = localStorage.getItem('adminData');
    
    if (!token || !adminInfo) {
      navigate('/admin/login');
      return;
    }

    setAdminData(JSON.parse(adminInfo));
    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    const token = localStorage.getItem('adminToken');
    
    try {
      setLoading(true);
      console.log('Loading dashboard data with token:', token ? 'Present' : 'Missing');
      
      // Load schemes
      const schemesResponse = await fetch(`http://localhost:5000/api/schemes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Schemes response status:', schemesResponse.status);
      
      if (schemesResponse.ok) {
        const schemesData = await schemesResponse.json();
        console.log('Schemes data:', schemesData);
        setSchemes(schemesData.schemes || []);
      } else {
        const errorData = await schemesResponse.text();
        console.error('Schemes fetch error:', errorData);
      }

      // Load scholarships
      const scholarshipsResponse = await fetch(`http://localhost:5000/api/scholarships`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Scholarships response status:', scholarshipsResponse.status);
      
      if (scholarshipsResponse.ok) {
        const scholarshipsData = await scholarshipsResponse.json();
        console.log('Scholarships data:', scholarshipsData);
        setScholarships(scholarshipsData.scholarships || []);
      } else {
        const errorData = await scholarshipsResponse.text();
        console.error('Scholarships fetch error:', errorData);
      }

      // Load users
      const usersResponse = await fetch(`http://localhost:5000/api/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Users response status:', usersResponse.status);
      
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        console.log('Users data:', usersData);
        setUsers(usersData.users || []);
      } else {
        const errorData = await usersResponse.text();
        console.error('Users fetch error:', errorData);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    navigate('/admin/login');
  };

  const deleteScheme = async (schemeId) => {
    if (!window.confirm('Are you sure you want to delete this scheme?')) {
      return;
    }

    const token = localStorage.getItem('adminToken');
    
    try {
      const response = await fetch(`http://localhost:5000/api/admin/schemes/${schemeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        loadDashboardData();
      }
    } catch (error) {
      console.error('Error deleting scheme:', error);
    }
  };

  const deleteScholarship = async (scholarshipId) => {
    if (!window.confirm('Are you sure you want to delete this scholarship?')) {
      return;
    }

    const token = localStorage.getItem('adminToken');
    
    try {
      const response = await fetch(`http://localhost:5000/api/admin/scholarships/${scholarshipId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        loadDashboardData();
      }
    } catch (error) {
      console.error('Error deleting scholarship:', error);
    }
  };

  // Filter data based on search and filter
  const filteredSchemes = schemes.filter(scheme => {
    const matchesSearch = scheme.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scheme.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || scheme.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const filteredScholarships = scholarships.filter(scholarship => {
    const matchesSearch = scholarship.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scholarship.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || scholarship.type === filterType;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = {
    totalUsers: users.length,
    totalSchemes: schemes.length,
    totalScholarships: scholarships.length,
    activeSchemes: schemes.filter(s => s.isActive).length,
    activeScholarships: scholarships.filter(s => s.isActive).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Smart Sarkari Sathi</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  Welcome, {adminData?.name}
                </p>
                <p className="text-xs text-gray-500">{adminData?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-white rounded-xl p-2 shadow-sm">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3, color: 'blue' },
              { id: 'schemes', label: 'Schemes', icon: FileText, color: 'green' },
              { id: 'scholarships', label: 'Scholarships', icon: Award, color: 'purple' },
              { id: 'users', label: 'Users', icon: Users, color: 'orange' }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? `bg-${tab.color}-500 text-white shadow-lg transform scale-105`
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Total Users</p>
                    <p className="text-3xl font-bold">{stats.totalUsers}</p>
                  </div>
                  <Users className="w-12 h-12 text-blue-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Total Schemes</p>
                    <p className="text-3xl font-bold">{stats.totalSchemes}</p>
                  </div>
                  <FileText className="w-12 h-12 text-green-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">Scholarships</p>
                    <p className="text-3xl font-bold">{stats.totalScholarships}</p>
                  </div>
                  <Award className="w-12 h-12 text-purple-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100">Active Schemes</p>
                    <p className="text-3xl font-bold">{stats.activeSchemes}</p>
                  </div>
                  <Settings className="w-12 h-12 text-orange-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-pink-100">Active Scholarships</p>
                    <p className="text-3xl font-bold">{stats.activeScholarships}</p>
                  </div>
                  <GraduationCap className="w-12 h-12 text-pink-200" />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Schemes */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Recent Schemes</h3>
                  <span className="text-sm text-gray-500">{schemes.length} total schemes</span>
                </div>
                {schemes.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No schemes found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {schemes.slice(0, 5).map((scheme) => (
                      <div key={scheme._id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{scheme.title}</p>
                            <p className="text-sm text-gray-500">
                              Added {new Date(scheme.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          scheme.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {scheme.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Scholarships */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Recent Scholarships</h3>
                  <span className="text-sm text-gray-500">{scholarships.length} total scholarships</span>
                </div>
                {scholarships.length === 0 ? (
                  <div className="text-center py-8">
                    <Award className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No scholarships found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {scholarships.slice(0, 5).map((scholarship) => (
                      <div key={scholarship._id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                            <Award className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{scholarship.title}</p>
                            <p className="text-sm text-gray-500">
                              Added {new Date(scholarship.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          scholarship.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {scholarship.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Schemes Tab */}
        {activeTab === 'schemes' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search schemes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                  >
                    <option value="all">All Types</option>
                    <option value="scheme">Schemes</option>
                    <option value="scholarship">Scholarships</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Schemes List */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">All Schemes</h3>
                <p className="text-sm text-gray-500 mt-1">Manage government schemes and programs</p>
              </div>
              
              {filteredSchemes.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No schemes found</p>
                  <p className="text-gray-400 text-sm">Schemes will be added by the LLM model</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Scheme Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Benefits
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Deadline
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredSchemes.map((scheme) => (
                        <tr key={scheme._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{scheme.title}</div>
                              <div className="text-sm text-gray-500">{scheme.description?.substring(0, 100)}...</div>
                              <div className="text-xs text-gray-400 mt-1">
                                Eligibility: {scheme.eligibilityCriteria || 'Not specified'}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-green-600">
                              <DollarSign className="w-4 h-4" />
                              <span className="text-sm font-medium">{scheme.schemeAmount || 'Not specified'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span className="text-sm">
                                {scheme.deadline ? new Date(scheme.deadline).toLocaleDateString() : 'No deadline'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              scheme.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {scheme.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <button className="text-indigo-600 hover:text-indigo-900">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="text-green-600 hover:text-green-900">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => deleteScheme(scheme._id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Scholarships Tab */}
        {activeTab === 'scholarships' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search scholarships..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
                  >
                    <option value="all">All Categories</option>
                    <option value="General">General</option>
                    <option value="SC/ST">SC/ST</option>
                    <option value="OBC">OBC</option>
                    <option value="Minority">Minority</option>
                    <option value="Defense">Defense</option>
                    <option value="Technical">Technical</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Scholarships List */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">All Scholarships</h3>
                <p className="text-sm text-gray-500 mt-1">Manage scholarship programs and opportunities</p>
              </div>
              
              {filteredScholarships.length === 0 ? (
                <div className="text-center py-12">
                  <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No scholarships found</p>
                  <p className="text-gray-400 text-sm">Scholarships will be added by the LLM model</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Scholarship Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Deadline
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredScholarships.map((scholarship) => (
                        <tr key={scholarship._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{scholarship.title}</div>
                              <div className="text-sm text-gray-500">{scholarship.description?.substring(0, 100)}...</div>
                              <div className="text-xs text-gray-400 mt-1">
                                Eligibility: {scholarship.eligibilityCriteria || 'Not specified'}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-green-600">
                              <DollarSign className="w-4 h-4" />
                              <span className="text-sm font-medium">{scholarship.scholarshipAmount || 'Not specified'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span className="text-sm">
                                {scholarship.deadline ? new Date(scholarship.deadline).toLocaleDateString() : 'No deadline'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              scholarship.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {scholarship.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <button className="text-indigo-600 hover:text-indigo-900">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="text-green-600 hover:text-green-900">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => deleteScholarship(scholarship._id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">All Users</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Profile
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.profile?.name || 'No name'}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {user.profile ? (
                            <div>
                              <div>Age: {user.profile.age}, {user.profile.gender}</div>
                              <div>{user.profile.state}, {user.profile.education}</div>
                            </div>
                          ) : (
                            <span className="text-gray-400">No profile</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.isVerified 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.isVerified ? 'Verified' : 'Unverified'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
