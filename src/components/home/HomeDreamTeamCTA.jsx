import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function HomeDreamTeamCTA() {
  return (
    <div className="w-full flex flex-col items-center mt-20">
      
      {/* HERO TEXT - ABOVE COURT */}
      <div className="text-center px-8 mb-8 max-w-5xl">
        <h2 className="text-white text-4xl md:text-5xl font-black mb-6 leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,1)]">
          <span className="text-blue-400">DREAM TEAM AI</span>, NOT STREETBALL TRICKS
        </h2>
        <div className="text-xl md:text-2xl leading-relaxed font-black drop-shadow-[0_4px_12px_rgba(0,0,0,1)] space-y-4">
          <p className="text-white">Other stacks do mixtape moves.<br />GlyphLock runs the Olympic playbook—<span className="text-blue-400">'92 talent, real sets, no solo highlights.</span></p>
        </div>
      </div>

      {/* COURT IMAGE WITH BUTTON OVERLAY */}
      <section className="relative w-full mx-auto max-w-5xl rounded-3xl shadow-[0_0_80px_rgba(79,70,229,0.6)] overflow-hidden">
        
        {/* COURT BACKGROUND - CONTAINED */}
        <div className="relative w-full aspect-[16/9]">
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/03ba5648e_3880beef-889a-4dec-9b80-2b561f3c47a31.jpg"
            alt="Basketball Court"
            className="w-full h-full object-cover brightness-125 contrast-125 saturate-150"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        </div>

        {/* BUTTON WITH GLOW - ON COURT */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <Link 
            to={createPageUrl("DreamTeam")} 
            className="group"
          >
            <div 
              className="relative cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 flex flex-col items-center" 
              style={{ 
                isolation: 'isolate', 
                pointerEvents: 'auto',
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent'
              }}
            >
              
              {/* BLACK GLOW BEHIND BUTTON */}
              <div 
                className="absolute inset-0 -m-8 rounded-full bg-black/60 blur-3xl" 
                style={{ zIndex: 1 }}
              ></div>
              
              {/* PULSING DREAM GLOW */}
              <div 
                className="absolute inset-0 -m-16 rounded-full animate-pulse"
                style={{ 
                  zIndex: 2,
                  background: 'radial-gradient(circle, rgba(79,70,229,0.8) 0%, rgba(65,105,225,0.6) 40%, transparent 70%)',
                  filter: 'blur(60px)'
                }}
              ></div>
              
              {/* LOGO */}
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/48ca17dba_c44b0deb.png"
                alt="Enter Dream Team"
                className="relative w-48 sm:w-56 md:w-64 h-auto dream-team-logo-glow"
                style={{ 
                  zIndex: 100,
                  pointerEvents: 'auto',
                  display: 'block',
                  visibility: 'visible',
                  opacity: 1
                }}
                loading="eager"
                draggable="false"
              />
            </div>
          </Link>
        </div>
      </section>

      {/* ROSTER ROLES - BELOW COURT */}
      <div className="relative w-full max-w-5xl mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
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
      <div className="relative w-full max-w-3xl mt-12 mb-12 p-6 rounded-xl bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-cyan-500/20 border-2 border-blue-400/40 backdrop-blur-md">
        <p className="text-lg text-white font-black text-center">
          They're not fighting for touches; they're running sets. <span className="text-blue-400">Specialized roles. Coordinated execution. Olympic-level play—not streetball.</span>
        </p>
      </div>
    </div>
  );
}