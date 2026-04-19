const mongoose = require('mongoose');

const constituencySchema = new mongoose.Schema({
  regionName: { type: String, required: true },
  weights: {
    incumbency: { type: Number, default: 0.1 },
    partyStrength: { type: Number, default: 0.1 },
    pastWork: { type: Number, default: 0.1 },
    personalBase: { type: Number, default: 0.1 },
    demographics: { type: Number, default: 0.1 },
    digitalSentiment: { type: Number, default: 0.1 }
  }
});

module.exports = mongoose.model('Constituency', constituencySchema);
