import { base44 } from '@/api/base44Client';

export async function synthesizeTTS(text, options = {}) {
  try {
    const response = await base44.functions.invoke('textToSpeechAdvanced', {
      text,
      voice: options.voice || 'nova',
      speed: options.speed || 1.0,
      emotion: options.emotion || 'neutral'
    });

    if (response.data?.audioUrl) {
      const audioResponse = await fetch(response.data.audioUrl);
      return await audioResponse.arrayBuffer();
    }

    return null;
  } catch (error) {
    console.error('[TTS Client] Synthesis error:', error);
    throw error;
  }
}

export default { synthesizeTTS };