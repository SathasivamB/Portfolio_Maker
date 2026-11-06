import React from 'react';

/**
 * POG Studio Organic Hand-Drawn SVG Decorative Marks
 * Used for technical and editorial framing in hero and showcase sections.
 */

export const DottedArrow = ({ className = '', style }) => (
  <svg viewBox="0 0 200 200" className={className} style={style} fill="none">
    <path
      d="M20 100 Q 60 20, 120 80 T 180 140"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeDasharray="6 8"
      strokeLinecap="round"
    />
    <path 
      d="M170 130 L182 142 L168 150" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </svg>
);

export const SpiralArrow = ({ className = '', style }) => (
  <svg viewBox="0 0 200 200" className={className} style={style} fill="none">
    <circle cx="100" cy="90" r="50" stroke="currentColor" strokeWidth="2" strokeDasharray="5 7" />
    <circle cx="100" cy="90" r="3" fill="currentColor" />
    <path d="M100 140 L100 180" stroke="currentColor" strokeWidth="2" strokeDasharray="5 7" />
    <path d="M92 172 L100 184 L108 172" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const TriangleMark = ({ className = '', style }) => (
  <svg viewBox="0 0 200 200" className={className} style={style} fill="none">
    <path d="M30 170 L100 30 L170 170 Z" fill="rgba(244, 238, 223, 0.6)" stroke="currentColor" strokeWidth="2" />
    <path d="M65 130 Q 100 110, 135 130" stroke="currentColor" strokeWidth="2" strokeDasharray="4 6" />
    <circle cx="100" cy="130" r="4" fill="currentColor" />
  </svg>
);

export const CompassMark = ({ className = '', style }) => (
  <svg viewBox="0 0 200 200" className={className} style={style} fill="none">
    <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 5" />
    <line x1="100" y1="40" x2="100" y2="60" stroke="currentColor" strokeWidth="2" />
    <line x1="100" y1="140" x2="100" y2="160" stroke="currentColor" strokeWidth="2" />
    <line x1="40" y1="100" x2="60" y2="100" stroke="currentColor" strokeWidth="2" />
    <line x1="140" y1="100" x2="160" y2="100" stroke="currentColor" strokeWidth="2" />
    <circle cx="100" cy="100" r="5" fill="currentColor" />
    <line x1="100" y1="100" x2="135" y2="75" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const FloatingDecor = ({ 
  children, 
  x, 
  y, 
  rotate = 0, 
  delay = 0, 
  size = 120 
}) => (
  <div
    className="absolute pointer-events-none animate-float"
    style={{ 
      left: x, 
      top: y, 
      width: size, 
      height: size,
      transform: `rotate(${rotate}deg)`,
      animationDelay: `${delay}s`
    }}
  >
    {children}
  </div>
);

export default {
  DottedArrow,
  SpiralArrow,
  TriangleMark,
  CompassMark,
  FloatingDecor
};
