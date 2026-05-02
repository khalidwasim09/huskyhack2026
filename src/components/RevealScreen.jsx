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

  // Choice labels for the branch visualization (main 3 decision points)
  const allChoiceLabels = [
    ['Explained', 'Refused', 'Left'],
    ['Argued', 'Went quiet', 'Begged'],
    ['Went back', 'Hid', 'Ran to teacher'],
  ];

  // Get user's actual choices — the 3 main decision points
  const act2Choice = choiceHistory.find(c => c.act === 2);
  const act3Choice = choiceHistory.find(c => c.act === 3);
  // Act 4 has two choice points — get the escape choice (the run)
  const act4Choices = choiceHistory.filter(c => c.act === 4);
  const escapeChoice = act4Choices.find(c => c.nodeId === 'the_run') || act4Choices[act4Choices.length - 1];

  return (
    <div className="reveal-screen">
      <img src={revealBg} alt="" className="reveal-bg" role="presentation" />

      <div className="reveal-content">
        {/* Branch SVG */}
        <div className="branch-visualization">
          <svg viewBox="0 0 1000 450" className="branch-svg" aria-label="All story paths converge to the same outcome">
            {/* Act 1 branches — The Announcement */}
            {allChoiceLabels[0].map((label, i) => {
              const startX = 300 + i * 200;
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
                    d={`M ${startX} 36 C ${startX} 80, ${300 + i * 200} 100, 500 130`}
                    className="branch-line"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  />
                </g>
              );
            })}

            {/* Convergence point 1 */}
            <circle cx={500} cy={130} r={5} className="branch-node" style={{ animationDelay: '1s' }} />
            
            {/* Fact 1 - Far Right Margin */}
            <path d="M 505 130 L 720 130" className="branch-line" style={{ strokeDasharray: '4', opacity: 0.3, animationDelay: '1.2s' }} />
            <foreignObject x="730" y="100" width="220" height="60">
              <div xmlns="http://www.w3.org/1999/xhtml" className="branch-fact-box" style={{ animationDelay: '1.5s' }}>
                <strong>12M+</strong> girls are married before age 18 every year.
              </div>
            </foreignObject>

            {/* Act 2 branches — The Pressure */}
            {allChoiceLabels[1].map((label, i) => {
              const startX = 300 + i * 200;
              const selected = act3Choice?.choiceIndex === i;
              return (
                <g key={`a2-${i}`}>
                  <path
                    d={`M 500 135 C 500 160, ${startX} 170, ${startX} 190`}
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
                    d={`M ${startX} 196 C ${startX} 230, 500 250, 500 270`}
                    className="branch-line"
                    style={{ animationDelay: `${1.5 + i * 0.3}s` }}
                  />
                </g>
              );
            })}

            {/* Convergence point 2 */}
            <circle cx={500} cy={270} r={5} className="branch-node" style={{ animationDelay: '2.2s' }} />
            
            {/* Fact 2 - Far Left Margin */}
            <path d="M 495 270 L 280 270" className="branch-line" style={{ strokeDasharray: '4', opacity: 0.3, animationDelay: '2.4s' }} />
            <foreignObject x="50" y="240" width="220" height="60">
              <div xmlns="http://www.w3.org/1999/xhtml" className="branch-fact-box fact-left" style={{ animationDelay: '2.7s' }}>
                <strong>35%</strong> of young women in Sub-Saharan Africa are married in childhood.
              </div>
            </foreignObject>

            {/* Act 3 branches — The Night Before */}
            {allChoiceLabels[2].map((label, i) => {
              const startX = 300 + i * 200;
              const selected = escapeChoice?.choiceIndex === i;
              return (
                <g key={`a3-${i}`}>
                  <path
                    d={`M 500 275 C 500 300, ${startX} 310, ${startX} 320`}
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
                    d={`M ${startX} 326 C ${startX} 355, 500 365, 500 375`}
                    className="branch-line"
                    style={{ animationDelay: `${2.7 + i * 0.3}s` }}
                  />
                </g>
              );
            })}

            {/* Final convergence — the reveal */}
            <circle cx={500} cy={380} r={8} className="branch-node branch-node--end" />
            
            {/* Fact 3 - Far Right Margin */}
            <path d="M 510 380 L 720 380" className="branch-line" style={{ strokeDasharray: '4', opacity: 0.3, animationDelay: '3.2s' }} />
            <foreignObject x="730" y="350" width="220" height="60">
              <div xmlns="http://www.w3.org/1999/xhtml" className="branch-fact-box fact-highlight" style={{ animationDelay: '3.5s' }}>
                <strong>1 in 5</strong> girls globally are married before adulthood.
              </div>
            </foreignObject>
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

            <button className="reveal-continue" onClick={onContinue} style={{ animationDelay: '2s' }}>
              Continue →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
