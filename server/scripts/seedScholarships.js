// This script seeds the database with sample scholarships.
const mongoose = require('mongoose');
const Scholarship = require('../models/Scholarship');
require('dotenv').config();

const scholarships = [
  {
    name: 'National Merit Scholarship',
    description: 'Awarded to students with outstanding academic performance.',
    eligibility: { category: ['general', 'obc'], gender: ['male', 'female'], state: ['Jharkhand'], education: ['graduate'], ageMin: 18, ageMax: 25 },
    isActive: true
  },
  {
    name: 'Women in STEM Scholarship',
    description: 'For female students pursuing STEM degrees.',
    eligibility: { gender: ['female'], education: ['graduate', 'postgraduate'], state: ['Jharkhand', 'Bihar'] },
    isActive: true
  },
  {
    name: 'Minority Community Scholarship',
    description: 'For students from minority communities.',
    eligibility: { category: ['sc', 'st', 'ews'], state: ['Jharkhand'], ageMin: 17, ageMax: 28 },
    isActive: false
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smart-sarkari-sathi');
  await Scholarship.deleteMany({});
  await Scholarship.insertMany(scholarships);
  console.log('Scholarships seeded!');
  mongoose.disconnect();
}

seed();
