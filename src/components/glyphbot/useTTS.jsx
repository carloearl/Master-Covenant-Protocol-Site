/**
 * GlyphBot TTS Hook
 * Provides text-to-speech with browser fallback
 * 
 * Usage:
 * const { speak, stop, isSpeaking, ttsAvailable } = useTTS();
 * await speak("Hello world");
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

export default function useTTS(options = {}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ttsAvailable, setTtsAvailable] = useState(true);
  const [lastError, setLastError] = useState(null);
  
  const audioRef = useRef(null);
  const utteranceRef = useRef(null);

  // Default settings - StreamElements voices: Brian, Amy, Emma, Geraint, Ivy, Joanna, Joey, Justin, Kendra, Kimberly, Matthew, Salli
  const defaultSettings = {
    provider: options.provider || 'streamelements',
    voice: options.voice || 'Brian', // Brian is clearer for technical content
    speed: options.speed || 1.0,
    pitch: options.pitch || 1.0,
    volume: options.volume || 1.0,
    useBrowserFallback: options.useBrowserFallback !== false
  };

  // Check browser TTS availability
  useEffect(() => {
    const browserTTSAvailable = 'speechSynthesis' in window;
    // We consider TTS available if either browser or external works
    setTtsAvailable(browserTTSAvailable || true);
  }, []);

  /**
   * Stop any currently playing audio
   */
  const stop = useCallback(() => {
    // Stop external audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    
    // Stop browser speech
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    setIsSpeaking(false);
    setIsLoading(false);
  }, []);

  /**
   * Speak text using external TTS with browser fallback
   */
  const speak = useCallback(async (text, customSettings = {}) => {
    if (!text || typeof text !== 'string') return false;
    
    const cleanText = text
      .replace(/[#*`🦕💠🦖🌟✨🔒⚡️💡🛡️]/g, '')
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/\[.*?\]/g, '') // Remove markdown links
      .replace(/\n+/g, '. ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 500); // StreamElements limit
    
    if (!cleanText || cleanText.length < 2) return false;

    stop(); // Stop any current playback
    setIsLoading(true);
    setLastError(null);

    const settings = { ...defaultSettings, ...customSettings };

    // PRIMARY: StreamElements (FREE, reliable, no API key)
    try {
      console.log('[TTS] Using StreamElements...');
      const voice = settings.voice || 'Brian'; // Brian is clearer than Matthew
      const seUrl = `https://api.streamelements.com/kappa/v2/speech?voice=${voice}&text=${encodeURIComponent(cleanText)}`;
      
      const audio = new Audio();
      audioRef.current = audio;
      
      // Set up event handlers BEFORE setting src
      audio.oncanplaythrough = async () => {
        try {
          setIsLoading(false);
          setIsSpeaking(true);
          await audio.play();
        } catch (playError) {
          console.warn('[TTS] Autoplay blocked:', playError);
          setIsLoading(false);
          setIsSpeaking(false);
        }
      };

      audio.onended = () => {
        setIsSpeaking(false);
        audioRef.current = null;
      };

      audio.onerror = (e) => {
        console.warn('[TTS] StreamElements failed:', e);
        setIsSpeaking(false);
        audioRef.current = null;
        // Fallback to browser TTS
        if (settings.useBrowserFallback) {
          speakWithBrowser(cleanText, settings);
        }
      };

      audio.src = seUrl;
      audio.load();
      return true;
      
    } catch (error) {
      console.warn('[TTS] StreamElements error:', error);
    }

    // FALLBACK: Browser Speech Synthesis
    if (settings.useBrowserFallback && 'speechSynthesis' in window) {
      console.log('[TTS] Falling back to browser TTS...');
      setIsLoading(false);
      return speakWithBrowser(cleanText, settings);
    }

    setIsLoading(false);
    setLastError('TTS unavailable');
    return false;
  }, [stop, defaultSettings]);

  /**
   * Browser-native speech synthesis fallback
   */
  const speakWithBrowser = useCallback((text, settings) => {
    try {
      if (!('speechSynthesis' in window)) {
        setLastError('Browser TTS not supported');
        return false;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;
      
      utterance.rate = settings.speed || 1.0;
      utterance.pitch = settings.pitch || 1.0;
      utterance.volume = settings.volume || 1.0;

      // Try to find a good voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => 
        v.name.includes('Google') || 
        v.name.includes('Microsoft') ||
        v.lang === 'en-US'
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsLoading(false);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        utteranceRef.current = null;
      };

      utterance.onerror = (e) => {
        console.error('Browser TTS error:', e);
        setIsSpeaking(false);
        setLastError('Browser TTS error');
        utteranceRef.current = null;
      };

      window.speechSynthesis.speak(utterance);
      return true;
    } catch (error) {
      console.error('Browser TTS failed:', error);
      setLastError('Browser TTS failed');
      setIsLoading(false);
      return false;
    }
  }, []);

  /**
   * Test TTS functionality
   */
  const testTTS = useCallback(async () => {
    return speak('Hello! This is a test of the GlyphBot voice system.');
  }, [speak]);

  return {
    speak,
    stop,
    testTTS,
    isSpeaking,
    isLoading,
    ttsAvailable,
    lastError
  };
}