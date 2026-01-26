export const VOICE_PROFILES = {
  // 🎙️ UNIFIED VOICE SYSTEM - All bots use same voice
  // DEFAULT: Aurora (premium, NOT robotic)
  
  // Google Cloud Neural2 Premium Voices (Pic2 optional tones)
  aurora: { id: 'aurora', label: '🌟 Aurora (Premium Female - DEFAULT)', voice: 'aurora', description: '👈 Warm, expressive, natural quality' },
  nova: { id: 'nova', label: '💎 Nova (Professional Female)', voice: 'nova', description: 'Clear, balanced, professional' },
  shimmer: { id: 'shimmer', label: '✨ Shimmer (Energetic Female)', voice: 'shimmer', description: 'Dynamic, engaging, warm' },
  onyx: { id: 'onyx', label: '🎭 Onyx (Deep Male)', voice: 'onyx', description: 'Authoritative, confident, commanding' },
  echo: { id: 'echo', label: '🎙️ Echo (Warm Male)', voice: 'echo', description: 'Conversational, natural, warm tone' },
  fable: { id: 'fable', label: '📖 Fable (Expressive Male)', voice: 'fable', description: 'Expressive, narrative, engaging' },
  alloy: { id: 'alloy', label: '🔊 Alloy (Balanced Male)', voice: 'alloy', description: 'Natural, neutral, versatile' },
  
  // Legacy mappings (kept for compatibility)
  neutral_female: { id: 'neutral_female', label: '💎 Nova (Clear Female)', voice: 'nova', description: 'Professional, balanced' },
  neutral_male: { id: 'neutral_male', label: '🎙️ Onyx (Deep Male)', voice: 'onyx', description: 'Authoritative, confident' },
  warm_female: { id: 'warm_female', label: '✨ Shimmer (Friendly Female)', voice: 'shimmer', description: 'Energetic, dynamic' },
  warm_male: { id: 'warm_male', label: '🔊 Echo (Smooth Male)', voice: 'echo', description: 'Conversational, engaging' },
  professional_female: { id: 'professional_female', label: '🌟 Aurora (Premium Female)', voice: 'aurora', description: 'Best quality' },
  professional_male: { id: 'professional_male', label: '📖 Fable (Storyteller)', voice: 'fable', description: 'Expressive narrative' }
};

export default VOICE_PROFILES;