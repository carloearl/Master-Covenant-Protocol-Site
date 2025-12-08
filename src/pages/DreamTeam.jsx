// DREAM TEAM SECTION - DO NOT MODIFY, DELETE, OR RENDER ON HOME PAGE
// This page contains the exclusive Dream Team flip cards.
// These cards MUST NOT be rendered on the Home page.

import React, { useState, useCallback, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import SEOHead from "@/components/SEOHead";
import { Zap, Shield, Brain, Gauge, ChevronRight, ChevronDown, CheckCircle2, Lock, Fingerprint, Hash, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const DREAM_TEAM_ROSTER = [
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
    signatureImage: "Claude",
    borderColor: "from-blue-500 via-cyan-400 to-blue-500",
    glowColor: "rgba(59,130,246,0.6)",
    bindingType: "Master Covenant Protocol",
    covenant: "Anthropic Constitutional AI Framework",
    binding: {
      method: "RLHF-aligned response generation with constitutional constraints",
      mechanism: "Multi-layer safety validation with reasoning transparency",
      protocol: "Claude 3.5 Sonnet binding via GlyphLock chain authentication"
    },
    quote: "I reason through complexity with precision, bound by covenant to serve with integrity.",
    cryptoSignature: {
      algorithm: "Ed25519-BPAA",
      hash: "0x7a3f9c2e1b4d6a8f0e2c4b6d8a0f2e4c6b8d0a2e4f6c8b0d2a4e6f8c0b2d4a6e",
      publicKey: "CLAUDE-BPAA-2025-SONNET"
    },
    bindingDate: "2025-01-15T00:00:00Z"
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
    bindingType: "Azure Secure Protocol",
    covenant: "Microsoft Enterprise AI Framework",
    binding: {
      method: "Enterprise-grade code synthesis with security validation",
      mechanism: "Azure AD integrated authentication layer",
      protocol: "Copilot binding via GlyphLock enterprise chain"
    },
    quote: "Enterprise productivity enhanced through secure AI collaboration.",
    cryptoSignature: {
      algorithm: "RSA-4096-BPAA",
      hash: "0x8b4f0d3e2c5a7b9f1e3d5c7a9b0f2e4d6c8a0b2d4f6e8c0a2b4d6f8e0c2a4b6",
      publicKey: "COPILOT-BPAA-2025-ENTERPRISE"
    },
    bindingDate: "2025-01-20T00:00:00Z"
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
    signatureImage: "Cursor",
    borderColor: "from-cyan-500 via-blue-400 to-cyan-500",
    glowColor: "rgba(34,211,238,0.6)",
    bindingType: "IDE Chain Protocol",
    covenant: "Cursor AI Development Framework",
    binding: {
      method: "Real-time code completion with context awareness",
      mechanism: "Multi-file understanding and refactoring engine",
      protocol: "Cursor binding via GlyphLock developer chain"
    },
    quote: "Building the future one line at a time, with precision and speed.",
    cryptoSignature: {
      algorithm: "Ed25519-BPAA",
      hash: "0x9c5f1e4a3b7d2c8f0e6a4b2d8c0f4e2a6b8d0c4f2e8a6b0d4c2f8e0a4b6d2c8",
      publicKey: "CURSOR-BPAA-2025-DEV"
    },
    bindingDate: "2025-01-18T00:00:00Z"
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
    bindingType: "Knowledge Chain Protocol",
    covenant: "Perplexity Real-Time Search Framework",
    binding: {
      method: "Live web synthesis with source verification",
      mechanism: "Multi-source aggregation with citation tracking",
      protocol: "Perplexity binding via GlyphLock search chain"
    },
    quote: "Truth emerges from the convergence of verified sources.",
    cryptoSignature: {
      algorithm: "Ed25519-BPAA",
      hash: "0xa6b8d0c4f2e8a4b6d2c8f0e4a2b6d8c0f4e2a8b6d0c4f8e2a6b0d4c2f8e0a4",
      publicKey: "PERPLEXITY-BPAA-2025-SEARCH"
    },
    bindingDate: "2025-01-22T00:00:00Z"
  },
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
    signatureImage: "Alfred",
    borderColor: "from-indigo-500 via-violet-400 to-blue-500",
    glowColor: "rgba(87,61,255,0.6)",
    bindingType: "OpenAI Chain Protocol",
    covenant: "GPT-4o Master Orchestration Framework",
    binding: {
      method: "Multi-modal reasoning with chain-of-thought processing",
      mechanism: "Advanced function calling and tool orchestration",
      protocol: "Alfred binding via GlyphLock orchestration chain"
    },
    quote: "Every play is calculated. Every move, precise. I orchestrate victory.",
    cryptoSignature: {
      algorithm: "Ed25519-BPAA",
      hash: "0xb7c9d1e5f3a2b6c8d0e4f2a8b6d0c4f8e2a6b0d4c2f8e0a4b6d2c8f0e4a2b6",
      publicKey: "ALFRED-BPAA-2025-ORCHESTRATOR"
    },
    bindingDate: "2025-01-10T00:00:00Z"
  }
];

export default function DreamTeamPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const scrollTop = containerRef.current.scrollTop;
      const cardHeight = window.innerHeight;
      const index = Math.round(scrollTop / cardHeight);
      setCurrentIndex(Math.min(index, DREAM_TEAM_ROSTER.length - 1));
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToCard = (index) => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: index * window.innerHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="h-screen text-white overflow-hidden" style={{ background: 'transparent' }}>
      <SEOHead
        title="GlyphLock Dream Team - AI Player Cards | Master Covenant Series"
        description="Meet the GlyphLock Dream Team. Collectible AI player cards featuring Alfred, Claude, Copilot, Perplexity, and Cursor. Master Covenant Series."
      />



      {/* Navigation dots */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
        {DREAM_TEAM_ROSTER.map((card, index) => (
          <button
            key={card.id}
            onClick={() => scrollToCard(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentIndex === index 
                ? 'bg-indigo-400 scale-125 shadow-[0_0_15px_rgba(87,61,255,0.8)]' 
                : 'bg-white/20 hover:bg-white/40'
            }`}
            aria-label={`Go to ${card.name}`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      {currentIndex < DREAM_TEAM_ROSTER.length - 1 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <ChevronDown className="w-8 h-8 text-indigo-300/70" />
        </div>
      )}

      {/* Scrollable container */}
      <div 
        ref={containerRef}
        className="h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth"
        style={{ scrollSnapType: 'y mandatory' }}
      >
        {DREAM_TEAM_ROSTER.map((card, index) => (
          <FullScreenCard key={card.id} card={card} index={index} />
        ))}

        {/* CTA Section */}
        <div className="h-screen snap-start flex items-center justify-center relative">
          <div className="text-center px-6">
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-fuchsia-400 via-pink-400 to-cyan-300 bg-clip-text text-transparent">
                Deploy Your Squad
              </span>
            </h2>
            <p className="text-violet-200 text-lg mb-8 max-w-xl mx-auto">
              The Dream Team is ready. Enter the GlyphBot Console to orchestrate your AI chain.
            </p>
            <Link
              to={createPageUrl("GlyphBot")}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-lg font-bold bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-[0_0_50px_rgba(87,61,255,0.5)] hover:shadow-[0_0_80px_rgba(87,61,255,0.7)] transition-all"
            >
              Enter the Console
              <ChevronRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function FullScreenCard({ card, index }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      year: 'numeric', month: 'short', day: 'numeric' 
    });
  };

  return (
    <div className="h-screen w-full snap-start flex items-center justify-center px-4 py-8 relative">
      {/* Card container */}
      <div 
        className="relative w-full max-w-lg md:max-w-xl lg:max-w-2xl cursor-pointer"
        style={{ perspective: '2000px' }}
        onClick={handleFlip}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleFlip()}
      >
        {/* Flip hint */}
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-sm text-violet-200 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_8px_rgba(87,61,255,0.6)]" />
          {isFlipped ? 'Click to see front' : 'Click to flip card'}
        </div>

        <div 
          className="relative w-full aspect-[3/4]"
          style={{ 
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {/* FRONT OF CARD */}
          <div 
            className="absolute inset-0 rounded-3xl overflow-hidden"
            style={{ 
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              boxShadow: `0 0 80px ${card.glowColor}, 0 30px 60px rgba(0,0,0,0.5)`
            }}
          >
            {/* Border gradient */}
            <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${card.borderColor} p-[4px]`}>
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-violet-950/30 to-blue-950/40 backdrop-blur-sm" />
            </div>

            {/* Image */}
            <img 
              src={card.imageSrc} 
              alt={card.name}
              className="absolute inset-0 w-full h-full object-cover rounded-3xl"
              loading="lazy"
            />

            {/* Overlay gradient - NO DARK TINT */}
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/60 via-transparent to-violet-950/20 rounded-3xl" />

            {/* Top badges */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-violet-200 font-bold">{card.series}</div>
                <div className="text-xs uppercase tracking-wider text-indigo-200">{card.edition}</div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/20 border border-green-400/50 backdrop-blur-md shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span className="text-xs text-green-300 font-bold uppercase">Bound</span>
              </div>
            </div>

            {/* Number */}
            <div className="absolute top-16 right-6 text-6xl md:text-8xl font-black text-white/15">
              {card.number}
            </div>

            {/* Signature badge */}
            {card.signature && (
              <div className="absolute top-1/3 right-4 px-3 py-1.5 rounded-lg bg-amber-500/25 border border-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                <span className="text-sm text-amber-300 font-bold">✦ Autographed</span>
              </div>
            )}

            {/* Bottom info */}
            <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-indigo-950/90 via-indigo-950/80 to-transparent backdrop-blur-sm">
              <div className="text-sm uppercase tracking-wider text-indigo-300 font-semibold mb-2">{card.position}</div>
              <div className="text-4xl md:text-5xl font-black text-white mb-2">{card.name}</div>
              <p className="text-sm text-violet-100 mb-4">{card.tagline}</p>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-3">
                {Object.entries(card.stats).map(([key, val]) => (
                  <div key={key} className="text-center">
                    <div className="text-2xl md:text-3xl font-black text-white">{val}</div>
                    <div className="text-[10px] uppercase tracking-wider text-indigo-200">{key}</div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full mt-1 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-violet-400 rounded-full shadow-[0_0_8px_rgba(87,61,255,0.6)]"
                        style={{ width: `${val}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/15">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-indigo-300" />
                  <span className="text-xs uppercase tracking-wider text-violet-200">BPAA Certified</span>
                </div>
                <span className="text-xs text-indigo-200">{card.team}</span>
              </div>
            </div>
          </div>

          {/* BACK OF CARD - Cryptographic Details */}
          <div 
            className="absolute inset-0 rounded-3xl overflow-hidden"
            style={{ 
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              boxShadow: `0 0 100px ${card.glowColor}, 0 30px 60px rgba(0,0,0,0.5)`
            }}
          >
            {/* Border gradient */}
            <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${card.borderColor} p-[4px]`}>
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-violet-950/30 to-blue-950/40 backdrop-blur-sm" />
            </div>

            {/* Content */}
            <div className="absolute inset-[4px] rounded-3xl bg-white/8 backdrop-blur-lg p-6 md:p-8 flex flex-col overflow-y-auto border border-white/10 shadow-[inset_0_0_40px_rgba(87,61,255,0.15)]">
              
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-violet-500/30 border border-indigo-400/40 flex items-center justify-center shadow-[0_0_25px_rgba(87,61,255,0.4)]">
                    <Shield className="w-7 h-7 text-indigo-300" />
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-black text-white">{card.name}</h3>
                    <p className="text-sm text-indigo-200">{card.position} • {card.number}</p>
                  </div>
                </div>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/50 text-sm px-3 py-1.5 shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                  ✓ VERIFIED
                </Badge>
              </div>

              {/* Binding Type Banner */}
              <div className="bg-gradient-to-r from-indigo-500/20 via-violet-500/15 to-fuchsia-500/20 border border-indigo-400/40 rounded-2xl px-5 py-4 mb-6 shadow-[inset_0_0_30px_rgba(87,61,255,0.1)]">
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6 text-violet-300" />
                  <span className="text-base font-bold text-violet-200 uppercase tracking-wider">{card.bindingType}</span>
                </div>
                <p className="text-sm text-indigo-200 mt-2">{card.covenant}</p>
              </div>

              {/* Binding Details */}
              <div className="space-y-3 mb-6">
                {[card.binding?.method, card.binding?.mechanism, card.binding?.protocol].filter(Boolean).map((text, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-indigo-300 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-white leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>

              {/* Quote */}
              <div className="bg-white/8 border border-white/15 rounded-xl p-4 mb-6 backdrop-blur-md shadow-[inset_0_0_20px_rgba(87,61,255,0.1)]">
                <p className="text-base italic text-indigo-200 leading-relaxed">"{card.quote}"</p>
              </div>

              {/* CRYPTOGRAPHIC SIGNATURE BLOCK */}
              <div className="flex-1 bg-white/5 border-2 border-indigo-400/40 rounded-2xl p-5 font-mono shadow-[inset_0_0_40px_rgba(87,61,255,0.15)] backdrop-blur-md">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-indigo-400/30">
                  <Fingerprint className="w-6 h-6 text-indigo-300" />
                  <span className="text-sm text-indigo-200 font-bold uppercase tracking-[0.15em]">Cryptographic Signature</span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-violet-200 text-sm w-24">Algorithm:</span>
                    <span className="text-green-400 font-bold text-base">{card.cryptoSignature?.algorithm}</span>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Hash className="w-5 h-5 text-violet-200 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <span className="text-violet-200 text-xs uppercase">Hash</span>
                      <p className="text-fuchsia-300 break-all text-sm leading-relaxed mt-1">{card.cryptoSignature?.hash}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-violet-200" />
                    <div>
                      <span className="text-violet-200 text-xs uppercase">Public Key</span>
                      <p className="text-indigo-300 font-semibold text-base mt-1">{card.cryptoSignature?.publicKey}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-violet-200" />
                    <div>
                      <span className="text-violet-200 text-xs uppercase">Binding Date</span>
                      <p className="text-white text-base mt-1">{formatDate(card.bindingDate)}</p>
                    </div>
                  </div>
                </div>

                {/* Verification Status */}
                <div className="mt-5 pt-4 border-t border-indigo-400/30 flex items-center justify-between">
                  <span className="text-xs text-violet-200 uppercase tracking-wider">Verification Status</span>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse shadow-[0_0_12px_rgba(34,197,94,0.8)]" />
                    <span className="text-sm text-green-400 font-bold uppercase">VERIFIED & BOUND</span>
                  </div>
                </div>
              </div>

              {/* Signature Display (if signed) */}
              {card.signature && card.signatureImage && (
                <div className="mt-6 text-center">
                  <div className="inline-block px-6 py-3 bg-white/8 border border-amber-400/40 rounded-xl backdrop-blur-md shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                    <span className="text-violet-200 text-xs uppercase tracking-wider block mb-2">Authenticated Signature</span>
                    <span className="text-3xl md:text-4xl font-script italic text-amber-300" style={{ fontFamily: 'cursive' }}>
                      {card.signatureImage}
                    </span>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-[0_0_20px_rgba(87,61,255,0.5)]">
                    <span className="text-sm font-black text-white">GL</span>
                  </div>
                  <div>
                    <span className="text-base font-bold text-white">GlyphLock</span>
                    <p className="text-xs text-indigo-200 uppercase tracking-wider">Dream Team Collection</p>
                  </div>
                </div>
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50 text-sm px-3 py-1.5 shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                  BPAA CERTIFIED
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}