import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  X,
  ArrowRight,
  Lock,
  Key,
  Shield
} from 'lucide-react';
import VideoModal from '../components/VideoModal';
import UnifiedPortfolioView from '../components/themes/UnifiedPortfolioView';
import NotFoundPage from './NotFoundPage';
import AgentFolioLogo from '../components/AgentFolioLogo';
import { useRealtime } from '../utils/useRealtime';
import { useLenis } from '../utils/useLenis';

export default function PublicPortfolio({ username = 'sathasivamb', pitchSlug = null }) {
  // Activate Lenis smooth scrolling for visitors
  useLenis(true);

  const cleanUser = (username || 'sathasivamb').replace(/^:/, '').replace(/^@/, '').trim() || 'sathasivamb';
  const cacheKey = pitchSlug ? `cached_pitch_${pitchSlug}` : `cached_portfolio_${cleanUser}`;

  // Instant SWR state: Load from cache immediately to eliminate loading delay
  const cachedData = (() => {
    try {
      const raw = sessionStorage.getItem(cacheKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const [portfolio, setPortfolio] = useState(() => cachedData?.portfolio || null);
  const [user, setUser] = useState(() => cachedData?.user || null);
  const [pitch, setPitch] = useState(() => cachedData?.pitch || null);
  const [loading, setLoading] = useState(() => !cachedData?.portfolio);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  
  // Real-time flash notification
  const [liveUpdateAlert, setLiveUpdateAlert] = useState(null);

  // Inquiry / Retainer modal
  const [inquiryModalPkg, setInquiryModalPkg] = useState(null);
  const [inquiryForm, setInquiryForm] = useState({ clientName: '', email: '', message: '' });
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  // Password / PIN protection state
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(() => {
    try {
      return sessionStorage.getItem(`pin_unlocked_${cleanUser}`) === 'true';
    } catch {
      return false;
    }
  });

  // Fetch / Revalidate initial data seamlessly
  useEffect(() => {
    async function fetchData() {
      if (!portfolio) setLoading(true);
      try {
        if (pitchSlug) {
          const res = await fetch(`/api/pitch/${pitchSlug}`);
          if (!res.ok) throw new Error('Pitch link not found or expired.');
          const data = await res.json();
          setPortfolio(data.portfolio);
          setUser(data.user);
          setPitch(data.pitch);
          try { sessionStorage.setItem(cacheKey, JSON.stringify(data)); } catch {}
        } else {
          const res = await fetch(`/api/portfolio/${cleanUser}`);
          if (!res.ok) throw new Error(`Creator @${cleanUser} not found or synchronizing.`);
          const data = await res.json();
          setPortfolio(data.portfolio);
          setUser(data.user);
          try { sessionStorage.setItem(cacheKey, JSON.stringify(data)); } catch {}
        }
      } catch (err) {
        setError(err.message);
        setPortfolio(null);
        try { sessionStorage.removeItem(cacheKey); } catch {}
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [cleanUser, pitchSlug, cacheKey]);

  // Connect to Real-Time Hub
  const { isConnected, activeViewers, emitVideoPlay, emitInquiry } = useRealtime({
    role: 'viewer',
    username: cleanUser,
    pitchSlug,
    clientName: pitch?.client_name || 'Prospective Client',
    onPortfolioUpdated: (data) => {
      if (data.portfolio) {
        setPortfolio(data.portfolio);
        setLiveUpdateAlert(`⚡ Live Update from Creator: "${data.trigger || 'Portfolio refreshed'}"`);
        setTimeout(() => setLiveUpdateAlert(null), 6000);
      }
    }
  });

  const handleOpenVideo = (item) => {
    setSelectedVideo(item);
    emitVideoPlay(item.title, item.duration || '0:00');
  };

  const handleBookPackage = (pkg) => {
    setInquiryModalPkg(pkg);
    setInquirySubmitted(false);
  };

  const handleSubmitInquiry = async (e) => {
    e.preventDefault();
    if (!inquiryForm.email.trim() || !inquiryModalPkg) return;

    setIsSubmittingInquiry(true);
    try {
      await fetch('/api/client-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: cleanUser,
          clientName: inquiryForm.clientName || 'Prospective Client',
          email: inquiryForm.email,
          packageName: inquiryModalPkg.title,
          projectDetails: inquiryForm.message
        })
      });

      emitInquiry(inquiryModalPkg.title, inquiryForm.email, inquiryForm.clientName);
      setInquirySubmitted(true);
      setTimeout(() => {
        setInquiryModalPkg(null);
        setInquirySubmitted(false);
      }, 3500);
    } catch {
      alert('Unable to transmit inquiry. Please try again.');
    } finally {
      setIsSubmittingInquiry(false);
    }
  };

  if (loading && !portfolio) {
    return (
      <div className="min-h-screen bg-[#F3F4F8] flex flex-col items-center justify-center text-[#0A0A12] font-['DM_Sans']">
        <div className="w-10 h-10 border-4 border-[#2340FF] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-mono font-bold tracking-widest uppercase text-[#55586B]">Synchronizing Real-Time Portfolio...</p>
      </div>
    );
  }

  if (error || !portfolio) {
    return <NotFoundPage missingHandle={cleanUser} customMessage={error} />;
  }

  // Check if current session belongs to this creator
  let isOwner = false;
  try {
    const saved = localStorage.getItem('portfolio_studio_user');
    if (saved) {
      const u = JSON.parse(saved);
      if (u?.username && u.username.toLowerCase() === cleanUser.toLowerCase()) {
        isOwner = true;
      }
    }
  } catch {}

  const isPrivate = portfolio?.visibility === 'private';
  const isPassword = portfolio?.visibility === 'password';
  const requiredPin = portfolio?.access_pin || '1234';

  // If set to private and viewer is NOT the owner (e.g. stranger / incognito search):
  if (isPrivate && !isOwner) {
    return (
      <NotFoundPage 
        missingHandle={cleanUser} 
        customMessage={`Creator @${cleanUser}'s portfolio is currently in Private Draft Mode. Only the creator can access this page while logged in.`} 
      />
    );
  }

  // If password protected and viewer is NOT the owner and hasn't unlocked yet:
  if (isPassword && !isOwner && !isUnlocked) {
    return (
      <div className="min-h-screen bg-[#F3F4F8] text-[#0A0A12] font-['DM_Sans'] flex flex-col justify-between p-4 sm:p-8">
        <header className="w-full max-w-5xl mx-auto flex items-center justify-between py-2">
          <AgentFolioLogo />
          <span className="tg bg-[#FFD84D] text-[#0A0A12] text-[11px] font-mono font-bold py-1 px-3">
            PROTECTED PORTFOLIO
          </span>
        </header>

        <main className="flex-1 flex items-center justify-center my-6">
          <div className="bx w-full max-w-[440px] p-8 border-2 border-[#0A0A12] shadow-neo rounded-[28px] bg-white flex flex-col items-center text-center gap-4 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-[#E8ECFF] text-[#2340FF] border-2 border-[#0A0A12] flex items-center justify-center shadow-neo-sm">
              <Lock className="w-6 h-6" />
            </div>

            <div>
              <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-[#0A0A12]">
                Creator @{cleanUser}
              </h2>
              <p className="text-xs text-[#55586B] mt-1 font-['DM_Sans']">
                This portfolio is password protected. Enter the client access PIN to view.
              </p>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (enteredPin.trim() === requiredPin.trim()) {
                  setIsUnlocked(true);
                  try { sessionStorage.setItem(`pin_unlocked_${cleanUser}`, 'true'); } catch {}
                } else {
                  setPinError(true);
                  setTimeout(() => setPinError(false), 2500);
                }
              }}
              className="w-full space-y-3 pt-2"
            >
              <input
                type="password"
                maxLength={8}
                value={enteredPin}
                onChange={(e) => setEnteredPin(e.target.value)}
                placeholder="Enter access PIN..."
                className={`in w-full text-center text-lg font-mono tracking-widest min-h-[46px] ${pinError ? 'border-[#EF4444] bg-[#EF4444]/10 animate-shake' : ''}`}
                autoFocus
              />
              {pinError && (
                <p className="text-xs text-[#EF4444] font-bold font-mono">
                  Incorrect PIN. Please verify with the creator.
                </p>
              )}

              <button
                type="submit"
                className="pill b1 w-full text-sm min-h-[44px] font-bold shadow-neo-sm hover:translate-x-0.5"
              >
                Unlock Portfolio →
              </button>
            </form>
          </div>
        </main>

        <footer className="w-full max-w-5xl mx-auto text-center py-2 text-xs text-[#55586B] font-mono">
          folio.ai · secure client portal
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen selection:bg-[#FFD84D] selection:text-[#0A0A12] bg-[#F3F4F8] font-['DM_Sans']">
      
      {/* Owner Navigation Helper Bar */}
      {isOwner && (
        <div className={`border-b-2 border-[#0A0A12] px-6 py-2.5 flex items-center justify-between text-xs font-['DM_Sans'] sticky top-0 z-50 backdrop-blur-md ${isPrivate ? 'bg-[#FFD84D]/90' : isPassword ? 'bg-[#E8ECFF]/90' : 'bg-white/85'}`}>
          <div className="flex items-center gap-2 text-[#0A0A12]">
            <span className={`w-2.5 h-2.5 rounded-full border border-[#0A0A12] ${isPrivate ? 'bg-[#EF4444]' : 'bg-[#7CFFB2] animate-ping'}`} />
            <span className="font-bold font-['Space_Grotesk']">
              {isPrivate ? '🔒 Private Draft Preview Active' : isPassword ? `🔑 PIN Protected Preview Active (PIN: ${requiredPin})` : 'Public Creator View Active'}
            </span>
            <span className="text-[#55586B] hidden sm:inline">
              {isPrivate 
                ? '— Hidden from strangers & incognito searches. Only you can preview this.' 
                : isPassword
                ? `— Visitors must enter PIN ${requiredPin} to unlock.`
                : `— You are viewing your portfolio live at /u/${cleanUser}`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isPrivate ? (
              <button
                onClick={async () => {
                  try {
                    const updated = { ...portfolio, visibility: 'public' };
                    setPortfolio(updated);
                    await fetch(`/api/portfolio/${cleanUser}`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ portfolio: updated, trigger: 'Made Public from Preview' })
                    });
                  } catch {}
                }}
                className="pill b1 text-xs px-3 py-1 min-h-[34px] font-bold shadow-neo-sm hover:translate-x-0.5"
              >
                Make Public Now 🚀
              </button>
            ) : (
              <button
                onClick={async () => {
                  try {
                    const updated = { ...portfolio, visibility: 'private' };
                    setPortfolio(updated);
                    await fetch(`/api/portfolio/${cleanUser}`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ portfolio: updated, trigger: 'Made Private from Preview' })
                    });
                  } catch {}
                }}
                className="pill b2 text-xs px-3 py-1 min-h-[34px] font-bold hover:bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]"
                title="Hide portfolio from incognito / public visitors"
              >
                Set to Private 🔒
              </button>
            )}
            <button
              onClick={() => {
                window.history.pushState({}, '', '/');
                window.dispatchEvent(new CustomEvent('app:navigate', { detail: { url: '/' } }));
              }}
              className="pill b2 text-xs px-4 py-1 min-h-[36px] font-bold"
            >
              ← Back to Studio Editor
            </button>
          </div>
        </div>
      )}

      {/* Real-Time Live Notification Flash Banner */}
      {liveUpdateAlert && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="pill by flex items-center gap-2.5 px-5 py-2 border-2 border-[#0A0A12] text-[#0A0A12] text-xs font-bold shadow-neo">
            <span className="w-2 h-2 rounded-full bg-[#2340FF] animate-ping" />
            <span>{liveUpdateAlert}</span>
          </div>
        </div>
      )}

      {/* Unified Pixel-Perfect Portfolio Engine */}
      <UnifiedPortfolioView
        portfolio={portfolio}
        user={user}
        pitch={pitch}
        isStudio={false}
        onOpenVideo={handleOpenVideo}
        onBookPackage={handleBookPackage}
        onOpenInquiry={handleBookPackage}
      />

      {/* Video Modal with AI Case Study */}
      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}

      {/* Client Retainer Inquiry Modal */}
      {inquiryModalPkg && (
        <div className="fixed inset-0 z-50 bg-[#0A0A12]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bx w-full max-w-md border-2 border-[#0A0A12] shadow-neo p-6 relative text-left bg-white rounded-[24px]">
            <button
              onClick={() => setInquiryModalPkg(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full border-2 border-[#0A0A12] text-[#0A0A12] hover:bg-[#F3F4F8] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {inquirySubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#7CFFB2] text-[#0A0A12] border-2 border-[#0A0A12] flex items-center justify-center mx-auto text-xl font-bold shadow-neo-sm">
                  ✓
                </div>
                <h3 className="text-xl font-bold text-[#0A0A12] font-['Space_Grotesk']">Inquiry Delivered Live</h3>
                <p className="text-xs text-[#55586B] leading-relaxed font-['DM_Sans']">
                  Your request for <strong>{inquiryModalPkg.title}</strong> has been transmitted directly into {user?.name}'s Studio in real time.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitInquiry} className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="tg bg-[#FFD84D] text-[#0A0A12] text-[10px] font-bold">
                      Direct Inquiry
                    </span>
                    <span className="text-sm font-bold text-[#0A0A12] font-['Space_Grotesk']">{inquiryModalPkg.title}</span>
                  </div>
                  <p className="text-xs text-[#55586B] font-['DM_Sans']">
                    Price: <strong className="text-[#0A0A12]">{inquiryModalPkg.price}</strong> • {inquiryModalPkg.turnaround}
                  </p>
                </div>

                <div>
                  <label className="block text-xs text-[#0A0A12] mb-1 font-bold">Your Name / Organization</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Systems / Sarah Jenkins"
                    value={inquiryForm.clientName}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, clientName: e.target.value })}
                    className="in w-full text-xs text-[#0A0A12]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#0A0A12] mb-1 font-bold">Contact Email</label>
                  <input
                    type="email"
                    required
                    placeholder="sarah@company.com"
                    value={inquiryForm.email}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                    className="in w-full text-xs text-[#0A0A12]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#0A0A12] mb-1 font-bold">Project Scope &amp; Deadlines (Optional)</label>
                  <textarea
                    rows={3}
                    placeholder="Briefly describe your requirements or feature wishlist..."
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                    className="in w-full text-xs text-[#0A0A12] resize-none font-['DM_Sans']"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingInquiry}
                  className="pill b1 w-full text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50 min-h-[44px] shadow-neo-sm hover:translate-x-0.5"
                >
                  <span>{isSubmittingInquiry ? 'Transmitting...' : 'Submit Inquiry'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
