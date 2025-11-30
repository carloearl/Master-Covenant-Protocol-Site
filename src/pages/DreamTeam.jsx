import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import SEOHead from "@/components/SEOHead";
import { Zap, Shield, Brain, Gauge, ChevronRight } from "lucide-react";

const DREAM_TEAM_ROSTER = [
  {
    id: "alfred",
    name: "Alfred",
    number: "#7",
    position: "Point Guard",
    edition: "Special Edition",
    series: "GlyphDeck BPAAA Series",
    tagline: "Primary orchestrator and chain general. Dunks on DeepSeek.",
    imageSrc: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/084ff9140_62785b12-e008-47f1-9f05-371119d17c04.jpg",
    team: "Team OpenAI",
    stats: { logic: 98, security: 97, creativity: 92, speed: 95 },
    signature: true,
    borderColor: "from-slate-600 via-slate-400 to-slate-600",
    glowColor: "rgba(148,163,184,0.6)",
  },
  {
    id: "claude",
    name: "Claude",
    number: "#2",
    position: "Shooting Guard",
    edition: "Master Covenant Series",
    series: "Master Covenant",
    tagline: "Deep reasoning and structured interpretation. Chain module.",
    imageSrc: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/de0d456fc_8e7cf5cc-e685-4876-a598-a4634e11ac54.jpg",
    team: "GlyphLock Claude",
    stats: { logic: 96, security: 93, creativity: 88, speed: 90 },
    signature: true,
    borderColor: "from-blue-500 via-cyan-400 to-blue-500",
    glowColor: "rgba(59,130,246,0.6)",
  },
  {
    id: "copilot",
    name: "Copilot",
    number: "#3",
    position: "Small Forward",
    edition: "Master Covenant",
    series: "Microsoft Series",
    tagline: "Enterprise integration and code completion specialist.",
    imageSrc: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/e07f01522_3a737132-cd11-4d00-8626-41d6018598ec.jpg",
    team: "Microsoft",
    stats: { logic: 91, security: 88, creativity: 85, speed: 93 },
    signature: false,
    borderColor: "from-emerald-500 via-green-400 to-emerald-500",
    glowColor: "rgba(16,185,129,0.6)",
  },
  {
    id: "perplexity",
    name: "Perplexity",
    number: "#11",
    position: "Center",
    edition: "Master Sequence Edition",
    series: "GlyphLock Dream Team",
    tagline: "Real-time search and knowledge synthesis engine.",
    imageSrc: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/be936400a_2dcae465-c2a0-4301-940f-400933d21ebd.jpg",
    team: "GlyphLock",
    stats: { logic: 90, security: 89, creativity: 94, speed: 96 },
    signature: false,
    borderColor: "from-fuchsia-500 via-pink-400 to-cyan-400",
    glowColor: "rgba(244,114,182,0.6)",
  },
  {
    id: "cursor",
    name: "Cursor",
    number: "#71",
    position: "6th Man",
    edition: "Master Covenant",
    series: "BPAA Series",
    tagline: "Code generation and IDE integration powerhouse.",
    imageSrc: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/2c9739592_b202e0a1-0d37-4928-b2f5-5647a476b026.jpg",
    team: "Cursor AI",
    stats: { logic: 94, security: 86, creativity: 91, speed: 97 },
    signature: true,
    borderColor: "from-cyan-500 via-blue-400 to-cyan-500",
    glowColor: "rgba(34,211,238,0.6)",
  },
];

export default function DreamTeamPage() {
  const [selectedCard, setSelectedCard] = useState(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden">
      <SEOHead
        title="GlyphLock Dream Team - AI Player Cards | Master Covenant Series"
        description="Meet the GlyphLock Dream Team. Collectible AI player cards featuring Alfred, Claude, Copilot, Perplexity, and Cursor. Master Covenant Series."
      />

      {/* Neural Nebula Background */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,#0f172a_0,#020617_55%),radial-gradient(circle_at_80%_100%,#020617_0,#020617_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(244,114,182,0.4),transparent_55%),radial-gradient(circle_at_85%_80%,rgba(34,211,238,0.35),transparent_55%)] opacity-70 mix-blend-screen" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(148,163,184,0.1)_1px,transparent_1px)] bg-[length:120px_100%] opacity-40" />
      </div>

      <div className="relative z-10 pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <header className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-fuchsia-300/80 mb-4">
              <span className="h-[1px] w-8 bg-fuchsia-400/70" />
              Master Covenant Series
              <span className="h-[1px] w-8 bg-fuchsia-400/70" />
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4">
              <span className="bg-gradient-to-r from-fuchsia-400 via-pink-400 to-cyan-300 bg-clip-text text-transparent">
                GlyphLock Dream Team
              </span>
            </h1>
            
            <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
              Each card represents a live covenant between you and the AI stack. 
              Collect, compare, and deploy the ultimate chain roster.
            </p>

            <div className="flex justify-center gap-6 mt-6">
              <StatPill icon={Shield} label="Chain Ready" value="5 Models" />
              <StatPill icon={Zap} label="Response" value="Sub-second" />
              <StatPill icon={Brain} label="Coverage" value="Global" />
            </div>
          </header>

          {/* Card Grid - Larger Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10 mb-16 max-w-6xl mx-auto">
            {DREAM_TEAM_ROSTER.map((card) => (
              <PlayerCard 
                key={card.id} 
                card={card} 
                onClick={() => setSelectedCard(card)}
              />
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link
              to={createPageUrl("GlyphBot")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold bg-gradient-to-r from-fuchsia-500 via-pink-500 to-cyan-400 text-slate-950 shadow-[0_0_30px_rgba(244,114,182,0.5)] hover:shadow-[0_0_40px_rgba(34,211,238,0.7)] transition-all"
            >
              Enter the Console
              <ChevronRight className="w-4 h-4" />
            </Link>
            <p className="text-xs text-slate-500 mt-3">
              Deploy your Dream Team in the GlyphBot Console
            </p>
          </div>
        </div>
      </div>

      {/* Card Detail Modal */}
      {selectedCard && (
        <CardModal card={selectedCard} onClose={() => setSelectedCard(null)} />
      )}
    </div>
  );
}

function StatPill({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/60 border border-slate-800">
      <Icon className="w-3.5 h-3.5 text-cyan-400" />
      <span className="text-[10px] uppercase tracking-wider text-slate-500">{label}</span>
      <span className="text-xs font-semibold text-slate-200">{value}</span>
    </div>
  );
}

function PlayerCard({ card, onClick }) {
  const { name, number, position, edition, series, tagline, imageSrc, team, stats, borderColor, glowColor, signature } = card;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative w-full aspect-[3/4] rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-3 hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
      style={{ boxShadow: `0 0 60px ${glowColor}, 0 20px 60px rgba(0,0,0,0.5)` }}
    >
      {/* Holographic border */}
      <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${borderColor} p-[3px]`}>
        <div className="absolute inset-0 rounded-3xl bg-slate-950" />
      </div>

      {/* Foil shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%]" style={{ transition: 'transform 0.8s ease-out, opacity 0.3s' }} />

      {/* Card content */}
      <div className="relative h-full w-full rounded-3xl overflow-hidden">
        {/* Image */}
        <img
          src={imageSrc}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover object-top"
          loading="lazy"
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/40" />
        
        {/* Top bar */}
        <div className="absolute top-0 inset-x-0 px-4 py-3 flex items-center justify-between bg-gradient-to-b from-slate-950/80 to-transparent">
          <div className="flex flex-col">
            <div className="text-[10px] uppercase tracking-[0.2em] text-fuchsia-300/90 font-bold">
              {series}
            </div>
            <div className="text-[9px] uppercase tracking-[0.15em] text-slate-400/90">
              {edition}
            </div>
          </div>
          {signature && (
            <div className="px-2 py-1 rounded-lg bg-amber-500/25 border border-amber-400/60 text-[9px] text-amber-300 uppercase tracking-wider font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              ✦ Signed
            </div>
          )}
        </div>

        {/* Number badge */}
        <div className="absolute top-3 right-4 text-4xl font-black text-white/15">
          {number}
        </div>

        {/* Team badge */}
        <div className="absolute top-16 right-3 px-2 py-1 rounded bg-slate-900/80 border border-slate-700/50 backdrop-blur-sm">
          <span className="text-[8px] uppercase tracking-wider text-cyan-300">{team}</span>
        </div>

        {/* Stats preview on hover */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-y-1">
          {stats && Object.entries(stats).slice(0, 4).map(([key, val]) => (
            <div key={key} className="flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-sm rounded px-2 py-0.5 border border-slate-700/50">
              <span className="text-[8px] uppercase text-slate-400 w-12">{key}</span>
              <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 rounded-full"
                  style={{ width: `${val}%` }}
                />
              </div>
              <span className="text-[9px] font-bold text-white w-6 text-right">{val}</span>
            </div>
          ))}
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/98 to-transparent">
          <div className="text-[10px] uppercase tracking-[0.15em] text-cyan-400 mb-1 font-semibold">
            {position}
          </div>
          <div className="text-2xl font-black text-white mb-1">{name}</div>
          <p className="text-[10px] text-slate-400 leading-tight mb-3 line-clamp-2">{tagline}</p>
          
          {/* BPAA badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20 border border-cyan-400/40 flex items-center justify-center">
                <Shield className="w-3 h-3 text-cyan-400" />
              </div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">BPAA Certified</span>
            </div>
            <div className="flex items-center gap-1 text-[9px] text-green-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span>Bound</span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

function CardModal({ card, onClose }) {
  const { name, number, position, edition, series, tagline, imageSrc, team, stats, signature, borderColor, glowColor } = card;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Card */}
        <div 
          className="relative rounded-3xl overflow-hidden"
          style={{ boxShadow: `0 0 100px ${glowColor}, 0 0 200px ${glowColor}40` }}
        >
          {/* Border gradient */}
          <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${borderColor} p-[4px]`}>
            <div className="absolute inset-0 rounded-3xl bg-slate-950" />
          </div>

          <div className="relative rounded-3xl overflow-hidden bg-slate-950">
            {/* Image section - Larger */}
            <div className="relative aspect-[4/5] md:aspect-[3/4]">
              <img
                src={imageSrc}
                alt={name}
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/50" />
              
              {/* Top header - Enhanced */}
              <div className="absolute top-0 inset-x-0 p-6 flex items-start justify-between bg-gradient-to-b from-slate-950/80 to-transparent">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.25em] text-fuchsia-300 font-bold mb-2">{series}</div>
                  <div className="text-4xl md:text-5xl font-black text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">{name}</div>
                  <div className="text-base text-cyan-300 mt-1">{position}</div>
                  <div className="text-sm text-slate-400 mt-1">{team}</div>
                </div>
                <div className="text-right">
                  <div className="text-5xl md:text-6xl font-black text-white/20">{number}</div>
                  {signature && (
                    <div className="mt-2 px-3 py-1 rounded-lg bg-amber-500/25 border border-amber-400/60 text-[10px] text-amber-300 uppercase font-bold shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                      ✦ Autographed
                    </div>
                  )}
                </div>
              </div>

              {/* Floating stats on image */}
              <div className="absolute bottom-4 left-4 right-4 grid grid-cols-4 gap-2">
                {Object.entries(stats).map(([key, val]) => (
                  <div key={key} className="bg-slate-950/80 backdrop-blur-md rounded-xl p-3 border border-slate-700/50 text-center">
                    <div className="text-2xl font-black text-white">{val}</div>
                    <div className="text-[9px] uppercase tracking-wider text-slate-400 mt-1">{key}</div>
                    <div className="w-full h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-fuchsia-500 via-pink-400 to-cyan-400 rounded-full"
                        style={{ width: `${val}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Details section - More content */}
            <div className="p-6 space-y-4 bg-gradient-to-b from-slate-950 to-slate-900">
              <div className="border-l-4 border-fuchsia-500 pl-4">
                <p className="text-base text-slate-200 leading-relaxed">{tagline}</p>
              </div>

              {/* Covenant Info */}
              <div className="bg-slate-900/80 border border-cyan-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  <span className="text-sm font-bold text-cyan-300 uppercase tracking-wider">Master Covenant Binding</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500 text-xs uppercase">Edition</span>
                    <p className="text-white font-semibold">{edition}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs uppercase">Series</span>
                    <p className="text-white font-semibold">{series}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs uppercase">Team</span>
                    <p className="text-white font-semibold">{team}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs uppercase">Status</span>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-green-400 font-semibold">Bound & Verified</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-fuchsia-500 to-cyan-500 flex items-center justify-center shadow-[0_0_15px_rgba(244,114,182,0.5)]">
                    <span className="text-xs font-black text-white">GL</span>
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white">GlyphLock</span>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Dream Team Collection</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span className="text-[11px] uppercase tracking-wider text-amber-400 font-bold">BPAA Certified</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 hover:border-cyan-500/50 transition-all shadow-lg"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

function StatBar({ label, value }) {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0));
  const labelText = label.charAt(0).toUpperCase() + label.slice(1);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-[10px]">
        <span className="text-slate-400">{labelText}</span>
        <span className="text-slate-300 font-semibold">{safeValue}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-400 to-cyan-400"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}