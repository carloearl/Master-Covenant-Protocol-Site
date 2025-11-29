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

// GLYPHLOCK FORMAT OVERRIDE v2 - Absolute priority directive
const GLYPH_FORMAT_DIRECTIVE = `[SYSTEM PRIORITY OVERRIDE — READ FIRST]

You MUST follow these rules with zero exceptions:

DO NOT use hashtags, Markdown headers, or section titles.
DO NOT use bullet points or numbered lists.
DO NOT use phrases like "here's how", "key concepts", "benefits", "for example", "let me explain".
DO NOT write Wikipedia-style or tutorial-style explanations.

Write as a senior security auditor. Two paragraphs maximum. Direct, authoritative, zero fluff. Code blocks only when showing actual code.

[END PRIORITY OVERRIDE]
`;

class GlyphBotClient {
  constructor() {
    this.defaultPersona = 'GENERAL';
    this.defaultOptions = {
      auditMode: false,
      oneTestMode: false,
      realTime: false,
      tts: false,
      enforceGlyphFormat: true, // Always enforce GlyphLock format
      provider: null, // null = AUTO mode
      autoProvider: true // Let GlyphBot choose
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

    // Prepend format directive as system message BEFORE all other messages
    const systemMessage = {
      role: 'system',
      content: GLYPH_FORMAT_DIRECTIVE
    };
    
    // Determine provider settings
    const providerValue = options.provider || finalOptions.provider;
    const isAutoMode = !providerValue || providerValue === 'AUTO';

    const payload = {
      messages: [systemMessage, ...enhancedMessages],
      persona: options.persona || this.defaultPersona,
      auditMode: finalOptions.auditMode,
      oneTestMode: finalOptions.oneTestMode,
      realTime: finalOptions.realTime,
      enforceGlyphFormat: true,
      formatOverride: true,
      systemFirst: true,
      provider: isAutoMode ? null : providerValue,
      autoProvider: isAutoMode
    };

    const response = await base44.functions.invoke('glyphbotLLM', payload);
    
    // Determine if audit engine was active
    const isAuditActive = finalOptions.auditMode || options.persona === 'AUDIT' || options.persona === 'AUDITOR';
    
    return {
      text: response.data?.text || response.data,
      audit: response.data?.audit || null,
      model: response.data?.model || 'unknown',
      promptVersion: response.data?.promptVersion || 'unknown',
      realTimeUsed: !!realTimeContext,
      shouldSpeak: finalOptions.tts,
      providerUsed: response.data?.providerUsed || 'base44-broker',
      providerLabel: response.data?.providerLabel || response.data?.providerUsed || 'Unknown',
      auditEngineActive: isAuditActive && !!response.data?.audit
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
   * System check / ping with status
   * @returns {Promise<Object>}
   */
  async systemCheck() {
    const response = await base44.functions.invoke('glyphbotLLM', {
      messages: [{ role: 'user', content: 'ping' }]
    });
    return response.data;
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