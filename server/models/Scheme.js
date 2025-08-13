const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  eligibility: {
    category: [String], // ['general', 'obc', 'sc', 'st']
    gender: [String], // ['male', 'female', 'other']
    ageMin: Number,
    ageMax: Number,
    education: [String], // ['high-school', 'intermediate', 'bachelor', 'master']
    income: [String], // ['below-1lakh', '1-3lakh', '3-5lakh', '5-10lakh']
    state: [String],
    maritalStatus: [String], // ['single', 'married', 'divorced', 'widowed']
    occupation: [String], // ['student', 'unemployed', 'employed', 'self-employed']
    disability: [String] // ['none', 'physical', 'visual', 'hearing', 'mental']
  },
  benefits: {
    type: String,
    required: true
  },
  applicationProcess: {
    type: String,
    required: true
  },
  documents: [String],
  videoLink: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Please provide a valid URL'
    }
  },
  applicationLink: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Please provide a valid URL'
    }
  },
  lastDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  type: {
    type: String,
    enum: ['scheme', 'scholarship'],
    required: true
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient querying
schemeSchema.index({ type: 1, isActive: 1 });
schemeSchema.index({ 'eligibility.category': 1 });
schemeSchema.index({ 'eligibility.state': 1 });

module.exports = mongoose.model('Scheme', schemeSchema);
