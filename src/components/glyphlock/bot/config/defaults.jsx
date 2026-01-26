
export const DEFAULT_PERSONA = 'GENERAL';
export const DEFAULT_PROVIDER = 'AUTO';

export const DEFAULT_VOICE_SETTINGS = {
  voiceProfile: 'aurora', // 🎙️ PREMIUM: Warm, expressive (Google Cloud Neural2 Pic2)
  speed: 1.0,
  pitch: 1.0,
  volume: 1.0,
  bass: 0.2, // Slight warmth
  clarity: 0.15, // Natural speech clarity
  emotion: 'friendly', // Human-like emotion
  provider: 'google_cloud' // Premium only
};

export const DEFAULT_MODES = {
  voice: false,
  live: false,
  audit: false,
  test: false,
  json: false,
  struct: false,
  panel: false
};

export const DEFAULT_AUDIT_MODE = 'SURFACE';

export default {
  DEFAULT_PERSONA,
  DEFAULT_PROVIDER,
  DEFAULT_VOICE_SETTINGS,
  DEFAULT_MODES,
  DEFAULT_AUDIT_MODE
};
