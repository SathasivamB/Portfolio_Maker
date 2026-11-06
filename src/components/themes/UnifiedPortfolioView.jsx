import React, { useState } from 'react';
import { 
  Play, 
  ExternalLink, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  Share2, 
  ShieldCheck, 
  Check, 
  BarChart3, 
  Wrench, 
  Calendar, 
  CheckCircle2, 
  Code, 
  Terminal, 
  Copy,
  Star,
  GitBranch,
  Layers,
  MessageSquare,
  Search,
  Award,
  Mail,
  Send,
  Phone,
  MapPin,
  ChevronRight,
  Maximize2,
  Minimize2,
  Menu,
  X,
  Smartphone,
  Cpu,
  Globe,
  Sliders,
  Zap,
  Box
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, GoogleIcon } from '../Icons';
import AgentFolioLogo from '../AgentFolioLogo';
import { SpotlightCard } from '../reactbits';
import { FOLIO_TEMPLATES } from '../../constants/templates';

export const COLOR_PALETTES = [
  {
    id: 'prism-electric',
    name: 'Prism Electric (Folio AI v2)',
    primary: '#0A0A12',
    secondary: '#55586B',
    muted: '#7A8C84',
    accent: '#2340FF',
    accentHover: '#1a32d6',
    highlight: '#FFD84D',
    success: '#7CFFB2',
    bg: '#F3F4F8',
    surface: '#E8ECFF',
    card: '#FFFFFF',
    border: '#0A0A12',
    glow: 'rgba(35, 64, 255, 0.12)',
    badgeBg: '#FFD84D'
  },
  {
    id: 'monolith-dark',
    name: 'Monolith Obsidian (Dark)',
    primary: '#FFFFFF',
    secondary: '#9EBAAD',
    muted: '#6C8579',
    accent: '#FFD84D',
    accentHover: '#ffe373',
    highlight: '#FFD84D',
    success: '#7CFFB2',
    bg: '#0A0A12',
    surface: '#171822',
    card: '#1F202E',
    border: '#2E3048',
    glow: 'rgba(255, 216, 77, 0.15)',
    badgeBg: 'rgba(255, 216, 77, 0.15)'
  },
  {
    id: 'folio-pine',
    name: 'Folio Pine',
    primary: '#14201A',
    secondary: '#51605A',
    muted: '#7A8C84',
    accent: '#0F3D2E',
    accentHover: '#184F3D',
    highlight: '#C6F432',
    success: '#0A7A4F',
    bg: '#F4F6F1',
    surface: '#EAEFE6',
    card: '#FFFFFF',
    border: '#D3DBCC',
    glow: 'rgba(15, 61, 46, 0.08)',
    badgeBg: '#EAEFE6'
  },
  {
    id: 'editorial-warm',
    name: 'Editorial Warm (Magazine)',
    primary: '#1A1A1A',
    secondary: '#666050',
    muted: '#8C8575',
    accent: '#8C4320',
    accentHover: '#A85227',
    highlight: '#FFD84D',
    success: '#2E7D32',
    bg: '#F5F1E8',
    surface: '#EAE3D5',
    card: '#FFFFFF',
    border: '#D5CCB8',
    glow: 'rgba(140, 67, 32, 0.08)',
    badgeBg: '#EAE3D5'
  },
  {
    id: 'terminal-emerald',
    name: 'Terminal Matrix (Hacker)',
    primary: '#E0F2E9',
    secondary: '#6E9E88',
    muted: '#4A7260',
    accent: '#4ADE80',
    accentHover: '#86EFAC',
    highlight: '#7CFFB2',
    success: '#7CFFB2',
    bg: '#050D0A',
    surface: '#0A1813',
    card: '#0F241C',
    border: '#1C4233',
    glow: 'rgba(74, 222, 128, 0.2)',
    badgeBg: 'rgba(74, 222, 128, 0.1)'
  },
  {
    id: 'matrix-emerald',
    name: 'Matrix Emerald',
    primary: '#E0F2E9',
    secondary: '#6E9E88',
    muted: '#4A7260',
    accent: '#10B981',
    accentHover: '#34D399',
    highlight: '#7CFFB2',
    success: '#7CFFB2',
    bg: '#050D0A',
    surface: '#0A1813',
    card: '#0F241C',
    border: '#1C4233',
    glow: 'rgba(16, 185, 129, 0.2)',
    badgeBg: 'rgba(16, 185, 129, 0.1)'
  },
  {
    id: 'cyber-mint',
    name: 'Cyber Mint (Neural AI)',
    primary: '#FFFFFF',
    secondary: '#88A399',
    muted: '#52665E',
    accent: '#7CFFB2',
    accentHover: '#a3ffca',
    highlight: '#7CFFB2',
    success: '#7CFFB2',
    bg: '#0A0A12',
    surface: '#121A16',
    card: '#16221E',
    border: '#22382F',
    glow: 'rgba(124, 255, 178, 0.18)',
    badgeBg: 'rgba(124, 255, 178, 0.15)'
  },
  {
    id: 'soft-lavender',
    name: 'Soft Lavender (Canvas)',
    primary: '#0A0A12',
    secondary: '#55586B',
    muted: '#7A8C84',
    accent: '#2340FF',
    accentHover: '#1a32d6',
    highlight: '#FFD84D',
    success: '#7CFFB2',
    bg: '#F3F4F8',
    surface: '#E8ECFF',
    card: '#FFFFFF',
    border: '#0A0A12',
    glow: 'rgba(35, 64, 255, 0.12)',
    badgeBg: '#E8ECFF'
  },
  {
    id: 'cyber-indigo',
    name: 'Cyber Indigo',
    primary: '#FFFFFF',
    secondary: '#A5B4FC',
    muted: '#6366F1',
    accent: '#818CF8',
    accentHover: '#A5B4FC',
    highlight: '#FFD84D',
    success: '#7CFFB2',
    bg: '#0B0A1A',
    surface: '#15142E',
    card: '#1E1C40',
    border: '#312E81',
    glow: 'rgba(129, 140, 248, 0.2)',
    badgeBg: 'rgba(129, 140, 248, 0.15)'
  },
  {
    id: 'amber-gold',
    name: 'Imperial Gold',
    primary: '#FDFCF7',
    secondary: '#D1B87D',
    muted: '#8C7A4E',
    accent: '#FFD84D',
    accentHover: '#ffe373',
    highlight: '#FFD84D',
    success: '#7CFFB2',
    bg: '#0F0E09',
    surface: '#1A1810',
    card: '#262316',
    border: '#4D4428',
    glow: 'rgba(255, 216, 77, 0.2)',
    badgeBg: 'rgba(255, 216, 77, 0.15)'
  },
  {
    id: 'electric-cyan',
    name: 'Electric Cyan',
    primary: '#FFFFFF',
    secondary: '#7DD3FC',
    muted: '#0284C7',
    accent: '#38BDF8',
    accentHover: '#7DD3FC',
    highlight: '#FFD84D',
    success: '#7CFFB2',
    bg: '#050D14',
    surface: '#0B1B2B',
    card: '#10273D',
    border: '#1A3F63',
    glow: 'rgba(56, 189, 248, 0.2)',
    badgeBg: 'rgba(56, 189, 248, 0.15)'
  },
  {
    id: 'crimson-ruby',
    name: 'Crimson Velocity',
    primary: '#FFFFFF',
    secondary: '#FDA4AF',
    muted: '#E11D48',
    accent: '#F43F5E',
    accentHover: '#FB7185',
    highlight: '#FFD84D',
    success: '#7CFFB2',
    bg: '#140508',
    surface: '#2B0B12',
    card: '#3D101A',
    border: '#63192B',
    glow: 'rgba(244, 63, 94, 0.2)',
    badgeBg: 'rgba(244, 63, 94, 0.15)'
  }
];

export default function UnifiedPortfolioView({
  portfolio,
  user,
  isStudio = false,
  pitch = null,
  onOpenVideo = null,
  onBookPackage = null,
  onOpenInquiry = null
}) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCloneId, setCopiedCloneId] = useState(null);
  const [projectFilter, setProjectFilter] = useState('all');
  const [projectSearch, setProjectSearch] = useState('');
  const [skillCategory, setSkillCategory] = useState('languages');
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  
  // Two-column layout mode toggle (enabled by default on desktop)
  const [twoColumnMode, setTwoColumnMode] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Active template archetype
  const activeTemplateId = portfolio?.custom_template || portfolio?.template || portfolio?.active_theme || 'monolith';
  const activeTemplate = FOLIO_TEMPLATES.find(t => 
    t.id === activeTemplateId || 
    t.paletteId === activeTemplateId
  ) || FOLIO_TEMPLATES[0];

  // Active theme palette (falls back to template preset or canonical)
  const activePaletteId = portfolio?.active_theme || portfolio?.palette?.id || activeTemplate.paletteId;
  const palette = COLOR_PALETTES.find(p => p.id === activePaletteId) || COLOR_PALETTES[0];

  const fontStyle = portfolio?.font_style || activeTemplate.fontStyle || 'sans';
  const fontClass = fontStyle === 'mono' ? 'font-mono' : fontStyle === 'serif' ? 'font-serif' : 'font-sans';

  const items = portfolio?.items || [];

  const isDeveloper = (user?.provider === 'github') ||
    items.some(i => i?.platform_source === 'github' || i?.media_type === 'code_snippet') ||
    (portfolio?.title && /software|engineer|architect|systems|full-stack|developer|code/i.test(portfolio.title)) ||
    (user?.username && user.username.toLowerCase() === 'sathasivamb');

  const handleShare = () => {
    try {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {}
  };

  const handleCopyClone = (e, repoName, itemId) => {
    e.stopPropagation();
    try {
      navigator.clipboard?.writeText(`git clone https://github.com/${user?.username || 'SathasivamB'}/${repoName}.git`);
      setCopiedCloneId(itemId);
      setTimeout(() => setCopiedCloneId(null), 2000);
    } catch {}
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.name.trim() || !contactForm.email.trim()) return;
    setContactSubmitted(true);
    try {
      await fetch('/api/client-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user?.username || 'sathasivamb',
          clientName: contactForm.name.trim(),
          email: contactForm.email.trim(),
          packageName: 'Direct Contact Message',
          projectDetails: contactForm.message.trim() || 'Direct portfolio message from contact section.'
        })
      });
    } catch {}
    setTimeout(() => {
      setContactForm({ name: '', email: '', message: '' });
      setContactSubmitted(false);
    }, 4000);
  };

  // Base Canonical Projects from Prompt
  const defaultProjects = [
    {
      id: 'proj-ip-geo',
      title: 'IP Geolocation Tool',
      description: 'Ultra fast IP address lookup service with sub-millisecond GeoIP database querying, concurrency handling, and live map visualization.',
      metrics: { language: 'Go' },
      tags: ['Go', 'REST API', 'Redis', 'GeoIP'],
      original_url: `https://github.com/${user?.username || 'SathasivamB'}/ip-geolocation-tool`,
      external_id: 'ip-geolocation-tool',
      category: 'systems'
    },
    {
      id: 'proj-connect-four',
      title: 'Connect Four (C)',
      description: 'High performance terminal and graphical Connect Four game implemented in C with minimax adversarial search, alpha-beta pruning, and bitboard optimizations.',
      metrics: { language: 'C' },
      tags: ['C', 'Algorithms', 'Bitboards', 'AI'],
      original_url: `https://github.com/${user?.username || 'SathasivamB'}/connect-four-c`,
      external_id: 'connect-four-c',
      category: 'systems'
    },
    {
      id: 'proj-analytics',
      title: 'Dev Analytics Dashboard',
      description: 'Real-time developer telemetry and commit velocity dashboard featuring a custom GPU-accelerated charting engine, WebSocket streaming, and PR health insights.',
      metrics: { language: 'TypeScript' },
      tags: ['TypeScript', 'React', 'Tailwind', 'WebSockets'],
      original_url: `https://github.com/${user?.username || 'SathasivamB'}/dev-analytics-dashboard`,
      external_id: 'dev-analytics-dashboard',
      category: 'frontend'
    }
  ];

  // Merge user repos with default showcase projects
  const allProjects = items.length > 0 
    ? [...items.slice(0, 6).map(it => ({
        ...it,
        tags: it.tags || [it.metrics?.language || 'TypeScript', 'GitHub'],
        category: /c|cpp|go|rust|security|system/i.test((it.metrics?.language || '') + ' ' + (it.title || '')) ? 'systems' :
                 /react|vue|ui|front|canvas/i.test((it.metrics?.language || '') + ' ' + (it.title || '')) ? 'frontend' : 'backend'
      })), ...defaultProjects.filter(dp => !items.some(it => it.title === dp.title))]
    : defaultProjects;

  // Filter projects by category chip and search query
  const filteredProjects = allProjects.filter(item => {
    const query = projectSearch.toLowerCase().trim();
    const matchesSearch = !query || 
      (item.title && item.title.toLowerCase().includes(query)) ||
      (item.description && item.description.toLowerCase().includes(query)) ||
      (item.metrics?.language && item.metrics.language.toLowerCase().includes(query)) ||
      (item.tags && item.tags.some(t => t.toLowerCase().includes(query)));

    if (!matchesSearch) return false;

    if (projectFilter === 'all') return true;
    if (projectFilter === 'backend') {
      return /backend|node|express|api|database|sql|python|java|spring/i.test((item.metrics?.language || '') + ' ' + (item.description || '') + ' ' + (item.category || ''));
    }
    if (projectFilter === 'frontend') {
      return /frontend|react|typescript|javascript|html|css|ui|canvas/i.test((item.metrics?.language || '') + ' ' + (item.description || '') + ' ' + (item.category || ''));
    }
    if (projectFilter === 'mobile') {
      return /mobile|react native|flutter|swift|android|ios|kotlin/i.test((item.metrics?.language || '') + ' ' + (item.description || '') + ' ' + (item.category || ''));
    }
    if (projectFilter === 'systems') {
      return /systems|c|c\+\+|go|rust|security|architecture|algorithms|bitboard/i.test((item.metrics?.language || '') + ' ' + (item.description || '') + ' ' + (item.category || ''));
    }
    return true;
  });

  // Skills Data Grid
  const skillsData = {
    languages: [
      { name: 'JavaScript', exp: '5 years', badge: 'JS', color: '#0F3D2E' },
      { name: 'TypeScript', exp: '4 years', badge: 'TS', color: '#0F3D2E' },
      { name: 'Python', exp: '4 years', badge: 'Py', color: '#0F3D2E' },
      { name: 'Go', exp: '3 years', badge: 'Go', color: '#0F3D2E' },
      { name: 'C', exp: '5 years', badge: 'C', color: '#0F3D2E' },
      { name: 'C++', exp: '5 years', badge: 'C++', color: '#0F3D2E' },
      { name: 'Rust', exp: '2 years', badge: 'Rust', color: '#0F3D2E' },
      { name: 'Java', exp: '5 years', badge: 'Java', color: '#0F3D2E' }
    ],
    frontend: [
      { name: 'React.js', exp: '4 years', badge: '⚛️', color: '#0F3D2E' },
      { name: 'Next.js', exp: '3 years', badge: '▲', color: '#0F3D2E' },
      { name: 'Tailwind CSS', exp: '4 years', badge: '🎨', color: '#0F3D2E' },
      { name: 'HTML5 Canvas', exp: '3 years', badge: '🖌️', color: '#0F3D2E' }
    ],
    backend: [
      { name: 'Node.js & Express', exp: '4 years', badge: '🚀', color: '#0F3D2E' },
      { name: 'Spring Boot', exp: '3 years', badge: '☕', color: '#0F3D2E' },
      { name: 'RESTful APIs', exp: '5 years', badge: '⚡', color: '#0F3D2E' },
      { name: 'WebSockets', exp: '3 years', badge: '🔌', color: '#0F3D2E' }
    ],
    databases: [
      { name: 'PostgreSQL', exp: '4 years', badge: '🐘', color: '#0F3D2E' },
      { name: 'MySQL', exp: '5 years', badge: '🐬', color: '#0F3D2E' },
      { name: 'MongoDB', exp: '3 years', badge: '🍃', color: '#0F3D2E' },
      { name: 'Redis', exp: '3 years', badge: '⚡', color: '#0F3D2E' }
    ]
  };

  const totalRepoCount = Math.max(items.length, 50);

  // Granular Sub-components from Setup Blueprint
  const subComponents = {
    navbar_brand_logo: true,
    navbar_nav_links: true,
    navbar_status_badge: true,
    hero_terminal_window: true,
    hero_clone_snippet: true,
    hero_verified_badge: true,
    platform_github: true,
    platform_linkedin: true,
    platform_youtube: false,
    ...portfolio?.sub_components
  };

  // Section Ordering & Visibility from Setup Blueprint
  const activeSections = portfolio?.selected_sections || [
    'hero', 'skills', 'showcase', 'pricing', 'metrics', 'case_studies', 'certifications', 'booking'
  ];
  const hasSection = (key) => activeSections.includes(key);

  // Engineering Retainers & Sprint Packages
  const pricingPackages = portfolio?.pricing_packages || [
    { id: 'pkg_1', title: 'Full-Stack Web App Sprint', price: '$2,500', turnaround: '5 Days', deliverables: 'Production Web App, Responsive UI, REST APIs, CI/CD Deployment' },
    { id: 'pkg_2', title: 'Dedicated Engineering Retainer', price: '$4,800/mo', turnaround: 'Ongoing', deliverables: 'Dedicated Weekly Bandwidth, Feature Development & Code Reviews' },
    { id: 'pkg_3', title: 'System Architecture Advisory', price: '$150/hr', turnaround: 'Immediate', deliverables: 'Architecture Audit, Scalability Review & Technical Roadmap' }
  ];

  return (
    <div 
      className={`min-h-screen ${fontClass} selection:bg-[#0F3D2E]/15 selection:text-[#0F3D2E] transition-colors duration-300 relative`}
      style={{ backgroundColor: palette.bg, color: palette.primary }}
    >
      {/* Pitch Header Banner if present */}
      {pitch && (
        <section 
          className="py-2.5 px-6 border-b flex items-center justify-between text-xs backdrop-blur-md"
          style={{ backgroundColor: `${palette.surface}dd`, borderColor: palette.border }}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between w-full">
            <span className="font-bold font-mono text-[#0A0A12] flex items-center gap-1.5">
              <span className="live-pulse-dot" />
              Confidential Proposal for {pitch.client_name}
            </span>
            <span className="text-[#55586B] text-[11px] italic">"{pitch.custom_headline}"</span>
          </div>
        </section>
      )}

      {/* Main Two-Column Outer Wrapper */}
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 py-4 sm:py-6">
        
        {/* Top Control Bar for Showcase / Mode Switching */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#D3DBCC] text-xs font-mono text-[#51605A]">
          <div className="flex items-center gap-2.5">
            <span className="mk"></span>
            <span className="font-bold font-bricolage text-[#14201A] text-sm">
              folio<span className="text-[#0F3D2E]">.ai</span>
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] bg-[#EAEFE6] border border-[#D3DBCC] text-[#51605A] font-mono">
              v2.4 Production Engine
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setTwoColumnMode(prev => !prev)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white hover:bg-[#EAEFE6] border border-[#D3DBCC] text-[#14201A] font-sans font-medium transition-all text-xs"
              title="Toggle Left Showcase Sidebar"
            >
              {twoColumnMode ? <Minimize2 className="w-3.5 h-3.5 text-[#0F3D2E]" /> : <Maximize2 className="w-3.5 h-3.5 text-[#0F3D2E]" />}
              <span>{twoColumnMode ? 'Sidebar Visible' : 'Full Canvas'}</span>
            </button>

            <button
              onClick={handleShare}
              className="pill b2 flex items-center gap-1.5 px-4 py-1 text-xs font-bold shadow-neo-sm"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-[#7CFFB2]" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* 2-Column Composition on Desktop */}
        <div className="flex flex-col lg:flex-row gap-6 items-start font-['DM_Sans']">
          
          {/* ============================================================== */}
          {/* LEFT SIDEBAR: Brand & Template Introduction (25-28% Viewport) */}
          {/* ============================================================== */}
          {twoColumnMode && (
            <aside className="w-full lg:w-[28%] xl:w-[26%] flex-shrink-0 space-y-5 text-left order-2 lg:order-1">
              
              {/* Brand Introduction Card */}
              <div className="bx space-y-4 relative overflow-hidden bg-white border-2 border-[#0A0A12] shadow-neo rounded-[24px]">
                {/* Dynamic top accent dot / bar */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1.5" 
                  style={{ 
                    background: activeTemplate.topColor && activeTemplate.bottomColor 
                      ? `linear-gradient(90deg, ${activeTemplate.topColor}, ${activeTemplate.bottomColor})` 
                      : (activeTemplate.accent || palette.accent) 
                  }} 
                />

                {/* Mark & Title */}
                <div className="flex items-center gap-3">
                  <div className="lg text-xl font-['Space_Grotesk'] font-bold flex items-center gap-2">
                    <i className="w-3.5 h-3.5 rounded-full bg-[#FFD84D] border-2 border-[#0A0A12] inline-block"></i>
                    <span>folio</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#55586B] font-mono tracking-wider block font-bold">
                      {activeTemplate.badge || 'Portfolio System'}
                    </span>
                  </div>
                </div>

                {/* Large Template Heading */}
                <div className="space-y-2 pt-1">
                  <h2 className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-[#0A0A12] tracking-tight leading-tight">
                    {activeTemplate.name} Portfolio Template
                  </h2>
                  <p className="text-xs text-[#55586B] leading-relaxed font-['DM_Sans']">
                    {activeTemplate.fullDesc || activeTemplate.desc}
                  </p>
                </div>

                {/* Feature List */}
                <div className="space-y-2 pt-2 border-t-2 border-[#0A0A12]/15 text-xs text-[#0A0A12] font-bold">
                  {[
                    { label: 'Modern & Brutalist Design', icon: <Box className="w-3.5 h-3.5 text-[#2340FF]" /> },
                    { label: 'Fully Responsive', icon: <Smartphone className="w-3.5 h-3.5 text-[#2340FF]" /> },
                    { label: 'Easy Configuration', icon: <Sliders className="w-3.5 h-3.5 text-[#2340FF]" /> },
                    { label: 'Smooth Animations', icon: <Sparkles className="w-3.5 h-3.5 text-[#2340FF]" /> },
                    { label: 'Optimized Performance', icon: <Zap className="w-3.5 h-3.5 text-[#2340FF]" /> },
                    { label: 'Deploy Ready', icon: <Globe className="w-3.5 h-3.5 text-[#2340FF]" /> }
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-[8px] bg-[#E8ECFF] border-2 border-[#0A0A12] flex items-center justify-center flex-shrink-0">
                        {feat.icon}
                      </div>
                      <span className="text-xs text-[#0A0A12] font-['DM_Sans']">{feat.label}</span>
                    </div>
                  ))}
                </div>

                {/* Quick Deploy Ready Badge */}
                <div className="pt-2">
                  <div className="p-3 rounded-[14px] bg-[#E8ECFF] border-2 border-[#0A0A12] flex items-center justify-between text-xs font-mono">
                    <span className="text-[#55586B] text-[11px] font-bold">Free Vercel Deployment</span>
                    <span className="tg bg-[#7CFFB2] text-[#0A0A12] font-bold text-[10px]">● Active</span>
                  </div>
                </div>
              </div>

              {/* Realistic Mobile Device Mockup */}
              <div className="hidden lg:block bx text-center p-4 bg-white border-2 border-[#0A0A12] shadow-neo rounded-[24px]">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#55586B] block mb-3 font-bold">
                  Mobile Preview Mockup
                </span>
                
                {/* Phone Frame */}
                <div className="w-[210px] mx-auto rounded-[32px] border-4 border-[#0A0A12] bg-[#F3F4F8] p-3 shadow-neo-sm space-y-2 font-mono text-left relative overflow-hidden">
                  {/* Phone Speaker Notch */}
                  <div className="flex items-center justify-between text-[8px] text-[#55586B] px-1 border-b-2 border-[#0A0A12]/20 pb-1">
                    <span>9:41</span>
                    <div className="w-8 h-2 rounded-full bg-[#0A0A12]" />
                    <span>5G</span>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center gap-1.5">
                      <i className="w-2.5 h-2.5 rounded-full bg-[#FFD84D] border border-[#0A0A12] inline-block"></i>
                      <span className="text-[10px] font-bold text-[#0A0A12] font-['Space_Grotesk']">
                        {user?.name || 'Sathasivam B'}
                      </span>
                    </div>

                    <div className="tg bg-[#FFD84D] text-[#0A0A12] text-[8px] py-0.5 px-1.5 font-bold">
                      &gt;_ Polygon Developer
                    </div>

                    <h4 className="text-[11px] font-bold text-[#0A0A12] font-['Space_Grotesk'] leading-tight">
                      Freelance Developer &amp; Code Generalist
                    </h4>

                    <p className="text-[8px] text-[#55586B] font-['DM_Sans'] leading-snug line-clamp-2">
                      I architect and implement complex systems in 15+ languages.
                    </p>

                    <div className="pt-1">
                      <a 
                        href="#contact"
                        className="pill b1 block w-full text-center py-1.5 text-[9px] font-bold shadow-neo-sm"
                      >
                        Let's work together →
                      </a>
                    </div>
                  </div>
                </div>
              </div>

            </aside>
          )}

          {/* ============================================================== */}
          {/* MAIN CONTENT: Developer Portfolio Preview (72-75% Viewport)    */}
          {/* ============================================================== */}
          <main className="flex-1 min-w-0 space-y-6 text-left order-1 lg:order-2">
            
            {/* A. SLIM TOP NAVIGATION */}
            <nav className="bx p-3 sm:p-4 flex items-center justify-between gap-3 sticky top-4 z-30 bg-white border-2 border-[#0A0A12] shadow-neo-sm rounded-[20px]">
              
              {/* Left Monogram */}
              {subComponents.navbar_brand_logo && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-[10px] bg-[#2340FF] text-white border-2 border-[#0A0A12] flex items-center justify-center font-mono font-bold text-xs shadow-neo-sm">
                    &lt;/&gt;
                  </div>
                  <div>
                    <span className="font-bold text-sm tracking-tight text-[#0A0A12] block leading-none font-['Space_Grotesk']">
                      {user?.name || 'Sathasivam B'}
                    </span>
                    <span className="text-[10px] text-[#55586B] font-mono tracking-wider font-bold">
                      {user?.role || (isDeveloper ? 'Polygon Developer' : 'Software Architect')}
                    </span>
                  </div>
                </div>
              )}

              {/* Desktop Nav Links */}
              {subComponents.navbar_nav_links && (
                <div className="hidden md:flex items-center gap-6 text-xs font-bold text-[#55586B]">
                  {hasSection('skills') && <a href="#skills" className="hover:text-[#2340FF] transition-colors">Skills</a>}
                  {hasSection('showcase') && <a href="#projects" className="hover:text-[#2340FF] transition-colors">Projects</a>}
                  {hasSection('pricing') && <a href="#pricing" className="hover:text-[#2340FF] transition-colors">Pricing</a>}
                  {hasSection('metrics') && <a href="#about" className="hover:text-[#2340FF] transition-colors">About</a>}
                  {hasSection('booking') && <a href="#contact" className="hover:text-[#2340FF] transition-colors">Contact</a>}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <a
                  href="#contact"
                  className="pill b1 text-xs px-5 py-1.5 min-h-[38px] flex items-center justify-center shadow-neo-sm font-bold"
                >
                  Let's Talk
                </a>

                {/* Mobile Menu Toggle */}
                <button
                  onClick={() => setMobileMenuOpen(prev => !prev)}
                  className="md:hidden pill b2 p-1.5 text-[#0A0A12]"
                >
                  {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </button>
              </div>
            </nav>

            {/* Mobile Dropdown Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden bx p-4 space-y-2 text-xs font-mono text-[#0A0A12] bg-white border-2 border-[#0A0A12] shadow-neo rounded-[16px]">
                <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#2340FF] font-bold">About</a>
                <a href="#skills" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#2340FF] font-bold">Skills</a>
                <a href="#projects" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#2340FF] font-bold">Projects</a>
                <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#2340FF] font-bold">Contact</a>
              </div>
            )}

            {/* B. HERO SECTION WITH MAC-STYLE TERMINAL */}
            {hasSection('hero') && (
              <section className="bx p-6 sm:p-8 relative overflow-hidden bg-white border-2 border-[#0A0A12] shadow-neo rounded-[24px]">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                  
                  {/* Left Side: Headline, Bio & Technology Badges */}
                  <div className={`${subComponents.hero_terminal_window ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-4 text-left`}>
                    
                    {/* Small Role Badge */}
                    {subComponents.hero_verified_badge && (
                      <div className="tg bg-[#FFD84D] text-[#0A0A12] text-xs font-bold inline-flex items-center gap-2 shadow-neo-sm">
                        <span className="live-pulse-blue" />
                        <span>&gt;_ {portfolio?.role || activeTemplate.sampleRole || 'Verified Developer'}</span>
                      </div>
                    )}

                    {/* Main Headline */}
                    <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-[#0A0A12] font-['Space_Grotesk'] tracking-tight leading-[1.15]">
                      {portfolio?.title || (isDeveloper ? 'Freelance Developer & Code Generalist' : 'Software Architect & Full-Stack Engineer')}
                    </h1>

                    {/* Supporting Text */}
                    <p className="text-xs sm:text-sm text-[#55586B] leading-relaxed max-w-xl font-['DM_Sans']">
                      {portfolio?.bio || 'I architect and implement complex systems in 15+ languages across high-throughput distributed systems, algorithms, and full-stack web applications.'}
                    </p>

                    {/* Compact Technology Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {[
                        'JavaScript', 'TypeScript', 'Python', 'Go', 'Rust', 'C/C++', 'Java', 'Swift'
                      ].map((badge) => (
                        <span 
                          key={badge}
                          className="tg tg-interactive bg-white text-[#0A0A12] font-bold"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>

                    {/* Primary & Secondary CTAs */}
                    <div className="flex flex-wrap items-center gap-3 pt-3">
                      <a
                        href="#contact"
                        className="pill b1 text-xs px-6 py-2.5 min-h-[44px] flex items-center gap-2 shadow-neo font-bold hover:translate-x-0.5"
                      >
                        <span>Let’s work together</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>

                      <a
                        href="#projects"
                        className="pill b2 text-xs px-6 py-2.5 min-h-[44px] flex items-center font-bold"
                      >
                        View my work
                      </a>
                    </div>

                  </div>

                  {/* Right Side: Archetype-Specific Interactive Widget (5 cols) */}
                  {subComponents.hero_terminal_window && (
                    <div className="lg:col-span-5 relative">
                      {activeTemplate.id === 'canvas' ? (
                        <div className="rounded-[20px] bg-[#FFFFFF] border-2 border-[#0A0A12] shadow-neo overflow-hidden text-left font-sans">
                          <div className="px-4 py-2.5 bg-[#F3F4F8] border-b-2 border-[#0A0A12] flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] inline-block border border-[#0A0A12]" />
                              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] inline-block border border-[#0A0A12]" />
                              <span className="w-2.5 h-2.5 rounded-full bg-[#7CFFB2] inline-block border border-[#0A0A12]" />
                            </div>
                            <span className="text-[11px] text-[#55586B] font-mono font-bold">figma · design-system.tokens</span>
                            <span className="tg bg-[#2340FF] text-white text-[10px] px-1.5 py-0.5 font-bold">Auto Layout 5.0</span>
                          </div>
                          <div className="p-4 sm:p-5 space-y-3 text-xs">
                            <div className="p-3 rounded-[14px] bg-[#E8ECFF] border-2 border-[#0A0A12] flex items-center justify-between">
                              <div>
                                <span className="font-bold text-[#0A0A12] block">Interactive UI Components</span>
                                <span className="text-[11px] text-[#55586B] font-mono">250+ variants · Figma Tokens API</span>
                              </div>
                              <span className="tg bg-[#7CFFB2] text-[#0A0A12] text-[10px] font-bold">Production Ready</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                              <div className="p-2 rounded-[10px] bg-[#F8F9FA] border border-[#0A0A12]">
                                <span className="text-[#55586B] block text-[9px]">COLOR TOKENS</span>
                                <div className="flex items-center gap-1 mt-1">
                                  <span className="w-3 h-3 rounded-full bg-[#2340FF] border border-[#0A0A12]"></span>
                                  <span className="w-3 h-3 rounded-full bg-[#FFD84D] border border-[#0A0A12]"></span>
                                  <span className="w-3 h-3 rounded-full bg-[#7CFFB2] border border-[#0A0A12]"></span>
                                  <span className="text-[#0A0A12] font-bold ml-1">16 Tokens</span>
                                </div>
                              </div>
                              <div className="p-2 rounded-[10px] bg-[#F8F9FA] border border-[#0A0A12]">
                                <span className="text-[#55586B] block text-[9px]">ACCESSIBILITY</span>
                                <span className="text-[#0A0A12] font-bold mt-1 block">WCAG AAA 100%</span>
                              </div>
                            </div>
                            <div className="p-2.5 rounded-[12px] bg-[#14201A] text-white font-mono text-[11px]">
                              <span className="text-[#7CFFB2] font-bold">import</span> &#123; Button, Modal, Sheet &#125; <span className="text-[#FFD84D]">from</span> &apos;@design-system/core&apos;;
                            </div>
                          </div>
                        </div>
                      ) : activeTemplate.id === 'editorial' ? (
                        <div className="rounded-[20px] bg-[#FDFBF7] border-2 border-[#0A0A12] shadow-neo overflow-hidden text-left font-serif">
                          <div className="px-4 py-2.5 bg-[#F5F1E8] border-b-2 border-[#0A0A12] flex items-center justify-between text-xs font-sans">
                            <span className="tg bg-[#8C4320] text-white text-[10px] px-2 py-0.5 font-bold">EXECUTIVE ADVISORY</span>
                            <span className="text-[11px] text-[#55586B] font-mono font-bold">CONFIDENTIAL BRIEF</span>
                          </div>
                          <div className="p-5 space-y-3">
                            <div className="border-b border-[#0A0A12]/15 pb-2">
                              <span className="text-[11px] font-mono uppercase tracking-wider text-[#8C4320] font-bold block">Advisory Retainer</span>
                              <h4 className="text-lg font-bold text-[#0A0A12] leading-snug">Fractional CTO &amp; Scale-Up Strategy</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-center font-sans">
                              <div className="p-2.5 rounded-[10px] bg-[#EAE3D5] border border-[#0A0A12]">
                                <span className="text-base font-bold text-[#0A0A12] block">$42M+</span>
                                <span className="text-[10px] text-[#55586B]">VC Capital Advised</span>
                              </div>
                              <div className="p-2.5 rounded-[10px] bg-[#EAE3D5] border border-[#0A0A12]">
                                <span className="text-base font-bold text-[#0A0A12] block">60%</span>
                                <span className="text-[10px] text-[#55586B]">Cloud Cost Reduction</span>
                              </div>
                            </div>
                            <p className="text-xs text-[#55586B] italic leading-relaxed pt-1">
                              &ldquo;The highest-leverage engineering advisor our board has partnered with. Re-architected our core platform in 90 days.&rdquo;
                            </p>
                          </div>
                        </div>
                      ) : activeTemplate.id === 'neural' ? (
                        <div className="rounded-[20px] bg-[#0A0A12] border-2 border-[#0A0A12] shadow-neo overflow-hidden font-mono text-left">
                          <div className="px-4 py-2.5 bg-[#171822] border-b-2 border-[#0A0A12] flex items-center justify-between text-xs text-white">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] inline-block border border-[#0A0A12]" />
                              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] inline-block border border-[#0A0A12]" />
                              <span className="w-2.5 h-2.5 rounded-full bg-[#7CFFB2] inline-block border border-[#0A0A12]" />
                            </div>
                            <span className="text-[11px] text-[#7CFFB2] font-mono font-bold">nvidia-smi · 8x H100 SXM5</span>
                            <span className="tg bg-[#7CFFB2] text-[#0A0A12] text-[10px] font-bold">98.4% GPU Util</span>
                          </div>
                          <div className="p-4 sm:p-5 space-y-2.5 text-xs text-white leading-relaxed">
                            <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                              <span className="text-white/60">Tensor Parallelism</span>
                              <span className="text-[#7CFFB2] font-bold">TP=8 · DeepSpeed</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                              <span className="text-white/60">Speculative Decoding</span>
                              <span className="text-[#FFD84D] font-bold">45.2k tokens / sec</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                              <span className="text-white/60">Time to First Token</span>
                              <span className="text-[#7CFFB2] font-bold">sub-12ms TTFT</span>
                            </div>
                            <div className="pt-1 text-[11px] text-white/50 flex items-center gap-2">
                              <span className="live-pulse-blue" />
                              <span>Active inference: frontier-llm-v2 (fp8)</span>
                            </div>
                          </div>
                        </div>
                      ) : activeTemplate.id === 'mobile' ? (
                        <div className="rounded-[24px] bg-[#0A0A12] border-2 border-[#0A0A12] shadow-neo overflow-hidden text-left text-white max-w-[340px] mx-auto">
                          <div className="pt-3 px-4 flex items-center justify-between text-[11px] font-mono text-white/70">
                            <span>9:41</span>
                            <div className="w-16 h-4 bg-black rounded-full border border-white/20 mx-auto"></div>
                            <span>5G 100%</span>
                          </div>
                          <div className="p-5 space-y-3 font-sans">
                            <div className="p-3 rounded-[16px] bg-[#1E2030] border border-white/15 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="tg bg-[#FFD84D] text-[#0A0A12] text-[10px] font-bold">Swift 6 &amp; Metal</span>
                                <span className="text-[10px] text-[#7CFFB2] font-bold">120Hz ProMotion</span>
                              </div>
                              <h4 className="font-bold text-sm text-white pt-1">Native iOS Architecture</h4>
                              <p className="text-[11px] text-white/70">Fluid springs, zero-hiccup animations, and sub-16ms frame budgeting.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-center text-xs">
                              <div className="p-2 rounded-[12px] bg-[#141520] border border-white/10">
                                <span className="text-sm font-bold text-[#FFD84D] block">★ 4.9 / 5</span>
                                <span className="text-[10px] text-white/50">App Store Rating</span>
                              </div>
                              <div className="p-2 rounded-[12px] bg-[#141520] border border-white/10">
                                <span className="text-sm font-bold text-[#7CFFB2] block">#1 Ranked</span>
                                <span className="text-[10px] text-white/50">Developer Tools</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-[20px] bg-[#0A0A12] border-2 border-[#0A0A12] shadow-neo overflow-hidden font-mono text-left">
                          {/* macOS-style Window Controls */}
                          <div className="px-4 py-2.5 bg-[#171822] border-b-2 border-[#0A0A12] flex items-center justify-between text-xs text-white">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] inline-block border border-[#0A0A12]" />
                              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] inline-block border border-[#0A0A12]" />
                              <span className="w-2.5 h-2.5 rounded-full bg-[#7CFFB2] inline-block border border-[#0A0A12]" />
                            </div>
                            <span className="text-[11px] text-[#55586B] font-mono font-bold">
                              {activeTemplate.id === 'terminal' ? 'root@matrix:~#' : activeTemplate.id === 'mono' ? 'alex.dev --strict' : 'developer@folio.ai'}
                            </span>
                            <div className="w-6" />
                          </div>

                          {/* Terminal Surface & Monospace Content */}
                          <div className="p-4 sm:p-5 space-y-2 text-xs text-white leading-relaxed overflow-x-auto scrollbar-none">
                            <div>
                              <span className="text-[#FFD84D] font-bold">$ </span>
                              <span className="text-white">whoami</span>
                              <p className="text-white/80 pl-4 mt-0.5">
                                {portfolio?.role || activeTemplate.sampleRole || 'FullStackDeveloper & Systems Architect'}
                              </p>
                            </div>

                            <div>
                              <span className="text-[#FFD84D] font-bold">$ </span>
                              <span className="text-white">ls -la skills/</span>
                              <div className="pl-4 mt-0.5 space-y-0.5 text-white/70 text-[11px]">
                                <p><span className="text-[#7CFFB2]">drwxr-xr-x</span> 20+ programming_languages</p>
                                <p><span className="text-[#7CFFB2]">drwxr-xr-x</span> frontend_frameworks</p>
                                <p><span className="text-[#7CFFB2]">drwxr-xr-x</span> backend_systems</p>
                                <p><span className="text-[#7CFFB2]">drwxr-xr-x</span> databases</p>
                              </div>
                            </div>

                            <div>
                              <span className="text-[#FFD84D] font-bold">$ </span>
                              <span className="text-white">uptime</span>
                              <p className="text-[#7CFFB2] pl-4 mt-0.5">{totalRepoCount} verified repositories on GitHub</p>
                            </div>

                            <div className="flex items-center gap-1 pt-1">
                              <span className="text-[#FFD84D] font-bold">$ </span>
                              <span className="w-2 h-4 bg-[#FFD84D] inline-block animate-pulse" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </section>
            )}

            {/* C. SKILLS AND TECHNOLOGY SECTION */}
            {hasSection('skills') && (
              <section id="skills" className="bx p-6 sm:p-8 space-y-6 text-left bg-white border-2 border-[#0A0A12] shadow-neo rounded-[24px]">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-[#0A0A12] tracking-tight">Tech Stack &amp; Skills</h2>
                    <p className="text-xs sm:text-sm text-[#55586B] mt-1 max-w-xl font-['DM_Sans']">
                      With experience in 20+ programming languages and dozens of frameworks, I can architect and implement solutions across the entire technology stack.
                    </p>
                  </div>

                  {/* Category Filter Tabs */}
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: 'languages', label: 'Languages' },
                      { id: 'frontend', label: 'Frontend' },
                      { id: 'backend', label: 'Backend' },
                      { id: 'databases', label: 'Databases' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setSkillCategory(tab.id)}
                        className={`pill text-xs min-h-[36px] px-3.5 transition-all font-bold ${
                          skillCategory === tab.id 
                            ? 'b1 shadow-neo-sm' 
                            : 'b2 hover:bg-[#F3F4F8]'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Compact Technology Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(skillsData[skillCategory] || skillsData.languages).map((sk) => (
                    <div 
                      key={sk.name}
                      className="p-3.5 rounded-[16px] bg-white border-2 border-[#0A0A12] hover:bg-[#E8ECFF] transition-all flex items-center gap-3 group shadow-neo-sm hover:shadow-neo card-lift cursor-default"
                    >
                      <div 
                        className="w-10 h-10 rounded-[10px] bg-[#FFD84D] border-2 border-[#0A0A12] flex items-center justify-center font-mono font-bold text-xs text-[#0A0A12] flex-shrink-0 group-hover:scale-105 transition-transform"
                      >
                        {sk.badge}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold font-['Space_Grotesk'] text-[#0A0A12] truncate">{sk.name}</h4>
                        <span className="text-[11px] text-[#55586B] font-mono block">{sk.exp}</span>
                      </div>
                    </div>
                  ))}
                </div>

              </section>
            )}

            {/* D. FEATURED PROJECTS SECTION */}
            {hasSection('showcase') && (
              <section id="projects" className="bx p-6 sm:p-8 space-y-6 text-left bg-white border-2 border-[#0A0A12] shadow-neo rounded-[24px]">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-[#0A0A12] tracking-tight">Featured Projects</h2>
                  <p className="text-xs sm:text-sm text-[#55586B] mt-1 max-w-xl font-['DM_Sans']">
                    A selection of my recent work. Each project is built with performance, security, and clean code in mind.
                  </p>
                </div>

                {/* Filter Chips & Search Bar */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {['all', 'backend', 'frontend', 'mobile', 'systems'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setProjectFilter(cat)}
                        className={`pill text-xs min-h-[34px] px-3 capitalize transition-all font-bold ${
                          projectFilter === cat 
                            ? 'b1 shadow-neo-sm' 
                            : 'b2 hover:bg-[#F3F4F8]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Project Search Input */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-[#55586B] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search projects..."
                      value={projectSearch}
                      onChange={(e) => setProjectSearch(e.target.value)}
                      className="in pl-8 pr-3 py-1 text-xs text-[#0A0A12] w-36 sm:w-48 min-h-[38px]"
                    />
                  </div>
                </div>
              </div>

              {/* Projects 3-Card Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredProjects.length === 0 ? (
                  <div className="col-span-full p-8 text-center bg-white border-2 border-[#0A0A12] rounded-[20px] shadow-neo-sm space-y-2">
                    <p className="font-['Space_Grotesk'] font-bold text-sm text-[#0A0A12]">
                      No projects found matching "{projectSearch}"
                    </p>
                    <button
                      type="button"
                      onClick={() => { setProjectSearch(''); setProjectFilter('all'); }}
                      className="pill b2 text-xs px-3 py-1 font-bold"
                    >
                      Clear Filter
                    </button>
                  </div>
                ) : (
                  filteredProjects.slice(0, 6).map((proj) => {
                  const lang = proj.metrics?.language || 'TypeScript';
                  return (
                    <SpotlightCard 
                      key={proj.id}
                      className="bx p-5 rounded-[20px] bg-white border-2 border-[#0A0A12] hover:bg-[#E8ECFF] transition-all flex flex-col justify-between group space-y-4 shadow-neo-sm hover:shadow-neo bx-hover"
                      spotlightColor="rgba(35, 64, 255, 0.12)"
                    >
                      <div className="space-y-2.5">
                        
                        {/* Header Bar */}
                        <div className="flex items-center justify-between text-xs">
                          <div className="w-8 h-8 rounded-[8px] bg-[#FFD84D] border-2 border-[#0A0A12] flex items-center justify-center text-[#0A0A12] font-bold group-hover:rotate-6 transition-transform">
                            <Code className="w-4 h-4" />
                          </div>
                          <span className="tg bg-white text-[#0A0A12] text-[10px] font-bold">
                            {lang}
                          </span>
                        </div>

                        {/* Title & Description */}
                        <div>
                          <h3 className="font-bold font-['Space_Grotesk'] text-base text-[#0A0A12] group-hover:text-[#2340FF] transition-colors truncate">
                            {proj.title}
                          </h3>
                          <p className="text-xs text-[#55586B] leading-relaxed line-clamp-3 mt-1 font-['DM_Sans']">
                            {proj.description || 'Full-stack software system engineered with modular architecture and clean code.'}
                          </p>
                        </div>

                        {/* Technology Tags */}
                        <div className="flex flex-wrap gap-1 pt-1">
                          {(proj.tags || [lang, 'System']).slice(0, 3).map((tag, idx) => (
                            <span 
                              key={idx}
                              className="tg tg-interactive text-[10px] bg-white text-[#0A0A12] font-bold"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                      </div>

                      {/* Card Footer Actions */}
                      <div className="pt-3 border-t-2 border-[#0A0A12]/15 flex items-center justify-between text-xs font-mono">
                        <a
                          href={proj.original_url || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#2340FF] hover:underline font-bold flex items-center gap-1 transition-colors"
                        >
                          <span>View Project</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </a>

                        {subComponents.hero_clone_snippet && (
                          <button
                            onClick={(e) => handleCopyClone(e, proj.external_id || proj.title, proj.id)}
                            className="tg bg-[#F3F4F8] text-[#0A0A12] hover:bg-[#FFD84D] text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                            title="Copy git clone snippet"
                          >
                            {copiedCloneId === proj.id ? (
                              <span className="text-[#0A0A12] flex items-center gap-1 font-bold"><Check className="w-3 h-3" /> Cloned</span>
                            ) : (
                              <span>git clone</span>
                            )}
                          </button>
                        )}
                      </div>

                    </SpotlightCard>
                  );
                }))}
              </div>

            </section>
            )}

            {/* D.2 PRICING & SPRINT PACKAGES */}
            {hasSection('pricing') && (
              <section id="pricing" className="bx p-6 sm:p-8 space-y-6 text-left bg-white border-2 border-[#0A0A12] shadow-neo rounded-[24px]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="tg bg-[#FFD84D] text-[#0A0A12] font-bold text-[10px]">Contract &amp; Retainers</span>
                      <span className="text-xs font-mono text-[#55586B]">Fixed-Price or Weekly</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-[#0A0A12] tracking-tight">
                      Engineering Packages &amp; Sprints
                    </h2>
                    <p className="text-xs sm:text-sm text-[#55586B] mt-1 max-w-xl font-['DM_Sans']">
                      Transparent deliverables, predictable turnaround times, and guaranteed code quality.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {pricingPackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="bx p-5 rounded-[20px] bg-white border-2 border-[#0A0A12] hover:bg-[#F3F4F8] transition-all flex flex-col justify-between group space-y-4 shadow-neo-sm hover:shadow-neo bx-hover"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="tg bg-[#E8ECFF] text-[#2340FF] text-[10px] font-bold font-mono">
                            {pkg.turnaround}
                          </span>
                          <span className="font-mono text-lg font-bold text-[#0A0A12]">
                            {pkg.price}
                          </span>
                        </div>
                        <h3 className="font-bold font-['Space_Grotesk'] text-base text-[#0A0A12]">
                          {pkg.title}
                        </h3>
                        <p className="text-xs text-[#55586B] leading-relaxed font-['DM_Sans']">
                          {pkg.deliverables}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (onBookPackage) onBookPackage(pkg);
                          else {
                            const el = document.getElementById('contact');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        className="pill b1 w-full text-center py-2 text-xs font-bold block shadow-neo-sm hover:translate-x-0.5"
                      >
                        Inquire / Book Sprint →
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* E, F, G BENTO ROW: ABOUT ME + CERTIFICATIONS + LET'S CONNECT */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              
              {/* E. ABOUT ME SECTION */}
              {hasSection('metrics') && (
                <div id="about" className="bx p-6 flex flex-col justify-between space-y-4 bg-white border-2 border-[#0A0A12] shadow-neo rounded-[24px]">
                  <div className="space-y-3">
                    <h3 className="text-base font-bold font-['Space_Grotesk'] text-[#0A0A12] tracking-tight">About Me</h3>
                    <p className="text-xs text-[#55586B] leading-relaxed font-['DM_Sans']">
                      I architect and implement complex systems in 15+ languages. Passionate about low-level systems, high-concurrency backends, and pixel-perfect developer experiences.
                    </p>
                  </div>

                  {/* 3 Bold Statistics */}
                  <div className="grid grid-cols-3 gap-2 pt-4 border-t-2 border-[#0A0A12]/15 text-center">
                    <div>
                      <span className="text-2xl font-bold text-[#0A0A12] font-['Space_Grotesk'] block">5+</span>
                      <span className="text-[10px] text-[#55586B] block leading-tight mt-0.5 font-bold font-['DM_Sans']">Years Exp</span>
                    </div>
                    <div>
                      <span className="text-2xl font-bold text-[#2340FF] font-['Space_Grotesk'] block">50+</span>
                      <span className="text-[10px] text-[#55586B] block leading-tight mt-0.5 font-bold font-['DM_Sans']">Projects</span>
                    </div>
                    <div>
                      <span className="text-2xl font-bold text-[#0A0A12] font-['Space_Grotesk'] block">20+</span>
                      <span className="text-[10px] text-[#55586B] block leading-tight mt-0.5 font-bold font-['DM_Sans']">Languages</span>
                    </div>
                  </div>
                </div>
              )}

              {/* F. CERTIFICATIONS SECTION */}
              {hasSection('certifications') && (
                <div id="certifications" className="bx p-6 flex flex-col justify-between space-y-4 bg-white border-2 border-[#0A0A12] shadow-neo rounded-[24px]">
                  <div className="space-y-1.5">
                    <h3 className="text-base font-bold font-['Space_Grotesk'] text-[#0A0A12] tracking-tight">Certifications</h3>
                    <p className="text-xs text-[#55586B] font-['DM_Sans']">
                      Verified industry credentials &amp; qualifications.
                    </p>
                  </div>

                  <div className="space-y-2 pt-1 font-['DM_Sans']">
                    {(portfolio?.certifications && portfolio.certifications.length > 0 ? portfolio.certifications : [
                      { title: 'CompTIA Security+', org: 'CompTIA', date: 'Sep 2025', icon: '🛡️' },
                      { title: 'AWS Solutions Architect', org: 'Amazon Web Services', date: 'Aug 2025', icon: '☁️' },
                      { title: 'CompTIA Tech+', org: 'CompTIA', date: 'June 2025', icon: '⚡' },
                      { title: 'Oracle Java Architect', org: 'Oracle', date: 'July 2024', icon: '☕' }
                    ]).map((cert, idx) => (
                      <div key={idx} className="p-3 rounded-[12px] bg-[#E8ECFF] border-2 border-[#0A0A12] flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span>{cert.icon || '🛡️'}</span>
                          <div>
                            <span className="font-bold text-[#0A0A12] text-[11px] block">{cert.title}</span>
                            <span className="text-[10px] text-[#55586B]">{cert.org}</span>
                          </div>
                        </div>
                        <span className="tg bg-white text-[#0A0A12] text-[10px] font-bold font-mono">{cert.date}</span>
                      </div>
                    ))}
                  </div>

                  <span className="text-[10px] text-[#55586B] font-bold font-mono block text-center uppercase tracking-wider">
                    Verified on Official Registries
                  </span>
                </div>
              )}

              {/* G. CONTACT SECTION: LET'S CONNECT */}
              {hasSection('booking') && (
                <div id="contact" className="bx p-6 flex flex-col justify-between space-y-4 bg-white border-2 border-[#0A0A12] shadow-neo rounded-[24px]">
                  <div className="space-y-1.5">
                    <h3 className="text-base font-bold font-['Space_Grotesk'] text-[#0A0A12] tracking-tight">Let’s Connect</h3>
                    <p className="text-xs text-[#55586B] leading-snug font-['DM_Sans']">
                      Have an ambitious project or technical challenge in mind? Let's discuss building something exceptional.
                    </p>
                  </div>

                  {/* Information Blocks */}
                  <div className="space-y-1.5 text-xs text-[#55586B] font-mono">
                    <div className="flex items-center gap-2 text-[11px]">
                      <Mail className="w-3.5 h-3.5 text-[#2340FF]" />
                      <span className="truncate">{user?.email || 'sathasivamb@domain.com'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px]">
                      <Phone className="w-3.5 h-3.5 text-[#2340FF]" />
                      <span>+1 (555) 019-2834</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px]">
                      <MapPin className="w-3.5 h-3.5 text-[#2340FF]" />
                      <span>Remote / Worldwide</span>
                    </div>
                  </div>

                  {/* Compact Contact Form */}
                  <form onSubmit={handleContactSubmit} className="space-y-2 pt-2 border-t-2 border-[#0A0A12]/15 font-['DM_Sans']">
                    <input
                      type="text"
                      placeholder="Your Name"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="in w-full text-xs min-h-[38px]"
                    />
                    <input
                      type="email"
                      placeholder="Your Email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="in w-full text-xs min-h-[38px]"
                    />
                    <textarea
                      rows={2}
                      placeholder="Project Inquiry / Message..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="in w-full text-xs resize-none"
                    />

                    <button
                      type="submit"
                      className="pill b1 w-full text-xs flex items-center justify-center gap-1.5 min-h-[40px] shadow-neo-sm font-bold hover:translate-x-0.5"
                    >
                      {contactSubmitted ? (
                        <span className="text-white flex items-center gap-1 font-bold"><Check className="w-3.5 h-3.5 text-[#7CFFB2]" /> Message Sent</span>
                      ) : (
                        <>
                          <Send className="w-3 h-3" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </form>

                </div>
              )}

            </div>

            {/* FOOTER */}
            <footer className="bx p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#55586B] font-['DM_Sans'] bg-white border-2 border-[#0A0A12] shadow-neo rounded-[20px]">
              <div className="flex items-center gap-2">
                <i className="w-3 h-3 rounded-full bg-[#FFD84D] border border-[#0A0A12] inline-block"></i>
                <span className="font-bold text-[#0A0A12]">
                  &copy; {new Date().getFullYear()} {user?.name || 'Sathasivam B'}. All rights reserved.
                </span>
              </div>

              <div className="flex items-center gap-4">
                {subComponents.platform_github && (
                  <a 
                    href={`https://github.com/${user?.username || 'SathasivamB'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#2340FF] transition-colors flex items-center gap-1 font-bold"
                  >
                    <GithubIcon className="w-3.5 h-3.5 fill-current" />
                    <span>GitHub</span>
                  </a>
                )}
                <span>•</span>
                <span className="tg bg-[#7CFFB2] text-[#0A0A12] font-bold">● Available for Hire</span>
              </div>
            </footer>

          </main>

        </div>

      </div>

    </div>
  );
}
