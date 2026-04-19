import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const API_URL = 'https://predictive-political-strategy-matrix.onrender.com/api';

const factorLabels = {
  incumbency: 'Incumbency Effect',
  partyStrength: 'Party Strength',
  pastWork: 'Past Work (OSINT)',
  personalBase: 'Personal Base',
  demographics: 'Religious/Caste Base',
  digitalSentiment: 'Digital Sentiment'
};

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#6366f1', '#ec4899'];

function ForecastEngine({ candidates, initialWeights }) {
  const [weights, setWeights] = useState(initialWeights);
  const [results, setResults] = useState([]);
  const [recalculating, setRecalculating] = useState(false);

  // Client-side instant recalculation using the calculation logic we implemented on backend
  // This fulfills the "recalculate and re-render instantly" requirement without API latency,
  // but we can also use an API call. Let's do client side for extreme responsiveness as requested.
  
  useEffect(() => {
    recalculatePoW(weights);
  }, [weights, candidates]);

  const recalculatePoW = (currentWeights) => {
    let totalRaceScore = 0;
    
    const candidatesWithScores = candidates.map(candidate => {
      let totalScore = 0;
      const scores = candidate.scores;
      
      Object.keys(currentWeights).forEach(key => {
        totalScore += (scores[key] || 0) * (currentWeights[key] || 0);
      });

      totalRaceScore += totalScore;

      return {
        name: candidate.name,
        totalScore: totalScore
      };
    });

    const finalResults = candidatesWithScores.map(c => ({
      name: c.name,
      value: totalRaceScore > 0 ? parseFloat(((c.totalScore / totalRaceScore) * 100).toFixed(2)) : 0
    }));

    setResults(finalResults);
  };

  const handleWeightChange = (e, factorKey) => {
    const val = parseFloat(e.target.value);
    setWeights(prev => ({
      ...prev,
      [factorKey]: val
    }));
  };

  // Custom label for Donut sections
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontWeight="bold" fontSize="14">
        {`${value}%`}
      </text>
    );
  };

  return (
    <div>
      <div className="donut-chart-container" style={{ height: 300, marginBottom: '2rem' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={results}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={120}
              paddingAngle={5}
              dataKey="value"
              labelLine={false}
              label={renderCustomizedLabel}
            >
              {results.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${value}%`, 'Probability of Win']} 
              contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
            />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div style={{ borderTop: '2px solid var(--border-color)', paddingTop: '1.5rem' }}>
        <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.1rem' }}>Adjust Scenario Weights <br/><span style={{fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 'normal'}}>See how probability shifts when local factors change.</span></h3>
        <div className="weights-panel">
          {Object.keys(factorLabels).map(key => (
            <div className="weight-item" key={key}>
              <label>{factorLabels[key]}</label>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.05" 
                value={weights[key]} 
                onChange={(e) => handleWeightChange(e, key)}
              />
              <span className="weight-value">{weights[key].toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ForecastEngine;
