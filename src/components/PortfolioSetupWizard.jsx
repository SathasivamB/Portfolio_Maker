import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Check, 
  ArrowRight, 
  Film, 
  Code, 
  Briefcase, 
  Layers, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  MessageSquare, 
  BarChart3, 
  Wrench, 
  Calendar, 
  ShieldCheck, 
  Palette, 
  GripVertical, 
  Type, 
  Sliders, 
  X, 
  Upload, 
  Image as ImageIcon, 
  CheckSquare, 
  Square,
  Terminal,
  Zap,
  Cpu,
  Smartphone,
  Award,
  Globe,
  RefreshCw,
  Eye,
  Star,
  Search,
  Monitor,
  ChevronLeft,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { COLOR_PALETTES } from './themes/UnifiedPortfolioView';
import { GithubIcon, GoogleIcon } from './Icons';
import AgentFolioLogo from './AgentFolioLogo';
import EmptyProjectsState from './EmptyProjectsState';

import { FOLIO_TEMPLATES, POPULAR_CERTIFICATIONS } from "../constants/templates";
export { FOLIO_TEMPLATES, POPULAR_CERTIFICATIONS };

export default function PortfolioSetupWizard({ 
  user, 
  initialTemplateId = 'monolith', 
  initialPreferences = null, 
  onComplete, 
  onClose,
  isFromStudio = false
}) {
  const username = user?.username || 'developer';

  const initialTpl = FOLIO_TEMPLATES.find(t => t.id === initialTemplateId) || FOLIO_TEMPLATES[0];

  const isCodeUser = user?.provider === 'github' || 
    (user?.role && /engineer|software|developer|code/i.test(user.role)) ||
    (user?.username && user.username.toLowerCase() === 'sathasivamb');

  // Step state:
  // Step 1: Template Gallery (matching 04_Template_Gallery.html & 07_Template_Detail.html)
  // Step 2: GitHub AI Generation & Repository Ingestion (matching 02_GitHub_AI_Generation.html)
  // Step 3: Section Hierarchy & Custom Components (matching 16_Editor_Sections.html)
  // Step 4: Dual-Tone Gradient, Typography & Studio Launch (matching 09_Design_System.html)
  const [step, setStep] = useState(1);
  const [selectedTemplateId, setSelectedTemplateId] = useState(initialTemplateId || 'monolith');
  const [templateFilter, setTemplateFilter] = useState('All');
  const [templateSearch, setTemplateSearch] = useState('');
  const [wizardTemplateBatch, setWizardTemplateBatch] = useState(0);
  const [showAllWizardTemplates, setShowAllWizardTemplates] = useState(false);
  const [wizardGridCols, setWizardGridCols] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window === 'undefined') return;
      if (window.innerWidth >= 1024) {
        setWizardGridCols(3);
      } else if (window.innerWidth >= 640) {
        setWizardGridCols(2);
      } else {
        setWizardGridCols(1);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setWizardTemplateBatch(0);
  }, [templateFilter, templateSearch]);
  const [detailPreviewTemplate, setDetailPreviewTemplate] = useState(null);
  const [detailViewport, setDetailViewport] = useState('desktop');
  const [aiGeneratedSuccessModal, setAiGeneratedSuccessModal] = useState(null);

  // Repositories & Ingestion (matching 02_GitHub_AI_Generation.html)
  const [repoList, setRepoList] = useState([
    { id: 'relay', name: 'relay', desc: 'Realtime sync engine with CRDTs.', lang: 'Rust', stars: '1.2k', updated: '3 days ago', selected: true },
    { id: 'lumen', name: 'lumen', desc: 'Design token CLI for teams.', lang: 'TypeScript', stars: '640', updated: 'last week', selected: true },
    { id: 'dotfiles', name: 'dotfiles', desc: 'Personal configuration and shell environment.', lang: 'Shell', stars: '12', updated: 'last month', selected: false },
    { id: 'notes-api', name: 'notes-api', desc: 'Small distributed notes backend in Go.', lang: 'Go', stars: '48', updated: '2 weeks ago', selected: false }
  ]);

  // Dynamically load user's real ingested repositories if available
  useEffect(() => {
    if (user?.username) {
      fetch(`/api/portfolio/${user.username}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.portfolio?.items && data.portfolio.items.length > 0) {
            const mappedRepos = data.portfolio.items.map((it, idx) => ({
              id: it.id || `repo_${idx}`,
              name: it.title || it.name || `project-${idx + 1}`,
              desc: it.description || it.desc || 'Production project repository and source code.',
              lang: it.tag || it.language || 'TypeScript',
              stars: it.metrics?.stars || '★ Active',
              updated: 'Recently updated',
              selected: idx < 4
            }));
            setRepoList(mappedRepos);
          }
        })
        .catch(() => {});
    }
  }, [user?.username]);

  const [repoSearch, setRepoSearch] = useState('');
  const [repoLangFilter, setRepoLangFilter] = useState('All');
  const availableRepoLanguages = ['All', ...Array.from(new Set(repoList.map(r => r.lang).filter(Boolean)))];
  const [repoVisibilityFilter, setRepoVisibilityFilter] = useState('Public');
  const [aiTone, setAiTone] = useState('Professional'); // 'Professional' | 'Creative' | 'Minimal'
  const [isGeneratingPortfolio, setIsGeneratingPortfolio] = useState(false);
  const [genStep, setGenStep] = useState(0); // 0: idle, 1: repos, 2: understand, 3: intro, 4: complete
  
  const [isGeneratingAI, setIsGeneratingAI] = useState(null);
  const [isAssembling, setIsAssembling] = useState(false);
  const [aiSuccessToast, setAiSuccessToast] = useState('');

  // Verified Credentials & Certifications State (LinkedIn / Credly Ingestion)
  const [certificationsList, setCertificationsList] = useState([
    { title: 'CompTIA Security+', org: 'CompTIA', date: 'Sep 2025', icon: '🛡️' },
    { title: 'CompTIA Tech+', org: 'CompTIA', date: 'June 2025', icon: '⚡' },
    { title: 'Oracle Java Architect', org: 'Oracle', date: 'July 2024', icon: '☕' }
  ]);
  const [certUrlInput, setCertUrlInput] = useState('');
  const [isExtractingCerts, setIsExtractingCerts] = useState(false);
  const [certExtractMessage, setCertExtractMessage] = useState('');
  const [customCertInput, setCustomCertInput] = useState({ title: '', org: '', date: '' });

  const handleExtractCredentialsFromUrl = async () => {
    if (!certUrlInput.trim()) return;
    setIsExtractingCerts(true);
    setCertExtractMessage('');
    try {
      const res = await fetch('/api/extract-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: certUrlInput, username })
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.certifications)) {
        setCertificationsList(prev => {
          const titles = new Set(prev.map(c => c.title.toLowerCase()));
          const newOnes = data.certifications.filter(c => !titles.has(c.title.toLowerCase()));
          return [...prev, ...newOnes];
        });
        setCertExtractMessage(`Successfully extracted and verified ${data.certifications.length} credentials!`);
        setCertUrlInput('');
      }
    } catch (err) {
      console.warn("Credential extraction error:", err);
      setCertExtractMessage('Could not connect to service. Added sample credentials.');
    } finally {
      setIsExtractingCerts(false);
    }
  };

  const togglePopularCert = (cert) => {
    setCertificationsList(prev => {
      const exists = prev.some(c => c.title === cert.title);
      if (exists) {
        return prev.filter(c => c.title !== cert.title);
      } else {
        return [...prev, cert];
      }
    });
  };

  const handleRemoveCertification = (index) => {
    setCertificationsList(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleAddCustomCertification = () => {
    if (!customCertInput.title.trim()) return;
    const newCert = {
      title: customCertInput.title.trim(),
      org: customCertInput.org.trim() || 'Verified Issuer',
      date: customCertInput.date.trim() || '2025',
      icon: '🛡️'
    };
    setCertificationsList(prev => [...prev, newCert]);
    setCustomCertInput({ title: '', org: '', date: '' });
  };

  // Creator Discipline
  const [discipline, setDiscipline] = useState(() => isCodeUser ? 'code' : 'video');
  
  // Custom Role & Headline
  const [customRole, setCustomRole] = useState(() => {
    if (initialPreferences?.role) return initialPreferences.role;
    if (initialTpl?.sampleRole) return initialTpl.sampleRole;
    if (user?.role && !user.role.includes('Director')) return user.role;
    return isCodeUser ? 'Polygon Developer & Systems Architect' : (user?.role || 'Senior Freelance Video Director & UI Architect');
  });

  const [headline, setHeadline] = useState(() => {
    if (initialPreferences?.name) {
      return `${initialPreferences.name} • ${initialPreferences.role || 'Full-stack Engineer'}`;
    }
    if (initialTpl?.sampleHeadline) return initialTpl.sampleHeadline;
    const name = user?.name || (isCodeUser ? 'Sathasivam B' : 'Creator');
    return isCodeUser 
      ? `${name} • Freelance Developer & Code Generalist`
      : `${name} • High-Converting Creative Productions`;
  });

  const [bio, setBio] = useState(() => {
    if (initialTpl?.fullDesc) return initialTpl.fullDesc;
    if (user?.bio && !user.bio.includes('cinematic commercial films')) return user.bio;
    return isCodeUser 
      ? 'I architect and implement complex systems in 15+ languages across high-throughput distributed systems, algorithms, and full-stack web applications.'
      : 'Directing cinematic brand films, automated creator portfolios, and high-converting visual systems for global brands.';
  });

  // Custom Hero Profile Picture
  const [customAvatar, setCustomAvatar] = useState(() => user?.avatar || 'https://avatars.githubusercontent.com/u/176063126?v=4');
  const [avatarUploadLoading, setAvatarUploadLoading] = useState(false);

  // Dual-Tone Gradient Mix
  const [topColor, setTopColor] = useState(() => initialPreferences?.accent || initialTpl?.topColor || '#0B1410');
  const [bottomColor, setBottomColor] = useState(() => initialTpl?.bottomColor || '#172720');
  const [palettePresetId, setPalettePresetId] = useState(() => initialTpl?.paletteId || 'monolith-dark');

  // Typography Aesthetic Selection
  const [fontStyle, setFontStyle] = useState(() => initialTpl?.fontStyle || (isCodeUser ? 'mono' : 'sans'));

  // Granular Sub-Component Checklists
  const [subComponents, setSubComponents] = useState({
    navbar_brand_logo: true,
    navbar_nav_links: true,
    navbar_contact_cta: true,
    navbar_status_badge: true,
    hero_headline: true,
    hero_bio: true,
    hero_primary_cta: true,
    hero_terminal_window: true,
    hero_clone_snippet: isCodeUser,
    hero_verified_badge: true,
    platform_github: isCodeUser,
    platform_youtube: !isCodeUser,
    platform_linkedin: true,
    platform_twitter: false
  });

  // Master Ordered Sections with Drag-and-Drop
  const [orderedSections, setOrderedSections] = useState([
    {
      id: 'hero',
      title: 'Developer Hero & Terminal Showcase',
      desc: 'Software headline, verified GitHub status, macOS interactive terminal, and 15+ language badges.',
      icon: Terminal,
      enabled: true
    },
    {
      id: 'skills',
      title: 'Tech Stack & Skills Grid',
      desc: 'Grid of 20+ compact technology cards (TypeScript, Go, Rust, Java, Docker, React) with experience duration.',
      icon: Wrench,
      enabled: true
    },
    {
      id: 'showcase',
      title: 'Featured Code Repositories & Deployments',
      desc: 'Gallery cards with real-time star counters, language tags, live demo buttons, and clone commands.',
      icon: Briefcase,
      enabled: true
    },
    {
      id: 'metrics',
      title: 'Delivery Counters & Repository Stats',
      desc: 'Total repositories (73 repos), core languages (TypeScript, JS, Java), and 100% open source delivery.',
      icon: BarChart3,
      enabled: true
    },
    {
      id: 'case_studies',
      title: 'Technical Architecture Case Studies',
      desc: 'Project architecture writeups detailing System Goals, Technology Stack, and Production Outcomes.',
      icon: Sparkles,
      enabled: true
    },
    {
      id: 'certifications',
      title: 'Verified Certifications & Credentials',
      desc: 'Professional certifications (AWS Certified Solutions Architect, Google Cloud, Meta Specialist).',
      icon: Award,
      enabled: true
    },
    {
      id: 'testimonials',
      title: 'Client Recommendations & Social Proof',
      desc: 'Endorsements from technical co-founders, engineering managers, and enterprise clients.',
      icon: MessageSquare,
      enabled: true
    },
    {
      id: 'pricing',
      title: 'Engineering Retainers & Sprint Packages',
      desc: 'Fixed-price web app sprint packages ($2,500), monthly retainers ($4,800/mo), and advisory ($150/hr).',
      icon: DollarSign,
      enabled: true
    },
    {
      id: 'booking',
      title: 'Let’s Connect & Technical Consultation',
      desc: 'Contact form powered by Resend with direct calendar scheduling for architecture advisory.',
      icon: Calendar,
      enabled: true
    }
  ]);

  // Pricing configuration
  const [pkgPrice1, setPkgPrice1] = useState('$2,500');
  const [pkgPrice2, setPkgPrice2] = useState('$4,800/mo');
  const [pkgPrice3, setPkgPrice3] = useState('$150/hr');

  // Drag and Drop state
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Template Selection handler
  const handleSelectTemplate = (template) => {
    setSelectedTemplateId(template.id);
    setTopColor(template.topColor);
    setBottomColor(template.bottomColor);
    setFontStyle(template.fontStyle);
    setPalettePresetId(template.paletteId);
    setCustomRole(template.sampleRole);
    setHeadline(template.sampleHeadline);
    setBio(template.fullDesc);
    setStep(2);
  };

  // 1-Click AI Template Generator (Powered by Gemini)
  const handleSelectAndGenerateTemplate = async (template, instantLaunch = false) => {
    setSelectedTemplateId(template.id);
    setTopColor(template.topColor);
    setBottomColor(template.bottomColor);
    setFontStyle(template.fontStyle);
    setPalettePresetId(template.paletteId);
    setIsGeneratingAI(template.id);

    try {
      const res = await fetch('/api/ai/generate-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: template.id,
          templateName: template.name,
          username
        })
      });

      const data = await res.json();
      if (data.success && data.blueprint) {
        const bp = data.blueprint;
        bp.templateId = template.id;
        bp.templateName = template.name;
        if (bp.role) setCustomRole(bp.role);
        if (bp.headline) setHeadline(bp.headline);
        if (bp.bio) setBio(bp.bio);
        if (bp.pricing_sprint) setPkgPrice1(bp.pricing_sprint);
        if (bp.pricing_packages?.[1]?.price) setPkgPrice2(bp.pricing_packages[1].price);
        if (bp.pricing_packages?.[2]?.price) setPkgPrice3(bp.pricing_packages[2].price);
        if (bp.palette?.topColor) setTopColor(bp.palette.topColor);
        if (bp.palette?.bottomColor) setBottomColor(bp.palette.bottomColor);
        if (bp.font_style) setFontStyle(bp.font_style);
        if (bp.palette?.id) setPalettePresetId(bp.palette.id);

        if (bp.sub_components) {
          setSubComponents(prev => ({ ...prev, ...bp.sub_components }));
        }

        if (Array.isArray(bp.selected_sections)) {
          setOrderedSections(prev => {
            const mapped = [...prev];
            return mapped.sort((a, b) => {
              const idxA = bp.selected_sections.indexOf(a.id);
              const idxB = bp.selected_sections.indexOf(b.id);
              if (idxA !== -1 && idxB !== -1) return idxA - idxB;
              if (idxA !== -1) return -1;
              if (idxB !== -1) return 1;
              return 0;
            }).map(s => ({
              ...s,
              enabled: bp.selected_sections.includes(s.id)
            }));
          });
        }

        setAiSuccessToast(`✨ Gemini synthesized bespoke ${template.name} architecture!`);
        setTimeout(() => setAiSuccessToast(''), 4500);

        if (instantLaunch) {
          await handleLaunch(bp);
          return;
        }

        setAiGeneratedSuccessModal({
          template,
          blueprint: bp
        });
      }
    } catch (err) {
      setCustomRole(template.sampleRole);
      setHeadline(template.sampleHeadline);
      setBio(template.fullDesc);
    } finally {
      setIsGeneratingAI(null);
    }
  };

  // AI Bio Polisher (Gemini)
  const handleEnhanceBioWithAI = async () => {
    setIsGeneratingAI('bio_rewrite');
    try {
      const res = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Rewrite this developer bio to be punchy, elite, recruiter-focused, and 2 sentences max:\n"${bio}"`,
          context: { role: customRole, headline }
        })
      });
      const data = await res.json();
      if (data.success && data.response) {
        const clean = data.response.replace(/^["']|["']$/g, '').trim();
        setBio(clean);
        setAiSuccessToast('✨ Bio enhanced with Gemini AI!');
        setTimeout(() => setAiSuccessToast(''), 4000);
      }
    } catch (err) {
      console.warn("Bio rewrite error:", err);
    } finally {
      setIsGeneratingAI(null);
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const reordered = [...orderedSections];
    const draggedItem = reordered[draggedIndex];
    reordered.splice(draggedIndex, 1);
    reordered.splice(index, 0, draggedItem);
    setDraggedIndex(index);
    setOrderedSections(reordered);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const toggleRepoSelection = (id) => {
    setRepoList(prev => prev.map(r => r.id === id ? { ...r, selected: !r.selected } : r));
  };

  const handleGeneratePortfolio = async () => {
    setIsGeneratingPortfolio(true);
    setGenStep(1);

    setTimeout(() => setGenStep(2), 500);
    setTimeout(() => setGenStep(3), 1100);

    try {
      const selectedNames = repoList.filter(r => r.selected).map(r => r.name);
      const res = await fetch('/api/ai/bio-rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: customRole,
          currentBio: bio,
          discipline,
          tone: aiTone.toLowerCase(),
          projects: selectedNames
        })
      });
      const data = await res.json();
      if (data.success && data.enhancedBio) {
        setBio(data.enhancedBio);
      }
    } catch {
      // safe fallback
    }

    setTimeout(() => {
      setGenStep(4);
      setIsGeneratingPortfolio(false);
      setAiSuccessToast(`✨ Portfolio drafted with ${aiTone} tone for ${user?.name || 'Alex Morgan'}!`);
      setTimeout(() => setAiSuccessToast(''), 4000);
      setStep(3); // advance to Sections step
    }, 1900);
  };

  const toggleSection = (id) => {
    setOrderedSections(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const toggleSubComponent = (key) => {
    setSubComponents(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const applySmartDefaults = () => {
    setOrderedSections([
      { id: 'hero', enabled: true },
      { id: 'skills', enabled: true },
      { id: 'showcase', enabled: true },
      { id: 'metrics', enabled: true },
      { id: 'case_studies', enabled: true },
      { id: 'certifications', enabled: true },
      { id: 'testimonials', enabled: true },
      { id: 'pricing', enabled: true },
      { id: 'booking', enabled: true }
    ].map(def => {
      const existing = orderedSections.find(s => s.id === def.id);
      return existing ? { ...existing, enabled: def.enabled } : def;
    }));
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WebP).');
      return;
    }

    setAvatarUploadLoading(true);
    const reader = new FileReader();
    reader.onload = () => {
      setCustomAvatar(reader.result);
      setAvatarUploadLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleLaunch = async (overrideConfig = null) => {
    setIsAssembling(true);

    const selectedKeys = overrideConfig?.selected_sections || orderedSections
      .filter(sec => sec.enabled)
      .map(sec => sec.id);

    const pricingPackages = overrideConfig?.pricing_packages || [
      { id: 'pkg_1', title: 'Full-Stack Web App Sprint', price: pkgPrice1 || '$2,500', turnaround: '5 Days', deliverables: 'Production Web App, Responsive UI, REST APIs, CI/CD Deployment' },
      { id: 'pkg_2', title: 'Dedicated Engineering Retainer', price: pkgPrice2 || '$4,800/mo', turnaround: 'Ongoing', deliverables: 'Dedicated Weekly Bandwidth, Feature Development & Code Reviews' },
      { id: 'pkg_3', title: 'System Architecture Advisory', price: pkgPrice3 || '$150/hr', turnaround: 'Immediate', deliverables: 'Architecture Audit, Scalability Review & Technical Roadmap' }
    ];

    const developerTools = overrideConfig?.tools_arsenal || [
      { name: 'TypeScript', category: 'Typed Web Architectures', icon: '⚡' },
      { name: 'JavaScript & React', category: 'Reactive Frontend Engineering', icon: '⚛️' },
      { name: 'Java & Spring', category: 'Distributed Backend Systems', icon: '☕' },
      { name: 'Node.js & Express', category: 'High-Scale REST APIs', icon: '🚀' },
      { name: 'Git & GitHub Actions', category: 'CI/CD & DevOps Automation', icon: '🐙' },
      { name: 'HTML5 & Modern CSS', category: 'Responsive Interface Design', icon: '🌐' }
    ];

    const developerMetrics = overrideConfig?.metrics || [
      { label: 'Total Repositories', value: '73 Repos', change: 'Verified on GitHub' },
      { label: 'Core Tech Stack', value: 'TypeScript, JS, Java', change: 'Primary Languages' },
      { label: 'Open Source Delivery', value: '100%', change: 'Production Quality' },
      { label: 'Engineering Architecture', value: 'High Scale', change: 'Clean Code & CI/CD' }
    ];

    const chosenTemplateId = overrideConfig?.templateId || overrideConfig?.custom_template || selectedTemplateId || 'monolith';
    const chosenTopColor = overrideConfig?.palette?.topColor || topColor;
    const chosenBottomColor = overrideConfig?.palette?.bottomColor || bottomColor;
    const chosenPaletteId = overrideConfig?.palette?.id || palettePresetId || 'custom-gradient';

    const dualTonePalette = {
      id: chosenPaletteId,
      name: 'Figma Dual-Tone Palette',
      primary: '#14201A',
      accent: chosenTopColor,
      topColor: chosenTopColor,
      bottomColor: chosenBottomColor,
      bg: '#F4F6F1',
      surface: '#EAEFE6',
      card: '#FFFFFF',
      border: '#D3DBCC',
      custom: true
    };

    const config = {
      name: user?.name || user?.username || 'Developer',
      role: overrideConfig?.role || customRole,
      title: overrideConfig?.headline || headline,
      bio: overrideConfig?.bio || bio,
      avatar: customAvatar,
      active_theme: chosenPaletteId,
      custom_template: chosenTemplateId,
      template: chosenTemplateId,
      palette: dualTonePalette,
      font_style: overrideConfig?.font_style || fontStyle,
      selected_sections: selectedKeys,
      sub_components: overrideConfig?.sub_components || subComponents,
      pricing_packages: pricingPackages,
      tools_arsenal: developerTools,
      metrics: developerMetrics,
      certifications: certificationsList,
      trigger: `Figma Template AI Generation: ${overrideConfig?.templateName || selectedTemplateId}`
    };

    try {
      const res = await fetch('/api/portfolio/custom-setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          config
        })
      });

      const data = await res.json();
      if (data.success && onComplete) {
        onComplete(data.user, data.portfolio);
      }
    } catch (err) {
      console.warn("Portfolio setup warning:", err);
      if (onComplete) onComplete(user, null);
    } finally {
      setIsAssembling(false);
    }
  };

  // Filter templates
  const filteredTemplates = FOLIO_TEMPLATES.filter(tmpl => {
    const matchesFilter = templateFilter === 'All' || tmpl.category.toLowerCase() === templateFilter.toLowerCase();
    const matchesSearch = !templateSearch.trim() || 
      tmpl.name.toLowerCase().includes(templateSearch.toLowerCase()) ||
      tmpl.desc.toLowerCase().includes(templateSearch.toLowerCase()) ||
      tmpl.category.toLowerCase().includes(templateSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0A12]/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto font-sans text-[#0A0A12]">
      <div className="w-full max-w-6xl rounded-[20px] sm:rounded-[24px] bg-[#F3F4F8] border-2 border-[#0A0A12] shadow-neo overflow-hidden my-auto animate-fade-in flex flex-col max-h-[96vh] sm:max-h-[92vh]">
        
        {/* Top Header Bar (Matching Folio AI v2) */}
        <div className="px-3 sm:px-6 py-3 sm:py-4 border-b-2 border-[#0A0A12] bg-[#FFFFFF] flex items-center justify-between gap-2 sm:gap-3 flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="lg text-lg sm:text-2xl flex-shrink-0"><i></i><span className="hidden xs:inline">folio</span></div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-[#0A0A12] tracking-tight flex items-center gap-1.5 sm:gap-2 font-space truncate">
                <span className="truncate">Setup Blueprint</span>
                <span className="tg bg-[#FFD84D] text-[10px] py-0 px-1.5 flex-shrink-0">
                  Step {step} of 4
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-[#55586B] mt-0.5 font-mono truncate hidden sm:block">
                {step === 1 && 'Find your portfolio style. Six distinct starting points. Switch any time.'}
                {step === 2 && 'Connect GitHub, choose public repositories, and let AI synthesize your work.'}
                {step === 3 && 'Reorder sections and customize components for your portfolio.'}
                {step === 4 && 'Accent colors, typography, profile details & live preview.'}
              </p>
            </div>
          </div>

          {/* Stepper Nav & Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {/* Desktop Step Pills */}
            <div className="hidden md:flex items-center gap-1.5 text-xs font-mono">
              <button
                type="button"
                onClick={() => setStep(1)}
                className={`pill text-xs min-h-[36px] px-3 font-bold ${
                  step === 1 ? 'b1' : 'b2'
                }`}
              >
                1. Templates
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                className={`pill text-xs min-h-[36px] px-3 font-bold ${
                  step === 2 ? 'b1' : 'b2'
                }`}
              >
                2. GitHub &amp; AI
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className={`pill text-xs min-h-[36px] px-3 font-bold ${
                  step === 3 ? 'b1' : 'b2'
                }`}
              >
                3. Sections
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className={`pill text-xs min-h-[36px] px-3 font-bold ${
                  step === 4 ? 'b1' : 'b2'
                }`}
              >
                4. Style &amp; Review
              </button>
            </div>

            {/* Mobile Step Indicators [1] [2] [3] [4] */}
            <div className="flex md:hidden items-center gap-1 font-mono text-xs">
              {[1, 2, 3, 4].map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStep(s)}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-[#0A0A12] flex items-center justify-center font-bold text-xs transition-transform ${
                    step === s ? 'bg-[#2340FF] text-white shadow-neo-sm scale-105' : 'bg-white text-[#0A0A12] hover:bg-[#F3F4F8]'
                  }`}
                  title={`Jump to step ${s}`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {!isFromStudio && (
                <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-[#FFD84D] text-[#0A0A12] border border-[#0A0A12] shadow-neo-sm">
                  Compulsory Setup
                </span>
              )}

              {onClose && (
                <button 
                  type="button"
                  onClick={onClose}
                  className="pill b2 min-h-[32px] sm:min-h-[36px] px-2 sm:px-2.5 hover:bg-[#FEE2E2] hover:text-[#DC2626] transition-colors shadow-neo-sm hover:translate-x-0.5"
                  title={isFromStudio ? "Close Blueprint Setup" : "Exit to Homepage (Setup required to access Studio)"}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* AI Success Flash Alert */}
        {aiSuccessToast && (
          <div className="bg-[#FFD84D] border-b-2 border-[#0A0A12] px-6 py-2.5 text-xs font-mono font-bold text-[#0A0A12] flex items-center gap-2 animate-fadeIn">
            <Sparkles className="w-4 h-4 text-[#0A0A12] flex-shrink-0 animate-spin" />
            <span>{aiSuccessToast}</span>
          </div>
        )}

        {/* ============================================================== */}
        {/* SCROLLABLE BODY                                                */}
        {/* ============================================================== */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-left">
          
          {/* ============================================================ */}
          {/* STEP 1: AUTHENTIC TEMPLATE GALLERY (Board 4)                 */}
          {/* ============================================================ */}
          {step === 1 && (
            <div className="space-y-6">
              
              {/* Header Title & Subtitle */}
              <div className="space-y-1">
                <h1 className="font-['Space_Grotesk'] text-3xl sm:text-4xl font-bold tracking-tight text-[#0A0A12]">
                  Find your portfolio style
                </h1>
                <p className="text-sm text-[#55586B]">
                  Six distinct starting points. Switch any time.
                </p>
              </div>

              {/* Search & Filter Bar with Expanded Figma Categories */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-[#55586B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search 12 Figma templates..."
                    value={templateSearch}
                    onChange={(e) => setTemplateSearch(e.target.value)}
                    className="in pl-9 pr-3 py-1.5 text-xs min-h-[42px] w-full text-[#0A0A12]"
                  />
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none sm:flex-wrap flex-1">
                  {['All', 'Developer', 'Designer', 'Minimal', 'Creative', 'Professional', 'AI/ML', 'Mobile'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setTemplateFilter(cat)}
                      className={`pill text-xs min-h-[36px] sm:min-h-[38px] px-3 sm:px-3.5 whitespace-nowrap cursor-pointer transition-all flex-shrink-0 ${
                        templateFilter === cat
                          ? 'b1 shadow-neo-sm'
                          : 'b2 hover:bg-[#F3F4F8]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="ml-auto hidden xl:block flex-shrink-0">
                  <div className="in text-xs py-1.5 px-3 min-h-[42px] flex items-center font-mono text-[#55586B]">
                    ⚡ Figma Community · 12 Verified
                  </div>
                </div>
              </div>

              {/* Dynamic 2-Row Template Cards Grid */}
              {(() => {
                const wizardItemsPerTwoRows = wizardGridCols * 2;
                const wizardTotalBatches = Math.max(1, Math.ceil(filteredTemplates.length / wizardItemsPerTwoRows));
                const wizardBatchSafe = Math.min(wizardTemplateBatch, wizardTotalBatches - 1);
                const visibleWizardTemplates = showAllWizardTemplates
                  ? filteredTemplates
                  : filteredTemplates.slice(wizardBatchSafe * wizardItemsPerTwoRows, wizardBatchSafe * wizardItemsPerTwoRows + wizardItemsPerTwoRows);

                const wizardStartItem = wizardBatchSafe * wizardItemsPerTwoRows + 1;
                const wizardEndItem = Math.min((wizardBatchSafe + 1) * wizardItemsPerTwoRows, filteredTemplates.length);
                const wizardTotalRows = Math.ceil(filteredTemplates.length / wizardGridCols);
                const wizardStartRow = wizardBatchSafe * 2 + 1;
                const wizardEndRow = Math.min((wizardBatchSafe + 1) * 2, wizardTotalRows);

                const handleWizardNext = () => {
                  if (wizardBatchSafe < wizardTotalBatches - 1) {
                    setWizardTemplateBatch(b => b + 1);
                  } else {
                    setWizardTemplateBatch(0);
                  }
                };

                const handleWizardPrev = () => {
                  setWizardTemplateBatch(b => Math.max(0, b - 1));
                };

                return (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 items-stretch">
                      {visibleWizardTemplates.map((tmpl) => {
                  const isSelected = selectedTemplateId === tmpl.id;
                  const isGeneratingThis = isGeneratingAI === tmpl.id;

                  return (
                    <div
                      key={tmpl.id}
                      className={`bx p-4 transition-all flex flex-col justify-between group relative bg-white ${
                        isSelected 
                          ? 'border-2 border-[#2340FF] shadow-neo ring-2 ring-[#2340FF]/30' 
                          : 'border-2 border-[#0A0A12] shadow-neo hover:-translate-y-0.5'
                      }`}
                    >
                      {/* Top Visual Preview Banner tailored to each Archetype */}
                      <div 
                        className="h-[185px] rounded-[16px] overflow-hidden p-4 flex flex-col justify-between select-none border-2 border-[#0A0A12] shadow-sm relative"
                        style={
                          tmpl.id === 'monolith' ? { background: '#0A0A12', color: '#FFFFFF' } :
                          tmpl.id === 'mono' ? { background: '#FFFFFF', color: '#0A0A12' } :
                          tmpl.id === 'prism' ? { background: '#2340FF', color: '#FFD84D' } :
                          tmpl.id === 'editorial' ? { background: '#F5F1E8', color: '#0A0A12' } :
                          tmpl.id === 'terminal' ? { background: '#000000', color: '#7CFFB2' } :
                          tmpl.id === 'canvas' ? { background: '#E8ECFF', color: '#0A0A12' } :
                          tmpl.id === 'neural' ? { background: '#0A0A12', color: '#7CFFB2' } :
                          tmpl.id === 'fintech' ? { background: '#0A0A12', color: '#FFD84D' } :
                          tmpl.id === 'mobile' ? { background: '#0A0A12', color: '#FFFFFF' } :
                          tmpl.id === 'founder' ? { background: '#FFD84D', color: '#0A0A12' } :
                          tmpl.id === 'cloud' ? { background: '#0A0A12', color: '#2340FF' } :
                          { background: '#0A0A12', color: '#7CFFB2' }
                        }
                      >
                        {/* Figma Community Badge Chip */}
                        <div className="flex items-center justify-between">
                          <span className="tg text-[9px] px-2 py-0.5 bg-white/90 text-[#0A0A12] font-bold shadow-sm">
                            {tmpl.badge}
                          </span>
                          <span className="tg text-[9px] px-2 py-0.5 bg-[#7CFFB2] text-[#0A0A12] font-bold">
                            {tmpl.tier === 'Premium' ? '★ Pro Archetype' : '✦ Core Archetype'} · Unlocked
                          </span>
                        </div>

                        {/* Archetype Specific Preview Content */}
                        {tmpl.id === 'monolith' && (
                          <div className="flex flex-col justify-between font-['Space_Grotesk']">
                            <span className="text-xl font-bold leading-tight">Monolith · Systems</span>
                            <div className="p-2 rounded-[10px] bg-white/10 border border-white/20 text-xs mt-2">
                              <div className="font-bold text-white flex items-center justify-between">
                                <span>Relay Engine</span>
                                <span className="tg text-[9px] bg-[#7CFFB2] text-[#0A0A12]">Rust</span>
                              </div>
                              <span className="text-[10px] text-white/70 font-mono">45k QPS · sub-5ms</span>
                            </div>
                          </div>
                        )}

                        {tmpl.id === 'prism' && (
                          <div className="flex flex-col justify-between font-['Space_Grotesk']">
                            <span className="text-xl font-bold text-[#FFD84D]">Prism Electric</span>
                            <div className="p-2 rounded-[10px] bg-white/15 border border-white/20 text-xs text-white mt-2">
                              <div className="font-bold flex items-center justify-between">
                                <span>Reactive SaaS Studio</span>
                                <span className="tg text-[9px] bg-[#FFD84D] text-[#0A0A12]">React</span>
                              </div>
                              <span className="text-[10px] text-white/80 font-mono">Neo-Brutalist Layout</span>
                            </div>
                          </div>
                        )}

                        {tmpl.id === 'mono' && (
                          <div className="flex flex-col justify-between font-mono">
                            <span className="text-base font-bold text-[#0A0A12]">Mono — type first.</span>
                            <div className="p-2 rounded-[10px] bg-[#F3F4F8] border border-[#0A0A12] text-xs mt-2">
                              <div className="text-[11px]">&gt; alex.dev --strict</div>
                              <span className="text-[10px] text-[#55586B]">Compiler &amp; AST Engine</span>
                            </div>
                          </div>
                        )}

                        {tmpl.id === 'editorial' && (
                          <div className="flex flex-col justify-between font-serif">
                            <span className="text-xl font-bold italic text-[#0A0A12]">Editorial Luxury</span>
                            <div className="p-2 rounded bg-white/80 border border-[#0A0A12] text-xs font-['DM_Sans'] mt-2">
                              <div className="font-bold text-[#8C4320]">Fractional CTO Retainers</div>
                              <span className="text-[10px] text-[#55586B]">$42M VC Advised</span>
                            </div>
                          </div>
                        )}

                        {tmpl.id === 'terminal' && (
                          <div className="flex flex-col justify-between font-mono text-[#7CFFB2]">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                              <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                              <span className="w-2 h-2 rounded-full bg-[#7CFFB2]" />
                              <span className="text-[10px] text-white/70 ml-1">bash terminal</span>
                            </div>
                            <div className="text-[11px] font-bold mt-2">
                              &gt; 73 verified repos<br />
                              &gt; gpg --verify status: OK
                            </div>
                          </div>
                        )}

                        {tmpl.id === 'canvas' && (
                          <div className="flex flex-col justify-between font-['Space_Grotesk'] text-[#0A0A12]">
                            <span className="text-xl font-bold">Canvas Systems</span>
                            <div className="p-2 rounded-[10px] bg-white border border-[#0A0A12] text-xs mt-2">
                              <div className="font-bold flex items-center justify-between">
                                <span>250+ Figma Components</span>
                                <span className="tg text-[9px] bg-[#2340FF] text-white">Tokens</span>
                              </div>
                              <span className="text-[10px] text-[#55586B]">Auto Layout 5.0</span>
                            </div>
                          </div>
                        )}

                        {tmpl.id === 'neural' && (
                          <div className="flex flex-col justify-between font-mono text-[#7CFFB2]">
                            <span className="text-lg font-bold font-['Space_Grotesk'] text-white">Neural AI Engine</span>
                            <div className="p-2 rounded-[10px] bg-white/10 border border-[#7CFFB2]/30 text-xs mt-2">
                              <div className="font-bold text-white flex items-center justify-between">
                                <span>vLLM Distributed</span>
                                <span className="tg text-[9px] bg-[#7CFFB2] text-[#0A0A12]">CUDA</span>
                              </div>
                              <span className="text-[10px] text-[#7CFFB2]">45M Tokens/sec · PyTorch</span>
                            </div>
                          </div>
                        )}

                        {tmpl.id === 'fintech' && (
                          <div className="flex flex-col justify-between font-mono text-[#FFD84D]">
                            <span className="text-lg font-bold font-['Space_Grotesk'] text-white">FinTech High-Frequency</span>
                            <div className="p-2 rounded-[10px] bg-white/10 border border-white/20 text-xs mt-2">
                              <div className="font-bold text-white flex items-center justify-between">
                                <span>Matching Engine</span>
                                <span className="tg text-[9px] bg-[#FFD84D] text-[#0A0A12]">C++20</span>
                              </div>
                              <span className="text-[10px] text-[#FFD84D]">sub-800ns Order Execution</span>
                            </div>
                          </div>
                        )}

                        {tmpl.id === 'mobile' && (
                          <div className="flex flex-col justify-between font-['Space_Grotesk'] text-white">
                            <span className="text-lg font-bold">Native iOS Craft</span>
                            <div className="p-2 rounded-[10px] bg-white/10 border border-white/20 text-xs mt-2">
                              <div className="font-bold flex items-center justify-between">
                                <span>SwiftUI · 120Hz</span>
                                <span className="tg text-[9px] bg-[#FFD84D] text-[#0A0A12]">Swift 6</span>
                              </div>
                              <span className="text-[10px] text-white/70">4.9★ App Store Rating</span>
                            </div>
                          </div>
                        )}

                        {tmpl.id === 'founder' && (
                          <div className="flex flex-col justify-between font-['Space_Grotesk'] text-[#0A0A12]">
                            <span className="text-xl font-bold">Founder Mode MVP</span>
                            <div className="p-2 rounded-[10px] bg-white border border-[#0A0A12] text-xs mt-2">
                              <div className="font-bold flex items-center justify-between">
                                <span>7-Day MVP Delivery</span>
                                <span className="tg text-[9px] bg-[#FFD84D] text-[#0A0A12]">Fast</span>
                              </div>
                              <span className="text-[10px] text-[#55586B]">$28k MRR Bootstrapped</span>
                            </div>
                          </div>
                        )}

                        {tmpl.id === 'cloud' && (
                          <div className="flex flex-col justify-between font-mono text-white">
                            <span className="text-lg font-bold font-['Space_Grotesk']">DevOps &amp; Cloud SRE</span>
                            <div className="p-2 rounded-[10px] bg-white/10 border border-white/20 text-xs mt-2">
                              <div className="font-bold flex items-center justify-between">
                                <span>Kubernetes GitOps</span>
                                <span className="tg text-[9px] bg-[#2340FF] text-white">Terraform</span>
                              </div>
                              <span className="text-[10px] text-[#7CFFB2]">99.999% SLA Uptime</span>
                            </div>
                          </div>
                        )}

                        {tmpl.id === 'spatial' && (
                          <div className="flex flex-col justify-between font-['Space_Grotesk'] text-white">
                            <span className="text-lg font-bold text-[#7CFFB2]">3D Spatial Interactive</span>
                            <div className="p-2 rounded-[10px] bg-white/10 border border-[#7CFFB2]/30 text-xs mt-2">
                              <div className="font-bold flex items-center justify-between">
                                <span>Three.js Shaders</span>
                                <span className="tg text-[9px] bg-[#7CFFB2] text-[#0A0A12]">WebGL</span>
                              </div>
                              <span className="text-[10px] text-white/70 font-mono">60fps GPU Acceleration</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Header Title + Category Badge */}
                      <div className="flex items-center justify-between mt-3 mb-1">
                        <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#0A0A12] truncate">
                          {tmpl.name}
                        </h3>
                        <span className="tg text-xs flex-shrink-0">
                          {tmpl.category}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-[#55586B] leading-relaxed line-clamp-2 mb-2 font-['DM_Sans']">
                        {tmpl.desc}
                      </p>

                      {/* Figma Spec Tag */}
                      <div className="mb-3">
                        <span className="text-[10px] text-[#2340FF] font-mono font-bold block truncate bg-[#E8ECFF] px-2 py-0.5 rounded-[6px] border border-[#2340FF]/20">
                          {tmpl.figmaSpec}
                        </span>
                      </div>

                      {/* Dual Action Buttons: 1-Click AI Generate + Preview Spec */}
                      <div className="flex items-center gap-2 pt-2 border-t border-[#0A0A12]/15">
                        <button
                          type="button"
                          onClick={() => setDetailPreviewTemplate(tmpl)}
                          className="pill b2 px-3 text-xs py-1.5 min-h-[38px] flex items-center justify-center gap-1"
                          title="Inspect Figma design tokens & viewport"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Spec</span>
                        </button>
                        
                        <button
                          type="button"
                          disabled={isGeneratingThis}
                          onClick={() => handleSelectAndGenerateTemplate(tmpl, false)}
                          className="pill by flex-1 text-xs py-1.5 min-h-[38px] font-bold shadow-neo-sm flex items-center justify-center gap-1.5 hover:bg-[#ffe373] hover:translate-x-0.5 transition-all disabled:opacity-50"
                          title="Generate website according to this Figma template"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#0A0A12]" />
                          <span>{isGeneratingThis ? 'Synthesizing...' : '⚡ AI Generate'}</span>
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Step 1 Responsive 2-Row Show More Control Bar */}
              <div className="pt-3 pb-1 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#0A0A12]/15">
                <div className="flex items-center gap-2">
                  <span className="tg bg-white text-[#0A0A12] border border-[#0A0A12]/20 font-bold text-xs shadow-sm">
                    {showAllWizardTemplates 
                      ? `Showing all ${filteredTemplates.length} templates (${wizardTotalRows} rows)`
                      : `Showing Rows ${wizardStartRow}–${wizardEndRow} (${wizardStartItem}–${wizardEndItem} of ${filteredTemplates.length} styles)`
                    }
                  </span>
                  <span className="text-[10px] text-[#55586B] font-mono hidden sm:inline">
                    • 2 rows visible
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap justify-center">
                  {!showAllWizardTemplates && wizardBatchSafe > 0 && (
                    <button
                      type="button"
                      onClick={handleWizardPrev}
                      className="pill b2 text-xs min-h-[36px] px-3 font-bold flex items-center gap-1 hover:shadow-neo-sm"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Prev 2 rows</span>
                    </button>
                  )}

                  {!showAllWizardTemplates && wizardTotalBatches > 1 && Array.from({ length: wizardTotalBatches }).map((_, idx) => {
                    const isCurrent = idx === wizardBatchSafe;
                    const sRow = idx * 2 + 1;
                    const eRow = Math.min((idx + 1) * 2, wizardTotalRows);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setWizardTemplateBatch(idx)}
                        className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold border-2 transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-[#FFD84D] text-[#0A0A12] border-[#0A0A12] shadow-neo-sm scale-105'
                            : 'bg-white text-[#55586B] border-[#0A0A12]/30 hover:border-[#0A0A12] hover:text-[#0A0A12]'
                        }`}
                      >
                        Rows {sRow}–{eRow}
                      </button>
                    );
                  })}

                  {!showAllWizardTemplates && wizardTotalBatches > 1 && (
                    <button
                      type="button"
                      onClick={handleWizardNext}
                      className="pill b1 text-xs min-h-[36px] px-3.5 font-bold flex items-center gap-1 shadow-neo-sm hover:translate-x-0.5"
                    >
                      <span>{wizardBatchSafe < wizardTotalBatches - 1 ? 'Show more (Next 2 rows)' : '↺ First 2 rows'}</span>
                      {wizardBatchSafe < wizardTotalBatches - 1 ? (
                        <ChevronRight className="w-3.5 h-3.5" />
                      ) : (
                        <RotateCcw className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowAllWizardTemplates(!showAllWizardTemplates)}
                    className="pill b2 text-xs min-h-[36px] px-2.5 font-bold border-dashed border-[#0A0A12]/40"
                  >
                    {showAllWizardTemplates ? 'Show 2 Rows' : 'View All'}
                  </button>
                </div>
              </div>
            </>
          );
        })()}

              {/* Bottom Next Step Bar */}
              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-[#0A0A12]/15">
                <span className="text-xs text-[#55586B] font-['DM_Sans'] text-center sm:text-left">
                  Current Selected Template: <strong className="text-[#2340FF] font-bold">{FOLIO_TEMPLATES.find(t => t.id === selectedTemplateId)?.name}</strong>
                </span>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="pill b1 px-6 py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-neo min-h-[44px] hover:translate-x-0.5"
                >
                  <span>Next: Import &amp; AI Generate</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 2: GITHUB AI GENERATION (Board 2)                       */}
          {/* ============================================================ */}
          {step === 2 && (
            <div className="space-y-6">
              
              {/* Headline Banner */}
              <div className="space-y-1">
                <h1 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold tracking-tight text-[#0A0A12]">
                  Let’s turn your work into your portfolio.
                </h1>
                <p className="text-xs sm:text-sm text-[#55586B] leading-relaxed max-w-2xl font-['DM_Sans']">
                  AI reads your repository descriptions, languages and READMEs. You choose which projects are included, and nothing else is touched.
                </p>
              </div>

              {/* GitHub Connected Card (Matching Board 2 line 136) */}
              <div className="bx p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border-2 border-[#0A0A12] shadow-neo">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-[14px] bg-[#2340FF] text-white border-2 border-[#0A0A12] flex items-center justify-center flex-shrink-0 shadow-neo-sm">
                    <GithubIcon className="w-6 h-6 fill-current" />
                  </div>
                  <div>
                    <h3 className="font-['Space_Grotesk'] font-bold text-base sm:text-lg text-[#0A0A12]">
                      GitHub connected (@{username})
                    </h3>
                    <p className="text-xs text-[#55586B] mt-0.5 font-['DM_Sans']">
                      Read-only access to public repositories. Secure, verified session.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button type="button" className="pill by text-xs min-h-[38px] px-4 font-bold shadow-neo-sm cursor-default">
                    Connected ✓
                  </button>
                </div>
              </div>

              {/* Search & Filters Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 font-['DM_Sans'] text-xs">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#55586B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={repoSearch}
                    onChange={(e) => setRepoSearch(e.target.value)}
                    placeholder="Search repositories..."
                    className="in w-full pl-9 text-xs text-[#0A0A12] min-h-[42px]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={repoLangFilter}
                    onChange={(e) => setRepoLangFilter(e.target.value)}
                    className="in text-xs text-[#0A0A12] font-mono cursor-pointer min-h-[42px]"
                  >
                    {availableRepoLanguages.map(lang => (
                      <option key={lang} value={lang}>
                        Language: {lang}
                      </option>
                    ))}
                  </select>

                  <select
                    value={repoVisibilityFilter}
                    onChange={(e) => setRepoVisibilityFilter(e.target.value)}
                    className="in text-xs text-[#0A0A12] font-mono cursor-pointer min-h-[42px]"
                  >
                    <option value="Public">Visibility: Public</option>
                    <option value="All">Visibility: All</option>
                  </select>
                </div>
              </div>

              {/* 2-Column Repository Selection Cards (Board 2 line 138) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(() => {
                  const filtered = repoList.filter(r => {
                    if (repoLangFilter !== 'All' && r.lang !== repoLangFilter) return false;
                    if (repoSearch && !r.name.toLowerCase().includes(repoSearch.toLowerCase()) && !r.desc.toLowerCase().includes(repoSearch.toLowerCase())) return false;
                    return true;
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className="col-span-full">
                        <EmptyProjectsState
                          searchQuery={repoSearch}
                          onResetFilter={() => {
                            setRepoSearch('');
                            setRepoLangFilter('All');
                          }}
                        />
                      </div>
                    );
                  }

                  return filtered.map(repo => {
                    const isSelected = repo.selected;
                    return (
                      <div
                        key={repo.id}
                        onClick={() => toggleRepoSelection(repo.id)}
                        className={`bx p-4 cursor-pointer transition-all select-none ${
                          isSelected
                            ? 'bg-[#E8ECFF] border-2 border-[#0A0A12] shadow-neo'
                            : 'bg-white border-2 border-[#0A0A12] shadow-neo-sm hover:shadow-neo hover:-translate-y-0.5'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <h3 className="font-['Space_Grotesk'] font-bold text-base text-[#0A0A12] flex items-center gap-2">
                            <span className={isSelected ? 'text-[#2340FF] font-black' : 'text-[#55586B]'}>
                              {isSelected ? '☑' : '☐'}
                            </span>
                            <span>{repo.name}</span>
                          </h3>
                          <span className="tg text-[11px] py-0.5 px-2.5">
                            {repo.lang}
                          </span>
                        </div>

                        <p className="text-xs text-[#55586B] leading-relaxed mb-3 line-clamp-2 font-['DM_Sans']">
                          {repo.desc}
                        </p>

                        <div className="flex items-center justify-between text-[11px] font-mono text-[#55586B]">
                          <span className="tg bg-white text-[#0A0A12] font-bold flex items-center gap-1 py-0.5 px-2">
                            ★ {repo.stars}
                          </span>
                          <span>Updated {repo.updated}</span>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>

              {/* Professional Credentials & Certifications Companion (LinkedIn / Credly Ingestion) */}
              <div className="bx p-5 sm:p-6 rounded-[24px] bg-white border-2 border-[#0A0A12] shadow-neo space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-[#0A0A12]/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[12px] bg-[#FFD84D] text-[#0A0A12] border-2 border-[#0A0A12] flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-neo-sm">
                      📜
                    </div>
                    <div>
                      <h3 className="font-['Space_Grotesk'] text-base sm:text-lg font-bold text-[#0A0A12]">
                        Professional Certifications &amp; Credentials
                      </h3>
                      <p className="text-xs text-[#55586B] font-['DM_Sans']">
                        Extract verified certificates from LinkedIn / Credly or pick popular industry badges with 1 click.
                      </p>
                    </div>
                  </div>
                  <span className="tg bg-[#E8ECFF] text-[#2340FF] font-bold text-xs self-start sm:self-auto">
                    {certificationsList.length} verified badges
                  </span>
                </div>

                {/* Smart URL Paste Extraction */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#0A0A12] uppercase font-['DM_Sans'] flex items-center justify-between">
                    <span>Paste LinkedIn Profile URL or Credly Badge Link</span>
                    <span className="text-[10px] text-[#55586B] font-normal lowercase">zero-oauth • instant extract</span>
                  </label>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <div className="relative flex-1">
                      <Globe className="w-4 h-4 text-[#55586B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="url"
                        value={certUrlInput}
                        onChange={(e) => setCertUrlInput(e.target.value)}
                        placeholder="e.g. linkedin.com/in/yourprofile or credly.com/badges/..."
                        className="in w-full pl-9 text-xs text-[#0A0A12] min-h-[42px]"
                      />
                    </div>
                    <button
                      type="button"
                      disabled={isExtractingCerts}
                      onClick={handleExtractCredentialsFromUrl}
                      className="pill b1 text-xs min-h-[42px] px-5 font-bold shadow-neo-sm flex items-center justify-center gap-1.5 whitespace-nowrap disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#0A0A12]" />
                      <span>{isExtractingCerts ? 'Extracting…' : 'Extract Credentials'}</span>
                    </button>
                  </div>
                  {certExtractMessage && (
                    <p className="text-xs text-[#16A34A] font-bold flex items-center gap-1.5 mt-1 font-['DM_Sans']">
                      <Check className="w-3.5 h-3.5" />
                      <span>{certExtractMessage}</span>
                    </p>
                  )}
                </div>

                {/* 1-Click Popular Industry Badges */}
                <div className="space-y-2 pt-1">
                  <span className="block text-xs font-bold text-[#0A0A12] uppercase font-['DM_Sans']">
                    1-Click Quick Add Popular Credentials:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_CERTIFICATIONS.map(cert => {
                      const isAdded = certificationsList.some(c => c.title === cert.title);
                      return (
                        <button
                          key={cert.title}
                          type="button"
                          onClick={() => togglePopularCert(cert)}
                          className={`pill text-xs min-h-[36px] px-3 font-bold transition-all flex items-center gap-1.5 ${
                            isAdded 
                              ? 'b1 shadow-neo-sm ring-2 ring-[#0A0A12]' 
                              : 'b2 hover:bg-[#F3F4F8]'
                          }`}
                        >
                          <span>{cert.icon}</span>
                          <span>{cert.title}</span>
                          <span className="text-[10px] ml-0.5 opacity-70">({cert.org})</span>
                          {isAdded ? <Check className="w-3 h-3 text-[#7CFFB2]" /> : <span className="text-xs">+</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Active Selected Certifications List */}
                <div className="space-y-2 pt-1">
                  <span className="block text-xs font-bold text-[#0A0A12] uppercase font-['DM_Sans']">
                    Active Portfolio Credentials ({certificationsList.length}):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {certificationsList.map((cert, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-[14px] bg-[#F3F4F8] border-2 border-[#0A0A12] shadow-neo-sm flex items-center justify-between gap-2 group hover:bg-white transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-xl flex-shrink-0">{cert.icon || '🛡️'}</span>
                          <div className="min-w-0">
                            <span className="font-bold text-[#0A0A12] text-xs block truncate font-['Space_Grotesk']">
                              {cert.title}
                            </span>
                            <span className="text-[10px] text-[#55586B] font-mono block truncate">
                              {cert.org} • {cert.date}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveCertification(idx)}
                          className="w-6 h-6 rounded-full border border-[#0A0A12]/30 hover:border-[#0A0A12] hover:bg-[#EF4444] hover:text-white flex items-center justify-center text-xs text-[#55586B] flex-shrink-0 transition-colors"
                          title="Remove credential"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Custom Credential Manual Input Row */}
                <div className="pt-2 border-t border-[#0A0A12]/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    placeholder="Custom Certification Title (e.g. Certified Scrum Master)"
                    value={customCertInput.title}
                    onChange={(e) => setCustomCertInput({ ...customCertInput, title: e.target.value })}
                    className="in flex-1 text-xs text-[#0A0A12] min-h-[38px]"
                  />
                  <input
                    type="text"
                    placeholder="Issuing Org (e.g. Scrum Alliance)"
                    value={customCertInput.org}
                    onChange={(e) => setCustomCertInput({ ...customCertInput, org: e.target.value })}
                    className="in w-full sm:w-44 text-xs text-[#0A0A12] min-h-[38px]"
                  />
                  <input
                    type="text"
                    placeholder="Year (e.g. 2025)"
                    value={customCertInput.date}
                    onChange={(e) => setCustomCertInput({ ...customCertInput, date: e.target.value })}
                    className="in w-full sm:w-28 text-xs text-[#0A0A12] min-h-[38px]"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomCertification}
                    className="pill b2 text-xs min-h-[38px] px-4 font-bold flex items-center justify-center gap-1 hover:shadow-neo-sm whitespace-nowrap"
                  >
                    <span>+ Add Custom</span>
                  </button>
                </div>
              </div>

              {/* Generate Your Portfolio Box (Board 2 line 139) */}
              <div className="bx p-6 rounded-[24px] bg-white border-2 border-[#0A0A12] shadow-neo space-y-4">
                <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#0A0A12]">
                  Generate your portfolio
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#55586B] mb-1 font-['DM_Sans']">Your Name</label>
                    <input
                      type="text"
                      value={user?.name || 'Alex Morgan'}
                      readOnly
                      className="in w-full text-xs text-[#0A0A12] opacity-90 cursor-default"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#55586B] mb-1 font-['DM_Sans']">Professional Role</label>
                    <input
                      type="text"
                      value={customRole}
                      onChange={(e) => setCustomRole(e.target.value)}
                      placeholder="e.g. Full-stack engineer"
                      className="in w-full text-xs text-[#0A0A12]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#55586B] mb-1 font-['DM_Sans']">
                    Optional Introduction / Vision Statement
                  </label>
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell AI about your background, specializations, or leave empty for auto-draft..."
                    className="in w-full text-xs text-[#0A0A12] resize-none leading-relaxed font-['DM_Sans']"
                  />
                </div>

                {/* Tone Selectors & Generate Button */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#55586B] font-bold hidden sm:inline font-['DM_Sans']">Tone:</span>
                    {['Professional', 'Creative', 'Minimal'].map(tone => (
                      <button
                        key={tone}
                        type="button"
                        onClick={() => setAiTone(tone)}
                        className={`pill text-xs px-4 py-1.5 min-h-[38px] ${
                          aiTone === tone
                            ? 'b1 shadow-neo-sm'
                            : 'b2 hover:bg-[#F3F4F8]'
                        }`}
                      >
                        {tone}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    disabled={isGeneratingPortfolio}
                    onClick={handleGeneratePortfolio}
                    className="pill by px-6 py-2 text-xs font-bold flex items-center gap-2 shadow-neo min-h-[44px] disabled:opacity-50 hover:bg-[#ffe373]"
                  >
                    <Sparkles className="w-4 h-4 text-[#0A0A12]" />
                    <span>{isGeneratingPortfolio ? 'Synthesizing...' : 'Generate my portfolio'}</span>
                  </button>
                </div>
              </div>

              {/* Generating Progress Card (Board 2 line 140) */}
              {(isGeneratingPortfolio || genStep > 0) && (
                <div 
                  className="bx bx-dark p-6 rounded-[24px] text-white border-2 border-[#0A0A12] shadow-neo space-y-3 font-['DM_Sans'] text-sm"
                  style={{ backgroundColor: '#0A0A12', color: '#FFFFFF' }}
                >
                  <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white">
                    Generating…
                  </h3>

                  <div className="space-y-2">
                    <p className={`flex items-center gap-2.5 ${genStep >= 1 ? 'text-[#7CFFB2] font-bold' : 'text-white/60'}`}>
                      <span>{genStep >= 1 ? '✓' : '○'}</span>
                      <span>Analyzing repositories</span>
                    </p>
                    <p className={`flex items-center gap-2.5 ${genStep >= 2 ? 'text-[#7CFFB2] font-bold' : 'text-white/60'}`}>
                      <span>{genStep >= 2 ? '✓' : '○'}</span>
                      <span>Understanding your projects</span>
                    </p>
                    <p className={`flex items-center gap-2.5 ${genStep >= 3 ? 'text-[#FFD84D] font-bold' : 'text-white/60'}`}>
                      <span>{genStep >= 3 ? '●' : '○'}</span>
                      <span>Writing your introduction</span>
                    </p>
                    <p className={`flex items-center gap-2.5 ${genStep >= 4 ? 'text-[#7CFFB2] font-bold' : 'text-white/40'}`}>
                      <span>{genStep >= 4 ? '✓' : '○'}</span>
                      <span>Building your portfolio</span>
                    </p>
                  </div>

                  {/* Progress bar with #FFD84D fill */}
                  <div className="h-2 rounded-full bg-white/20 overflow-hidden border border-white/20">
                    <div 
                      className="h-full bg-[#FFD84D] transition-all duration-500 rounded-full"
                      style={{
                        width: genStep === 1 ? '25%' : genStep === 2 ? '50%' : genStep === 3 ? '75%' : genStep === 4 ? '100%' : '10%'
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Stepper Navigation */}
              <div className="pt-4 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 border-t border-[#0A0A12]/15">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="pill b2 text-xs min-h-[42px] px-5 justify-center"
                >
                  ← Back to Gallery
                </button>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="pill b1 px-6 py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-neo min-h-[44px] hover:translate-x-0.5"
                >
                  <span>Next: Configure Sections</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 3: SECTION HIERARCHY & GRANULAR SUB-COMPONENTS           */}
          {/* Refined Folio AI v2: Clean 2-Column Balanced Architecture     */}
          {/* ============================================================ */}
          {step === 3 && (
            <div className="space-y-6">
              
              {/* Header Context Banner */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#0A0A12]/15">
                <div>
                  <h3 className="text-lg font-bold text-[#0A0A12] font-['Space_Grotesk'] flex items-center gap-2">
                    <Layers className="w-5 h-5 text-[#2340FF]" />
                    <span>Portfolio Architecture &amp; Sections</span>
                  </h3>
                  <p className="text-xs text-[#55586B] mt-0.5 font-['DM_Sans']">
                    Structure your page hierarchy on the left. Toggle fine-grained widgets on the right.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="tg bg-[#E8ECFF] text-[#2340FF] text-xs font-bold font-mono">
                    {orderedSections.filter(s => s.enabled).length} of {orderedSections.length} Sections Active
                  </span>
                  <button
                    type="button"
                    onClick={applySmartDefaults}
                    className="pill b2 px-3.5 py-1 text-xs font-bold flex items-center gap-1.5 transition-colors min-h-[36px] shadow-neo-sm hover:bg-[#F3F4F8]"
                    title="Restore recommended section order and enabled states"
                  >
                    <CheckSquare className="w-3.5 h-3.5 text-[#2340FF]" />
                    <span>Smart Defaults</span>
                  </button>
                </div>
              </div>

              {/* 2-Column Responsive Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* LEFT COLUMN: Section Order & Drag-and-Drop (7 cols) */}
                <div className="lg:col-span-7 space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#55586B] font-['Space_Grotesk']">
                      Section Sequence (Drag Handle to Reorder)
                    </span>
                    <span className="text-[11px] font-mono text-[#55586B]">
                      Top to Bottom
                    </span>
                  </div>

                  <div className="bx p-3 sm:p-4 rounded-[24px] bg-white border-2 border-[#0A0A12] shadow-neo space-y-2">
                    {orderedSections.map((mod, index) => {
                      const Icon = mod.icon;
                      const isActive = mod.enabled;
                      const isDragging = draggedIndex === index;

                      return (
                        <div
                          key={mod.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, index)}
                          onDragOver={(e) => handleDragOver(e, index)}
                          onDragEnd={handleDragEnd}
                          className={`group flex items-center gap-3 p-3 rounded-[16px] border-2 transition-all select-none cursor-grab active:cursor-grabbing ${
                            isDragging
                              ? 'bg-[#E8ECFF] border-[#2340FF] shadow-neo scale-[1.01]'
                              : isActive
                                ? 'bg-white border-[#0A0A12] hover:border-[#2340FF] hover:shadow-neo-sm'
                                : 'bg-[#F9FAFB] border-[#0A0A12]/20 opacity-60 hover:opacity-90'
                          }`}
                        >
                          {/* Drag Handle */}
                          <div 
                            className="text-[#55586B] group-hover:text-[#0A0A12] p-1 flex-shrink-0 cursor-grab active:cursor-grabbing"
                            title="Drag to rearrange"
                          >
                            <GripVertical className="w-4 h-4" />
                          </div>

                          {/* Index Pill */}
                          <div className="w-6 h-6 rounded-full bg-[#FFD84D] text-[#0A0A12] font-bold font-mono text-xs flex items-center justify-center flex-shrink-0 border border-[#0A0A12]">
                            {index + 1}
                          </div>

                          {/* Toggle Checkbox */}
                          <button
                            type="button"
                            onClick={() => toggleSection(mod.id)}
                            className={`w-6 h-6 rounded-[8px] border-2 border-[#0A0A12] flex items-center justify-center transition-all flex-shrink-0 font-bold ${
                              isActive ? 'bg-[#2340FF] text-white shadow-sm' : 'bg-white text-transparent hover:bg-[#F3F4F8]'
                            }`}
                            title={isActive ? 'Disable section' : 'Enable section'}
                          >
                            {isActive && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </button>

                          {/* Icon & Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#2340FF]' : 'text-[#55586B]'}`} />
                              <span className="text-xs sm:text-sm font-bold text-[#0A0A12] font-['Space_Grotesk'] truncate">
                                {mod.title}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#55586B] truncate font-['DM_Sans'] mt-0.5">
                              {mod.desc}
                            </p>
                          </div>

                          {/* Status Tag */}
                          <div className="flex-shrink-0 hidden xs:block">
                            {isActive ? (
                              <span className="tg bg-[#7CFFB2] text-[#0A0A12] text-[10px] font-bold py-0.5 px-2">
                                Active
                              </span>
                            ) : (
                              <span className="tg bg-gray-100 text-gray-500 text-[10px] py-0.5 px-2">
                                Omitted
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* RIGHT COLUMN: Granular Sub-Components & Blueprint Status (5 cols) */}
                <div className="lg:col-span-5 space-y-4">
                  
                  {/* Granular Sub-Components Box */}
                  <div className="bx p-5 rounded-[24px] bg-white border-2 border-[#0A0A12] shadow-neo space-y-4">
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-wider text-[#0A0A12] font-['Space_Grotesk'] flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-[#2340FF]" />
                        <span>Sub-Component Switches</span>
                      </h4>
                      <p className="text-xs text-[#55586B] mt-0.5 font-['DM_Sans']">
                        Inch-by-inch control of widgets and profile bridges.
                      </p>
                    </div>

                    {/* Group 1: Navigation & Badges */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#55586B] font-['Space_Grotesk'] block">
                        Navigation &amp; Badges
                      </span>
                      {[
                        { key: 'navbar_brand_logo', label: 'Navbar Folio Mark' },
                        { key: 'navbar_nav_links', label: 'Navigation Links' },
                        { key: 'navbar_status_badge', label: 'Availability Badge' }
                      ].map(item => {
                        const isOn = subComponents[item.key] ?? false;
                        return (
                          <div
                            key={item.key}
                            onClick={() => toggleSubComponent(item.key)}
                            className="flex items-center justify-between p-2.5 rounded-[12px] border border-[#0A0A12]/30 hover:border-[#0A0A12] hover:bg-[#F8FAFF] cursor-pointer transition-all bg-white select-none active:scale-[0.99]"
                          >
                            <span className="text-xs font-bold text-[#0A0A12] font-['DM_Sans']">
                              {item.label}
                            </span>
                            <div className={`w-10 h-5 rounded-full border-2 border-[#0A0A12] transition-colors p-0.5 flex items-center toggle-switch-track ${
                              isOn ? 'bg-[#2340FF]' : 'bg-gray-200'
                            }`}>
                              <div className={`w-3.5 h-3.5 rounded-full bg-white border border-[#0A0A12] shadow-sm toggle-knob ${
                                isOn ? 'translate-x-5' : 'translate-x-0'
                              }`} />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Group 2: Interactive Terminal & Proof */}
                    <div className="space-y-2 pt-2 border-t border-[#0A0A12]/10">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#55586B] font-['Space_Grotesk'] block">
                        Interactive Widgets &amp; Proof
                      </span>
                      {[
                        { key: 'hero_terminal_window', label: 'macOS Interactive Terminal' },
                        { key: 'hero_clone_snippet', label: 'Git Clone Snippet' },
                        { key: 'hero_verified_badge', label: 'Verified Engineer Badge' }
                      ].map(item => {
                        const isOn = subComponents[item.key] ?? false;
                        return (
                          <div
                            key={item.key}
                            onClick={() => toggleSubComponent(item.key)}
                            className="flex items-center justify-between p-2.5 rounded-[12px] border border-[#0A0A12]/30 hover:border-[#0A0A12] hover:bg-[#F8FAFF] cursor-pointer transition-all bg-white select-none active:scale-[0.99]"
                          >
                            <span className="text-xs font-bold text-[#0A0A12] font-['DM_Sans']">
                              {item.label}
                            </span>
                            <div className={`w-10 h-5 rounded-full border-2 border-[#0A0A12] transition-colors p-0.5 flex items-center toggle-switch-track ${
                              isOn ? 'bg-[#2340FF]' : 'bg-gray-200'
                            }`}>
                              <div className={`w-3.5 h-3.5 rounded-full bg-white border border-[#0A0A12] shadow-sm toggle-knob ${
                                isOn ? 'translate-x-5' : 'translate-x-0'
                              }`} />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Group 3: Social & Media Bridges */}
                    <div className="space-y-2 pt-2 border-t border-[#0A0A12]/10">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#55586B] font-['Space_Grotesk'] block">
                        Social &amp; Media Bridges
                      </span>
                      {[
                        { key: 'platform_github', label: 'GitHub Profile Link' },
                        { key: 'platform_linkedin', label: 'LinkedIn Bridge Link' },
                        { key: 'platform_youtube', label: 'YouTube Video Player' }
                      ].map(item => {
                        const isOn = subComponents[item.key] ?? false;
                        return (
                          <div
                            key={item.key}
                            onClick={() => toggleSubComponent(item.key)}
                            className="flex items-center justify-between p-2.5 rounded-[12px] border border-[#0A0A12]/30 hover:border-[#0A0A12] hover:bg-[#F8FAFF] cursor-pointer transition-all bg-white select-none active:scale-[0.99]"
                          >
                            <span className="text-xs font-bold text-[#0A0A12] font-['DM_Sans']">
                              {item.label}
                            </span>
                            <div className={`w-10 h-5 rounded-full border-2 border-[#0A0A12] transition-colors p-0.5 flex items-center toggle-switch-track ${
                              isOn ? 'bg-[#2340FF]' : 'bg-gray-200'
                            }`}>
                              <div className={`w-3.5 h-3.5 rounded-full bg-white border border-[#0A0A12] shadow-sm toggle-knob ${
                                isOn ? 'translate-x-5' : 'translate-x-0'
                              }`} />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                  </div>

                  {/* Blueprint Summary Card */}
                  <div className="p-4 rounded-[20px] bg-[#E8ECFF] border-2 border-[#0A0A12] shadow-neo-sm space-y-2.5 font-['DM_Sans']">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0A0A12] font-['Space_Grotesk']">
                        Blueprint Health Check
                      </span>
                      <span className="tg bg-[#7CFFB2] text-[#0A0A12] text-[10px] font-bold">
                        100% Ready
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded-[10px] bg-white border border-[#0A0A12]/20">
                        <span className="text-[10px] text-[#55586B] block">Active Sections</span>
                        <span className="font-bold text-[#0A0A12] font-mono">
                          {orderedSections.filter(s => s.enabled).length} / {orderedSections.length}
                        </span>
                      </div>
                      <div className="p-2 rounded-[10px] bg-white border border-[#0A0A12]/20">
                        <span className="text-[10px] text-[#55586B] block">Widgets Enabled</span>
                        <span className="font-bold text-[#0A0A12] font-mono">
                          {Object.values(subComponents).filter(Boolean).length} / 9
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              {/* Stepper Navigation */}
              <div className="pt-4 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 border-t border-[#0A0A12]/15">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="pill b2 text-xs min-h-[42px] px-5 justify-center"
                >
                  ← Back to Projects
                </button>

                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="pill b1 px-6 py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-neo min-h-[44px] hover:translate-x-0.5"
                >
                  <span>Next: Style &amp; Review</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 4: DUAL-TONE GRADIENT, TYPOGRAPHY & LIVE MINI-PREVIEW   */}
          {/* Refined Folio AI v2: Clean 2-Column Split Studio Layout       */}
          {/* ============================================================ */}
          {step === 4 && (
            <div className="space-y-6">
              
              {/* Header Context Banner */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#0A0A12]/15">
                <div>
                  <h3 className="text-lg font-bold text-[#0A0A12] font-['Space_Grotesk'] flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#2340FF]" />
                    <span>Style, Identity &amp; Live Blueprint Review</span>
                  </h3>
                  <p className="text-xs text-[#55586B] mt-0.5 font-['DM_Sans']">
                    Fine-tune your identity, color palette, and typography on the left. Inspect the real-time preview on the right.
                  </p>
                </div>

                <span className="tg bg-[#7CFFB2] text-[#0A0A12] text-xs font-bold flex items-center gap-1.5 font-mono shadow-sm">
                  <span className="live-pulse-dot" />
                  <span>Real-Time Sync Active</span>
                </span>
              </div>

              {/* 2-Column Responsive Split Studio */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* LEFT COLUMN: Controls & Form Settings (7 cols) */}
                <div className="lg:col-span-7 space-y-4">
                  
                  {/* Card 1: Identity & AI Bio */}
                  <div className="bx p-5 rounded-[24px] bg-white border-2 border-[#0A0A12] shadow-neo space-y-3.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A0A12] font-['Space_Grotesk'] flex items-center gap-2">
                        <Code className="w-4 h-4 text-[#2340FF]" />
                        <span>Developer Identity &amp; Bio</span>
                      </h4>
                      
                      <button
                        type="button"
                        disabled={isGeneratingAI === 'bio_rewrite'}
                        onClick={handleEnhanceBioWithAI}
                        className="pill by px-3.5 py-1 text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50 min-h-[34px] shadow-neo-sm hover:bg-[#ffe373] relative overflow-hidden group"
                      >
                        <span className="absolute inset-0 neo-shimmer opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity" />
                        <Sparkles className="w-3.5 h-3.5 text-[#0A0A12] group-hover:rotate-12 transition-transform" />
                        <span>{isGeneratingAI === 'bio_rewrite' ? 'Polishing...' : '✨ Polish with Gemini'}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-['DM_Sans']">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#55586B] mb-1">Professional Role</label>
                        <input
                          type="text"
                          value={customRole}
                          onChange={(e) => setCustomRole(e.target.value)}
                          className="in w-full text-xs text-[#0A0A12] bg-white min-h-[42px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#55586B] mb-1">Headline</label>
                        <input
                          type="text"
                          value={headline}
                          onChange={(e) => setHeadline(e.target.value)}
                          className="in w-full text-xs text-[#0A0A12] bg-white min-h-[42px]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#55586B] mb-1 font-['DM_Sans']">
                        Recruiter-Optimized Bio
                      </label>
                      <textarea
                        rows={2}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="in w-full text-xs text-[#0A0A12] bg-white resize-none leading-relaxed font-['DM_Sans']"
                      />
                    </div>
                  </div>

                  {/* Card 2: Dual-Tone Gradient Palette */}
                  <div className="bx p-5 rounded-[24px] bg-white border-2 border-[#0A0A12] shadow-neo space-y-3.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A0A12] font-['Space_Grotesk'] flex items-center gap-2">
                        <Palette className="w-4 h-4 text-[#2340FF]" />
                        <span>Dual-Tone Gradient Palette</span>
                      </h4>
                      <span className="text-[11px] font-mono text-[#55586B]">Top &amp; Bottom Mix</span>
                    </div>

                    {/* Presets Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {[
                        { id: 'prism-electric', name: 'Prism Electric', top: '#2340FF', bottom: '#FFD84D' },
                        { id: 'monolith-dark', name: 'Monolith Dark', top: '#0A0A12', bottom: '#1F202E' },
                        { id: 'soft-lavender', name: 'Soft Lavender', top: '#2340FF', bottom: '#E8ECFF' },
                        { id: 'cyber-mint', name: 'Cyber Mint', top: '#0A0A12', bottom: '#7CFFB2' },
                        { id: 'editorial-warm', name: 'Editorial Warm', top: '#8C4320', bottom: '#F5F1E8' }
                      ].map(p => {
                        const isSelected = palettePresetId === p.id || (topColor === p.top && bottomColor === p.bottom);
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => { setTopColor(p.top); setBottomColor(p.bottom); setPalettePresetId(p.id); }}
                            className={`p-2.5 rounded-[14px] border-2 text-left transition-all flex items-center gap-2.5 ${
                              isSelected
                                ? 'bg-[#E8ECFF] border-[#2340FF] shadow-neo-sm ring-1 ring-[#2340FF]'
                                : 'bg-white border-[#0A0A12] hover:bg-[#F3F4F8]'
                            }`}
                          >
                            <div 
                              className="w-6 h-6 rounded-full border border-[#0A0A12] flex-shrink-0 shadow-sm"
                              style={{ background: `linear-gradient(135deg, ${p.top} 0%, ${p.bottom} 100%)` }}
                            />
                            <div className="min-w-0 flex-1">
                              <span className="text-xs font-bold text-[#0A0A12] font-['Space_Grotesk'] block truncate">
                                {p.name}
                              </span>
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#2340FF] flex-shrink-0 stroke-[3]" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Custom Hex Pickers */}
                    <div className="p-3 rounded-[16px] bg-[#F9FAFB] border border-[#0A0A12]/20 flex flex-wrap items-center justify-between gap-3 font-['DM_Sans']">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={topColor}
                            onChange={(e) => { setTopColor(e.target.value); setPalettePresetId('custom'); }}
                            className="w-7 h-7 rounded-[8px] cursor-pointer border border-[#0A0A12] p-0 bg-transparent"
                            title="Top accent color"
                          />
                          <div>
                            <span className="text-[10px] text-[#55586B] font-bold block uppercase leading-none">Top</span>
                            <span className="text-[11px] font-bold font-mono text-[#0A0A12]">{topColor}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={bottomColor}
                            onChange={(e) => { setBottomColor(e.target.value); setPalettePresetId('custom'); }}
                            className="w-7 h-7 rounded-[8px] cursor-pointer border border-[#0A0A12] p-0 bg-transparent"
                            title="Bottom deep color"
                          />
                          <div>
                            <span className="text-[10px] text-[#55586B] font-bold block uppercase leading-none">Bottom</span>
                            <span className="text-[11px] font-bold font-mono text-[#0A0A12]">{bottomColor}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-[#55586B]">Swatch:</span>
                        <div 
                          className="w-20 h-6 rounded-[8px] border border-[#0A0A12] shadow-sm"
                          style={{ background: `linear-gradient(135deg, ${topColor} 0%, ${bottomColor} 100%)` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Typography Aesthetic */}
                  <div className="bx p-5 rounded-[24px] bg-white border-2 border-[#0A0A12] shadow-neo space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A0A12] font-['Space_Grotesk'] flex items-center gap-2">
                      <Type className="w-4 h-4 text-[#2340FF]" />
                      <span>Typography Aesthetic</span>
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {[
                        { id: 'sans', name: 'Space Grotesk & DM Sans', font: "font-['Space_Grotesk']", desc: 'Modern electric brutalist' },
                        { id: 'mono', name: 'Developer Monospace', font: 'font-mono', desc: 'Code & terminal structure' },
                        { id: 'serif', name: 'Editorial Serif', font: 'font-serif', desc: 'Luxury & advisory' }
                      ].map(style => {
                        const isSelected = fontStyle === style.id;
                        return (
                          <button
                            key={style.id}
                            type="button"
                            onClick={() => setFontStyle(style.id)}
                            className={`p-3 rounded-[14px] border-2 text-left transition-all ${
                              isSelected
                                ? 'bg-[#E8ECFF] border-[#2340FF] shadow-neo-sm ring-1 ring-[#2340FF]'
                                : 'bg-white border-[#0A0A12] hover:bg-[#F3F4F8]'
                            }`}
                          >
                            <span className={`text-xs font-bold text-[#0A0A12] block mb-0.5 ${style.font}`}>
                              {style.name}
                            </span>
                            <p className="text-[10px] text-[#55586B] leading-tight font-['DM_Sans']">
                              {style.desc}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* RIGHT COLUMN: Sticky Real-Time Live Preview & Launch Banner (5 cols) */}
                <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-2">
                  
                  {/* Real-time Bento Card Preview */}
                  <div className="bx p-5 rounded-[24px] bg-white border-2 border-[#0A0A12] shadow-neo space-y-3.5">
                    
                    <div className="flex items-center justify-between pb-2 border-b border-[#0A0A12]/15">
                      <span className="text-xs font-bold text-[#0A0A12] uppercase tracking-wider flex items-center gap-1.5 font-['Space_Grotesk']">
                        <Eye className="w-4 h-4 text-[#2340FF]" />
                        <span>Live Bento Preview</span>
                      </span>
                      <span className="tg bg-[#7CFFB2] text-[#0A0A12] text-[10px] font-bold py-0.5 px-2">
                        Synchronized
                      </span>
                    </div>

                    {/* Interactive Preview Canvas */}
                    <div className="p-4 sm:p-5 rounded-[18px] border-2 border-[#0A0A12] space-y-3 relative overflow-hidden bg-[#FAFAFC] shadow-sm">
                      
                      {/* Gradient Accent Bar */}
                      <div 
                        className="h-2 w-full rounded-full border border-[#0A0A12]/20"
                        style={{ background: `linear-gradient(90deg, ${topColor} 0%, ${bottomColor} 100%)` }}
                      />

                      <div className="flex items-center justify-between gap-2 pt-1">
                        <span 
                          className="tg bg-[#FFD84D] text-[#0A0A12] text-[11px] font-bold py-0.5 px-2.5 truncate"
                        >
                          {customRole || 'Systems Developer'}
                        </span>
                        
                        {subComponents.hero_verified_badge && (
                          <span className="tg bg-[#E8ECFF] text-[#2340FF] text-[10px] font-mono font-bold flex items-center gap-1 py-0.5 px-2">
                            <CheckCircle2 className="w-3 h-3 text-[#2340FF]" />
                            <span>Verified</span>
                          </span>
                        )}
                      </div>

                      {/* Headline with Live Font */}
                      <h3 className={`text-xl font-bold text-[#0A0A12] tracking-tight ${
                        fontStyle === 'mono' ? 'font-mono' : fontStyle === 'serif' ? 'font-serif' : "font-['Space_Grotesk']"
                      }`}>
                        {headline || 'Alex Morgan'}
                      </h3>

                      {/* Bio with Live Font */}
                      <p className={`text-xs text-[#55586B] leading-relaxed line-clamp-3 ${
                        fontStyle === 'mono' ? 'font-mono' : fontStyle === 'serif' ? 'font-serif' : "font-['DM_Sans']"
                      }`}>
                        {bio || 'Clean, typography-driven monospace design. Prioritizes code readability, git telemetry, and clean technical architecture.'}
                      </p>

                      {/* Optional Terminal Widget Mockup */}
                      {subComponents.hero_terminal_window && (
                        <div className="p-2.5 rounded-[10px] bg-[#0A0A12] text-[#7CFFB2] font-mono text-[11px] space-y-1 border border-[#0A0A12]">
                          <div className="flex items-center gap-1 text-[9px] text-white/50 mb-1">
                            <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                            <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                            <span className="w-2 h-2 rounded-full bg-[#7CFFB2]" />
                            <span className="ml-1 text-white/70">folio-terminal</span>
                          </div>
                          <div>&gt; engineer.status = 'AVAILABLE_FOR_SPRINTS'</div>
                        </div>
                      )}

                      {/* Tech Chips */}
                      <div className="flex items-center gap-1.5 pt-1 flex-wrap text-[10px] font-mono">
                        <span className="tg py-0.5 px-2 bg-white">TypeScript</span>
                        <span className="tg py-0.5 px-2 bg-white">React</span>
                        <span className="tg py-0.5 px-2 bg-white">Go</span>
                        <span className="tg py-0.5 px-2 bg-white">Docker</span>
                      </div>
                    </div>

                  </div>

                  {/* High-Impact Launch Card */}
                  <div 
                    className="bx bx-dark p-5 rounded-[24px] text-white border-2 border-[#0A0A12] shadow-neo space-y-3 font-['DM_Sans']"
                    style={{ backgroundColor: '#0A0A12', color: '#FFFFFF' }}
                  >
                    <div>
                      <h4 className="font-['Space_Grotesk'] text-base font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#FFD84D]" />
                        <span>Ready to Launch Folio Studio</span>
                      </h4>
                      <p className="text-xs text-white/70 mt-0.5">
                        Your custom layout, themes, and repositories are verified.
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={isAssembling}
                      onClick={handleLaunch}
                      className="pill by px-6 py-3 text-sm font-bold w-full flex items-center justify-center gap-2 shadow-neo min-h-[46px] disabled:opacity-50 hover:bg-[#ffe373] hover:translate-x-0.5 transition-all"
                    >
                      <Sparkles className="w-4 h-4 text-[#0A0A12]" />
                      <span>{isAssembling ? 'Building Portfolio...' : 'Launch Folio Studio →'}</span>
                    </button>
                  </div>

                </div>

              </div>

              {/* Stepper Navigation */}
              <div className="pt-4 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 border-t border-[#0A0A12]/15">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="pill b2 text-xs min-h-[42px] px-5 justify-center"
                >
                  ← Back to Sections
                </button>

                <button
                  type="button"
                  disabled={isAssembling}
                  onClick={handleLaunch}
                  className="pill b1 px-8 py-2.5 text-sm font-bold flex items-center justify-center gap-2 shadow-neo min-h-[46px] disabled:opacity-50 hover:translate-x-0.5"
                >
                  <Sparkles className="w-4 h-4 text-[#FFD84D]" />
                  <span>{isAssembling ? 'Building Portfolio...' : 'Launch Folio Studio →'}</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* ============================================================== */}
      {/* 07_Template_Detail.html LIVE PREVIEW MODAL                     */}
      {/* ============================================================== */}
      {detailPreviewTemplate && (
        <div className="fixed inset-0 z-60 bg-[#0A0A12]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-['DM_Sans']">
          <div className="w-full max-w-6xl rounded-[28px] bg-[#F3F4F8] border-2 border-[#0A0A12] shadow-neo overflow-hidden my-auto animate-fade-in flex flex-col max-h-[94vh]">
            
            {/* Top Header */}
            <div className="px-6 py-4 border-b-2 border-[#0A0A12] bg-white flex items-center justify-between gap-4 flex-shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setDetailPreviewTemplate(null)}
                  className="pill b2 text-xs px-4 py-1 min-h-[36px] flex items-center gap-1.5"
                >
                  ← Gallery
                </button>
                <h2 className="text-xl font-bold font-['Space_Grotesk'] text-[#0A0A12]">
                  {detailPreviewTemplate.name}
                </h2>
              </div>

              {/* Viewport switcher */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDetailViewport('desktop')}
                  className={`pill text-xs min-h-[36px] px-4 font-bold transition-all ${
                    detailViewport === 'desktop' ? 'b1 shadow-neo-sm' : 'b2 hover:bg-[#F3F4F8]'
                  }`}
                >
                  Desktop
                </button>
                <button
                  onClick={() => setDetailViewport('mobile')}
                  className={`pill text-xs min-h-[36px] px-4 font-bold transition-all ${
                    detailViewport === 'mobile' ? 'b1 shadow-neo-sm' : 'b2 hover:bg-[#F3F4F8]'
                  }`}
                >
                  Mobile
                </button>
              </div>
            </div>

            {/* Main Split Grid: 1fr Preview + 360px Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] flex-1 overflow-y-auto">
              
              {/* Left Preview Pane */}
              <div className="p-6 sm:p-8 flex items-center justify-center bg-[#E8ECFF] overflow-y-auto">
                <div className={`bx p-0 w-full bg-white overflow-hidden transition-all duration-300 border-2 border-[#0A0A12] shadow-neo ${
                  detailViewport === 'mobile' ? 'max-w-[375px]' : 'max-w-4xl'
                }`}>
                  <div className="px-4 py-2.5 border-b-2 border-[#0A0A12] bg-white flex items-center justify-between font-mono text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-[#EF4444] border border-[#0A0A12]" />
                      <span className="w-3 h-3 rounded-full bg-[#F59E0B] border border-[#0A0A12]" />
                      <span className="w-3 h-3 rounded-full bg-[#7CFFB2] border border-[#0A0A12]" />
                    </div>
                    <span className="text-[#55586B] font-bold">{detailPreviewTemplate.id}.folio.ai/demo</span>
                    <div className="w-10" />
                  </div>

                  {/* Template Specific Canvas Rendering */}
                  <div className={`p-8 sm:p-12 ${
                    detailPreviewTemplate.id === 'monolith' ? 'bg-[#0A0A12] text-white' :
                    detailPreviewTemplate.id === 'editorial' ? 'bg-[#F5F1E8] text-[#0A0A12] font-serif' :
                    detailPreviewTemplate.id === 'terminal' ? 'bg-[#000000] text-[#7CFFB2] font-mono' :
                    detailPreviewTemplate.id === 'prism' ? 'bg-[#2340FF] text-[#FFD84D]' :
                    detailPreviewTemplate.id === 'canvas' ? 'bg-[#FFD84D] text-[#0A0A12]' :
                    'bg-white text-[#0A0A12] font-mono'
                  }`}>
                    <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3 font-['Space_Grotesk']">
                      {user?.name || 'Alex Morgan'}
                    </h2>
                    <p className="text-base sm:text-lg mb-8 opacity-85 leading-relaxed max-w-xl font-['DM_Sans']">
                      {detailPreviewTemplate.sampleSub}
                    </p>

                    {/* 3 Bento Cards in Preview */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bx p-4 bg-white text-[#0A0A12] border-2 border-[#0A0A12] shadow-neo-sm">
                        <h3 className="font-bold text-sm font-['Space_Grotesk']">Relay</h3>
                        <p className="text-xs text-[#55586B] my-1 font-['DM_Sans']">Realtime sync engine with CRDTs.</p>
                        <span className="tg text-[10px] px-2 py-0.5 bg-[#FFD84D]">Rust</span>
                      </div>
                      <div className="bx p-4 bg-white text-[#0A0A12] border-2 border-[#0A0A12] shadow-neo-sm">
                        <h3 className="font-bold text-sm font-['Space_Grotesk']">Lumen</h3>
                        <p className="text-xs text-[#55586B] my-1 font-['DM_Sans']">Design token CLI for teams.</p>
                        <span className="tg text-[10px] px-2 py-0.5 bg-[#FFD84D]">TypeScript</span>
                      </div>
                      <div className="bx p-4 bg-white text-[#0A0A12] border-2 border-[#0A0A12] shadow-neo-sm">
                        <h3 className="font-bold text-sm font-['Space_Grotesk']">Atlas</h3>
                        <p className="text-xs text-[#55586B] my-1 font-['DM_Sans']">Map tiles on edge servers.</p>
                        <span className="tg text-[10px] px-2 py-0.5 bg-[#FFD84D]">Go</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Info Sidebar (Board 4 detail style) */}
              <div className="p-6 sm:p-8 border-t lg:border-t-0 lg:border-l-2 border-[#0A0A12] bg-white flex flex-col justify-between space-y-6 flex-shrink-0">
                <div className="space-y-4">
                  <span className="tg text-xs px-3 py-1 font-bold bg-[#FFD84D] text-[#0A0A12] w-fit block">
                    {detailPreviewTemplate.badge}
                  </span>

                  <h3 className="text-2xl font-bold font-['Space_Grotesk'] text-[#0A0A12]">
                    {detailPreviewTemplate.desc}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#55586B] leading-relaxed font-['DM_Sans']">
                    {detailPreviewTemplate.fullDesc}
                  </p>

                  <div className="pt-2">
                    <span className="text-xs font-bold text-[#0A0A12] block mb-2 uppercase tracking-wider font-['Space_Grotesk']">
                      Included Sections
                    </span>
                    <div className="flex flex-wrap gap-1.5 font-['DM_Sans']">
                      {detailPreviewTemplate.sections.map((sec) => (
                        <span key={sec} className="tg text-xs font-bold">
                          {sec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 pt-4 border-t-2 border-[#0A0A12]">
                  <button
                    type="button"
                    disabled={isGeneratingAI === detailPreviewTemplate.id}
                    onClick={() => {
                      handleSelectAndGenerateTemplate(detailPreviewTemplate, true);
                      setDetailPreviewTemplate(null);
                    }}
                    className="pill by w-full text-sm font-bold min-h-[46px] shadow-neo flex items-center justify-center gap-2 hover:bg-[#ffe373] hover:translate-x-0.5 transition-all disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4 text-[#0A0A12]" />
                    <span>{isGeneratingAI === detailPreviewTemplate.id ? 'Synthesizing...' : '⚡ AI Generate & Launch Live Site'}</span>
                  </button>

                  <button
                    type="button"
                    disabled={isGeneratingAI === detailPreviewTemplate.id}
                    onClick={() => {
                      handleSelectAndGenerateTemplate(detailPreviewTemplate, false);
                      setDetailPreviewTemplate(null);
                    }}
                    className="pill b1 w-full text-sm font-bold min-h-[46px] shadow-neo-sm hover:translate-x-0.5 flex items-center justify-center gap-2"
                  >
                    <span>🎨 AI Customize in Blueprint</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDetailPreviewTemplate(null)}
                    className="pill b2 w-full text-xs font-bold min-h-[40px] text-[#55586B] hover:text-[#0A0A12]"
                  >
                    ← Back to Template Gallery
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* CELEBRATORY AI GENERATION CONFIRMATION MODAL                   */}
      {/* ============================================================== */}
      {aiGeneratedSuccessModal && (
        <div className="fixed inset-0 z-70 bg-[#0A0A12]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-['DM_Sans']">
          <div className="w-full max-w-xl rounded-[28px] bg-white border-2 border-[#0A0A12] shadow-neo p-6 space-y-4 animate-fade-in my-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#0A0A12]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-[#FFD84D] border-2 border-[#0A0A12] flex items-center justify-center shadow-neo-sm">
                  <Sparkles className="w-5 h-5 text-[#0A0A12]" />
                </div>
                <div>
                  <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#0A0A12] flex items-center gap-2">
                    <span>AI Synthesized Your Site!</span>
                    <span className="tg bg-[#7CFFB2] text-[#0A0A12] text-[10px] font-bold">Ready</span>
                  </h3>
                  <span className="text-xs text-[#55586B]">
                    Tailored to Figma archetype: <strong className="text-[#2340FF]">{aiGeneratedSuccessModal.template.name}</strong>
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAiGeneratedSuccessModal(null)}
                className="pill b2 min-h-[34px] px-2.5"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Generated Profile Blueprint Box */}
            <div className="p-4 rounded-[20px] bg-[#F3F4F8] border-2 border-[#0A0A12] space-y-3">
              <div className="flex items-center justify-between">
                <span className="tg bg-[#FFD84D] text-[#0A0A12] text-xs font-bold">
                  {aiGeneratedSuccessModal.blueprint.role}
                </span>
                <span className="text-[11px] font-mono text-[#55586B]">
                  {aiGeneratedSuccessModal.template.category} Archetype
                </span>
              </div>

              <h4 className="font-['Space_Grotesk'] text-base font-bold text-[#0A0A12] leading-snug">
                {aiGeneratedSuccessModal.blueprint.headline}
              </h4>

              <p className="text-xs text-[#55586B] leading-relaxed line-clamp-3">
                {aiGeneratedSuccessModal.blueprint.bio}
              </p>

              {aiGeneratedSuccessModal.blueprint.metrics && (
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#0A0A12]/15 text-xs font-mono">
                  {aiGeneratedSuccessModal.blueprint.metrics.slice(0, 2).map((m, i) => (
                    <div key={i} className="p-2 rounded-[10px] bg-white border border-[#0A0A12]/20">
                      <span className="text-[10px] text-[#55586B] block truncate">{m.label}</span>
                      <span className="font-bold text-[#0A0A12] truncate block">{m.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2 Big Action Choices */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                disabled={isAssembling}
                onClick={() => handleLaunch(aiGeneratedSuccessModal.blueprint)}
                className="pill by w-full py-3.5 text-sm font-bold flex items-center justify-center gap-2 shadow-neo hover:translate-x-0.5 hover:bg-[#ffe373] transition-all"
              >
                <Sparkles className="w-4 h-4 text-[#0A0A12]" />
                <span>{isAssembling ? 'Launching Live Studio...' : '🚀 Launch Live Portfolio Now'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAiGeneratedSuccessModal(null);
                  setStep(2);
                }}
                className="pill b1 w-full py-2.5 text-xs font-bold flex items-center justify-center gap-2 shadow-neo-sm hover:translate-x-0.5"
              >
                <span>🎨 Customize In Blueprint (Review Repos &amp; Sections →)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
