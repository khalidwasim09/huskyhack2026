import React, { useState } from 'react';
import '../styles/intro.css';

export default function IntroScreen({ onBegin }) {
  const [fading, setFading] = useState(false);

  const handleBegin = () => {
    if (fading) return;
    setFading(true);
    setTimeout(() => onBegin(), 1200);
  };

  return (
    <main
      className={`intro-screen${fading ? ' fading' : ''}`}
      role="button"
      tabIndex={0}
      aria-label="Begin the story"
      onClick={handleBegin}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleBegin();
      }}
    >
      <div className="painted-bg" />
      <div className="paper-grain" />
      <div className="window-glow" />

      <section className="intro-card" onClick={(e) => e.stopPropagation()}>
        <p className="intro-label">An interactive story</p>

        <h1 className="intro-title">
          No Real
          <span>Choice</span>
        </h1>

        <p className="intro-subtitle">
          A story about growing up inside a system where every path seems open,
          until it closes.
        </p>

        <button className="intro-cta" onClick={handleBegin}>
          Begin the story
          <span>→</span>
        </button>
      </section>

      <p className="intro-warning">
        This experience addresses child marriage through non-graphic storytelling.
      </p>
    </main>
  );
}