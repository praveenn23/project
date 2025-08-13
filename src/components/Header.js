import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Flower, Sun, LogOut, Shield } from 'lucide-react';

const Header = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const { currentUser, logout, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <Flower className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Sevika
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="relative text-gray-700 hover:text-purple-600 font-semibold transition-colors duration-300 group">
              {t('home')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            {currentUser ? (
              <>
                <Link to="/schemes" className="relative text-gray-700 hover:text-purple-600 font-semibold transition-colors duration-300 group">
                  {t('schemes')}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link to="/scholarships" className="relative text-gray-700 hover:text-purple-600 font-semibold transition-colors duration-300 group">
                  {t('scholarships')}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link to="/news" className="relative text-gray-700 hover:text-purple-600 font-semibold transition-colors duration-300 group">
                  {t('news')}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </>
            ) : (
              <a href="#features" className="relative text-gray-700 hover:text-purple-600 font-semibold transition-colors duration-300 group">
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></span>
              </a>
            )}
            <Link to="/about" className="relative text-gray-700 hover:text-purple-600 font-semibold transition-colors duration-300 group">
              {t('about')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Language toggle */}
            <button 
              className="relative px-4 py-2 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 hover:from-purple-100 hover:to-pink-100 text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 transform"
              onClick={toggleLanguage}
              title={language === 'english' ? 'हिंदी में बदलें' : 'Switch to English'}
            >
              <span className="relative z-10">{language === 'english' ? 'हिंदी' : 'ENG'}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            {/* Theme toggle */}
            <button 
              className="relative p-3 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 hover:from-yellow-100 hover:to-orange-100 transition-all duration-300 hover:shadow-lg hover:scale-105 transform" 
              title="Toggle theme"
            >
              <Sun className="w-5 h-5 text-yellow-600" />
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            {/* Get Started button or Logout */}
            {currentUser ? (
              <button 
                onClick={logout} 
                className="relative flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 transform overflow-hidden group"
              >
                <LogOut size={16} className="mr-2 group-hover:rotate-12 transition-transform duration-300" />
                <span className="relative z-10">{t('logout')}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            ) : (
              <div className="flex space-x-3">
                <Link 
                  to="/admin/login" 
                  className="relative flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 transform overflow-hidden group"
                >
                  <Shield size={16} className="mr-2 group-hover:scale-110 transition-transform duration-300" />
                  <span className="relative z-10">Admin</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link 
                  to="/login" 
                  className="relative px-6 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 transform overflow-hidden group"
                >
                  <span className="relative z-10">{t('getStarted')}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 