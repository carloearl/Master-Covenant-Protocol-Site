import React from "react";

export default function HeroSection() {
  return (
    <div className="w-full flex justify-center px-4 sm:px-6 py-8">
      <div className="relative w-full max-w-[1200px] group">
        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#00E4FF] to-[#8C4BFF] rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
        
        <div className="relative w-full rounded-2xl overflow-hidden border border-[#00E4FF]/20 shadow-2xl shadow-black/50" style={{ aspectRatio: '16/9' }}>
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(1.1) contrast(1.1)' }}
          >
            <source src="https://i.imgur.com/zs3sPzJ.mp4" type="video/mp4" />
          </video>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          
          <div className="absolute z-10 bottom-3 right-3 md:bottom-5 md:right-5 flex items-center gap-3">
            <span className="text-white/80 font-bold font-space tracking-widest text-xs md:text-sm uppercase hidden sm:block">
              System Active
            </span>
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/08025b614_gl-logo.png"
              alt="GlyphLock"
              className="h-8 md:h-12 w-auto drop-shadow-[0_0_10px_rgba(0,228,255,0.5)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}