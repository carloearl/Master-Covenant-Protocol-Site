// DREAM TEAM SECTION - DO NOT MODIFY, DELETE, OR RENDER ON HOME PAGE
// This is a CTA-only component. Flip cards live exclusively on /dreamteam page.

import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Sparkles } from "lucide-react";

export default function HomeDreamTeamCTA() {
  const navigate = useNavigate();

  return (
    <section className="relative w-full py-20 md:py-28 px-6 overflow-hidden">
      {/* Royal Blue to Indigo Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A]/30 via-[#3730A3]/25 to-[#1E40AF]/30 backdrop-blur-xl" />
      
      {/* Silver Pulse Edges */}
      <div className="absolute inset-0 border-t-2 border-b-2 border-white/10 shadow-[inset_0_0_40px_rgba(255,255,255,0.05)]">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
      </div>

      {/* Content Container */}
      <div className="relative max-w-4xl mx-auto text-center z-10">
        
        {/* Icon Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#3B82F6]/20 to-[#6366F1]/20 border border-[#3B82F6]/40 shadow-[0_0_20px_rgba(59,130,246,0.4)] mb-8">
          <Sparkles className="w-4 h-4 text-[#60A5FA]" />
          <span className="text-sm font-bold text-[#93C5FD] uppercase tracking-[0.15em]">AI Operators</span>
        </div>

        {/* Main Heading */}
        <h2 className="text-4xl md:text-6xl font-black text-white mb-6 drop-shadow-[0_0_30px_rgba(59,130,246,0.6)]">
          Meet The <span className="bg-gradient-to-r from-[#3B82F6] via-[#60A5FA] to-[#93C5FD] bg-clip-text text-transparent">Dream Team</span>
        </h2>

        {/* Description */}
        <p className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed">
          Where human intuition meets machine precision
        </p>

        {/* CTA Button */}
        <button
          onClick={() => navigate(createPageUrl('DreamTeam'))}
          className="group relative px-12 py-5 bg-gradient-to-r from-[#1E40AF] via-[#3B82F6] to-[#60A5FA] rounded-2xl text-white font-bold text-lg tracking-wide shadow-[0_0_40px_rgba(59,130,246,0.6)] hover:shadow-[0_0_60px_rgba(59,130,246,0.9)] transition-all duration-500 hover:scale-105 active:scale-95 border border-[#60A5FA]/30"
        >
          <span className="relative z-10">Enter the Dream Team</span>
          <div className="absolute inset-0 bg-gradient-to-r from-[#60A5FA] to-[#93C5FD] opacity-0 group-hover:opacity-30 rounded-2xl transition-opacity duration-500" />
        </button>
      </div>
    </section>
  );
}