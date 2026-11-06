/**
 * Core Database & Persistence Engine
 * Relational schema linking Users, Platforms, Portfolios, Items, Pitches & Antigravity Snapshots
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { sqliteAdapter } from './sqlite.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'database.json');

class DatabaseEngine {
  constructor() {
    this.data = {
      users: {},
      connected_accounts: {},
      portfolios: {},
      portfolio_items: {},
      client_pitches: {},
      antigravity_snapshots: {}
    };
    this.load();
    this.seedDefaults();
  }

  load() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      }
    } catch (err) {
      console.warn("Initializing fresh database memory:", err.message);
    }
  }

  save() {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error("Database save error:", err.message);
    }
  }

  seedDefaults() {
    if (!this.data.users['alexchen']) {
      this.provisionCreator('alexchen', 'Alex Chen', 'Senior Freelance Video Director & UI Architect');
    }
    if (!this.data.users['sathasivamb']) {
      this.provisionDeveloperCreator('sathasivamb', 'Sathasivam B');
    }
  }

  provisionDeveloperCreator(rawUsername, displayName) {
    const key = rawUsername.toLowerCase().replace(/[^a-z0-9_-]/g, '') || 'sathasivamb';
    const name = displayName || 'Sathasivam B';
    const role = 'Full-Stack Software Engineer & Systems Architect';

    const user = {
      id: `usr_${key}_01`,
      email: `${key}@github.studio`,
      name: name,
      username: key,
      role: role,
      avatar: 'https://avatars.githubusercontent.com/u/176063126?v=4',
      bio: 'Full-Stack Software Engineer with 73 repositories on GitHub across TypeScript, JavaScript, Java, and modern web frameworks. Creator of LevelUp-Classroom, Secure-Canvas, and DevCollab.',
      provider: 'github',
      custom_domain: `${key}.portfolio.studio`,
      created_at: '2024-07-19T17:39:46.000Z'
    };
    this.data.users[key] = user;

    // Seed real GitHub repositories as portfolio items
    const repos = [
      {
        id: 'gh_1245214996',
        name: 'LevelUp-Classroom',
        title: 'LevelUp Classroom',
        lang: 'TypeScript',
        desc: 'A Classroom Gamification System built with TypeScript and modern web architectures.',
        stars: '1',
        forks: '0',
        url: 'https://github.com/SathasivamB/LevelUp-Classroom',
        thumb: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
        goals: 'Gamify educational workflows and increase student engagement with interactive achievement systems.',
        tools: 'TypeScript, Next.js, Node.js, TailwindCSS',
        outcomes: 'Zero-latency real-time score calculation and gamified classroom leaderboard.'
      },
      {
        id: 'gh_1410665227',
        name: 'pdf-insight-website',
        title: 'PDF Insight Platform',
        lang: 'HTML / JS',
        desc: 'AI-powered PDF document analysis and automated insights platform.',
        stars: '0',
        forks: '0',
        url: 'https://github.com/SathasivamB/pdf-insight-website',
        thumb: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
        goals: 'Extract structured intelligence and interactive conversational Q&A from multi-page PDFs.',
        tools: 'JavaScript, HTML5, REST APIs, AI Embeddings',
        outcomes: 'Sub-second document parsing with contextual question-answering interface.'
      },
      {
        id: 'gh_1188735303',
        name: 'onlineclipboard',
        title: 'Online Real-Time Clipboard',
        lang: 'JavaScript',
        desc: 'Real-time multi-device text and code snippet synchronization platform.',
        stars: '0',
        forks: '0',
        url: 'https://github.com/SathasivamB/onlineclipboard',
        thumb: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
        goals: 'Synchronize code and text snippets seamlessly across mobile and desktop devices without authentication friction.',
        tools: 'JavaScript, WebSockets, Node.js, Express',
        outcomes: 'Under 50ms multi-device delivery with persistent state restoration.'
      },
      {
        id: 'gh_1360465257',
        name: 'smart-apartment-capstone',
        title: 'Smart Apartment Management System',
        lang: 'HTML / JS',
        desc: 'Residential IoT and building operations management portal.',
        stars: '0',
        forks: '0',
        url: 'https://github.com/SathasivamB/smart-apartment-capstone',
        thumb: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=800&q=80',
        goals: 'Automate apartment utility controls, tenant ticketing, and building access control.',
        tools: 'HTML5, CSS3, JavaScript, REST Services',
        outcomes: 'End-to-end management portal for automated apartment facilities.'
      },
      {
        id: 'gh_secure_canvas',
        name: 'Secure-Canvas',
        title: 'Secure Canvas Web Platform',
        lang: 'JavaScript',
        desc: 'Protected digital drawing and canvas manipulation architecture.',
        stars: '0',
        forks: '0',
        url: 'https://github.com/SathasivamB/Secure-Canvas',
        thumb: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
        goals: 'Build a hardware-accelerated digital drawing surface with tamper-proof canvas export.',
        tools: 'HTML5 Canvas API, JavaScript, Web Security Protocols',
        outcomes: 'Smooth 60 FPS drawing with cryptographic canvas validation.'
      },
      {
        id: 'gh_smart_tailoring',
        name: 'smart-tailoring-capstone',
        title: 'Smart Tailoring Management Engine',
        lang: 'HTML / JS',
        desc: 'Custom apparel measurement, tracking, and bespoke order automation system.',
        stars: '0',
        forks: '0',
        url: 'https://github.com/SathasivamB/smart-tailoring-capstone',
        thumb: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=800&q=80',
        goals: 'Digitize bespoke tailoring measurements, customer specifications, and order delivery lifecycles.',
        tools: 'Modern JavaScript, Web Components, Responsive CSS',
        outcomes: 'Eliminated manual order errors and expedited garment fabrication timelines.'
      }
    ];

    repos.forEach(repo => {
      this.data.portfolio_items[repo.id] = {
        id: repo.id,
        platform_source: 'github',
        external_id: repo.name,
        media_type: 'code_snippet',
        title: repo.title,
        description: repo.desc,
        original_url: repo.url,
        embed_url: null,
        thumbnail_url: repo.thumb,
        duration: null,
        metrics: { stars: repo.stars, forks: repo.forks, language: repo.lang, updated: 'Active' },
        ai_case_study: {
          project_goals: repo.goals,
          tools_used: repo.tools,
          outcomes: repo.outcomes
        }
      };
    });

    const portfolio = {
      id: `port_${key}`,
      user_id: user.id,
      username: key,
      subdomain_slug: key,
      title: `${name} • ${role}`,
      tagline: 'Open Source Architecture, Reactive Systems & Modern Web Platforms',
      bio: user.bio,
      active_theme: 'creator-dark',
      palette: {
        id: 'amber-gold',
        name: 'Imperial Gold',
        primary: '#d4af37',
        accent: '#ffd700',
        bg: '#0c0a09',
        cardBg: '#14120f',
        border: 'rgba(212, 175, 55, 0.25)'
      },
      font_style: 'sans', // 'sans' | 'mono' | 'serif'
      selected_sections: [
        'hero',
        'metrics',
        'showcase',
        'case_studies',
        'tools',
        'pricing',
        'booking'
      ],
      item_ids: repos.map(r => r.id),
      metrics: [
        { label: 'Total Repositories', value: '73 Repos', change: 'Verified on GitHub' },
        { label: 'Core Tech Stack', value: 'TypeScript, JS, Java', change: 'Primary Languages' },
        { label: 'Open Source Delivery', value: '100%', change: 'Production Quality' },
        { label: 'Engineering Architecture', value: 'High Scale', change: 'Clean Code & CI/CD' }
      ],
      tools_arsenal: [
        { name: 'TypeScript', category: 'Typed Web Architectures', icon: '⚡' },
        { name: 'JavaScript & React', category: 'Reactive Frontend Engineering', icon: '⚛️' },
        { name: 'Java & Spring', category: 'Distributed Backend Systems', icon: '☕' },
        { name: 'Node.js & Express', category: 'High-Scale REST APIs', icon: '🚀' },
        { name: 'Git & GitHub Actions', category: 'CI/CD & DevOps Automation', icon: '🐙' },
        { name: 'HTML5 & Modern CSS', category: 'Responsive Interface Design', icon: '🌐' }
      ],
      pricing_packages: [
        {
          id: 'pkg_1',
          title: 'Full-Stack Web App Sprint',
          price: '$2,500',
          turnaround: '5 Days',
          deliverables: 'Production Web App, Responsive UI, REST APIs, CI/CD Deployment'
        },
        {
          id: 'pkg_2',
          title: 'Dedicated Engineering Retainer',
          price: '$4,800/mo',
          turnaround: 'Ongoing',
          deliverables: 'Dedicated Weekly Bandwidth, Feature Development & Code Reviews'
        },
        {
          id: 'pkg_3',
          title: 'System Architecture Advisory',
          price: '$150/hr',
          turnaround: 'Immediate',
          deliverables: 'Architecture Audit, Scalability Review & Technical Roadmap'
        }
      ],
      published_at: '2024-07-19T17:39:46.000Z',
      updated_at: new Date().toISOString()
    };

    this.data.portfolios[key] = portfolio;
    this.saveSnapshot(key, this.getPortfolio(key), 'Seeded Verified GitHub Account');
    this.save();
  }

  provisionCreator(rawUsername, displayName, roleTitle) {
    const key = rawUsername.toLowerCase().replace(/[^a-z0-9_-]/g, '') || 'creator';
    const name = displayName || (key.charAt(0).toUpperCase() + key.slice(1));
    const role = roleTitle || 'Creative Director & Video Producer';

    const user = this.data.users[key] || {
      id: `usr_${key}_01`,
      email: `${key}@creator.studio`,
      name: name,
      username: key,
      role: role,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      bio: `Directing cinematic commercial films, automated creator portfolios, and high-converting visual systems for global brands.`,
      custom_domain: `${key}.portfolio.studio`,
      created_at: new Date().toISOString()
    };
    this.data.users[key] = user;

    // Seed items
    const item1Id = `item_${key}_01`;
    const item2Id = `item_${key}_02`;
    const item3Id = `item_${key}_03`;

    this.data.portfolio_items[item1Id] = {
      id: item1Id,
      portfolio_id: `port_${key}_01`,
      platform_source: 'youtube',
      external_id: 'dQw4w9WgXcQ',
      media_type: 'video',
      title: 'Cinematic Commercial Reel 2026',
      description: 'Brand commercial directed with 4K color grading, fast-paced kinetic editing, and immersive sound design.',
      original_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      embed_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnail_url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
      duration: '1:45',
      metrics: { views: '142,500', engagement: '98.4%', likes: '12.8k' },
      ai_case_study: {
        project_goals: 'Increase top-of-funnel customer acquisition for luxury hardware launch.',
        tools_used: 'DaVinci Resolve Studio, RED Komodo 6K, Ableton Live 12',
        outcomes: 'Drove 4.2x ROAS and generated over $680,000 in launch week pre-orders.'
      }
    };

    this.data.portfolio_items[item2Id] = {
      id: item2Id,
      portfolio_id: `port_${key}_01`,
      platform_source: 'youtube',
      external_id: 'LXb3EKWsInQ',
      media_type: 'video',
      title: 'High-Impact Brand Motion & Visual Identity',
      description: 'Dynamic kinetic motion graphics and brand film showcase for global product rollout.',
      original_url: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
      embed_url: 'https://www.youtube.com/embed/LXb3EKWsInQ',
      thumbnail_url: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80',
      duration: '2:15',
      metrics: { views: '89,200', engagement: '96.2%', likes: '8.4k' },
      ai_case_study: {
        project_goals: 'Produce high-converting launch assets for international audience.',
        tools_used: 'Adobe After Effects, Cinema 4D, Octane Render',
        outcomes: 'Over 1.2M impressions and 45% increase in branded search volume.'
      }
    };

    this.data.portfolio_items[item3Id] = {
      id: item3Id,
      portfolio_id: `port_${key}_01`,
      platform_source: 'youtube',
      external_id: 'EngW7tLk6R8',
      media_type: 'video',
      title: 'Cyberpunk Vision OS - Product Reveal',
      description: 'Futuristic spatial interface design teaser combining 3D UI render passes with cinematic live-action.',
      original_url: 'https://www.youtube.com/watch?v=EngW7tLk6R8',
      embed_url: 'https://www.youtube.com/embed/EngW7tLk6R8',
      thumbnail_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
      duration: '1:12',
      metrics: { views: '64,100', engagement: '97.1%', likes: '6.2k' },
      ai_case_study: {
        project_goals: 'Direct teaser film for next-gen spatial computing interface.',
        tools_used: 'Unreal Engine 5.4, Blender 4.2, Final Cut Pro',
        outcomes: 'Featured across major design publications.'
      }
    };

    const portfolio = {
      id: `port_${key}_01`,
      user_id: user.id,
      username: key,
      subdomain_slug: key,
      title: `${name} • Creative Director & Systems Architect`,
      tagline: 'High-Converting Video Commercials & Motion Production',
      bio: `Directing cinematic commercial films, automated creator portfolios, and high-converting visual systems for global brands.`,
      active_theme: 'creator-dark',
      selected_sections: [
        'hero',
        'metrics',
        'showcase',
        'case_studies',
        'tools',
        'proofing',
        'testimonials',
        'pricing',
        'booking'
      ],
      item_ids: [item1Id, item2Id, item3Id],
      metrics: [
        { label: 'Verified Video Views', value: '2.4M+', change: '+48% YoY' },
        { label: 'Client Revenue Generated', value: '$1.8M', change: '4.8x ROAS' },
        { label: 'Commercial Deliveries', value: '42 Projects', change: '100% On-Time' },
        { label: 'Client Retention Rate', value: '94%', change: 'Top 1% Rated' }
      ],
      tools_arsenal: [
        { name: 'DaVinci Resolve Studio 19', category: 'Color Grading & Finishing', icon: '🎨' },
        { name: 'RED Komodo 6K & ARRI Mini LF', category: 'Cinematography & 4K Lighting', icon: '🎥' },
        { name: 'Adobe After Effects & Cinema 4D', category: 'Motion Graphics & 3D Render', icon: '⚡' },
        { name: 'Ableton Live 12 Suite', category: 'Spatial Sound Design & Mix', icon: '🎵' },
        { name: 'Unreal Engine 5.4', category: 'Virtual Production & Real-Time', icon: '🎮' },
        { name: 'TypeScript & WebGL', category: 'Interactive Digital Systems', icon: '💻' }
      ],
      testimonials: [
        {
          id: 't_01',
          client_name: 'Marcus Vance',
          client_role: 'VP of Global Marketing',
          company: 'Aether Hardware',
          quote: 'Delivered our launch film with unmatched visual fidelity. The campaign crushed our Q1 sales targets by 340%.',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
        },
        {
          id: 't_02',
          client_name: 'Elena Rostova',
          client_role: 'Founder & CEO',
          company: 'Kinetix Media',
          quote: 'The level of commercial storytelling, fast turnaround, and sound design was extraordinary. High-converting work.',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
        }
      ],
      proofing_draft: {
        title: 'Active Client Draft: Brand Commercial Launch (v3 Master Cut)',
        video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        timestamp_markers: [
          { time: '0:14', note: 'Color grade adjusted to warmer amber tone per brand identity' },
          { time: '0:38', note: 'Fast kinetic sound transition with deep sub-bass drop' },
          { time: '1:12', note: 'End-card CTA typography & legal disclaimer aligned' }
        ]
      },
      booking_slots: [
        { day: 'Thursday', time: '2:00 PM EST', type: '30-Min Strategy Call' },
        { day: 'Friday', time: '11:00 AM EST', type: 'Production Scope Audit' },
        { day: 'Monday', time: '4:00 PM EST', type: 'Retainer Discovery Session' }
      ],
      pricing_packages: [
        { id: 'pkg_1', title: 'Video Commercial Package', price: '$2,500', turnaround: '5 Days', deliverables: 'Full 4K Edit, Color Grade, Sound Design, 3 Hook Variations' },
        { id: 'pkg_2', title: 'Monthly Retainer', price: '$4,800/mo', turnaround: 'Ongoing', deliverables: '8 High-End Short Form Videos + 2 Long Form Case Studies' },
        { id: 'pkg_3', title: 'Consultation & Creative Direction', price: '$450/hr', turnaround: 'Immediate', deliverables: 'Storyboard Audit, Visual Strategy, Motion Pipeline Setup' }
      ],
      published_at: new Date().toISOString()
    };
    this.data.portfolios[key] = portfolio;

    this.saveSnapshot(key, portfolio, 'Genesis Creator Baseline');
    this.save();

    try {
      sqliteAdapter.saveUser(user);
      [item1Id, item2Id, item3Id].forEach(id => {
        const it = this.data.portfolio_items[id];
        if (it) sqliteAdapter.saveItem({ ...it, username: key });
      });
      sqliteAdapter.savePortfolio({ ...portfolio, username: key });
    } catch (err) {
      console.warn("SQLite provisionCreator sync error:", err.message);
    }

    return portfolio;
  }

  getUser(username, autoCreate = false) {
    if (!username) return null;
    const key = username.toLowerCase();
    if (!this.data.users[key]) {
      if (autoCreate || key === 'alexchen' || key === 'sathasivamb') {
        this.getOrCreatePortfolio(key);
      } else {
        return null;
      }
    }
    return this.data.users[key] || null;
  }

  saveUser(username, userObj) {
    this.data.users[username.toLowerCase()] = userObj;
    this.save();
    try {
      sqliteAdapter.saveUser(userObj);
    } catch (err) {
      console.warn("SQLite saveUser sync error:", err.message);
    }
    return userObj;
  }

  updateUserSubscription(username, { plan = 'trial_pro', billingCycle = 'monthly', deviceFingerprint = null }) {
    const key = (username || 'sathasivamb').toLowerCase();
    const user = this.getUser(key) || { username: key, name: key };
    
    const now = Date.now();
    const trialDurationMs = 7 * 24 * 60 * 60 * 1000;
    const trialStartedAt = user.trial_started_at || new Date(now).toISOString();
    const trialExpiresAt = user.trial_expires_at || new Date(now + trialDurationMs).toISOString();

    const subscription = {
      plan,
      billingCycle,
      status: 'active',
      trial_started_at: trialStartedAt,
      trial_expires_at: trialExpiresAt,
      device_fingerprint: deviceFingerprint || 'fp_active_device',
      features: {
        copilot_unlimited: true,
        custom_domain: true,
        vercel_deploy: true,
        omni_scraper: true,
        analytics_unlocked: true,
        watermark_removed: plan !== 'free'
      },
      activated_at: new Date(now).toISOString()
    };

    user.plan = plan;
    user.trial_started_at = trialStartedAt;
    user.trial_expires_at = trialExpiresAt;
    user.subscription = subscription;

    this.data.users[key] = user;
    this.save();
    try {
      sqliteAdapter.updateSubscription(key, subscription);
      sqliteAdapter.saveUser(user);
    } catch {}

    return { user, subscription };
  }

  getUserSubscription(username) {
    const key = (username || 'sathasivamb').toLowerCase();
    const user = this.getUser(key);
    if (!user) return null;

    const now = Date.now();
    const expiresMs = user.trial_expires_at ? new Date(user.trial_expires_at).getTime() : now + 7 * 24 * 60 * 60 * 1000;
    const remainingMs = Math.max(0, expiresMs - now);

    const remainingDays = Math.floor(remainingMs / (24 * 60 * 60 * 1000));
    const remainingHours = Math.floor((remainingMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const remainingMinutes = Math.floor((remainingMs % (60 * 60 * 1000)) / (60 * 1000));

    return {
      plan: user.plan || 'trial_pro',
      status: remainingMs > 0 ? 'active' : 'expired',
      trial_started_at: user.trial_started_at || new Date(now).toISOString(),
      trial_expires_at: user.trial_expires_at || new Date(expiresMs).toISOString(),
      remaining_ms: remainingMs,
      remaining_days: remainingDays,
      remaining_hours: remainingHours,
      remaining_minutes: remainingMinutes,
      countdown_label: `${remainingDays}d ${remainingHours}h ${remainingMinutes}m remaining`,
      features: user.subscription?.features || {
        copilot_unlimited: true,
        custom_domain: true,
        vercel_deploy: true,
        omni_scraper: true,
        analytics_unlocked: true,
        watermark_removed: user.plan !== 'free'
      }
    };
  }

  getPortfolio(username) {
    const key = (username || 'alexchen').toLowerCase();
    const port = this.data.portfolios[key];
    if (!port) return null;
    const items = (port.item_ids || [])
      .map(id => this.data.portfolio_items[id])
      .filter(Boolean);
    return { ...port, items };
  }

  getOrCreatePortfolio(username, displayName = null) {
    const key = (username || 'alexchen').toLowerCase().replace(/[^a-z0-9_-]/g, '') || 'alexchen';
    let port = this.getPortfolio(key);
    if (!port) {
      this.provisionCreator(key, displayName);
      port = this.getPortfolio(key);
    }
    return port;
  }

  configureCustomPortfolio(username, config) {
    const key = (username || 'alexchen').toLowerCase();
    const port = this.getOrCreatePortfolio(key);
    const user = this.getUser(key);

    if (config.name) user.name = config.name;
    if (config.role) user.role = config.role;
    if (config.bio) user.bio = config.bio;
    if (config.avatar) user.avatar = config.avatar;
    this.data.users[key] = user;

    const updated = {
      ...port,
      avatar: config.avatar || user?.avatar || port.avatar,
      title: config.title || `${user?.name || key} • ${config.role || user?.role || 'Developer'}`,
      bio: config.bio || port.bio,
      active_theme: config.active_theme || port.active_theme || 'creator-dark',
      palette: config.palette || port.palette || {
        id: 'amber-gold',
        name: 'Imperial Gold',
        primary: '#d4af37',
        accent: '#ffd700',
        bg: '#0c0a09',
        cardBg: '#14120f',
        border: 'rgba(212, 175, 55, 0.25)'
      },
      font_style: config.font_style || port.font_style || 'sans',
      selected_sections: config.selected_sections || port.selected_sections,
      sub_components: config.sub_components || config.subComponents || port.sub_components || {},
      custom_template: config.template || config.custom_template || port.custom_template,
      custom_sections: config.sections || config.custom_sections || port.custom_sections,
      custom_role: config.role || port.custom_role,
      custom_top_color: config.topColor || config.palette?.topColor || port.custom_top_color,
      custom_bottom_color: config.bottomColor || config.palette?.bottomColor || port.custom_bottom_color,
      custom_font_style: config.font_style || config.fontStyle || port.custom_font_style,
      pricing_packages: config.pricing_packages || port.pricing_packages,
      tools_arsenal: config.tools_arsenal || port.tools_arsenal,
      metrics: config.metrics || port.metrics,
      certifications: config.certifications || port.certifications || [],
      updated_at: new Date().toISOString()
    };

    const { items, ...cleanedPort } = updated;
    this.data.portfolios[key] = cleanedPort;
    this.saveSnapshot(key, this.getPortfolio(key), config.trigger || 'Custom Blueprint Setup');
    this.save();

    try {
      sqliteAdapter.saveUser(this.getUser(key));
      sqliteAdapter.savePortfolio(this.getPortfolio(key));
    } catch (err) {
      console.warn("SQLite configure sync error:", err.message);
    }

    return {
      user: this.getUser(key),
      portfolio: this.getPortfolio(key)
    };
  }

  savePortfolio(username, portfolioData, triggerLabel = 'Manual Update') {
    const key = username.toLowerCase();
    
    // Save items if passed
    if (Array.isArray(portfolioData.items)) {
      portfolioData.items.forEach(item => {
        if (item.id) {
          this.data.portfolio_items[item.id] = item;
          try {
            sqliteAdapter.saveItem({ ...item, username: key });
          } catch {}
        }
      });
      portfolioData.item_ids = portfolioData.items.map(i => i.id);
    }

    const { items, ...cleanedPort } = portfolioData;
    this.data.portfolios[key] = {
      ...this.data.portfolios[key],
      ...cleanedPort,
      updated_at: new Date().toISOString()
    };

    // Save snapshot in Antigravity Engine
    this.saveSnapshot(key, this.getPortfolio(key), triggerLabel);
    this.save();

    try {
      sqliteAdapter.savePortfolio(this.getPortfolio(key));
    } catch (err) {
      console.warn("SQLite savePortfolio sync error:", err.message);
    }

    return this.getPortfolio(key);
  }

  // Antigravity Engine: 10-state sequential history
  saveSnapshot(username, fullPortfolioState, triggerLabel) {
    const key = username.toLowerCase();
    if (!this.data.antigravity_snapshots[key]) {
      this.data.antigravity_snapshots[key] = {
        stack: [],
        pointer: -1
      };
    }

    const session = this.data.antigravity_snapshots[key];
    const trimmed = session.stack.slice(0, session.pointer + 1);

    const snap = {
      id: `snap_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      trigger: triggerLabel,
      state: JSON.parse(JSON.stringify(fullPortfolioState))
    };

    trimmed.push(snap);
    if (trimmed.length > 10) trimmed.shift();

    session.stack = trimmed;
    session.pointer = trimmed.length - 1;
  }

  antigravityUndo(username) {
    const key = username.toLowerCase();
    const session = this.data.antigravity_snapshots[key];
    if (!session || session.pointer <= 0) {
      return { success: false, message: 'At genesis baseline. No prior Antigravity states available.' };
    }

    session.pointer -= 1;
    const current = session.stack[session.pointer];
    this.data.portfolios[key] = current.state;
    this.save();

    return {
      success: true,
      portfolio: current.state,
      pointer: session.pointer,
      total: session.stack.length,
      trigger: current.trigger
    };
  }

  antigravityRedo(username) {
    const key = username.toLowerCase();
    const session = this.data.antigravity_snapshots[key];
    if (!session || session.pointer >= session.stack.length - 1) {
      return { success: false, message: 'At latest snapshot. Cannot redo forward.' };
    }

    session.pointer += 1;
    const current = session.stack[session.pointer];
    this.data.portfolios[key] = current.state;
    this.save();

    return {
      success: true,
      portfolio: current.state,
      pointer: session.pointer,
      total: session.stack.length,
      trigger: current.trigger
    };
  }

  getSnapshotMeta(username) {
    const key = username.toLowerCase();
    const session = this.data.antigravity_snapshots[key];
    const stack = session?.stack || session?.snapshots || [];
    const pointer = typeof session?.pointer === 'number' ? session.pointer : 0;
    if (!session || stack.length === 0) {
      return { currentIndex: 0, totalSnapshots: 1, canUndo: false, canRedo: false, currentSnapshot: null };
    }
    return {
      currentIndex: pointer,
      totalSnapshots: stack.length,
      canUndo: pointer > 0,
      canRedo: pointer < stack.length - 1,
      currentSnapshot: stack[pointer] || stack[stack.length - 1]
    };
  }

  // Dynamic Client Pitch Personalization
  createClientPitch(username, { clientName, clientIndustry, customHeadline, selectedItemIds }) {
    const pitchId = `pitch_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const basePort = this.getOrCreatePortfolio(username);
    if (!basePort) return null;

    const pitch = {
      id: pitchId,
      portfolio_id: basePort.id,
      creator_username: username,
      client_name: clientName,
      client_industry: clientIndustry,
      custom_headline: customHeadline || `Curated Freelance Works for ${clientName}`,
      selected_item_ids: selectedItemIds || basePort.item_ids,
      secret_slug: `${username}-for-${clientName.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      views_count: 0,
      created_at: new Date().toISOString()
    };

    this.data.client_pitches[pitch.secret_slug] = pitch;
    this.save();
    try {
      sqliteAdapter.savePitch(pitch);
    } catch (err) {
      console.warn("SQLite savePitch sync error:", err.message);
    }
    return pitch;
  }

  getClientPitch(secretSlug) {
    return this.data.client_pitches[secretSlug] || null;
  }
}

export const db = new DatabaseEngine();
