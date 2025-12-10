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
            <span className="text-blue-400">DREAM TEAM AI</span>, NOT STREETBALL TRICKS
          </h2>

          {/* TEXT BLOCK */}
          <div className="text-xl md:text-2xl w-full max-w-full leading-relaxed font-black drop-shadow-[0_4px_12px_rgba(0,0,0,1)] space-y-6">
            <p className="text-white">Other stacks do mixtape moves.<br />GlyphLock runs the Olympic playbook—<span className="text-blue-400">'92 talent, real sets, no solo highlights.</span></p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <Link
                to={createPageUrl('DreamTeam')}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-lg hover:from-cyan-500 hover:to-blue-500 transition-all shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] transform hover:scale-105"
              >
                Draft Your Dream Team
              </Link>
              <Link
                to={createPageUrl('DreamTeam')}
                className="px-8 py-4 rounded-xl border-2 border-cyan-400 text-cyan-400 font-bold text-lg hover:bg-cyan-400 hover:text-black transition-all"
              >
                See The Playbook
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* GLYPHLOCK LOGO BUTTON - BELOW CTA */}
      <div 
        className="flex justify-center w-full mt-12 mb-12 px-4" 
        style={{ 
          position: 'relative !important', 
          zIndex: 9999,
          isolation: 'isolate',
          minHeight: '350px',
          display: 'flex !important',
          visibility: 'visible !important',
          opacity: 1
        }}
      >
        <Link 
          to={createPageUrl("DreamTeam")} 
          style={{ 
            position: 'relative', 
            zIndex: 9999,
            display: 'block',
            visibility: 'visible !important'
          }}
        >
          <div 
            className="relative group cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 flex flex-col items-center" 
            style={{ 
              isolation: 'isolate', 
              pointerEvents: 'auto !important',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
              display: 'flex',
              visibility: 'visible !important',
              zIndex: 9999
            }}
          >
            
            {/* BLACK GLOW BEHIND BUTTON */}
            <div 
              className="absolute inset-0 -m-8 rounded-full bg-black/60 blur-3xl" 
              style={{ zIndex: 1 }}
            ></div>
            
            {/* DREAM GLOW */}
            <div 
              className="dream-glow" 
              style={{ zIndex: 2 }}
            ></div>
            
            {/* LOGO WITH 3D DEPTH */}
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/48ca17dba_c44b0deb.png"
              alt="Enter Dream Team"
              className="relative w-64 sm:w-72 md:w-80 h-auto dream-team-logo-glow"
              style={{ 
                zIndex: 100,
                pointerEvents: 'auto !important',
                display: 'block !important',
                visibility: 'visible !important',
                opacity: 1,
                minWidth: '250px',
                minHeight: '250px',
                maxWidth: '100%',
                height: 'auto',
                imageRendering: 'auto',
                WebkitUserSelect: 'none',
                userSelect: 'none'
              }}
              loading="eager"
              draggable="false"
            />

            {/* ROSTER ROLES */}
            <div className="relative w-full max-w-4xl mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4" style={{ zIndex: 100 }}>
              {[
                { name: 'Alfred', role: 'Point Guard (Floor General)', desc: 'Orchestrates the chain, calls the plays, enforces execution order so every touch has purpose.' },
                { name: 'Claude', role: 'Shooting Guard (Closer)', desc: 'Pure shot-maker on hard problems: deep reasoning, constraints, proofs. When it has to be right, the ball goes here.' },
                { name: 'Gemini', role: 'Power Forward (Matchup Nightmare)', desc: 'Multimodal force that bangs inside with data and stretches the floor with text, vision, code, and context.' },
                { name: 'Copilot', role: 'Small Forward (Two-Way Wing)', desc: 'Does the dirty work across the floor: enterprise integration, refactors, PRs, and safe deployment at scale.' },
                { name: 'Perplexity', role: 'Center (Rim Protector)', desc: 'Lives on truth—rebounds live data, blocks hallucinations, cleans every possession at the source.' },
                { name: 'Cursor', role: 'Sixth Man (Spark Plug & Binder)', desc: 'Comes off the bench and binds the stack—wires Alfred\'s plays into Claude, proxies Gemini, pipes through Copilot, feeds Perplexity clean looks.' }
              ].map((player, idx) => (
                <div key={idx} className="p-6 rounded-xl bg-black/60 border-2 border-blue-500/40 backdrop-blur-md hover:border-blue-400 transition-all">
                  <h3 className="text-xl font-black text-blue-400 mb-2">{player.name}</h3>
                  <p className="text-sm text-white/80 font-bold mb-3">{player.role}</p>
                  <p className="text-sm text-white/70 leading-relaxed">{player.desc}</p>
                </div>
              ))}
            </div>

            {/* CHEMISTRY LINE */}
            <div className="relative w-full max-w-3xl mt-12 p-6 rounded-xl bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-cyan-500/20 border-2 border-blue-400/40 backdrop-blur-md" style={{ zIndex: 100 }}>
              <p className="text-lg text-white font-black text-center">
                They're not fighting for touches; they're running sets. <span className="text-blue-400">Specialized roles. Coordinated execution. Olympic-level play—not streetball.</span>
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}