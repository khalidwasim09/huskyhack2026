import { useRef, useCallback, useEffect } from 'react';

/**
 * Ambient audio system using Web Audio API.
 * Generates emotional soundscapes that shift with the story's mood.
 * LOUD and emotionally impactful.
 */
export function useAmbientAudio() {
  const ctxRef = useRef(null);
  const nodesRef = useRef({});
  const activeRef = useRef(false);
  const currentMoodRef = useRef(null);
  const heartIntervalRef = useRef(null);

  const init = useCallback(() => {
    if (ctxRef.current) return ctxRef.current;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    ctxRef.current = ctx;

    // Master gain — LOUD
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    // Compressor for warmth and presence
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -20;
    compressor.knee.value = 10;
    compressor.ratio.value = 4;
    compressor.attack.value = 0.01;
    compressor.release.value = 0.2;
    compressor.connect(master);

    // ---- DRONE LAYER: Two detuned oscillators for thick pad ----
    const drone1 = ctx.createOscillator();
    drone1.type = 'sine';
    drone1.frequency.value = 55;
    const drone1Gain = ctx.createGain();
    drone1Gain.gain.value = 0.35;
    drone1.connect(drone1Gain);
    drone1Gain.connect(compressor);
    drone1.start();

    const drone2 = ctx.createOscillator();
    drone2.type = 'triangle';
    drone2.frequency.value = 82.5;
    const drone2Gain = ctx.createGain();
    drone2Gain.gain.value = 0.25;
    drone2.connect(drone2Gain);
    drone2Gain.connect(compressor);
    drone2.start();

    // Third drone for dissonance in tense moments
    const drone3 = ctx.createOscillator();
    drone3.type = 'sine';
    drone3.frequency.value = 110;
    const drone3Gain = ctx.createGain();
    drone3Gain.gain.value = 0;
    drone3.connect(drone3Gain);
    drone3Gain.connect(compressor);
    drone3.start();

    // ---- SUB BASS ----
    const sub = ctx.createOscillator();
    sub.type = 'sine';
    sub.frequency.value = 36;
    const subGain = ctx.createGain();
    subGain.gain.value = 0.20;
    sub.connect(subGain);
    subGain.connect(compressor);
    sub.start();

    // ---- ATMOSPHERIC NOISE (wind/room tone) ----
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = 200;
    noiseFilter.Q.value = 1;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.10;
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(compressor);
    noise.start();

    // ---- HEARTBEAT (low thump oscillator + shaper) ----
    const heartOsc = ctx.createOscillator();
    heartOsc.type = 'sine';
    heartOsc.frequency.value = 40;
    const heartGain = ctx.createGain();
    heartGain.gain.value = 0;
    heartOsc.connect(heartGain);
    heartGain.connect(compressor);
    heartOsc.start();

    // ---- HIGH PAD (ethereal sadness) ----
    const pad = ctx.createOscillator();
    pad.type = 'sine';
    pad.frequency.value = 220;
    const padGain = ctx.createGain();
    padGain.gain.value = 0;
    const padFilter = ctx.createBiquadFilter();
    padFilter.type = 'lowpass';
    padFilter.frequency.value = 400;
    pad.connect(padFilter);
    padFilter.connect(padGain);
    padGain.connect(compressor);
    pad.start();

    nodesRef.current = {
      master, compressor,
      drone1, drone1Gain,
      drone2, drone2Gain,
      drone3, drone3Gain,
      sub, subGain,
      noiseFilter, noiseGain,
      heartOsc, heartGain,
      pad, padGain, padFilter,
    };

    return ctx;
  }, []);

  const setMood = useCallback((mood) => {
    const ctx = ctxRef.current;
    const nodes = nodesRef.current;
    if (!ctx || !nodes.master) return;
    if (mood === currentMoodRef.current) return;
    currentMoodRef.current = mood;

    const t = ctx.currentTime;
    const fade = 2.5;

    // Fade in master
    if (!activeRef.current) {
      nodes.master.gain.setTargetAtTime(0.9, t, 1.5);
      activeRef.current = true;
    }

    // Clear any existing heartbeat interval
    if (heartIntervalRef.current) {
      clearInterval(heartIntervalRef.current);
      heartIntervalRef.current = null;
    }

    const moods = {
      warm_dim: {
        drone1Freq: 55, drone1Vol: 0.30,
        drone2Freq: 82.5, drone2Vol: 0.20,
        drone3Vol: 0,
        subVol: 0.15,
        noiseFreq: 150, noiseVol: 0.06,
        heartVol: 0,
        padFreq: 220, padVol: 0.03, padFilterFreq: 300,
        heartRate: 0,
      },
      tense_warm: {
        drone1Freq: 58.27, drone1Vol: 0.35,
        drone2Freq: 73.42, drone2Vol: 0.25,
        drone3Vol: 0.08,
        subVol: 0.20,
        noiseFreq: 280, noiseVol: 0.10,
        heartVol: 0,
        padFreq: 233.08, padVol: 0.06, padFilterFreq: 500,
        heartRate: 0,
      },
      tense_pressure: {
        drone1Freq: 58.27, drone1Vol: 0.40,
        drone2Freq: 69.30, drone2Vol: 0.30,
        drone3Vol: 0.15,
        subVol: 0.25,
        noiseFreq: 350, noiseVol: 0.14,
        heartVol: 0.18,
        padFreq: 207.65, padVol: 0.08, padFilterFreq: 600,
        heartRate: 900,
      },
      urgent_dim: {
        drone1Freq: 51.91, drone1Vol: 0.45,
        drone2Freq: 65.41, drone2Vol: 0.35,
        drone3Vol: 0.20,
        subVol: 0.30,
        noiseFreq: 450, noiseVol: 0.16,
        heartVol: 0.25,
        padFreq: 196, padVol: 0.10, padFilterFreq: 700,
        heartRate: 700,
      },
      dark_cold: {
        drone1Freq: 49, drone1Vol: 0.40,
        drone2Freq: 61.74, drone2Vol: 0.30,
        drone3Vol: 0.12,
        subVol: 0.28,
        noiseFreq: 200, noiseVol: 0.18,
        heartVol: 0,
        padFreq: 185, padVol: 0.12, padFilterFreq: 350,
        heartRate: 0,
      },
      betrayal: {
        drone1Freq: 46.25, drone1Vol: 0.50,
        drone2Freq: 55, drone2Vol: 0.40,
        drone3Vol: 0.25,
        subVol: 0.35,
        noiseFreq: 150, noiseVol: 0.20,
        heartVol: 0.35,
        padFreq: 174.61, padVol: 0.15, padFilterFreq: 250,
        heartRate: 500,
      },
      silence: {
        drone1Freq: 55, drone1Vol: 0.10,
        drone2Freq: 82.5, drone2Vol: 0.06,
        drone3Vol: 0,
        subVol: 0.05,
        noiseFreq: 80, noiseVol: 0.03,
        heartVol: 0,
        padFreq: 220, padVol: 0.02, padFilterFreq: 200,
        heartRate: 0,
      },
    };

    const m = moods[mood] || moods.warm_dim;

    nodes.drone1.frequency.setTargetAtTime(m.drone1Freq, t, fade);
    nodes.drone1Gain.gain.setTargetAtTime(m.drone1Vol, t, fade);
    nodes.drone2.frequency.setTargetAtTime(m.drone2Freq, t, fade);
    nodes.drone2Gain.gain.setTargetAtTime(m.drone2Vol, t, fade);
    nodes.drone3Gain.gain.setTargetAtTime(m.drone3Vol, t, fade);
    nodes.subGain.gain.setTargetAtTime(m.subVol, t, fade);
    nodes.noiseFilter.frequency.setTargetAtTime(m.noiseFreq, t, fade);
    nodes.noiseGain.gain.setTargetAtTime(m.noiseVol, t, fade);
    nodes.heartGain.gain.setTargetAtTime(m.heartVol, t, fade);
    nodes.pad.frequency.setTargetAtTime(m.padFreq, t, fade);
    nodes.padGain.gain.setTargetAtTime(m.padVol, t, fade);
    nodes.padFilter.frequency.setTargetAtTime(m.padFilterFreq, t, fade);

    // Auto heartbeat pulse
    if (m.heartRate > 0 && m.heartVol > 0) {
      heartIntervalRef.current = setInterval(() => {
        const ct = ctx.currentTime;
        const base = nodes.heartGain.gain.value;
        if (base < 0.01) return;
        // Double-beat: thump-THUMP
        nodes.heartGain.gain.setValueAtTime(base * 4, ct);
        nodes.heartGain.gain.setTargetAtTime(base, ct, 0.06);
        nodes.heartGain.gain.setValueAtTime(base * 3, ct + 0.12);
        nodes.heartGain.gain.setTargetAtTime(base, ct + 0.12, 0.08);
      }, m.heartRate);
    }
  }, []);

  const fadeOut = useCallback(() => {
    const ctx = ctxRef.current;
    const nodes = nodesRef.current;
    if (!ctx || !nodes.master) return;
    nodes.master.gain.setTargetAtTime(0, ctx.currentTime, 2);
    activeRef.current = false;
    currentMoodRef.current = null;
    if (heartIntervalRef.current) {
      clearInterval(heartIntervalRef.current);
      heartIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (heartIntervalRef.current) clearInterval(heartIntervalRef.current);
      if (ctxRef.current && ctxRef.current.state !== 'closed') {
        ctxRef.current.close();
      }
    };
  }, []);

  return { init, setMood, fadeOut };
}
