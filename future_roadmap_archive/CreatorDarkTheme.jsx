import React, { useState } from 'react';
import { 
  Play, 
  Eye, 
  Award, 
  ExternalLink, 
  Calendar, 
  Check, 
  Sparkles, 
  Film, 
  ArrowRight, 
  ShieldCheck, 
  Mail, 
  Wrench, 
  Clock, 
  Star, 
  CheckCircle2,
  Code,
  GitBranch
} from 'lucide-react';
import { GithubIcon } from '../Icons';

export default function CreatorDarkTheme({ portfolio, onOpenVideo, onBookConsultation }) {
  const { 
    title, 
    tagline, 
    bio, 
    items = [], 
    pricing_packages = [], 
    metrics = [],
    tools_arsenal = [],
    testimonials = [],
    proofing_draft = null,
    booking_slots = [],
    selected_sections = null,
    username = 'creator'
  } = portfolio || {};

  const activeSections = selected_sections || ['hero', 'metrics', 'showcase', 'case_studies', 'tools', 'proofing', 'testimonials', 'pricing', 'booking'];
  const hasSection = (key) => activeSections.includes(key);

  const isDeveloper = (items || []).some(i => i?.platform_source === 'github' || i?.media_type === 'code_snippet') ||
    (title && /software|engineer|architect|systems|full-stack/i.test(title));

  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  return (
    <div className="min-h-full bg-[#0c0a09] text-[#f5f0e6] font-serif p-6 sm:p-12 space-y-16">
      
      {/* 1. Hero Section */}
      {hasSection('hero') && (
        <section className="space-y-6 max-w-4xl mx-auto text-center pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1c1813] border border-[#d4af37]/40 text-xs font-serif text-[#d4af37]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{isDeveloper ? 'Available for Full-Stack Architecture & Engineering Sprints' : 'Available for Video Direction & Commercial Contracts'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-heading font-extrabold tracking-wide text-white leading-tight">
            {title || (isDeveloper ? 'Sathasivam B • Full-Stack Software Engineer' : 'Alex Chen • Creative Director')}
          </h1>

          <p className="text-base sm:text-lg text-[#dcd6ca] font-serif max-w-2xl mx-auto italic">
            "{tagline || (isDeveloper ? 'Open Source Architecture, Reactive Systems & Modern Web Platforms' : 'Directing high-converting video commercials, brand reels, and digital systems.')}"
          </p>

          <p className="text-xs sm:text-sm text-[#c4bcaf] max-w-xl mx-auto leading-relaxed font-sans">
            {bio}
          </p>
        </section>
      )}

      {/* 2. Aggregate Stats Proof Banner */}
      {hasSection('metrics') && (
        <section className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#14120f] border border-[#d4af37]/20 text-center">
            {((metrics && metrics.length > 0) ? metrics : [
              { label: isDeveloper ? 'Total Repos' : 'Video Views', value: isDeveloper ? '73 Repos' : '2.4M+', change: isDeveloper ? 'Verified GitHub' : '+48% YoY' },
              { label: isDeveloper ? 'Core Stack' : 'Revenue Generated', value: isDeveloper ? 'TypeScript & JS' : '$1.8M', change: isDeveloper ? 'Clean Code' : '4.8x ROAS' },
              { label: isDeveloper ? 'Delivery Rate' : 'Turnaround Time', value: isDeveloper ? '100%' : '48 Hrs', change: 'Production' },
              { label: isDeveloper ? 'Code Quality' : 'Retention Rate', value: isDeveloper ? 'Top Tier' : '98.8%', change: 'Verified' }
            ]).map((m, i) => (
              <div key={i} className="p-2">
                <span className="block text-2xl font-heading font-bold text-[#f3e5ab]">{m.value}</span>
                <span className="text-[11px] uppercase tracking-wider text-stone-400 block mt-0.5">{m.label}</span>
                <span className="text-[10px] text-emerald-400 font-sans">{m.change}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Featured Video Works Grid */}
      {hasSection('showcase') && items.length > 0 && (
        <section className="space-y-8 max-w-5xl mx-auto">
          <div className="flex items-center justify-between border-b border-[#d4af37]/30 pb-4">
            <div>
              <div className="text-xs font-serif uppercase tracking-widest text-[#d4af37]">
                {isDeveloper ? 'Open-Source Architecture' : 'Commercial Showcases'}
              </div>
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-white">
                {isDeveloper ? 'Selected Repositories & Architecture Case Studies' : 'Selected Works & AI Case Studies'}
              </h2>
            </div>
            <span className="text-xs font-serif text-stone-400">
              {items.length} {isDeveloper ? 'Repositories' : 'Production Reels'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {items.map((item) => {
              const isItemCode = item?.platform_source === 'github' || item?.media_type === 'code_snippet';
              return (
                <div
                  key={item.id}
                  onClick={() => onOpenVideo && onOpenVideo(item)}
                  className="group rounded-2xl traditional-card overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:border-[#d4af37]"
                >
                  <div className="aspect-video w-full relative overflow-hidden bg-black">
                    <img
                      src={item.thumbnail_url}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-85 group-hover:opacity-100"
                    />

                    {isItemCode ? (
                      <>
                        <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider bg-black/85 text-[#ffd700] border border-[#d4af37]/40 flex items-center gap-1.5">
                          <Code className="w-3 h-3 text-[#ffd700]" />
                          <span>GitHub • {item.metrics?.language || 'Code'}</span>
                        </div>

                        {item.metrics?.stars !== undefined && (
                          <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-[#f3e5ab] border border-stone-800">
                            ★ {item.metrics.stars} | ⑂ {item.metrics.forks || 0}
                          </span>
                        )}

                        <div className="absolute inset-0 flex items-center justify-center bg-black/25 group-hover:bg-black/10 transition-colors">
                          <div className="px-4 py-2 rounded-lg bg-[#d4af37] text-[#1a1405] font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-2xl transition-transform duration-300 group-hover:scale-105">
                            <Code className="w-4 h-4" />
                            <span>Inspect Architecture</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {item.duration && (
                          <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-[#f3e5ab] border border-stone-800">
                            {item.duration}
                          </span>
                        )}

                        <div className="absolute inset-0 flex items-center justify-center bg-black/25 group-hover:bg-black/10 transition-colors">
                          <div className="w-14 h-14 rounded-full bg-[#d4af37] text-[#1a1405] flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110">
                            <Play className="w-6 h-6 fill-current ml-1" />
                          </div>
                        </div>

                        <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-serif uppercase tracking-wider bg-black/80 text-[#d4af37] border border-[#d4af37]/40">
                          {item.platform_source || 'Video'}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="p-6 space-y-3 bg-[#151311]">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-heading font-bold text-white group-hover:text-[#d4af37] transition-colors">
                        {item.title}
                      </h3>
                      {isItemCode && (
                        <a
                          href={item.original_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="px-2 py-1 rounded bg-[#1f1a14] border border-[#d4af37]/40 text-[#ffd700] hover:text-white text-[10px] font-sans transition-colors flex items-center gap-1 flex-shrink-0"
                          title="Open repo on GitHub"
                        >
                          <GithubIcon className="w-3 h-3" />
                          <span>GitHub ↗</span>
                        </a>
                      )}
                    </div>

                    <p className="text-xs text-[#c4bcaf] leading-relaxed font-sans line-clamp-2">
                      {item.description}
                    </p>

                    {hasSection('case_studies') && item.ai_case_study && (
                      <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-[11px] font-serif text-[#d4af37]">
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          {isItemCode ? 'Architecture Case Study' : 'AI Breakdown Attached'}
                        </span>
                        <span className="text-stone-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5">
                          Inspect Case Study <ArrowRight className="w-3 h-3 ml-0.5" />
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. Tooling Arsenal & Tech Stack */}
      {hasSection('tools') && (tools_arsenal || []).length > 0 && (
        <section className="space-y-6 max-w-5xl mx-auto border-t border-[#d4af37]/20 pt-10">
          <div>
            <div className="text-xs font-serif uppercase tracking-widest text-[#d4af37]">{isDeveloper ? 'Core Toolchains' : 'Industrial Suite'}</div>
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-white">{isDeveloper ? 'Engineering Tooling Arsenal' : 'Creative Tooling Arsenal'}</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {tools_arsenal.map((t, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-[#14120f] border border-[#d4af37]/20 flex items-center gap-3">
                <span className="text-2xl">{t.icon || '⚡'}</span>
                <div>
                  <h4 className="text-xs font-bold text-white font-sans">{t.name}</h4>
                  <span className="text-[10px] text-[#a89f91] font-sans">{t.category}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. In-Portfolio Video Proofing Portal */}
      {hasSection('proofing') && proofing_draft && (
        <section className="max-w-5xl mx-auto border-t border-[#d4af37]/20 pt-10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-serif uppercase tracking-widest text-[#d4af37]">Client Operations</div>
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-white">Interactive In-Portfolio Video Proofing</h2>
            </div>
            <span className="text-[11px] text-emerald-400 font-mono bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-500/30">
              ● Active Proofing Room
            </span>
          </div>

          <div className="rounded-2xl bg-[#14120f] border border-[#d4af37]/30 p-5 grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-2 aspect-video bg-black rounded-xl overflow-hidden border border-white/10">
              <iframe src={proofing_draft.video_url} className="w-full h-full" title="Proofing" allowFullScreen />
            </div>
            <div className="space-y-3 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-[#d4af37] font-sans uppercase">Timestamp Markers</h4>
                <div className="space-y-2 mt-2">
                  {(proofing_draft.timestamp_markers || []).map((m, idx) => (
                    <div key={idx} className="p-2 rounded bg-black/50 border border-white/5 text-[11px]">
                      <span className="font-mono text-[#ffd700] font-bold">{m.time}</span>: {m.note}
                    </div>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={() => alert("Proofing marker added! Transmitted to creator in real time.")}
                className="w-full py-2 rounded-lg bg-[#d4af37] text-[#0c0a09] font-sans font-bold text-xs uppercase"
              >
                Add Marker (0:24)
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 6. Client Testimonials */}
      {hasSection('testimonials') && (testimonials || []).length > 0 && (
        <section className="max-w-5xl mx-auto border-t border-[#d4af37]/20 pt-10 space-y-6">
          <div>
            <div className="text-xs font-serif uppercase tracking-widest text-[#d4af37]">Client Endorsements</div>
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-white">Verified Commercial Impact</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t) => (
              <div key={t.id} className="p-6 rounded-2xl bg-[#14120f] border border-[#d4af37]/25 flex flex-col justify-between space-y-4">
                <div className="flex gap-1 text-[#ffd700]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-[#dcd1be] italic font-serif leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                  <img src={t.avatar} alt={t.client_name} className="w-8 h-8 rounded-full object-cover border border-[#d4af37]/40" />
                  <div>
                    <h4 className="text-xs font-bold text-white font-sans">{t.client_name}</h4>
                    <span className="text-[10px] text-[#a89f91] font-sans">{t.client_role} • {t.company}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. Retainer Pricing Packages */}
      {hasSection('pricing') && pricing_packages.length > 0 && (
        <section id="packages" className="space-y-8 max-w-5xl mx-auto border-t border-[#d4af37]/30 pt-12">
          <div className="text-center space-y-2">
            <div className="text-xs font-serif uppercase tracking-widest text-[#d4af37]">
              Commercial Engagements
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white">
              Creative Retainers & Fixed-Price Packages
            </h2>
            <p className="text-xs text-[#c4bcaf] max-w-md mx-auto">
              Book directly without agency markups. Fixed turnarounds and guaranteed revisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricing_packages.map((pkg, idx) => (
              <div
                key={pkg.id || idx}
                className={`p-6 sm:p-8 rounded-2xl traditional-card space-y-5 flex flex-col justify-between ${
                  idx === 1 ? 'border-[#d4af37] shadow-xl' : ''
                }`}
              >
                <div className="space-y-3">
                  {idx === 1 && (
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-serif uppercase tracking-wider bg-[#d4af37] text-[#1a1405] font-bold">
                      Most In-Demand
                    </span>
                  )}
                  <h3 className="text-lg font-heading font-bold text-white">
                    {pkg.title}
                  </h3>
                  <div className="text-2xl sm:text-3xl font-heading font-extrabold text-[#f3e5ab]">
                    {pkg.price}
                  </div>
                  <div className="text-xs text-stone-400">
                    Turnaround: <strong className="text-white">{pkg.turnaround}</strong>
                  </div>
                  <p className="text-xs text-[#c4bcaf] pt-2 border-t border-stone-800 leading-relaxed font-sans">
                    {pkg.deliverables}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => alert(`Direct booking initialized for: ${pkg.title}. Connect Stripe/Deposit Gateway to finalize.`)}
                  className="w-full py-2.5 rounded-lg traditional-gold-btn text-xs font-serif text-center mt-4"
                >
                  Book Package Now
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 8. Live Consultation Calendar Booking */}
      {hasSection('booking') && (booking_slots || []).length > 0 && (
        <section className="max-w-5xl mx-auto border-t border-[#d4af37]/20 pt-10">
          <div className="p-6 rounded-2xl bg-[#14120f] border border-[#d4af37]/30 space-y-4">
            <div>
              <div className="text-xs font-serif uppercase tracking-widest text-[#d4af37]">Discovery Call</div>
              <h3 className="text-lg font-heading font-bold text-white">Schedule 1-on-1 Creative Direction Call</h3>
            </div>
            {bookingConfirmed ? (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center text-xs text-emerald-300 font-sans">
                ✓ Confirmed for {selectedSlot?.day} at {selectedSlot?.time}! Calendar invite dispatched.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {booking_slots.map((s, idx) => (
                  <div
                    key={idx}
                    onClick={() => { setSelectedSlot(s); setBookingConfirmed(true); }}
                    className="p-3.5 rounded-xl border border-white/10 hover:border-[#ffd700] bg-black/40 cursor-pointer text-center transition-colors"
                  >
                    <span className="font-mono text-[#ffd700] text-xs font-bold block">{s.day}</span>
                    <span className="text-sm font-bold text-white block my-1">{s.time}</span>
                    <span className="text-[10px] text-zinc-400">{s.type}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="max-w-4xl mx-auto text-center space-y-4 pt-12 border-t border-[#d4af37]/20">
        <h3 className="text-xl font-heading font-bold text-white">
          Have an upcoming campaign or custom production?
        </h3>
        <p className="text-xs text-[#c4bcaf]">
          Direct correspondence: <a href={`mailto:${portfolio?.username || username || 'creator'}@studio.com`} className="text-[#d4af37] underline">{portfolio?.username || username || 'creator'}@studio.com</a>
        </p>
        <p className="text-[11px] font-serif text-stone-500 pt-6">
          ❖ POWERED BY ONE-CLICK CREATOR PORTFOLIO GENERATOR • 2026 ❖
        </p>
      </footer>

    </div>
  );
}
