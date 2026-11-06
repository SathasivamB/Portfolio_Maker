import React from 'react';
import { Sparkles, Home, ArrowRight, Compass, Search } from 'lucide-react';
import AgentFolioLogo from '../components/AgentFolioLogo';

export default function NotFoundPage({ 
  missingHandle = null, 
  customMessage = null,
  onGoHome = () => { window.location.href = '/'; },
  onExplore = () => { window.location.href = '/#templates'; }
}) {
  return (
    <div className="min-h-screen bg-[#F3F4F8] text-[#0A0A12] font-['DM_Sans'] flex flex-col justify-between p-4 sm:p-8 relative selection:bg-[#FFD84D] selection:text-[#0A0A12]">
      
      {/* Top Navbar */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between py-2 z-10">
        <div className="flex items-center gap-3 cursor-pointer" onClick={onGoHome}>
          <AgentFolioLogo />
        </div>

        <div className="flex items-center gap-2">
          <span className="tg bg-[#E8ECFF] text-[#2340FF] text-[11px] font-mono font-bold py-1 px-3 hidden sm:inline-block">
            HTTP_STATUS: 404_NOT_FOUND
          </span>
          <button
            type="button"
            onClick={onGoHome}
            className="pill b2 text-xs min-h-[38px] px-4 font-bold shadow-neo-sm hover:translate-x-0.5"
          >
            <Home className="w-3.5 h-3.5 text-[#2340FF]" />
            <span>Home</span>
          </button>
        </div>
      </header>

      {/* Main Neo-Brutalist 404 Card with Animated Cat Video */}
      <main className="flex-1 flex items-center justify-center my-6 z-10">
        <div className="bx w-full max-w-[540px] p-6 sm:p-10 border-2 border-[#0A0A12] shadow-neo rounded-[28px] bg-white flex flex-col items-center text-center gap-5 animate-fade-in">
          
          {/* Card Top Window Bar */}
          <div className="w-full flex items-center justify-between pb-3 border-b-2 border-[#0A0A12]/15">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#EF4444] border border-[#0A0A12]" />
              <span className="w-3 h-3 rounded-full bg-[#FFD84D] border border-[#0A0A12]" />
              <span className="w-3 h-3 rounded-full bg-[#7CFFB2] border border-[#0A0A12]" />
            </div>

            <span className="tg bg-[#FFD84D] text-[#0A0A12] text-[10px] font-mono font-bold py-0.5 px-2">
              LOST IN THE VOID
            </span>
          </div>

          {/* Animated 404 Cat Video from User */}
          <div className="relative w-full max-w-[320px] aspect-square flex items-center justify-center overflow-hidden rounded-[20px] bg-white">
            <video
              src="/assets/404_cat.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-contain pointer-events-none select-none"
            />
          </div>

          {/* Headline & Friendly Copy */}
          <div className="space-y-1.5 max-w-md">
            <h1 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold tracking-tight text-[#0A0A12]">
              {missingHandle ? `Creator @${missingHandle} Not Found` : 'Oops! Page Took a Cat Nap.'}
            </h1>
            <p className="text-xs sm:text-sm text-[#55586B] font-['DM_Sans'] leading-relaxed">
              {customMessage || (
                missingHandle 
                  ? `The portfolio link for @${missingHandle} hasn't been generated yet, or the handle is still available to claim.`
                  : "We untangled all our yarn, but couldn't find the page or route you were looking for."
              )}
            </p>
          </div>

          {/* Interactive CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full pt-2">
            <a
              href={missingHandle ? `/auth?claim=${missingHandle}` : "/auth"}
              className="pill b1 flex-1 text-xs sm:text-sm min-h-[44px] shadow-neo-sm hover:translate-x-0.5 flex items-center justify-center gap-2 font-bold"
            >
              <Sparkles className="w-4 h-4 text-[#FFD84D]" />
              <span>{missingHandle ? `Claim @${missingHandle}` : 'Build My Portfolio'}</span>
            </a>

            <button
              type="button"
              onClick={onExplore}
              className="pill b2 flex-1 text-xs sm:text-sm min-h-[44px] shadow-neo-sm hover:translate-x-0.5 flex items-center justify-center gap-2 font-bold"
            >
              <Compass className="w-4 h-4 text-[#2340FF]" />
              <span>Explore 12 Templates</span>
            </button>
          </div>

          {/* Micro Telemetry Link */}
          <div className="pt-1 text-[11px] font-mono text-[#55586B]">
            <span>Looking for something specific? </span>
            <a href="/" className="text-[#2340FF] font-bold underline hover:text-[#0A0A12]">
              Return to Folio AI Home →
            </a>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl mx-auto text-center py-2 text-xs text-[#55586B] font-mono">
        folio.ai · zero-latency portfolio generation platform
      </footer>

    </div>
  );
}
