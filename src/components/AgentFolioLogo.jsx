import React from 'react';

/**
 * Signature Folio AI v2 Brand Mark:
 * Yellow dot (#FFD84D) with 2px obsidian border (#0A0A12) + lowercase 'folio' in Space Grotesk.
 */
export default function AgentFolioLogo({ 
  className = "", 
  size = 14, 
  showText = true,
  textClass = "font-space font-bold text-xl text-[#0A0A12] tracking-tight"
}) {
  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      {/* Signature Yellow Dot */}
      <i 
        className="inline-block flex-shrink-0 transition-transform duration-200 hover:scale-110"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          backgroundColor: '#FFD84D',
          border: '2px solid #0A0A12'
        }}
      />
      {showText && (
        <span className={textClass}>
          folio
        </span>
      )}
    </div>
  );
}
