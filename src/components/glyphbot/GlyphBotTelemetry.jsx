import React from 'react';
import { Activity, Shield } from 'lucide-react';

/**
 * GlyphBot Telemetry Sidebar
 * Shows real-time session stats and voice settings
 */
export default function GlyphBotTelemetry({ 
  messages, 
  chatCount, 
  lastMeta, 
  modes, 
  voiceSettings 
}) {
  return (
    <aside className="hidden xl:flex w-72 flex-col border-l-2 border-purple-500/30 bg-gradient-to-b from-slate-950/90 via-purple-950/10 to-slate-950/90 overflow-hidden">
      <div className="px-4 py-4 border-b-2 border-purple-500/30 bg-purple-500/10">
        <div className="flex items-center gap-2 text-xs">
          <Activity className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
          <span className="uppercase tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-bold">Telemetry</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Recent Messages Feed */}
        {messages.slice(-5).reverse().filter(m => m && m.content && m.role !== 'system').map((m, idx) => (
          <div key={m.id || `telem-${idx}`} className="rounded-xl border-2 border-purple-500/30 bg-slate-900/60 p-3 hover:border-cyan-400/50 transition-all duration-300 shadow-[0_0_10px_rgba(168,85,247,0.15)]">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-1 rounded-lg ${
                m.role === 'assistant' 
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.3)]' 
                  : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
              }`}>
                {m.role === 'assistant' ? 'Bot' : 'You'}
              </span>
              {m.latencyMs && (
                <span className="text-[9px] text-cyan-400/70 font-mono">{m.latencyMs}ms</span>
              )}
            </div>
            <p className="text-[11px] text-slate-300 line-clamp-2">{m.content}</p>
          </div>
        ))}

        {/* Session Stats */}
        <div className="space-y-2 pt-3 border-t border-purple-500/20">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">Current Session</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-900/60 border border-purple-500/30 rounded-lg p-2">
              <div className="text-lg font-bold text-cyan-300">{messages.length - 1}</div>
              <div className="text-[9px] text-slate-400 uppercase">Messages</div>
            </div>
            <div className="bg-slate-900/60 border border-purple-500/30 rounded-lg p-2">
              <div className="text-lg font-bold text-purple-300">{chatCount}</div>
              <div className="text-[9px] text-slate-400 uppercase">Total Chats</div>
            </div>
          </div>
        </div>

        {/* Last Response Metadata */}
        {lastMeta && (
          <div className="p-4 rounded-xl border-2 border-cyan-500/40 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
            <div className="text-[9px] uppercase tracking-[0.25em] text-cyan-400 font-bold mb-3">Last Response</div>
            <div className="space-y-2 text-[11px]">
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
                <span className="text-cyan-200 font-medium">{lastMeta.providerLabel || lastMeta.model}</span>
              </div>
              {lastMeta.realTimeUsed && (
                <div className="text-emerald-400 flex items-center gap-1">
                  <span className="drop-shadow-[0_0_4px_rgba(52,211,153,0.8)]">✓</span> Web search active
                </div>
              )}
              {lastMeta.shouldSpeak && (
                <div className="text-purple-400 flex items-center gap-1">
                  <span className="drop-shadow-[0_0_4px_rgba(168,85,247,0.8)]">✓</span> Voice enabled
                </div>
              )}
              {(modes.json || modes.struct || modes.audit) && (
                <div className="text-amber-400 flex items-center gap-1">
                  <span className="drop-shadow-[0_0_4px_rgba(245,158,11,0.8)]">✓</span> JSON mode
                </div>
              )}
            </div>
          </div>
        )}

        {/* Voice Settings Display */}
        {modes.voice && voiceSettings && (
          <div className="p-3 rounded-xl border border-purple-500/30 bg-slate-900/40">
            <div className="text-[9px] uppercase tracking-wider text-purple-400 font-bold mb-2">Active Voice</div>
            <div className="space-y-1 text-[10px] text-slate-300">
              <div>Profile: <span className="text-cyan-300">{voiceSettings.voiceProfile}</span></div>
              <div>Speed: <span className="text-cyan-300">{voiceSettings.speed}x</span></div>
              <div>Pitch: <span className="text-cyan-300">{voiceSettings.pitch}x</span></div>
              <div>Emotion: <span className="text-cyan-300">{voiceSettings.emotion}</span></div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}