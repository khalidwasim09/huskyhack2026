import React, { useState } from 'react';
import '../styles/accessibility.css';

export default function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);

  const toggleHighContrast = () => {
    const next = !highContrast;
    setHighContrast(next);
    document.documentElement.classList.toggle('high-contrast', next);
  };

  const toggleLargeText = () => {
    const next = !largeText;
    setLargeText(next);
    document.documentElement.classList.toggle('large-text', next);
  };

  return (
    <div className="a11y-panel">
      <button
        className="a11y-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Accessibility settings"
        aria-expanded={isOpen}
      >
        ♿
      </button>

      <div className={`a11y-menu${isOpen ? ' open' : ''}`} role="menu">
        <button
          className={`a11y-option${highContrast ? ' active' : ''}`}
          onClick={toggleHighContrast}
          role="menuitemcheckbox"
          aria-checked={highContrast}
        >
          <span>High Contrast</span>
          <span className="a11y-option-indicator" />
        </button>

        <button
          className={`a11y-option${largeText ? ' active' : ''}`}
          onClick={toggleLargeText}
          role="menuitemcheckbox"
          aria-checked={largeText}
        >
          <span>Large Text</span>
          <span className="a11y-option-indicator" />
        </button>
      </div>
    </div>
  );
}
