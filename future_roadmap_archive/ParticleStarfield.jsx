import React, { useMemo } from 'react';

/**
 * Animated Particle Starfield & Subtle Floating Geometric Wireframes
 * Matches the Folio AI aesthetic:
 * Soft warm particles (#0F3D2E, #C6F432) with delicate ambient opacity.
 */
export default function ParticleStarfield({ count = 25, showWireframes = true }) {
  // Generate random static particles with CSS drift animations
  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${(i * 37) % 100}%`,
      top: `${(i * 43) % 100}%`,
      size: (i % 3) + 1.2,
      opacity: ((i % 4) + 1) / 30, // 0.03 - 0.13 opacity (subtle on light canvas)
      duration: 18 + (i % 12),
      delay: (i % 7) * -2,
      color: i % 3 === 0 ? '#0F3D2E' : (i % 3 === 1 ? '#C6F432' : '#51605A')
    }));
  }, [count]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 select-none">
      {/* Drifting subtle particles */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full animate-float"
          style={{
            left: p.left,
            top: p.top,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`
          }}
        />
      ))}

      {/* Floating Geometric Wireframe Shapes (Subtle Pine Green) */}
      {showWireframes && (
        <>
          {/* Wireframe Hexagon/Cube 1 - Top Right */}
          <div 
            className="absolute top-8 right-12 w-32 h-32 opacity-10 animate-float"
            style={{ animationDuration: '14s' }}
          >
            <svg viewBox="0 0 100 100" fill="none" stroke="#0F3D2E" strokeWidth="1" className="w-full h-full">
              <polygon points="50 3, 90 25, 90 75, 50 97, 10 75, 10 25" strokeDasharray="3 3" />
              <line x1="50" y1="3" x2="50" y2="97" strokeDasharray="2 2" />
              <line x1="10" y1="25" x2="90" y2="75" strokeDasharray="2 2" />
              <line x1="10" y1="75" x2="90" y2="25" strokeDasharray="2 2" />
            </svg>
          </div>

          {/* Wireframe Diamond 2 - Bottom Left */}
          <div 
            className="absolute bottom-16 left-8 w-24 h-24 opacity-10 animate-float"
            style={{ animationDuration: '18s', animationDelay: '-5s' }}
          >
            <svg viewBox="0 0 100 100" fill="none" stroke="#0F3D2E" strokeWidth="1" className="w-full h-full">
              <polygon points="50 5, 95 50, 50 95, 5 50" strokeDasharray="2 2" />
              <circle cx="50" cy="50" r="22" strokeDasharray="3 3" />
            </svg>
          </div>
        </>
      )}
    </div>
  );
}
