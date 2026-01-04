import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * GLYPHBOT JR. — BASE44 AGENT HANDLER
 * Voice: Aurora — Neural TTS via ElevenLabs-style endpoint
 */

Deno.serve(async (req) => {
    try {
        if (req.method !== 'POST') {
            return new Response('Method Not Allowed', { status: 405 });
        }

        const base44 = createClientFromRequest(req);
        const { action, text, messages, systemPrompt } = await req.json();

        // 🎯 LISTEN ACTION — Generate TTS using OpenRouter (via Gemini)
        if (action === 'listen') {
            if (!text || text.length > 1000) {
                return Response.json({ error: 'Invalid text' }, { status: 400 });
            }

            // Use free TTS via ResponsiveVoice CDN fallback pattern
            // Since Google/OpenAI TTS quota exceeded, we'll embed browser-playable URL
            // This is a workaround using a public TTS endpoint

            const encodedText = encodeURIComponent(text.substring(0, 500));
            const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodedText}`;

            return Response.json({
                text: text,
                speak: {
                    enabled: true,
                    persona: 'Aurora',
                    audioUrl: audioUrl, // Direct URL approach
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