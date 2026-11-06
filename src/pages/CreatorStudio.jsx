import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  RotateCcw, 
  Sparkles, 
  Globe, 
  Copy, 
  Check, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Briefcase, 
  Plus, 
  ArrowRight, 
  Film, 
  Share2, 
  Clock, 
  Zap, 
  History,
  Undo2,
  Redo2,
  LogOut,
  ExternalLink,
  Layers,
  Eye,
  Palette,
  ChevronUp,
  ChevronDown,
  Type,
  Sliders,
  X,
  Lock,
  Unlock,
  Key,
  Shield,
  MessageSquare
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/Icons';
import UnifiedPortfolioView, { COLOR_PALETTES } from '../components/themes/UnifiedPortfolioView';
import VideoModal from '../components/VideoModal';
import PitchModal from '../components/PitchModal';
import BetaFeedbackModal from '../components/BetaFeedbackModal';
import AgentFolioLogo from '../components/AgentFolioLogo';
import { useRealtime } from '../utils/useRealtime';
import { ShinyText } from '../components/reactbits';

export default function CreatorStudio({ user, onLogout, onOpenSetupWizard, onOpenPricing }) {
  const username = user?.username || 'sathasivamb';
  
  // SaaS Subscription & Beta Pass State
  const [subscription, setSubscription] = useState(user?.subscription || null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  useEffect(() => {
    if (username) {
      fetch(`/api/user/subscription/${username}`)
        .then(r => r.json())
        .then(data => {
          if (data.success && data.subscription) {
            setSubscription(data.subscription);
          }
        })
        .catch(() => {});
    }
  }, [username]);

  // Studio state
  const [portfolio, setPortfolio] = useState(null);
  const [meta, setMeta] = useState({ currentIndex: 0, totalSnapshots: 1, canUndo: false, canRedo: false });
  const [viewport, setViewport] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isPitchModalOpen, setIsPitchModalOpen] = useState(false);
  const [showRearrangeModal, setShowRearrangeModal] = useState(false);

  // Chat Copilot state
  const [mobileStudioTab, setMobileStudioTab] = useState('preview'); // 'copilot' | 'preview'
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'msg_welcome',
      sender: 'assistant',
      text: `👋 Greetings, **${user?.name || 'Creator'}**! I am your **One-Click Creator Copilot**.\n\n✦ **Public Beta Pass is Active!** All premium features are 100% unlocked: Unlimited AI Copilot generation, all 12 Figma archetypes, watermark-free publishing, and real-time editing.\n\nYour portfolio is live with 100% visual parity across the Studio and Public links. You can:\n• Reorder modules (Hero, Metrics, Showcase, Case Studies, Tools, Pricing, Booking)\n• Change your color palette (Imperial Gold, Cyber Indigo, Matrix Emerald, Electric Cyan, Crimson Velocity, or custom Hex)\n• Switch typography (Modern Sans, Developer Mono, Editorial Serif)\n\nType any design request (e.g. *"change color to emerald"*, *"move pricing to top"*) or click the purple **Antigravity Arrow Button** below to undo any step!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);
  const [isChatProcessing, setIsChatProcessing] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const chatEndRef = useRef(null);

  // Subdomain slug
  const liveSubdomainUrl = `http://localhost:5000/u/${username}`;

  // Publish modals state (matching Folio AI 05_Editor_and_Publish.html & 08_Publish_Success.html)
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [isPublishedSuccess, setIsPublishedSuccess] = useState(false);

  // Visibility modal state (Public vs Private / Draft vs Password PIN)
  const [showVisibilityModal, setShowVisibilityModal] = useState(false);
  const [visibilityChoice, setVisibilityChoice] = useState(() => portfolio?.visibility || 'public');
  const [customPin, setCustomPin] = useState(() => portfolio?.access_pin || '1234');

  useEffect(() => {
    if (portfolio?.visibility) setVisibilityChoice(portfolio.visibility);
    if (portfolio?.access_pin) setCustomPin(portfolio.access_pin);
  }, [portfolio?.visibility, portfolio?.access_pin]);

  const handleSaveVisibility = async (newVis, newPin) => {
    if (!portfolio) return;
    const next = {
      ...portfolio,
      visibility: newVis,
      access_pin: newPin || portfolio.access_pin || '1234'
    };
    await savePortfolioState(next, `Visibility set to ${newVis.toUpperCase()}`);
    setShowVisibilityModal(false);
  };

  // Connect to Real-Time Synchronization Engine
  const { isConnected, activeViewers } = useRealtime({
    role: 'creator',
    username,
    onPortfolioUpdated: (data) => {
      if (data.portfolio) {
        setPortfolio(data.portfolio);
        if (data.meta) setMeta(data.meta);
      }
    },
    onCreatorActivity: (notification) => {
      // Push direct notification into the Copilot chat timeline
      setChatMessages(prev => [
        ...prev,
        {
          id: `activity_${Date.now()}`,
          sender: 'assistant',
          text: `⚡ **Real-Time Client Activity**\n\n**${notification.title}**\n${notification.description}`,
          timestamp: notification.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  });

  // Fetch initial portfolio
  useEffect(() => {
    loadPortfolio();
  }, [username]);

  const loadPortfolio = async () => {
    try {
      const res = await fetch(`/api/portfolio/${username}`);
      if (res.ok) {
        const data = await res.json();
        setPortfolio(data.portfolio);
        setMeta(data.meta || {});
      }
    } catch (err) {
      console.warn("Using offline portfolio baseline:", err);
    }
  };

  const handleCopySubdomain = () => {
    navigator.clipboard?.writeText(liveSubdomainUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  // Save portfolio to backend & snapshot in Antigravity
  const savePortfolioState = async (nextPortfolio, triggerLabel) => {
    setPortfolio(nextPortfolio);
    try {
      const res = await fetch(`/api/portfolio/${username}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portfolio: nextPortfolio, trigger: triggerLabel })
      });
      if (res.ok) {
        const data = await res.json();
        setMeta(data.meta || {});
      }
    } catch (err) {
      console.warn("Antigravity save warning:", err);
    }
  };

  // Antigravity Undo (Interactive Arrow Button Handler)
  const handleAntigravityUndo = async () => {
    if (!meta.canUndo) return;
    setIsChatProcessing(true);
    try {
      const res = await fetch(`/api/portfolio/${username}/antigravity/undo`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setPortfolio(data.portfolio);
        setMeta(data.meta || {});

        const msg = {
          id: `msg_u_${Date.now()}`,
          sender: 'assistant',
          text: `🌀 **Antigravity Inversion Executed**: Reverted chronologically to prior state: *"${data.trigger}"*.\n\n*${data.meta?.currentIndex} prior snapshot(s) remaining in cache.*`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages(prev => [...prev, msg]);
      }
    } catch (err) {
      console.warn("Undo error:", err);
    } finally {
      setIsChatProcessing(false);
    }
  };

  // Antigravity Redo
  const handleAntigravityRedo = async () => {
    if (!meta.canRedo) return;
    try {
      const res = await fetch(`/api/portfolio/${username}/antigravity/redo`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setPortfolio(data.portfolio);
        setMeta(data.meta || {});
      }
    } catch (err) {}
  };

  // Quick Design Customizers
  const handleSelectPalette = async (palId) => {
    const found = COLOR_PALETTES.find(p => p.id === palId);
    if (!found || !portfolio) return;
    const next = {
      ...portfolio,
      active_theme: palId,
      palette: found
    };
    await savePortfolioState(next, `Palette switched to ${found.name}`);
  };

  const handleCustomHexColor = async (hex) => {
    if (!portfolio || !hex) return;
    const customPalette = {
      id: 'custom',
      name: 'Custom Theme',
      primary: hex,
      accent: hex,
      bg: '#0a0a0f',
      surface: '#121218',
      border: `${hex}40`,
      glow: `${hex}20`,
      badgeBg: `${hex}15`,
      custom: true
    };
    const next = {
      ...portfolio,
      active_theme: 'custom',
      palette: customPalette
    };
    await savePortfolioState(next, `Custom brand color set to ${hex}`);
  };

  const handleSelectFont = async (fontStyle) => {
    if (!portfolio) return;
    const next = {
      ...portfolio,
      font_style: fontStyle
    };
    await savePortfolioState(next, `Typography switched to ${fontStyle}`);
  };

  const handleMoveSection = async (sectionId, direction) => {
    if (!portfolio) return;
    const currentSections = portfolio.selected_sections ? [...portfolio.selected_sections] : [
      'hero', 'metrics', 'showcase', 'case_studies', 'tools', 'testimonials', 'pricing', 'booking'
    ];
    const idx = currentSections.indexOf(sectionId);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= currentSections.length) return;
    
    const temp = currentSections[targetIdx];
    currentSections[targetIdx] = currentSections[idx];
    currentSections[idx] = temp;
    
    const next = {
      ...portfolio,
      selected_sections: currentSections
    };
    await savePortfolioState(next, `Reordered ${sectionId} ${direction}`);
  };

  // Handle Natural Language Chat Input
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!chatInput.trim() || isChatProcessing || !portfolio) return;

    const userText = chatInput.trim();
    const userMsg = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsChatProcessing(true);

    const lower = userText.toLowerCase();
    let reply = '';
    let trigger = '';
    const updated = JSON.parse(JSON.stringify(portfolio));

    if (lower.includes('undo') || lower.includes('revert') || lower.includes('step back')) {
      await handleAntigravityUndo();
      setIsChatProcessing(false);
      return;
    }

    if (lower.includes('redo') || lower.includes('step forward')) {
      await handleAntigravityRedo();
      setIsChatProcessing(false);
      return;
    }

    // Natural Language Color Palette Switching
    if (lower.includes('emerald') || lower.includes('green') || lower.includes('matrix')) {
      const pal = COLOR_PALETTES.find(p => p.id === 'matrix-emerald');
      updated.palette = pal;
      updated.active_theme = 'matrix-emerald';
      trigger = 'Palette switched to Matrix Emerald';
      reply = `🌲 Switched portfolio palette to **Matrix Emerald**! Canvas updated in real-time.`;
    } else if (lower.includes('indigo') || lower.includes('purple') || lower.includes('cyber')) {
      const pal = COLOR_PALETTES.find(p => p.id === 'cyber-indigo');
      updated.palette = pal;
      updated.active_theme = 'cyber-indigo';
      trigger = 'Palette switched to Cyber Indigo';
      reply = `🔮 Switched portfolio palette to **Cyber Indigo**! Canvas updated in real-time.`;
    } else if (lower.includes('cyan') || lower.includes('electric') || lower.includes('teal')) {
      const pal = COLOR_PALETTES.find(p => p.id === 'electric-cyan');
      updated.palette = pal;
      updated.active_theme = 'electric-cyan';
      trigger = 'Palette switched to Electric Cyan';
      reply = `🌊 Switched portfolio palette to **Electric Cyan**! Canvas updated in real-time.`;
    } else if (lower.includes('ruby') || lower.includes('crimson') || lower.includes('red')) {
      const pal = COLOR_PALETTES.find(p => p.id === 'crimson-ruby');
      updated.palette = pal;
      updated.active_theme = 'crimson-ruby';
      trigger = 'Palette switched to Crimson Velocity';
      reply = `🔥 Switched portfolio palette to **Crimson Velocity**! Canvas updated in real-time.`;
    } else if (lower.includes('gold') || lower.includes('amber') || lower.includes('imperial')) {
      const pal = COLOR_PALETTES.find(p => p.id === 'amber-gold');
      updated.palette = pal;
      updated.active_theme = 'amber-gold';
      trigger = 'Palette switched to Imperial Gold';
      reply = `👑 Switched portfolio palette to **Imperial Gold**! Canvas updated in real-time.`;
    } else if (lower.match(/#[0-9a-fA-F]{3,6}/)) {
      const hexMatch = lower.match(/#[0-9a-fA-F]{3,6}/)[0];
      const customPal = {
        id: 'custom',
        name: 'Custom Theme',
        primary: hexMatch,
        accent: hexMatch,
        bg: '#0a0a0f',
        surface: '#121218',
        border: `${hexMatch}40`,
        glow: `${hexMatch}20`,
        badgeBg: `${hexMatch}15`,
        custom: true
      };
      updated.palette = customPal;
      updated.active_theme = 'custom';
      trigger = `Custom hex color set to ${hexMatch}`;
      reply = `🎨 Applied custom brand color **${hexMatch}** across your portfolio!`;
    }
    // Typography Commands
    else if (lower.includes('font mono') || lower.includes('monospace') || lower.includes('code font')) {
      updated.font_style = 'mono';
      trigger = 'Typography set to Developer Mono';
      reply = `💻 Switched typography to **Developer Mono** (JetBrains Mono / Fira Code style).`;
    } else if (lower.includes('font serif') || lower.includes('editorial font')) {
      updated.font_style = 'serif';
      trigger = 'Typography set to Editorial Serif';
      reply = `📖 Switched typography to **Editorial Serif** (Playfair / Luxury editorial style).`;
    } else if (lower.includes('font sans') || lower.includes('modern font')) {
      updated.font_style = 'sans';
      trigger = 'Typography set to Modern Sans';
      reply = `✨ Switched typography to **Modern Sans** (Inter / High-clarity system style).`;
    }
    // Section Arrangement Commands
    else if (lower.includes('pricing') && (lower.includes('top') || lower.includes('up') || lower.includes('first'))) {
      const cur = updated.selected_sections ? [...updated.selected_sections] : ['hero', 'metrics', 'showcase', 'case_studies', 'tools', 'testimonials', 'pricing', 'booking'];
      const filtered = cur.filter(s => s !== 'pricing');
      // Place right below hero or at very top
      const heroIdx = filtered.indexOf('hero');
      if (heroIdx !== -1) {
        filtered.splice(heroIdx + 1, 0, 'pricing');
      } else {
        filtered.unshift('pricing');
      }
      updated.selected_sections = filtered;
      trigger = 'Moved Retainer Pricing to top';
      reply = `💰 Positioned **Retainers & Pricing** prominently toward the top of your portfolio!`;
    } else if (lower.includes('showcase') && (lower.includes('top') || lower.includes('up') || lower.includes('first'))) {
      const cur = updated.selected_sections ? [...updated.selected_sections] : ['hero', 'metrics', 'showcase', 'case_studies', 'tools', 'testimonials', 'pricing', 'booking'];
      const filtered = cur.filter(s => s !== 'showcase');
      const heroIdx = filtered.indexOf('hero');
      if (heroIdx !== -1) {
        filtered.splice(heroIdx + 1, 0, 'showcase');
      } else {
        filtered.unshift('showcase');
      }
      updated.selected_sections = filtered;
      trigger = 'Moved Showcase to top';
      reply = `🚀 Positioned **Primary Work Showcase** directly below your Hero identity!`;
    } else if (lower.includes('title') || lower.includes('headline')) {
      const match = userText.match(/(?:to|is)\s+["']?([^"']+)["']?/i);
      const newTitle = match ? match[1].trim() : 'Executive Video Producer & Systems Director';
      updated.title = newTitle;
      trigger = `Updated title to "${newTitle}"`;
      reply = `✅ Updated portfolio headline to **${newTitle}**. State snapshot captured!`;
    } else if (lower.includes('bio') || lower.includes('rewrite')) {
      updated.bio = 'Full-Stack Software Engineer & Creative Systems Architect building high-converting interfaces and scalable distributed applications.';
      trigger = 'Rewrote creator bio with modern authoritative tone';
      reply = `✍️ Rewrote your creator bio to highlight your engineering leadership and delivery track record.`;
    } else {
      try {
        const aiRes = await fetch('/api/ai/copilot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userText,
            context: {
              title: portfolio.title,
              theme: portfolio.active_theme,
              itemsCount: portfolio.items?.length,
              metrics: portfolio.metrics
            }
          })
        });
        const aiData = await aiRes.json();
        reply = aiData.response || `I analyzed your portfolio request: "${userText}".`;
      } catch {
        reply = `I processed your request: "${userText}". Here are natural commands you can try:\n\n• *"Change color to emerald"* or *"indigo"*, *"cyan"*, *"ruby"*, *"gold"*\n• *"Use custom color #6366f1"*\n• *"Switch font to mono"* or *"serif"*, *"sans"*\n• *"Move pricing to top"*\n• *"Move showcase to top"*\n• *"Undo"* (or click the purple Antigravity Arrow Button!)`;
      }
      trigger = 'Copilot guidance';
    }

    if (trigger && trigger !== 'Copilot guidance') {
      await savePortfolioState(updated, trigger);
    }

    setChatMessages(prev => [
      ...prev,
      {
        id: `reply_${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setIsChatProcessing(false);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatProcessing]);

  // Active palette
  const currentPaletteId = portfolio?.palette?.id || 'amber-gold';
  const currentFontStyle = portfolio?.font_style || 'sans';
  const currentSections = portfolio?.selected_sections || [
    'hero', 'metrics', 'showcase', 'case_studies', 'tools', 'testimonials', 'pricing', 'booking'
  ];

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#F3F4F8] text-[#0A0A12] font-['DM_Sans'] select-none">
      
      {/* ============================================================== */}
      {/* TOP BAR: BRAND, ACTIONS & PUBLISH (Folio AI v2 Board 5)        */}
      {/* ============================================================== */}
      <header className="h-16 px-4 sm:px-6 glass-chrome flex items-center justify-between gap-4 z-30 flex-shrink-0 sticky top-0">
        
        {/* Brand: Logo + Saved Tag */}
        <div className="flex items-center gap-3">
          <AgentFolioLogo />
          <span className="tg bg-[#7CFFB2] text-[#0A0A12] text-xs font-bold">
            All changes saved
          </span>
        </div>

        {/* Live Subdomain & Editor Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Public Beta All-Features Unlocked Pass */}
          <button
            onClick={onOpenPricing}
            className="pill text-xs px-2.5 sm:px-3 py-1 min-h-[38px] font-bold flex items-center gap-1.5 shadow-neo-sm border-2 border-[#0A0A12] bg-[#7CFFB2] text-[#0A0A12] hover:bg-[#68e59e] transition-all cursor-pointer flex-shrink-0"
            title="Public Beta Pass: All 12 templates & AI tools 100% unlocked"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#2340FF]" />
            <span className="font-space hidden sm:inline">
              <ShinyText 
                text="✦ Beta Pass:" 
                shimmerColor="#FFFFFF" 
                baseColor="#0A0A12" 
                speed={3} 
              />
            </span>
            <span className="font-mono font-bold text-[#0A0A12] bg-white px-1.5 py-0.5 rounded border border-[#0A0A12]">
              All Features Unlocked
            </span>
          </button>

          {/* Public Beta Feedback Button */}
          <button
            onClick={() => setShowFeedbackModal(true)}
            className="pill b2 text-xs px-2.5 sm:px-3 py-1 min-h-[38px] font-bold flex items-center gap-1.5 shadow-neo-sm hover:bg-[#F3F4F8] transition-all cursor-pointer flex-shrink-0"
            title="Send Beta Feedback or Bug Report"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#2340FF]" />
            <span className="hidden sm:inline">Feedback</span>
          </button>

          {/* Antigravity Undo / Redo */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleAntigravityUndo}
              disabled={!meta.canUndo}
              className="pill b2 text-xs px-3 py-1 min-h-[38px] disabled:opacity-40"
              title="Undo design change"
            >
              <Undo2 className="w-3.5 h-3.5 mr-1" />
              <span className="hidden sm:inline">Undo</span>
            </button>
            <button
              onClick={handleAntigravityRedo}
              disabled={!meta.canRedo}
              className="pill b2 text-xs px-3 py-1 min-h-[38px] disabled:opacity-40"
              title="Redo design change"
            >
              <Redo2 className="w-3.5 h-3.5 mr-1" />
              <span className="hidden sm:inline">Redo</span>
            </button>
          </div>

          {/* Visibility Controls Pill */}
          <button
            type="button"
            onClick={() => setShowVisibilityModal(true)}
            className={`pill b2 text-xs px-3 py-1 min-h-[38px] flex items-center gap-1.5 font-bold transition-all ${
              portfolio?.visibility === 'private'
                ? 'border-[#EF4444] bg-[#EF4444]/10 text-[#EF4444]'
                : portfolio?.visibility === 'password'
                ? 'border-[#FFD84D] bg-[#FFD84D]/25 text-[#0A0A12]'
                : 'text-[#0A0A12]'
            }`}
            title="Configure portfolio public/private visibility"
          >
            {portfolio?.visibility === 'private' ? (
              <>
                <Lock className="w-3.5 h-3.5 text-[#EF4444]" />
                <span className="hidden sm:inline">Private (Draft)</span>
              </>
            ) : portfolio?.visibility === 'password' ? (
              <>
                <Key className="w-3.5 h-3.5 text-[#0A0A12]" />
                <span className="hidden sm:inline">PIN Protected</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-[#7CFFB2] border border-[#0A0A12] animate-pulse" />
                <span className="hidden sm:inline">Live &amp; Public</span>
              </>
            )}
          </button>

          {/* Preview Site */}
          <a
            href={`/u/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="pill b2 text-xs px-3 py-1 min-h-[38px] flex items-center gap-1.5"
            title="Preview live site in new tab"
          >
            <Eye className="w-3.5 h-3.5 text-[#2340FF]" />
            <span className="hidden md:inline">Preview site</span>
          </a>

          {/* Customize Blueprint & Templates Button */}
          {onOpenSetupWizard && (
            <button
              onClick={() => onOpenSetupWizard(portfolio?.custom_template || portfolio?.active_theme)}
              className="pill b2 text-xs px-3.5 py-1 min-h-[38px] flex items-center gap-1.5 shadow-neo-sm hover:translate-x-0.5"
              title="Switch Figma templates, colors, or reorder sections"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#2340FF]" />
              <span className="hidden md:inline font-bold">Blueprint &amp; Templates</span>
            </button>
          )}

          {/* Primary Publish Button (Folio AI v2 Board 5: .pill.b1) */}
          <button
            onClick={() => setShowPublishModal(true)}
            className="pill b1 text-xs px-5 py-1.5 min-h-[38px] shadow-neo-sm hover:translate-x-0.5"
            title="Publish portfolio to live domain"
          >
            Publish
          </button>

          {/* User Sign Out */}
          <button
            onClick={onLogout}
            className="pill b2 p-2 min-h-[38px] text-[#55586B] hover:text-[#0A0A12] text-xs transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* SaaS Ultra Pro Trial Active Banner */}
      <div className="bg-[#E8ECFF] border-b-2 border-[#0A0A12] px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2 text-xs flex-shrink-0">
        <div className="flex items-center gap-2 text-[#0A0A12]">
          <span className="tg bg-[#7CFFB2] text-[#0A0A12] text-[10px] font-bold">
            ✦ PUBLIC BETA PASS ACTIVE
          </span>
          <span className="font-medium text-[11px] sm:text-xs">
            Public Beta: Full Studio access unlocked · Unlimited AI Copilot · No Watermarks · All 12 Figma Archetypes
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono font-bold text-[#0A0A12] text-[11px] sm:text-xs bg-white px-2 py-0.5 rounded border border-[#0A0A12]">
            ✦ 100% Free During Beta
          </span>
          {onOpenPricing && (
            <button
              onClick={onOpenPricing}
              className="pill b1 text-[11px] px-2.5 py-0.5 min-h-[28px] font-bold shadow-neo-sm hover:translate-x-0.5"
            >
              Beta Info
            </button>
          )}
        </div>
      </div>

      {/* Mobile / Tablet View Switcher Tab (only on screens < lg) */}
      <div className="flex lg:hidden items-center border-b-2 border-[#0A0A12] bg-white font-mono text-xs flex-shrink-0">
        <button
          type="button"
          onClick={() => setMobileStudioTab('copilot')}
          className={`flex-1 py-2.5 font-bold flex items-center justify-center gap-1.5 border-r-2 border-[#0A0A12] transition-colors ${
            mobileStudioTab === 'copilot' ? 'bg-[#2340FF] text-white shadow-sm' : 'bg-white text-[#0A0A12] hover:bg-[#F3F4F8]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Copilot Chat</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileStudioTab('preview')}
          className={`flex-1 py-2.5 font-bold flex items-center justify-center gap-1.5 transition-colors ${
            mobileStudioTab === 'preview' ? 'bg-[#FFD84D] text-[#0A0A12] shadow-sm' : 'bg-white text-[#0A0A12] hover:bg-[#F3F4F8]'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Live Preview</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* SPLIT-SCREEN WORKSPACE: 40% COPILOT CHAT + 60% LIVE PREVIEW     */}
      {/* ============================================================== */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* ============================================================ */}
        {/* LEFT PANEL (40%): AI COPILOT & ANTIGRAVITY ENGINE           */}
        {/* ============================================================ */}
        <div className={`w-full lg:w-[40%] ${mobileStudioTab === 'copilot' ? 'flex flex-1' : 'hidden lg:flex'} flex-col border-r-2 border-[#0A0A12] bg-[#F3F4F8] overflow-hidden`}>
          
          {/* Chat Header with Antigravity Matrix toggle */}
          <div className="p-3.5 px-4 border-b-2 border-[#0A0A12] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#2340FF]" />
              <span className="text-xs font-bold text-[#0A0A12] uppercase tracking-wider font-['Space_Grotesk']">
                Creator Copilot
              </span>
              <span className="tg bg-[#7CFFB2] text-[#0A0A12] text-[10px] font-bold">
                ACTIVE
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowHistoryDrawer(!showHistoryDrawer)}
                className="tg bg-[#E8ECFF] text-[#0A0A12] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                title="View Antigravity sequential state history"
              >
                <History className="w-3.5 h-3.5 text-[#2340FF]" />
                <span>States: {meta.currentIndex + 1}/{meta.totalSnapshots}</span>
              </button>
            </div>
          </div>

          {/* History Drawer */}
          {showHistoryDrawer && (
            <div className="p-3.5 bg-[#E8ECFF] border-b-2 border-[#0A0A12] space-y-2 max-h-48 overflow-y-auto text-xs animate-fade-in text-[#0A0A12]">
              <div className="flex items-center justify-between text-xs text-[#0A0A12] font-bold font-['Space_Grotesk']">
                <span>Antigravity Sequential Cache (Last 10 States)</span>
                <span className="font-mono">{meta.totalSnapshots} Snapshots</span>
              </div>
              <p className="text-xs text-[#55586B] italic font-['DM_Sans']">
                Click the upward Antigravity arrow button anytime to drift backward chronologically.
              </p>
            </div>
          )}

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 font-['DM_Sans'] text-xs">
            {chatMessages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}>
                  <div
                    className={`max-w-[90%] p-4 rounded-[18px] leading-relaxed whitespace-pre-wrap border-2 border-[#0A0A12] shadow-neo-sm ${
                      isUser
                        ? 'bg-[#2340FF] text-white font-medium rounded-tr-none'
                        : 'bg-white text-[#0A0A12] rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] font-mono text-[#55586B] px-1">{msg.timestamp}</span>
                </div>
              );
            })}
            {isChatProcessing && (
              <div className="bx p-3 border-2 border-[#0A0A12] shadow-neo-sm text-xs text-[#2340FF] flex items-center gap-2 animate-pulse bg-white">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Copilot is re-architecting your developer portfolio...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input featuring the PROMINENT ANTIGRAVITY ARROW BUTTON */}
          <div className="p-3 sm:p-4 border-t-2 border-[#0A0A12] bg-white space-y-2">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              
              <div className="relative flex-1">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask: 'change color to emerald', 'font mono', 'move pricing to top'..."
                  disabled={isChatProcessing}
                  className="in w-full text-xs sm:text-sm text-[#0A0A12] placeholder-[#55586B]"
                />
              </div>

              {/* THE PROMINENT ANTIGRAVITY ARROW BUTTON */}
              <div className="relative group flex-shrink-0">
                <button
                  type="button"
                  onClick={handleAntigravityUndo}
                  disabled={isChatProcessing || !meta.canUndo}
                  aria-label="Antigravity Drift: Chronologically revert prior design state"
                  className={`pill relative flex items-center justify-center p-2.5 sm:p-3 min-h-[44px] min-w-[44px] font-bold transition-all duration-300 ${
                    meta.canUndo
                      ? 'by shadow-neo-sm hover:scale-105 active:scale-95 cursor-pointer'
                      : 'b2 cursor-not-allowed opacity-50'
                  }`}
                >
                  <Undo2 className="w-5 h-5 transition-transform duration-300 group-hover:-rotate-12 group-hover:-translate-y-0.5" />
                  {meta.canUndo && meta.currentIndex > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-[#FFD84D] text-[#0A0A12] border-2 border-[#0A0A12]">
                      {meta.currentIndex}
                    </span>
                  )}
                </button>

                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 right-0 hidden group-hover:flex flex-col items-end w-52 pointer-events-none z-50">
                  <div className="bx text-[#0A0A12] border-2 border-[#0A0A12] shadow-neo text-[10px] p-2 rounded-[12px] bg-white">
                    <span className="font-bold text-[#2340FF] block font-['Space_Grotesk']">ANTIGRAVITY ENGINE</span>
                    <span className="text-[#55586B]">Click to chronologically drift backward and restore prior layout states.</span>
                  </div>
                </div>
              </div>

              {/* Submit Anchor */}
              <button
                type="submit"
                disabled={!chatInput.trim() || isChatProcessing}
                className="pill b1 p-2.5 sm:p-3 min-h-[44px] min-w-[44px] flex items-center justify-center disabled:opacity-40 shadow-neo-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-center justify-between text-[10px] text-[#55586B] font-mono pt-0.5">
              <span>Antigravity: {meta.canUndo ? `${meta.currentIndex} step(s) available` : 'Genesis Baseline'}</span>
              {meta.canRedo && (
                <button onClick={handleAntigravityRedo} className="text-[#2340FF] font-bold hover:underline flex items-center gap-1">
                  <span>Redo</span>
                  <Redo2 className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

        </div>

        {/* ============================================================ */}
        {/* RIGHT PANEL (60%): SANDBOXED LIVE CREATOR PORTFOLIO RENDER  */}
        {/* ============================================================ */}
        <div className={`w-full lg:w-[60%] ${mobileStudioTab === 'preview' ? 'flex flex-1' : 'hidden lg:flex'} flex-col bg-[#E8ECFF] overflow-hidden`}>
          
          {/* Viewport & Live Design Bar */}
          <div className="p-2.5 px-4 border-b-2 border-[#0A0A12] bg-white flex flex-wrap items-center justify-between gap-3 text-xs flex-shrink-0">
            
            {/* Viewport Toggles (Folio AI v2 Board 5 style) */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setViewport('desktop')}
                className={`pill text-xs min-h-[34px] px-3 font-bold transition-all ${viewport === 'desktop' ? 'b1 shadow-neo-sm' : 'b2 hover:bg-[#F3F4F8]'}`}
                title="Desktop View"
              >
                <Monitor className="w-3.5 h-3.5 mr-1 inline" />
                <span>Desktop</span>
              </button>
              <button
                onClick={() => setViewport('tablet')}
                className={`pill text-xs min-h-[34px] px-3 font-bold transition-all ${viewport === 'tablet' ? 'b1 shadow-neo-sm' : 'b2 hover:bg-[#F3F4F8]'}`}
                title="Tablet View"
              >
                <Tablet className="w-3.5 h-3.5 mr-1 inline" />
                <span>Tablet</span>
              </button>
              <button
                onClick={() => setViewport('mobile')}
                className={`pill text-xs min-h-[34px] px-3 font-bold transition-all ${viewport === 'mobile' ? 'b1 shadow-neo-sm' : 'b2 hover:bg-[#F3F4F8]'}`}
                title="Mobile View"
              >
                <Smartphone className="w-3.5 h-3.5 mr-1 inline" />
                <span>Mobile</span>
              </button>
            </div>

            {/* In-Studio Palette Quick Switcher */}
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold text-[#55586B] mr-1 font-mono">Palette:</span>
              {COLOR_PALETTES.map(pal => {
                const isActive = currentPaletteId === pal.id;
                return (
                  <button
                    key={pal.id}
                    onClick={() => handleSelectPalette(pal.id)}
                    className={`w-5 h-5 rounded-full border-2 border-[#0A0A12] transition-all ${
                      isActive ? 'ring-2 ring-[#2340FF] scale-110 shadow-sm' : 'opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: pal.accent }}
                    title={pal.name}
                  />
                );
              })}
              {/* Custom hex color input */}
              <input
                type="color"
                value={portfolio?.palette?.primary || '#2340FF'}
                onChange={(e) => handleCustomHexColor(e.target.value)}
                className="w-5 h-5 rounded-full border-2 border-[#0A0A12] cursor-pointer p-0 bg-transparent"
                title="Pick custom brand color"
              />
            </div>

            {/* In-Studio Font Quick Switcher */}
            <div className="hidden md:flex items-center gap-1 text-[11px] font-bold">
              {[
                { id: 'sans', label: 'Space' },
                { id: 'mono', label: 'Mono' },
                { id: 'serif', label: 'Serif' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => handleSelectFont(f.id)}
                  className={`pill text-xs min-h-[32px] px-3 transition-colors ${
                    currentFontStyle === f.id ? 'b1 shadow-neo-sm' : 'b2 hover:bg-[#F3F4F8]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* In-Studio Quick Rearrange Button */}
            <button
              onClick={() => setShowRearrangeModal(true)}
              className="pill b2 text-xs px-3 py-1 min-h-[34px] flex items-center gap-1.5"
              title="Rearrange section order"
            >
              <Layers className="w-3.5 h-3.5 text-[#2340FF]" />
              <span className="hidden sm:inline">Rearrange</span>
            </button>

            {/* Share / Open link */}
            <button
              onClick={handleCopySubdomain}
              className="pill b2 text-xs px-3 py-1 min-h-[34px] flex items-center gap-1.5"
            >
              {copiedUrl ? <Check className="w-3.5 h-3.5 text-[#7CFFB2]" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedUrl ? 'Copied' : 'Share URL'}</span>
            </button>
          </div>

          {/* Viewport Canvas Frame (Board 5 center canvas) */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex items-center justify-center bg-[#E8ECFF]">
            
            {!portfolio ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-[#55586B] gap-3 py-24">
                <div className="w-8 h-8 rounded-full border-2 border-[#0A0A12] border-t-transparent animate-spin" />
                <span className="text-xs font-mono uppercase tracking-widest text-[#0A0A12] font-bold">Synchronizing Creator Portfolio Canvas...</span>
              </div>
            ) : viewport === 'desktop' ? (
              <div className="w-full h-full rounded-[24px] bx p-0 shadow-neo overflow-hidden flex flex-col bg-white border-2 border-[#0A0A12]">
                <div className="px-4 py-2.5 border-b-2 border-[#0A0A12] bg-white flex items-center justify-between font-mono text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#EF4444] border border-[#0A0A12]" />
                    <span className="w-3 h-3 rounded-full bg-[#F59E0B] border border-[#0A0A12]" />
                    <span className="w-3 h-3 rounded-full bg-[#7CFFB2] border border-[#0A0A12]" />
                  </div>
                  <span className="text-[#55586B] font-bold">{username}.folio.ai</span>
                  <div className="w-12" />
                </div>
                <div className="flex-1 overflow-y-auto">
                  <UnifiedPortfolioView
                    portfolio={portfolio}
                    user={user}
                    isStudio={true}
                    onOpenVideo={(item) => setSelectedVideo(item)}
                    onBookPackage={() => setIsPitchModalOpen(true)}
                  />
                </div>
              </div>
            ) : viewport === 'tablet' ? (
              <div className="w-[740px] max-w-[95vw] h-[800px] max-h-[85vh] rounded-[32px] border-4 border-[#0A0A12] bg-white shadow-neo flex flex-col overflow-hidden">
                <div className="h-6 bg-[#F3F4F8] border-b-2 border-[#0A0A12] flex items-center justify-center flex-shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#0A0A12]" />
                </div>
                <div className="flex-1 overflow-y-auto">
                  <UnifiedPortfolioView
                    portfolio={portfolio}
                    user={user}
                    isStudio={true}
                    onOpenVideo={(item) => setSelectedVideo(item)}
                    onBookPackage={() => setIsPitchModalOpen(true)}
                  />
                </div>
              </div>
            ) : (
              <div className="w-[375px] max-w-[92vw] h-[720px] max-h-[85vh] rounded-[42px] border-4 border-[#0A0A12] bg-white shadow-neo flex flex-col overflow-hidden">
                <div className="h-8 bg-[#F3F4F8] border-b-2 border-[#0A0A12] px-6 flex items-center justify-between text-[11px] font-mono text-[#0A0A12] flex-shrink-0 font-bold">
                  <span>9:41</span>
                  <div className="w-16 h-3 rounded-full bg-[#0A0A12]" />
                  <span>5G</span>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <UnifiedPortfolioView
                    portfolio={portfolio}
                    user={user}
                    isStudio={true}
                    onOpenVideo={(item) => setSelectedVideo(item)}
                    onBookPackage={() => setIsPitchModalOpen(true)}
                  />
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* In-Studio Section Rearrange Modal */}
      {showRearrangeModal && (
        <div className="fixed inset-0 z-50 bg-[#0A0A12]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bx w-full max-w-md border-2 border-[#0A0A12] shadow-neo p-6 space-y-4 animate-fade-in bg-white text-left rounded-[24px]">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#0A0A12]">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#2340FF]" />
                <h3 className="text-lg font-bold text-[#0A0A12] font-['Space_Grotesk']">Rearrange Portfolio Sections</h3>
              </div>
              <button onClick={() => setShowRearrangeModal(false)} className="text-[#55586B] hover:text-[#0A0A12]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#55586B] leading-relaxed font-['DM_Sans']">
              Click the arrows to move sections up or down. Changes apply instantly with automatic Antigravity snapshots.
            </p>

            <div className="space-y-2 max-h-72 overflow-y-auto">
              {currentSections.map((secId, idx) => {
                const sectionNames = {
                  hero: 'Hero & Identity',
                  metrics: 'Metrics & Performance',
                  showcase: 'Work Showcase & Projects',
                  case_studies: 'Case Studies',
                  tools: 'Tooling Arsenal',
                  testimonials: 'Client Testimonials',
                  pricing: 'Retainers & Pricing',
                  booking: 'Discovery Call Booking'
                };
                return (
                  <div key={secId} className="flex items-center justify-between p-3 rounded-[14px] bg-[#F3F4F8] border-2 border-[#0A0A12]">
                    <div className="flex items-center gap-2.5">
                      <span className="tg bg-[#FFD84D] text-[#0A0A12] w-6 h-6 p-0 text-[11px] font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-[#0A0A12] font-['Space_Grotesk'] capitalize">
                        {sectionNames[secId] || secId.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveSection(secId, 'up')}
                        className="p-1 rounded-[8px] bg-white hover:bg-[#E8ECFF] border-2 border-[#0A0A12] text-[#0A0A12] disabled:opacity-30"
                        title="Move up"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === currentSections.length - 1}
                        onClick={() => handleMoveSection(secId, 'down')}
                        className="p-1 rounded-[8px] bg-white hover:bg-[#E8ECFF] border-2 border-[#0A0A12] text-[#0A0A12] disabled:opacity-30"
                        title="Move down"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setShowRearrangeModal(false)}
              className="pill b1 w-full text-xs font-bold min-h-[44px]"
            >
              Done Arranging
            </button>
          </div>
        </div>
      )}

      {/* Video Player Modal with AI Case Study */}
      {selectedVideo && (
        <VideoModal
          item={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}

      {/* Dynamic Client Pitch Personalization Modal */}
      <PitchModal
        isOpen={isPitchModalOpen}
        onClose={() => setIsPitchModalOpen(false)}
        username={username}
        allItems={portfolio?.items || []}
      />

      {/* ============================================================== */}
      {/* VISIBILITY & PRIVACY MODAL                                     */}
      {/* ============================================================== */}
      {showVisibilityModal && (
        <div className="fixed inset-0 z-50 bg-[#0A0A12]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bx w-full max-w-[500px] p-6 sm:p-8 border-2 border-[#0A0A12] shadow-neo flex flex-col gap-5 bg-white relative animate-fade-in text-left rounded-[28px]">
            <button
              type="button"
              onClick={() => setShowVisibilityModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full border-2 border-[#0A0A12] text-[#0A0A12] hover:bg-[#F3F4F8]"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="tg bg-[#E8ECFF] text-[#2340FF] text-[10px] font-mono font-bold py-0.5 px-2">
                  PRIVACY SETTINGS
                </span>
              </div>
              <h3 className="font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-[#0A0A12]">
                Portfolio Visibility
              </h3>
              <p className="text-xs text-[#55586B] font-['DM_Sans'] mt-0.5">
                Control who can view your portfolio link at <span className="font-mono font-bold text-[#0A0A12]">/u/{username}</span>.
              </p>
            </div>

            {/* 3 Visibility Options */}
            <div className="space-y-3 font-['DM_Sans']">
              {/* Option 1: Public */}
              <div
                onClick={() => setVisibilityChoice('public')}
                className={`bx p-4 rounded-[18px] border-2 cursor-pointer transition-all ${
                  visibilityChoice === 'public'
                    ? 'border-[#0A0A12] bg-[#E8ECFF] shadow-neo-sm'
                    : 'border-[#0A0A12]/20 hover:border-[#0A0A12] bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-[#7CFFB2] border border-[#0A0A12]" />
                    <span className="font-['Space_Grotesk'] font-bold text-sm text-[#0A0A12]">Live &amp; Public</span>
                  </div>
                  <span className="tg bg-white text-[#2340FF] text-[10px] font-mono font-bold py-0.5 px-2">
                    RECOMMENDED
                  </span>
                </div>
                <p className="text-xs text-[#55586B] mt-1.5 ml-5 leading-relaxed">
                  Anyone with your link can view your portfolio in normal or incognito mode. Ideal for job applications, resumes, and client outreach.
                </p>
              </div>

              {/* Option 2: Private (Draft Mode) */}
              <div
                onClick={() => setVisibilityChoice('private')}
                className={`bx p-4 rounded-[18px] border-2 cursor-pointer transition-all ${
                  visibilityChoice === 'private'
                    ? 'border-[#0A0A12] bg-[#EF4444]/10 shadow-neo-sm'
                    : 'border-[#0A0A12]/20 hover:border-[#0A0A12] bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Lock className="w-4 h-4 text-[#EF4444]" />
                    <span className="font-['Space_Grotesk'] font-bold text-sm text-[#0A0A12]">Private (Draft Mode)</span>
                  </div>
                  <span className="tg bg-white text-[#EF4444] text-[10px] font-mono font-bold py-0.5 px-2">
                    ONLY YOU
                  </span>
                </div>
                <p className="text-xs text-[#55586B] mt-1.5 ml-6 leading-relaxed">
                  Completely hidden from external visitors and incognito searches. Strangers are shown the playful 404 Cat Page. You can still preview it while logged in.
                </p>
              </div>

              {/* Option 3: Password / PIN Protected */}
              <div
                onClick={() => setVisibilityChoice('password')}
                className={`bx p-4 rounded-[18px] border-2 cursor-pointer transition-all ${
                  visibilityChoice === 'password'
                    ? 'border-[#0A0A12] bg-[#FFD84D]/20 shadow-neo-sm'
                    : 'border-[#0A0A12]/20 hover:border-[#0A0A12] bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Key className="w-4 h-4 text-[#0A0A12]" />
                    <span className="font-['Space_Grotesk'] font-bold text-sm text-[#0A0A12]">Password / PIN Protected</span>
                  </div>
                  <span className="tg bg-white text-[#0A0A12] text-[10px] font-mono font-bold py-0.5 px-2">
                    CLIENT GATEWAY
                  </span>
                </div>
                <p className="text-xs text-[#55586B] mt-1.5 ml-6 leading-relaxed">
                  Require visitors to enter a secret 4-digit PIN to access your projects and confidential proposals.
                </p>

                {visibilityChoice === 'password' && (
                  <div className="mt-3 ml-6 pt-3 border-t border-[#0A0A12]/15 flex items-center gap-3">
                    <span className="text-xs font-bold text-[#0A0A12]">4-Digit Access PIN:</span>
                    <input
                      type="text"
                      maxLength={6}
                      value={customPin}
                      onChange={(e) => setCustomPin(e.target.value)}
                      placeholder="e.g. 2026"
                      className="in max-w-[120px] text-center font-mono font-bold text-sm min-h-[36px]"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowVisibilityModal(false)}
                className="pill b2 flex-1 text-xs min-h-[42px] font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveVisibility(visibilityChoice, customPin)}
                className="pill b1 flex-1 text-xs min-h-[42px] font-bold shadow-neo-sm hover:translate-x-0.5"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* PUBLISH MODAL (Folio AI v2 Board 5 style)                       */}
      {/* ============================================================== */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 bg-[#0A0A12]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bx w-full max-w-[480px] p-8 border-2 border-[#0A0A12] shadow-neo flex flex-col gap-4 bg-white relative animate-fade-in text-left rounded-[28px]">
            <button
              onClick={() => setShowPublishModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full border-2 border-[#0A0A12] text-[#0A0A12] hover:bg-[#F3F4F8]"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-[#0A0A12]">
              Publish portfolio
            </h3>

            <div className="in font-mono text-sm text-[#2340FF] font-bold">
              https://{username}.folio.ai
            </div>

            <p className="text-xs text-[#55586B] font-['DM_Sans']">
              Custom domain mapping · Fast Edge CDN · Automated SSL
            </p>

            <div className="bg-[#E8ECFF] p-4 rounded-[16px] border-2 border-[#0A0A12] space-y-1.5 font-bold text-xs font-['DM_Sans']">
              <p className="flex items-center gap-2 text-[#0A0A12]">✓ Profile complete</p>
              <p className="flex items-center gap-2 text-[#0A0A12]">✓ Projects imported &amp; verified</p>
              <p className="flex items-center gap-2 text-[#0A0A12]">✓ SEO title and description set</p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowPublishModal(false)}
                className="pill b2 flex-1 text-sm min-h-[44px]"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await fetch('/api/deploy/vercel', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ username })
                    });
                  } catch (e) {}
                  setShowPublishModal(false);
                  setIsPublishedSuccess(true);
                }}
                className="pill b1 flex-1 text-sm min-h-[44px] shadow-neo-sm hover:translate-x-0.5"
              >
                Publish portfolio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* PUBLISH SUCCESS SCREEN (Folio AI v2 celebration)               */}
      {/* ============================================================== */}
      {isPublishedSuccess && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#F3F4F8]/90 backdrop-blur-sm"
        >
          <div className="bx w-full max-w-[520px] p-10 text-center border-2 border-[#0A0A12] shadow-neo flex flex-col items-center gap-5 bg-white animate-fade-in rounded-[28px]">
            <div className="w-16 h-16 rounded-full border-2 border-[#0A0A12] flex items-center justify-center text-[#0A0A12] text-3xl font-bold bg-[#7CFFB2] shadow-neo-sm">
              ✓
            </div>

            <div>
              <h1 className="font-['Space_Grotesk'] text-3xl font-bold tracking-tight text-[#0A0A12]">
                Your portfolio is live
              </h1>
              <p className="text-sm text-[#55586B] mt-1 font-['DM_Sans']">
                Published to the Folio global edge network with instant sync.
              </p>
            </div>

            <div className="in w-full font-mono text-sm text-[#2340FF] font-bold text-center">
              https://{username}.folio.ai
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 w-full font-['DM_Sans']">
              <a
                href={`/u/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="pill b1 flex-1 text-sm min-h-[44px] flex items-center justify-center shadow-neo-sm"
              >
                View live portfolio
              </a>
              <button
                onClick={handleCopySubdomain}
                className="pill b2 flex-1 text-sm min-h-[44px]"
              >
                {copiedUrl ? 'Copied!' : 'Copy link'}
              </button>
            </div>

            <button
              onClick={() => setIsPublishedSuccess(false)}
              className="text-xs text-[#55586B] hover:text-[#0A0A12] font-bold underline pt-2"
            >
              Back to editor
            </button>
          </div>
        </div>
      )}

      {/* Beta Tester Feedback Modal */}
      {showFeedbackModal && (
        <BetaFeedbackModal
          user={user}
          activeTemplate={portfolio?.custom_template || portfolio?.active_theme || 'monolith'}
          onClose={() => setShowFeedbackModal(false)}
        />
      )}

    </div>
  );
}
