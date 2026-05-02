import React, { useEffect, useCallback } from 'react';
import '../styles/choices.css';

export default function ChoicePanel({ choices, onChoice, disabled }) {
  // Keyboard shortcuts for choosing (1, 2, 3)
  const handleKeyDown = useCallback((e) => {
    if (disabled || !choices || choices.length === 0) return;

    const keyMap = { '1': 0, '2': 1, '3': 2 };
    const index = keyMap[e.key];

    if (index !== undefined && index < choices.length) {
      onChoice(index);
    }
  }, [choices, onChoice, disabled]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!choices || choices.length === 0) return null;

  return (
    <div className="choices-container" role="group" aria-label="Story choices">
      {choices.map((choice, index) => (
        <button
          key={`${choice.label}-${index}`}
          className={`choice-button${disabled ? ' not-selected' : ''}`}
          onClick={() => !disabled && onChoice(index)}
          disabled={disabled}
          aria-label={`Choice ${index + 1}: ${choice.label}`}
        >
          <span className="choice-number">{index + 1}</span>
          <span className="choice-label">{choice.label}</span>
          <span className="choice-key-hint">{index + 1}</span>
        </button>
      ))}
    </div>
  );
}
