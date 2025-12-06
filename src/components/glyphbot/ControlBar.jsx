import React, { useState } from 'react';
import { Volume2, Wifi, FileSearch, FlaskConical, Braces, Layout, Trash2, Settings2, ChevronDown } from 'lucide-react';
import VoiceSettings from './VoiceSettings';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
    cyan: active 
      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.6),inset_0_0_15px_rgba(6,182,212,0.2)]' 
      : 'hover:border-cyan-500/50 hover:text-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]',
    purple: active 
      ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.6),inset_0_0_15px_rgba(168,85,247,0.2)]' 
      : 'hover:border-purple-500/50 hover:text-purple-400 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]',
    amber: active 
      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.6),inset_0_0_15px_rgba(245,158,11,0.2)]' 
      : 'hover:border-amber-500/50 hover:text-amber-400 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)]',
    rose: active 
      ? 'bg-rose-500/20 border-rose-400 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.6),inset_0_0_15px_rgba(244,63,94,0.2)]' 
      : 'hover:border-rose-500/50 hover:text-rose-400 hover:shadow-[0_0_15px_rgba(244,63,94,0.3)]',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold uppercase tracking-wide
        border-2 transition-all duration-300 backdrop-blur-sm
        ${active 
          ? colors[color]
          : `bg-slate-900/60 border-slate-700/50 text-slate-400 ${colors[color]}`
        }
      `}
    >
      <Icon className={`w-3.5 h-3.5 ${active ? 'drop-shadow-[0_0_6px_currentColor]' : ''}`} />
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
  onVoiceSettingsChange,
  voiceSettings,
  voiceProfiles = [],
  emotionPresets = []
}) {
  const [showVoiceControls, setShowVoiceControls] = useState(false);

  const handleVoiceChange = (key, value) => {
    if (onVoiceSettingsChange) {
      onVoiceSettingsChange(prev => ({ ...prev, [key]: value }));
    }
  };

  return (
    <div className="px-4 py-4 border-b border-purple-500/30 bg-gradient-to-r from-slate-950/90 via-purple-950/20 to-slate-950/90 backdrop-blur-xl">
      <div className="flex flex-wrap items-center gap-4 justify-between">
        {/* Dropdowns */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[9px] uppercase tracking-[0.25em] text-cyan-400/80 font-bold">Persona</label>
            <select
              value={persona}
              onChange={(e) => setPersona(e.target.value)}
              className="min-w-[140px] text-xs bg-slate-900/80 border-2 border-purple-500/40 rounded-xl px-3 py-2 text-cyan-200 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 transition-all shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            >
              {PERSONAS.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-slate-200">{p.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[9px] uppercase tracking-[0.25em] text-purple-400/80 font-bold">Model</label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="min-w-[160px] text-xs bg-slate-900/80 border-2 border-cyan-500/40 rounded-xl px-3 py-2 text-purple-200 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
            >
              {MODEL_OPTIONS.map((m) => (
                <option key={m.id} value={m.id} className="bg-slate-900 text-slate-200">{m.label}</option>
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
          
          {/* Phase 7: Enhanced Voice Controls */}
          {modes.voice && (
            <Popover open={showVoiceControls} onOpenChange={setShowVoiceControls}>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] bg-purple-500/20 border border-purple-500/40 text-purple-300 hover:bg-purple-500/30 transition-all">
                  <Settings2 className="w-3 h-3" />
                  <ChevronDown className="w-3 h-3" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-slate-900 border-purple-500/50 p-4 space-y-4">
                <div className="space-y-3">
                  <div className="text-xs font-bold text-cyan-300 uppercase tracking-wider">Voice Controls</div>
                  
                  {/* Emotion Preset */}
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-400">Emotion Preset</Label>
                    <Select 
                      value={voiceSettings?.emotion || 'neutral'} 
                      onValueChange={(val) => handleVoiceChange('emotion', val)}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {emotionPresets.map(e => (
                          <SelectItem key={e.id} value={e.id} className="text-white">
                            {e.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Voice Selection - OpenAI Voices */}
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-400">Voice Profile</Label>
                    <Select 
                      value={voiceSettings?.voiceProfile || 'neutral_female'} 
                      onValueChange={(val) => handleVoiceChange('voiceProfile', val)}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {voiceProfiles.map(v => (
                          <SelectItem key={v.id} value={v.id} className="text-white">
                            {v.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Pitch Slider - EXPANDED (0.5-2.0) */}
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-400 flex items-center justify-between">
                      <span>Pitch</span>
                      <span className="text-cyan-400 font-mono">{voiceSettings?.pitch?.toFixed(2) || '1.00'}x</span>
                    </Label>
                    <Slider
                      value={[voiceSettings?.pitch || 1.0]}
                      onValueChange={([val]) => handleVoiceChange('pitch', val)}
                      min={0.5}
                      max={2.0}
                      step={0.05}
                      className="w-full"
                    />
                    <div className="flex justify-between text-[9px] text-slate-600">
                      <span>Much Deeper</span>
                      <span>Much Higher</span>
                    </div>
                  </div>

                  {/* Speed Slider - EXPANDED (0.5-2.0) */}
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-400 flex items-center justify-between">
                      <span>Speed</span>
                      <span className="text-cyan-400 font-mono">{voiceSettings?.speed?.toFixed(2) || '1.00'}x</span>
                    </Label>
                    <Slider
                      value={[voiceSettings?.speed || 1.0]}
                      onValueChange={([val]) => handleVoiceChange('speed', val)}
                      min={0.5}
                      max={2.0}
                      step={0.05}
                      className="w-full"
                    />
                    <div className="flex justify-between text-[9px] text-slate-600">
                      <span>Much Slower</span>
                      <span>Much Faster</span>
                    </div>
                  </div>

                  {/* Bass Enhancement */}
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-400 flex items-center justify-between">
                      <span>Bass</span>
                      <span className="text-purple-400 font-mono">{((voiceSettings?.bass || 0) * 100).toFixed(0)}%</span>
                    </Label>
                    <Slider
                      value={[voiceSettings?.bass || 0]}
                      onValueChange={([val]) => handleVoiceChange('bass', val)}
                      min={-1.0}
                      max={1.0}
                      step={0.1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-[9px] text-slate-600">
                      <span>Thin</span>
                      <span>Deep</span>
                    </div>
                  </div>

                  {/* Clarity Enhancement */}
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-400 flex items-center justify-between">
                      <span>Clarity</span>
                      <span className="text-purple-400 font-mono">{((voiceSettings?.clarity || 0) * 100).toFixed(0)}%</span>
                    </Label>
                    <Slider
                      value={[voiceSettings?.clarity || 0]}
                      onValueChange={([val]) => handleVoiceChange('clarity', val)}
                      min={-1.0}
                      max={1.0}
                      step={0.1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-[9px] text-slate-600">
                      <span>Muffled</span>
                      <span>Crisp</span>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
          
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
            color="purple"
          />
          
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold uppercase tracking-wide bg-rose-950/40 border-2 border-rose-500/50 text-rose-300 hover:bg-rose-500/30 hover:border-rose-400 hover:shadow-[0_0_20px_rgba(244,63,94,0.5)] transition-all duration-300"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>
    </div>
  );
}