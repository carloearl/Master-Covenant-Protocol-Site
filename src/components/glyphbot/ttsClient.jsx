/**
 * GlyphBot TTS Client - Phase 7.1
 * Handles OpenAI TTS API communication via backend proxy
 */

import { base44 } from '@/api/base44Client';

/**
 * Synthesize speech using OpenAI TTS via backend function
 * @param {string} text - Text to synthesize
 * @param {Object} settings - TTS settings (voice, speed, emotion)
 * @returns {Promise<ArrayBuffer>} Audio data
 */
export async function synthesizeTTS(text, settings = {}) {
  if (!text || typeof text !== 'string') {
    throw new Error('[TTS Client] Invalid text provided');
  }

  // Extract settings
  const voice = settings.voice || 'nova';
  const speed = Math.max(0.25, Math.min(4.0, settings.speed || 1.0));
  const emotion = settings.emotion || 'neutral';

  console.log('[TTS Client] Synthesizing:', { voice, speed, emotion, textLength: text.length });

  try {
    // Call backend function that proxies OpenAI TTS
    const response = await base44.functions.invoke('textToSpeechAdvanced', {
      text,
      voice,
      speed,
      emotion,
      model: 'tts-1' // Use faster tts-1 model
    });

    if (!response?.data) {
      throw new Error('No audio data received from TTS service');
    }

    // Response.data should be base64 audio or direct ArrayBuffer
    if (typeof response.data === 'string') {
      // If base64 string, convert to ArrayBuffer
      const binaryString = atob(response.data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes.buffer;
    }

    // If already ArrayBuffer or Blob
    if (response.data instanceof ArrayBuffer) {
      return response.data;
    }

    if (response.data instanceof Blob) {
      return await response.data.arrayBuffer();
    }

    throw new Error('Unexpected audio data format from TTS service');

  } catch (error) {
    console.error('[TTS Client] Synthesis failed:', error);
    throw new Error(`TTS synthesis failed: ${error.message}`);
  }
}

/**
 * Test if TTS backend is available
 * @returns {Promise<boolean>}
 */
export async function testTTSAvailability() {
  try {
    await synthesizeTTS('Test', { voice: 'nova', speed: 1.0 });
    return true;
  } catch (error) {
    console.warn('[TTS Client] TTS backend not available:', error.message);
    return false;
  }
}