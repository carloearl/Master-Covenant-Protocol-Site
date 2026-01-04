import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * GLYPHBOT JR. — BASE44 AGENT HANDLER
 * Voice: Aurora — Neural TTS via Base44 integrations
 */

Deno.serve(async (req) => {
    try {
        if (req.method !== 'POST') {
            return new Response('Method Not Allowed', { status: 405 });
        }

        const base44 = createClientFromRequest(req);
        const { action, text, messages, systemPrompt } = await req.json();

        // 🎯 LISTEN ACTION — Use Google TTS API
        if (action === 'listen') {
            if (!text || text.length > 1000) {
                return Response.json({ error: 'Invalid text' }, { status: 400 });
            }

            // Use Google Cloud TTS via fetch (free tier available)
            const apiKey = Deno.env.get("GEMINI_API_KEY"); // Gemini key works for Google TTS
            
            const ttsResponse = await fetch(
                `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        input: { text: text },
                        voice: {
                            languageCode: 'en-US',
                            name: 'en-US-Neural2-F', // Aurora = Female Neural
                            ssmlGender: 'FEMALE'
                        },
                        audioConfig: {
                            audioEncoding: 'MP3',
                            speakingRate: 0.92,
                            pitch: 1.05
                        }
                    })
                }
            );

            if (!ttsResponse.ok) {
                const errorText = await ttsResponse.text();
                console.error('[TTS Error]:', errorText);
                throw new Error('TTS generation failed');
            }

            const ttsData = await ttsResponse.json();
            
            return Response.json({
                text: text,
                speak: {
                    enabled: true,
                    persona: 'Aurora',
                    audioBase64: ttsData.audioContent,
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
            error: true,
            debug: error.message
        }, { status: 200 });
    }
});