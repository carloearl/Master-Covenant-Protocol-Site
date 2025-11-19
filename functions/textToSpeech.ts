import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

const voiceProfiles = {
  'en': { lang: 'en' },
  'en-gb': { lang: 'en-gb' },
  'en-au': { lang: 'en-au' }
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const isAuth = await base44.auth.isAuthenticated();
    
    if (!isAuth) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { text, voice = 'en' } = await req.json();
    
    if (!text) {
      return Response.json({ error: 'Text is required' }, { status: 400 });
    }

    const profile = voiceProfiles[voice] || voiceProfiles['en'];
    const lang = profile.lang;
    
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encodeURIComponent(text)}`;
    
    const audioResponse = await fetch(ttsUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    if (!audioResponse.ok) {
      throw new Error('TTS unavailable');
    }

    const audioData = await audioResponse.arrayBuffer();
    
    return new Response(audioData, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg'
      }
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});