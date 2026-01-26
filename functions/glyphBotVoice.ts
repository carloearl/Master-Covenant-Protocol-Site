/**
 * GLYPHBOT NEURAL VOICE ENGINE - Gemini + Google Cloud TTS
 * Premium multi-provider voice synthesis
 * 
 * FEATURES:
 * - Primary: Google Cloud TTS (Neural2 voices)
 * - Fallback: Google Translate TTS
 * - Rate limiting & caching
 * - Voice profile mapping
 * - SSML support for expressiveness
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

// Voice profile mapping to Google Cloud PREMIUM Neural voices (Pic2 optional tones)
// ✅ NO BASIC/ROBOTIC VOICES - All premium neural synthesis
const VOICE_PROFILES = {
  // 🎙️ PREMIUM FEMALE VOICES (Neural2-A through Neural2-G)
  'aurora': { name: 'en-US-Neural2-A', gender: 'FEMALE', pitch: 0, rate: 1.0, ssmlEffects: true }, // Warm, expressive, premium
  'nova': { name: 'en-US-Neural2-C', gender: 'FEMALE', pitch: 0, rate: 1.05 }, // Professional, clear
  'shimmer': { name: 'en-US-Neural2-E', gender: 'FEMALE', pitch: 2, rate: 1.1 }, // Energetic, dynamic
  'neutral_female': { name: 'en-US-Neural2-C', gender: 'FEMALE', pitch: 0, rate: 1.0 },
  'warm_female': { name: 'en-US-Neural2-A', gender: 'FEMALE', pitch: -1, rate: 0.95 },
  'professional_female': { name: 'en-US-Neural2-E', gender: 'FEMALE', pitch: 0, rate: 1.0 },
  'energetic_female': { name: 'en-US-Neural2-G', gender: 'FEMALE', pitch: 2, rate: 1.1 },
  
  // 🎙️ PREMIUM MALE VOICES (Neural2-B, Neural2-D, Neural2-I, Neural2-J)
  'echo': { name: 'en-US-Neural2-B', gender: 'MALE', pitch: -1, rate: 0.95 }, // Warm conversational (NOT robotic)
  'onyx': { name: 'en-US-Neural2-I', gender: 'MALE', pitch: -3, rate: 0.9 }, // Deep, authoritative
  'alloy': { name: 'en-US-Neural2-B', gender: 'MALE', pitch: 0, rate: 1.0 }, // Balanced, natural
  'fable': { name: 'en-US-Neural2-J', gender: 'MALE', pitch: 1, rate: 1.0 }, // Expressive narrator
  'neutral_male': { name: 'en-US-Neural2-D', gender: 'MALE', pitch: 0, rate: 1.0 },
  'warm_male': { name: 'en-US-Neural2-B', gender: 'MALE', pitch: -2, rate: 0.95 },
  'professional_male': { name: 'en-US-Neural2-J', gender: 'MALE', pitch: 0, rate: 1.0 },
  'deep_male': { name: 'en-US-Neural2-I', gender: 'MALE', pitch: -4, rate: 0.9 }
};

// Emotion SSML effects
const EMOTION_EFFECTS = {
  neutral: { pitch: 0, rate: 1.0, volume: 'medium' },
  friendly: { pitch: 2, rate: 1.05, volume: 'medium' },
  calm: { pitch: -2, rate: 0.9, volume: 'soft' },
  authoritative: { pitch: -3, rate: 0.95, volume: 'loud' },
  excited: { pitch: 4, rate: 1.15, volume: 'loud' },
  whisper: { pitch: 0, rate: 0.85, volume: 'x-soft' },
  intense: { pitch: -2, rate: 1.0, volume: 'x-loud' }
};

// Rate limiting
const rateLimitMap = new Map();
const RATE_LIMIT = 30; // requests per minute
const RATE_WINDOW = 60 * 1000;

function checkRateLimit(userId) {
  const now = Date.now();
  const userRequests = rateLimitMap.get(userId) || [];
  const recentRequests = userRequests.filter(t => now - t < RATE_WINDOW);
  
  if (recentRequests.length >= RATE_LIMIT) {
    return false;
  }
  
  recentRequests.push(now);
  rateLimitMap.set(userId, recentRequests);
  return true;
}

// Build SSML for expressive speech
function buildSSML(text, voiceConfig, emotion = 'neutral') {
  const emotionEffect = EMOTION_EFFECTS[emotion] || EMOTION_EFFECTS.neutral;
  const combinedPitch = (voiceConfig.pitch || 0) + (emotionEffect.pitch || 0);
  const combinedRate = (voiceConfig.rate || 1.0) * (emotionEffect.rate || 1.0);
  
  // Clean text for SSML
  const cleanText = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
  
  return `<speak>
    <prosody pitch="${combinedPitch >= 0 ? '+' : ''}${combinedPitch}st" rate="${(combinedRate * 100).toFixed(0)}%" volume="${emotionEffect.volume}">
      ${cleanText}
    </prosody>
  </speak>`;
}

// Google Cloud TTS synthesis (Neural2 voices - premium quality)
async function synthesizeWithGoogleCloud(text, voiceProfile, emotion, speed) {
  const apiKey = Deno.env.get('GOOGLE_CLOUD_TTS_API_KEY') || Deno.env.get('GEMINI_API_KEY');
  
  if (!apiKey) {
    throw new Error('Google Cloud TTS API key not configured');
  }
  
  const voiceConfig = VOICE_PROFILES[voiceProfile] || VOICE_PROFILES.neutral_female;
  const ssml = buildSSML(text, voiceConfig, emotion);
  
  console.log('[Google Cloud TTS] Using Neural2 voice:', voiceConfig.name);
  
  const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input: { ssml },
      voice: {
        languageCode: 'en-US',
        name: voiceConfig.name,
        ssmlGender: voiceConfig.gender
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: Math.max(0.25, Math.min(4.0, speed || 1.0)),
        pitch: voiceConfig.pitch || 0,
        // ✅ Pic2 optional tones for premium natural speech
        effectsProfileId: ['headphone-class-device', 'small-bluetooth-speaker-class-device']
      }
    })
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Google Cloud TTS failed: ${error}`);
  }
  
  const data = await response.json();
  
  if (!data.audioContent) {
    throw new Error('No audio content returned');
  }
  
  // Convert base64 to binary
  const binaryString = atob(data.audioContent);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  return bytes.buffer;
}

// Fallback: Google Translate TTS (free, lower quality)
async function synthesizeWithGoogleTranslate(text, lang = 'en') {
  // Split text into chunks for Google Translate TTS limit
  const chunks = [];
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
  let currentChunk = '';
  
  for (const sentence of sentences) {
    if ((currentChunk + sentence).length <= 200) {
      currentChunk += sentence;
    } else {
      if (currentChunk) chunks.push(currentChunk.trim());
      currentChunk = sentence.length > 200 ? sentence.substring(0, 200) : sentence;
    }
  }
  if (currentChunk) chunks.push(currentChunk.trim());
  
  // Fetch all chunks
  const audioChunks = await Promise.all(
    chunks.slice(0, 5).map(async (chunk) => {
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encodeURIComponent(chunk)}`;
      
      const response = await fetch(ttsUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': 'https://translate.google.com/'
        }
      });
      
      if (!response.ok) return null;
      return await response.arrayBuffer();
    })
  );
  
  // Combine chunks
  const validChunks = audioChunks.filter(Boolean);
  if (validChunks.length === 0) {
    throw new Error('Google Translate TTS failed');
  }
  
  const totalLength = validChunks.reduce((sum, buf) => sum + buf.byteLength, 0);
  const combined = new Uint8Array(totalLength);
  let offset = 0;
  for (const buf of validChunks) {
    combined.set(new Uint8Array(buf), offset);
    offset += buf.byteLength;
  }
  
  return combined.buffer;
}

Deno.serve(async (req) => {
  const requestId = crypto.randomUUID().slice(0, 8);
  
  try {
    if (req.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }
    
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Rate limiting
    if (!checkRateLimit(user.email)) {
      return Response.json({ 
        error: 'Rate limit exceeded. Please wait before making more requests.',
        retryAfter: 60
      }, { status: 429 });
    }
    
    const body = await req.json();
    const { 
      text, 
      voiceProfile = 'aurora', // ✅ DEFAULT: Premium Aurora (NOT echo/robotic)
      emotion = 'friendly',
      speed = 1.0,
      provider = 'auto' // 'google_cloud' only - no fallback to robotic voices
    } = body;
    
    if (!text || text.length > 5000) {
      return Response.json({ 
        error: 'Text is required and must be under 5000 characters' 
      }, { status: 400 });
    }
    
    // Clean text
    const cleanText = text
      .replace(/[\u{1F600}-\u{1F64F}]/gu, '')
      .replace(/[\u{1F300}-\u{1F5FF}]/gu, '')
      .replace(/[\u{1F680}-\u{1F6FF}]/gu, '')
      .replace(/[\u{2600}-\u{26FF}]/gu, '')
      .replace(/[\u{2700}-\u{27BF}]/gu, '')
      .replace(/https?:\/\/[^\s]+/g, '')
      .replace(/[*_~`#]+/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    if (!cleanText) {
      return Response.json({ error: 'No valid text after cleaning' }, { status: 400 });
    }
    
    let audioBuffer;
    let usedProvider = 'unknown';
    
    // ✅ ONLY Google Cloud Neural2 TTS (premium Pic2 voices - NO robotic fallback)
    try {
      console.log(`[GlyphBot Voice][${requestId}] 🎙️ Synthesizing with Google Cloud Neural2 Premium (Pic2)...`);
      console.log(`[GlyphBot Voice][${requestId}] Voice: ${voiceProfile}, Emotion: ${emotion}`);
      audioBuffer = await synthesizeWithGoogleCloud(cleanText, voiceProfile, emotion, speed);
      usedProvider = 'google_cloud_neural2_pic2';
      console.log(`[GlyphBot Voice][${requestId}] ✅ Premium neural voice succeeded`);
    } catch (gcError) {
      console.error(`[GlyphBot Voice][${requestId}] ❌ Premium voice failed:`, gcError.message);
      // NO FALLBACK - enforce premium only
      return Response.json({ 
        error: 'Premium voice service unavailable',
        details: gcError.message,
        retryAfter: 30
      }, { status: 503 });
    }
    
    // Return audio with metadata headers
    return new Response(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
        'X-TTS-Provider': usedProvider,
        'X-TTS-Voice': voiceProfile,
        'X-Request-ID': requestId,
        'Cache-Control': 'private, max-age=3600'
      }
    });
    
  } catch (error) {
    console.error(`[GlyphBot Voice][${requestId}] Error:`, error);
    return Response.json({ 
      error: 'Voice synthesis failed',
      details: error.message,
      requestId
    }, { status: 500 });
  }
});