/**
 * GlyphBot TTS Hook - Phase 7.1 OpenAI TTS Engine A
 * Hybrid TTS: OpenAI TTS (primary via backend) + Web Speech (fallback)
 * 
 * Usage:
 * const { playText, stop, isSpeaking } = useTTS({ provider: 'auto' });
 * await playText("Hello world", { voice: 'alloy', speed: 1.0 });
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { synthesizeTTS } from './ttsClient';

// Phase 7C: Voice Profiles (OpenAI TTS voices)
const VOICE_PROFILES = {
  neutral_female: { id: 'nova', label: 'Nova (Neutral Female)', pitch: 1.0 },
  neutral_male: { id: 'onyx', label: 'Onyx (Neutral Male)', pitch: 1.0 },
  warm_storyteller: { id: 'shimmer', label: 'Shimmer (Warm)', pitch: 1.05 },
  precise_technical: { id: 'echo', label: 'Echo (Precise)', pitch: 0.95 }
};

// Phase 7C: Emotion Presets (refined for noticeable differences)
const EMOTION_PRESETS = {
  neutral: { pitch: 1.0, speed: 1.0, volume: 1.0 },
  confident: { pitch: 1.05, speed: 1.05, volume: 1.0 },
  calm: { pitch: 0.95, speed: 0.9, volume: 0.9 },
  urgent: { pitch: 1.05, speed: 1.1, volume: 1.0 }
};

export default function useTTS(options = {}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ttsAvailable, setTtsAvailable] = useState(true); // Always available (fallback exists)
  const [lastError, setLastError] = useState(null);
  const [voices, setVoices] = useState([]);
  const [metadata, setMetadata] = useState({});
  const [provider, setProvider] = useState(options.provider || 'auto');
  
  const utteranceRef = useRef(null);
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);

  // Default settings (Phase 7C)
  const defaultSettings = useRef({
    speed: options.speed || 1.0,
    pitch: options.pitch || 1.0,
    volume: options.volume || 1.0,
    voiceProfile: options.voiceProfile || 'neutral_female',
    emotion: options.emotion || 'neutral'
  });

  // Update settings when options change
  useEffect(() => {
    if (options.speed !== undefined) defaultSettings.current.speed = options.speed;
    if (options.pitch !== undefined) defaultSettings.current.pitch = options.pitch;
    if (options.volume !== undefined) defaultSettings.current.volume = options.volume;
    if (options.voiceProfile !== undefined) defaultSettings.current.voiceProfile = options.voiceProfile;
    if (options.emotion !== undefined) defaultSettings.current.emotion = options.emotion;
  }, [options.speed, options.pitch, options.volume, options.voiceProfile, options.emotion]);

  // Load voices (they load async in some browsers)
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
        console.log('[TTS] Loaded', availableVoices.length, 'voices');
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Find the best natural-sounding voice (or use user-selected)
  const getBestVoice = useCallback(() => {
    if (voices.length === 0) return null;

    // If user selected a specific voice, use that
    if (defaultSettings.current.voiceProfile) {
      const userVoice = voices.find(v => v.name === defaultSettings.current.voiceProfile);
      if (userVoice) {
        return userVoice;
      }
    }

    // Priority order for natural voices (most natural first)
    const preferredVoices = [
      // Google Neural voices (best quality)
      'Google US English',
      'Google UK English Female',
      'Google UK English Male',
      // Microsoft Neural voices (very good)
      'Microsoft Zira',
      'Microsoft David',
      'Microsoft Mark',
      'Microsoft Guy Online',
      'Microsoft Aria Online',
      // Apple voices (macOS/iOS - excellent)
      'Samantha',
      'Alex',
      'Karen',
      'Daniel',
      // Edge/Windows 11 neural
      'Microsoft Jenny',
      'Microsoft Ryan',
      // Fallback quality voices
      'Fiona',
      'Moira',
      'Tessa'
    ];

    // Try to find a preferred voice
    for (const name of preferredVoices) {
      const found = voices.find(v => v.name.includes(name));
      if (found) {
        return found;
      }
    }

    // Fallback: find any English voice that's not "compact" or "enhanced" 
    const englishVoice = voices.find(v => 
      v.lang.startsWith('en') && 
      !v.name.toLowerCase().includes('compact') &&
      (v.name.includes('Google') || v.name.includes('Microsoft') || v.localService === false)
    );

    if (englishVoice) {
      return englishVoice;
    }

    // Last resort: first English voice
    const anyEnglish = voices.find(v => v.lang.startsWith('en'));
    return anyEnglish || voices[0];
  }, [voices]);

  /**
   * Stop any currently playing speech
   */
  const stop = useCallback(() => {
    try {
      // Stop Web Speech
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }

      // Stop AudioContext source (OpenAI)
      if (audioRef.current?.source) {
        try {
          audioRef.current.source.stop();
        } catch (e) {
          console.warn('[GlyphBot TTS] Source already stopped:', e);
        }
        audioRef.current = null;
      }

      // Stop old Audio element (legacy fallback)
      if (audioRef.current instanceof Audio) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }

      if (utteranceRef.current) {
        utteranceRef.current = null;
      }
    } catch (e) {
      console.warn('[GlyphBot TTS] Stop error:', e);
    }
    setIsSpeaking(false);
    setIsLoading(false);
  }, []);

  /**
   * Phase 7.1: OpenAI TTS playback via AudioContext
   * Uses backend proxy for API calls
   */
  const playWithOpenAI = useCallback(async (text, settings, voiceId) => {
    try {
      // Initialize AudioContext if needed
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const audioContext = audioContextRef.current;

      // Resume if suspended (browser autoplay policy)
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      // Call backend TTS proxy with emotion-enhanced text
      let enhancedText = text;
      if (settings.emotion && settings.emotion !== 'neutral') {
        const emotionInstructions = {
          confident: '[Speak with authority and conviction] ',
          calm: '[Speak in a soothing, reassuring tone] ',
          urgent: '[Speak with energy and urgency] ',
          storyteller: '[Speak as if narrating an engaging story] '
        };
        enhancedText = (emotionInstructions[settings.emotion] || '') + text;
      }

      console.log('[GlyphBot TTS] OpenAI synthesis starting:', { voiceId, speed: settings.speed, emotion: settings.emotion });

      const audioData = await synthesizeTTS(enhancedText, {
        voice: voiceId,
        speed: settings.speed,
        emotion: settings.emotion
      });

      // Decode audio data
      const audioBuffer = await audioContext.decodeAudioData(audioData);

      // Create source and connect to destination
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;

      // Apply volume via Gain Node
      const gainNode = audioContext.createGain();
      gainNode.gain.value = settings.volume || 1.0;
      
      source.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Store source for stopping
      audioRef.current = { source, audioContext };

      // Set up event handlers
      source.onended = () => {
        setIsSpeaking(false);
        audioRef.current = null;
        console.log('[GlyphBot TTS] Playback complete');
      };

      // Update state before playing
      setIsLoading(false);
      setIsSpeaking(true);
      setMetadata({
        provider: 'openai',
        voiceId,
        pitch: settings.pitch,
        speed: settings.speed,
        emotion: settings.emotion,
        timestamp: Date.now()
      });

      // Start playback
      source.start(0);
      console.log('[GlyphBot TTS] OpenAI playback started');
      
      return true;

    } catch (error) {
      console.error('[GlyphBot TTS] OpenAI synthesis error:', error);
      setIsSpeaking(false);
      setIsLoading(false);
      throw error;
    }
  }, []);

  /**
   * Phase 7C: Web Speech API fallback
   */
  const playWithWebSpeech = useCallback(async (text, settings) => {
    try {
      if (!('speechSynthesis' in window)) {
        throw new Error('Web Speech not available');
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;
      
      const voice = getBestVoice();
      if (voice) {
        utterance.voice = voice;
      }

      // Apply settings - make changes NOTICEABLE
      utterance.rate = Math.max(0.5, Math.min(2.0, settings.speed));
      utterance.pitch = Math.max(0.5, Math.min(2.0, settings.pitch));
      utterance.volume = settings.volume;
      
      console.log('[GlyphBot TTS] Web Speech - Rate:', utterance.rate, 'Pitch:', utterance.pitch);

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
        console.error('[GlyphBot TTS] Web Speech error:', e);
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
      console.error('[GlyphBot TTS] Web Speech failed:', error);
      setLastError(error.message);
      setIsLoading(false);
      return false;
    }
  }, [getBestVoice]);

  /**
   * Phase 7C: Play text using OpenAI TTS (primary) or Web Speech (fallback)
   */
  const playText = useCallback(async (text, customSettings = {}) => {
    if (!text || typeof text !== 'string') {
      console.warn('[GlyphBot TTS] Invalid text provided');
      return false;
    }
    
    // Clean text for speech
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

    // Merge settings (custom overrides defaults + emotion presets)
    let settings = { ...defaultSettings.current, ...customSettings };
    if (settings.emotion && EMOTION_PRESETS[settings.emotion]) {
      const emotionPreset = EMOTION_PRESETS[settings.emotion];
      settings = {
        ...settings,
        pitch: customSettings.pitch !== undefined ? customSettings.pitch : emotionPreset.pitch,
        speed: customSettings.speed !== undefined ? customSettings.speed : emotionPreset.speed,
        volume: customSettings.volume !== undefined ? customSettings.volume : emotionPreset.volume
      };
    }

    // Get voice ID from profile
    const voiceProfile = VOICE_PROFILES[settings.voiceProfile] || VOICE_PROFILES.neutral_female;
    const voiceId = voiceProfile.id;

    // Try OpenAI TTS first
    if (provider === 'auto' || provider === 'openai') {
      try {
        const success = await playWithOpenAI(cleanText, settings, voiceId);
        if (success) return true;
        
        // If OpenAI fails and provider is 'auto', fall back to Web Speech
        if (provider === 'auto') {
          console.warn('[GlyphBot TTS] OpenAI failed, falling back to Web Speech');
          return await playWithWebSpeech(cleanText, settings);
        }
        return false;
      } catch (err) {
        console.error('[GlyphBot TTS] OpenAI TTS error:', err);
        if (provider === 'auto') {
          return await playWithWebSpeech(cleanText, settings);
        }
        setLastError(err.message);
        setIsLoading(false);
        return false;
      }
    }

    // Use Web Speech directly
    return await playWithWebSpeech(cleanText, settings);
  }, [provider, stop, playWithOpenAI, playWithWebSpeech]);

  /**
   * Test TTS functionality
   */
  const testTTS = useCallback(async () => {
    return playText('Hello! This is GlyphBot, your elite security assistant.');
  }, [playText]);

  /**
   * Get available voice profiles
   */
  const getVoiceProfiles = useCallback(() => {
    return Object.keys(VOICE_PROFILES).map(key => ({
      id: key,
      ...VOICE_PROFILES[key]
    }));
  }, []);

  /**
   * Get emotion presets
   */
  const getEmotionPresets = useCallback(() => {
    return Object.keys(EMOTION_PRESETS).map(key => ({
      id: key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      ...EMOTION_PRESETS[key]
    }));
  }, []);

  /**
   * Get available Web Speech voices (for fallback UI)
   */
  const getWebSpeechVoices = useCallback(() => {
    return voices.filter(v => v.lang.startsWith('en')).map(v => ({
      name: v.name,
      lang: v.lang,
      local: v.localService
    }));
  }, [voices]);

  return {
    playText,
    speak: playText, // Alias for backward compatibility
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
    currentSettings: defaultSettings.current
  };
}