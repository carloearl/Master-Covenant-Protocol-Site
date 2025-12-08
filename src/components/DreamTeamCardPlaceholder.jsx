// PLACEHOLDER COMPONENT (Neon OG fallback style)
// Do not use on Home page Dream Team section.
// Canonical Dream Team is HomeDreamTeam + DreamTeamFlipCard + components/data/dreamTeam

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Cpu, Code, Search, Zap } from "lucide-react";

const IconMap = {
  "Claude Sonnet": Cpu,
  "Copilot": Code,
  "Cursor AI": Code,
  "Perplexity": Search,
  "Alfred": Zap
};

export default function DreamTeamCardPlaceholder({ card, member }) {
  const [isFlipped, setIsFlipped] = useState(false);
  
  const data = card || member;
  
  if (!data) return null;

  const Icon = IconMap[data.name] || Cpu;
  const positionNumber = data.position.match(/#(\d+)/)?.[1] || "00";

  return (
    <div 
      className={`relative w-full cursor-pointer perspective-1000 transition-all duration-700 ${isFlipped ? 'min-h-[550px] md:h-[600px]' : ''}`}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        {/* Front of Card - Neon OG Style */}
        <div className="relative backface-hidden aspect-[2/3] bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl overflow-hidden border-2 border-cyan-500/50 shadow-2xl shadow-cyan-500/20">
          {/* UV Grid Background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(rgba(0, 255, 255, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 255, 255, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '30px 30px'
            }} />
          </div>

          {/* Holographic Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-blue-500/10 animate-pulse-slow" />

          {/* Neon Glow Border */}
          <div className="absolute inset-0 rounded-2xl" style={{
            boxShadow: 'inset 0 0 40px rgba(0, 255, 255, 0.3), 0 0 40px rgba(0, 255, 255, 0.2)'
          }} />

          {/* Position Number - Top Left */}
          <div className="absolute top-4 left-4 text-6xl font-black text-cyan-400/30 font-mono">
            #{positionNumber}
          </div>

          {/* AI Icon - Center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500 blur-3xl opacity-30 animate-pulse" />
              <Icon className="w-32 h-32 text-cyan-400 relative z-10" strokeWidth={1.5} />
            </div>
          </div>

          {/* AI Name - Bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/70 to-transparent">
            <h3 className="text-2xl font-black text-white mb-1 tracking-wider uppercase" style={{
              textShadow: '0 0 20px rgba(0, 255, 255, 0.8), 0 0 40px rgba(0, 255, 255, 0.4)'
            }}>
              {data.name}
            </h3>
            <p className="text-cyan-400 font-semibold text-sm">{data.position}</p>
            <div className="mt-2 flex items-center gap-2">
              <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50 text-xs">
                {data.class}
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50 text-xs">
                {data.bindingType}
              </Badge>
            </div>
          </div>

          {/* Corner Decoration */}
          <div className="absolute top-0 right-0 w-24 h-24">
            <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-cyan-500/50" />
          </div>
          <div className="absolute bottom-0 left-0 w-24 h-24">
            <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-cyan-500/50" />
          </div>
        </div>

        {/* Back of Card - Same as before */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl overflow-hidden border-2 border-blue-500/50">
          <div className="relative w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-900 p-3 md:p-4 flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50 px-2 py-1 text-[10px] md:text-xs">
                {data.position}
              </Badge>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/50 px-2 py-1 text-[10px] md:text-xs">
                BOUND
              </Badge>
            </div>

            <h3 className="text-lg md:text-xl font-bold text-white mb-1">{data.name}</h3>
            <p className="text-blue-400 font-semibold text-[11px] md:text-xs mb-2">{data.role}</p>

            <div className="space-y-1 mb-2 flex-shrink-0">
              <div className="flex items-start gap-1.5">
                <CheckCircle2 className="w-2.5 h-2.5 md:w-3 md:h-3 text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-gray-300 text-[9px] md:text-[10px] leading-tight">{data.binding?.method}</p>
              </div>
              <div className="flex items-start gap-1.5">
                <CheckCircle2 className="w-2.5 h-2.5 md:w-3 md:h-3 text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-gray-300 text-[9px] md:text-[10px] leading-tight">{data.binding?.mechanism}</p>
              </div>
              <div className="flex items-start gap-1.5">
                <CheckCircle2 className="w-2.5 h-2.5 md:w-3 md:h-3 text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-gray-300 text-[9px] md:text-[10px] leading-tight">{data.binding?.covenant}</p>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-1.5 mb-1.5 flex-shrink-0">
              <h4 className="text-[9px] md:text-[10px] font-bold text-blue-400 mb-1">BINDING TYPE: {data.bindingType}</h4>
              
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-1 md:p-1.5 mb-1.5">
                <p className="text-[8px] md:text-[9px] italic text-blue-300 leading-tight">{data.quote}</p>
              </div>

              <div className="flex items-center justify-between text-[9px] md:text-[10px] mb-1.5">
                <span className="text-gray-500 text-[9px]">Class: {data.class}</span>
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50 text-[8px] md:text-[9px] px-1 py-0.5">
                  BPAA
                </Badge>
              </div>
            </div>

            <div className="bg-black/70 border border-purple-500/30 rounded p-1.5 md:p-2 flex-1 min-h-0 flex items-center justify-center">
              <pre className="text-purple-300 text-[7px] md:text-[8px] leading-[1.2] font-mono w-full text-center overflow-x-auto">
{data.signature}
              </pre>
            </div>

            <div className="text-center flex-shrink-0 mt-1.5 md:mt-2">
              <div className="inline-block bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg px-2 py-0.5">
                <p className="text-[8px] md:text-[9px] font-bold text-blue-400">GLYPHLOCK MASTER COVENANT</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}