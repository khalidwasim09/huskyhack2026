import React, { useState, useEffect, useCallback } from 'react';
import ParallaxScene from './ParallaxScene';
import NarrationOverlay from './NarrationOverlay';
import ChoicePanel from './ChoicePanel';
import '../styles/scene.css';

export default function SceneRenderer({ node, onChoice, onAdvance, isTransitioning }) {
  const [choiceMade, setChoiceMade] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [narrationDone, setNarrationDone] = useState(false);

  // Reset state when node changes
  useEffect(() => {
    setChoiceMade(false);
    setShowChoices(false);
    setNarrationDone(false);
  }, [node?.id]);

  // Show choices after narration completes (small delay for breathing room)
  useEffect(() => {
    if (narrationDone && node?.choices?.length > 0 && !choiceMade) {
      const timer = setTimeout(() => setShowChoices(true), 600);
      return () => clearTimeout(timer);
    }
  }, [narrationDone, node, choiceMade]);

  const handleChoice = useCallback((index) => {
    if (choiceMade) return;
    setChoiceMade(true);
    setShowChoices(false);
    // Brief delay to show selection animation, then advance
    setTimeout(() => onChoice(index), 600);
  }, [choiceMade, onChoice]);

  const handleNarrationClick = useCallback(() => {
    if (narrationDone && (!node?.choices || node.choices.length === 0)) {
      onAdvance();
    }
  }, [narrationDone, node, onAdvance]);

  // Keyboard: Space/Enter to advance on response nodes
  useEffect(() => {
    const handleKey = (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && narrationDone && (!node?.choices || node.choices.length === 0)) {
        onAdvance();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [narrationDone, node, onAdvance]);

  if (!node) return null;

  const hasChoices = node.choices && node.choices.length > 0;
  const isResponseNode = !hasChoices && node.next;

  return (
    <div className={`scene-container${isTransitioning ? ' transitioning' : ''}${showChoices && hasChoices ? ' has-choices' : ''}`}>
      {/* Parallax background */}
      <ParallaxScene scene={node.scene} atmosphere={node.atmosphere} />

      {/* Narration text */}
      {node.narration && (
        <NarrationOverlay
          text={node.narration}
          emotionalResponse={node.emotionalResponse}
          onComplete={() => setNarrationDone(true)}
        />
      )}

      {/* Choice buttons */}
      {showChoices && hasChoices && (
        <ChoicePanel
          choices={node.choices}
          onChoice={handleChoice}
          disabled={choiceMade}
        />
      )}

      {/* Continue prompt for response nodes */}
      {narrationDone && isResponseNode && (
        <button className="continue-prompt" onClick={handleNarrationClick}>
          Press Space to continue →
        </button>
      )}
    </div>
  );
}
