import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Pan controller hook — manages camera panning via keyboard.
 * OpenCV-ready: your friend can call setPanX() from face tracker.
 * 
 * @returns {{ panX: number, panSource: string, setPanX: function }}
 * panX ranges from -1 (full left) to 1 (full right), 0 is center
 */
export function usePanController() {
  const [panX, setPanX] = useState(0);
  const [panSource, setPanSource] = useState('keyboard');
  const keysPressed = useRef(new Set());
  const animFrame = useRef(null);
  const PAN_SPEED = 0.02;

  const updatePan = useCallback(() => {
    setPanX(prev => {
      let next = prev;
      if (keysPressed.current.has('left')) {
        next = Math.max(-1, prev - PAN_SPEED);
      }
      if (keysPressed.current.has('right')) {
        next = Math.min(1, prev + PAN_SPEED);
      }
      return next;
    });
    animFrame.current = requestAnimationFrame(updatePan);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keysPressed.current.add('left');
        setPanSource('keyboard');
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keysPressed.current.add('right');
        setPanSource('keyboard');
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keysPressed.current.delete('left');
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keysPressed.current.delete('right');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    animFrame.current = requestAnimationFrame(updatePan);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
    };
  }, [updatePan]);

  // Public setter for OpenCV integration
  const setExternalPan = useCallback((value, source = 'opencv') => {
    setPanX(Math.max(-1, Math.min(1, value)));
    setPanSource(source);
  }, []);

  return { panX, panSource, setPanX: setExternalPan };
}
