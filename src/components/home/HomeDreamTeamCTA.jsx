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

        {/* GLYPHLOCK STAMP LOGO */}
        <img
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/48ca17dba_c44b0deb.png"
          alt="Dream Team GlyphLock"
          className="w-72 h-auto mb-8 drop-shadow-[0_0_50px_rgba(168,85,247,1)]"
        />

        {/* HEADLINE - HIGH CONTRAST */}
        <h2 className="text-white text-5xl md:text-6xl font-black mb-6 leading-tight drop-shadow-[0_4px_8px_rgba(0,0,0,1)]">
          AI didn't understand teamwork…
          <br />
          <span className="text-purple-400 drop-shadow-[0_4px_12px_rgba(168,85,247,1)]">
            until we showed it the Dream Team.
          </span>
        </h2>

        {/* SUBTEXT - VISIBLE */}
        <p className="text-white text-2xl md:text-3xl max-w-4xl leading-relaxed mb-6 font-bold drop-shadow-[0_4px_8px_rgba(0,0,0,1)]">
          GlyphLock runs five AI systems like a championship lineup—each one covering the others, checking every output, and eliminating blind spots in real time.
        </p>

        <p className="text-cyan-300 text-3xl md:text-4xl font-black mb-8 drop-shadow-[0_4px_12px_rgba(0,0,0,1)]">
          One model fails. A team doesn't.
        </p>

        {/* GL BALL BUTTON - CENTERED */}
        <div className="flex justify-center w-full">
          <Link to={createPageUrl("DreamTeam")}>
            <div className="relative group cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 flex flex-col items-center">
              
              {/* MULTIPLE GLOW LAYERS FOR DEPTH */}
              <div className="absolute inset-0 rounded-full blur-[80px] opacity-90 group-hover:opacity-100 transition-opacity" style={{ background: 'radial-gradient(circle, rgba(168,85,247,1), rgba(139,92,246,0.9), transparent)' }}></div>
              <div className="absolute inset-0 rounded-full blur-[40px] opacity-70 group-hover:opacity-90 transition-opacity" style={{ background: 'radial-gradient(circle, rgba(199,102,255,1), rgba(168,85,247,0.8), transparent)' }}></div>
              
              {/* BALL WITH 3D DEPTH */}
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/cad061e3b_6a408ca0.png"
                alt="Enter Dream Team"
                className="relative w-64 h-64 drop-shadow-[0_10px_80px_rgba(168,85,247,1)] group-hover:drop-shadow-[0_15px_120px_rgba(168,85,247,1)] transition-all filter group-hover:brightness-110"
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