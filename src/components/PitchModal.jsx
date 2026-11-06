import React, { useState } from 'react';
import { X, Sparkles, Copy, Check, Globe, Briefcase, Share2, ArrowRight } from 'lucide-react';
import AgentFolioLogo from './AgentFolioLogo';

export default function PitchModal({ isOpen, onClose, username, allItems = [] }) {
  const [clientName, setClientName] = useState('');
  const [clientIndustry, setClientIndustry] = useState('Tech & AI');
  const [customHeadline, setCustomHeadline] = useState('');
  const [selectedIds, setSelectedIds] = useState(allItems.map(i => i.id));
  const [generatedPitchUrl, setGeneratedPitchUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!clientName.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/client-pitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          clientName: clientName.trim(),
          clientIndustry,
          customHeadline: customHeadline.trim() || `Tailored Commercial Creative Works for ${clientName}`,
          selectedItemIds: selectedIds
        })
      });

      const data = await res.json();
      if (data.pitch) {
        setGeneratedPitchUrl(data.pitchUrl || `http://localhost:5000/pitch/${data.pitch.secret_slug}`);
      }
    } catch (err) {
      console.warn("Pitch generation error:", err);
      // Fallback
      setGeneratedPitchUrl(`http://localhost:5000/pitch/${username}-for-${clientName.toLowerCase().replace(/[^a-z0-9]/g, '')}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = () => {
    if (generatedPitchUrl) {
      navigator.clipboard?.writeText(generatedPitchUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0A12]/80 backdrop-blur-sm animate-fade-in font-['DM_Sans']">
      <div className="bx w-full max-w-xl bg-white border-2 border-[#0A0A12] rounded-[24px] sm:rounded-[28px] shadow-neo relative p-5 sm:p-8 space-y-5 sm:space-y-6 text-left text-[#0A0A12]">
        
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <div className="tg bg-[#7CFFB2] text-[#0A0A12] w-fit font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personalized Client Proposal Link</span>
            </div>
            <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-[#0A0A12] tracking-tight">
              Generate Client Proposal
            </h2>
            <p className="text-xs text-[#55586B] leading-relaxed font-['DM_Sans']">
              Generate an exclusive portfolio link tailored specifically for a target enterprise client, agency, or recruiter.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full border-2 border-[#0A0A12] bg-[#F3F4F8] text-[#0A0A12] hover:bg-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form or Result */}
        {!generatedPitchUrl ? (
          <form onSubmit={handleGenerate} className="space-y-4">
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#55586B] uppercase">Target Client / Brand Name</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Stripe, Acme Corp, Google, DeepMind"
                required
                className="in w-full text-sm font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#55586B] uppercase">Target Sector / Domain</label>
              <select
                value={clientIndustry}
                onChange={(e) => setClientIndustry(e.target.value)}
                className="in w-full text-sm font-medium cursor-pointer"
              >
                <option value="Tech & AI">Tech &amp; AI Engineering</option>
                <option value="Fintech & SaaS">Fintech &amp; High-Frequency Systems</option>
                <option value="E-Commerce & Scale">E-Commerce &amp; Distributed Systems</option>
                <option value="Creative & Media">Creative Media &amp; Visual Design</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#55586B] uppercase">Custom Proposal Headline (Optional)</label>
              <input
                type="text"
                value={customHeadline}
                onChange={(e) => setCustomHeadline(e.target.value)}
                placeholder={`e.g. Scalable Distributed Systems Architecture for ${clientName || 'Partner'}`}
                className="in w-full text-sm font-medium"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="pill b2 flex-1 text-xs min-h-[44px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !clientName.trim()}
                className="pill b1 flex-1 text-xs min-h-[44px] font-bold shadow-neo-sm hover:translate-x-0.5 disabled:opacity-40"
              >
                <span>{isSubmitting ? 'Generating Pitch...' : 'Create Proposal Link →'}</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 pt-2">
            <div 
              className="bx bx-lavender p-4 rounded-[18px] border-2 border-[#0A0A12] shadow-neo-sm space-y-2"
              style={{ backgroundColor: '#E8ECFF', color: '#0A0A12' }}
            >
              <span className="tg bg-[#7CFFB2] text-[#0A0A12] text-xs font-bold block w-fit">
                ✓ Confidential Proposal Link Ready
              </span>
              <p className="in text-xs text-[#2340FF] font-mono font-bold break-all select-all">
                {generatedPitchUrl}
              </p>
            </div>

            <div className="flex gap-2.5">
              <button
                onClick={handleCopy}
                className="pill b1 flex-1 min-h-[44px] text-xs font-bold shadow-neo-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Link Copied!' : 'Copy Pitch Link'}</span>
              </button>

              <button
                onClick={() => setGeneratedPitchUrl('')}
                className="pill b2 px-5 min-h-[44px] text-xs font-bold"
              >
                Create Another
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
