import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, FileText, Download, ExternalLink, Search, Filter, BookOpen, Award, Users, Calendar, AlertCircle, Loader, Play } from 'lucide-react';

const ScholarshipResources = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    loadScholarships();
  }, [currentUser]);

  const loadScholarships = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current user profile for personalized recommendations
      const userProfile = currentUser?.profile;
      
      if (!userProfile) {
  // Skipping profile check for now
  // throw new Error('User profile not found. Please complete your profile first.');
      }

      // TODO: Replace with actual API call that uses LLM for personalized matching
      // This will be enhanced with LLM model to match scholarships based on user profile
      const response = await fetch('http://localhost:5000/api/scholarships/personalized', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.uid,
          profile: userProfile
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch personalized scholarships');
      }

      const data = await response.json();
      setScholarships(data);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'General', label: 'General' },
    { value: 'SC/ST', label: 'SC/ST' },
    { value: 'OBC', label: 'OBC' },
    { value: 'Minority', label: 'Minority' },
    { value: 'Defense', label: 'Defense' },
    { value: 'Technical', label: 'Technical' }
  ];

  const filteredScholarships = scholarships.filter(scholarship => {
    const matchesSearch = scholarship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scholarship.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           scholarship.category === selectedCategory ||
                           scholarship.eligibility?.category?.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const handleScholarshipClick = (scholarship) => {
    setSelectedScholarship(scholarship);
  };

  const closeModal = () => {
    setSelectedScholarship(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading scholarships...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Scholarships</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button onClick={loadScholarships} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-8">
        <div className="text-center mb-16">
          <div className="relative inline-block mb-6">
            <h1 className="text-5xl lg:text-6xl font-black text-gray-900">
              Scholarship <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">Resources</span>
            </h1>
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-lg blur opacity-20"></div>
          </div>
          
          {/* Personalized Recommendation Badge */}
          <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full border border-purple-200">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">🤖</span>
            </div>
            <span className="text-purple-700 font-semibold">AI-Powered Personalized Recommendations</span>
          </div>
          
          {scholarships.length > 0 ? (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Here are the scholarships available for you
            </p>
          ) : (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              No scholarships found. Please check back later.
            </p>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
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
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredScholarships.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Scholarships Found</h3>
            <p className="text-gray-600">
              {scholarships.length === 0 
                ? "There are currently no scholarships in the database."
                : "No scholarships match your search criteria. Try adjusting your filters."
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredScholarships.map((scholarship) => (
              <div key={scholarship._id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer" onClick={() => handleScholarshipClick(scholarship)}>
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">{scholarship.category || 'General'}</div>
                  {scholarship.isActive && (
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">Active</div>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">{scholarship.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{scholarship.description}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-green-600">
                    <Award className="w-5 h-5" />
                    <span className="font-semibold">{scholarship.benefits}</span>
                  </div>
                  
                  {scholarship.lastDate && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-5 h-5" />
                      <span>Deadline: {new Date(scholarship.lastDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
                
                <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors mt-6">View Details</button>
              </div>
            ))}
          </div>
        )}

        {/* Scholarship Detail Modal */}
        {selectedScholarship && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={closeModal}>
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-900">{selectedScholarship.title}</h2>
                <button className="text-gray-500 hover:text-gray-700 text-2xl font-bold" onClick={closeModal}>×</button>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{selectedScholarship.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Benefits</h3>
                  <p className="text-gray-600 leading-relaxed">{selectedScholarship.benefits}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Application Process</h3>
                  <p className="text-gray-600 leading-relaxed">{selectedScholarship.applicationProcess}</p>
                </div>

                {selectedScholarship.documents && selectedScholarship.documents.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Required Documents</h3>
                    <ul className="space-y-2">
                      {selectedScholarship.documents.map((doc, index) => (
                        <li key={index} className="flex items-center gap-3 text-gray-600">
                          <FileText className="w-5 h-5 text-blue-500" />
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-4 pt-6 border-t">
                  {selectedScholarship.videoLink && (
                    <a
                      href={selectedScholarship.videoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Play className="w-5 h-5" />
                      Watch Tutorial
                    </a>
                  )}
                  
                  {selectedScholarship.applicationLink && (
                    <a
                      href={selectedScholarship.applicationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                      Apply Now
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScholarshipResources;
