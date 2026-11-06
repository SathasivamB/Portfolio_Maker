import React, { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  Lock, 
  X, 
  CheckCircle2,
  Globe,
  Code2,
  FileText
} from 'lucide-react';
import AgentFolioLogo from './AgentFolioLogo';

export default function SaaSPricingModal({ user, onSelectPlan, onClose }) {
  const [isActivating, setIsActivating] = useState(false);

  const handleConfirmAccess = () => {
    setIsActivating(true);
    setTimeout(() => {
      setIsActivating(false);
      if (onSelectPlan) {
        onSelectPlan('beta_pro');
      }
      if (onClose) {
        onClose();
      }
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0A12]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-['DM_Sans'] text-[#0A0A12]">
      <div className="bx w-full max-w-4xl rounded-[28px] bg-white border-2 border-[#0A0A12] shadow-neo overflow-hidden my-auto animate-fade-in flex flex-col max-h-[92vh] text-left p-0">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b-2 border-[#0A0A12] bg-[#F3F4F8] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <AgentFolioLogo />
            <div className="min-w-0">
              <h2 className="font-['Space_Grotesk'] text-base sm:text-xl font-bold text-[#0A0A12] tracking-tight flex items-center gap-1.5 sm:gap-2 truncate">
                <span className="truncate">Folio AI Public Beta Pass</span>
                <span className="tg bg-[#7CFFB2] text-[#0A0A12] text-[10px] sm:text-xs font-bold flex-shrink-0">
                  100% Free · All Unlocked
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-[#55586B] mt-0.5 font-['DM_Sans'] truncate hidden sm:block">
                You're an early builder. Every feature, archetype, and export is unrestricted during public beta.
              </p>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="text-[#0A0A12] p-1.5 rounded-full border-2 border-[#0A0A12] hover:bg-white transition-colors flex-shrink-0"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Beta Guarantee Bar */}
        <div className="px-4 sm:px-6 py-2.5 bg-[#E8ECFF] border-b-2 border-[#0A0A12] flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-[#0A0A12] text-[11px] sm:text-xs">
            <ShieldCheck className="w-4 h-4 text-[#2340FF] flex-shrink-0" />
            <span>
              <strong className="text-[#0A0A12]">Beta Privileges:</strong> No credit card required, no 7-day cutoff, and no hidden subscriptions.
            </span>
          </div>
          <span className="tg bg-white text-[#2340FF] text-[10px] font-bold">
            Public Beta v2.0
          </span>
        </div>

        {/* Unlocked Features Grid */}
        <div className="p-4 sm:p-8 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Column 1: 12 Archetypes */}
          <div className="bx p-6 rounded-[20px] bg-[#F3F4F8] border-2 border-[#0A0A12] flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-[12px] bg-[#FFD84D] border-2 border-[#0A0A12] flex items-center justify-center text-[#0A0A12] font-bold">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#0A0A12]">
                All 12 Archetypes
              </h3>
              <p className="text-xs text-[#55586B] leading-relaxed">
                Complete access to Monolith, Prism Electric, Cyber Terminal, Neural AI, and luxury editorial layouts.
              </p>
              <div className="space-y-1.5 text-xs text-[#0A0A12] pt-2 border-t-2 border-[#0A0A12]/15">
                {['Instant 1-click theme switching', 'Custom brand color hex inputs', 'Developer & designer palettes'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#2340FF] flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: AI Intelligence */}
          <div className="bx p-6 rounded-[20px] bg-[#E8ECFF] border-2 border-[#0A0A12] shadow-neo-sm flex flex-col justify-between relative">
            <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-[#7CFFB2] text-[#0A0A12] border-2 border-[#0A0A12] font-bold text-[10px] uppercase tracking-wider">
              UNLIMITED
            </div>
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-[12px] bg-[#2340FF] border-2 border-[#0A0A12] flex items-center justify-center text-white font-bold">
                <Zap className="w-5 h-5 text-[#FFD84D]" />
              </div>
              <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#0A0A12]">
                Full AI Synthesizer
              </h3>
              <p className="text-xs text-[#55586B] leading-relaxed">
                AI reads codebases, repos, and commit logs, writing high-impact copy tailored to tech leads and recruiters.
              </p>
              <div className="space-y-1.5 text-xs text-[#0A0A12] pt-2 border-t-2 border-[#0A0A12]/15">
                {['Unlimited Copilot bio re-polishing', 'Tech stack auto-categorization', 'Antigravity sequential history'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#2340FF] flex-shrink-0" />
                    <span className="font-bold">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 3: Publishing & Proposals */}
          <div className="bx p-6 rounded-[20px] bg-[#F3F4F8] border-2 border-[#0A0A12] flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-[12px] bg-[#7CFFB2] border-2 border-[#0A0A12] flex items-center justify-center text-[#0A0A12] font-bold">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#0A0A12]">
                Proposals &amp; Hosting
              </h3>
              <p className="text-xs text-[#55586B] leading-relaxed">
                Live subdomains, zero watermark branding, and secret client proposals with password protection.
              </p>
              <div className="space-y-1.5 text-xs text-[#0A0A12] pt-2 border-t-2 border-[#0A0A12]/15">
                {['Live username.folio.ai address', 'Confidential /pitch/ link generator', 'Real-time WebSocket instant sync'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#2340FF] flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Footer with Single Direct Button */}
        <div className="px-6 py-4 border-t-2 border-[#0A0A12] bg-[#F3F4F8] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#55586B] flex-shrink-0 font-['DM_Sans']">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#2340FF]" />
            <span className="font-medium text-[#0A0A12]">Thank you for testing Folio AI during our public beta.</span>
          </div>
          <button
            type="button"
            onClick={handleConfirmAccess}
            disabled={isActivating}
            className="pill by text-xs sm:text-sm font-bold min-h-[42px] px-6 w-full sm:w-auto shadow-neo-sm hover:translate-x-0.5"
          >
            {isActivating ? 'Opening Studio...' : 'Continue to Studio (All Features Unlocked) →'}
          </button>
        </div>

      </div>
    </div>
  );
}