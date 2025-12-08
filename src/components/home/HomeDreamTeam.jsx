import React, { useState } from "react";
import { dreamTeam } from "@/components/data/dreamTeam";
import { Shield, CheckCircle2, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function HomeDreamTeam() {
  const [flippedIndex, setFlippedIndex] = useState(null);

  return (
    <section className="w-full py-16 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-white/10 backdrop-blur-md border-2 border-white/20 text-white px-6 py-2 shadow-[0_0_30px_rgba(87,61,255,0.5)]">
            <span className="font-black tracking-[0.2em] text-sm">GLYPHLOCK ARCHETYPES</span>
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Protected <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">Archetypes</span>
          </h2>
          <p className="text-lg text-violet-100 max-w-2xl mx-auto">
            Each AI operator is cryptographically bound to the GlyphLock framework — tap to reveal binding details.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {dreamTeam.map((member, i) => (
            <div key={member.id} className="perspective-1000">
              <div
                className={`relative w-full aspect-[2/3] cursor-pointer transition-all duration-700 preserve-3d ${
                  flippedIndex === i ? "rotate-y-180" : ""
                }`}
                onClick={() => setFlippedIndex(flippedIndex === i ? null : i)}
              >
                {/* FRONT */}
                <div className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-500/20 via-violet-500/15 to-blue-500/20 backdrop-blur-md border-2 border-white/15 shadow-[0_0_40px_rgba(87,61,255,0.4)] hover:shadow-[0_0_60px_rgba(87,61,255,0.6)] transition-all">
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/60 via-transparent to-violet-950/20" />
                  
                  {/* Bound badge */}
                  <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/20 border border-green-400/50 backdrop-blur-md shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                    <CheckCircle2 className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-green-300 font-bold uppercase">Bound</span>
                  </div>

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-violet-500/30 border border-indigo-400/40 flex items-center justify-center shadow-[0_0_25px_rgba(87,61,255,0.4)] mb-4">
                      <Shield className="w-8 h-8 text-indigo-300" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2">{member.name}</h3>
                    <p className="text-sm text-indigo-200 font-semibold mb-3 uppercase tracking-wider">{member.position}</p>
                    <p className="text-sm text-violet-100 leading-relaxed">{member.frontDesc}</p>
                  </div>

                  {/* Tap hint */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-violet-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_8px_rgba(87,61,255,0.6)]" />
                    Tap to flip
                  </div>
                </div>

                {/* BACK */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl overflow-hidden bg-white/8 backdrop-blur-lg border-2 border-white/15 shadow-[0_0_40px_rgba(87,61,255,0.4)] p-6">
                  
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/15">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/30 to-violet-500/30 border border-indigo-400/40 flex items-center justify-center shadow-[0_0_20px_rgba(87,61,255,0.4)]">
                        <Shield className="w-5 h-5 text-indigo-300" />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-white">{member.name}</h4>
                        <p className="text-xs text-indigo-200">{member.position}</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/50 text-xs px-2 py-1 shadow-[0_0_12px_rgba(34,197,94,0.4)]">
                      ✓ VERIFIED
                    </Badge>
                  </div>

                  {/* Binding sections */}
                  <div className="space-y-4 overflow-y-auto max-h-[calc(100%-120px)] hide-scrollbar">
                    {member.backSections.map((section, index) => (
                      <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-sm shadow-[inset_0_0_15px_rgba(87,61,255,0.1)]">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="w-4 h-4 text-violet-300" />
                          <h5 className="text-sm font-bold text-violet-200 uppercase tracking-wider">{section.title}</h5>
                        </div>
                        <p className="text-xs text-white leading-relaxed">{section.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pt-3 border-t border-white/15">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-[0_0_12px_rgba(87,61,255,0.5)]">
                        <span className="text-[10px] font-black text-white">GL</span>
                      </div>
                      <span className="text-xs font-bold text-white">GlyphLock</span>
                    </div>
                    <span className="text-[10px] text-indigo-200 uppercase tracking-wider">BPAA Certified</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}