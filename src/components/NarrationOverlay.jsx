import React, { useEffect } from 'react';
import { useTypewriter } from '../hooks/useTypewriter';

export default function NarrationOverlay({ text, emotionalResponse, onComplete }) {
  const { displayedText, isComplete, skip } = useTypewriter(text, 30, 800);

  // Auto-signal completion when typewriter finishes
  useEffect(() => {
    if (isComplete && onComplete) {
      onComplete();
    }
  }, [isComplete, onComplete]);

  return (
    <div
      className="narration-area"
      onClick={() => {
        if (!isComplete) skip();
      }}
    >
      <div className="narration-text-wrapper">
        <p className="narration-text" aria-live="polite">
          {displayedText}
          {!isComplete && <span className="narration-cursor" />}
        </p>

        {isComplete && emotionalResponse && (
          <p className="emotional-response">{emotionalResponse}</p>
        )}
      </div>
    </div>
  );
}
