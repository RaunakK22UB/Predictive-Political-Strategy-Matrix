import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function StrategicGapsVisualizer({ candidates }) {
  const chartData = [
    { factor: 'Incumbency' },
    { factor: 'Party Strength' },
    { factor: 'Past Work' },
    { factor: 'Personal Base' },
    { factor: 'Demographics' },
    { factor: 'Digital Sentiment' }
  ];

  // Map the candidate scores to the chart config
  const factorKeys = [
    'incumbency', 
    'partyStrength', 
    'pastWork', 
    'personalBase', 
    'demographics', 
    'digitalSentiment'
  ];

  chartData.forEach((dataPoint, index) => {
    candidates.forEach((candidate) => {
      dataPoint[candidate.name] = candidate.scores[factorKeys[index]];
    });
  });

  const colors = ['#0ea5e9', '#10b981', '#f59e0b', '#6366f1', '#ec4899'];

  return (
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="factor" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 10]} />
          <Tooltip 
            cursor={{fill: '#f1f5f9'}}
            contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} 
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          
          {candidates.map((c, i) => (
            <Bar 
              key={c._id} 
              dataKey={c.name} 
              fill={colors[i % colors.length]} 
              radius={[4, 4, 0, 0]} 
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StrategicGapsVisualizer;
