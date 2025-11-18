import React from "react";

export default function HeroSection() {
  return (
    <div className="w-full flex justify-center px-2 sm:px-4">
      <div className="relative w-full sm:w-[95%] md:w-[85%] lg:w-[70%] max-w-7xl" style={{ aspectRatio: '16/9' }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover rounded-lg sm:rounded-xl"
          style={{ filter: 'brightness(1.1) contrast(1.1)' }}
        >
          <source src="https://i.imgur.com/zs3sPzJ.mp4" type="video/mp4" />
        </video>
        
        <div className="absolute z-10 bottom-6 right-6 sm:bottom-8 sm:right-8 md:bottom-10 md:right-10">
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/08025b614_gl-logo.png"
            alt="GlyphLock"
            className="h-8 sm:h-10 md:h-12 lg:h-14 w-auto"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 pointer-events-none rounded-lg sm:rounded-xl" />
      </div>
    </div>
  );
}