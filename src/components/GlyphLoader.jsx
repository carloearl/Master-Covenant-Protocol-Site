import React from 'react';
import { Shield } from 'lucide-react';

export default function GlyphLoader({ fullScreen = true, text = "Securing..." }) {
  const containerClass = fullScreen 
    ? "fixed inset-0 z-[9999] flex items-center justify-center bg-black"
    : "relative w-full h-full min-h-[200px] flex items-center justify-center bg-black/50 rounded-xl";

  return (
    <div className={containerClass}>
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-ultraviolet/30 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan/30 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Main loader */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Rotating shield with pulse */}
        <div className="relative">
          {/* Outer glow ring */}
          <div className="absolute inset-0 animate-spin-slow">
            <div className="w-32 h-32 rounded-full border-4 border-transparent border-t-ultraviolet border-r-cyan" />
          </div>
          
          {/* Middle pulse ring */}
          <div className="absolute inset-2 animate-ping opacity-75">
            <div className="w-28 h-28 rounded-full bg-gradient-to-r from-ultraviolet/20 to-cyan/20" />
          </div>

          {/* Center shield */}
          <div className="relative flex items-center justify-center w-32 h-32">
            <div className="absolute inset-4 bg-gradient-to-br from-ultraviolet to-cyan rounded-full animate-pulse" />
            <Shield className="w-16 h-16 text-white relative z-10 animate-pulse" />
          </div>
        </div>

        {/* Loading text */}
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-ultraviolet via-cyan to-ultraviolet bg-clip-text animate-pulse">
            {text}
          </h2>
          
          {/* Animated dots */}
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-ultraviolet animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-cyan animate-bounce" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 rounded-full bg-ultraviolet animate-bounce" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>

        {/* Scanning line effect */}
        <div className="w-64 h-1 bg-gradient-to-r from-transparent via-cyan to-transparent animate-scan" />
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes scan {
          0%, 100% {
            transform: translateX(-100%);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .animate-scan {
          animation: scan 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

// Section loader variant
export function SectionLoader({ text = "Loading..." }) {
  return <GlyphLoader fullScreen={false} text={text} />;
}