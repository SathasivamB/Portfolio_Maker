import React, { useState } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  Bug, 
  Lightbulb, 
  Palette, 
  HelpCircle 
} from 'lucide-react';
import AgentFolioLogo from './AgentFolioLogo';

const CATEGORIES = [
  { id: 'bug', label: 'Bug Report', icon: Bug, color: '#FF6B6B' },
  { id: 'feature', label: 'Feature Request', icon: Lightbulb, color: '#FFD84D' },
  { id: 'design', label: 'Design Polish', icon: Palette, color: '#7CFFB2' },
  { id: 'general', label: 'General', icon: MessageSquare, color: '#2340FF' }
];

const RATINGS = [
  { value: 5, label: '😍 Outstanding' },
  { value: 4, label: '👍 Good' },
  { value: 3, label: '😐 Neutral' },
  { value: 2, label: '🤔 Needs Work' },
  { value: 1, label: '🐞 Found Bugs' }
];

export default function BetaFeedbackModal({ user, activeTemplate, onClose }) {
  const [category, setCategory] = useState('bug');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Please provide a brief description of your feedback.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          rating,
          message: message.trim(),
          username: user?.username || 'tester',
          email: email.trim() || user?.email || null,
          currentTemplate: activeTemplate || 'monolith',
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null
        })
      });

      const data = await res.json();
      if (data.success) {
        setIsSubmitted(true);
        setTimeout(() => {
          if (onClose) onClose();
        }, 2200);
      } else {
        setError(data.error || 'Failed to submit feedback. Please try again.');
      }
    } catch (err) {
      setError('Network error submitting feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0A12]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-['DM_Sans'] text-[#0A0A12]">
      <div className="bx w-full max-w-lg rounded-[28px] bg-white border-2 border-[#0A0A12] shadow-neo overflow-hidden my-auto animate-fade-in flex flex-col p-0">
        
        {/* Header */}
        <div className="px-5 py-4 border-b-2 border-[#0A0A12] bg-[#F3F4F8] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AgentFolioLogo />
            <div>
              <h2 className="font-['Space_Grotesk'] text-base font-bold text-[#0A0A12] tracking-tight flex items-center gap-2">
                <span>Public Beta Feedback</span>
                <span className="tg bg-[#7CFFB2] text-[#0A0A12] text-[10px] font-bold">
                  v0.9
                </span>
              </h2>
              <p className="text-[11px] text-[#55586B]">
                Direct line to the engineering &amp; design team
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#0A0A12] p-1.5 rounded-full border-2 border-[#0A0A12] hover:bg-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#7CFFB2] border-2 border-[#0A0A12] mx-auto flex items-center justify-center text-[#0A0A12] shadow-neo-sm">
              <CheckCircle2 className="w-8 h-8 text-[#0A0A12]" />
            </div>
            <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#0A0A12]">
              Feedback Received!
            </h3>
            <p className="text-xs text-[#55586B] max-w-sm mx-auto leading-relaxed">
              Thank you for testing Folio AI during our public beta. Your input directly influences our next feature update and design polish.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            
            {/* Category Selector */}
            <div>
              <label className="block text-xs font-bold text-[#0A0A12] mb-1.5 font-['Space_Grotesk'] uppercase tracking-wider">
                Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`pill text-xs py-2 px-2.5 flex items-center justify-center gap-1.5 font-bold transition-all border-2 border-[#0A0A12] ${
                        isSelected 
                          ? 'bg-[#0A0A12] text-white shadow-neo-sm' 
                          : 'bg-white text-[#0A0A12] hover:bg-[#F3F4F8]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" style={{ color: isSelected ? '#7CFFB2' : cat.color }} />
                      <span className="truncate">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Experience Rating */}
            <div>
              <label className="block text-xs font-bold text-[#0A0A12] mb-1.5 font-['Space_Grotesk'] uppercase tracking-wider">
                Experience Rating
              </label>
              <div className="flex flex-wrap gap-1.5">
                {RATINGS.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRating(r.value)}
                    className={`tg tg-interactive text-xs py-1 px-2.5 font-bold border border-[#0A0A12] ${
                      rating === r.value 
                        ? 'bg-[#FFD84D] text-[#0A0A12] shadow-sm' 
                        : 'bg-[#F3F4F8] text-[#55586B] hover:text-[#0A0A12]'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback Message */}
            <div>
              <label className="block text-xs font-bold text-[#0A0A12] mb-1.5 font-['Space_Grotesk'] uppercase tracking-wider">
                Your Feedback or Bug Details
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  category === 'bug'
                    ? 'What happened? What did you expect to happen instead?'
                    : category === 'feature'
                    ? 'What feature or integration would make this 10x better for your workflow?'
                    : 'Share your thoughts, UI ideas, or impressions...'
                }
                className="in w-full text-xs resize-none"
              />
            </div>

            {/* Follow-up Email (Optional) */}
            <div>
              <label className="block text-xs font-bold text-[#0A0A12] mb-1 font-['Space_Grotesk'] uppercase tracking-wider">
                Email for Follow-up <span className="text-[#55586B] font-normal normal-case">(optional)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="in w-full text-xs"
              />
            </div>

            {error && (
              <p className="text-xs text-[#C0392B] font-bold">{error}</p>
            )}

            {/* Submit Action */}
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#0A0A12]/15">
              <button
                type="button"
                onClick={onClose}
                className="pill b2 text-xs py-2 px-4 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="pill b1 text-xs py-2 px-5 font-bold flex items-center gap-1.5 shadow-neo-sm disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Sending...' : 'Send Beta Feedback'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
