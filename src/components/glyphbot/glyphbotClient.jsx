/**
 * GlyphBot Client SDK
 * Use this module to interact with GlyphBot from anywhere in the app or external clients
 * 
 * USAGE FROM ANOTHER PAGE:
 * import glyphbotClient from '@/components/glyphbot/glyphbotClient';
 * const response = await glyphbotClient.sendMessage([{ role: 'user', content: 'Hello' }]);
 * 
 * USAGE FROM EXTERNAL APP (HTTP):
 * POST /api/functions/glyphbotLLM
 * Headers: { Authorization: 'Bearer <token>' }
 * Body: { messages: [{ role: 'user', content: 'Hello' }], persona: 'GENERAL' }
 */

import { base44 } from '@/api/base44Client';

// GLYPHLOCK FORMAT OVERRIDE - Enforces security-expert tone on ALL responses
const GLYPH_FORMAT_DIRECTIVE = `
FORMAT RULES (MANDATORY):
1. NO hashtags (#), Markdown headers, or blog-style section titles.
2. NO bullet lists unless explicitly requested.
3. NO Wikipedia-style explanations or generic AI phrasing.
4. NO phrases like "here's how", "key concepts", "benefits", "for example".

TONE: Senior security auditor. Code forensic analyst. AI systems architect.
- Direct, concise, authoritative
- Professional but not clinical
- Zero fluff, zero filler

STRUCTURE:
- Direct explanation in plain English
- One technically accurate example if needed
- Actionable steps or implications
- Max 2 short paragraphs unless depth requested
- No Markdown headers. No bold tagging except for code emphasis.
`;

class GlyphBotClient {
  constructor() {
    this.defaultPersona = 'GENERAL';
    this.defaultOptions = {
      auditMode: false,
      oneTestMode: false,
      realTime: false,
      tts: false,
      enforceGlyphFormat: true // Always enforce GlyphLock format
    };
  }

  /**
   * Send a message to GlyphBot
   * @param {Array} messages - Array of { role: 'user'|'assistant'|'system', content: string }
   * @param {Object} options - { persona, auditMode, oneTestMode, realTime, tts }
   * @returns {Promise<Object>} - { text, model, promptVersion, realTimeUsed, shouldSpeak }
   */
  async sendMessage(messages, options = {}) {
    const finalOptions = { ...this.defaultOptions, ...options };
    
    // If realTime is enabled, fetch web search results first
    let realTimeContext = '';
    if (finalOptions.realTime) {
      const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
      if (lastUserMsg) {
        try {
          const searchResult = await this.webSearch(lastUserMsg.content || lastUserMsg.text);
          if (searchResult.success && searchResult.summary) {
            realTimeContext = `\n\n[REAL-TIME WEB CONTEXT]\n${searchResult.summary}\n[END CONTEXT]\n`;
          }
        } catch (e) {
          console.warn('Real-time search failed:', e);
        }
      }
    }
    
    // Inject real-time context into messages if available
    const enhancedMessages = messages.map((m, i) => {
      if (realTimeContext && m.role === 'user' && i === messages.length - 1) {
        return {
          role: m.role,
          content: `${m.content || m.text}${realTimeContext}`
        };
      }
      return {
        role: m.role,
        content: m.content || m.text
      };
    });

    const payload = {
      messages: enhancedMessages,
      persona: options.persona || this.defaultPersona,
      auditMode: finalOptions.auditMode,
      oneTestMode: finalOptions.oneTestMode,
      enforceGlyphFormat: true, // Always inject format override
      formatDirective: GLYPH_FORMAT_DIRECTIVE
    };

    const response = await base44.functions.invoke('glyphbotLLM', payload);
    
    return {
      text: response.data?.text || response.data,
      model: response.data?.model || 'unknown',
      promptVersion: response.data?.promptVersion || 'unknown',
      realTimeUsed: !!realTimeContext,
      shouldSpeak: finalOptions.tts,
      providerUsed: response.data?.providerUsed || 'base44-broker'
    };
  }

  /**
   * Web search for real-time information
   * @param {string} query - Search query
   * @param {number} maxResults - Max results to return
   * @returns {Promise<Object>}
   */
  async webSearch(query, maxResults = 5) {
    try {
      const response = await base44.functions.invoke('glyphbotWebSearch', {
        query,
        maxResults
      });
      return response.data;
    } catch (error) {
      console.error('Web search failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Quick ask with real-time web search enabled
   * @param {string} prompt - User's question
   * @param {string} persona - Optional persona ID
   * @returns {Promise<Object>}
   */
  async askWithRealTime(prompt, persona = 'GENERAL') {
    return this.sendMessage(
      [{ role: 'user', content: prompt }],
      { persona, realTime: true }
    );
  }

  /**
   * Quick ask with TTS response enabled
   * @param {string} prompt - User's question
   * @param {string} persona - Optional persona ID
   * @returns {Promise<Object>}
   */
  async askWithTTS(prompt, persona = 'GENERAL') {
    return this.sendMessage(
      [{ role: 'user', content: prompt }],
      { persona, tts: true }
    );
  }

  /**
   * Run a system integrity check
   * @returns {Promise<Object>}
   */
  async runIntegrityCheck() {
    return this.sendMessage(
      [{ role: 'user', content: 'Run system integrity check' }],
      { oneTestMode: true }
    );
  }

  /**
   * Get available personas
   * @returns {Promise<Array>}
   */
  async getPersonas() {
    const { PERSONAS } = await import('./personas');
    return PERSONAS;
  }

  /**
   * Ping the GlyphBot service
   * @returns {Promise<boolean>}
   */
  async ping() {
    try {
      const response = await base44.functions.invoke('glyphbotLLM', {
        messages: [{ role: 'user', content: 'ping' }]
      });
      return response.data?.status === 'ok';
    } catch {
      return false;
    }
  }
}

// Export singleton instance
const glyphbotClient = new GlyphBotClient();
export default glyphbotClient;

// Also export class for custom instances
export { GlyphBotClient };