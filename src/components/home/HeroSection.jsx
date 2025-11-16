import React from "react";

export default function HeroSection() {
  return (
    <div className="w-full flex justify-center">
      <div className="relative w-[80%] h-[50vh]">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-contain"
          style={{ filter: 'brightness(1.1) contrast(1.1)' }}
        >
          <source src="https://i.imgur.com/zs3sPzJ.mp4" type="video/mp4" />
        </video>
        
        <div className="absolute z-10" style={{ bottom: '4px', right: '4px' }}>
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/08025b614_gl-logo.png"
            alt="GlyphLock"
            className="h-12 md:h-14 w-auto"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 pointer-events-none" />
      </div>
    </div>
  );
}