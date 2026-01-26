import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Home, Shield, QrCode, Bot, Menu } from 'lucide-react';

export default function MobileBottomNav({ onMenuOpen }) {
  const location = useLocation();
  
  const tabs = [
    { id: 'home', label: 'Home', icon: Home, path: '/', page: 'Home' },
    { id: 'services', label: 'Services', icon: Shield, path: '/services', page: 'Services' },
    { id: 'qr', label: 'QR Studio', icon: QrCode, path: '/qr', page: 'Qr' },
    { id: 'glyphbot', label: 'GlyphBot', icon: Bot, path: '/glyphbot', page: 'GlyphBot' }
  ];
  
  return (
    <nav 
      className="md:hidden fixed bottom-0 left-0 right-0 z-[10000] bg-gradient-to-t from-slate-950 via-slate-950/98 to-slate-950/95 backdrop-blur-2xl border-t-4 border-purple-500/60 shadow-[0_-8px_40px_rgba(168,85,247,0.4),0_-2px_20px_rgba(6,182,212,0.2)]"
      style={{ touchAction: 'manipulation', paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
    >
      <div className="flex items-center justify-around px-3 py-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;
          
          return (
            <Link
              key={tab.id}
              to={createPageUrl(tab.page)}
              className={`relative flex flex-col items-center justify-center min-w-[72px] min-h-[64px] rounded-2xl transition-all duration-200 ${
                isActive 
                  ? 'bg-gradient-to-br from-purple-600/30 to-cyan-600/20 text-cyan-300 scale-105 shadow-[0_0_20px_rgba(6,182,212,0.5)]' 
                  : 'text-slate-400 active:text-white active:bg-slate-800/60 active:scale-[0.97]'
              }`}
              style={{ touchAction: 'manipulation' }}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl animate-pulse" />
              )}
              <Icon className={`relative w-7 h-7 mb-1.5 transition-all duration-300 ${
                isActive ? 'scale-110 drop-shadow-[0_0_12px_rgba(6,182,212,1)]' : ''
              }`} />
              <span className={`relative text-[11px] font-bold tracking-wide ${isActive ? 'text-cyan-300' : ''}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
        
        <button
          onClick={onMenuOpen}
          className="flex flex-col items-center justify-center min-w-[72px] min-h-[64px] rounded-2xl text-slate-400 active:text-white active:bg-slate-800/60 active:scale-[0.97] transition-all duration-200"
          style={{ touchAction: 'manipulation' }}
        >
          <Menu className="w-7 h-7 mb-1.5" />
          <span className="text-[11px] font-bold tracking-wide">More</span>
        </button>
      </div>
    </nav>
  );
}