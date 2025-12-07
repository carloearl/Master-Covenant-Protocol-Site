import React, { useEffect, useState } from 'react';
import GlyphBotPage from './GlyphBot';

// Simple device breakpoint
const MOBILE_BREAKPOINT = 768;

function detectIsMobile() {
  if (typeof window === 'undefined') return false;

  const ua = window.navigator.userAgent || '';
  const isTouchScreen =
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0;

  const isMobileUA =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Samsung/i.test(ua);

  const isSmallViewport = window.innerWidth < MOBILE_BREAKPOINT;

  return (isTouchScreen && isSmallViewport) || isMobileUA;
}

/**
 * Desktop / Web Shell
 * Shown on: Chrome, Safari, desktop browsers, big tablets in landscape, etc.
 */
function DesktopShell({ children }) {
  return (
    <div className="min-h-screen w-full bg-black text-slate-50 flex flex-col">
      <header className="w-full border-b border-purple-500/40 bg-gradient-to-r from-slate-950 via-purple-950/30 to-slate-950 shadow-[0_0_40px_rgba(168,85,247,0.35)] z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-2xl bg-gradient-to-br from-cyan-500/40 to-purple-500/40 border border-cyan-400/60 flex items-center justify-center">
              <span className="text-xs font-bold tracking-widest text-cyan-100">GL</span>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-900 animate-pulse shadow-[0_0_12px_rgba(52,211,153,1)]" />
            </div>
            <div>
              <div className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300">
                GlyphLock Console
              </div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-purple-400/70">
                GlyphBot · Security Stack
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,1)]" />
              Live
            </span>
            <span className="text-purple-400/60">|</span>
            <span className="text-cyan-200">Desktop Mode</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex justify-center items-stretch bg-black">
        <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col px-2 sm:px-4 py-3 sm:py-4">
          {children}
        </div>
      </main>
    </div>
  );
}

/**
 * Mobile Shell
 * Shown on: iOS Safari, Android Chrome/Firefox/Samsung browser, small viewports.
 */
function MobileShell({ children }) {
  return (
    <div className="min-h-screen w-full bg-black text-slate-50 flex flex-col">
      <header className="w-full border-b border-purple-500/40 bg-gradient-to-r from-black via-slate-950 to-black shadow-[0_0_30px_rgba(168,85,247,0.4)] z-20">
        <div className="px-3 py-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 rounded-2xl bg-gradient-to-br from-cyan-500/40 to-purple-500/40 border border-cyan-400/60 flex items-center justify-center">
              <span className="text-[10px] font-bold tracking-[0.2em] text-cyan-100">GL</span>
              <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 border border-slate-900 animate-pulse shadow-[0_0_8px_rgba(52,211,153,1)]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-cyan-100">GlyphBot</span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-purple-400/80">Mobile Console</span>
            </div>
          </div>

          <div className="flex flex-col items-end text-[9px] leading-tight text-purple-300/80">
            <span>Optimized for touch</span>
            <span className="text-[8px] text-purple-400/70">iOS · Android · Samsung</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col bg-black">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-2 pt-2 pb-[calc(env(safe-area-inset-bottom,0px)+12px)]">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

/**
 * MobilePage:
 * Single entry that decides which shell to render.
 */
export default function MobilePage() {
  const [isMobile, setIsMobile] = useState(null);

  useEffect(() => {
    setIsMobile(detectIsMobile());

    const onResize = () => {
      setIsMobile(detectIsMobile());
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, []);

  if (isMobile === null) {
    return null;
  }

  const Shell = isMobile ? MobileShell : DesktopShell;

  return (
    <Shell>
      <GlyphBotPage />
    </Shell>
  );
}