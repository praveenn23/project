import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Login from './components/Login';
import ProfileInput from './components/ProfileInput';
import SchemeMatcher from './components/SchemeMatcher';
import FakeNewsChecker from './components/FakeNewsChecker';
import ScholarshipResources from './components/ScholarshipResources';
import About from './components/About';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import News from './components/News';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  // Show loading while auth state is being determined
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Public Route component (only for non-authenticated users)
const PublicRoute = ({ children }) => {
  const { currentUser, hasProfile, loading } = useAuth();
  
  // Show loading while auth state is being determined
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (currentUser) {
    // If user is logged in but doesn't have a profile, redirect to profile setup
    if (!hasProfile()) {
      return <Navigate to="/profile" />;
    }
    // If user has a complete profile, redirect to home
    return <Navigate to="/" />;
  }
  
  return children;
};

function AppContent() {
  const { currentUser, hasProfile, loading } = useAuth();

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={
          <>
            <Hero />
            <Features />
          </>
        } />
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfileInput />
          </ProtectedRoute>
        } />
        <Route path="/schemes" element={
          <ProtectedRoute>
            <SchemeMatcher />
          </ProtectedRoute>
        } />
        <Route path="/fake-news" element={
          <ProtectedRoute>
            <FakeNewsChecker />
          </ProtectedRoute>
        } />
        <Route path="/scholarships" element={
          <ProtectedRoute>
            <ScholarshipResources />
          </ProtectedRoute>
        } />
        <Route path="/news" element={<News />} />
        <Route path="/about" element={<About />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
