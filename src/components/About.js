import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const About = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 py-20 px-5">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 bg-white p-16 rounded-2xl shadow-lg">
          <h1 className="text-5xl font-bold text-gray-800 mb-5">
            {t('aboutTitle')}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
            {t('aboutDescription')}
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white p-12 rounded-2xl mb-8 shadow-lg">
          <h2 className="text-3xl font-semibold text-gray-800 mb-5">
            {t('ourMission')}
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            {t('missionDescription')}
          </p>
        </div>

        {/* Features Section */}
        <div className="bg-white p-12 rounded-2xl mb-8 shadow-lg">
          <h2 className="text-3xl font-semibold text-gray-800 mb-8">
            {t('whatWeOffer')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="py-5">
              <h3 className="text-xl font-semibold text-pink-600 mb-3">
                🔍 {t('searchDiscover')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('searchDescription')}
              </p>
            </div>
            
            <div className="py-5">
              <h3 className="text-xl font-semibold text-pink-600 mb-3">
                🎯 {t('personalizedRecommendations')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('personalizedDescription')}
              </p>
            </div>
            
            <div className="py-5">
              <h3 className="text-xl font-semibold text-pink-600 mb-3">
                🌐 {t('multilingualSupport')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('multilingualDescription')}
              </p>
            </div>
            
            <div className="py-5">
              <h3 className="text-xl font-semibold text-pink-600 mb-3">
                🤖 {t('aiPowered')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('aiDescription')}
              </p>
            </div>
          </div>
        </div>

        {/* Vision Section */}
        <div className="bg-white p-12 rounded-2xl mb-8 shadow-lg">
          <h2 className="text-3xl font-semibold text-gray-800 mb-5">
            {t('ourVision')}
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-5">
            {t('visionDescription1')}
          </p>
          <p className="text-lg text-gray-800 leading-relaxed font-semibold">
            {t('visionDescription2')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
