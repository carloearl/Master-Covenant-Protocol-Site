import React, { useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Shield, Lock, Fingerprint, Hash, Clock, Zap } from "lucide-react";

export default function DreamTeamFlipCard({ card }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  if (!card) return null;

  const handleClick = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);
  
  const handleMouseEnter = useCallback(() => {
    // Only auto-flip on desktop with hover capability
    if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
      setIsFlipped(true);
    }
  }, []);
  
  const handleMouseLeave = useCallback(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
      setIsFlipped(false);
    }
  }, []);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div 
      className="relative w-full cursor-pointer group select-none"
      style={{ perspective: '1200px' }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      <div 
        className="relative w-full aspect-[3/4]"
        style={{ 
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.6s ease-in-out',
          willChange: 'transform'
        }}
      >
        {/* ═══════════════════════════════════════════════════════════════
            FRONT OF CARD - Basketball Trading Card Image
            ═══════════════════════════════════════════════════════════════ */}
        <div 
          className="absolute inset-0 rounded-2xl overflow-hidden border-2 border-transparent group-hover:border-cyan-400/60 transition-all duration-300"
          style={{ 
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            boxShadow: `0 0 30px ${card.glowColor}`
          }}
        >
          {/* Holographic border gradient */}
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${card.borderColor} p-[2px]`}>
            <div className="absolute inset-0 rounded-2xl bg-slate-950" />
          </div>

          {/* Card image */}
          <img 
            src={card.frontImage} 
            alt={card.name}
            className={`absolute inset-0 w-full h-full object-cover rounded-2xl transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 animate-pulse rounded-2xl" />
          )}

          {/* Holographic shimmer overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] pointer-events-none" 
            style={{ transition: 'transform 1s ease-out, opacity 0.3s' }} 
          />

          {/* Verified badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/20 border border-green-400/50 backdrop-blur-sm">
            <CheckCircle2 className="w-3 h-3 text-green-400" />
            <span className="text-[9px] text-green-300 font-semibold uppercase tracking-wider">Bound</span>
          </div>
          
          {/* Tap indicator mobile */}
          <div className="absolute bottom-3 right-3 md:hidden bg-black/60 px-2 py-1 rounded text-[10px] text-white/70 backdrop-blur-sm">
            Tap to flip
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            BACK OF CARD - Cryptographic Binding Details
            ═══════════════════════════════════════════════════════════════ */}
        <div 
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{ 
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            boxShadow: `0 0 40px ${card.glowColor}`
          }}
        >
          {/* Border gradient */}
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${card.borderColor} p-[2px]`}>
            <div className="absolute inset-0 rounded-2xl bg-slate-950" />
          </div>

          {/* Content */}
          <div className="absolute inset-[2px] rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-black p-3 md:p-4 flex flex-col overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20 border border-cyan-400/30 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-bold text-white">{card.name}</h3>
                  <p className="text-[10px] text-slate-400">{card.position} • {card.number}</p>
                </div>
              </div>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/50 text-[9px] px-1.5 py-0.5">
                ✓ VERIFIED
              </Badge>
            </div>

            {/* Binding Type Banner */}
            <div className="bg-gradient-to-r from-fuchsia-500/10 via-cyan-500/10 to-fuchsia-500/10 border border-fuchsia-400/30 rounded-lg px-2 py-1.5 mb-2">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-fuchsia-400" />
                <span className="text-[10px] font-bold text-fuchsia-300 uppercase tracking-wider">{card.bindingType}</span>
              </div>
              <p className="text-[9px] text-slate-400 mt-0.5">{card.covenant}</p>
            </div>

            {/* Binding Details */}
            <div className="space-y-1.5 mb-2 flex-shrink-0">
              <div className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-cyan-400 flex-shrink-0 mt-0.5" />
                <p className="text-[9px] md:text-[10px] text-slate-300 leading-tight">{card.binding?.method}</p>
              </div>
              <div className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-cyan-400 flex-shrink-0 mt-0.5" />
                <p className="text-[9px] md:text-[10px] text-slate-300 leading-tight">{card.binding?.mechanism}</p>
              </div>
              <div className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-cyan-400 flex-shrink-0 mt-0.5" />
                <p className="text-[9px] md:text-[10px] text-slate-300 leading-tight">{card.binding?.protocol}</p>
              </div>
            </div>

            {/* Quote */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-2 mb-2">
              <p className="text-[8px] md:text-[9px] italic text-cyan-300/80 leading-tight">"{card.quote}"</p>
            </div>

            {/* ═══════════════════════════════════════════════════════════
                CRYPTOGRAPHIC SIGNATURE BLOCK
                ═══════════════════════════════════════════════════════════ */}
            <div className="flex-1 bg-black/60 border border-cyan-500/30 rounded-lg p-2 font-mono overflow-hidden">
              <div className="flex items-center gap-1.5 mb-1.5 pb-1.5 border-b border-cyan-500/20">
                <Fingerprint className="w-3 h-3 text-cyan-400" />
                <span className="text-[9px] text-cyan-300 font-bold uppercase tracking-wider">Cryptographic Signature</span>
              </div>
              
              <div className="space-y-1 text-[8px] md:text-[9px]">
                <div className="flex items-center gap-1">
                  <span className="text-slate-500">Algorithm:</span>
                  <span className="text-green-400">{card.cryptoSignature?.algorithm}</span>
                </div>
                <div className="flex items-start gap-1">
                  <Hash className="w-2.5 h-2.5 text-slate-500 flex-shrink-0 mt-0.5" />
                  <span className="text-fuchsia-300 break-all leading-tight">{card.cryptoSignature?.hash}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5 text-slate-500" />
                  <span className="text-cyan-300">{card.cryptoSignature?.publicKey}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5 text-slate-500" />
                  <span className="text-slate-400">{formatDate(card.bindingDate)}</span>
                </div>
              </div>

              {/* Verification status */}
              <div className="mt-2 pt-1.5 border-t border-cyan-500/20 flex items-center justify-between">
                <span className="text-[8px] text-slate-500 uppercase">Status</span>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[8px] text-green-400 font-bold">VERIFIED & BOUND</span>
                </div>
              </div>
            </div>

            {/* Footer seal */}
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-fuchsia-500 to-cyan-500 flex items-center justify-center">
                  <span className="text-[6px] font-black text-white">GL</span>
                </div>
                <span className="text-[8px] text-slate-500 uppercase tracking-wider">GlyphLock</span>
              </div>
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50 text-[7px] px-1 py-0.5">
                BPAA CERTIFIED
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}