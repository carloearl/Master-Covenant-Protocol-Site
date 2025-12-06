/**
 * VoiceCustomizer - Phase 7 Voice Engine Enhancement
 * Full audio control panel with EQ, emotion presets, and voice selection
 */

import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Volume2, Sparkles } from 'lucide-react';

export default function VoiceCustomizer({
  settings = {},
  onSettingsChange,
  voiceProfiles = [],
  emotionPresets = [],
  onTest
}) {
  const handleChange = (key, value) => {
    if (onSettingsChange) {
      onSettingsChange({ ...settings, [key]: value });
    }
  };

  return (
    <div className="space-y-4 p-4 bg-slate-900/60 rounded-xl border-2 border-purple-500/30">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-bold text-cyan-300 uppercase tracking-wider">Voice Customization</span>
        </div>
        {onTest && (
          <Button
            onClick={onTest}
            size="sm"
            variant="outline"
            className="text-xs gap-1.5 bg-purple-500/20 border-purple-500/50 text-purple-300 hover:bg-purple-500/30"
          >
            <Sparkles className="w-3 h-3" />
            Test Voice
          </Button>
        )}
      </div>

      {/* Emotion Preset */}
      <div className="space-y-2">
        <Label className="text-xs text-slate-400 uppercase tracking-wider">Emotion Preset</Label>
        <Select 
          value={settings.emotion || 'neutral'} 
          onValueChange={(val) => handleChange('emotion', val)}
        >
          <SelectTrigger className="bg-slate-800/80 border-purple-500/40 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-purple-500/50">
            {emotionPresets.map(e => (
              <SelectItem key={e.id} value={e.id} className="text-white">
                {e.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Voice Profile */}
      <div className="space-y-2">
        <Label className="text-xs text-slate-400 uppercase tracking-wider">Voice Profile</Label>
        <Select 
          value={settings.voiceProfile || 'neutral_female'} 
          onValueChange={(val) => handleChange('voiceProfile', val)}
        >
          <SelectTrigger className="bg-slate-800/80 border-purple-500/40 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-purple-500/50">
            {voiceProfiles.map(v => (
              <SelectItem key={v.id} value={v.id} className="text-white">
                {v.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Pitch Control - EXPANDED RANGE (0.5-2.0) */}
      <div className="space-y-2">
        <Label className="text-xs text-slate-400 flex items-center justify-between uppercase tracking-wider">
          <span>Pitch</span>
          <span className="text-cyan-400 font-mono text-sm">{(settings.pitch || 1.0).toFixed(2)}x</span>
        </Label>
        <Slider
          value={[settings.pitch || 1.0]}
          onValueChange={([val]) => handleChange('pitch', val)}
          min={0.5}
          max={2.0}
          step={0.05}
          className="w-full"
        />
        <div className="flex justify-between text-[9px] text-slate-600">
          <span>Much Deeper</span>
          <span className="text-slate-500">Normal</span>
          <span>Much Higher</span>
        </div>
      </div>

      {/* Speed Control - EXPANDED RANGE (0.5-2.0) */}
      <div className="space-y-2">
        <Label className="text-xs text-slate-400 flex items-center justify-between uppercase tracking-wider">
          <span>Speed</span>
          <span className="text-cyan-400 font-mono text-sm">{(settings.speed || 1.0).toFixed(2)}x</span>
        </Label>
        <Slider
          value={[settings.speed || 1.0]}
          onValueChange={([val]) => handleChange('speed', val)}
          min={0.5}
          max={2.0}
          step={0.05}
          className="w-full"
        />
        <div className="flex justify-between text-[9px] text-slate-600">
          <span>Much Slower</span>
          <span className="text-slate-500">Normal</span>
          <span>Much Faster</span>
        </div>
      </div>

      {/* Bass Control - SOFTWARE EQ SIMULATION */}
      <div className="space-y-2">
        <Label className="text-xs text-slate-400 flex items-center justify-between uppercase tracking-wider">
          <span>Bass Enhancement</span>
          <span className="text-purple-400 font-mono text-sm">{((settings.bass || 0) * 100).toFixed(0)}%</span>
        </Label>
        <Slider
          value={[settings.bass || 0]}
          onValueChange={([val]) => handleChange('bass', val)}
          min={-1.0}
          max={1.0}
          step={0.1}
          className="w-full"
        />
        <div className="flex justify-between text-[9px] text-slate-600">
          <span>Thin</span>
          <span className="text-slate-500">Neutral</span>
          <span>Deep</span>
        </div>
      </div>

      {/* Clarity Control - HIGH SHELF EQ */}
      <div className="space-y-2">
        <Label className="text-xs text-slate-400 flex items-center justify-between uppercase tracking-wider">
          <span>Clarity Enhancement</span>
          <span className="text-purple-400 font-mono text-sm">{((settings.clarity || 0) * 100).toFixed(0)}%</span>
        </Label>
        <Slider
          value={[settings.clarity || 0]}
          onValueChange={([val]) => handleChange('clarity', val)}
          min={-1.0}
          max={1.0}
          step={0.1}
          className="w-full"
        />
        <div className="flex justify-between text-[9px] text-slate-600">
          <span>Muffled</span>
          <span className="text-slate-500">Neutral</span>
          <span>Crisp</span>
        </div>
      </div>

      {/* Volume Control */}
      <div className="space-y-2">
        <Label className="text-xs text-slate-400 flex items-center justify-between uppercase tracking-wider">
          <span>Volume</span>
          <span className="text-purple-400 font-mono text-sm">{((settings.volume || 1.0) * 100).toFixed(0)}%</span>
        </Label>
        <Slider
          value={[settings.volume || 1.0]}
          onValueChange={([val]) => handleChange('volume', val)}
          min={0.3}
          max={1.5}
          step={0.05}
          className="w-full"
        />
      </div>
    </div>
  );
}