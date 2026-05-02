import React, { useEffect, useCallback, useState } from 'react';
import '../styles/choices.css';

/**
 * Spatial ChoicePanel — choices are HIDDEN until the user pans in their direction.
 * Left choices only appear when looking left, right choices when looking right.
 * This forces exploration and makes OpenCV face tracking meaningful.
 */
export default function ChoicePanel({ choices, onChoice, disabled, panX = 0 }) {
  const [selected, setSelected] = useState(null);

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e) => {
    if (disabled || !choices || choices.length === 0 || selected !== null) return;
    const keyMap = { '1': 0, '2': 1, '3': 2 };
    const index = keyMap[e.key];
    if (index !== undefined && index < choices.length) {
      // Only allow selection if the choice is currently visible
      const choice = choices[index];
      const vis = getVisibility(choice.position, panX);
      if (vis > 0.3) {
        setSelected(index);
        setTimeout(() => onChoice(index), 600);
      }
    }
  }, [choices, onChoice, disabled, selected, panX]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    setSelected(null);
  }, [choices]);

  if (!choices || choices.length === 0) return null;

  const handleClick = (index) => {
    if (selected !== null) return;
    setSelected(index);
    setTimeout(() => onChoice(index), 600);
  };

  return (
    <div className="choices-spatial" role="group" aria-label="Story choices">
      {/* Hint to look around */}
      <div className="look-hint" style={{ opacity: Math.max(0, 1 - Math.abs(panX) * 2) }}>
        ← Look around to find your choices →
      </div>

      {choices.map((choice, index) => {
        const pos = choice.position || 'center';
        const visibility = getVisibility(pos, panX);
        const isSelected = selected === index;
        const isNotSelected = selected !== null && selected !== index;

        return (
          <button
            key={`${choice.label}-${index}`}
            className={`choice-button pos-${pos}${isSelected ? ' selected' : ''}${isNotSelected ? ' not-selected' : ''}`}
            onClick={() => handleClick(index)}
            disabled={selected !== null || visibility < 0.3}
            aria-label={`Choice ${index + 1}: ${choice.label}`}
            style={{
              opacity: isSelected ? 1 : isNotSelected ? 0 : visibility,
              transform: getTransform(pos, visibility),
              pointerEvents: visibility > 0.3 ? 'all' : 'none',
              visibility: visibility <= 0 && !isSelected ? 'hidden' : 'visible'
            }}
          >
            <span className="choice-number">{index + 1}</span>
            <span className="choice-label">{choice.label}</span>
            <span className="choice-key-hint">{index + 1}</span>
          </button>
        );
      })}

      {/* Direction hints showing there are choices to find */}
      {choices.some(c => c.position === 'left') && panX > -0.3 && (
        <div className="choice-direction dir-left" style={{ opacity: Math.max(0, 0.6 + panX * 2) }}>
          ← Something here
        </div>
      )}
      {choices.some(c => c.position === 'right') && panX < 0.3 && (
        <div className="choice-direction dir-right" style={{ opacity: Math.max(0, 0.6 - panX * 2) }}>
          Something here →
        </div>
      )}
    </div>
  );
}

/**
 * Calculate visibility of a choice based on its position and current panX.
 * Returns 0 (invisible) to 1 (fully visible).
 */
function getVisibility(position, panX) {
  switch (position) {
    case 'left':
      // Visible when looking left (panX < -0.25)
      if (panX > -0.15) return 0;
      if (panX < -0.45) return 1;
      return ((-panX) - 0.15) / 0.3;
    case 'right':
      // Visible when looking right (panX > 0.25)
      if (panX < 0.15) return 0;
      if (panX > 0.45) return 1;
      return (panX - 0.15) / 0.3;
    case 'center':
    default:
      // Visible when roughly centered
      const absP = Math.abs(panX);
      if (absP > 0.4) return 0;
      if (absP < 0.15) return 1;
      return (0.4 - absP) / 0.25;
  }
}

/**
 * Get transform for choice button based on position and visibility.
 * Choices slide in from their edge.
 */
function getTransform(position, visibility) {
  const slideOffset = (1 - visibility) * 30;
  switch (position) {
    case 'left':
      return `translateX(${-slideOffset}px)`;
    case 'right':
      return `translateX(${slideOffset}px)`;
    case 'center':
      return `translateX(-50%) translateY(${slideOffset}px)`;
    default:
      return 'none';
  }
}
