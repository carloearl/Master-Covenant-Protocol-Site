import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Home, Shield, QrCode, Bot, Menu } from 'lucide-react';

export default function MobileBottomNav({ onMenuOpen }) {
  const location = useLocation();
  
  const tabs = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'services', label: 'Services', icon: Shield, path: '/services' },
    { id: 'qr', label: 'QR Studio', icon: QrCode, path: '/qr' },
    { id: 'glyphbot', label: 'GlyphBot', icon: Bot, path: '/glyphbot' }
  ];
  
  return (
    <nav 
      className="md:hidden fixed bottom-0 left-0 right-0 z-[10000] bg-slate-950/95 backdrop-blur-xl border-t-2 border-purple-500/40 pb-safe shadow-[0_-4px_30px_rgba(168,85,247,0.3)]"
      style={{ touchAction: 'manipulation' }}
    >
      <div className="flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;
          
          return (
            <Link
              key={tab.id}
              to={createPageUrl(tab.id === 'home' ? 'Home' : tab.id === 'services' ? 'Services' : tab.id === 'qr' ? 'Qr' : 'GlyphBot')}
              className={`flex flex-col items-center justify-center min-w-[64px] min-h-[56px] rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-purple-500/20 text-cyan-400' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Icon className={`w-6 h-6 mb-1 transition-all duration-300 ${
                isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]' : ''
              }`} />
              <span className="text-[10px] font-semibold">{tab.label}</span>
            </Link>
          );
        })}
        
        <button
          onClick={onMenuOpen}
          className="flex flex-col items-center justify-center min-w-[64px] min-h-[56px] rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-300"
        >
          <Menu className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-semibold">More</span>
        </button>
      </div>
    </nav>
  );
}