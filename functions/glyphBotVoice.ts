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

// Voice profile mapping to Google Cloud Neural2 voices
const VOICE_PROFILES = {
  // Female voices
  'neutral_female': { name: 'en-US-Neural2-C', gender: 'FEMALE', pitch: 0, rate: 1.0 },
  'warm_female': { name: 'en-US-Neural2-F', gender: 'FEMALE', pitch: -1, rate: 0.95 },
  'professional_female': { name: 'en-US-Neural2-E', gender: 'FEMALE', pitch: 0, rate: 1.0 },
  'energetic_female': { name: 'en-US-Neural2-G', gender: 'FEMALE', pitch: 2, rate: 1.1 },
  
  // Male voices
  'neutral_male': { name: 'en-US-Neural2-D', gender: 'MALE', pitch: 0, rate: 1.0 },
  'warm_male': { name: 'en-US-Neural2-A', gender: 'MALE', pitch: -2, rate: 0.95 },
  'professional_male': { name: 'en-US-Neural2-J', gender: 'MALE', pitch: 0, rate: 1.0 },
  'deep_male': { name: 'en-US-Neural2-I', gender: 'MALE', pitch: -4, rate: 0.9 },
  
  // Character voices
  'aurora': { name: 'en-US-Neural2-C', gender: 'FEMALE', pitch: 1, rate: 1.0, ssmlEffects: true },
  'nova': { name: 'en-US-Neural2-F', gender: 'FEMALE', pitch: 0, rate: 1.05 },
  'echo': { name: 'en-US-Neural2-D', gender: 'MALE', pitch: -3, rate: 0.95 },
  'onyx': { name: 'en-US-Neural2-I', gender: 'MALE', pitch: -5, rate: 0.9 },
  'alloy': { name: 'en-US-Neural2-A', gender: 'MALE', pitch: 0, rate: 1.0 },
  'shimmer': { name: 'en-US-Neural2-G', gender: 'FEMALE', pitch: 3, rate: 1.1 },
  'fable': { name: 'en-US-Neural2-E', gender: 'FEMALE', pitch: 2, rate: 1.0 }
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

// OpenAI TTS synthesis (premium HD voices)
async function synthesizeWithOpenAI(text, voiceProfile, speed) {
  const apiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }
  
  // Map voice profiles to OpenAI voices
  const openAIVoiceMap = {
    'aurora': 'nova',
    'neutral_female': 'nova',
    'warm_female': 'shimmer',
    'professional_female': 'alloy',
    'energetic_female': 'shimmer',
    'neutral_male': 'onyx',
    'warm_male': 'echo',
    'professional_male': 'fable',
    'deep_male': 'onyx',
    'nova': 'nova',
    'echo': 'echo',
    'onyx': 'onyx',
    'alloy': 'alloy',
    'shimmer': 'shimmer',
    'fable': 'fable'
  };
  
  const openAIVoice = openAIVoiceMap[voiceProfile] || 'nova';
  
  console.log('[OpenAI TTS] Using voice:', openAIVoice, 'for profile:', voiceProfile);
  
  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'tts-1-hd',
      input: text,
      voice: openAIVoice,
      speed: Math.max(0.25, Math.min(4.0, speed || 1.0))
    })
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI TTS failed: ${error}`);
  }
  
  return await response.arrayBuffer();
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
      voiceProfile = 'aurora', 
      emotion = 'neutral',
      speed = 1.0,
      provider = 'auto' // 'google_cloud', 'google_translate', 'auto'
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
    
    // Try Google Cloud TTS first (higher quality)
    if (provider === 'google_cloud' || provider === 'auto') {
      try {
        console.log(`[GlyphBot Voice][${requestId}] Trying Google Cloud TTS...`);
        audioBuffer = await synthesizeWithGoogleCloud(cleanText, voiceProfile, emotion, speed);
        usedProvider = 'google_cloud_neural2';
        console.log(`[GlyphBot Voice][${requestId}] Google Cloud TTS succeeded`);
      } catch (gcError) {
        console.warn(`[GlyphBot Voice][${requestId}] Google Cloud TTS failed:`, gcError.message);
        
        if (provider === 'google_cloud') {
          return Response.json({ error: gcError.message }, { status: 503 });
        }
      }
    }
    
    // Fallback to Google Translate TTS
    if (!audioBuffer) {
      try {
        console.log(`[GlyphBot Voice][${requestId}] Falling back to Google Translate TTS...`);
        audioBuffer = await synthesizeWithGoogleTranslate(cleanText);
        usedProvider = 'google_translate';
        console.log(`[GlyphBot Voice][${requestId}] Google Translate TTS succeeded`);
      } catch (gtError) {
        console.error(`[GlyphBot Voice][${requestId}] All TTS providers failed`);
        return Response.json({ 
          error: 'All TTS providers unavailable',
          details: gtError.message 
        }, { status: 503 });
      }
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