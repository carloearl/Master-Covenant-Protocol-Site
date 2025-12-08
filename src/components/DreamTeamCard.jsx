// LEGACY COMPONENT
// Do not use on Home page Dream Team section.
// Canonical Dream Team is HomeDreamTeam + DreamTeamFlipCard + components/data/dreamTeam

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

export default function DreamTeamCard({ card, member }) {
  const [isFlipped, setIsFlipped] = useState(false);
  
  const data = card || member;
  
  if (!data) return null;

  const handleClick = () => setIsFlipped(!isFlipped);
  const handleMouseEnter = () => {
    // Only flip on hover for non-touch devices
    if (window.matchMedia('(hover: hover)').matches) {
      setIsFlipped(true);
    }
  };
  const handleMouseLeave = () => {
    if (window.matchMedia('(hover: hover)').matches) {
      setIsFlipped(false);
    }
  };

  return (
    <div 
      className="relative w-full cursor-pointer group card-flip-container"
      style={{ perspective: '1000px' }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className="relative w-full card-flip-inner"
        style={{ 
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* Front of Card */}
        <div 
          className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-purple-500/30 group-hover:border-purple-500/60 transition-all"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <img 
            src={data.frontImage} 
            alt={data.name}
            className="w-full h-auto object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          
          {/* Tap to flip indicator on mobile */}
          <div className="absolute bottom-2 right-2 md:hidden bg-black/60 px-2 py-1 rounded text-xs text-white/70">
            Tap to flip
          </div>
        </div>

        {/* Back of Card */}
        <div 
          className="absolute top-0 left-0 w-full h-full rounded-2xl overflow-hidden border-2 border-blue-500/50"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="relative w-full h-full min-h-[400px] md:min-h-[500px] bg-gradient-to-br from-gray-900 via-black to-gray-900 p-3 md:p-4 flex flex-col overflow-y-auto">
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

      <style>{`
        .card-flip-container {
          transform-style: preserve-3d;
        }
        .card-flip-inner {
          transform-style: preserve-3d;
        }
        @media (hover: none) {
          .card-flip-container:active .card-flip-inner {
            transform: rotateY(180deg);
          }
        }
      `}</style>
    </div>
  );
}