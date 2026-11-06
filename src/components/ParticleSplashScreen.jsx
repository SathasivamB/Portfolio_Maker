import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Check, ArrowRight } from 'lucide-react';

export default function ParticleSplashScreen({ 
  title = "Engineering Your Stage",
  subtitle = "Assembling 3D particles into high-contrast Figma-grade portfolio archetypes.",
  statusBadge = "3D SYSTEM ACTIVE",
  duration = 1600,
  onComplete 
}) {
  const canvasRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [telemetryText, setTelemetryText] = useState('CALIBRATING 3D VORTEX MESH...');
  const [isWarping, setIsWarping] = useState(false);
  const hasFinishedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse parallax tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX - width / 2) * 0.0008;
      targetMouseY = (e.clientY - height / 2) * 0.0008;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Folio AI Color Palette: Electric Royal Blue, Cyber Yellow, Phosphor Mint, Starlight White
    const palette = [
      '#2340FF', // Electric Royal Blue
      '#FFD84D', // Cyber Yellow
      '#7CFFB2', // Phosphor Mint
      '#FFFFFF', // Starlight White
      '#4D70FF'  // Cyan-Blue Glow
    ];

    // Create 3D particles in a spherical/vortex volume
    const PARTICLE_COUNT = 700;
    const particles = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 130 + Math.random() * 260;

      // 3D initial position
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      // Orbital target (double ring / vortex core)
      const ringAngle = (i / PARTICLE_COUNT) * Math.PI * 4;
      const ringRadius = 160 + (i % 3) * 40;
      const targetX = Math.cos(ringAngle) * ringRadius;
      const targetY = Math.sin(ringAngle) * ringRadius * 0.45;
      const targetZ = Math.sin(ringAngle * 2) * 90;

      particles.push({
        x,
        y,
        z,
        origX: x,
        origY: y,
        origZ: z,
        targetX,
        targetY,
        targetZ,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        vz: (Math.random() - 0.5) * 1.5,
        baseSize: Math.random() * 2.2 + 1.2,
        color: palette[Math.floor(Math.random() * palette.length)],
        speed: 0.02 + Math.random() * 0.02
      });
    }

    let startTime = performance.now();
    let rotX = 0;
    let rotY = 0;
    const targetDurationSec = Math.max(1.0, duration / 1000);

    const render = (now) => {
      const elapsed = (now - startTime) / 1000; // in seconds

      // Progress progression: 0 -> 100%
      const currentPct = Math.min(100, Math.floor((elapsed / (targetDurationSec * 0.82)) * 100));
      setProgress(currentPct);

      // Telemetry text transitions
      if (currentPct < 25) {
        setTelemetryText('CALIBRATING 3D VORTEX MESH...');
      } else if (currentPct < 55) {
        setTelemetryText('INGESTING 12 FIGMA ARCHETYPE SHADERS...');
      } else if (currentPct < 85) {
        setTelemetryText('SYNTHESIZING ZERO-LATENCY GEMINI COPILOT...');
      } else {
        setTelemetryText('AGENTFOLIO ENGINE ARMED · ENTERING STUDIO');
      }

      // Smooth mouse parallax interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Camera 3D rotation
      rotY += 0.012 + mouseX * 0.2;
      rotX = Math.sin(elapsed * 0.8) * 0.25 + mouseY * 0.2;

      // Deep Obsidian Canvas
      ctx.fillStyle = '#0A0A12';
      ctx.fillRect(0, 0, width, height);

      // Subtle Radial Aura
      const radialGlow = ctx.createRadialGradient(
        width / 2, height / 2, 10,
        width / 2, height / 2, Math.min(width, height) * 0.5
      );
      radialGlow.addColorStop(0, 'rgba(35, 64, 255, 0.18)');
      radialGlow.addColorStop(0.5, 'rgba(255, 216, 77, 0.05)');
      radialGlow.addColorStop(1, 'rgba(10, 10, 18, 0)');
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, width, height);

      // Perspective settings
      const fov = 380;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.globalCompositeOperation = 'lighter';

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      // Convergence toward core
      const convergenceFactor = Math.min(1, Math.max(0, (elapsed - 0.3) * 1.5));

      // Warp factor towards the end
      const warpThreshold = targetDurationSec * 0.82;
      const warpFactor = elapsed > warpThreshold ? Math.pow((elapsed - warpThreshold) * 4.0, 2.5) : 0;
      if (elapsed > warpThreshold && !hasFinishedRef.current) {
        setIsWarping(true);
      }

      const projected = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        const curX = p.origX * (1 - convergenceFactor) + p.targetX * convergenceFactor;
        const curY = p.origY * (1 - convergenceFactor) + p.targetY * convergenceFactor;
        const curZ = p.origZ * (1 - convergenceFactor) + p.targetZ * convergenceFactor - warpFactor * 500;

        // Apply 3D rotation matrix
        let x1 = curX * cosY - curZ * sinY;
        let z1 = curZ * cosY + curX * sinY;
        let y1 = curY * cosX - z1 * sinX;
        let z2 = z1 * cosX + curY * sinX;

        const distance = fov + z2;
        if (distance > 10) {
          const scale = fov / distance;
          const projX = x1 * scale + centerX;
          const projY = y1 * scale + centerY;
          const radius = Math.max(0.4, p.baseSize * scale * (1 + warpFactor * 0.4));
          const alpha = Math.min(1, Math.max(0.1, (scale - 0.2) * 1.2));

          projected.push({
            x: projX,
            y: projY,
            z: z2,
            radius,
            color: p.color,
            alpha: alpha * (elapsed > targetDurationSec ? Math.max(0, 1 - (elapsed - targetDurationSec) * 3) : 1),
            warp: warpFactor
          });
        }
      }

      projected.sort((a, b) => b.z - a.z);

      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;

        ctx.beginPath();
        if (p.warp > 0.05) {
          const streakLen = Math.min(45, p.warp * 30);
          ctx.ellipse(p.x, p.y, p.radius, p.radius + streakLen, rotX, 0, Math.PI * 2);
        } else {
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        }
        ctx.fill();
      }

      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1.0;

      if (elapsed >= targetDurationSec && !hasFinishedRef.current) {
        hasFinishedRef.current = true;
        if (onComplete) onComplete();
        return;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        skipIntro();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [duration, onComplete]);

  const skipIntro = () => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    setIsWarping(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 180);
  };

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-[#0A0A12]/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-8 select-none transition-all duration-300 font-['DM_Sans'] overflow-hidden ${
        isWarping ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background 3D Particle Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full block"
      />

      {/* Top Header */}
      <header className="relative z-10 w-full max-w-5xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[10px] bg-[#2340FF] border-2 border-white flex items-center justify-center font-['Space_Grotesk'] font-bold text-white shadow-neo-sm">
            ✦
          </div>
          <span className="font-['Space_Grotesk'] font-bold tracking-tight text-base sm:text-lg text-white">
            folio<span className="text-[#FFD84D]">.ai</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border-2 border-[#0A0A12] bg-[#7CFFB2] text-[#0A0A12] text-[10px] font-mono font-bold shadow-neo-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0A0A12] animate-pulse" />
            <span>{statusBadge}</span>
          </div>

          <button
            type="button"
            onClick={skipIntro}
            className="pill b2 text-xs px-3.5 py-1 min-h-[34px] font-bold shadow-neo-sm hover:translate-x-0.5 bg-white text-[#0A0A12] border-2 border-[#0A0A12]"
          >
            <span>Skip</span>
            <span className="text-[#2340FF]">↵</span>
          </button>
        </div>
      </header>

      {/* Center Figma-Grade Neo-Brutalist HUD Card (Matches Website UI/UX) */}
      <div className="relative z-10 w-full max-w-[460px] mx-auto my-auto animate-fade-in pointer-events-auto">
        <div className="bx p-6 sm:p-7 bg-white text-[#0A0A12] border-2 border-[#0A0A12] shadow-neo rounded-[28px] flex flex-col gap-4 text-left">
          
          {/* Card Top Window Bar */}
          <div className="flex items-center justify-between pb-3 border-b-2 border-[#0A0A12]/15">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] border border-[#0A0A12]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFD84D] border border-[#0A0A12]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#7CFFB2] border border-[#0A0A12]" />
            </div>

            <span className="tg bg-[#E8ECFF] text-[#2340FF] text-[10px] font-mono font-bold py-0.5 px-2">
              ● REALTIME TELEMETRY
            </span>
          </div>

          {/* Central Animated Badge & Title */}
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-[14px] bg-[#2340FF] border-2 border-[#0A0A12] flex items-center justify-center text-white shadow-neo-sm flex-shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5 text-[#FFD84D] animate-spin" style={{ animationDuration: '4s' }} />
            </div>
            <div>
              <h2 className="font-['Space_Grotesk'] text-lg sm:text-xl font-bold tracking-tight text-[#0A0A12] leading-tight">
                {title}
              </h2>
              <p className="text-xs text-[#55586B] mt-0.5 font-['DM_Sans'] leading-relaxed">
                {subtitle}
              </p>
            </div>
          </div>

          {/* Telemetry Checklist */}
          <div className="bg-[#F3F4F8] p-3 rounded-[16px] border-2 border-[#0A0A12] space-y-1.5 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="text-[#0A0A12] font-bold flex items-center gap-1.5">
                <span className="text-[#0A7A4F]">✓</span> Relational SQLite &amp; WAL Active
              </span>
              <span className="text-[10px] text-[#55586B]">0.04s</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#0A0A12] font-bold flex items-center gap-1.5">
                <span className={progress >= 50 ? 'text-[#0A7A4F]' : 'text-[#2340FF] animate-pulse'}>
                  {progress >= 50 ? '✓' : '●'}
                </span>{' '}
                12 Figma Archetype Shaders
              </span>
              <span className="text-[10px] text-[#55586B]">{progress >= 50 ? 'Ready' : 'Syncing'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#0A0A12] font-bold flex items-center gap-1.5">
                <span className={progress >= 85 ? 'text-[#0A7A4F]' : 'text-[#FFD84D] animate-pulse'}>
                  {progress >= 85 ? '✓' : '●'}
                </span>{' '}
                Studio Real-Time Mesh
              </span>
              <span className="text-[10px] text-[#2340FF] font-bold">{progress}%</span>
            </div>
          </div>

          {/* Neo-Brutalist Progress Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="h-3 w-full bg-[#E8ECFF] rounded-full border-2 border-[#0A0A12] overflow-hidden p-0.5 shadow-neo-sm">
              <div 
                className="h-full bg-gradient-to-r from-[#2340FF] via-[#7CFFB2] to-[#FFD84D] rounded-full transition-all duration-75 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-[#55586B]">
              <span className="truncate pr-2 font-bold">{telemetryText}</span>
              <span className="text-[#2340FF] font-bold">{progress}%</span>
            </div>
          </div>

          {/* Action Row */}
          <button
            type="button"
            onClick={skipIntro}
            className="pill by w-full justify-center min-h-[40px] text-xs font-bold shadow-neo-sm hover:translate-x-0.5"
          >
            <span>Skip to Workspace</span>
            <span className="text-[#0A0A12]">↵</span>
          </button>
        </div>
      </div>

      {/* Bottom Hint */}
      <footer className="relative z-10 text-center">
        <p className="text-[11px] font-mono text-white/50 tracking-wider uppercase">
          Press Space or Enter to continue ↗
        </p>
      </footer>
    </div>
  );
}
