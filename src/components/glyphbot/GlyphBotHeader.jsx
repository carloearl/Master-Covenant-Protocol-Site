import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Bot, Shield, Activity, PanelRightOpen, PanelRightClose } from 'lucide-react';

/**
 * GlyphBot Header Component
 * Displays branding, status, and navigation controls
 */
export default function GlyphBotHeader({ 
  currentUser,
  currentProviderLabel,
  showAuditPanel,
  showHistoryPanel,
  onToggleAuditPanel,
  onToggleHistoryPanel
}) {
  return (
    <header className="flex items-center justify-between px-5 py-4 border-b-2 border-purple-500/40 bg-transparent backdrop-blur-xl shadow-[0_4px_30px_rgba(168,85,247,0.2)]">
      <div className="flex items-center gap-4">
        <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/30 to-purple-500/30 border-2 border-cyan-400/60 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.5),inset_0_0_15px_rgba(168,85,247,0.3)]">
          <Bot className="w-6 h-6 text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950 shadow-[0_0_12px_rgba(52,211,153,0.9)] animate-pulse" />
        </div>
        <div>
          <h1 className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 tracking-wide drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">GlyphBot</h1>
          <p className="text-[10px] text-purple-400/80 uppercase tracking-[0.3em] font-semibold">Elite AI Security</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-3 text-xs px-3 py-2 rounded-xl bg-slate-900/60 border border-purple-500/30">
          <span className="flex items-center gap-1.5 text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,1)]" />
            Online
          </span>
          <span className="text-purple-500/60">|</span>
          <span className="text-purple-300 font-medium">{currentProviderLabel || 'Gemini (Primary)'}</span>
        </div>
        
        {currentUser && (
          <>
            <button
              onClick={onToggleAuditPanel}
              data-tour="audit-toggle"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-300 preserve-size ${
                showAuditPanel 
                  ? 'bg-cyan-500/30 border-2 border-cyan-400 text-cyan-300'
                  : 'bg-purple-500/20 border-2 border-purple-500/50 text-purple-300 hover:border-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/20'
              }`}
              title={showAuditPanel ? 'Hide Audit' : 'Show Audit'}
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Audit</span>
            </button>
            <button
              onClick={onToggleHistoryPanel}
              data-tour="history-toggle"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500/20 border-2 border-emerald-500/50 text-emerald-300 hover:border-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/20 transition-all duration-300 preserve-size"
              title={showHistoryPanel ? 'Hide History' : 'Show History'}
            >
              {showHistoryPanel ? <PanelRightClose className="w-3.5 h-3.5" /> : <PanelRightOpen className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">History</span>
            </button>
          </>
        )}
        
        <Link
          to={createPageUrl('ProviderConsole')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-purple-500/20 border-2 border-purple-500/50 text-purple-300 hover:border-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/20 transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] preserve-size"
        >
          <Activity className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Console</span>
        </Link>
      </div>
    </header>
  );
}