import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, ExternalLink, Star, Calendar, DollarSign, FileText, Award, MapPin, User, Video, AlertCircle, Loader, Play } from 'lucide-react';

const SchemeMatcher = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedScheme, setSelectedScheme] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    loadSchemes();
  }, [currentUser]);

  const loadSchemes = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current user profile for personalized recommendations
      const userProfile = currentUser?.profile;
      
      if (!userProfile) {
        throw new Error('User profile not found. Please complete your profile first.');
      }

      // TODO: Replace with actual API call that uses LLM for personalized matching
      // This will be enhanced with LLM model to match schemes based on user profile
      const response = await fetch('http://localhost:5000/api/schemes/personalized', {
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
        throw new Error('Failed to fetch personalized schemes');
      }

      const data = await response.json();
      setSchemes(data);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSchemeClick = (scheme) => {
    setSelectedScheme(scheme);
  };

  const closeModal = () => {
    setSelectedScheme(null);
  };

  const formatEligibilityArray = (eligibility) => {
    if (Array.isArray(eligibility.category)) {
      return eligibility.category;
    }
    return [];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-pink-600 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="mt-6 text-xl text-gray-600 font-semibold">Finding the best schemes for you...</p>
          <div className="mt-4 flex justify-center space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
            <div className="absolute -inset-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur opacity-20"></div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Unable to Load Schemes</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">{error}</p>
          <button 
            onClick={loadSchemes} 
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 hover:shadow-lg hover:scale-105 transition-all duration-300 transform"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <div className="relative inline-block mb-6">
            <h1 className="text-5xl lg:text-6xl font-black text-gray-900">
              Government <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">Schemes</span>
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
          
          {schemes.length > 0 && currentUser?.profile ? (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Based on your profile, here are the schemes that best match your eligibility and needs
            </p>
          ) : (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Complete your profile to get personalized scheme recommendations tailored to your needs
            </p>
          )}
        </div>

        {schemes.length === 0 ? (
          <div className="text-center py-20">
            <div className="relative mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto">
                <Award className="w-16 h-16 text-gray-400" />
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full blur opacity-10"></div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">No Schemes Available</h3>
            <p className="text-gray-600 mb-2 text-lg">There are currently no schemes in the database.</p>
            <p className="text-gray-600 text-lg">Check back later or contact the administrator.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {schemes.map((scheme, index) => (
              <div 
                key={scheme._id} 
                className="group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border border-white/30 overflow-hidden cursor-pointer" 
                onClick={() => handleSchemeClick(scheme)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Hover effect background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10 p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      {scheme.type}
                    </div>
                  {scheme.isActive && (
                      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        Active
                      </div>
                  )}
                </div>
                
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors duration-300 leading-tight">
                    {scheme.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    {scheme.description}
                  </p>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-green-600 font-semibold">Benefits</p>
                        <p className="text-gray-800 font-bold">{scheme.benefits}</p>
                      </div>
                </div>
                
                {scheme.lastDate && (
                      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-blue-600 font-semibold">Deadline</p>
                          <p className="text-gray-800 font-bold">{new Date(scheme.lastDate).toLocaleDateString()}</p>
                        </div>
                  </div>
                )}
                  </div>
                  
                  <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 hover:shadow-lg hover:scale-105 transition-all duration-300 transform group-hover:shadow-xl">
                    View Details
                  </button>
                </div>
                
                {/* Decorative corner element */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            ))}
          </div>
        )}

        {/* Scheme Detail Modal */}
        {selectedScheme && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={closeModal}>
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/30" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-t-3xl">
                <div className="flex justify-between items-start">
                  <h2 className="text-3xl font-bold pr-8">{selectedScheme.title}</h2>
                  <button 
                    className="text-white hover:text-gray-200 text-3xl font-bold hover:scale-110 transition-transform duration-300" 
                    onClick={closeModal}
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="p-8 space-y-8">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">📝</span>
                    </div>
                    Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-lg">{selectedScheme.description}</p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">💰</span>
                    </div>
                    Benefits
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-lg">{selectedScheme.benefits}</p>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">📋</span>
                    </div>
                    Application Process
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-lg">{selectedScheme.applicationProcess}</p>
                </div>

                {selectedScheme.documents && selectedScheme.documents.length > 0 && (
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-2xl border border-orange-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm">📄</span>
                      </div>
                      Required Documents
                    </h3>
                    <ul className="space-y-3">
                      {selectedScheme.documents.map((doc, index) => (
                        <li key={index} className="flex items-center gap-3 text-gray-700">
                          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                            <FileText className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-lg">{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-4 pt-8 border-t border-gray-200">
                  {selectedScheme.videoLink && (
                    <a
                      href={selectedScheme.videoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 hover:shadow-lg hover:scale-105 transition-all duration-300 transform"
                    >
                      <Play className="w-6 h-6" />
                      Watch Tutorial
                    </a>
                  )}
                  
                  {selectedScheme.applicationLink && (
                    <a
                      href={selectedScheme.applicationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 hover:shadow-lg hover:scale-105 transition-all duration-300 transform"
                    >
                      <ExternalLink className="w-6 h-6" />
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

export default SchemeMatcher;
