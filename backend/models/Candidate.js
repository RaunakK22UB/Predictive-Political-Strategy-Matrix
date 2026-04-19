const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true }, // Incumbent, Challenger, Independent
  party: { type: String, required: true },
  scores: {
    incumbency: { type: Number, required: true },
    partyStrength: { type: Number, required: true },
    pastWork: { type: Number, required: true },
    personalBase: { type: Number, required: true },
    demographics: { type: Number, required: true },
    digitalSentiment: { type: Number, required: true }
  },
  qualitativeData: {
    stance: { type: String, required: true }
  }
});

module.exports = mongoose.model('Candidate', candidateSchema);
