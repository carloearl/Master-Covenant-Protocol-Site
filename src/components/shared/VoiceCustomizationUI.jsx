import React, { useState, useEffect } from 'react';
import { useUnifiedVoice } from './UnifiedVoiceProvider';
import { Volume2, Sliders, Play, RotateCcw, Save } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';

/**
 * 🎙️ VOICE CUSTOMIZATION UI
 * Advanced controls for voice synthesis settings
 * - Profile selection (8+ premium voices)
 * - Real-time parameter adjustment
 * - Instant preview
 * - Save custom configurations
 */
const VOICE_PROFILES = [
  { id: 'aurora', label: 'Aurora (Warm, Expressive)', gender: 'female', description: 'Premium female - natural and friendly' },
  { id: 'nova', label: 'Nova (Professional)', gender: 'female', description: 'Clear and polished female voice' },
  { id: 'shimmer', label: 'Shimmer (Energetic)', gender: 'female', description: 'Dynamic and upbeat female' },
  { id: 'echo', label: 'Echo (Conversational)', gender: 'male', description: 'Warm conversational male voice' },
  { id: 'onyx', label: 'Onyx (Deep)', gender: 'male', description: 'Deep and authoritative male' },
  { id: 'alloy', label: 'Alloy (Balanced)', gender: 'male', description: 'Natural balanced male voice' },
  { id: 'fable', label: 'Fable (Narrator)', gender: 'male', description: 'Expressive narrative male' },
];

const EMOTION_PRESETS = [
  { id: 'neutral', label: '😐 Neutral', pitch: 0, rate: 1.0 },
  { id: 'friendly', label: '😊 Friendly', pitch: 2, rate: 1.05 },
  { id: 'calm', label: '😌 Calm', pitch: -2, rate: 0.9 },
  { id: 'authoritative', label: '💼 Professional', pitch: -3, rate: 0.95 },
  { id: 'excited', label: '🎉 Excited', pitch: 4, rate: 1.15 },
];

export default function VoiceCustomizationUI({ onClose, minimal = false }) {
  const { voiceSettings, saveVoiceSettings } = useUnifiedVoice();
  const [settings, setSettings] = useState(voiceSettings || {
    voiceProfile: 'aurora',
    pitch: 1.0,
    speed: 1.0,
    volume: 1.0,
    bass: 0.2,
    clarity: 0.15,
    emotion: 'friendly'
  });
  const [previewText, setPreviewText] = useState('Hello! This is a preview of the aurora voice.');
  const [previewing, setPreviewing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (isAuth) {
          const user = await base44.auth.me();
          setCurrentUser(user);
        }
      } catch (err) {
        console.error('[VoiceCustomization] Auth error:', err);
      }
    })();
  }, []);

  const handlePreview = async () => {
    if (!previewText.trim() || previewing) return;

    setPreviewing(true);
    try {
      const { data } = await base44.functions.invoke('glyphBotJrChat', {
        action: 'listen',
        text: previewText,
        voiceSettings: settings
      });

      if (data.speak?.audioBase64) {
        const audioData = atob(data.speak.audioBase64);
        const audioArray = new Uint8Array(audioData.length);
        for (let i = 0; i < audioData.length; i++) {
          audioArray[i] = audioData.charCodeAt(i);
        }
        const blob = new Blob([audioArray], { type: 'audio/mpeg' });
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.playbackRate = settings.speed;
        await audio.play();
        
        audio.onended = () => {
          URL.revokeObjectURL(url);
          setPreviewing(false);
        };
      } else {
        toast.error('Failed to generate preview');
        setPreviewing(false);
      }
    } catch (err) {
      console.error('[VoicePreview] Error:', err);
      toast.error('Preview failed');
      setPreviewing(false);
    }
  };

  const handleSave = async () => {
    if (!currentUser) {
      toast.error('Please sign in to save voice settings');
      return;
    }

    try {
      saveVoiceSettings(settings);
      toast.success('Voice settings saved!');
      if (onClose) onClose();
    } catch (err) {
      console.error('[VoiceSave] Error:', err);
      toast.error('Failed to save settings');
    }
  };

  const handleReset = () => {
    const defaults = {
      voiceProfile: 'aurora',
      pitch: 1.0,
      speed: 1.0,
      volume: 1.0,
      bass: 0.2,
      clarity: 0.15,
      emotion: 'friendly'
    };
    setSettings(defaults);
    toast.success('Reset to defaults');
  };

  const handleEmotionPreset = (preset) => {
    setSettings(prev => ({
      ...prev,
      emotion: preset.id,
      pitch: preset.pitch,
      rate: preset.rate
    }));
  };

  if (minimal) {
    // Compact panel mode for sidebar
    return (
      <div className="space-y-4 p-4 bg-slate-900/40 rounded-xl border border-purple-500/30">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-purple-400" />
          <h3 className="font-semibold text-sm text-white">Voice Settings</h3>
        </div>

        {/* Profile Select */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-2">Voice Profile</label>
          <select
            value={settings.voiceProfile}
            onChange={(e) => setSettings(prev => ({ ...prev, voiceProfile: e.target.value }))}
            className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white"
          >
            {VOICE_PROFILES.map(v => (
              <option key={v.id} value={v.id}>{v.label}</option>
            ))}
          </select>
        </div>

        {/* Sliders */}
        {[
          { key: 'speed', label: 'Speed', min: 0.5, max: 2, step: 0.1 },
          { key: 'pitch', label: 'Pitch', min: 0.5, max: 2, step: 0.1 },
        ].map(slider => (
          <div key={slider.key}>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-300">{slider.label}</label>
              <span className="text-xs text-cyan-400 font-mono">{settings[slider.key].toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={slider.min}
              max={slider.max}
              step={slider.step}
              value={settings[slider.key]}
              onChange={(e) => setSettings(prev => ({ ...prev, [slider.key]: parseFloat(e.target.value) }))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        ))}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={handlePreview}
            disabled={previewing}
            className="flex-1 px-3 py-2 bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            <Play className="w-3 h-3 inline mr-1" /> Preview
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-3 py-2 bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 text-xs font-semibold rounded-lg transition-colors"
          >
            <Save className="w-3 h-3 inline mr-1" /> Save
          </button>
        </div>
      </div>
    );
  }

  // Full modal mode
  return (
    <div className="fixed inset-0 z-[9997] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pointer-events-auto">
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/30">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-b border-purple-500/30 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-600/30 flex items-center justify-center">
              <Sliders className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Voice Customization</h2>
              <p className="text-xs text-slate-400">Fine-tune your voice experience</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Voice Profile Selection */}
          <div>
            <label className="text-sm font-bold text-white block mb-3">📢 Voice Profile</label>
            <div className="grid grid-cols-2 gap-3">
              {VOICE_PROFILES.map(profile => (
                <button
                  key={profile.id}
                  onClick={() => setSettings(prev => ({ ...prev, voiceProfile: profile.id }))}
                  className={`p-3 rounded-xl text-left transition-all border-2 ${
                    settings.voiceProfile === profile.id
                      ? 'border-blue-400 bg-blue-500/20 shadow-lg shadow-blue-500/20'
                      : 'border-slate-600 bg-slate-800/40 hover:border-slate-500'
                  }`}
                >
                  <div className="font-semibold text-sm text-white">{profile.label}</div>
                  <div className="text-xs text-slate-400 mt-1">{profile.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Emotion Presets */}
          <div>
            <label className="text-sm font-bold text-white block mb-3">😊 Emotion</label>
            <div className="flex flex-wrap gap-2">
              {EMOTION_PRESETS.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => handleEmotionPreset(preset)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border-2 ${
                    settings.emotion === preset.id
                      ? 'border-purple-400 bg-purple-500/20'
                      : 'border-slate-600 bg-slate-800/40 hover:border-slate-500 text-slate-300'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Adjustment Sliders */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-white block">⚙️ Fine-Tune Parameters</label>
            {[
              { key: 'speed', label: 'Speed', min: 0.5, max: 2, step: 0.1, unit: 'x' },
              { key: 'pitch', label: 'Pitch', min: 0.5, max: 2, step: 0.1, unit: 'x' },
              { key: 'volume', label: 'Volume', min: 0.1, max: 2, step: 0.1, unit: 'x' },
              { key: 'bass', label: 'Bass', min: -1, max: 1, step: 0.1, unit: '' },
              { key: 'clarity', label: 'Clarity', min: -1, max: 1, step: 0.1, unit: '' },
            ].map(param => (
              <div key={param.key}>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-slate-300">{param.label}</label>
                  <span className="text-sm font-mono text-cyan-400 bg-slate-900/60 px-2 py-1 rounded">
                    {settings[param.key].toFixed(2)}{param.unit}
                  </span>
                </div>
                <input
                  type="range"
                  min={param.min}
                  max={param.max}
                  step={param.step}
                  value={settings[param.key]}
                  onChange={(e) => setSettings(prev => ({ ...prev, [param.key]: parseFloat(e.target.value) }))}
                  className="w-full h-2 bg-gradient-to-r from-slate-700 to-slate-600 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>
            ))}
          </div>

          {/* Preview Section */}
          <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-4">
            <label className="text-sm font-bold text-white block mb-3">🎤 Preview</label>
            <textarea
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              placeholder="Enter text to preview..."
              maxLength={200}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-3 resize-none"
              rows={3}
            />
            <button
              onClick={handlePreview}
              disabled={previewing || !previewText.trim()}
              className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {previewing ? '🔄 Playing...' : '▶️ Play Preview'}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-700">
            <button
              onClick={handleReset}
              className="flex-1 px-4 py-3 border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Reset Defaults
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold rounded-lg transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}