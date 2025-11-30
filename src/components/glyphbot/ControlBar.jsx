import React from 'react';
import { Volume2, Wifi, FileSearch, FlaskConical, Braces, Layout, Trash2, Settings2 } from 'lucide-react';
import VoiceSettings from './VoiceSettings';

const PERSONAS = [
  { id: 'GENERAL', name: 'General', desc: 'Default assistant' },
  { id: 'SECURITY', name: 'Security', desc: 'Threat analysis' },
  { id: 'BLOCKCHAIN', name: 'Blockchain', desc: 'Smart contracts' },
  { id: 'AUDIT', name: 'Audit', desc: 'Forensic precision' },
  { id: 'DEBUGGER', name: 'Debugger', desc: 'Bug fixes' },
  { id: 'PERFORMANCE', name: 'Performance', desc: 'Optimization' },
  { id: 'REFACTOR', name: 'Refactor', desc: 'Code cleanup' },
  { id: 'ANALYTICS', name: 'Analytics', desc: 'Pattern detection' },
];

const MODEL_OPTIONS = [
  { id: 'AUTO', label: 'Auto (Omega Chain)' },
  { id: 'GEMINI', label: 'Gemini Flash (Primary)' },
  { id: 'OPENAI', label: 'OpenAI GPT-4' },
  { id: 'CLAUDE', label: 'Claude Sonnet' },
  { id: 'OPENROUTER', label: 'OpenRouter Gateway' },
  { id: 'LOCAL_OSS', label: 'Local Fallback' },
];

function ModeToggle({ active, icon: Icon, label, onClick, color = 'cyan' }) {
  const colors = {
    cyan: active ? 'bg-cyan-500/15 border-cyan-400/70 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)]' : '',
    purple: active ? 'bg-purple-500/15 border-purple-400/70 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.4)]' : '',
    amber: active ? 'bg-amber-500/15 border-amber-400/70 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.4)]' : '',
    rose: active ? 'bg-rose-500/15 border-rose-400/70 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.4)]' : '',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium
        border transition-all duration-200
        ${active 
          ? colors[color]
          : 'bg-slate-950/50 border-slate-700/60 text-slate-500 hover:border-slate-500/80 hover:text-slate-400'
        }
      `}
    >
      <Icon className="w-3.5 h-3.5" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

export default function ControlBar({
  persona,
  setPersona,
  provider,
  setProvider,
  modes,
  onToggleMode,
  onClear,
  onVoiceSettingsChange
}) {
  return (
    <div className="px-4 py-3 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-sm">
      <div className="flex flex-wrap items-center gap-3 justify-between">
        {/* Dropdowns */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-0.5">
            <label className="text-[9px] uppercase tracking-[0.2em] text-slate-600 font-medium">Persona</label>
            <select
              value={persona}
              onChange={(e) => setPersona(e.target.value)}
              className="min-w-[130px] text-xs bg-slate-900/80 border border-slate-700/60 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50"
            >
              {PERSONAS.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-0.5">
            <label className="text-[9px] uppercase tracking-[0.2em] text-slate-600 font-medium">Model</label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="min-w-[150px] text-xs bg-slate-900/80 border border-slate-700/60 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50"
            >
              {MODEL_OPTIONS.map((m) => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Mode toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          <ModeToggle 
            active={modes.voice} 
            icon={Volume2} 
            label="Voice" 
            onClick={() => onToggleMode('voice')}
            color="purple"
          />
          <VoiceSettings onSettingsChange={onVoiceSettingsChange} />
          <ModeToggle 
            active={modes.live} 
            icon={Wifi} 
            label="Live" 
            onClick={() => onToggleMode('live')}
            color="cyan"
          />
          <ModeToggle 
            active={modes.audit} 
            icon={FileSearch} 
            label="Audit" 
            onClick={() => onToggleMode('audit')}
            color="amber"
          />
          <ModeToggle 
            active={modes.json} 
            icon={Braces} 
            label="JSON" 
            onClick={() => onToggleMode('json')}
            color="cyan"
          />
          <ModeToggle 
            active={modes.panel} 
            icon={Layout} 
            label="Panel" 
            onClick={() => onToggleMode('panel')}
            color="cyan"
          />
          
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-rose-950/30 border border-rose-500/40 text-rose-400 hover:bg-rose-950/50 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>
    </div>
  );
}