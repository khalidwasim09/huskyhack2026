import React, { useState } from 'react';
import '../styles/intro.css';

export default function IntroScreen({ onBegin }) {
  const [fading, setFading] = useState(false);

  const handleBegin = () => {
    setFading(true);
    setTimeout(() => onBegin(), 1500);
  };

  return (
    <div
      className={`intro-screen${fading ? ' fading' : ''}`}
      onClick={handleBegin}
      role="button"
      tabIndex={0}
      aria-label="Begin the story"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleBegin();
      }}
    >
      <div className="intro-vignette" />

      <div className="intro-content">
        <p className="intro-label">An Interactive Experience</p>

        <h1 className="intro-title">
          No Real <em>Choice</em>
        </h1>

        <p className="intro-subtitle">
          An interactive story about the illusion of choice
          when the system is built against you.
        </p>

        <button className="intro-cta" onClick={handleBegin} aria-label="Begin">
          Begin <span className="cta-arrow">→</span>
        </button>
      </div>

      <p className="intro-warning">
        This experience addresses child marriage through storytelling.
        No graphic imagery is shown. Viewer discretion is advised.
      </p>
    </div>
  );
}
