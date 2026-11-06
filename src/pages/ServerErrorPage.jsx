import React from 'react';
import { RefreshCw, Home, ShieldAlert, ArrowRight } from 'lucide-react';
import AgentFolioLogo from '../components/AgentFolioLogo';

export default function ServerErrorPage({ 
  errorCode = '500', 
  errorMessage = null,
  onRetry = () => { window.location.reload(); }
}) {
  return (
    <div className="min-h-screen bg-[#F3F4F8] text-[#0A0A12] font-['DM_Sans'] flex flex-col justify-between p-4 sm:p-8 relative selection:bg-[#FFD84D] selection:text-[#0A0A12]">
      
      {/* Top Navbar */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between py-2 z-10">
        <a href="/" className="flex items-center gap-3">
          <AgentFolioLogo />
        </a>

        <div className="flex items-center gap-2">
          <span className="tg bg-[#EF4444]/10 text-[#EF4444] text-[11px] font-mono font-bold py-1 px-3">
            STATUS: {errorCode}_INTERNAL_ERROR
          </span>
        </div>
      </header>

      {/* Main 500 Neo-Brutalist Card */}
      <main className="flex-1 flex items-center justify-center my-6 z-10">
        <div className="bx w-full max-w-[540px] p-6 sm:p-10 border-2 border-[#0A0A12] shadow-neo rounded-[28px] bg-white flex flex-col items-center text-center gap-5 animate-fade-in">
          
          {/* Card Top Window Bar */}
          <div className="w-full flex items-center justify-between pb-3 border-b-2 border-[#0A0A12]/15">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] border border-[#0A0A12]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFD84D] border border-[#0A0A12]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#7CFFB2] border border-[#0A0A12]" />
            </div>

            <span className="tg bg-[#E8ECFF] text-[#2340FF] text-[10px] font-mono font-bold py-0.5 px-2">
              SERVER TELEMETRY
            </span>
          </div>

          {/* Animated Illustrated Cat SVG for 500 (Untangling Server Cables) */}
          <div className="relative w-full max-w-[280px] aspect-square flex items-center justify-center bg-white">
            <svg viewBox="0 0 240 240" className="w-full h-full select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Floor line */}
              <path d="M20 200H220" stroke="#0A0A12" strokeWidth="2.5" strokeLinecap="round" />
              
              {/* Yarn ball with cable plug */}
              <circle cx="170" cy="180" r="22" stroke="#0A0A12" strokeWidth="2.5" fill="#E8ECFF" />
              <path d="M155 175C165 170 175 190 185 180" stroke="#2340FF" strokeWidth="2" strokeLinecap="round" />
              <path d="M160 190C170 185 180 170 182 175" stroke="#2340FF" strokeWidth="2" strokeLinecap="round" />
              
              {/* Tangled cable loop */}
              <path d="M185 190C205 195 210 175 195 160C175 140 120 185 105 170C90 155 110 135 125 140" 
                stroke="#2340FF" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3" />
              
              {/* Cat Body */}
              <ellipse cx="90" cy="150" rx="35" ry="32" stroke="#0A0A12" strokeWidth="2.5" fill="#FFFFFF" />
              {/* Cat Stripes */}
              <path d="M85 125V135" stroke="#2340FF" strokeWidth="2" strokeLinecap="round" />
              <path d="M92 125V137" stroke="#2340FF" strokeWidth="2" strokeLinecap="round" />
              <path d="M99 126V134" stroke="#2340FF" strokeWidth="2" strokeLinecap="round" />
              
              {/* Cat Head */}
              <circle cx="90" cy="100" r="28" stroke="#0A0A12" strokeWidth="2.5" fill="#FFFFFF" />
              {/* Ears */}
              <path d="M68 85L64 62L82 76" stroke="#0A0A12" strokeWidth="2.5" fill="#FFFFFF" strokeLinejoin="round" />
              <path d="M112 85L116 62L98 76" stroke="#0A0A12" strokeWidth="2.5" fill="#FFFFFF" strokeLinejoin="round" />
              <path d="M69 80L67 69L77 75" fill="#2340FF" />
              <path d="M111 80L113 69L103 75" fill="#2340FF" />
              
              {/* Face Expressions (Dizzy / Perplexed with Wires) */}
              <path d="M78 95L86 103M86 95L78 103" stroke="#0A0A12" strokeWidth="2" strokeLinecap="round" />
              <path d="M96 95L104 103M104 95L96 103" stroke="#0A0A12" strokeWidth="2" strokeLinecap="round" />
              <polygon points="90,107 87,111 93,111" fill="#FFD84D" stroke="#0A0A12" strokeWidth="1.5" />
              <path d="M87 114Q90 117 93 114" stroke="#0A0A12" strokeWidth="1.5" strokeLinecap="round" />
              
              {/* Whiskers */}
              <path d="M72 106H58" stroke="#0A0A12" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M73 110H60" stroke="#0A0A12" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M108 106H122" stroke="#0A0A12" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M107 110H120" stroke="#0A0A12" strokeWidth="1.5" strokeLinecap="round" />
              
              {/* Paws holding a cable */}
              <ellipse cx="80" cy="142" rx="7" ry="6" stroke="#0A0A12" strokeWidth="2" fill="#FFFFFF" />
              <ellipse cx="102" cy="142" rx="7" ry="6" stroke="#0A0A12" strokeWidth="2" fill="#FFFFFF" />
              
              {/* Potted Plant in Corner */}
              <rect x="25" y="170" width="18" height="24" rx="3" stroke="#0A0A12" strokeWidth="2" fill="#2340FF" />
              <path d="M34 170Q25 150 20 155Q28 165 34 170" stroke="#0A0A12" strokeWidth="1.5" fill="#7CFFB2" />
              <path d="M34 170Q45 145 42 152Q36 162 34 170" stroke="#0A0A12" strokeWidth="1.5" fill="#7CFFB2" />
            </svg>
          </div>

          {/* Headline & Friendly Copy */}
          <div className="space-y-1.5 max-w-md">
            <h1 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold tracking-tight text-[#0A0A12]">
              Untangling Some Server Wires
            </h1>
            <p className="text-xs sm:text-sm text-[#55586B] font-['DM_Sans'] leading-relaxed">
              {errorMessage || 'Our database node hit an unexpected traffic snag. Dual-persistence is actively reconciling snapshots.'}
            </p>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full pt-2">
            <button
              type="button"
              onClick={onRetry}
              className="pill b1 flex-1 text-xs sm:text-sm min-h-[44px] shadow-neo-sm hover:translate-x-0.5 flex items-center justify-center gap-2 font-bold"
            >
              <RefreshCw className="w-4 h-4 text-[#FFD84D]" />
              <span>Retry Connection</span>
            </button>

            <a
              href="/"
              className="pill b2 flex-1 text-xs sm:text-sm min-h-[44px] shadow-neo-sm hover:translate-x-0.5 flex items-center justify-center gap-2 font-bold"
            >
              <Home className="w-4 h-4 text-[#2340FF]" />
              <span>Return to Safety</span>
            </a>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl mx-auto text-center py-2 text-xs text-[#55586B] font-mono">
        folio.ai · high-availability server architecture
      </footer>

    </div>
  );
}
