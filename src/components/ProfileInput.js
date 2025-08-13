import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { User, Loader, AlertCircle, CheckCircle, MapPin, GraduationCap, Briefcase, DollarSign, Users, Heart, Phone, ArrowRight } from 'lucide-react';

const ProfileInput = () => {
  const navigate = useNavigate();
  const { currentUser, updateUserProfile } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    mobile: '',
    age: '',
    gender: '',
    state: '',
    district: '',
    education: '',
    occupation: '',
    income: '',
    category: '',
    maritalStatus: '',
    disability: 'none'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!profile.mobile || profile.mobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Save profile using the new auth system
      await updateUserProfile(profile);
      console.log('Profile submitted:', profile);
      setSuccess('Profile saved successfully!');
      // Navigate to schemes page after a brief delay
      setTimeout(() => {
        navigate('/schemes');
      }, 1500);
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Error saving profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <div className="p-4 bg-blue-100 rounded-full">
              <User className="h-10 w-10 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Create Your Profile</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tell us about yourself to find the best government schemes and scholarships for you
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <span className="text-red-700 text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
            <span className="text-green-700 text-sm font-medium">{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <User className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="col-span-full md:col-span-1">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Mobile Number</label>
                <input
                  type="tel"
                  name="mobile"
                  value={profile.mobile}
                  onChange={handleInputChange}
                  placeholder="Enter 10-digit mobile number"
                  maxLength="10"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Age</label>
                <input
                  type="number"
                  name="age"
                  value={profile.age}
                  onChange={handleInputChange}
                  placeholder="Your age"
                  min="1"
                  max="120"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Gender</label>
                <select 
                  name="gender" 
                  value={profile.gender} 
                  onChange={handleInputChange} 
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">State</label>
                <input
                  type="text"
                  name="state"
                  value={profile.state}
                  onChange={handleInputChange}
                  placeholder="Your State"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">District</label>
                <input
                  type="text"
                  name="district"
                  value={profile.district}
                  onChange={handleInputChange}
                  placeholder="Your District"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Education & Occupation */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <GraduationCap className="h-6 w-6 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Education & Occupation</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Education Level</label>
                <select 
                  name="education" 
                  value={profile.education} 
                  onChange={handleInputChange} 
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                >
                  <option value="">Select Education</option>
                  <option value="primary">Primary School</option>
                  <option value="secondary">Secondary School</option>
                  <option value="higher-secondary">Higher Secondary</option>
                  <option value="diploma">Diploma</option>
                  <option value="bachelor">Bachelor's Degree</option>
                  <option value="master">Master's Degree</option>
                  <option value="phd">PhD</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Occupation</label>
                <select 
                  name="occupation" 
                  value={profile.occupation} 
                  onChange={handleInputChange} 
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                >
                  <option value="">Select Occupation</option>
                  <option value="student">Student</option>
                  <option value="employed">Employed</option>
                  <option value="unemployed">Unemployed</option>
                  <option value="self-employed">Self Employed</option>
                  <option value="retired">Retired</option>
                  <option value="homemaker">Homemaker</option>
                </select>
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <DollarSign className="h-6 w-6 text-yellow-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Financial Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Annual Income</label>
                <select 
                  name="income" 
                  value={profile.income} 
                  onChange={handleInputChange} 
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900"
                >
                  <option value="">Select Income Range</option>
                  <option value="below-1lakh">Below ₹1 Lakh</option>
                  <option value="1-3lakh">₹1-3 Lakh</option>
                  <option value="3-5lakh">₹3-5 Lakh</option>
                  <option value="5-8lakh">₹5-8 Lakh</option>
                  <option value="8-12lakh">₹8-12 Lakh</option>
                  <option value="above-12lakh">Above ₹12 Lakh</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Marital Status</label>
                <select 
                  name="maritalStatus" 
                  value={profile.maritalStatus} 
                  onChange={handleInputChange} 
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900"
                >
                  <option value="">Select Status</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category & Special Status */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Users className="h-6 w-6 text-purple-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Category & Special Status</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Category</label>
                <select 
                  name="category" 
                  value={profile.category} 
                  onChange={handleInputChange} 
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                >
                  <option value="">Select Category</option>
                  <option value="general">General</option>
                  <option value="obc">OBC</option>
                  <option value="sc">SC</option>
                  <option value="st">ST</option>
                  <option value="ews">EWS</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Disability Status</label>
                <select 
                  name="disability" 
                  value={profile.disability} 
                  onChange={handleInputChange} 
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                >
                  <option value="none">No Disability</option>
                  <option value="physical">Physical Disability</option>
                  <option value="visual">Visual Disability</option>
                  <option value="hearing">Hearing Disability</option>
                  <option value="intellectual">Intellectual Disability</option>
                  <option value="multiple">Multiple Disabilities</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-8">
            <button
              type="submit"
              disabled={loading}
              className={`px-12 py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all duration-200 ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl transform hover:-translate-y-1'
              }`}
            >
              {loading ? (
                <div className="flex items-center">
                  <Loader className="h-6 w-6 mr-3 animate-spin" />
                  Saving Profile...
                </div>
              ) : (
                <div className="flex items-center">
                  <Heart className="h-6 w-6 mr-3" />
                  Find My Schemes
                  <ArrowRight className="h-6 w-6 ml-3" />
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileInput; 