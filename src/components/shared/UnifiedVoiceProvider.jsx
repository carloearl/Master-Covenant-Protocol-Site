import React, { createContext, useContext, useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

const VoiceContext = createContext(null);

/**
 * 🎙️ UNIFIED VOICE PROVIDER
 * - ALL bots use the same voice across the app
 * - Persists to database so settings follow the user
 * - Defaults to "echo" (warm, conversational, NOT robotic)
 * - Single source of truth for TTS settings
 */
export function UnifiedVoiceProvider({ children }) {
  const [user, setUser] = useState(null);
  const [voiceSettings, setVoiceSettings] = useState({
    voiceProfile: 'aurora', // 🎙️ DEFAULT: Warm, expressive PREMIUM female voice (Neural2-A)
    emotion: 'friendly', // Natural, human-like emotion
    speed: 1.0,
    pitch: 1.0,
    volume: 1.0,
    bass: 0.2, // Slight warmth
    clarity: 0.15 // Slight clarity for natural speech
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load user and their saved voice settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);

        // Try to load user's saved voice preferences
        const prefs = await base44.entities.UserPreferences.filter({
          created_by: userData.email
        });

        if (prefs.length > 0 && prefs[0].voiceSettings) {
          setVoiceSettings({
            voiceProfile: prefs[0].voiceSettings.voiceProfile || 'aurora',
            emotion: prefs[0].voiceSettings.emotion || 'friendly',
            speed: prefs[0].voiceSettings.speed || 1.0,
            pitch: prefs[0].voiceSettings.pitch || 1.0,
            volume: prefs[0].voiceSettings.volume || 1.0,
            bass: prefs[0].voiceSettings.bass || 0.2,
            clarity: prefs[0].voiceSettings.clarity || 0.15
          });
        }
      } catch (err) {
        console.error('[UnifiedVoice] Failed to load settings:', err);
        // Use defaults on error
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Save voice settings to database
  const saveVoiceSettings = async (newSettings) => {
    if (!user) {
      console.error('[UnifiedVoice] No user logged in');
      return;
    }

    try {
      const merged = { ...voiceSettings, ...newSettings };
      setVoiceSettings(merged);

      // Update/create preferences in database
      const prefs = await base44.entities.UserPreferences.filter({
        created_by: user.email
      });

      const voiceData = {
        voiceProfile: merged.voiceProfile,
        emotion: merged.emotion,
        speed: merged.speed,
        pitch: merged.pitch,
        volume: merged.volume,
        bass: merged.bass,
        clarity: merged.clarity
      };

      if (prefs.length > 0) {
        await base44.entities.UserPreferences.update(prefs[0].id, {
          voiceSettings: voiceData
        });
      } else {
        await base44.entities.UserPreferences.create({
          voiceSettings: voiceData
        });
      }

      console.log('[UnifiedVoice] ✅ Settings saved:', merged.voiceProfile);
    } catch (err) {
      console.error('[UnifiedVoice] Failed to save settings:', err);
    }
  };

  return (
    <VoiceContext.Provider value={{ voiceSettings, saveVoiceSettings, isLoading, user }}>
      {children}
    </VoiceContext.Provider>
  );
}

// Hook: Use unified voice settings in ANY component
export function useUnifiedVoice() {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('[UnifiedVoice] Must use useUnifiedVoice inside UnifiedVoiceProvider');
  }
  return context;
}