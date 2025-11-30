import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Play, Square, Settings2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function VoiceSettings({ ttsHook, onSettingsChange }) {
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [speed, setSpeed] = useState(0.95);
  const [pitch, setPitch] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  
  // Equalizer settings
  const [bass, setBass] = useState(0);      // -12 to +12 dB
  const [mid, setMid] = useState(0);        // -12 to +12 dB  
  const [treble, setTreble] = useState(0);  // -12 to +12 dB
  
  // Audio context for EQ
  const audioContextRef = useRef(null);
  const eqNodesRef = useRef(null);

  // Load available voices
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      const englishVoices = available
        .filter(v => v.lang.startsWith('en'))
        .map(v => ({
          name: v.name,
          lang: v.lang,
          local: v.localService
        }));
      setVoices(englishVoices);
      
      // Set default voice
      if (!selectedVoice && englishVoices.length > 0) {
        const defaultVoice = englishVoices.find(v => 
          v.name.includes('Google') || v.name.includes('Microsoft')
        ) || englishVoices[0];
        setSelectedVoice(defaultVoice.name);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [selectedVoice]);

  // Initialize Audio Context and EQ nodes
  useEffect(() => {
    if (!audioContextRef.current && typeof AudioContext !== 'undefined') {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create EQ bands
      const bassEQ = ctx.createBiquadFilter();
      bassEQ.type = 'lowshelf';
      bassEQ.frequency.value = 200;
      bassEQ.gain.value = bass;
      
      const midEQ = ctx.createBiquadFilter();
      midEQ.type = 'peaking';
      midEQ.frequency.value = 1000;
      midEQ.Q.value = 1;
      midEQ.gain.value = mid;
      
      const trebleEQ = ctx.createBiquadFilter();
      trebleEQ.type = 'highshelf';
      trebleEQ.frequency.value = 3000;
      trebleEQ.gain.value = treble;
      
      // Chain: bass -> mid -> treble -> destination
      bassEQ.connect(midEQ);
      midEQ.connect(trebleEQ);
      trebleEQ.connect(ctx.destination);
      
      audioContextRef.current = ctx;
      eqNodesRef.current = { bassEQ, midEQ, trebleEQ };
    }
    
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  // Update EQ in real-time
  useEffect(() => {
    if (eqNodesRef.current) {
      eqNodesRef.current.bassEQ.gain.value = bass;
      eqNodesRef.current.midEQ.gain.value = mid;
      eqNodesRef.current.trebleEQ.gain.value = treble;
    }
  }, [bass, mid, treble]);

  // Notify parent of settings changes
  useEffect(() => {
    onSettingsChange?.({
      voice: selectedVoice,
      speed,
      pitch,
      volume,
      bass,
      mid,
      treble,
      audioContext: audioContextRef.current,
      eqNodes: eqNodesRef.current
    });
  }, [selectedVoice, speed, pitch, volume, bass, mid, treble, onSettingsChange]);

  const testVoice = () => {
    if (!('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(
      "Hello, I'm GlyphBot, your elite security assistant."
    );
    
    const voice = window.speechSynthesis.getVoices().find(v => v.name === selectedVoice);
    if (voice) utterance.voice = voice;
    
    utterance.rate = speed;
    utterance.pitch = pitch;
    utterance.volume = volume;
    
    window.speechSynthesis.speak(utterance);
  };

  const stopTest = () => {
    window.speechSynthesis?.cancel();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-xs text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50"
        >
          <Settings2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Voice</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 bg-slate-900 border-slate-700 p-4"
        align="end"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-white flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-cyan-400" />
              Voice Settings
            </h4>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={testVoice}
                className="h-7 px-2 text-xs text-cyan-400 hover:bg-cyan-500/10"
              >
                <Play className="w-3 h-3 mr-1" />
                Test
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={stopTest}
                className="h-7 px-2 text-xs text-slate-400 hover:bg-slate-800"
              >
                <Square className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Voice Selection */}
          <div className="space-y-2">
            <label className="text-xs text-slate-400">Voice</label>
            <Select value={selectedVoice} onValueChange={setSelectedVoice}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-sm">
                <SelectValue placeholder="Select voice..." />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 max-h-48">
                {voices.map((voice) => (
                  <SelectItem 
                    key={voice.name} 
                    value={voice.name}
                    className="text-sm"
                  >
                    <span className="flex items-center gap-2">
                      {voice.name}
                      {voice.name.includes('Google') && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400">Neural</span>
                      )}
                      {voice.name.includes('Microsoft') && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">Neural</span>
                      )}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Speed */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-xs text-slate-400">Speed</label>
              <span className="text-xs text-cyan-400">{speed.toFixed(2)}x</span>
            </div>
            <Slider
              value={[speed]}
              onValueChange={([val]) => setSpeed(val)}
              min={0.5}
              max={2.0}
              step={0.05}
              className="py-2"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Slow</span>
              <span>Normal</span>
              <span>Fast</span>
            </div>
          </div>

          {/* Pitch */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-xs text-slate-400">Pitch</label>
              <span className="text-xs text-cyan-400">{pitch.toFixed(2)}</span>
            </div>
            <Slider
              value={[pitch]}
              onValueChange={([val]) => setPitch(val)}
              min={0.5}
              max={2.0}
              step={0.05}
              className="py-2"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Deep</span>
              <span>Normal</span>
              <span>High</span>
            </div>
          </div>

          {/* Volume */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-xs text-slate-400">Volume</label>
              <span className="text-xs text-cyan-400">{Math.round(volume * 100)}%</span>
            </div>
            <Slider
              value={[volume]}
              onValueChange={([val]) => setVolume(val)}
              min={0}
              max={1}
              step={0.05}
              className="py-2"
            />
          </div>

          {/* Equalizer Section */}
          <div className="pt-3 mt-3 border-t border-slate-800">
            <label className="text-xs text-slate-400 mb-3 block">Equalizer</label>
            
            <div className="grid grid-cols-3 gap-3">
              {/* Bass */}
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-slate-500 mb-1">Bass</span>
                <div className="h-24 flex flex-col items-center justify-center">
                  <Slider
                    orientation="vertical"
                    value={[bass]}
                    onValueChange={([val]) => setBass(val)}
                    min={-12}
                    max={12}
                    step={1}
                    className="h-20"
                  />
                </div>
                <span className={`text-[10px] mt-1 ${bass > 0 ? 'text-cyan-400' : bass < 0 ? 'text-rose-400' : 'text-slate-500'}`}>
                  {bass > 0 ? '+' : ''}{bass}dB
                </span>
              </div>
              
              {/* Mid */}
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-slate-500 mb-1">Mid</span>
                <div className="h-24 flex flex-col items-center justify-center">
                  <Slider
                    orientation="vertical"
                    value={[mid]}
                    onValueChange={([val]) => setMid(val)}
                    min={-12}
                    max={12}
                    step={1}
                    className="h-20"
                  />
                </div>
                <span className={`text-[10px] mt-1 ${mid > 0 ? 'text-cyan-400' : mid < 0 ? 'text-rose-400' : 'text-slate-500'}`}>
                  {mid > 0 ? '+' : ''}{mid}dB
                </span>
              </div>
              
              {/* Treble */}
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-slate-500 mb-1">Treble</span>
                <div className="h-24 flex flex-col items-center justify-center">
                  <Slider
                    orientation="vertical"
                    value={[treble]}
                    onValueChange={([val]) => setTreble(val)}
                    min={-12}
                    max={12}
                    step={1}
                    className="h-20"
                  />
                </div>
                <span className={`text-[10px] mt-1 ${treble > 0 ? 'text-cyan-400' : treble < 0 ? 'text-rose-400' : 'text-slate-500'}`}>
                  {treble > 0 ? '+' : ''}{treble}dB
                </span>
              </div>
            </div>
            
            {/* Reset EQ Button */}
            <button
              onClick={() => { setBass(0); setMid(0); setTreble(0); }}
              className="w-full mt-2 text-[10px] text-slate-500 hover:text-slate-300 transition-colors"
            >
              Reset EQ
            </button>
          </div>

          <p className="text-[10px] text-slate-500 text-center pt-2 border-t border-slate-800">
            EQ applies to voice output. Boost bass for deeper voice, treble for clarity.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}