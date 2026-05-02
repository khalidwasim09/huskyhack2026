import React, { useEffect, useCallback } from 'react';
import '../styles/reflection.css';
import reflectionBg from '../assets/scenes/reflection.png';

export default function ReflectionScreen({ choiceHistory, onRestart }) {
  const handleKey = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'r' || e.key === 'R') {
      onRestart();
    }
  }, [onRestart]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  const stats = [
    { icon: '⏱', label: 'Time Lost', value: 'A childhood' },
    { icon: '📚', label: 'Education', value: 'Interrupted' },
    { icon: '🔬', label: 'Dream of Science', value: 'Erased' },
    { icon: '🔇', label: 'Voice Ignored', value: `${choiceHistory.length} times` },
  ];

  return (
    <div className="reflection-screen">
      <img src={reflectionBg} alt="" className="reflection-bg" role="presentation" />

      <div className="reflection-content">
        <div className="stats-grid">
          {stats.map((stat, i) => (
            <div key={i} className="stat-card">
              <span className="stat-icon">{stat.icon}</span>
              <p className="stat-label">{stat.label}</p>
              <p className="stat-value">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="final-message">
          <p>"Somewhere, numbers still make sense."</p>
          <p>"But no one is asking her to solve them."</p>
          <p className="final-system">
            Every year, 12 million girls are married before age 18.
            Not because they chose to.
            Because the system — tradition, poverty, fear, and silence —
            chose for them.
          </p>
        </div>

        <div className="final-divider" />

        <div className="final-cta">
          <p>You didn't choose wrong. There was no right choice.</p>
          <button className="restart-button" onClick={onRestart}>
            Experience Again
          </button>
        </div>
      </div>
    </div>
  );
}
