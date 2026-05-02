import React, { useMemo } from 'react';
import { usePanController } from '../hooks/usePanController';

// Import scene images
import roomImg from '../assets/scenes/room.png';
import pressureImg from '../assets/scenes/pressure.png';
import escapeImg from '../assets/scenes/escape.png';

const sceneImages = {
  room: roomImg,
  pressure: pressureImg,
  escape: escapeImg,
};

export default function ParallaxScene({ scene, atmosphere }) {
  const { panX } = usePanController();

  const bgImage = sceneImages[scene];

  // Generate dust particles
  const dustParticles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${6 + Math.random() * 6}s`,
      dx: `${(Math.random() - 0.5) * 40}px`,
      dy: `${-10 - Math.random() * 30}px`,
      size: `${2 + Math.random() * 3}px`,
    }));
  }, [scene]);

  // Calculate parallax offset from panX (-1 to 1)
  // Move the image so user sees different parts
  const translatePercent = panX * 20; // ±20% movement

  const overlayClass = atmosphere === 'tense_warm' ? 'scene-overlay--tense' :
                       atmosphere === 'urgent_dim' ? 'scene-overlay--tense' :
                       'scene-overlay--warm';

  return (
    <div className="parallax-scene">
      {/* Main background image with parallax */}
      {bgImage && (
        <img
          src={bgImage}
          alt=""
          className="scene-bg-image"
          style={{
            transform: `translateX(${translatePercent}%) scale(1.3)`,
            transition: 'transform 150ms linear',
          }}
          role="presentation"
        />
      )}

      {/* Atmospheric overlays */}
      <div className="scene-overlay scene-overlay--vignette" />
      <div className="scene-overlay scene-overlay--gradient" />
      <div className={`scene-overlay ${overlayClass}`} />

      {/* Dust particles */}
      <div className="dust-container">
        {dustParticles.map(p => (
          <div
            key={p.id}
            className="dust-particle"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              animationDelay: p.delay,
              animationDuration: p.duration,
              '--dx': p.dx,
              '--dy': p.dy,
            }}
          />
        ))}
      </div>

      {/* Pan indicators */}
      {panX > -0.9 && (
        <div className="pan-indicator pan-indicator--left">
          <span className="pan-arrow">←</span> A
        </div>
      )}
      {panX < 0.9 && (
        <div className="pan-indicator pan-indicator--right">
          D <span className="pan-arrow">→</span>
        </div>
      )}
    </div>
  );
}
