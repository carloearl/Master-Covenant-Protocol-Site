
/**
 * 🜂 GlyphBot Holder Module
 * Single import point for entire bot system
 * 
 * Usage:
 * import { Logic, Services, Config, Types } from '@/glyphlock/bot';
 * 
 * const { useGlyphBotPersistence, useTTS, glyphbotClient } = Logic;
 * const { llm, tts, search, upload, audit } = Services;
 * const { PERSONAS, VOICE_PROFILES, MODEL_OPTIONS } = Config;
 */

// Layer exports
export * as Config from './config';
export * as Types from './types';
export * as Services from './services';
export * as Logic from './logic';

// Convenience re-exports for common items
export { 
  PERSONAS, 
  TTS_PROVIDERS, 
  MODEL_OPTIONS, 
  VOICE_PROFILES,
  EMOTION_PRESETS,
  STORAGE_KEYS, 
  LIMITS, 
  WELCOME_MESSAGE,
  DEFAULT_PERSONA,
  DEFAULT_PROVIDER,
  DEFAULT_VOICE_SETTINGS,
  DEFAULT_MODES
} from './config';

export { 
  useGlyphBotPersistence, 
  useGlyphBotAudit, 
  useTTS, 
  glyphbotClient,
  GlyphProviderChain 
} from './logic';
