import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ComparativeTable from './components/ComparativeTable';
import StrategicGapsVisualizer from './components/StrategicGapsVisualizer';
import ForecastEngine from './components/ForecastEngine';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [candidates, setCandidates] = useState([]);
  const [constituency, setConstituency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [candidatesRes, constituencyRes] = await Promise.all([
          axios.get(`${API_URL}/candidates`),
          axios.get(`${API_URL}/constituency`)
        ]);
        
        setCandidates(candidatesRes.data);
        setConstituency(constituencyRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);

  const handleOsintSync = async () => {
    setIsSyncing(true);
    try {
      const response = await axios.post(`${API_URL}/osint/sync`);
      setCandidates(response.data);
    } catch (error) {
      console.error('Error syncing OSINT data:', error);
      alert('Error syncing OSINT data');
    } finally {
      setIsSyncing(false);
    }
  };

  if (loading) {
    return <div className="loading-container">Loading Intelligence Data...</div>;
  }

  if (!candidates.length || !constituency) {
    return <div className="loading-container">Error: Database empty or server offline.</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Predictive Political Strategy Matrix</h1>
        <p>Intelligence Dashboard for {constituency.regionName}</p>
        <button 
          onClick={handleOsintSync} 
          disabled={isSyncing}
          style={{
            marginTop: '1rem',
            padding: '0.6rem 1.2rem',
            backgroundColor: isSyncing ? '#9ca3af' : 'var(--primary-color)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1rem',
            cursor: isSyncing ? 'not-allowed' : 'pointer',
            fontWeight: '600'
          }}
        >
          {isSyncing ? 'Fetching live web data...' : 'Sync Live OSINT Data'}
        </button>
      </header>

      <section className="card">
        <h2 className="card-title">Candidate Comparative Analysis</h2>
        <ComparativeTable candidates={candidates} />
      </section>

      <div className="grid-2">
        <section className="card">
          <h2 className="card-title">Strategic Gaps</h2>
          <StrategicGapsVisualizer candidates={candidates} />
        </section>

        <section className="card">
          <h2 className="card-title">Forecast Engine (Live PoW)</h2>
          <ForecastEngine 
            candidates={candidates} 
            initialWeights={constituency.weights} 
          />
        </section>
      </div>
    </div>
  );
}

export default App;
