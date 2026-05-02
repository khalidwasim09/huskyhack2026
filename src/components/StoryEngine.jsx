import React, { useState, useEffect, useCallback } from 'react';
import { useStoryState } from '../hooks/useStoryState';
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
    isNewAct,
    makeChoice,
    advanceToNext,
    acknowledgeAct,
    restart,
  } = useStoryState();

  const [phase, setPhase] = useState('intro'); // intro | act-transition | scene | reveal | reflection
  const [actTransitionData, setActTransitionData] = useState(null);

  // Handle act transitions
  useEffect(() => {
    if (!currentNode) return;

    if (currentNode.id === 'intro') {
      // Stay in intro, handled by IntroScreen
      return;
    }

    if (currentNode.act === 4) {
      setPhase('reveal');
      return;
    }

    if (currentNode.act === 5) {
      setPhase('reflection');
      return;
    }

    // Show act transition for new acts with actTitle
    if (currentNode.actTitle && isNewAct) {
      setActTransitionData({
        number: currentNode.act,
        title: currentNode.actTitle,
      });
      setPhase('act-transition');

      // Auto-dismiss act transition after 3 seconds
      const timer = setTimeout(() => {
        acknowledgeAct();
        setPhase('scene');
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setPhase('scene');
    }
  }, [currentNodeId, currentNode, isNewAct, acknowledgeAct]);

  const handleBegin = useCallback(() => {
    advanceToNext();
  }, [advanceToNext]);

  const handleRevealContinue = useCallback(() => {
    advanceToNext();
  }, [advanceToNext]);

  const handleRestart = useCallback(() => {
    setPhase('intro');
    restart();
  }, [restart]);

  return (
    <>
      <AccessibilityPanel />

      {phase === 'intro' && (
        <IntroScreen onBegin={handleBegin} />
      )}

      {phase === 'act-transition' && actTransitionData && (
        <div className="act-transition active">
          <p className="act-transition__number">Act {actTransitionData.number}</p>
          <h2 className="act-transition__title">{actTransitionData.title}</h2>
        </div>
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
