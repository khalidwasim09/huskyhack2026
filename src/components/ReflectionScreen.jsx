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
    { icon: '📚', label: 'Education Interrupted', value: 'Permanently' },
    { icon: '🔮', label: 'Future Narrowed', value: 'To one path' },
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
          <p>"This is not one girl's story."</p>
          <p className="final-system">
            This is what happens when tradition, poverty, fear, and silence
            become a system. When every choice leads to the same ending,
            the problem is not the choice — it is the system.
          </p>
        </div>

        <div className="final-divider" />

        <div className="final-cta">
          <p>Every year, 12 million girls are married before age 18.</p>
          <button className="restart-button" onClick={onRestart}>
            Experience Again
          </button>
        </div>
      </div>
    </div>
  );
}
