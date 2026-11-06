import React, { useEffect, useRef, useState } from 'react';

/**
 * POG Studio Word-by-Word Kinetic Typography
 * Features staggered entrance and optional expanding tracking eyebrow.
 */
export default function AnimatedHeading({
  text,
  accentWord = '',
  eyebrow = '',
  className = "font-display text-3xl sm:text-5xl text-[#0A0A12] leading-[1.08] tracking-tight",
  as: Component = 'h2'
}) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15, rootMargin: '-40px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const words = text ? text.split(' ') : [];

  return (
    <div ref={containerRef} className="space-y-2">
      {eyebrow && (
        <div 
          className="font-mono text-xs uppercase font-semibold text-[#55586B] transition-all duration-700 ease-out"
          style={{
            opacity: isVisible ? 1 : 0,
            letterSpacing: isVisible ? '0.35em' : '0.1em'
          }}
        >
          {eyebrow}
        </div>
      )}

      <Component className={className}>
        {words.map((word, i) => {
          const isAccent = accentWord && word.toLowerCase().includes(accentWord.toLowerCase());
          return (
            <span
              key={i}
              className={`inline-block mr-[0.25em] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isAccent ? 'text-[#2340FF]' : ''
              }`}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0) rotate(0deg)' : 'translateY(24px) rotate(2deg)',
                transitionDelay: `${i * 65}ms`
              }}
            >
              {word}
            </span>
          );
        })}
      </Component>
    </div>
  );
}
