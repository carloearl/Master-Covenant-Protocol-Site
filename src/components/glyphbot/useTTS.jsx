/**
 * GlyphBot TTS Hook - Natural Voice Edition
 * Uses high-quality browser voices (Google, Microsoft, Apple)
 * 
 * Usage:
 * const { speak, stop, isSpeaking, ttsAvailable } = useTTS();
 * await speak("Hello world");
 */

import { useState, useRef, useCallback, useEffect } from 'react';

export default function useTTS(options = {}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ttsAvailable, setTtsAvailable] = useState(false);
  const [lastError, setLastError] = useState(null);
  const [voices, setVoices] = useState([]);
  
  const utteranceRef = useRef(null);
  const audioContextRef = useRef(null);
  const eqNodesRef = useRef(null);
  const sourceNodeRef = useRef(null);

  // Default settings
  const defaultSettings = {
    speed: options.speed || 0.95,  // Slightly slower = more natural
    pitch: options.pitch || 1.0,
    volume: options.volume || 1.0,
    preferredVoice: options.voice || null,
    bass: options.bass || 0,
    mid: options.mid || 0,
    treble: options.treble || 0
  };

  // Setup or update EQ nodes from external audio context
  useEffect(() => {
    if (options.audioContext && options.eqNodes) {
      audioContextRef.current = options.audioContext;
      eqNodesRef.current = options.eqNodes;
    }
  }, [options.audioContext, options.eqNodes]);

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
    if (defaultSettings.preferredVoice) {
      const userVoice = voices.find(v => v.name === defaultSettings.preferredVoice);
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
  }, [voices, defaultSettings.preferredVoice]);

  /**
   * Stop any currently playing speech
   */
  const stop = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.disconnect();
      } catch (e) {}
      sourceNodeRef.current = null;
    }
    setIsSpeaking(false);
    setIsLoading(false);
  }, []);

  /**
   * Speak text using natural browser voices
   */
  const speak = useCallback(async (text, customSettings = {}) => {
    if (!text || typeof text !== 'string') return false;
    if (!ttsAvailable) {
      setLastError('TTS not available');
      return false;
    }
    
    // Clean text for speech
    const cleanText = text
      .replace(/[#*`🦕💠🦖🌟✨🔒⚡️💡🛡️•]/g, '')
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert markdown links to just text
      .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
      .replace(/_([^_]+)_/g, '$1') // Remove italic
      .replace(/\n+/g, '. ')
      .replace(/\s+/g, ' ')
      .replace(/\.+/g, '.')
      .trim();
    
    if (!cleanText || cleanText.length < 2) return false;

    stop(); // Stop any current playback
    setIsLoading(true);
    setLastError(null);

    const settings = { ...defaultSettings, ...customSettings };

    try {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utteranceRef.current = utterance;
      
      // Get best natural voice
      const voice = getBestVoice();
      if (voice) {
        utterance.voice = voice;
      }

      // Natural speech settings
      utterance.rate = settings.speed;
      utterance.pitch = settings.pitch;
      utterance.volume = settings.volume;

      utterance.onstart = () => {
        setIsLoading(false);
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        utteranceRef.current = null;
      };

      utterance.onerror = (e) => {
        console.error('[TTS] Error:', e);
        setIsSpeaking(false);
        setIsLoading(false);
        setLastError(e.error || 'Speech error');
        utteranceRef.current = null;
      };

      // Chrome bug workaround: cancel before speaking
      window.speechSynthesis.cancel();
      
      // Small delay to ensure cancel completes
      await new Promise(r => setTimeout(r, 50));
      
      window.speechSynthesis.speak(utterance);
      return true;

    } catch (error) {
      console.error('[TTS] Failed:', error);
      setLastError(error.message);
      setIsLoading(false);
      return false;
    }
  }, [stop, defaultSettings, ttsAvailable, getBestVoice]);

  /**
   * Test TTS functionality
   */
  const testTTS = useCallback(async () => {
    return speak('Hello! This is GlyphBot, your elite security assistant. How can I help you today?');
  }, [speak]);

  /**
   * Get available voices for UI selection
   */
  const getVoices = useCallback(() => {
    return voices.filter(v => v.lang.startsWith('en')).map(v => ({
      name: v.name,
      lang: v.lang,
      local: v.localService
    }));
  }, [voices]);

  return {
    speak,
    stop,
    testTTS,
    getVoices,
    isSpeaking,
    isLoading,
    ttsAvailable,
    lastError,
    currentVoice: getBestVoice()?.name || 'Default'
  };
}