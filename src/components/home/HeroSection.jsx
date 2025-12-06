import React from "react";

export default function HeroSection() {
  return (
    <div className="w-full flex justify-center px-4 sm:px-6 py-8">
      <div className="relative w-full max-w-[1200px] group">
        {/* Royal Blue Glow Effect with Pulse */}
        <div className="absolute -inset-2 bg-gradient-to-r from-[#1E3A8A] via-[#3B82F6] to-[#1E40AF] rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition duration-1000 animate-pulse" style={{ willChange: 'opacity', transform: 'translateZ(0)' }}></div>
        <div className="absolute -inset-1 bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] rounded-2xl blur opacity-30" style={{ transform: 'translateZ(0)' }}></div>
        
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-[#3B82F6]/50 shadow-[0_0_60px_rgba(59,130,246,0.4)] hover:shadow-[0_0_80px_rgba(30,58,138,0.5)] transition-all duration-500" style={{ aspectRatio: '16/9', transform: 'translateZ(0)', willChange: 'box-shadow' }}>
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover z-0"
            style={{ filter: 'brightness(1.1) contrast(1.1)', transform: 'translateZ(0)' }}
          >
            <source src="https://base44.app/api/apps/6902128ac3c5c94a82446585/files/public/6902128ac3c5c94a82446585/643dc9ba3_Dec_05__2220_13s_202512052257_lc8rw.mp4" type="video/mp4" />
          </video>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none z-[1]" />
          
          <div className="absolute z-10 bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 md:bottom-3 md:right-3 lg:bottom-4 lg:right-4 flex items-center gap-2 md:gap-3">
            <span className="text-white font-black tracking-[0.3em] text-[10px] sm:text-xs md:text-sm uppercase hidden sm:block drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] animate-pulse">
              SYSTEM ACTIVE
            </span>
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/08025b614_gl-logo.png"
              alt="GlyphLock"
              loading="eager"
              decoding="async"
              className="h-6 sm:h-8 md:h-10 lg:h-12 w-auto drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]"
              style={{ transform: 'translateZ(0)' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}