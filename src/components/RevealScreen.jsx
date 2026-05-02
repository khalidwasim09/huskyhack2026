import React, { useState, useEffect, useCallback } from 'react';
import '../styles/reveal.css';
import revealBg from '../assets/scenes/reveal.png';

export default function RevealScreen({ choiceHistory, onContinue }) {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowText(true), 3500);
    return () => clearTimeout(timer);
  }, []);

  // Handle keyboard
  const handleKey = useCallback((e) => {
    if ((e.key === 'Enter' || e.key === ' ') && showText) {
      onContinue();
    }
  }, [showText, onContinue]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  // Choice labels for the branch visualization
  const allChoiceLabels = [
    ['Stay calm', 'Refuse', 'Leave'],
    ['Argue', 'Stay quiet', 'Ask mother'],
    ['Go back', 'Hide', 'Run to teacher'],
  ];

  // Get user's actual choices per act
  const act2Choice = choiceHistory.find(c => c.act === 2);
  const act3Choice = choiceHistory.find(c => c.act === 3);
  const act4Choice = choiceHistory.find(c => c.act === 4);

  const userChoices = [act2Choice, act3Choice, act4Choice];

  return (
    <div className="reveal-screen">
      <img src={revealBg} alt="" className="reveal-bg" role="presentation" />

      <div className="reveal-content">
        {/* Branch SVG */}
        <div className="branch-visualization">
          <svg viewBox="0 0 600 400" className="branch-svg" aria-label="All story paths converge to the same outcome">
            {/* Act 1 branches — The Announcement */}
            {allChoiceLabels[0].map((label, i) => {
              const startX = 100 + i * 200;
              const selected = act2Choice?.choiceIndex === i;
              return (
                <g key={`a1-${i}`}>
                  <circle
                    cx={startX} cy={30} r={selected ? 6 : 4}
                    className="branch-node"
                    style={{ animationDelay: `${i * 0.3}s`, fill: selected ? 'var(--accent-warm)' : 'var(--text-dim)' }}
                  />
                  <text x={startX} y={15} className="branch-label" style={{ animationDelay: `${i * 0.3}s` }}>
                    {label}
                  </text>
                  <path
                    d={`M ${startX} 36 C ${startX} 80, ${100 + i * 200} 100, ${200} 130`}
                    className="branch-line"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  />
                </g>
              );
            })}

            {/* Convergence point 1 */}
            <circle cx={200} cy={130} r={5} className="branch-node" style={{ animationDelay: '1s' }} />

            {/* Act 2 branches — The Pressure */}
            {allChoiceLabels[1].map((label, i) => {
              const startX = 100 + i * 200;
              const selected = act3Choice?.choiceIndex === i;
              return (
                <g key={`a2-${i}`}>
                  <path
                    d={`M 200 135 C 200 160, ${startX} 170, ${startX} 190`}
                    className="branch-line"
                    style={{ animationDelay: `${1.2 + i * 0.3}s` }}
                  />
                  <circle
                    cx={startX} cy={190} r={selected ? 6 : 4}
                    className="branch-node"
                    style={{ animationDelay: `${1.2 + i * 0.3}s`, fill: selected ? 'var(--accent-warm)' : 'var(--text-dim)' }}
                  />
                  <text x={startX} y={210} className="branch-label" style={{ animationDelay: `${1.2 + i * 0.3}s` }}>
                    {label}
                  </text>
                  <path
                    d={`M ${startX} 196 C ${startX} 230, 300 250, 300 270`}
                    className="branch-line"
                    style={{ animationDelay: `${1.5 + i * 0.3}s` }}
                  />
                </g>
              );
            })}

            {/* Convergence point 2 */}
            <circle cx={300} cy={270} r={5} className="branch-node" style={{ animationDelay: '2.2s' }} />

            {/* Act 3 branches — The Night Before */}
            {allChoiceLabels[2].map((label, i) => {
              const startX = 100 + i * 200;
              const selected = act4Choice?.choiceIndex === i;
              return (
                <g key={`a3-${i}`}>
                  <path
                    d={`M 300 275 C 300 300, ${startX} 310, ${startX} 320`}
                    className="branch-line"
                    style={{ animationDelay: `${2.4 + i * 0.3}s` }}
                  />
                  <circle
                    cx={startX} cy={320} r={selected ? 6 : 4}
                    className="branch-node"
                    style={{ animationDelay: `${2.4 + i * 0.3}s`, fill: selected ? 'var(--accent-warm)' : 'var(--text-dim)' }}
                  />
                  <text x={startX} y={340} className="branch-label" style={{ animationDelay: `${2.4 + i * 0.3}s` }}>
                    {label}
                  </text>
                  <path
                    d={`M ${startX} 326 C ${startX} 355, 300 365, 300 375`}
                    className="branch-line"
                    style={{ animationDelay: `${2.7 + i * 0.3}s` }}
                  />
                </g>
              );
            })}

            {/* Final convergence — the reveal */}
            <circle cx={300} cy={380} r={8} className="branch-node branch-node--end" />
          </svg>
        </div>

        {/* Reveal text */}
        {showText && (
          <div className="reveal-text-block" style={{ animation: 'fadeInUp 1.2s var(--ease-out) forwards' }}>
            <p className="reveal-main-text">
              You made choices.
              <span className="reveal-highlight">They did not matter.</span>
            </p>
            <p className="reveal-sub-text">
              Some lives are decided long before the person living them has a say.
            </p>
            <button className="reveal-continue" onClick={onContinue}>
              Continue →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
