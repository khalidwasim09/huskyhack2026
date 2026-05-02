import { useState, useCallback, useRef } from 'react';
import storyGraph from '../data/storyGraph.json';

/**
 * Story state hook — traverses the JSON story graph and tracks all choices.
 */
export function useStoryState() {
  const [currentNodeId, setCurrentNodeId] = useState(storyGraph.startNode);
  const [choiceHistory, setChoiceHistory] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevActRef = useRef(0);

  const currentNode = storyGraph.nodes[currentNodeId];
  const isNewAct = currentNode && currentNode.act !== prevActRef.current && currentNode.act > 0;

  const makeChoice = useCallback((choiceIndex) => {
    const node = storyGraph.nodes[currentNodeId];
    if (!node || !node.choices || !node.choices[choiceIndex]) return;

    const choice = node.choices[choiceIndex];

    setChoiceHistory(prev => [...prev, {
      nodeId: currentNodeId,
      act: node.act,
      choiceIndex,
      label: choice.label,
      hiddenEffect: choice.hiddenEffect,
      emotionalTone: choice.emotionalTone,
    }]);

    // Transition to next node
    setIsTransitioning(true);
    setTimeout(() => {
      prevActRef.current = node.act;
      setCurrentNodeId(choice.next);
      setIsTransitioning(false);
    }, 800);
  }, [currentNodeId]);

  const advanceToNext = useCallback(() => {
    const node = storyGraph.nodes[currentNodeId];
    if (!node || !node.next) return;

    setIsTransitioning(true);
    setTimeout(() => {
      prevActRef.current = node.act;
      setCurrentNodeId(node.next);
      setIsTransitioning(false);
    }, 800);
  }, [currentNodeId]);

  const acknowledgeAct = useCallback(() => {
    prevActRef.current = currentNode?.act || 0;
  }, [currentNode]);

  const restart = useCallback(() => {
    setCurrentNodeId(storyGraph.startNode);
    setChoiceHistory([]);
    prevActRef.current = 0;
    setIsTransitioning(false);
  }, []);

  return {
    currentNode,
    currentNodeId,
    choiceHistory,
    isTransitioning,
    isNewAct,
    makeChoice,
    advanceToNext,
    acknowledgeAct,
    restart,
    allNodes: storyGraph.nodes,
  };
}
