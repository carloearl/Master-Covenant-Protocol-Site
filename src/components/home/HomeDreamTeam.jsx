// GLYPHLOCK DREAM TEAM HARD-LOCK
// This file is the canonical implementation of the 5 holographic Dream Team flip cards.
// Do not replace this with archetype cards, shadcn defaults, or placeholder cards.
// Any change to this file MUST be explicitly requested by Carlo Rene Earl.

import React from "react";
import { dreamTeam } from "@/components/data/dreamTeam";
import DreamTeamFlipCard from "@/components/DreamTeamFlipCard";
import { Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function HomeDreamTeam() {
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

        {/* Mobile: Horizontal snap scroll | Desktop: 5-column grid */}
        <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-6 gap-8 md:grid md:grid-cols-5 md:gap-6 md:justify-center md:overflow-visible">
          {dreamTeam.map((member) => (
            <div key={member.id} className="flex-shrink-0 w-64 md:w-auto snap-start">
              <DreamTeamFlipCard card={member} />
            </div>
          ))}
        </div>

        {/* Scroll indicator for mobile */}
        <div className="flex md:hidden justify-center gap-2 mt-6">
          {dreamTeam.map((member) => (
            <div key={member.id} className="w-2 h-2 rounded-full bg-indigo-400/30" />
          ))}
        </div>
      </div>
    </section>
  );
}