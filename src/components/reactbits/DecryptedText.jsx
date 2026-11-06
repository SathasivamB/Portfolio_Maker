import React, { useState, useEffect, useRef } from 'react';

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~|}{[]:;?><';

/**
 * DecryptedText - React Bits Component
 * Terminal/Cyberpunk style character scrambling text reveal.
 */
export default function DecryptedText({
  text = '',
  speed = 45,
  maxIterations = 12,
  sequential = true,
  revealDirection = 'start',
  useOriginalCharsOnly = false,
  className = '',
  parentClassName = '',
  encryptedClassName = 'text-[#2340FF] font-mono opacity-80',
  animateOn = 'view', // 'view' | 'hover'
  ...props
}) {
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);
  const [revealedIndices, setRevealedIndices] = useState(new Set());
  const containerRef = useRef(null);

  useEffect(() => {
    let interval;
    let currentIteration = 0;

    const startScramble = () => {
      setIsScrambling(true);
      const textLen = text.length;

      interval = setInterval(() => {
        setDisplayText((prevText) => {
          return text
            .split('')
            .map((char, index) => {
              if (char === ' ') return ' ';
              
              if (sequential) {
                const progress = currentIteration / maxIterations;
                const revealThreshold = Math.floor(progress * textLen);
                if (index <= revealThreshold) {
                  return text[index];
                }
              }

              if (useOriginalCharsOnly) {
                return text[Math.floor(Math.random() * textLen)];
              }
              return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
            })
            .join('');
        });

        currentIteration++;
        if (currentIteration > maxIterations) {
          clearInterval(interval);
          setDisplayText(text);
          setIsScrambling(false);
        }
      }, speed);
    };

    if (animateOn === 'view') {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              startScramble();
              observer.disconnect();
            }
          });
        },
        { threshold: 0.2 }
      );

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }
      return () => {
        clearInterval(interval);
        observer.disconnect();
      };
    } else if (animateOn === 'hover' && isHovering) {
      startScramble();
      return () => clearInterval(interval);
    }
  }, [text, animateOn, isHovering, maxIterations, speed, sequential, useOriginalCharsOnly]);

  return (
    <span
      ref={containerRef}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`inline-block ${parentClassName}`}
      {...props}
    >
      <span className={className}>{displayText}</span>
    </span>
  );
}
