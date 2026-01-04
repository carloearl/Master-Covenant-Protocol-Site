import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import OpenAI from 'npm:openai';

/**
 * GLYPHBOT JR. — BASE44 AGENT HANDLER
 * Voice: Aurora (en-US-Neural2-F via OpenAI Nova) — Neural Only
 */

Deno.serve(async (req) => {
    try {
        if (req.method !== 'POST') {
            return new Response('Method Not Allowed', { status: 405 });
        }

        const base44 = createClientFromRequest(req);
        const { action, text, messages, systemPrompt } = await req.json();

        const openai = new OpenAI({
            apiKey: Deno.env.get("OPENAI_API_KEY"),
        });

        // 🎯 LISTEN ACTION — Generate TTS audio and return
        if (action === 'listen') {
            if (!text || text.length > 1000) {
                return Response.json({ error: 'Invalid text' }, { status: 400 });
            }

            // Generate Neural Audio (Aurora = Nova)
            const mp3 = await openai.audio.speech.create({
                model: "tts-1-hd",
                voice: "nova",
                input: text,
                speed: 0.92
            });

            const buffer = await mp3.arrayBuffer();
            const base64Audio = btoa(String.fromCharCode(...new Uint8Array(buffer)));

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

        // 💬 CHAT ACTION — Generate response
        const conversation = [
            { role: 'system', content: systemPrompt || 'You are GlyphBot Jr., a helpful AI assistant.' },
            ...(messages || []).map(m => ({
                role: m.role,
                content: m.text || m.content
            }))
        ];

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: conversation,
            max_tokens: 500
        });

        const replyText = completion.choices[0].message.content;

        return Response.json({
            text: replyText,
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