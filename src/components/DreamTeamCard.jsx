import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

export default function DreamTeamCard({ card, member }) {
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Support both 'card' and 'member' props for backward compatibility
  const data = card || member;
  
  if (!data) return null;

  return (
    <div 
      className="relative h-[600px] w-full max-w-[450px] mx-auto cursor-pointer perspective-1000"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        {/* Front of Card */}
        <div className="absolute inset-0 backface-hidden">
          <div className="relative w-full h-full rounded-2xl border-2 border-blue-500/50">
            <img 
              src={data.frontImage} 
              alt={data.name}
              className="w-full h-full object-contain rounded-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none rounded-2xl" />
          </div>
        </div>

        {/* Back of Card */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl overflow-hidden border-2 border-blue-500/50">
          <div className="relative w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50 px-3 py-1.5 text-xs">
                {data.position}
              </Badge>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/50 px-2 py-1 text-xs">
                BOUND
              </Badge>
            </div>

            <h3 className="text-2xl font-bold text-white mb-1">{data.name}</h3>
            <p className="text-blue-400 font-semibold text-sm mb-4">{data.role}</p>

            <div className="space-y-2 mb-4 flex-shrink-0">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-gray-300 text-xs leading-tight">{data.binding?.method}</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-gray-300 text-xs leading-tight">{data.binding?.mechanism}</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-gray-300 text-xs leading-tight">{data.binding?.covenant}</p>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-3 mb-3 flex-shrink-0">
              <h4 className="text-xs font-bold text-blue-400 mb-1">BINDING TYPE: {data.bindingType}</h4>
              
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-2 mb-2">
                <p className="text-xs italic text-blue-300 leading-tight">{data.quote}</p>
              </div>

              <div className="flex items-center justify-between text-xs mb-3">
                <span className="text-gray-500">Class: {data.class}</span>
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50 text-xs px-2 py-0.5">
                  BPAA
                </Badge>
              </div>
            </div>

            {/* Cryptographic Signature */}
            <div className="bg-black/70 border border-purple-500/30 rounded p-3 flex-1 flex items-center justify-center overflow-hidden">
              <pre className="text-purple-300 text-[9px] leading-[1.3] font-mono overflow-auto max-h-full">
{data.signature}
              </pre>
            </div>

            <div className="text-center flex-shrink-0 mt-2">
              <div className="inline-block bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg px-4 py-1">
                <p className="text-[10px] font-bold text-blue-400">GLYPHLOCK MASTER COVENANT</p>
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
      `}</style>
    </div>
  );
}