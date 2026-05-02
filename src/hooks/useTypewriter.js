import { useState, useEffect, useRef } from 'react';

/**
 * Typewriter hook — reveals text character by character.
 * Respects prefers-reduced-motion by showing text instantly.
 * 
 * @param {string} text - The text to reveal
 * @param {number} speed - Milliseconds per character (default 35)
 * @param {number} delay - Initial delay before typing starts (default 500)
 * @returns {{ displayedText: string, isComplete: boolean, skip: function }}
 */
export function useTypewriter(text, speed = 35, delay = 500) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const timeoutRef = useRef(null);
  const indexRef = useRef(0);
  const reducedMotion = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    // Reset on new text
    setDisplayedText('');
    setIsComplete(false);
    indexRef.current = 0;

    if (!text) {
      setIsComplete(true);
      return;
    }

    // If reduced motion, show all text immediately
    if (reducedMotion.current) {
      setDisplayedText(text);
      setIsComplete(true);
      return;
    }

    const startTyping = () => {
      const typeChar = () => {
        if (indexRef.current < text.length) {
          indexRef.current++;
          setDisplayedText(text.slice(0, indexRef.current));
          timeoutRef.current = setTimeout(typeChar, speed);
        } else {
          setIsComplete(true);
        }
      };
      typeChar();
    };

    timeoutRef.current = setTimeout(startTyping, delay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, speed, delay]);

  const skip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDisplayedText(text);
    setIsComplete(true);
  };

  return { displayedText, isComplete, skip };
}
