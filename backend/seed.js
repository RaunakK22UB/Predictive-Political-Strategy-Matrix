const mongoose = require('mongoose');
const Constituency = require('./models/Constituency');
const Candidate = require('./models/Candidate');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/political_matrix';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Constituency.deleteMany({});
    await Candidate.deleteMany({});

    // 1. Seed Constituency Weights
    const constituency = new Constituency({
      regionName: 'Central District (Demo Region)',
      weights: {
        incumbency: 0.15,
        partyStrength: 0.25,
        pastWork: 0.20,
        personalBase: 0.15,
        demographics: 0.15,
        digitalSentiment: 0.10
      }
    });
    await constituency.save();
    console.log('Constituency seeded!');

    // 2. Seed Candidates
    const candidates = [
      {
        name: 'John Adams',
        role: 'Incumbent',
        party: 'National Party',
        scores: {
          incumbency: 8,
          partyStrength: 7,
          pastWork: 6,
          personalBase: 5,
          demographics: 6,
          digitalSentiment: 4
        },
        qualitativeData: {
          stance: 'Established power, strong traditional base but low youth appeal.'
        }
      },
      {
        name: 'Sarah Chen',
        role: 'Challenger',
        party: 'Progressive Alliance',
        scores: {
          incumbency: 2,
          partyStrength: 8,
          pastWork: 7,
          personalBase: 6,
          demographics: 8,
          digitalSentiment: 9
        },
        qualitativeData: {
          stance: 'High social activism, heavy digital momentum, strong youth support.'
        }
      },
      {
        name: 'Marcus Vance',
        role: 'Independent',
        party: 'Independent',
        scores: {
          incumbency: 1,
          partyStrength: 2,
          pastWork: 9,
          personalBase: 8,
          demographics: 5,
          digitalSentiment: 7
        },
        qualitativeData: {
          stance: 'Split support, great grassroots community work, but lacks party machinery.'
        }
      }
    ];

    await Candidate.insertMany(candidates);
    console.log('Candidates seeded!');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
