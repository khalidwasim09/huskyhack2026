import React, { useState, useEffect, useCallback } from 'react';
import { useStoryState } from '../hooks/useStoryState';
import { useAmbientAudio } from '../hooks/useAmbientAudio';
import IntroScreen from './IntroScreen';
import SceneRenderer from './SceneRenderer';
import RevealScreen from './RevealScreen';
import ReflectionScreen from './ReflectionScreen';
import AccessibilityPanel from './AccessibilityPanel';

export default function StoryEngine() {
  const {
    currentNode,
    currentNodeId,
    choiceHistory,
    isTransitioning,
    makeChoice,
    advanceToNext,
    restart,
  } = useStoryState();

  const { init: initAudio, setMood, fadeOut } = useAmbientAudio();
  const [phase, setPhase] = useState('intro'); // intro | scene | reveal | reflection

  // Update phase based on current node — no act transitions, seamless flow
  useEffect(() => {
    if (!currentNode) return;

    if (currentNode.id === 'intro') return;

    if (currentNode.id === 'reveal') {
      setPhase('reveal');
      return;
    }

    if (currentNode.id === 'reflection') {
      setPhase('reflection');
      return;
    }

    setPhase('scene');
  }, [currentNodeId, currentNode]);

  // Update audio mood when atmosphere changes
  useEffect(() => {
    if (currentNode?.atmosphere && phase !== 'intro') {
      setMood(currentNode.atmosphere);
    }
  }, [currentNode?.atmosphere, phase, setMood]);

  const handleBegin = useCallback(() => {
    // Initialize audio on user interaction (required by browsers)
    initAudio();
    setMood('warm_dim');
    advanceToNext();
  }, [initAudio, setMood, advanceToNext]);

  const handleRevealContinue = useCallback(() => {
    advanceToNext();
  }, [advanceToNext]);

  const handleRestart = useCallback(() => {
    setPhase('intro');
    fadeOut();
    restart();
  }, [restart, fadeOut]);

  return (
    <>
      <AccessibilityPanel />

      {phase === 'intro' && (
        <IntroScreen onBegin={handleBegin} />
      )}

      {phase === 'scene' && currentNode && (
        <SceneRenderer
          node={currentNode}
          onChoice={makeChoice}
          onAdvance={advanceToNext}
          isTransitioning={isTransitioning}
        />
      )}

      {phase === 'reveal' && (
        <RevealScreen
          choiceHistory={choiceHistory}
          onContinue={handleRevealContinue}
        />
      )}

      {phase === 'reflection' && (
        <ReflectionScreen
          choiceHistory={choiceHistory}
          onRestart={handleRestart}
        />
      )}
    </>
  );
}
