/**
 * Calculates Candidate Total Score and Probability of Win (PoW) Percentage
 * @param {Array} candidates Array of Candidate documents
 * @param {Object} weights Object containing weights for each factor
 * @returns {Array} Array of candidate results with raw scores, total score, and PoW
 */
const calculatePoW = (candidates, weights) => {
  let totalRaceScore = 0;

  // 1. Calculate Candidate Total Score
  const candidatesWithScores = candidates.map(candidate => {
    let totalScore = 0;
    const scores = candidate.scores;
    
    // Sum weighted scores for each factor
    totalScore += (scores.incumbency || 0) * (weights.incumbency || 0);
    totalScore += (scores.partyStrength || 0) * (weights.partyStrength || 0);
    totalScore += (scores.pastWork || 0) * (weights.pastWork || 0);
    totalScore += (scores.personalBase || 0) * (weights.personalBase || 0);
    totalScore += (scores.demographics || 0) * (weights.demographics || 0);
    totalScore += (scores.digitalSentiment || 0) * (weights.digitalSentiment || 0);

    totalRaceScore += totalScore;

    return {
      _id: candidate._id,
      name: candidate.name,
      role: candidate.role,
      party: candidate.party,
      qualitativeData: candidate.qualitativeData,
      rawScores: scores,
      totalScore: totalScore
    };
  });

  // 2. Calculate PoW Percentage
  const finalResults = candidatesWithScores.map(candidate => {
    let pow = 0;
    if (totalRaceScore > 0) {
      pow = (candidate.totalScore / totalRaceScore) * 100;
    }
    return {
      ...candidate,
      powPercentage: parseFloat(pow.toFixed(2)) // Keep 2 decimal places
    };
  });

  return finalResults;
};

module.exports = { calculatePoW };
