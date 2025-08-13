import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Menu, AlertTriangle, MapPin, GraduationCap } from 'lucide-react';

const Features = () => {
  const { t } = useLanguage();

  const features = [
    {
      id: 'scheme-recommender',
      icon: <Menu className="w-8 h-8" />,
      title: t('schemeRecommender'),
      description: t('schemeRecommenderDesc'),
      link: '/schemes',
      color: 'blue'
    },
    {
      id: 'fake-news-checker',
      icon: <AlertTriangle className="w-8 h-8" />,
      title: t('fakeNewsChecker'),
      description: t('fakeNewsCheckerDesc'),
      link: '/fake-news',
      color: 'orange'
    },
    
    {
      id: 'scholarship-resources',
      icon: <GraduationCap className="w-8 h-8" />,
      title: t('scholarshipResources'),
      description: t('scholarshipResourcesDesc'),
      link: '/scholarships',
      color: 'purple'
    }
  ];

  return (
    <section className="relative bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100 py-24 overflow-hidden" id="features">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-pink-500/5 to-yellow-500/5"></div>
      
      <div className="relative max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6">
            Our <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">Features</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Discover powerful tools designed to simplify your access to government services and information
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Link 
              to={feature.link} 
              key={feature.id} 
              className="group relative bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border border-white/30 overflow-hidden"
            >
              {/* Hover effect background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${
                feature.color === 'blue' ? 'from-blue-500/10 to-cyan-500/10' :
                feature.color === 'orange' ? 'from-pink-500/10 to-red-500/10' :
                'from-purple-500/10 to-indigo-500/10'
              } opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              <div className="relative z-10">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 ${
                  feature.color === 'blue' ? 'bg-gradient-to-br from-blue-500 to-cyan-600' :
                  feature.color === 'orange' ? 'bg-gradient-to-br from-pink-500 to-red-600' :
                  'bg-gradient-to-br from-purple-500 to-indigo-600'
                }`}>
                  <div className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  {feature.description}
                </p>
                
                {/* Arrow indicator */}
                <div className="mt-6 flex items-center text-purple-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                  <span>Learn More</span>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
              
              {/* Decorative corner element */}
              <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${
                feature.color === 'blue' ? 'from-blue-500/20 to-cyan-500/20' :
                feature.color === 'orange' ? 'from-pink-500/20 to-red-500/20' :
                'from-purple-500/20 to-indigo-500/20'
              } rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
            </Link>
          ))}
        </div>
        
        {/* Bottom decorative element */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-white/60 backdrop-blur-sm rounded-full shadow-lg border border-white/30">
            <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
            <span className="text-gray-700 font-semibold">Ready to get started?</span>
            <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features; 