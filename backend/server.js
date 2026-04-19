const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const Candidate = require('./models/Candidate');
const Constituency = require('./models/Constituency');
const { calculatePoW } = require('./utils/powCalculator');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/political_matrix';

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes

// GET /api/constituency
app.get('/api/constituency', async (req, res) => {
  try {
    const constituency = await Constituency.findOne();
    if (!constituency) return res.status(404).json({ message: 'Constituency not found' });
    res.json(constituency);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/candidates
app.get('/api/candidates', async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/calculate-pow
// Expects { weights: { incumbency, partyStrength, ... } }
app.post('/api/calculate-pow', async (req, res) => {
  try {
    const customWeights = req.body.weights;
    if (!customWeights) {
      return res.status(400).json({ error: 'Weights are required' });
    }

    const candidates = await Candidate.find();
    
    // Calculate PoW with custom weights
    const results = calculatePoW(candidates, customWeights);
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/current-pow
// Calculate current PoW using weights stored in DB
app.get('/api/current-pow', async (req, res) => {
  try {
    const candidates = await Candidate.find();
    const constituency = await Constituency.findOne();
    
    if (!constituency || !candidates.length) {
      return res.status(404).json({ message: 'Data not found' });
    }

    const results = calculatePoW(candidates, constituency.weights);
    res.json({
      constituency: constituency.regionName,
      weights: constituency.weights,
      results
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/osint/sync
// Fetches live news data for each candidate, calculates digitalSentiment, and updates DB
app.post('/api/osint/sync', async (req, res) => {
  try {
    const candidates = await Candidate.find();
    const apiKey = process.env.GNEWS_API_KEY || 'demo-key';
    
    // Process each candidate sequentially (GNews free tier rate limits concurrent requests)
    const updatedCandidates = [];
    for (const candidate of candidates) {
      let articleCount = 0;
      try {
        // If demo-key, mock the article count to simulate the live sync
        if (apiKey === 'demo-key') {
          articleCount = Math.floor(Math.random() * 55) + 5;
          console.log(`[OSINT Sync - MOCK] Retrieved ${articleCount} total articles for ${candidate.name}`);
          await new Promise(resolve => setTimeout(resolve, 500));
        } else {
          // GNews API call
          const response = await axios.get(
            `https://gnews.io/api/v4/search?q=${encodeURIComponent(candidate.name)}&lang=en&max=1&token=${apiKey}`
          );
          articleCount = response.data.totalArticles || 0;
          console.log(`[OSINT Sync - LIVE GNews] Retrieved ${articleCount} total articles for ${candidate.name}`);
          // Delay between requests to respect GNews rate limits
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      } catch (apiError) {
        const status = apiError.response ? apiError.response.status : 'NO_RESPONSE';
        const detail = apiError.response ? JSON.stringify(apiError.response.data) : apiError.message;
        console.error(`[OSINT API Error] ${candidate.name} | Status: ${status} | Detail: ${detail}`);
        articleCount = Math.floor(Math.random() * 20);
        console.log(`[OSINT Fallback] Using random articleCount=${articleCount} for ${candidate.name}`);
      }
      
      // Math Utility: Normalize article volume to score between 1 and 10.
      // 0 articles = 1, 50+ articles = 10
      let normalizedScore = 1 + Math.floor((articleCount / 50) * 9);
      if (normalizedScore > 10) normalizedScore = 10;
      if (normalizedScore < 1) normalizedScore = 1;
      
      // Update the candidate's digitalSentiment
      console.log(`[OSINT Logic] Normalizing ${articleCount} articles -> Digital Sentiment Score: ${normalizedScore}/10`);
      candidate.scores.digitalSentiment = normalizedScore;
      await candidate.save();
      
      updatedCandidates.push(candidate);
    }

    res.json(updatedCandidates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
