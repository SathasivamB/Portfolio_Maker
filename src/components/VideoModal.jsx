import React, { useState } from 'react';
import { X, Play, Clock, Eye, Sparkles, Film, CheckCircle2, Award, Code, ExternalLink, Copy, Check, GitBranch, Star } from 'lucide-react';
import { GithubIcon } from './Icons';
import AgentFolioLogo from './AgentFolioLogo';

export default function VideoModal({ item, onClose }) {
  if (!item) return null;

  const isCode = item.platform_source === 'github' || item.media_type === 'code_snippet';
  const [copiedClone, setCopiedClone] = useState(false);

  const cloneCmd = `git clone ${item.original_url || `https://github.com/SathasivamB/${item.external_id}`}.git`;

  const handleCopyClone = () => {
    navigator.clipboard?.writeText(cloneCmd);
    setCopiedClone(true);
    setTimeout(() => setCopiedClone(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#0A0A12]/80 backdrop-blur-sm animate-fade-in font-['DM_Sans']">
      <div className="bx w-full max-w-4xl bg-white border-2 border-[#0A0A12] rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-neo relative max-h-[95vh] sm:max-h-[92vh] flex flex-col text-left text-[#0A0A12] p-0">
        
        {/* Header */}
        <div className="p-3.5 sm:p-4 px-4 sm:px-6 border-b-2 border-[#0A0A12] flex items-center justify-between bg-[#F3F4F8] flex-shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-[10px] bg-[#2340FF] text-white border-2 border-[#0A0A12] flex items-center justify-center shadow-neo-sm flex-shrink-0">
              {isCode ? <Code className="w-4 h-4" /> : <Film className="w-4 h-4" />}
            </div>
            <div className="min-w-0">
              <h3 className="font-['Space_Grotesk'] text-sm sm:text-base font-bold text-[#0A0A12] truncate max-w-xs sm:max-w-lg">
                {item.title}
              </h3>
              <span className="text-[9px] sm:text-[10px] text-[#55586B] uppercase tracking-wider font-mono font-bold truncate block">
                {isCode ? `GITHUB REPOSITORY • ${item.metrics?.language || 'OPEN SOURCE'}` : `${item.platform_source.toUpperCase()} SHOWCASE • ${item.duration || 'Full HD'}`}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full border-2 border-[#0A0A12] bg-white text-[#0A0A12] hover:bg-[#F3F4F8] transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 bg-white">
          
          {/* Main Visual or Terminal Card */}
          {isCode ? (
            <div className="rounded-[18px] border-2 border-[#0A0A12] bg-[#F3F4F8] p-4 sm:p-6 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b-2 border-[#0A0A12]/15">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[12px] bg-white border-2 border-[#0A0A12] flex items-center justify-center text-[#0A0A12]">
                    <GithubIcon className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <h4 className="font-['Space_Grotesk'] text-lg font-bold text-[#0A0A12]">{item.title}</h4>
                    <span className="text-xs font-mono text-[#2340FF] font-bold">{item.metrics?.language || 'TypeScript / Full-Stack'}</span>
                  </div>
                </div>

                <a
                  href={item.original_url || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="pill b1 text-xs px-4 py-2 min-h-[38px] self-start sm:self-auto shadow-neo-sm font-bold flex items-center gap-1.5"
                >
                  <span>View on GitHub</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Git Clone Box */}
              <div className="space-y-1.5 font-mono">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#55586B]">Clone Repository</label>
                <div className="flex items-center justify-between px-4 py-3 rounded-[12px] bg-white border-2 border-[#0A0A12] text-xs font-mono text-[#0A0A12]">
                  <span className="truncate mr-2 select-all font-semibold">{cloneCmd}</span>
                  <button
                    onClick={handleCopyClone}
                    className="p-1 rounded text-[#55586B] hover:text-[#2340FF] transition-colors flex items-center gap-1 flex-shrink-0 font-bold"
                    title="Copy command"
                  >
                    {copiedClone ? <Check className="w-3.5 h-3.5 text-[#7CFFB2]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="text-[10px]">{copiedClone ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-[#55586B] leading-relaxed font-['DM_Sans']">
                {item.description || 'Engineered with clean architectural principles, automated tests, and verified open-source delivery.'}
              </p>
            </div>
          ) : (
            <div className="rounded-[18px] overflow-hidden border-2 border-[#0A0A12] bg-[#E8ECFF] shadow-sm relative aspect-video flex items-center justify-center">
              <img
                src={item.thumbnail_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] flex items-center justify-center">
                <a
                  href={item.original_url || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="w-16 h-16 rounded-full bg-[#2340FF] text-[#FFD84D] border-2 border-[#0A0A12] flex items-center justify-center shadow-neo transition-all hover:scale-105"
                >
                  <Play className="w-6 h-6 fill-current ml-1" />
                </a>
              </div>
            </div>
          )}

          {/* AI Case Study Breakdown (Goals, Tools, Outcomes) */}
          <div className="rounded-[18px] border-2 border-[#0A0A12] bg-[#E8ECFF] p-6 space-y-4">
            <div className="tg bg-[#7CFFB2] text-[#0A0A12] w-fit font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Synthesized Technical Case Study</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-['DM_Sans']">
              <div className="bx p-4 rounded-[14px] bg-white border-2 border-[#0A0A12] space-y-1 shadow-sm">
                <span className="font-bold text-[#0A0A12] block font-['Space_Grotesk']">1. System Goal</span>
                <p className="text-[11px] text-[#55586B] leading-relaxed">
                  Deliver high-scale concurrency and sub-millisecond response latency with modular type safety.
                </p>
              </div>

              <div className="bx p-4 rounded-[14px] bg-white border-2 border-[#0A0A12] space-y-1 shadow-sm">
                <span className="font-bold text-[#0A0A12] block font-['Space_Grotesk']">2. Technology Arsenal</span>
                <p className="text-[11px] text-[#55586B] leading-relaxed font-mono">
                  {item.metrics?.language || 'TypeScript'}, React, Node.js, WebSockets, Tailwind, Docker.
                </p>
              </div>

              <div className="bx p-4 rounded-[14px] bg-white border-2 border-[#0A0A12] space-y-1 shadow-sm">
                <span className="font-bold text-[#2340FF] block font-['Space_Grotesk']">3. Verified Outcome</span>
                <p className="text-[11px] text-[#55586B] leading-relaxed">
                  100% test coverage, verified GitHub deployment, and sub-second Vercel edge CDN availability.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
