import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Mail, CheckCircle, AlertCircle, ArrowLeft, Key, Loader, User, Lock, Eye, EyeOff, RefreshCw, LogIn, UserPlus } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const { sendOTP, verifyOTP, signup, login } = useAuth();
  const { t } = useLanguage();

  // Password generation function
  const generatePassword = () => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let generatedPassword = '';
    
    // Ensure at least one character from each category
    generatedPassword += lowercase[Math.floor(Math.random() * lowercase.length)];
    generatedPassword += uppercase[Math.floor(Math.random() * uppercase.length)];
    generatedPassword += numbers[Math.floor(Math.random() * numbers.length)];
    generatedPassword += symbols[Math.floor(Math.random() * symbols.length)];
    
    // Fill the rest randomly
    const allChars = lowercase + uppercase + numbers + symbols;
    for (let i = 4; i < 12; i++) {
      generatedPassword += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle the password
    generatedPassword = generatedPassword.split('').sort(() => Math.random() - 0.5).join('');
    
    setSignupPassword(generatedPassword);
    setConfirmPassword(generatedPassword);
  };

  // Login with email and password
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await login(email, password);
      setSuccess('Login successful! Redirecting...');
      // User will be automatically redirected by AuthContext
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await sendOTP(email);
      setOtpSent(true);
      setSuccess('OTP sent successfully to your email!');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // For signup, verify OTP and proceed to password creation
      await verifyOTP(email, otp);
      setOtpVerified(true);
      setSuccess('OTP verified successfully! Now set your password.');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (signupPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (signupPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      console.log('Starting signup process...');
      const result = await signup(email, signupPassword);
      console.log('Signup result:', result);
      
      if (result && result.success) {
        setSuccess('Account created successfully! Redirecting to profile...');
        
        // Redirect to profile form after successful signup
        setTimeout(() => {
          console.log('Redirecting to profile page...');
          navigate('/profile', { replace: true });
        }, 1500);
      } else {
        throw new Error(result?.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await sendOTP(email);
      setSuccess('OTP resent successfully!');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setOtpSent(false);
    setOtpVerified(false);
    setOtp('');
    setSignupPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
  };

  const handleBackToOTP = () => {
    setOtpVerified(false);
    setSignupPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setOtpSent(false);
    setOtpVerified(false);
    setOtp('');
    setPassword('');
    setSignupPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-blue-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Tab Navigation */}
          <div className="flex mb-8 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => handleTabChange('login')}
              className={`flex-1 flex items-center justify-center py-3 px-4 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'login'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <LogIn className="h-5 w-5 mr-2" />
              Login
            </button>
            <button
              onClick={() => handleTabChange('signup')}
              className={`flex-1 flex items-center justify-center py-3 px-4 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'signup'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Signup
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {activeTab === 'login' 
                ? 'Welcome Back'
                : (!otpSent ? 'Create Account' : otpVerified ? 'Set Password' : 'Verify OTP')
              }
            </h2>
            <p className="text-gray-600">
              {activeTab === 'login'
                ? 'Login with your email and password'
                : (!otpSent ? 'Sign up with your email to get started' : 
                   otpVerified ? 'Choose a strong password for your account' : 
                   'Enter the 6-digit code sent to your email')
              }
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

          {/* Login Form */}
          {activeTab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    disabled={loading}
                    className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors duration-200"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Use the password you created during signup
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !email || !password}
                className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-white font-semibold transition-all duration-200 ${
                  loading || !email || !password
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-xl transform hover:-translate-y-0.5'
                }`}
              >
                {loading ? (
                  <>
                    <Loader className="h-5 w-5 mr-2 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </form>
          ) : (
            /* Signup Flow */
            <>
              {/* Email Form */}
              {!otpSent ? (
                <form onSubmit={handleSendOTP} className="space-y-6">
                  <div>
                    <label htmlFor="signup-email" className="block text-sm font-semibold text-gray-900 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="signup-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                    required
                    disabled={loading}
                    className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors duration-200"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                      We'll send a verification code to your email
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-white font-semibold transition-all duration-200 ${
                  loading || !email
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-xl transform hover:-translate-y-0.5'
                }`}
              >
                {loading ? (
                  <>
                    <Loader className="h-5 w-5 mr-2 animate-spin" />
                        Sending...
                  </>
                ) : (
                      'Send Verification Code'
                )}
              </button>
            </form>
              ) : (otpVerified) ? (
                /* Password Form (Signup only) */
                <form onSubmit={handleSignup} className="space-y-6">
                  {/* Password Success Icon */}
                  <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <User className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Your Password</h3>
                    <p className="text-gray-600 text-sm">
                      Choose a strong password for your account
                    </p>
                  </div>

                  <div>
                    <label htmlFor="signup-password" className="block text-sm font-semibold text-gray-900 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showSignupPassword ? "text" : "password"}
                        id="signup-password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        disabled={loading}
                        className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showSignupPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Must be at least 8 characters long
                    </p>
                  </div>

                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-semibold text-gray-900 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirm-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                        required
                        disabled={loading}
                        className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Generate Password Button */}
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={generatePassword}
                      disabled={loading}
                      className="flex-1 flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Generate Password
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !signupPassword || !confirmPassword || signupPassword !== confirmPassword}
                    className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-white font-semibold transition-all duration-200 ${
                      loading || !signupPassword || !confirmPassword || signupPassword !== confirmPassword
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700 hover:shadow-xl transform hover:-translate-y-0.5'
                    }`}
                  >
                    {loading ? (
                      <>
                        <Loader className="h-5 w-5 mr-2 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      'Create Account & Continue to Profile'
                    )}
                  </button>

                  {/* Back to OTP */}
                  <div className="flex justify-center pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleBackToOTP}
                      disabled={loading}
                      className="flex items-center justify-center py-2 px-4 text-gray-600 font-medium hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to OTP
                    </button>
                  </div>
            </form>
          ) : (
            /* OTP Form */
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              {/* OTP Success Icon */}
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Verify Your Email</h3>
                <p className="text-gray-600 text-sm">
                      We sent a 6-digit code to {email}
                </p>
              </div>

              <div>
                <label htmlFor="otp" className="block text-sm font-semibold text-gray-900 mb-2">
                      Verification Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setOtp(value);
                    }}
                        placeholder="Enter 6-digit code"
                    maxLength="6"
                    required
                    disabled={loading}
                    className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors duration-200 text-center text-lg font-mono tracking-widest"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                      Enter the 6-digit code from your email
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-white font-semibold transition-all duration-200 ${
                  loading || otp.length < 6
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-xl transform hover:-translate-y-0.5'
                }`}
              >
                {loading ? (
                  <>
                    <Loader className="h-5 w-5 mr-2 animate-spin" />
                        Verifying...
                  </>
                ) : (
                      'Verify Code'
                )}
              </button>

              {/* OTP Actions */}
              <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="w-full py-2 px-4 text-blue-600 font-medium hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                      {loading ? 'Sending...' : 'Resend Code'}
                </button>
                
                <button
                  type="button"
                  onClick={handleBackToEmail}
                  disabled={loading}
                  className="w-full flex items-center justify-center py-2 px-4 text-gray-600 font-medium hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                      Change Email
                </button>
              </div>
            </form>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-white text-sm opacity-80">
            {activeTab === 'login' ? 'Secure login with password' : 'Secure signup with email verification'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 