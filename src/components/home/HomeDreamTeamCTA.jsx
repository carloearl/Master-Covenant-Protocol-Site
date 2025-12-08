import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function HomeDreamTeamCTA() {
  return (
    <section className="relative w-full py-20 overflow-hidden mt-20 mx-auto max-w-7xl rounded-3xl">

      {/* COURT BACKGROUND - CONTAINED */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden">
        <img
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/03ba5648e_3880beef-889a-4dec-9b80-2b561f3c47a31.jpg"
          alt=""
          className="w-full h-full object-contain"
        />
        <div className="absolute inset-0 bg-black/80"></div>
      </div>

      {/* CONTENT */}
      <div className="relative z-20 flex flex-col items-center text-center px-6 py-8">

        {/* HEADLINE */}
        <h2 className="text-white text-5xl md:text-6xl font-black mb-8 leading-tight drop-shadow-[0_4px_8px_rgba(0,0,0,1)]">
          THE GLYPHLOCK DREAM TEAM
        </h2>

        {/* TEXT BLOCK */}
        <div className="text-xl md:text-2xl max-w-4xl leading-relaxed mb-6 font-bold drop-shadow-[0_4px_8px_rgba(0,0,0,1)] space-y-4">
          <p className="text-purple-300">The Dream Team checks every angle every time.</p>
          
          <p className="text-white">GlyphLock runs <span className="text-blue-400">five AI systems</span> like a championship lineup —<br /><span className="text-indigo-300">logic, recall, orchestration, engineering, and code precision</span> all cross-checking each other in real time so <span className="text-cyan-400">bad answers die before they ever reach you.</span></p>
          
          <p className="text-cyan-300 text-2xl font-black mt-8">Tap the ball to meet the roster.</p>
        </div>

        {/* GLYPHLOCK LOGO BUTTON - CENTERED */}
        <div className="flex justify-center w-full">
          <Link to={createPageUrl("DreamTeam")}>
            <div className="relative group cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 flex flex-col items-center">
              
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
              <span className="block mt-6 text-white text-3xl font-black tracking-wider group-hover:text-purple-300 transition-colors drop-shadow-[0_4px_8px_rgba(0,0,0,1)]">
                ENTER THE DREAM TEAM →
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}