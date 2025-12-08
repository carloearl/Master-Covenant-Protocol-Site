import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function HomeDreamTeamCTA() {
  return (
    <div className="w-full flex flex-col items-center mt-20">
      <section className="relative w-full py-12 overflow-hidden mx-auto max-w-5xl rounded-3xl border-4 border-transparent neon-ring-cta shadow-[0_0_80px_rgba(79,70,229,0.6)]">

        {/* COURT BACKGROUND - CONTAINED */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden">
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/03ba5648e_3880beef-889a-4dec-9b80-2b561f3c47a31.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* CONTENT */}
        <div className="relative z-20 flex flex-col items-center text-center px-8 py-6 min-h-[400px] justify-center">

          {/* HEADLINE */}
          <h2 className="text-white text-4xl md:text-5xl font-black mb-6 leading-tight drop-shadow-[0_4px_8px_rgba(0,0,0,1)]">
            THE GLYPHLOCK DREAM TEAM
          </h2>

          {/* TEXT BLOCK */}
          <div className="text-xl md:text-2xl w-full max-w-full leading-relaxed font-black drop-shadow-[0_4px_12px_rgba(0,0,0,1)] space-y-6">
            <p className="text-blue-500">The Dream Team checks every angle every time.</p>
            
            <p className="text-white">GlyphLock runs <span className="text-blue-400">five AI systems</span> like a championship lineup —<br /><span className="text-white">logic, recall, orchestration, engineering, and code precision</span> all cross-checking each other in real time so <span className="text-blue-500">bad answers die before they ever reach you.</span></p>
            

          </div>
        </div>
      </section>

      {/* GLYPHLOCK LOGO BUTTON - BELOW CTA */}
      <div className="flex justify-center w-full mt-12">
        <Link to={createPageUrl("DreamTeam")}>
          <div className="relative group cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 flex flex-col items-center">
            
            {/* BLACK GLOW BEHIND BUTTON */}
            <div className="absolute inset-0 -m-8 rounded-full bg-black/60 blur-3xl z-0"></div>
            
            {/* DREAM GLOW */}
            <div className="dream-glow"></div>
            
            {/* LOGO WITH 3D DEPTH */}
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/48ca17dba_c44b0deb.png"
              alt="Enter Dream Team"
              className="relative z-10 w-80 h-auto drop-shadow-[0_10px_80px_rgba(168,85,247,1)] group-hover:drop-shadow-[0_15px_120px_rgba(168,85,247,1)] transition-all filter group-hover:brightness-110"
              style={{ filter: 'drop-shadow(0 10px 40px rgba(0,0,0,0.8)) drop-shadow(0 0 80px rgba(168,85,247,1))' }}
            />

            {/* LABEL */}
            <span className="relative z-10 block mt-6 text-white text-2xl font-black tracking-wider group-hover:text-blue-400 transition-colors drop-shadow-[0_4px_8px_rgba(0,0,0,1)]">
              Tap the ball to meet the roster
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}