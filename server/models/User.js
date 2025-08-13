const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: false // Will be required after signup
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  profile: {
    name: String,
    age: Number,
    gender: {
      type: String,
      enum: ['male', 'female', 'other']
    },
    category: {
      type: String,
      enum: ['general', 'obc', 'sc', 'st', 'ews']
    },
    income: String,
    education: String,
    occupation: String,
    state: String,
    district: String,
    maritalStatus: {
      type: String,
      enum: ['single', 'married', 'divorced', 'widowed']
    },
    disability: {
      type: String,
      enum: ['none', 'physical', 'visual', 'hearing', 'intellectual', 'multiple']
    }
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving if modified
userSchema.pre('save', async function(next) {
  if (this.isModified('password') && this.password) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// Index for better query performance
userSchema.index({ isVerified: 1 });

// Instance method to get public profile
userSchema.methods.getPublicProfile = function() {
  return {
    id: this._id,
    email: this.email,
    isVerified: this.isVerified,
    profile: this.profile,
    lastLogin: this.lastLogin,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('User', userSchema);
