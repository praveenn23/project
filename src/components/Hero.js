import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Search, TrendingUp, Shield, Users } from 'lucide-react';

const Hero = () => {
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    // Handle search functionality
    console.log('Searching for:', searchQuery);
  };

  const handleGetStarted = () => {
    if (currentUser) {
      navigate('/schemes');
    } else {
      navigate('/login');
    }
  };

  const handleExploreSchemes = () => {
    if (currentUser) {
      navigate('/schemes');
    } else {
      navigate('/login');
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-20 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-blue-500/5"></div>
      
      <div className="relative max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-10">
          {/* Main headline */}
          <div className="space-y-6">
            <h1 className="text-6xl lg:text-7xl font-black leading-tight">
              <span className="text-gray-900">Your Gateway to</span>
              <br />
              <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-pulse">
                {t('government')}
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                {t('benefits')}
              </span>
          </h1>
          </div>

          {/* Description */}
          <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed max-w-2xl">
            {t('heroDescription')}
          </p>

          {/* Search bar */}
          <div className="relative max-w-2xl">
            <div className="flex gap-3 p-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20">
            <input
              type="text"
                className="flex-1 px-6 py-4 bg-transparent text-lg outline-none placeholder-gray-500"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
              <button 
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-3 hover:from-purple-700 hover:to-pink-700 hover:shadow-lg hover:scale-105 transition-all duration-300 transform" 
                onClick={handleSearch}
              >
                <Search className="w-6 h-6" />
              {t('search')}
            </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              className="group relative bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 transform overflow-hidden" 
              onClick={handleExploreSchemes}
            >
              <span className="relative z-10">{currentUser ? t('exploreSchemes') : 'Get Started'}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-pink-700 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            <button 
              className="group relative bg-white text-purple-600 border-2 border-purple-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-purple-600 hover:text-white hover:shadow-xl hover:scale-105 transition-all duration-300 transform" 
              onClick={() => navigate('/news')}
            >
              {t('latestNews') || 'Latest News'}
            </button>
          </div>

          {/* Authentication status message */}
          {!currentUser && (
            <div className="flex items-center justify-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">🔐</span>
              </div>
              <p className="text-gray-700 font-semibold">
                <strong>{t('loginToAccess')}</strong>
              </p>
            </div>
          )}
        </div>

        {/* Illustration and stats */}
        <div className="relative h-[600px] flex items-center justify-center">
          {/* Main illustration */}
          <div className="relative flex justify-center items-end gap-6 h-80">
            {/* Person 1 */}
            <div className="flex flex-col items-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300"></div>
              <div className="w-24 h-36 bg-gradient-to-br from-pink-500 to-purple-600 rounded-t-3xl rounded-b-lg shadow-xl group-hover:shadow-2xl transition-all duration-300"></div>
            </div>
            
            {/* Person 2 */}
            <div className="flex flex-col items-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300"></div>
              <div className="w-24 h-36 bg-gradient-to-br from-teal-400 to-blue-500 rounded-t-3xl rounded-b-lg shadow-xl group-hover:shadow-2xl transition-all duration-300 relative">
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-12 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg shadow-md"></div>
              </div>
            </div>
            
            {/* Person 3 */}
            <div className="flex flex-col items-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300"></div>
              <div className="w-24 h-36 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-t-3xl rounded-b-lg shadow-xl group-hover:shadow-2xl transition-all duration-300"></div>
            </div>
          </div>

          {/* Floating stats cards */}
          <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-white/30 hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Success Rate</p>
                <p className="text-xl font-bold text-gray-900">{t('successRate')}</p>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-32 left-8 bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-white/30 hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Verified</p>
                <p className="text-xl font-bold text-gray-900">{t('verifiedAuthentic')}</p>
              </div>
            </div>
          </div>
          
          <div className="absolute top-16 right-8 bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-white/30 hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Monthly Users</p>
                <p className="text-xl font-bold text-gray-900">{t('monthlyUsers')}</p>
          </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 