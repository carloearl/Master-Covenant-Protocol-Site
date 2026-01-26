/**
 * GLYPHBOT JR CHAT — Backend Handler
 * Processes messages and voice synthesis requests
 * 
 * Features:
 * - Chat message handling with LLM integration
 * - Voice synthesis via glyphBotVoice backend
 * - Rate limiting and authentication
 * - Graceful error handling
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

// Rate limiting
const rateLimitMap = new Map();
const RATE_LIMIT = 60; // requests per minute
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

// Call voice synthesis backend
async function synthesizeVoice(text, voiceSettings) {
  try {
    const response = await fetch(`${Deno.env.get('BASE44_API_URL') || 'https://api.base44.io'}/functions/glyphBotVoice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('GLYPHBOT_SERVICE_TOKEN') || ''}`
      },
      body: JSON.stringify({
        text: text.trim(),
        voiceProfile: voiceSettings.voiceProfile || 'aurora',
        emotion: voiceSettings.emotion || 'friendly',
        speed: voiceSettings.speed || 1.0
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Voice synthesis failed: ${error}`);
    }

    const audioBuffer = await response.arrayBuffer();
    const audioBase64 = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));

    return {
      enabled: true,
      audioBase64: audioBase64,
      mimeType: 'audio/mpeg',
      voiceProfile: voiceSettings.voiceProfile,
      duration: Math.ceil(text.length / 15) // Rough estimate
    };
  } catch (err) {
    console.error('[glyphBotJrChat] Voice synthesis error:', err.message);
    return {
      enabled: false,
      error: err.message,
      audioBase64: null
    };
  }
}

// Main handler
Deno.serve(async (req) => {
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
        error: 'Rate limit exceeded',
        retryAfter: 60
      }, { status: 429 });
    }

    const body = await req.json();
    const { action, text, messages, systemPrompt, voiceSettings } = body;

    // ==================
    // ACTION: LISTEN (TTS)
    // ==================
    if (action === 'listen') {
      if (!text || text.length > 5000) {
        return Response.json({
          error: 'Text is required and must be under 5000 characters'
        }, { status: 400 });
      }

      const speak = await synthesizeVoice(text, voiceSettings || {});

      return Response.json({
        speak,
        voiceProfile: voiceSettings?.voiceProfile || 'aurora'
      });
    }

    // ==================
    // ACTION: CHAT (LLM)
    // ==================
    if (action === 'chat') {
      if (!messages || !systemPrompt) {
        return Response.json({
          error: 'Messages and systemPrompt are required'
        }, { status: 400 });
      }

      try {
        // Call LLM via integrations
        const llmResponse = await base44.integrations.Core.InvokeLLM({
          prompt: systemPrompt,
          add_context_from_internet: false
        });

        const responseText = typeof llmResponse === 'string' ? llmResponse : llmResponse.text || JSON.stringify(llmResponse);

        // Generate voice synthesis for response
        const speak = await synthesizeVoice(
          responseText.substring(0, 500), // Limit to first 500 chars for TTS
          voiceSettings || {}
        );

        return Response.json({
          text: responseText,
          speak,
          timestamp: new Date().toISOString(),
          voiceProfile: voiceSettings?.voiceProfile || 'aurora'
        });
      } catch (llmErr) {
        console.error('[glyphBotJrChat] LLM error:', llmErr);
        return Response.json({
          error: 'Chat processing failed',
          details: llmErr.message
        }, { status: 500 });
      }
    }

    return Response.json({
      error: 'Invalid action'
    }, { status: 400 });

  } catch (error) {
    console.error('[glyphBotJrChat] Error:', error);
    return Response.json({
      error: 'Request processing failed',
      details: error.message
    }, { status: 500 });
  }
});