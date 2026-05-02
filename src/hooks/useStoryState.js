import { useState, useCallback } from 'react';
import storyGraph from '../data/storyGraph.json';

/**
 * Story state hook — traverses the JSON story graph and tracks all choices.
 */
export function useStoryState() {
  const [currentNodeId, setCurrentNodeId] = useState(storyGraph.startNode);
  const [choiceHistory, setChoiceHistory] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentNode = storyGraph.nodes[currentNodeId];

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

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentNodeId(choice.next);
      setIsTransitioning(false);
    }, 800);
  }, [currentNodeId]);

  const advanceToNext = useCallback(() => {
    const node = storyGraph.nodes[currentNodeId];
    if (!node || !node.next) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentNodeId(node.next);
      setIsTransitioning(false);
    }, 800);
  }, [currentNodeId]);

  const restart = useCallback(() => {
    setCurrentNodeId(storyGraph.startNode);
    setChoiceHistory([]);
    setIsTransitioning(false);
  }, []);

  return {
    currentNode,
    currentNodeId,
    choiceHistory,
    isTransitioning,
    makeChoice,
    advanceToNext,
    restart,
    allNodes: storyGraph.nodes,
  };
}
