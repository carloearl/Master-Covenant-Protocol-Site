import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * GLYPHBOT JR. — BASE44 AGENT HANDLER
 * Voice: Aurora — Neural TTS (Proxied for CORS)
 */

Deno.serve(async (req) => {
    try {
        if (req.method !== 'POST') {
            return new Response('Method Not Allowed', { status: 405 });
        }

        const base44 = createClientFromRequest(req);
        const { action, text, messages, systemPrompt } = await req.json();

        // 🎯 LISTEN ACTION — Fetch TTS and return as base64
        if (action === 'listen') {
            if (!text || text.length > 500) {
                return Response.json({ error: 'Invalid text' }, { status: 400 });
            }

            const encodedText = encodeURIComponent(text.substring(0, 200));
            const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodedText}`;

            // Fetch the audio and convert to base64 (CORS proxy)
            const audioResponse = await fetch(ttsUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });

            if (!audioResponse.ok) {
                throw new Error('TTS fetch failed');
            }

            const audioBuffer = await audioResponse.arrayBuffer();
            const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));

            return Response.json({
                text: text,
                speak: {
                    enabled: true,
                    persona: 'Aurora',
                    audioBase64: base64Audio,
                    mimeType: 'audio/mpeg'
                }
            });
        }

        // 💬 CHAT ACTION — Use Base44 InvokeLLM
        const conversationContext = systemPrompt || 'You are GlyphBot Jr., a helpful AI assistant for GlyphLock.';
        
        const fullPrompt = `${conversationContext}

Conversation:
${(messages || []).map(m => `${m.role}: ${m.text || m.content}`).join('\n')}

Respond helpfully and concisely.`;

        const response = await base44.integrations.Core.InvokeLLM({
            prompt: fullPrompt,
            add_context_from_internet: false
        });

        return Response.json({
            text: response,
            speak: {
                enabled: false,
                persona: 'Aurora'
            }
        });

    } catch (error) {
        console.error('[GlyphBot Jr. Error]:', error.message);
        return Response.json({
            text: "Sorry, I'm having trouble right now. Please try again!",
            speak: { enabled: false },
            error: true
        }, { status: 200 });
    }
});