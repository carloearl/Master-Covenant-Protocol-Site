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

            {/* LABEL */}
            <span 
              className="relative block mt-4 md:mt-6 text-white text-lg sm:text-xl md:text-2xl font-black tracking-wider group-hover:text-blue-400 transition-colors" 
              style={{ 
                zIndex: 100,
                textShadow: '0 4px 8px rgba(0,0,0,1)',
                display: 'block !important',
                visibility: 'visible !important'
              }}
            >
              Tap the ball to meet the roster
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}