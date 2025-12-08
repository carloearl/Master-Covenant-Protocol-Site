import React, { useState, useRef, useCallback } from "react";
import { dreamTeam } from "@/components/data/dreamTeam";
import { Shield, CheckCircle2, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function HomeDreamTeam() {
  const [flippedIndex, setFlippedIndex] = useState(null);

  return (
    <section className="w-full py-16 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-gradient-to-r from-blue-600/30 to-cyan-500/30 backdrop-blur-md border-2 border-cyan-400/60 text-white px-6 py-2 shadow-[0_0_30px_rgba(6,182,212,0.6)]">
            <span className="font-black tracking-[0.2em] text-sm">AI OPERATORS</span>
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            The <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">Dream Team</span>
          </h2>
          <p className="text-lg text-cyan-50 max-w-2xl mx-auto">
            Five AI operators cryptographically bound to GlyphLock — tap any card to flip.
          </p>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-6 gap-8 md:grid md:grid-cols-5 md:gap-6 md:justify-center md:overflow-visible">
          {dreamTeam.map((member, i) => (
            <DreamTeamCard key={member.id} member={member} isFlipped={flippedIndex === i} onFlip={() => setFlippedIndex(flippedIndex === i ? null : i)} />
          ))}
        </div>
      </div>
    </section>
  );
}

function DreamTeamCard({ member, isFlipped, onFlip }) {
  const [tiltStyle, setTiltStyle] = useState({});
  const cardRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current || isFlipped) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    const tiltX = (y - 0.5) * 12;
    const tiltY = (x - 0.5) * -12;
    const glareX = x * 100;
    const glareY = y * 100;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`,
      '--glare-x': `${glareX}%`,
      '--glare-y': `${glareY}%`,
    });
  }, [isFlipped]);

  const handleMouseLeave = useCallback(() => {
    setTiltStyle({});
  }, []);

  return (
    <div 
      ref={cardRef}
      className="perspective-1000 flex-shrink-0 w-64 md:w-auto snap-start cursor-pointer select-none"
      onClick={onFlip}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ 
        filter: 'brightness(1.15) saturate(1.2)',
        transition: 'filter 0.6s ease-out'
      }}
    >
      <div
        className="relative w-full aspect-[2/3] min-h-[480px]"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : (tiltStyle.transform || 'rotateY(0deg)'),
          transition: isFlipped ? 'transform 0.6s ease-in-out' : 'transform 0.15s ease-out',
          willChange: 'transform',
          ...(!isFlipped ? tiltStyle : {})
        }}
      >
        {/* FRONT - NBA Trading Card Image */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden group"
          style={{ 
            backfaceVisibility: 'hidden', 
            WebkitBackfaceVisibility: 'hidden',
            boxShadow: `0 0 50px ${member.glowColor}, 0 0 80px rgba(87,61,255,0.3)`
          }}
        >
          {/* Card image as main background */}
          <img
            src={member.frontImage}
            alt={member.name}
            className="absolute inset-0 w-full h-full object-contain rounded-2xl"
            loading="lazy"
            style={{ zIndex: 1 }}
          />

          {/* Holographic foil border overlay */}
          <div
            className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${member.borderColor} opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none`}
            style={{ zIndex: 2 }}
          />

          {/* Holographic shimmer overlay */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none rounded-2xl"
            style={{
              zIndex: 3,
              background: `
                linear-gradient(
                  105deg,
                  transparent 40%,
                  rgba(255, 255, 255, 0.3) 45%,
                  rgba(255, 255, 255, 0.5) 50%,
                  rgba(255, 255, 255, 0.3) 55%,
                  transparent 60%
                )
              `,
              backgroundPosition: `var(--glare-x, 50%) var(--glare-y, 50%)`,
              backgroundSize: '200% 200%'
            }}
          />

          {/* Bound badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/20 border border-green-400/50 backdrop-blur-md shadow-[0_0_15px_rgba(34,197,94,0.3)]" style={{ zIndex: 4 }}>
            <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
            <span className="text-[10px] text-green-300 font-bold uppercase tracking-wider">Bound</span>
          </div>

          {/* Tap hint */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-white flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full" style={{ zIndex: 4 }}>
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_8px_rgba(87,61,255,0.8)]" />
            Tap to flip
          </div>
        </div>

        {/* BACK - Binding Details */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            boxShadow: `0 0 50px ${member.glowColor}`
          }}
        >
          {/* Border */}
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${member.borderColor} p-[3px]`}>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-violet-950/40 to-blue-950/60" />
          </div>

          {/* Content */}
          <div className="absolute inset-[3px] rounded-2xl bg-gradient-to-br from-indigo-900/40 via-violet-900/30 to-blue-900/40 p-4 flex flex-col overflow-hidden" style={{ backdropFilter: 'blur(12px)' }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  <Shield className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{member.name}</h3>
                  <p className="text-[10px] text-indigo-200">{member.position} • {member.number}</p>
                </div>
              </div>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/50 text-[9px] shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                ✓ VERIFIED
              </Badge>
            </div>

            {/* Binding sections */}
            <div className="space-y-2 flex-1">
              {member.backSections.map((section, index) => (
                <div key={index} className="bg-gradient-to-br from-indigo-900/40 via-violet-900/30 to-blue-900/40 border border-indigo-400/50 rounded-xl p-2.5 backdrop-blur-sm shadow-[inset_0_0_15px_rgba(87,61,255,0.1)]">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Zap className="w-3.5 h-3.5 text-violet-300" />
                    <h5 className="text-[10px] font-bold text-violet-200 uppercase tracking-wider">{section.title}</h5>
                  </div>
                  <p className="text-[9px] text-violet-100 leading-tight">{section.text}</p>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-3 flex items-center justify-between pt-2 border-t border-indigo-400/50">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-fuchsia-500 to-cyan-500 flex items-center justify-center shadow-[0_0_10px_rgba(244,114,182,0.5)]">
                  <span className="text-[7px] font-black text-white">GL</span>
                </div>
                <span className="text-[9px] text-indigo-200 uppercase tracking-wider">GlyphLock</span>
              </div>
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50 text-[8px] shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                BPAA CERTIFIED
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}