import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Code, 
  Terminal, 
  ExternalLink, 
  Check, 
  Send, 
  Mail, 
  ShieldCheck, 
  CheckCircle2, 
  Menu, 
  X, 
  Star, 
  Eye, 
  Layers, 
  Monitor, 
  Smartphone, 
  Tablet, 
  Copy, 
  Globe,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  LayoutGrid
} from 'lucide-react';
import AgentFolioLogo from '../components/AgentFolioLogo';
import LegalModal from '../components/LegalModal';
import { useLenis, gsap, ScrollTrigger } from '../utils/useLenis';
import { SpotlightCard, ShinyText, MagneticButton } from '../components/reactbits';

export default function LandingPage({ 
  user,
  onResumeSetup,
  onGoToStudio,
  onLogout,
  onStartPlacements, 
  onStartCreators, 
  onOpenLogin, 
  onOpenPricing 
}) {
  // Activate Lenis high-performance smooth inertia scrolling
  useLenis(true);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState(null); // 'privacy' | 'terms' | null

  // Responsive 2-Row Template Pagination State
  const [templateBatch, setTemplateBatch] = useState(0);
  const [showAllTemplates, setShowAllTemplates] = useState(false);
  const [gridColumns, setGridColumns] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window === 'undefined') return;
      if (window.innerWidth >= 1024) {
        setGridColumns(3);
      } else if (window.innerWidth >= 640) {
        setGridColumns(2);
      } else {
        setGridColumns(1);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // GSAP ScrollTrigger reveals with reduced-motion respect
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from('.gsap-step-card', {
        scrollTrigger: {
          trigger: '#how-it-works',
          start: 'top 85%',
          once: true,
        },
        y: 28,
        opacity: 0,
        duration: 0.65,
        stagger: 0.12,
        ease: 'power2.out',
      });
    });

    return () => ctx.revert();
  }, []);

  // Interactive Live Hero Preview State
  const [previewTheme, setPreviewTheme] = useState('monolith');

  // Interactive Sandbox State
  const [sandboxName, setSandboxName] = useState('Alex Morgan');
  const [sandboxRole, setSandboxRole] = useState('Full-stack engineer · Lisbon');
  const [sandboxAccent, setSandboxAccent] = useState('#2340FF');

  // Real contact form state
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [isSendingContact, setIsSendingContact] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState('');

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.name.trim() || !contactForm.email.trim()) {
      setContactError('Please fill in your name and email.');
      return;
    }

    setContactError('');
    setIsSendingContact(true);

    try {
      const res = await fetch('/api/contact/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          developerUsername: 'sathasivamb',
          clientName: contactForm.name,
          clientEmail: contactForm.email,
          message: contactForm.message,
          packageTitle: 'Inquiry via Folio AI Beta'
        })
      });

      const data = await res.json();
      if (!res.ok && !data.success) {
        throw new Error(data.error || 'Failed to dispatch message');
      }

      setContactSuccess(true);
      setContactForm({ name: '', email: '', message: '' });
      setTimeout(() => setContactSuccess(false), 5000);
    } catch (err) {
      setContactError(err.message || 'Unable to send message. Please try again.');
    } finally {
      setIsSendingContact(false);
    }
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const templates = [
    {
      id: 'monolith',
      name: 'Monolith',
      category: 'Developer',
      tier: 'Free',
      desc: 'Bold, dark developer portfolio with bento project cards.',
      bg: '#0A0A12',
      fg: '#FFFFFF',
      font: "font-['Space_Grotesk']",
      accent: '#FFD84D'
    },
    {
      id: 'prism',
      name: 'Prism Electric',
      category: 'Developer',
      tier: 'Premium',
      desc: 'High-energy electric gradient showcase for fullstack makers.',
      bg: '#2340FF',
      fg: '#FFD84D',
      font: "font-['Space_Grotesk']",
      accent: '#FFD84D'
    },
    {
      id: 'mono',
      name: 'Mono Swiss',
      category: 'Minimal',
      tier: 'Free',
      desc: 'Minimal, typography-driven layout with clean line borders.',
      bg: '#FFFFFF',
      fg: '#0A0A12',
      font: "font-mono",
      accent: '#0A0A12'
    },
    {
      id: 'editorial',
      name: 'Editorial Luxury',
      category: 'Professional',
      tier: 'Free',
      desc: 'Warm magazine-inspired serif layout for fractional leaders.',
      bg: '#F5F1E8',
      fg: '#1A1A1A',
      font: "font-serif",
      accent: '#8C271E'
    },
    {
      id: 'terminal',
      name: 'Cyber Terminal',
      category: 'Developer',
      tier: 'Free',
      desc: 'Hacker terminal with neon green prompt and mono-spaced logs.',
      bg: '#000000',
      fg: '#7CFFB2',
      font: "font-mono",
      accent: '#7CFFB2'
    },
    {
      id: 'canvas',
      name: 'Canvas Studio',
      category: 'Designer',
      tier: 'Premium',
      desc: 'Design systems and interactive token showcases for designers.',
      bg: '#E8ECFF',
      fg: '#0A0A12',
      font: "font-['Space_Grotesk']",
      accent: '#2340FF'
    },
    {
      id: 'neural',
      name: 'Neural AI Architect',
      category: 'AI/ML',
      tier: 'Premium',
      desc: 'Deep learning & LLM systems with 45M tok/s benchmarks.',
      bg: '#0A0A12',
      fg: '#7CFFB2',
      font: "font-mono",
      accent: '#7CFFB2'
    },
    {
      id: 'fintech',
      name: 'FinTech High-Frequency',
      category: 'Professional',
      tier: 'Premium',
      desc: 'Sub-800ns order matching & quant exchange systems.',
      bg: '#0A0A12',
      fg: '#FFD84D',
      font: "font-mono",
      accent: '#FFD84D'
    },
    {
      id: 'mobile',
      name: 'Native iOS Craft',
      category: 'Mobile',
      tier: 'Premium',
      desc: '120Hz SwiftUI mobile frames with App Store rating proof.',
      bg: '#0A0A12',
      fg: '#FFFFFF',
      font: "font-['Space_Grotesk']",
      accent: '#2340FF'
    },
    {
      id: 'founder',
      name: 'Founder Mode MVP',
      category: 'Creative',
      tier: 'Free',
      desc: '7-day rapid turnaround with live MRR revenue telemetry.',
      bg: '#FFD84D',
      fg: '#0A0A12',
      font: "font-['Space_Grotesk']",
      accent: '#0A0A12'
    },
    {
      id: 'cloud',
      name: 'DevOps & Cloud SRE',
      category: 'Developer',
      tier: 'Free',
      desc: 'Kubernetes GitOps topology with 99.999% SLA uptime metrics.',
      bg: '#0A0A12',
      fg: '#2340FF',
      font: "font-mono",
      accent: '#2340FF'
    },
    {
      id: 'spatial',
      name: '3D Spatial Interactive',
      category: 'Creative',
      tier: 'Premium',
      desc: 'Three.js 60fps GPU shaders & spatial interactive canvas.',
      bg: '#0A0A12',
      fg: '#7CFFB2',
      font: "font-['Space_Grotesk']",
      accent: '#7CFFB2'
    }
  ];

  return (
    <div className="w-full min-h-screen bg-[#F3F4F8] text-[#0A0A12] font-sans selection:bg-[#FFD84D] selection:text-[#0A0A12] relative overflow-x-hidden">
      
      {/* =========================================================================
          HERO BANNER IN ELECTRIC ROYAL BLUE (Matching 01_Landing.html of v2)
          ========================================================================= */}
      <div className="bg-[#2340FF] text-white px-6 md:px-14 pb-20 md:pb-28 rounded-b-[40px] md:rounded-b-[48px] border-b-2 border-[#0A0A12] shadow-neo">
        
        {/* Navigation Bar inside Blue Hero */}
        <header className="max-w-[1440px] mx-auto flex items-center justify-between py-6">
          {/* Logo */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
            className="lg text-white cursor-pointer select-none"
          >
            <i></i>folio
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-white/90">
            <button onClick={() => scrollTo('features')} className="hover:text-white transition-colors">
              Features
            </button>
            <button onClick={() => scrollTo('templates')} className="hover:text-white transition-colors">
              Templates
            </button>
            <button onClick={() => scrollTo('how-it-works')} className="hover:text-white transition-colors">
              How it works
            </button>
            <button onClick={() => scrollTo('sandbox')} className="hover:text-white transition-colors">
              Live Demo
            </button>
            <button onClick={onOpenPricing} className="hover:text-white transition-colors flex items-center gap-1 font-bold">
              <span>Beta Pass</span>
              <span className="tg bg-[#7CFFB2] text-[#0A0A12] text-[10px] py-0 px-1.5 font-bold">100% Free</span>
            </button>
            {!user && (
              <button onClick={onOpenLogin} className="hover:text-white transition-colors">
                Sign in
              </button>
            )}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full border border-white/20 text-xs text-white">
                  <span className="w-2 h-2 rounded-full bg-[#7CFFB2] animate-pulse"></span>
                  <span className="font-mono font-bold truncate max-w-[130px]">{user.name || user.username}</span>
                </div>
                {onResumeSetup && (
                  <button 
                    onClick={onResumeSetup}
                    className="pill by text-xs px-3.5 py-1 min-h-[38px] font-bold flex items-center gap-1.5 shadow-neo-sm hover:translate-x-0.5"
                    title={onGoToStudio ? "Customize blueprint" : "Compulsory: Setup your portfolio blueprint"}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#0A0A12]" />
                    <span>{onGoToStudio ? 'Customize Blueprint' : 'Complete Setup (Required) ⚡'}</span>
                  </button>
                )}
                {onGoToStudio && (
                  <button 
                    onClick={onGoToStudio}
                    className="pill b1 text-xs px-3.5 py-1 min-h-[38px] font-bold flex items-center gap-1.5 bg-white text-[#0A0A12] shadow-neo-sm hover:translate-x-0.5"
                    title="Open Creator Studio directly"
                  >
                    <span>Go to Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
                {onLogout && (
                  <button 
                    onClick={onLogout}
                    className="text-xs text-white/70 hover:text-white px-2 py-1 transition-colors"
                    title="Sign out of account"
                  >
                    Sign out
                  </button>
                )}
              </div>
            ) : (
              <>
                <MagneticButton strength={8}>
                  <button 
                    onClick={onOpenPricing}
                    className="pill text-xs px-3.5 py-1 min-h-[38px] bg-[#7CFFB2] text-[#0A0A12] border-2 border-[#0A0A12] shadow-neo-sm hover:translate-x-0.5 flex items-center gap-1.5 font-bold"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#2340FF]" />
                    <span>Beta Pass</span>
                  </button>
                </MagneticButton>
                <MagneticButton strength={10}>
                  <button 
                    onClick={onStartPlacements}
                    className="pill by text-sm"
                  >
                    Build my portfolio
                  </button>
                </MagneticButton>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden p-2 text-white"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-2 border-[#0A0A12] bg-[#FFFFFF] text-[#0A0A12] rounded-2xl p-6 space-y-4 my-4 shadow-neo">
            <button onClick={() => scrollTo('features')} className="block w-full text-left font-bold py-1">Features</button>
            <button onClick={() => scrollTo('templates')} className="block w-full text-left font-bold py-1">Templates</button>
            <button onClick={() => scrollTo('how-it-works')} className="block w-full text-left font-bold py-1">How it works</button>
            <button onClick={() => scrollTo('sandbox')} className="block w-full text-left font-bold py-1">Live Demo</button>
            <button onClick={onOpenPricing} className="block w-full text-left font-bold py-1 flex items-center justify-between text-[#2340FF]">
              <span>✦ Public Beta: All Features Unlocked</span>
              <span className="tg bg-[#7CFFB2] text-[#0A0A12] text-[10px]">100% Free</span>
            </button>
            <div className="pt-4 border-t border-[#0A0A12] flex flex-col gap-2">
              {user ? (
                <>
                  <div className="text-xs text-[#55586B] font-mono px-1 pb-1">
                    Signed in as <strong>{user.name || user.username}</strong>
                  </div>
                  {onResumeSetup && (
                    <button onClick={onResumeSetup} className="pill bg-[#FFD84D] text-[#0A0A12] w-full font-bold flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      <span>{onGoToStudio ? 'Customize Blueprint' : 'Complete Setup (Required) ⚡'}</span>
                    </button>
                  )}
                  {onGoToStudio && (
                    <button onClick={onGoToStudio} className="pill b1 w-full flex items-center justify-center gap-2">
                      <span>Go to Studio</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                  {onLogout && (
                    <button onClick={onLogout} className="pill b2 w-full text-xs">Sign out</button>
                  )}
                </>
              ) : (
                <>
                  <button onClick={onStartPlacements} className="pill bg-[#FFD84D] text-[#0A0A12] w-full font-bold">Build my portfolio</button>
                  <button onClick={onOpenLogin} className="pill b2 w-full">Sign in</button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Main Hero Split Grid */}
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-14 items-center pt-10 md:pt-14">
          
          {/* Left Column: Headline & Action */}
          <div className="flex flex-col gap-6">
            <div className="tg bg-white text-[#0A0A12] w-fit shadow-neo-sm flex items-center gap-2">
              <span>✦ Your portfolio, powered by AI</span>
              <span className="tg bg-[#2340FF] text-white text-[9px] py-0 px-1.5 font-bold">
                <ShinyText text="PRO EDITION" shimmerColor="#7CFFB2" baseColor="#FFFFFF" speed={3} />
              </span>
            </div>

            <h1 className="font-space text-4xl sm:text-6xl lg:text-[80px] xl:text-[88px] font-bold leading-[1.02] sm:leading-[0.95] tracking-[-0.03em] text-white break-words">
              Your work deserves a better{' '}
              <span className="bg-[#FFD84D] text-[#0A0A12] px-3 sm:px-3.5 py-0.5 sm:py-1 rounded-[16px] border-2 border-[#0A0A12] inline-block shadow-neo-sm">
                stage.
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-[19px] leading-relaxed text-white/90 max-w-[520px]">
              Connect your GitHub, let AI understand your work, and publish a portfolio that feels unmistakably yours.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              {user ? (
                <>
                  <MagneticButton strength={12}>
                    <button 
                      onClick={onResumeSetup || onGoToStudio}
                      className="pill by text-sm sm:text-base flex-1 sm:flex-none justify-center font-bold flex items-center gap-2 shadow-neo"
                    >
                      <Sparkles className="w-4 h-4 text-[#0A0A12]" />
                      <span>{onGoToStudio ? 'Open Studio ⚡' : 'Complete Setup (Required) ⚡'}</span>
                    </button>
                  </MagneticButton>
                  {onGoToStudio && (
                    <MagneticButton strength={10}>
                      <button 
                        onClick={onGoToStudio}
                        className="pill text-sm sm:text-base flex-1 sm:flex-none justify-center bg-white text-[#0A0A12] border-2 border-[#0A0A12] shadow-neo hover:translate-x-0.5 flex items-center gap-1.5 font-bold"
                      >
                        <span>Open Studio</span>
                        <ArrowRight className="w-4 h-4 text-[#0A0A12]" />
                      </button>
                    </MagneticButton>
                  )}
                </>
              ) : (
                <>
                  <MagneticButton strength={12}>
                    <button 
                      onClick={onStartPlacements}
                      className="pill by text-sm sm:text-base flex-1 sm:flex-none justify-center"
                    >
                      Build my portfolio
                    </button>
                  </MagneticButton>
                  <MagneticButton strength={10}>
                    <button 
                      onClick={() => scrollTo('templates')}
                      className="pill text-sm sm:text-base flex-1 sm:flex-none justify-center bg-white text-[#0A0A12] border-2 border-[#0A0A12] shadow-neo hover:translate-x-0.5 flex items-center gap-1.5 font-bold"
                    >
                      <Sparkles className="w-4 h-4 text-[#2340FF]" />
                      <span>Explore 12 Styles</span>
                    </button>
                  </MagneticButton>
                  <button 
                    onClick={onOpenPricing}
                    className="pill b2 text-sm sm:text-base flex-1 sm:flex-none justify-center"
                  >
                    Beta Pass (Free)
                  </button>
                </>
              )}
            </div>

            <p className="text-xs sm:text-sm text-white/80">
              Built for developers and designers. Free during beta.
            </p>

            {/* Mobile-Only Hero Card Preview (< sm viewports) */}
            <div className="block sm:hidden w-full mt-2">
              <div className="bx p-0 text-[#0A0A12] bg-white border-2 border-[#0A0A12] shadow-neo overflow-hidden rounded-[20px]">
                <div className="px-3.5 py-2 border-b-2 border-[#0A0A12] font-mono text-[11px] bg-[#F3F4F8] text-[#55586B] flex items-center justify-between">
                  <span>alex-morgan.folio.ai</span>
                  <span className="flex items-center gap-1.5 text-[10px] text-[#0A7A4F] font-bold font-mono">
                    <span className="w-2 h-2 rounded-full bg-[#7CFFB2] border border-[#0A0A12] inline-block" />
                    <span>Live ↗</span>
                  </span>
                </div>
                <div className="p-4 space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-[#FFD84D] border-2 border-[#0A0A12] flex items-center justify-center font-bold font-space text-sm text-[#0A0A12] flex-shrink-0">
                      AM
                    </div>
                    <div>
                      <h3 className="font-space font-bold text-base text-[#0A0A12] leading-tight">Alex Morgan</h3>
                      <p className="text-[11px] text-[#55586B]">Full-stack engineer · Lisbon</p>
                    </div>
                  </div>

                  <h4 className="font-space text-base font-bold leading-snug text-[#0A0A12]">
                    I build fast, quiet software for noisy problems.
                  </h4>

                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    <span className="tg bg-white text-[10px] py-0.5 px-2">Rust</span>
                    <span className="tg bg-white text-[10px] py-0.5 px-2">TypeScript</span>
                    <span className="tg bg-white text-[10px] py-0.5 px-2">Go</span>
                    <span className="tg bg-[#FFD84D] text-[10px] py-0.5 px-2">Relay ★ 1.2k</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Tilted Cards with Hard Shadows */}
          <div className="relative h-[480px] sm:h-[520px] w-full hidden sm:block">
            {/* Primary Browser Card Tilted -3deg */}
            <div className="bx absolute left-4 sm:left-8 top-6 w-[360px] sm:w-[430px] p-0 -rotate-3 text-[#0A0A12] z-10 transition-transform hover:rotate-0 overflow-hidden rounded-[24px]">
              <div className="px-4 py-2.5 border-b-2 border-[#0A0A12] font-mono text-xs bg-[#F3F4F8] text-[#55586B] flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] border border-[#0A0A12]/40"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] border border-[#0A0A12]/40"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] border border-[#0A0A12]/40"></span>
                  <span className="ml-2 font-mono text-xs text-[#0A0A12] font-semibold">alex-morgan.folio.ai</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-[#0A7A4F] font-bold font-mono">
                  <span className="w-2 h-2 rounded-full bg-[#7CFFB2] border border-[#0A0A12] animate-pulse"></span>
                  <span>Live ↗</span>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#FFD84D] border-2 border-[#0A0A12] flex items-center justify-center font-bold font-space text-lg text-[#0A0A12]">
                    AM
                  </div>
                  <div>
                    <h3 className="font-space font-bold text-xl text-[#0A0A12]">Alex Morgan</h3>
                    <p className="text-xs text-[#55586B]">Full-stack engineer · Lisbon</p>
                  </div>
                </div>

                <h3 className="font-space text-2xl font-bold leading-snug text-[#0A0A12]">
                  I build fast, quiet software for noisy problems.
                </h3>

                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="tg bg-white">Rust</span>
                  <span className="tg bg-white">TypeScript</span>
                  <span className="tg bg-white">Go</span>
                </div>
              </div>
            </div>

            {/* Sub-Card Tilted +4deg */}
            <div className="bx absolute right-2 sm:right-6 top-[250px] w-[270px] sm:w-[300px] rotate-4 text-[#0A0A12] z-20 transition-transform hover:rotate-0">
              <h3 className="font-space font-bold text-lg">Relay</h3>
              <p className="text-xs text-[#55586B] my-2">Realtime sync engine · ★ 1.2k</p>
              <span className="tg bg-[#FFD84D]">Featured project</span>
            </div>

            {/* Floating Live Badge Tilted -6deg */}
            <div className="absolute left-2 bottom-4 bg-[#FFD84D] text-[#0A0A12] border-2 border-[#0A0A12] rounded-full px-5 py-3 font-bold -rotate-6 shadow-neo z-30 select-none animate-float">
              Live in minutes ↗
            </div>
          </div>

        </div>
      </div>

      {/* =========================================================================
          3-STEP NUMBERED PROCESS (Matching 01_Landing.html of v2)
          ========================================================================= */}
      <section id="how-it-works" className="max-w-[1440px] mx-auto px-6 md:px-14 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SpotlightCard className="bx card-lift gsap-step-card rounded-[24px]" spotlightColor="rgba(35, 64, 255, 0.12)">
            <h1 className="font-space text-6xl font-bold text-[#2340FF] mb-3">1</h1>
            <h3 className="font-space text-2xl font-bold mb-1">Connect GitHub</h3>
            <p className="text-[#55586B] text-sm leading-relaxed">
              Pick the repositories and creative projects worth showing.
            </p>
          </SpotlightCard>

          <SpotlightCard className="bx card-lift gsap-step-card rounded-[24px]" spotlightColor="rgba(35, 64, 255, 0.12)">
            <h1 className="font-space text-6xl font-bold text-[#2340FF] mb-3">2</h1>
            <h3 className="font-space text-2xl font-bold mb-1">Let AI build</h3>
            <p className="text-[#55586B] text-sm leading-relaxed">
              Projects explained with technical depth in your authentic tone.
            </p>
          </SpotlightCard>

          <SpotlightCard className="bx card-lift gsap-step-card rounded-[24px]" spotlightColor="rgba(35, 64, 255, 0.12)">
            <h1 className="font-space text-6xl font-bold text-[#2340FF] mb-3">3</h1>
            <h3 className="font-space text-2xl font-bold mb-1">Customize &amp; publish</h3>
            <p className="text-[#55586B] text-sm leading-relaxed">
              Edit live with instant device previews, then go online on your link.
            </p>
          </SpotlightCard>
        </div>
      </section>

      {/* =========================================================================
          FEATURE BENTO GRID (Matching 01_Landing.html of v2)
          ========================================================================= */}
      <section id="features" className="max-w-[1440px] mx-auto px-6 md:px-14 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cyber Yellow AI Feature Box */}
          <div 
            className="bx bx-yellow col-span-1 md:col-span-2 flex flex-col justify-between card-lift"
            style={{ backgroundColor: '#FFD84D', color: '#0A0A12' }}
          >
            <div>
              <span className="tg bg-white text-[#0A0A12] mb-3 shadow-sm">Intelligent Synthesis</span>
              <h2 className="font-space text-3xl sm:text-4xl font-bold text-[#0A0A12] mt-2">
                AI project analysis
              </h2>
              <p className="text-base text-[#0A0A12]/85 mt-2 max-w-lg leading-relaxed">
                It reads your code, commit histories, and READMEs, then explains what each project actually accomplishes.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              <span className="tg tg-interactive bg-white">Auto-extracts tech stack</span>
              <span className="tg tg-interactive bg-white">Highlights key architecture</span>
              <span className="tg tg-interactive bg-white">Recruiter-ready summaries</span>
            </div>
          </div>

          {/* White Card: Templates */}
          <div className="bx flex flex-col justify-between card-lift">
            <div>
              <h3 className="font-space text-2xl font-bold mb-2">Beautiful templates</h3>
              <p className="text-[#55586B] text-sm leading-relaxed">
                Twelve distinct Figma-grade archetypes, from terminal hacker monospace to Neural AI and luxury editorial.
              </p>
            </div>
            <button onClick={() => scrollTo('templates')} className="pill b2 w-fit mt-6">
              View all 12 styles →
            </button>
          </div>

          {/* White Card: Instant Publishing */}
          <div className="bx flex flex-col justify-between card-lift">
            <div>
              <h3 className="font-space text-2xl font-bold mb-2">Instant publishing</h3>
              <p className="text-[#55586B] text-sm leading-relaxed">
                Your own live folio.ai address the moment you are ready, with custom domain support.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-6">
              <span className="tg bg-[#7CFFB2] w-fit">Free SSL included</span>
              {onOpenPricing && (
                <button
                  onClick={onOpenPricing}
                  className="tg bg-[#7CFFB2] text-[#0A0A12] hover:bg-white transition-colors cursor-pointer font-bold flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-[#2340FF]" />
                  <span>Public Beta Privileges &rarr;</span>
                </button>
              )}
            </div>
          </div>

          {/* Obsidian Black Full-Width Control Box */}
          <div 
            className="bx bx-dark col-span-1 md:col-span-2 flex flex-col justify-between card-lift"
            style={{ backgroundColor: '#0A0A12', color: '#FFFFFF' }}
          >
            <div>
              <span className="tg bg-white text-[#0A0A12] mb-3 inline-block font-bold shadow-sm">
                Privacy &amp; Security First
              </span>
              <h3 className="font-space text-2xl sm:text-3xl font-bold text-white mb-2">
                You choose what goes in
              </h3>
              <p className="text-white/85 text-sm sm:text-base leading-relaxed max-w-xl font-['DM_Sans']">
                Every repository, bio headline, and line of copy stays completely editable in Creator Studio.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2.5 font-mono text-xs">
              <span className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#7CFFB2] font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7CFFB2] inline-block" />
                <span>✓ Private repos stay private</span>
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#FFD84D] font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFD84D] inline-block" />
                <span>✓ No write access required</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          AUTHENTIC TEMPLATE GALLERY (Matching 04_Template_Gallery.html)
          ========================================================================= */}
      <section id="templates" className="max-w-[1440px] mx-auto px-6 md:px-14 py-16 md:py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="font-space text-4xl sm:text-6xl font-bold tracking-tight text-[#0A0A12]">
              Find your portfolio style
            </h2>
            <p className="text-base text-[#55586B] mt-2 flex flex-wrap items-center gap-2">
              <span>Twelve distinct Figma-grade starting points. Switch any time without losing content.</span>
              <span className="tg bg-[#7CFFB2] text-[#0A0A12] text-xs font-bold font-mono">✦ All 12 Unlocked in Beta</span>
            </p>
          </div>
          <button 
            onClick={onStartPlacements}
            className="pill b1 self-start md:self-auto"
          >
            Create with these templates
          </button>
        </div>

        {/* Dynamic 2-Row Template Grid */}
        {(() => {
          const itemsPerTwoRows = gridColumns * 2;
          const totalBatches = Math.max(1, Math.ceil(templates.length / itemsPerTwoRows));
          const currentBatchSafe = Math.min(templateBatch, totalBatches - 1);
          const visibleTemplates = showAllTemplates
            ? templates
            : templates.slice(currentBatchSafe * itemsPerTwoRows, currentBatchSafe * itemsPerTwoRows + itemsPerTwoRows);

          const startTemplateIndex = currentBatchSafe * itemsPerTwoRows + 1;
          const endTemplateIndex = Math.min((currentBatchSafe + 1) * itemsPerTwoRows, templates.length);
          const startRowNumber = currentBatchSafe * 2 + 1;
          const totalRows = Math.ceil(templates.length / gridColumns);
          const endRowNumber = Math.min((currentBatchSafe + 1) * 2, totalRows);

          const handleNextBatch = () => {
            if (currentBatchSafe < totalBatches - 1) {
              setTemplateBatch(b => b + 1);
            } else {
              setTemplateBatch(0);
            }
            const el = document.getElementById('templates');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
          };

          const handlePrevBatch = () => {
            setTemplateBatch(b => Math.max(0, b - 1));
            const el = document.getElementById('templates');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
          };

          return (
            <>
              {/* Cards Grid: Perfectly aligned on Phone, Tablet, and Desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">
                {visibleTemplates.map((tpl) => (
                  <SpotlightCard 
                    key={tpl.id} 
                    className="bx bx-hover flex flex-col justify-between gap-4 h-full rounded-[24px]"
                    spotlightColor={tpl.bg === '#0A0A12' ? 'rgba(255, 216, 77, 0.16)' : 'rgba(35, 64, 255, 0.12)'}
                  >
                    <div className="space-y-3">
                      {/* Preview Canvas */}
                      <div 
                        className={`h-40 sm:h-44 md:h-48 rounded-2xl p-4 sm:p-5 flex flex-col justify-between border-2 border-[#0A0A12] ${tpl.font} transition-transform group-hover:scale-[1.01]`}
                        style={{ background: tpl.bg, color: tpl.fg }}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono opacity-80 text-[11px] sm:text-xs truncate">{tpl.id}.folio.ai</span>
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: tpl.accent }}></span>
                        </div>
                        <div>
                          <div className="text-2xl sm:text-3xl font-bold tracking-tight">
                            {tpl.name}
                          </div>
                          <div className="text-[11px] sm:text-xs opacity-75 mt-0.5 font-mono">
                            {tpl.category} System
                          </div>
                        </div>
                      </div>

                      {/* Info Row */}
                      <div className="flex items-center justify-between pt-1">
                        <h3 className="font-space font-bold text-lg sm:text-xl text-[#0A0A12] truncate">{tpl.name}</h3>
                        <span className={`tg tg-interactive flex-shrink-0 text-[11px] font-bold ${tpl.tier === 'Premium' ? 'bg-[#7CFFB2] text-[#0A0A12]' : 'bg-white text-[#0A0A12]'}`}>
                          {tpl.tier === 'Premium' ? '★ Pro Archetype' : '✦ Core Archetype'}
                        </span>
                      </div>
                      <p className="text-xs text-[#55586B] leading-relaxed line-clamp-2 min-h-[32px]">
                        {tpl.desc}
                      </p>
                    </div>

                    {/* Action Buttons: Stays glued to bottom */}
                    <div className="flex items-center gap-2 pt-3 border-t-2 border-[#0A0A12]/10 mt-auto">
                      <button 
                        onClick={() => {
                          setPreviewTheme(tpl.id);
                          scrollTo('sandbox');
                        }}
                        className="pill b2 flex-1 text-xs min-h-[40px] px-2 sm:px-3 font-bold"
                      >
                        Preview
                      </button>
                      <button 
                        onClick={() => onStartPlacements(tpl.id)}
                        className="pill b1 flex-1 text-xs min-h-[40px] px-2 sm:px-3 font-bold"
                      >
                        Use template
                      </button>
                    </div>
                  </SpotlightCard>
                ))}
              </div>

              {/* Show More & 2-Row Pagination Control Bar */}
              <div className="mt-8 pt-6 border-t-2 border-[#0A0A12]/15 flex flex-col md:flex-row items-center justify-between gap-4">
                
                {/* Left: Row & Template Count Badge */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="tg bg-white text-[#0A0A12] border border-[#0A0A12]/20 font-bold text-xs shadow-sm">
                    {showAllTemplates ? (
                      `Showing all 12 templates (${totalRows} rows)`
                    ) : (
                      `Showing Rows ${startRowNumber}–${endRowNumber} (${startTemplateIndex}–${endTemplateIndex} of ${templates.length} styles)`
                    )}
                  </span>
                  <span className="text-[11px] text-[#55586B] font-mono hidden sm:inline">
                    • 2 rows visible per view
                  </span>
                </div>

                {/* Right: Interactive Navigation & Show More Button */}
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  
                  {/* Prev Button (Only when not on first batch and in 2-row mode) */}
                  {!showAllTemplates && currentBatchSafe > 0 && (
                    <button
                      type="button"
                      onClick={handlePrevBatch}
                      className="pill b2 text-xs min-h-[38px] px-3 font-bold flex items-center gap-1.5 hover:shadow-neo-sm"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Prev 2 rows</span>
                    </button>
                  )}

                  {/* Batch Pills for Direct Jumping to Any 2 Rows */}
                  {!showAllTemplates && totalBatches > 1 && Array.from({ length: totalBatches }).map((_, idx) => {
                    const isCurrent = idx === currentBatchSafe;
                    const sRow = idx * 2 + 1;
                    const eRow = Math.min((idx + 1) * 2, totalRows);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setTemplateBatch(idx);
                          document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold border-2 transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-[#FFD84D] text-[#0A0A12] border-[#0A0A12] shadow-neo-sm scale-105'
                            : 'bg-white text-[#55586B] border-[#0A0A12]/30 hover:border-[#0A0A12] hover:text-[#0A0A12]'
                        }`}
                        title={`Jump to Rows ${sRow}–${eRow}`}
                      >
                        Rows {sRow}–{eRow}
                      </button>
                    );
                  })}

                  {/* Show More Button (Loads Next 2 Rows) */}
                  {!showAllTemplates && totalBatches > 1 && (
                    <button
                      type="button"
                      onClick={handleNextBatch}
                      className="pill b1 text-xs min-h-[38px] px-4 font-bold flex items-center gap-1.5 shadow-neo-sm hover:translate-x-0.5"
                    >
                      <span>{currentBatchSafe < totalBatches - 1 ? 'Show more (Next 2 rows)' : '↺ First 2 rows'}</span>
                      {currentBatchSafe < totalBatches - 1 ? (
                        <ChevronRight className="w-3.5 h-3.5" />
                      ) : (
                        <RotateCcw className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}

                  {/* View All / Compact Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowAllTemplates(!showAllTemplates)}
                    className="pill b2 text-xs min-h-[38px] px-3 font-bold border-dashed border-[#0A0A12]/40 hover:border-solid hover:border-[#0A0A12]"
                  >
                    {showAllTemplates ? 'Show 2 Rows (Compact)' : 'View All 12 Styles'}
                  </button>
                </div>
              </div>
            </>
          );
        })()}
      </section>

      {/* =========================================================================
          LIVE INTERACTIVE SANDBOX (Test in Real-Time)
          ========================================================================= */}
      <section id="sandbox" className="max-w-[1440px] mx-auto px-6 md:px-14 py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="tg bg-[#FFD84D] text-[#0A0A12] mb-3">Live Interactive Sandbox</span>
          <h2 className="font-space text-3xl sm:text-5xl font-bold text-[#0A0A12]">
            Try your name in the editor
          </h2>
          <p className="text-base text-[#55586B] mt-2">
            Type below to see live rendering with hard neo-brutalist styling.
          </p>
        </div>

        <div className="bx max-w-4xl mx-auto p-6 md:p-8 space-y-6">
          {/* Controls Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0A0A12] mb-1 font-space uppercase">Your Name</label>
              <input 
                type="text" 
                value={sandboxName}
                onChange={(e) => setSandboxName(e.target.value)}
                className="in w-full text-sm font-bold"
                placeholder="e.g. Alex Morgan"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0A0A12] mb-1 font-space uppercase">Role &amp; City</label>
              <input 
                type="text" 
                value={sandboxRole}
                onChange={(e) => setSandboxRole(e.target.value)}
                className="in w-full text-sm font-medium"
                placeholder="e.g. Full-stack engineer · Lisbon"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0A0A12] mb-1 font-space uppercase">Accent Theme</label>
              <div className="flex items-center gap-3 h-[48px] px-3 bg-[#E8ECFF] rounded-[14px] border-2 border-[#0A0A12]">
                {['#2340FF', '#FFD84D', '#0A0A12', '#7CFFB2', '#C0392B'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setSandboxAccent(color)}
                    className="w-7 h-7 rounded-full border-2 border-[#0A0A12] transition-transform"
                    style={{
                      backgroundColor: color,
                      transform: sandboxAccent === color ? 'scale(1.25)' : 'scale(1)'
                    }}
                    aria-label={`Select accent ${color}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Live Mockup Window */}
          <div className="border-2 border-[#0A0A12] rounded-2xl bg-white overflow-hidden shadow-neo-sm">
            <div className="px-4 py-2 border-b-2 border-[#0A0A12] bg-[#F3F4F8] flex items-center justify-between font-mono text-xs">
              <span>{sandboxName ? sandboxName.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'alex'}.folio.ai</span>
              <span className="tg bg-[#7CFFB2] text-[10px] py-0 px-2">Live Preview</span>
            </div>
            <div className="p-8 md:p-12 bg-[#F3F4F8]">
              <h3 className="font-space text-4xl sm:text-5xl font-bold text-[#0A0A12] tracking-tight mb-2">
                {sandboxName || 'Your Name'}
              </h3>
              <p className="text-base text-[#55586B] mb-6">
                {sandboxRole || 'Full-stack engineer'}
              </p>
              <div className="flex flex-wrap gap-2">
                <span 
                  className="pill text-xs py-1 px-4 min-h-[34px] border-2 border-[#0A0A12]"
                  style={{ backgroundColor: sandboxAccent, color: sandboxAccent === '#FFD84D' ? '#0A0A12' : '#FFFFFF' }}
                >
                  Distributed Systems
                </span>
                <span 
                  className="pill text-xs py-1 px-4 min-h-[34px] border-2 border-[#0A0A12]"
                  style={{ backgroundColor: sandboxAccent, color: sandboxAccent === '#FFD84D' ? '#0A0A12' : '#FFFFFF' }}
                >
                  Rust &amp; TypeScript
                </span>
                <span 
                  className="pill text-xs py-1 px-4 min-h-[34px] border-2 border-[#0A0A12]"
                  style={{ backgroundColor: sandboxAccent, color: sandboxAccent === '#FFD84D' ? '#0A0A12' : '#FFFFFF' }}
                >
                  AI Infrastructure
                </span>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <span className="text-xs text-[#55586B]">
              Ready to generate your complete portfolio with AI?
            </span>
            <button onClick={() => onStartPlacements('monolith', { name: sandboxName, role: sandboxRole, accent: sandboxAccent })} className="pill b1 w-full sm:w-auto">
              Continue with this layout <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          REAL CONTACT & INQUIRY FORM
          ========================================================================= */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-14 py-16 border-t-2 border-[#0A0A12]">
        <div className="max-w-xl mx-auto bx space-y-6">
          <div className="text-center">
            <span className="tg bg-[#7CFFB2] text-[#0A0A12] mb-2">Direct Channel</span>
            <h3 className="font-space text-3xl font-bold mt-2">Have a question or request?</h3>
            <p className="text-xs text-[#55586B] mt-1">Get in touch directly with our product team.</p>
          </div>

          {contactSuccess ? (
            <div className="p-6 rounded-2xl bg-[#7CFFB2]/20 border-2 border-[#0A0A12] text-center">
              <CheckCircle2 className="w-10 h-10 text-[#0A0A12] mx-auto mb-2" />
              <p className="font-space font-bold text-lg text-[#0A0A12]">Message Sent Successfully!</p>
              <p className="text-xs text-[#55586B] mt-1">We will respond to your email promptly.</p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0A0A12] mb-1 font-space uppercase">Name</label>
                <input 
                  type="text" 
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  placeholder="Your full name"
                  className="in w-full text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0A0A12] mb-1 font-space uppercase">Email</label>
                <input 
                  type="email" 
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="you@domain.com"
                  className="in w-full text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0A0A12] mb-1 font-space uppercase">Message</label>
                <textarea 
                  rows={3}
                  required
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="Tell us what you are looking for..."
                  className="in w-full text-sm resize-none"
                />
              </div>

              {contactError && (
                <p className="text-xs text-[#C0392B] font-bold">{contactError}</p>
              )}

              <button 
                type="submit" 
                disabled={isSendingContact}
                className="pill b1 w-full justify-center text-sm disabled:opacity-50"
              >
                {isSendingContact ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* =========================================================================
          BOTTOM CTA BANNER (Matching 01_Landing.html of v2)
          ========================================================================= */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-14 py-12">
        <div 
          className="bx bx-yellow text-center p-12 md:p-16 space-y-6 card-lift"
          style={{ backgroundColor: '#FFD84D', color: '#0A0A12' }}
        >
          <h2 className="font-space text-4xl sm:text-6xl font-bold tracking-tight text-[#0A0A12]">
            Give your work a better stage.
          </h2>
          <p className="text-[#0A0A12]/85 text-base sm:text-lg max-w-xl mx-auto">
            From GitHub to published in minutes. No design skills or setup headaches required.
          </p>
          <div>
            <MagneticButton strength={12}>
              <button 
                onClick={user ? (onGoToStudio || onResumeSetup) : onStartPlacements}
                className="pill b1 text-base px-8 font-bold"
              >
                {user ? (onGoToStudio ? 'Open Studio ⚡' : 'Complete Setup (Required) ⚡') : 'Build my portfolio'}
              </button>
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FOOTER (Matching 01_Landing.html of v2)
          ========================================================================= */}
      <footer className="border-t-2 border-[#0A0A12] bg-[#FFFFFF]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-14 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="lg text-[#0A0A12]">
            <i></i>folio
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-[#55586B] font-mono">
            <span className="tg bg-[#7CFFB2] text-[#0A0A12] text-[10px] font-bold">Public Beta v0.9</span>
            <span>© folio</span>
            <span>·</span>
            <button 
              type="button"
              onClick={() => setLegalModalTab('privacy')}
              className="hover:text-[#0A0A12] transition-colors underline-offset-2 hover:underline cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>·</span>
            <button 
              type="button"
              onClick={() => setLegalModalTab('terms')}
              className="hover:text-[#0A0A12] transition-colors underline-offset-2 hover:underline cursor-pointer"
            >
              Beta Terms
            </button>
            <span>·</span>
            <span>All rights reserved.</span>
          </div>
        </div>
      </footer>

      {/* Legal & Privacy Policy Modal */}
      {legalModalTab && (
        <LegalModal
          initialTab={legalModalTab}
          onClose={() => setLegalModalTab(null)}
        />
      )}

    </div>
  );
}
