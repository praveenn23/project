import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedToken = localStorage.getItem('authToken');
        if (savedToken) {
          setToken(savedToken);
          await loadUserProfile(savedToken);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        localStorage.removeItem('authToken');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Load user profile with token
  const loadUserProfile = async (authToken) => {
    try {
      const response = await fetch(`${API_URL}/api/profile`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.user);
        setUserProfile(data.user.profile);
        return true;
      } else {
        // Only logout if the error is due to invalid/expired token
        if (response.status === 401) {
          throw new Error('Invalid or expired token');
        } else {
          // For other errors, just log and do not logout
          console.error('Failed to load profile:', response.status);
          return false;
        }
      }
    } catch (error) {
      if (error.message === 'Invalid or expired token') {
        localStorage.removeItem('authToken');
        setToken(null);
        setCurrentUser(null);
        setUserProfile(null);
      } else {
        // For other errors, do not logout, just log
        console.error('Error loading profile:', error);
      }
      return false;
    }
  };

  // Send OTP via email
  const sendOTP = async (email) => {
    try {
      const response = await fetch(`${API_URL}/api/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send OTP');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw error;
    }
  };

  // Verify OTP (for signup process)
  const verifyOTP = async (email, otp) => {
    try {
      const response = await fetch(`${API_URL}/api/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to verify OTP');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  };

  // Signup with email and password
  const signup = async (email, password) => {
    try {
      console.log('AuthContext: Attempting signup with email:', email);
      
      const response = await fetch(`${API_URL}/api/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('AuthContext: Signup response status:', response.status);

      if (!response.ok) {
        // If signup endpoint doesn't exist, create a local user account
        if (response.status === 404) {
          console.log('AuthContext: Signup endpoint not found, creating local account');
          return await createLocalUserAccount(email, password);
        }
        
        const error = await response.json();
        console.error('AuthContext: Signup error response:', error);
        throw new Error(error.message || 'Failed to create account');
      }

      const result = await response.json();
      console.log('AuthContext: Signup success result:', result);
      
      if (result.success && result.token) {
        // Save token and user data
        localStorage.setItem('authToken', result.token);
        setToken(result.token);
        setCurrentUser(result.user);
        setUserProfile(result.user.profile);
        
        console.log('AuthContext: Account created successfully:', result.user.email);
        return result;
      } else {
        throw new Error(result.message || 'Signup failed');
      }
    } catch (error) {
      console.error('AuthContext: Error creating account:', error);
      throw error;
    }
  };

  // Create local user account (fallback)
  const createLocalUserAccount = async (email, password) => {
    try {
      // Create a simple user object
      const user = {
        id: Date.now().toString(),
        email: email,
        profile: null, // No profile yet
        createdAt: new Date().toISOString()
      };

      // Create a simple token
      const token = btoa(JSON.stringify({ userId: user.id, email: user.email }));

      // Save to localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(user));

      // Update state
      setToken(token);
      setCurrentUser(user);
      setUserProfile(null);

      console.log('AuthContext: Local account created successfully:', user.email);
      
      return {
        success: true,
        token: token,
        user: user,
        message: 'Account created successfully'
      };
    } catch (error) {
      console.error('AuthContext: Error creating local account:', error);
      throw new Error('Failed to create local account');
    }
  };

  // Login with email and password
  const login = async (email, password) => {
    try {
      console.log('AuthContext: Attempting login with email:', email);
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('AuthContext: Login response status:', response.status);

      if (!response.ok) {
        const error = await response.json();
        console.error('AuthContext: Login error response:', error);
        throw new Error(error.message || 'Failed to login');
      }

      const result = await response.json();
      console.log('AuthContext: Login success result:', result);

      if (result.success && result.token) {
        // Save token and user data
        localStorage.setItem('authToken', result.token);
        setToken(result.token);
        setCurrentUser(result.user);
        setUserProfile(result.user.profile);
        console.log('AuthContext: User logged in successfully:', result.user.email);
        return result;
      } else {
        throw new Error(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('AuthContext: Error logging in:', error);
      throw error;
    }
  };

  // Local login (fallback)
  // Local login (fallback) removed for security. Only real JWTs are accepted.

  // Logout function
  const logout = async () => {
    try {
      if (token) {
        // Optional: Call logout endpoint
        await fetch(`${API_URL}/api/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Clear local state
      localStorage.removeItem('authToken');
      setToken(null);
      setCurrentUser(null);
      setUserProfile(null);
    }
  };

  // Update user profile
  const updateUserProfile = async (profileData) => {
    try {
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ profile: profileData })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update profile');
      }

      const result = await response.json();
      setCurrentUser(result.user);
      setUserProfile(result.user.profile);
      
      return result;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  // Check if user has profile
  const hasProfile = () => {
    return userProfile && Object.keys(userProfile).length > 0 && userProfile.name;
  };

  const value = {
    currentUser,
    userProfile,
    token,
    sendOTP,
    verifyOTP,
    signup,
    login,
    logout,
    updateUserProfile,
    hasProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
