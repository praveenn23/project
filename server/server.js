// User Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await User.findOne({ email });
    if (!user || !user.isVerified) {
      return res.status(401).json({ message: 'User not found or not verified' });
    }
    if (!user.password) {
      return res.status(400).json({ message: 'User has not set a password. Please complete signup.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    // Generate JWT token
    const token = generateToken(user._id);
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Failed to login', error: error.message });
  }
});
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();

// Import database and models
const connectDB = require('./config/database');
const User = require('./models/User');
const OTP = require('./models/OTP');
const Admin = require('./models/Admin');
const Scheme = require('./models/Scheme');
const { generateToken } = require('./utils/jwt');
const authMiddleware = require('./middleware/auth');
const bcrypt = require('bcryptjs');




const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

const Scholarship = require('./models/Scholarship');

// Get all scholarships (public)
app.get('/api/scholarships', async (req, res) => {
  try {
    const { isActive } = req.query;
    let filter = {};
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }
    const scholarships = await Scholarship.find(filter)
      .populate('addedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json({ scholarships, total: scholarships.length });
  } catch (error) {
    console.error('Get scholarships error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Middleware

// Allow localhost origins for development
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3001",
  "http://localhost:5173", // Vite default
  "http://127.0.0.1:5173"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Handle preflight
app.options("*", cors());

app.use(express.json());

// Rate limiting
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many OTP requests, please try again later.'
});

// Create transporter for SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD || process.env.EMAIL_APP_PASSWORD
    }
  });
};

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
app.post('/api/send-otp', otpLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + (10 * 60 * 1000)); // 10 minutes

    // Delete any existing OTPs for this email
    await OTP.deleteMany({ email });

    // Store new OTP
    await OTP.create({
      email,
      otp,
      expiresAt: otpExpiry
    });

    // Create transporter
    const transporter = createTransporter();

    // Email template
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for Smart Sarkari Sathi',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Smart Sarkari Sathi</h1>
          </div>
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">Your Login OTP</h2>
            <p style="color: #666; margin-bottom: 20px;">Hello!</p>
            <p style="color: #666; margin-bottom: 20px;">Your OTP for logging into Smart Sarkari Sathi is:</p>
            <div style="background: #667eea; color: white; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0;">
              <h1 style="font-size: 48px; margin: 0; letter-spacing: 10px;">${otp}</h1>
            </div>
            <p style="color: #666; margin-bottom: 20px;">This OTP will expire in 10 minutes.</p>
            <p style="color: #666; margin-bottom: 20px;">If you didn't request this OTP, please ignore this email.</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 12px;">This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    console.log(`OTP sent to ${email}: ${otp}`);

    res.json({ 
      success: true, 
      message: 'OTP sent successfully',
      email: email
    });

  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ 
      message: 'Failed to send OTP. Please try again.',
      error: error.message 
    });
  }
});


// Verify OTP and mark user as verified (no login yet)
app.post('/api/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }
    // Find OTP record
    const otpRecord = await OTP.findOne({ email });
    if (!otpRecord) {
      return res.status(400).json({ message: 'No OTP found. Please request a new one.' });
    }
    // Check if OTP is expired
    if (Date.now() > otpRecord.expiresAt) {
      await OTP.deleteOne({ email });
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }
    // Check attempts
    if (otpRecord.attempts >= 3) {
      await OTP.deleteOne({ email });
      return res.status(400).json({ message: 'Too many attempts. Please request a new OTP.' });
    }
    // Update attempts
    otpRecord.attempts += 1;
    await otpRecord.save();
    // Verify OTP
    if (otpRecord.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
    }
    // OTP is valid - remove from store
    await OTP.deleteOne({ email });
    // Find or create user (do not set password yet)
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        isVerified: true
      });
    } else {
      user.isVerified = true;
      user.lastLogin = new Date();
      await user.save();
    }
    res.json({ 
      success: true, 
      message: 'OTP verified successfully',
      user: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ 
      message: 'Failed to verify OTP. Please try again.',
      error: error.message 
    });
  }
});

// Set password after OTP verification (signup completion)
app.post('/api/set-password', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('[set-password] email:', email, 'password:', !!password);
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    let user = await User.findOne({ email });
    console.log('[set-password] found user:', !!user, user && user.isVerified);
    if (!user || !user.isVerified) {
      return res.status(400).json({ message: 'User not found or not verified' });
    }
    user.password = password;
    await user.save();
    console.log('[set-password] password saved for user:', user.email);
    // Generate JWT token
    const token = generateToken(user._id);
    res.json({
      success: true,
      message: 'Account created successfully! Redirecting to profile...',
      token,
      user: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Error setting password:', error);
    res.status(500).json({ message: 'Failed to set password', error: error.message });
  }
});

// Get user profile
app.get('/api/profile', authMiddleware, async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user.getPublicProfile()
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get profile', error: error.message });
  }
});

// Update user profile
app.put('/api/profile', authMiddleware, async (req, res) => {
  try {
    const { profile } = req.body;
    console.log('[profile update] user:', req.user.email, 'profile:', profile);
    if (!profile) {
      return res.status(400).json({ message: 'Profile data is required' });
    }
    req.user.profile = { ...req.user.profile, ...profile };
    await req.user.save();
    console.log('[profile update] profile saved for user:', req.user.email);
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: req.user.getPublicProfile()
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
});

// Logout (client-side handles token removal)
app.post('/api/logout', authMiddleware, async (req, res) => {
  try {
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to logout', error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Smart Sarkari Sathi API is running',
    timestamp: new Date().toISOString(),
    database: 'MongoDB',
    version: '2.0.0'
  });
});

// ============= ADMIN ROUTES =============

// Admin Login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if database is connected
    if (!mongoose.connection.readyState) {
      return res.status(503).json({ 
        message: 'Database connection not available. Please try again later.' 
      });
    }

    // Find admin with timeout
    const admin = await Admin.findOne({ email: email.toLowerCase(), isActive: true })
      .maxTimeMS(5000); // 5 second timeout
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate token using the same util as user, but with admin info
    const token = generateToken(admin._id, {
      email: admin.email,
      role: admin.role,
      type: 'admin'
    });

    res.json({
      message: 'Admin login successful',
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    // Handle specific mongoose errors
    if (error.name === 'MongooseError' && error.message.includes('buffering timed out')) {
      return res.status(503).json({ 
        message: 'Database connection timeout. Please try again.' 
      });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Create Admin (for development - remove in production)
app.post('/api/admin/create', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if admin exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin
    const admin = new Admin({
      email: email.toLowerCase(),
      password: hashedPassword,
      name
    });

    await admin.save();

    res.status(201).json({
      message: 'Admin created successfully',
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin middleware
const { verifyToken } = require('./utils/jwt');
const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const decoded = verifyToken(token);
    if (!decoded || decoded.type !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    const admin = await Admin.findById(decoded.userId || decoded.id);
    if (!admin || !admin.isActive) {
      return res.status(401).json({ message: 'Invalid admin token' });
    }
    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// ============= SCHEME MANAGEMENT =============

// Get all schemes (public)
app.get('/api/schemes', async (req, res) => {
  try {
    const { type, userId } = req.query;
    
    let filter = { isActive: true };
    if (type) {
      filter.type = type;
    }

    const schemes = await Scheme.find(filter)
      .populate('addedBy', 'name email')
      .sort({ createdAt: -1 });

    // If userId is provided, filter schemes based on user profile
    if (userId) {
      const user = await User.findById(userId);
      if (user && user.profile) {
        // Filter schemes based on user eligibility
        const eligibleSchemes = schemes.filter(scheme => {
          const eligibility = scheme.eligibility;
          const profile = user.profile;

          // Check each eligibility criteria
          if (eligibility.category && eligibility.category.length > 0 && !eligibility.category.includes(profile.category)) return false;
          if (eligibility.gender && eligibility.gender.length > 0 && !eligibility.gender.includes(profile.gender)) return false;
          if (eligibility.state && eligibility.state.length > 0 && !eligibility.state.includes(profile.state)) return false;
          if (eligibility.education && eligibility.education.length > 0 && !eligibility.education.includes(profile.education)) return false;
          if (eligibility.income && eligibility.income.length > 0 && !eligibility.income.includes(profile.income)) return false;
          if (eligibility.maritalStatus && eligibility.maritalStatus.length > 0 && !eligibility.maritalStatus.includes(profile.maritalStatus)) return false;
          if (eligibility.occupation && eligibility.occupation.length > 0 && !eligibility.occupation.includes(profile.occupation)) return false;
          if (eligibility.disability && eligibility.disability.length > 0 && !eligibility.disability.includes(profile.disability)) return false;
          
          // Check age range
          if (eligibility.ageMin && profile.age < eligibility.ageMin) return false;
          if (eligibility.ageMax && profile.age > eligibility.ageMax) return false;

          return true;
        });

        return res.json({ schemes: eligibleSchemes, total: eligibleSchemes.length });
      }
    }

    res.json({ schemes, total: schemes.length });
  } catch (error) {
    console.error('Get schemes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new scheme (admin only)
app.post('/api/admin/schemes', adminAuth, async (req, res) => {
  try {
    const schemeData = {
      ...req.body,
      addedBy: req.admin._id
    };

    const scheme = new Scheme(schemeData);
    await scheme.save();

    const populatedScheme = await Scheme.findById(scheme._id).populate('addedBy', 'name email');

    res.status(201).json({
      message: 'Scheme added successfully',
      scheme: populatedScheme
    });
  } catch (error) {
    console.error('Add scheme error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update scheme (admin only)
app.put('/api/admin/schemes/:id', adminAuth, async (req, res) => {
  try {
    const scheme = await Scheme.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('addedBy', 'name email');

    if (!scheme) {
      return res.status(404).json({ message: 'Scheme not found' });
    }

    res.json({
      message: 'Scheme updated successfully',
      scheme
    });
  } catch (error) {
    console.error('Update scheme error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete scheme (admin only)
app.delete('/api/admin/schemes/:id', adminAuth, async (req, res) => {
  try {
    const scheme = await Scheme.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!scheme) {
      return res.status(404).json({ message: 'Scheme not found' });
    }

    res.json({ message: 'Scheme deleted successfully' });
  } catch (error) {
    console.error('Delete scheme error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all schemes for admin (including inactive)
app.get('/api/admin/schemes', adminAuth, async (req, res) => {
  try {
    const schemes = await Scheme.find({})
      .populate('addedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ schemes, total: schemes.length });
  } catch (error) {
    console.error('Get admin schemes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users (admin only)
app.get('/api/admin/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find({})
      .select('-__v')
      .sort({ createdAt: -1 });

    res.json({ users, total: users.length });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ============= ERROR HANDLING =============

// 404 handler (must be after all routes)
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});


// Bind server to localhost
app.listen(PORT, 'localhost', () => {
  console.log(`🚀 Smart Sarkari Sathi API running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📧 Database: MongoDB`);
  console.log(`🔐 Authentication: JWT`);
  console.log(`🌐 CORS enabled for: ${allowedOrigins.join(', ')}`);
});
