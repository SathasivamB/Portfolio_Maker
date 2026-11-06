import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  X, 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';
import AgentFolioLogo from './AgentFolioLogo';

export default function LegalModal({ initialTab = 'privacy', onClose }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isClosing, setIsClosing] = useState(false);

  // Graceful exit with animation
  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      if (onClose) onClose();
    }, 180);
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isClosing]);

  return (
    <div 
      className={`fixed inset-0 z-50 bg-[#0A0A12]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-sans text-[#0A0A12] cursor-pointer transition-opacity duration-200 ease-out ${
        isClosing ? 'opacity-0 pointer-events-none' : 'opacity-100 animate-backdrop-in'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div 
        className={`bx w-full max-w-2xl rounded-[28px] bg-white border-2 border-[#0A0A12] shadow-neo overflow-hidden my-auto flex flex-col max-h-[90vh] p-0 cursor-default text-left transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          isClosing ? 'scale-95 opacity-0 translate-y-2' : 'animate-modal-in'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-4 border-b-2 border-[#0A0A12] bg-[#F3F4F8] flex items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <AgentFolioLogo />
            <div className="min-w-0">
              <h2 className="font-space text-base sm:text-lg font-bold text-[#0A0A12] tracking-tight flex items-center gap-2 truncate">
                <span>Legal &amp; Privacy Center</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#7CFFB2] text-[#0A0A12] border border-[#0A0A12] flex-shrink-0">
                  v0.9 Beta
                </span>
              </h2>
              <p className="text-[11px] text-[#55586B] font-dmsans truncate">
                Transparent data standards, AI processing rules &amp; beta terms
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="text-[#0A0A12] p-1.5 rounded-full border-2 border-[#0A0A12] hover:bg-white hover:rotate-90 hover:scale-105 active:scale-90 transition-all duration-150 cursor-pointer flex-shrink-0"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Apple Inset Segmented Tabs with Sliding Pill */}
        <div className="px-6 pt-4 pb-2 bg-white flex-shrink-0">
          <div className="relative p-1 bg-[#F3F4F8] rounded-[16px] border border-[#0A0A12]/15 flex">
            {/* Fluid Sliding Active Tab Pill */}
            <div 
              className="absolute top-1 bottom-1 rounded-[12px] bg-white shadow-sm border border-[#0A0A12]/20 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] pointer-events-none"
              style={{
                width: 'calc(50% - 4px)',
                transform: activeTab === 'privacy' ? 'translateX(0)' : 'translateX(calc(100% + 2px))'
              }}
            />

            <button
              type="button"
              onClick={() => setActiveTab('privacy')}
              className={`relative z-10 flex-1 py-2 px-4 rounded-[12px] text-xs font-space font-bold flex items-center justify-center gap-2 transition-colors duration-150 cursor-pointer active:scale-[0.98] ${
                activeTab === 'privacy' ? 'text-[#0A0A12]' : 'text-[#55586B] hover:text-[#0A0A12]'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-[#2340FF]" />
              <span>Privacy Policy</span>
            </button>
            
            <button
              type="button"
              onClick={() => setActiveTab('terms')}
              className={`relative z-10 flex-1 py-2 px-4 rounded-[12px] text-xs font-space font-bold flex items-center justify-center gap-2 transition-colors duration-150 cursor-pointer active:scale-[0.98] ${
                activeTab === 'terms' ? 'text-[#0A0A12]' : 'text-[#55586B] hover:text-[#0A0A12]'
              }`}
            >
              <FileText className="w-4 h-4 text-[#2340FF]" />
              <span>Beta Terms of Service</span>
            </button>
          </div>
        </div>

        {/* Scrollable Policy Body with Animated Crossfade */}
        <div className="px-6 py-4 overflow-y-auto text-xs text-[#0A0A12] leading-relaxed font-sans flex-1">
          <div key={activeTab} className="space-y-4 animate-tab-content">
            
            {activeTab === 'privacy' ? (
              <>
                {/* Privacy Core Guarantee Banner */}
                <div className="p-4 rounded-[18px] bg-[#7CFFB2]/20 border-2 border-[#0A0A12] space-y-1 transition-all duration-150 hover:border-[#0A0A12]">
                  <div className="flex items-center gap-2 font-bold font-space text-sm text-[#0A0A12]">
                    <Lock className="w-4 h-4 text-[#2340FF] flex-shrink-0" />
                    <span>Our Core Privacy Principle</span>
                  </div>
                  <p className="text-[11px] text-[#55586B] leading-relaxed">
                    Folio AI operates on a strict <strong>read-only</strong> access model for public developer profiles. We never touch private repositories, we never sell your personal information, and your code is never used to train public foundation models.
                  </p>
                </div>

                {/* Data Scope: Bento Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Column 1: What We Access */}
                  <div className="p-4 rounded-[18px] bg-[#F3F4F8] border border-[#0A0A12]/15 space-y-2.5 transition-all duration-150 hover:border-[#0A0A12]/30 hover:-translate-y-0.5">
                    <div className="flex items-center justify-between gap-2.5 pb-0.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] flex-shrink-0" />
                        <span className="font-space font-bold text-xs text-[#0A0A12] tracking-tight truncate">
                          What We Access
                        </span>
                      </div>
                      <span className="flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#7CFFB2]/30 text-[#065F46] border border-[#059669]/30">
                        Read-Only
                      </span>
                    </div>
                    <ul className="space-y-2 text-[11px] text-[#55586B]">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2340FF] flex-shrink-0 mt-0.5" />
                        <span><strong>Public Identity:</strong> Name, handle, public email, and avatar from GitHub or Google.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2340FF] flex-shrink-0 mt-0.5" />
                        <span><strong>Public Repositories:</strong> Project titles, language tags, star counts, and public READMEs.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2340FF] flex-shrink-0 mt-0.5" />
                        <span><strong>Public Commit Metrics:</strong> Contribution activity used exclusively to generate showcase badges.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Column 2: What We Never Access */}
                  <div className="p-4 rounded-[18px] bg-[#FFF5F5] border border-[#EF4444]/25 space-y-2.5 transition-all duration-150 hover:border-[#EF4444]/40 hover:-translate-y-0.5">
                    <div className="flex items-center justify-between gap-2.5 pb-0.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <XCircle className="w-3.5 h-3.5 text-[#DC2626] flex-shrink-0" />
                        <span className="font-space font-bold text-xs text-[#DC2626] tracking-tight truncate">
                          What We Never Touch
                        </span>
                      </div>
                      <span className="flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FEE2E2] text-[#DC2626] border border-[#DC2626]/30">
                        Zero Access
                      </span>
                    </div>
                    <ul className="space-y-2 text-[11px] text-[#55586B]">
                      <li className="flex items-start gap-2">
                        <XCircle className="w-3.5 h-3.5 text-[#EF4444] flex-shrink-0 mt-0.5" />
                        <span><strong>Private Repositories:</strong> We never request private repo scopes or read proprietary code.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <XCircle className="w-3.5 h-3.5 text-[#EF4444] flex-shrink-0 mt-0.5" />
                        <span><strong>Write Permissions:</strong> No git push, commit writing, webhook creation, or branch tampering.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <XCircle className="w-3.5 h-3.5 text-[#EF4444] flex-shrink-0 mt-0.5" />
                        <span><strong>Keys &amp; Secrets:</strong> No access to SSH keys, OAuth tokens, personal messages, or billing.</span>
                      </li>
                    </ul>
                  </div>

                </div>

                {/* AI Processing Transparency */}
                <div className="p-4 rounded-[18px] bg-[#F3F4F8] border border-[#0A0A12]/15 space-y-2 transition-all duration-150 hover:border-[#0A0A12]/30">
                  <div className="flex items-center justify-between gap-2.5 pb-0.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Sparkles className="w-3.5 h-3.5 text-[#2340FF] flex-shrink-0" />
                      <span className="font-space font-bold text-xs text-[#0A0A12] tracking-tight truncate">
                        How AI Synthesizes Your Portfolio
                      </span>
                    </div>
                    <span className="flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white text-[#2340FF] border border-[#2340FF]/30">
                      Google Gemini 2.0 API
                    </span>
                  </div>
                  <p className="text-[11px] text-[#55586B] leading-relaxed">
                    When you import your GitHub profile, our AI synthesizer reads your public project summaries to generate draft headlines, skill categorizations, and case study overviews. All AI data processing is transient: your code is <strong>never</strong> used to train proprietary or third-party foundation models.
                  </p>
                  <div className="grid grid-cols-3 gap-2 pt-1 text-[10px] font-mono text-center">
                    <div className="p-2 rounded-[10px] bg-white border border-[#0A0A12]/15 font-bold text-[#0A0A12] transition-transform duration-150 hover:-translate-y-0.5">1. Read Public Repos</div>
                    <div className="p-2 rounded-[10px] bg-white border border-[#0A0A12]/15 font-bold text-[#0A0A12] transition-transform duration-150 hover:-translate-y-0.5">2. Synthesize Copy</div>
                    <div className="p-2 rounded-[10px] bg-white border border-[#0A0A12]/15 font-bold text-[#0A0A12] transition-transform duration-150 hover:-translate-y-0.5">3. You Own &amp; Edit</div>
                  </div>
                </div>

                {/* Data Security & Deletion Controls */}
                <div className="p-4 rounded-[18px] bg-[#F3F4F8] border border-[#0A0A12]/15 space-y-2 transition-all duration-150 hover:border-[#0A0A12]/30">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2340FF] flex-shrink-0" />
                    <span className="font-space font-bold text-xs text-[#0A0A12] tracking-tight">
                      Security Standards &amp; Deletion Rights
                    </span>
                  </div>
                  <p className="text-[11px] text-[#55586B] leading-relaxed">
                    Your portfolio is stored in an encrypted relational SQLite instance with automatic chronological snapshots. You have complete autonomy:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                    <div className="p-2.5 rounded-[12px] bg-white border border-[#0A0A12]/15 transition-transform duration-150 hover:-translate-y-0.5">
                      <span className="font-bold text-[#0A0A12] block mb-0.5">Private Draft Mode</span>
                      <span className="text-[10px] text-[#55586B]">Toggle off public visibility from Studio anytime.</span>
                    </div>
                    <div className="p-2.5 rounded-[12px] bg-white border border-[#0A0A12]/15 transition-transform duration-150 hover:-translate-y-0.5">
                      <span className="font-bold text-[#0A0A12] block mb-0.5">PIN Protection</span>
                      <span className="text-[10px] text-[#55586B]">Gate sensitive client pitches with a 4-digit code.</span>
                    </div>
                    <div className="p-2.5 rounded-[12px] bg-white border border-[#0A0A12]/15 transition-transform duration-150 hover:-translate-y-0.5">
                      <span className="font-bold text-[#0A0A12] block mb-0.5">1-Click Full Wipe</span>
                      <span className="text-[10px] text-[#55586B]">Email privacy@folio.ai to permanently purge all data.</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Beta Disclaimer Banner */}
                <div className="p-4 rounded-[18px] bg-[#FFD84D]/25 border-2 border-[#0A0A12] space-y-1 transition-all duration-150 hover:border-[#0A0A12]">
                  <div className="flex items-center gap-2 font-bold font-space text-sm text-[#0A0A12]">
                    <Sparkles className="w-4 h-4 text-[#2340FF] flex-shrink-0" />
                    <span>Public Beta Evaluation Agreement</span>
                  </div>
                  <p className="text-[11px] text-[#55586B] leading-relaxed">
                    Folio AI is provided as a 100% free Public Beta. By creating a portfolio or connecting your GitHub/Google account, you agree to these evaluation terms.
                  </p>
                </div>

                {/* Term 1: 100% User Ownership */}
                <div className="p-4 rounded-[18px] bg-[#F3F4F8] border border-[#0A0A12]/15 space-y-1.5 transition-all duration-150 hover:border-[#0A0A12]/30 hover:-translate-y-0.5">
                  <div className="flex items-center justify-between gap-2.5 pb-0.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] flex-shrink-0" />
                      <span className="font-space font-bold text-xs text-[#0A0A12] tracking-tight truncate">
                        1. You Retain 100% Ownership of Your Work
                      </span>
                    </div>
                    <span className="flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#7CFFB2]/30 text-[#065F46] border border-[#059669]/30">
                      Creator IP First
                    </span>
                  </div>
                  <p className="text-[11px] text-[#55586B] leading-relaxed">
                    You retain full, exclusive intellectual property rights over your code, repositories, images, design assets, and personal brand. Folio AI claims zero intellectual property or copyright over any content you import, generate, or publish.
                  </p>
                </div>

                {/* Term 2: "AS-IS" Beta License */}
                <div className="p-4 rounded-[18px] bg-[#F3F4F8] border border-[#0A0A12]/15 space-y-1.5 transition-all duration-150 hover:border-[#0A0A12]/30 hover:-translate-y-0.5">
                  <div className="flex items-center justify-between gap-2.5 pb-0.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <FileText className="w-3.5 h-3.5 text-[#2340FF] flex-shrink-0" />
                      <span className="font-space font-bold text-xs text-[#0A0A12] tracking-tight truncate">
                        2. "AS-IS" Software &amp; Maintenance Disclosure
                      </span>
                    </div>
                    <span className="flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white text-[#55586B] border border-[#0A0A12]/20">
                      Beta License
                    </span>
                  </div>
                  <p className="text-[11px] text-[#55586B] leading-relaxed">
                    Folio AI is provided on an "AS-IS" and "AS-AVAILABLE" basis during the Public Beta. While our platform maintains active uptime and automated data backups, features and database schemas may undergo maintenance or iteration. Folio AI is not liable for temporary service interruptions during beta deployments.
                  </p>
                </div>

                {/* Term 3: Acceptable Use */}
                <div className="p-4 rounded-[18px] bg-[#F3F4F8] border border-[#0A0A12]/15 space-y-1.5 transition-all duration-150 hover:border-[#0A0A12]/30 hover:-translate-y-0.5">
                  <div className="flex items-center justify-between gap-2.5 pb-0.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#2340FF] flex-shrink-0" />
                      <span className="font-space font-bold text-xs text-[#0A0A12] tracking-tight truncate">
                        3. Fair Use &amp; Developer Conduct
                      </span>
                    </div>
                    <span className="flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white text-[#55586B] border border-[#0A0A12]/20">
                      Guidelines
                    </span>
                  </div>
                  <p className="text-[11px] text-[#55586B] leading-relaxed">
                    Testers agree not to: (a) abuse AI generation tokens or initiate automated Denial-of-Service attacks; (b) impersonate other creators or upload copyrighted material without authorization; (c) publish malicious software or confidential access tokens.
                  </p>
                </div>

                {/* Term 4: Feedback License */}
                <div className="p-4 rounded-[18px] bg-[#F3F4F8] border border-[#0A0A12]/15 space-y-1.5 transition-all duration-150 hover:border-[#0A0A12]/30 hover:-translate-y-0.5">
                  <div className="flex items-center justify-between gap-2.5 pb-0.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Sparkles className="w-3.5 h-3.5 text-[#2340FF] flex-shrink-0" />
                      <span className="font-space font-bold text-xs text-[#0A0A12] tracking-tight truncate">
                        4. Beta Feedback &amp; Improvements
                      </span>
                    </div>
                    <span className="flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#7CFFB2]/30 text-[#065F46] border border-[#059669]/30">
                      Continuous QA
                    </span>
                  </div>
                  <p className="text-[11px] text-[#55586B] leading-relaxed">
                    Suggestions, bug reports, and design feedback submitted through the Creator Studio Feedback button help improve the product. By submitting feedback, you grant Folio AI the royalty-free right to use recommendations to enhance the platform for all creators.
                  </p>
                </div>
              </>
            )}

          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t-2 border-[#0A0A12] bg-[#F3F4F8] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#55586B] flex-shrink-0">
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-[#7CFFB2] border border-[#0A0A12] animate-pulse"></span>
            <span>Effective: November 2026 · Public Beta Edition</span>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="pill b1 text-xs py-2 px-6 font-bold shadow-neo-sm hover:translate-x-0.5 active:scale-[0.97] transition-all duration-150 cursor-pointer"
          >
            I Understand &amp; Close
          </button>
        </div>

      </div>
    </div>
  );
}
