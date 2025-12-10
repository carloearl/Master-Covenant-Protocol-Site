// GlyphBot Phase 7 — Voice pipeline upgraded:
// - Real mapping of speed/pitch/emotion to TTS
// - Provider TTS preferred, Web Speech fallback
// - Backwards compatible with existing GlyphBot phases

import { useState, useRef, useCallback, useEffect } from 'react';
import { VOICE_PROFILES, EMOTION_PRESETS } from '../config';
import { tts as ttsService } from '../services';
import { synthesizeTTS } from '../services/ttsClient';

// Normalization helpers
function normalizeSpeed(speed) {
  return Math.min(2.0, Math.max(0.5, speed || 1.0));
}

function normalizePitch(pitch) {
  if (pitch === undefined || pitch === null) return 1.0;
  return Math.min(2.0, Math.max(0.5, pitch));
}

export default function useTTS(options = {}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ttsAvailable, setTtsAvailable] = useState(true);
  const [lastError, setLastError] = useState(null);
  const [voices, setVoices] = useState([]);
  const [metadata, setMetadata] = useState({});
  const [provider, setProvider] = useState(options.provider || 'auto');
  
  const utteranceRef = useRef(null);
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);

  const [currentSettings, setCurrentSettings] = useState({
    speed: options.speed || 1.0,
    pitch: options.pitch || 1.0,
    volume: options.volume || 1.0,
    bass: options.bass || 0,
    clarity: options.clarity || 0,
    voiceProfile: options.voiceProfile || 'neutral_female',
    emotion: options.emotion || 'neutral'
  });

  useEffect(() => {
    setCurrentSettings(prev => ({
      ...prev,
      ...(options.speed !== undefined && { speed: options.speed }),
      ...(options.pitch !== undefined && { pitch: options.pitch }),
      ...(options.volume !== undefined && { volume: options.volume }),
      ...(options.bass !== undefined && { bass: options.bass }),
      ...(options.clarity !== undefined && { clarity: options.clarity }),
      ...(options.voiceProfile !== undefined && { voiceProfile: options.voiceProfile }),
      ...(options.emotion !== undefined && { emotion: options.emotion })
    }));
  }, [options.speed, options.pitch, options.volume, options.bass, options.clarity, options.voiceProfile, options.emotion]);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setTtsAvailable(false);
      return;
    }

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
        setTtsAvailable(true);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const getBestVoice = useCallback(() => {
    if (voices.length === 0) return null;

    if (currentSettings.voiceProfile) {
      const userVoice = voices.find(v => v.name === currentSettings.voiceProfile);
      if (userVoice) return userVoice;
    }

    const preferredVoices = [
      'Google US English', 'Google UK English Female', 'Google UK English Male',
      'Microsoft Zira', 'Microsoft David', 'Microsoft Mark',
      'Samantha', 'Alex', 'Karen', 'Daniel'
    ];

    for (const name of preferredVoices) {
      const found = voices.find(v => v.name.includes(name));
      if (found) return found;
    }

    const englishVoice = voices.find(v => 
      v.lang.startsWith('en') && 
      !v.name.toLowerCase().includes('compact') &&
      (v.name.includes('Google') || v.name.includes('Microsoft') || v.localService === false)
    );

    if (englishVoice) return englishVoice;

    const anyEnglish = voices.find(v => v.lang.startsWith('en'));
    return anyEnglish || voices[0];
  }, [voices, currentSettings.voiceProfile]);

  const stop = useCallback(() => {
    try {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }

      if (audioRef.current?.source) {
        try {
          audioRef.current.source.stop();
        } catch (e) {
          console.warn('[TTS] Source already stopped:', e);
        }
        audioRef.current = null;
      }

      if (audioRef.current instanceof Audio) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }

      if (utteranceRef.current) {
        utteranceRef.current = null;
      }
    } catch (e) {
      console.warn('[TTS] Stop error:', e);
    }
    setIsSpeaking(false);
    setIsLoading(false);
  }, []);

  const playWithOpenAI = useCallback(async (text, settings, voiceId) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const audioContext = audioContextRef.current;

      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      const audioData = await synthesizeTTS(text, {
        voice: voiceId,
        speed: normalizeSpeed(settings.speed)
      });

      let audioBuffer = await audioContext.decodeAudioData(audioData);
      audioBuffer = await applyAudioFilters(audioContext, audioBuffer, settings);

      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;

      const gainNode = audioContext.createGain();
      gainNode.gain.value = settings.volume || 1.0;
      
      source.connect(gainNode);
      gainNode.connect(audioContext.destination);

      audioRef.current = { source, audioContext };

      source.onended = () => {
        setIsSpeaking(false);
        audioRef.current = null;
      };

      setIsLoading(false);
      setIsSpeaking(true);
      setMetadata({
        provider: 'openai',
        voiceId,
        pitch: settings.pitch,
        speed: settings.speed,
        bass: settings.bass,
        clarity: settings.clarity,
        timestamp: Date.now()
      });

      source.start(0);
      return true;

    } catch (error) {
      console.warn('[TTS] OpenAI failed:', error);
      setIsSpeaking(false);
      setIsLoading(false);
      throw error;
    }
  }, []);

  const playWithWebSpeech = useCallback(async (text, settings) => {
    try {
      if (!('speechSynthesis' in window)) {
        throw new Error('Web Speech not available');
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;
      
      // Select voice based on profile and emotion
      let voice = getBestVoice();
      
      // If bass/clarity/emotion affect voice selection, do it here
      if (settings.bass > 0.5 || settings.emotion === 'aggressive' || settings.emotion === 'intense') {
        // Prefer deeper/male voices for bass/aggressive
        const deepVoice = voices.find(v => 
          v.lang.startsWith('en') && 
          (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('alex'))
        );
        if (deepVoice) voice = deepVoice;
      } else if (settings.clarity > 0.5 || settings.emotion === 'calm' || settings.emotion === 'whisper') {
        // Prefer clearer/female voices for clarity/calm
        const clearVoice = voices.find(v => 
          v.lang.startsWith('en') && 
          (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('samantha'))
        );
        if (clearVoice) voice = clearVoice;
      }
      
      if (voice) {
        utterance.voice = voice;
      }

      // Apply normalized settings - CRITICAL FIX
      utterance.rate = normalizeSpeed(settings.speed);
      utterance.pitch = normalizePitch(settings.pitch);
      utterance.volume = Math.max(0, Math.min(1, settings.volume));

      utterance.onstart = () => {
        setIsLoading(false);
        setIsSpeaking(true);
        setMetadata({
          provider: 'webspeech',
          voice: voice?.name || 'Default',
          pitch: settings.pitch,
          speed: settings.speed,
          emotion: settings.emotion,
          timestamp: Date.now()
        });
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        utteranceRef.current = null;
      };

      utterance.onerror = (e) => {
        console.error('[TTS] Web Speech error:', e);
        setIsSpeaking(false);
        setIsLoading(false);
        setLastError(e.error || 'Speech error');
        utteranceRef.current = null;
      };

      window.speechSynthesis.cancel();
      await new Promise(r => setTimeout(r, 50));
      window.speechSynthesis.speak(utterance);
      return true;

    } catch (error) {
      console.error('[TTS] Web Speech failed:', error);
      setLastError(error.message);
      setIsLoading(false);
      return false;
    }
  }, [getBestVoice]);

  const playText = useCallback(async (text, customSettings = {}) => {
    if (!text || typeof text !== 'string') return false;
    
    const cleanText = text
      .replace(/[#*`🦕💠🦖🌟✨🔒⚡️💡🛡️•]/g, '')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/_([^_]+)_/g, '$1')
      .replace(/\n+/g, '. ')
      .replace(/\s+/g, ' ')
      .replace(/\.+/g, '.')
      .trim();
    
    if (!cleanText || cleanText.length < 2) return false;

    stop();
    setIsLoading(true);
    setLastError(null);

    // CRITICAL: Merge settings properly - customSettings override currentSettings
    let settings = { ...currentSettings };
    
    // Apply custom settings explicitly
    if (customSettings.voiceProfile !== undefined) settings.voiceProfile = customSettings.voiceProfile;
    if (customSettings.emotion !== undefined) settings.emotion = customSettings.emotion;
    if (customSettings.speed !== undefined) settings.speed = customSettings.speed;
    if (customSettings.pitch !== undefined) settings.pitch = customSettings.pitch;
    if (customSettings.volume !== undefined) settings.volume = customSettings.volume;
    if (customSettings.bass !== undefined) settings.bass = customSettings.bass;
    if (customSettings.clarity !== undefined) settings.clarity = customSettings.clarity;
    
    console.log('[TTS] Merged settings:', settings);
    
    // Apply emotion preset ONLY for values not explicitly set in customSettings
    if (settings.emotion && EMOTION_PRESETS[settings.emotion]) {
      const emotionPreset = EMOTION_PRESETS[settings.emotion];
      if (customSettings.pitch === undefined && emotionPreset.pitch !== undefined) {
        settings.pitch = emotionPreset.pitch;
      }
      if (customSettings.speed === undefined && emotionPreset.speed !== undefined) {
        settings.speed = emotionPreset.speed;
      }
      if (customSettings.volume === undefined && emotionPreset.volume !== undefined) {
        settings.volume = emotionPreset.volume;
      }
    }
    
    // Normalize all values for safety
    settings.speed = normalizeSpeed(settings.speed);
    settings.pitch = normalizePitch(settings.pitch);
    settings.volume = Math.max(0, Math.min(1, settings.volume || 1.0));
    settings.bass = Math.max(-1, Math.min(1, settings.bass || 0));
    settings.clarity = Math.max(-1, Math.min(1, settings.clarity || 0));

    console.log('[TTS] Final normalized settings:', settings);

    const voiceProfile = VOICE_PROFILES[settings.voiceProfile] || VOICE_PROFILES.neutral_female;
    const voiceId = voiceProfile.id;

    if (provider === 'auto' || provider === 'openai') {
      try {
        const success = await playWithOpenAI(cleanText, settings, voiceId);
        if (success) return true;
        
        if (provider === 'auto') {
          return await playWithWebSpeech(cleanText, settings);
        }
        return false;
      } catch (err) {
        console.error('[TTS] OpenAI TTS error:', err);
        if (provider === 'auto') {
          return await playWithWebSpeech(cleanText, settings);
        }
        setLastError(err.message);
        setIsLoading(false);
        return false;
      }
    }

    return await playWithWebSpeech(cleanText, settings);
  }, [provider, stop, playWithOpenAI, playWithWebSpeech, currentSettings]);

  const testTTS = useCallback(async () => {
    return playText('Hello! This is GlyphBot, your elite security assistant.');
  }, [playText]);

  const getVoiceProfiles = useCallback(() => {
    return Object.keys(VOICE_PROFILES).map(key => ({
      id: key,
      label: VOICE_PROFILES[key].label,
      voice: VOICE_PROFILES[key].id
    }));
  }, []);

  const getEmotionPresets = useCallback(() => {
    return Object.keys(EMOTION_PRESETS).map(key => ({
      id: key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      ...EMOTION_PRESETS[key]
    }));
  }, []);

  const getWebSpeechVoices = useCallback(() => {
    return voices.filter(v => v.lang.startsWith('en')).map(v => ({
      name: v.name,
      lang: v.lang,
      local: v.localService
    }));
  }, [voices]);

  return {
    playText,
    speak: playText,
    stop,
    testTTS,
    getVoiceProfiles,
    getEmotionPresets,
    getWebSpeechVoices,
    isSpeaking,
    isLoading,
    ttsAvailable,
    lastError,
    metadata,
    provider,
    currentSettings
  };
}

async function applyAudioFilters(audioContext, audioBuffer, settings) {
  try {
    const { bass = 0, clarity = 0, pitch = 1.0 } = settings;
    
    if (bass === 0 && clarity === 0 && pitch === 1.0) {
      return audioBuffer;
    }

    const offlineContext = new OfflineAudioContext(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    );

    const source = offlineContext.createBufferSource();
    source.buffer = audioBuffer;

    source.playbackRate.value = pitch;

    let lastNode = source;
    if (bass !== 0) {
      const bassFilter = offlineContext.createBiquadFilter();
      bassFilter.type = 'lowshelf';
      bassFilter.frequency.value = 200;
      bassFilter.gain.value = bass * 12;
      lastNode.connect(bassFilter);
      lastNode = bassFilter;
    }

    if (clarity !== 0) {
      const clarityFilter = offlineContext.createBiquadFilter();
      clarityFilter.type = 'highshelf';
      clarityFilter.frequency.value = 3000;
      clarityFilter.gain.value = clarity * 10;
      lastNode.connect(clarityFilter);
      lastNode = clarityFilter;
    }

    const compressor = offlineContext.createDynamicsCompressor();
    compressor.threshold.value = -30;
    compressor.knee.value = 20;
    compressor.ratio.value = 3;
    compressor.attack.value = 0.003;
    compressor.release.value = 0.1;
    lastNode.connect(compressor);

    compressor.connect(offlineContext.destination);

    source.start(0);
    const renderedBuffer = await offlineContext.startRendering();

    return renderedBuffer;

  } catch (error) {
    console.error('[TTS] Filter error:', error);
    return audioBuffer;
  }
}