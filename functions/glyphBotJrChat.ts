import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import OpenAI from 'npm:openai';

/**
 * GLYPHBOT JR. - AGENT LOGIC
 * Handles Chat and Speech triggers.
 * Returns structured response with 'speak' instructions.
 */
Deno.serve(async (req) => {
    try {
        if (req.method !== 'POST') {
            return new Response('Method Not Allowed', { status: 405 });
        }

        const base44 = createClientFromRequest(req);
        const { action, text, messages, systemPrompt } = await req.json();

        // 1. LISTEN ACTION (Replay for speech)
        if (action === 'listen') {
            return Response.json({
                text: text, // Echo text or keep empty if UI handles display
                speak: {
                    enabled: true,
                    persona: 'Aurora'
                },
                metadata: {
                    originalText: text,
                    replayForSpeech: true
                }
            });
        }

        // 2. CHAT ACTION (Generate response)
        const openai = new OpenAI({
            apiKey: Deno.env.get("OPENAI_API_KEY"),
        });

        // Prepare messages for OpenAI
        // Ensure system prompt is first
        const conversation = [
            { role: "system", content: systemPrompt || "You are GlyphBot Jr." },
            ...messages.map(m => ({ 
                role: m.role, 
                content: m.text || m.content // Handle both formats
            }))
        ];

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Fast, efficient
            messages: conversation,
            max_tokens: 500
        });

        const replyText = completion.choices[0].message.content;

        return Response.json({
            text: replyText,
            speak: {
                enabled: false, // Default to silent for chat
                persona: 'Aurora'
            },
            metadata: {
                originalText: replyText,
                replayForSpeech: false
            }
        });

    } catch (error) {
        console.error("GlyphBot Agent Error:", error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});