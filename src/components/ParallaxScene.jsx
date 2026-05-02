import React, { useMemo } from 'react';

// Import scene images
import roomImg from '../assets/scenes/room.webp';
import announcementImg from '../assets/scenes/room_2.png';
import pressureImg from '../assets/scenes/home.webp';
import nightRoadImg from '../assets/scenes/night_road.webp';
import schoolImg from '../assets/scenes/school.webp';

const sceneImages = {
  room: roomImg,
  announcement: announcementImg,
  pressure: pressureImg,
  night_road: nightRoadImg,
  school: schoolImg,
};

export default function ParallaxScene({ scene, atmosphere, panX }) {
  const bgImage = sceneImages[scene];

  // Dust particles
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

  // More zoom = larger translate range. panX goes -1 to 1.
  // Scale 1.6 means image is 60% wider than viewport.
  // Translate range: ±18% so edges are reachable.
  const translatePercent = panX * (211 / 2131 * 100 / 2);
  const overlayClass = atmosphere === 'tense_warm' || atmosphere === 'tense_pressure' 
    ? 'scene-overlay--tense' 
    : atmosphere === 'urgent_dim' || atmosphere === 'dark_cold' || atmosphere === 'betrayal'
    ? 'scene-overlay--tense' 
    : 'scene-overlay--warm';

  const brightnessMap = {
    warm_dim: 'brightness(0.55) saturate(0.8)',
    tense_warm: 'brightness(0.45) saturate(0.7)',
    tense_pressure: 'brightness(0.40) saturate(0.65)',
    urgent_dim: 'brightness(0.30) saturate(0.5)',
    dark_cold: 'brightness(0.22) saturate(0.4)',
    betrayal: 'brightness(0.18) saturate(0.35)',
  };
  const filterStyle = brightnessMap[atmosphere] || 'brightness(0.5) saturate(0.7)';

  return (
    <div className="parallax-scene">
      {bgImage && (
        <img
          src={bgImage}
          alt=""
          className="scene-bg-image"
          style={{
            transform: `translateX(${translatePercent}%) scale(1.0)`,
            transition: 'transform 150ms linear',
            filter: filterStyle,
              width: '2131px',
              height: '1080px',
              maxWidth: 'none',
          }}
          role="presentation"
        />
      )}

      <div className="scene-overlay scene-overlay--vignette" />
      <div className="scene-overlay scene-overlay--gradient" />
      <div className={`scene-overlay ${overlayClass}`} />

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

      {/* Pan indicators — always visible */}
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
