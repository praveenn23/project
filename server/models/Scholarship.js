const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  eligibility: {
    category: [String],
    gender: [String],
    state: [String],
    education: [String],
    income: [String],
    occupation: [String],
    maritalStatus: [String],
    disability: [String],
    ageMin: Number,
    ageMax: Number
  },
  isActive: { type: Boolean, default: true },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Scholarship', scholarshipSchema);
