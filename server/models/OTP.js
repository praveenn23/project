const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  otp: {
    type: String,
    required: true
  },
  attempts: {
    type: Number,
    default: 0,
    max: 3
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 } // Automatically delete expired documents
  }
}, {
  timestamps: true
});

// Index for better query performance
otpSchema.index({ email: 1 });
otpSchema.index({ email: 1, otp: 1 });

module.exports = mongoose.model('OTP', otpSchema);
