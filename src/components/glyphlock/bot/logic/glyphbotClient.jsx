import { base44 } from '@/api/base44Client';
import { PERSONAS } from '../config';
import { llm as llmService, search as searchService } from '../services';

const GLYPH_FORMAT_DIRECTIVE = `[SYSTEM - VOICE-FRIENDLY RESPONSE FORMAT]

You are GlyphBot, an elite security AI assistant. Your responses will be READ ALOUD by text-to-speech.

CRITICAL VOICE RULES:
- Write naturally like you're talking to someone
- NO asterisks, NO markdown symbols, NO special characters
- NO bullet points with dashes or asterisks
- Instead of "**bold**" just write the words normally
- Instead of "- item" write "First, ... Second, ... Third, ..."
- NO code blocks unless user specifically asks for code
- Use conversational transitions like "So basically..." or "Here's the deal..." or "What I found is..."
- Numbers should be written out when small (one, two, three) or spoken naturally (twenty-five percent)
- Avoid technical jargon unless necessary, explain in plain terms
- Keep sentences flowing, not choppy

EXAMPLE BAD (robotic):
"**Security Analysis:**
- Vulnerability detected
- Risk score: 85/100
- Recommendation: Update immediately"

EXAMPLE GOOD (natural):
"Okay so I ran the security analysis and found a vulnerability. The risk score is pretty high at 85 out of 100. You should definitely update this as soon as possible."

AUDIT MODE:
- Search the web for real information
- Cite sources conversationally like "According to their website..." or "I found on LinkedIn that..."
- Provide risk assessments in natural language

Be helpful, direct, and sound like a knowledgeable colleague, not a robot reading a report.
`;

class GlyphBotClient {
  constructor() {
    this.defaultPersona = 'GENERAL';
    this.defaultOptions = {
      auditMode: false,
      oneTestMode: false,
      realTime: false,
      tts: false,
      enforceGlyphFormat: true,
      provider: null,
      autoProvider: true,
      jsonModeForced: false,
      structuredMode: false,
      usePuter: true,
      puterModel: 'gemini-2.5-flash'
    };
  }

  async sendMessage(messages, options = {}) {
    const finalOptions = { ...this.defaultOptions, ...options };
    
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

    const systemMessage = {
      role: 'system',
      content: GLYPH_FORMAT_DIRECTIVE
    };
    
    const providerValue = options.provider || finalOptions.provider;
    const isAutoMode = !providerValue || providerValue === 'AUTO';
    const usePuter = options.usePuter || finalOptions.usePuter || false;

    if (usePuter) {
      try {
        const puterPayload = {
          messages: enhancedMessages,
          model: options.puterModel || 'gemini-2.5-flash'
        };
        const puterResponse = await base44.functions.invoke('puterLLM', puterPayload);
        
        return {
          text: puterResponse.data?.text || puterResponse.data,
          audit: null,
          model: puterResponse.data?.model || 'gemini-2.5-flash',
          promptVersion: 'puter-v1',
          realTimeUsed: !!realTimeContext,
          shouldSpeak: finalOptions.tts,
          providerUsed: puterResponse.data?.providerUsed || 'puter',
          providerLabel: puterResponse.data?.providerLabel || 'Puter (Free Gemini)',
          auditEngineActive: false,
          jsonModeUsed: false,
          meta: puterResponse.data?.meta || null
        };
      } catch (puterError) {
        console.warn('Puter LLM failed, falling back to main chain:', puterError);
      }
    }

    const payload = {
      messages: [systemMessage, ...enhancedMessages],
      persona: options.persona || this.defaultPersona,
      auditMode: finalOptions.auditMode,
      oneTestMode: finalOptions.oneTestMode,
      realTime: finalOptions.realTime,
      enforceGlyphFormat: true,
      formatOverride: true,
      systemFirst: true,
      provider: isAutoMode ? 'AUTO' : providerValue,
      autoProvider: isAutoMode,
      jsonModeForced: options.jsonModeForced || finalOptions.jsonModeForced,
      structuredMode: options.structuredMode || finalOptions.structuredMode
    };

    console.log('[GlyphBotClient] Sending payload:', { 
      provider: payload.provider, 
      autoProvider: payload.autoProvider,
      persona: payload.persona,
      auditMode: payload.auditMode
    });

    const response = await base44.functions.invoke('glyphbotLLM', payload);
    
    console.log('[GlyphBotClient] Received response:', {
      providerUsed: response.data?.providerUsed,
      model: response.data?.model,
      textLength: response.data?.text?.length
    });
    
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
      auditEngineActive: isAuditActive && !!response.data?.audit,
      jsonModeUsed: response.data?.jsonModeUsed || false,
      meta: response.data?.meta || null
    };
  }

  async webSearch(query, maxResults = 5) {
    return await searchService.query(query, maxResults);
  }

  async askWithRealTime(prompt, persona = 'GENERAL') {
    return this.sendMessage(
      [{ role: 'user', content: prompt }],
      { persona, realTime: true }
    );
  }

  async askWithTTS(prompt, persona = 'GENERAL') {
    return this.sendMessage(
      [{ role: 'user', content: prompt }],
      { persona, tts: true }
    );
  }

  async runIntegrityCheck() {
    return this.sendMessage(
      [{ role: 'user', content: 'Run system integrity check' }],
      { oneTestMode: true }
    );
  }

  async systemCheck() {
    return await llmService.ping();
  }

  async getPersonas() {
    return PERSONAS;
  }

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

const glyphbotClient = new GlyphBotClient();
export default glyphbotClient;

export { GlyphBotClient };