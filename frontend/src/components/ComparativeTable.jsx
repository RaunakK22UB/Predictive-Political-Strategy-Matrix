import React from 'react';

const factors = [
  { key: 'incumbency', label: 'Incumbency Effect' },
  { key: 'partyStrength', label: 'Party Strength' },
  { key: 'pastWork', label: 'Past Work (OSINT)' },
  { key: 'personalBase', label: 'Personal Base' },
  { key: 'demographics', label: 'Religious/Caste Base' },
  { key: 'digitalSentiment', label: 'Digital Sentiment' }
];

const getScoreClass = (score) => {
  if (score >= 8) return 'score-high';
  if (score >= 5) return 'score-medium';
  return 'score-low';
};

function ComparativeTable({ candidates }) {
  return (
    <div className="table-wrapper">
      <table className="strategic-table">
        <thead>
          <tr>
            <th className="factor-col">Matrix Factors</th>
            {candidates.map(c => (
              <th key={c._id}>
                {c.name} <br/>
                <span style={{ fontSize: '0.85em', fontWeight: 'normal', color: 'var(--text-muted)' }}>
                  {c.party} ({c.role})
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Render Factor Rows */}
          {factors.map(factor => (
            <tr key={factor.key}>
              <td className="factor-col">{factor.label}</td>
              {candidates.map(c => (
                <td key={c._id}>
                  <span className={`score-badge ${getScoreClass(c.scores[factor.key])}`}>
                    {c.scores[factor.key]} / 10
                  </span>
                </td>
              ))}
            </tr>
          ))}
          
          {/* Qualitative Data Row */}
          <tr>
            <td className="factor-col" style={{ verticalAlign: 'top' }}>Qualitative Intel (Stance)</td>
            {candidates.map(c => (
              <td key={c._id} style={{ verticalAlign: 'top' }}>
                <div className="qualitative-text">
                  {c.qualitativeData.stance}
                </div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ComparativeTable;
