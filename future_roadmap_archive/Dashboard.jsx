import React, { useState } from 'react';
import { 
  LogOut, 
  Sparkles, 
  ExternalLink, 
  ShieldCheck, 
  Globe, 
  Copy, 
  Check, 
  Eye, 
  Plus, 
  Settings, 
  Layers, 
  Code2, 
  TrendingUp, 
  Clock, 
  ArrowRight 
} from 'lucide-react';
import AgentFolioLogo from '../components/AgentFolioLogo';

export default function Dashboard({ user, onLogout, onEditPortfolio, onCreateNew }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'portfolios' | 'templates' | 'projects'

  const username = user?.username || 'alex-morgan';
  const name = user?.name || 'Alex Morgan';
  const role = user?.role || 'Full-stack engineer · Lisbon';
  const portfolioUrl = `http://localhost:5000/u/${username}`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(portfolioUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F3F4F8] text-[#0A0A12] font-sans selection:bg-[#FFD84D] selection:text-[#0A0A12] flex flex-col">
      
      {/* ============================================================== */}
      {/* TOP PILL NAVIGATION BAR (Matching 03_Dashboard.html of v2)     */}
      {/* ============================================================== */}
      <header className="border-b-2 border-[#0A0A12] bg-[#FFFFFF] px-6 md:px-14 py-5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="lg cursor-pointer">
          <i></i>folio
        </div>

        {/* Navigation Pills & User Avatar */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'portfolios', label: 'Portfolios' },
              { id: 'templates', label: 'Templates' },
              { id: 'projects', label: 'Projects' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pill text-xs min-h-[40px] px-4 font-bold ${
                  activeTab === tab.id ? 'b1' : 'b2'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* User Avatar Circle */}
          <div className="flex items-center gap-3 pl-2 sm:border-l-2 sm:border-[#0A0A12]/15">
            <div 
              className="w-10 h-10 rounded-full bg-[#FFD84D] border-2 border-[#0A0A12] flex items-center justify-center font-bold font-space text-sm text-[#0A0A12] shadow-neo-sm overflow-hidden"
              title={name}
            >
              {user?.avatar ? (
                <img src={user.avatar} alt={name} className="w-full h-full object-cover" />
              ) : (
                name.slice(0, 2).toUpperCase()
              )}
            </div>

            <button 
              onClick={onLogout}
              className="pill b2 text-xs min-h-[38px] px-3 font-mono flex items-center gap-1.5"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* MAIN WORKSPACE CONTENT (Matching 03_Dashboard.html of v2)       */}
      {/* ============================================================== */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto p-6 md:p-14 space-y-8">
        
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-space text-4xl sm:text-6xl font-bold tracking-tight text-[#0A0A12]">
              Your portfolio workspace
            </h1>
            <p className="text-base text-[#55586B] mt-2">
              Edit, publish and track your work in one place.
            </p>
          </div>

          <button
            onClick={onCreateNew || onEditPortfolio}
            className="pill b1 gap-2 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create new portfolio</span>
          </button>
        </div>

        {/* 2-Column Split: Active Portfolio Card & Big Yellow Visits Box */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6">
          
          {/* Active Portfolio Card */}
          <div className="bx flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Dark Mini Preview Box */}
            <div className="w-full sm:w-56 h-36 rounded-2xl bg-[#0A0A12] text-white p-5 border-2 border-[#0A0A12] flex flex-col justify-between shrink-0 shadow-neo-sm">
              <div>
                <b className="font-space text-lg block">{name}</b>
                <p className="text-xs text-white/70 font-mono mt-0.5">{role}</p>
              </div>
              <span className="tg bg-[#7CFFB2] text-[#0A0A12] text-[10px] w-fit">
                Live · Monolith
              </span>
            </div>

            {/* Details & Actions */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h2 className="font-space text-2xl font-bold text-[#0A0A12]">{name}</h2>
                <span className="tg bg-[#7CFFB2] text-xs">Published</span>
              </div>
              
              <p className="text-xs text-[#55586B] font-mono">
                Template: Monolith · Address: <span className="font-bold text-[#0A0A12]">{username}.folio.ai</span> · Edited recently
              </p>

              <div className="flex flex-wrap items-center gap-2.5 pt-3">
                <button 
                  onClick={onEditPortfolio}
                  className="pill b1 text-xs min-h-[40px] px-5"
                >
                  Edit portfolio
                </button>
                <a 
                  href={`/u/${username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pill b2 text-xs min-h-[40px] px-4 flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </a>
                <button 
                  onClick={handleCopyLink}
                  className="pill b2 text-xs min-h-[40px] px-4 flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#0A7A4F]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy link'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Cyber Yellow Visits Metric Card */}
          <div 
            className="bx bx-yellow flex flex-col justify-between"
            style={{ backgroundColor: '#FFD84D', color: '#0A0A12' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0A0A12] uppercase font-space">Analytics Overview</span>
              <span className="tg bg-white text-[10px]">Sample data</span>
            </div>
            
            <div className="my-3">
              <h2 className="font-space text-6xl font-bold text-[#0A0A12] tracking-tight">1,284</h2>
              <p className="text-sm font-bold text-[#0A0A12] mt-1">visits this month</p>
            </div>

            <p className="text-xs text-[#0A0A12]/80 font-mono">
              ↑ 18% increase across developer referrals
            </p>
          </div>

        </div>

        {/* 3-Column Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bx">
            <p className="text-xs text-[#55586B] font-bold font-space uppercase">Views (sample)</p>
            <h2 className="font-space text-4xl font-bold text-[#0A0A12] mt-2">3,902</h2>
            <p className="text-xs text-[#55586B] font-mono mt-1">Page interactions</p>
          </div>

          <div className="bx">
            <p className="text-xs text-[#55586B] font-bold font-space uppercase">Link clicks (sample)</p>
            <h2 className="font-space text-4xl font-bold text-[#0A0A12] mt-2">217</h2>
            <p className="text-xs text-[#55586B] font-mono mt-1">GitHub &amp; contact leads</p>
          </div>

          <div 
            className="bx bx-blue text-white flex flex-col justify-between"
            style={{ backgroundColor: '#2340FF', color: '#FFFFFF' }}
          >
            <div>
              <h3 className="font-space text-xl font-bold text-white">Quick actions</h3>
              <p className="text-sm text-white/85 mt-1">Customize · Publish · Manage projects</p>
            </div>
            <button 
              onClick={onEditPortfolio}
              className="pill by text-xs min-h-[36px] w-fit mt-4"
            >
              Open Studio →
            </button>
          </div>
        </div>

        {/* 2-Column Activity & Empty State */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bx space-y-3">
            <h3 className="font-space text-xl font-bold text-[#0A0A12]">Recent activity</h3>
            <div className="space-y-2.5 text-xs text-[#55586B]">
              <p className="flex items-center justify-between py-1.5 border-b-2 border-[#0A0A12]/10">
                <span className="font-bold text-[#0A0A12]">Published {name}</span>
                <span className="font-mono">2 hours ago</span>
              </p>
              <p className="flex items-center justify-between py-1.5 border-b-2 border-[#0A0A12]/10">
                <span className="font-bold text-[#0A0A12]">Added project lumen</span>
                <span className="font-mono">yesterday</span>
              </p>
              <p className="flex items-center justify-between py-1.5">
                <span className="font-bold text-[#0A0A12]">Switched template to Monolith</span>
                <span className="font-mono">3 days ago</span>
              </p>
            </div>
          </div>

          <div className="bx border-dashed space-y-3 bg-white/60">
            <h3 className="font-space text-xl font-bold text-[#0A0A12]">Create another portfolio</h3>
            <p className="text-sm text-[#55586B] leading-relaxed">
              Target a different client niche, agency pitch, or creative direction in minutes.
            </p>
            <button 
              onClick={onCreateNew || onEditPortfolio}
              className="pill b2 text-xs min-h-[40px]"
            >
              + Add new portfolio
            </button>
          </div>
        </div>

      </main>

    </div>
  );
}
