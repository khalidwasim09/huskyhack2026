import { useRef, useCallback, useEffect } from 'react';

// Using a classic, emotional royalty-free piano track (Kevin MacLeod - Heartbreaking)
// Hosted on Incompetech's royalty-free server for reliable direct streaming.
const BGM_URL = "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Heartbreaking.mp3";

/**
 * Ambient audio system using an actual music file.
 * Plays a continuous emotional piano track and manages its volume based on the scene mood.
 */
export function useAmbientAudio() {
  const audioRef = useRef(null);
  const activeRef = useRef(false);
  const fadeIntervalRef = useRef(null);

  const init = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio(BGM_URL);
      audio.loop = true;
      audio.volume = 0; // Start silent
      audioRef.current = audio;
    }
    
    if (audioRef.current.paused) {
      audioRef.current.play().catch(e => console.log("Audio play blocked by browser:", e));
    }
  }, []);

  // Set mood — adjusts the volume of the music to fit the scene
  const setMood = useCallback((mood) => {
    if (!audioRef.current) return;
    
    // Clear any existing fade
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }

    const targetVolumes = {
      warm_dim: 0.4,
      tense_warm: 0.6,
      tense_pressure: 0.7,
      urgent_dim: 0.9, // Louder during the escape
      dark_cold: 0.5,
      betrayal: 1.0,   // Max volume at the climax
      silence: 0.1     // Very quiet during reveal
    };

    const targetVol = targetVolumes[mood] || 0.5;
    
    // Smooth fade to target volume over 2 seconds
    const steps = 20;
    const stepTime = 2000 / steps;
    const currentVol = audioRef.current.volume;
    const volDiff = targetVol - currentVol;
    const volStep = volDiff / steps;
    
    let currentStep = 0;
    
    fadeIntervalRef.current = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        audioRef.current.volume = targetVol;
        clearInterval(fadeIntervalRef.current);
      } else {
        // Ensure volume stays between 0 and 1
        const newVol = currentVol + (volStep * currentStep);
        audioRef.current.volume = Math.max(0, Math.min(1, newVol));
      }
    }, stepTime);

    activeRef.current = true;
  }, []);

  // Fade out completely
  const fadeOut = useCallback(() => {
    if (!audioRef.current) return;
    
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }

    const steps = 20;
    const stepTime = 2000 / steps;
    const currentVol = audioRef.current.volume;
    const volStep = currentVol / steps;
    
    let currentStep = 0;
    
    fadeIntervalRef.current = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        audioRef.current.volume = 0;
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        activeRef.current = false;
        clearInterval(fadeIntervalRef.current);
      } else {
        const newVol = currentVol - (volStep * currentStep);
        audioRef.current.volume = Math.max(0, Math.min(1, newVol));
      }
    }, stepTime);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return { init, setMood, fadeOut };
}
