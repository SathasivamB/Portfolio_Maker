import React from 'react';
import { Sparkles, Plus, Search } from 'lucide-react';

export default function EmptyProjectsState({ 
  onResetFilter, 
  onImportCustom,
  searchQuery = '' 
}) {
  return (
    <div className="bx p-8 border-2 border-[#0A0A12] shadow-neo rounded-[28px] bg-white text-center flex flex-col items-center justify-center my-4 max-w-md mx-auto animate-fade-in">
      
      {/* Playful Cat with Yarn & Empty Code File */}
      <div className="w-40 h-40 flex items-center justify-center">
        <svg viewBox="0 0 160 160" className="w-full h-full select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* File Sheet Outline */}
          <rect x="40" y="20" width="80" height="105" rx="10" stroke="#0A0A12" strokeWidth="2" fill="#F3F4F8" />
          <path d="M85 20V42H120" stroke="#0A0A12" strokeWidth="2" fill="#E8ECFF" />
          
          {/* Empty code lines */}
          <line x1="55" y1="55" x2="90" y2="55" stroke="#2340FF" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="55" y1="68" x2="105" y2="68" stroke="#0A0A12" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />
          <line x1="55" y1="80" x2="80" y2="80" stroke="#0A0A12" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />

          {/* Curious Cat Peeking from the side */}
          <ellipse cx="115" cy="115" rx="22" ry="20" stroke="#0A0A12" strokeWidth="2" fill="#FFFFFF" />
          {/* Cat Ears */}
          <path d="M102 100L98 84L110 94" stroke="#0A0A12" strokeWidth="2" fill="#FFFFFF" />
          <path d="M126 100L130 84L118 94" stroke="#0A0A12" strokeWidth="2" fill="#FFFFFF" />
          <path d="M103 96L100 89L107 93" fill="#2340FF" />
          <path d="M125 96L128 89L121 93" fill="#2340FF" />
          
          {/* Eyes */}
          <circle cx="108" cy="110" r="2.5" fill="#0A0A12" />
          <circle cx="120" cy="110" r="2.5" fill="#0A0A12" />
          <polygon points="114,115 112,118 116,118" fill="#FFD84D" />
          
          {/* Whiskers */}
          <line x1="97" y1="113" x2="88" y2="111" stroke="#0A0A12" strokeWidth="1.5" />
          <line x1="97" y1="117" x2="87" y2="119" stroke="#0A0A12" strokeWidth="1.5" />
          <line x1="127" y1="113" x2="136" y2="111" stroke="#0A0A12" strokeWidth="1.5" />
          <line x1="127" y1="117" x2="137" y2="119" stroke="#0A0A12" strokeWidth="1.5" />

          {/* Yarn Ball on the Floor */}
          <circle cx="35" cy="120" r="14" stroke="#0A0A12" strokeWidth="2" fill="#FFD84D" />
          <path d="M26 117C32 113 38 126 44 120" stroke="#0A0A12" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M30 126C35 120 40 115 42 124" stroke="#0A0A12" strokeWidth="1.5" strokeLinecap="round" />
          {/* Loose string trailing */}
          <path d="M45 128Q65 140 85 132Q100 128 110 135" stroke="#FFD84D" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#0A0A12] mt-1">
        {searchQuery ? `No Repositories Matching "${searchQuery}"` : 'Clean Slate · No Projects Found'}
      </h3>
      
      <p className="text-xs text-[#55586B] max-w-xs mt-1 leading-relaxed font-['DM_Sans']">
        {searchQuery 
          ? 'Try adjusting your language filter or search query to find your repositories.'
          : 'Connect your public GitHub repositories or add a manual project link to synthesize case studies.'}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
        {searchQuery && onResetFilter && (
          <button
            type="button"
            onClick={onResetFilter}
            className="pill b2 text-xs min-h-[36px] px-3 font-bold"
          >
            Clear Filter
          </button>
        )}
        {onImportCustom && (
          <button
            type="button"
            onClick={onImportCustom}
            className="pill b1 text-xs min-h-[36px] px-4 font-bold shadow-neo-sm"
          >
            <Plus className="w-3.5 h-3.5 text-[#FFD84D]" />
            <span>Add Custom Project</span>
          </button>
        )}
      </div>

    </div>
  );
}
