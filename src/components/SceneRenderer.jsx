import React, { useState, useEffect, useCallback } from 'react';
import ParallaxScene from './ParallaxScene';
import NarrationOverlay from './NarrationOverlay';
import ChoicePanel from './ChoicePanel';
import { usePanController } from '../hooks/usePanController';
import '../styles/scene.css';

export default function SceneRenderer({ node, onChoice, onAdvance, isTransitioning }) {
  const [choiceMade, setChoiceMade] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [narrationDone, setNarrationDone] = useState(false);
  const { panX, setPanX } = usePanController();

  // Reset state when node changes
  useEffect(() => {
    setChoiceMade(false);
    setShowChoices(false);
    setNarrationDone(false);
  }, [node?.id]);

  // Show choices after narration completes
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
    setTimeout(() => onChoice(index), 600);
  }, [choiceMade, onChoice]);

  // Keyboard: Space/Enter to advance on non-choice nodes
  useEffect(() => {
    const handleKey = (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && narrationDone && (!node?.choices || node.choices.length === 0) && node?.next) {
        e.preventDefault();
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
    <div className={`scene-container${isTransitioning ? ' transitioning' : ''}`}>
      {/* Parallax background — panX passed as prop */}
      <ParallaxScene scene={node.scene} atmosphere={node.atmosphere} panX={panX} />

      {/* Narration text */}
      {node.narration && (
        <NarrationOverlay
          text={node.narration}
          emotionalResponse={node.emotionalResponse}
          onComplete={() => setNarrationDone(true)}
        />
      )}

      {/* Spatial choice buttons — hidden until user pans to them */}
      {showChoices && hasChoices && (
        <ChoicePanel
          choices={node.choices}
          onChoice={handleChoice}
          disabled={choiceMade}
          panX={panX}
        />
      )}

      {/* Continue prompt for non-choice nodes */}
      {narrationDone && isResponseNode && (
        <button className="continue-prompt" onClick={onAdvance}>
          Press Space to continue →
        </button>
      )}
    </div>
  );
}
