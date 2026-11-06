import React from 'react';

/**
 * ShinyText - React Bits Component
 * Renders high-craft metallic sheen sweeping across text.
 */
export default function ShinyText({
  text,
  disabled = false,
  speed = 4,
  className = '',
  shimmerColor = '#FFFFFF',
  baseColor = 'inherit'
}) {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={`inline-block relative overflow-hidden bg-clip-text ${className}`}
      style={{
        backgroundImage: disabled
          ? 'none'
          : `linear-gradient(120deg, ${baseColor} 0%, ${baseColor} 40%, ${shimmerColor} 50%, ${baseColor} 60%, ${baseColor} 100%)`,
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        animation: disabled ? 'none' : `shimmerSweep ${animationDuration} linear infinite`,
      }}
    >
      {text}
    </span>
  );
}
