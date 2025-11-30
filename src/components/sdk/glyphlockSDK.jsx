/**
 * @glyphlock/sdk v2.0 - Browser-compatible SDK for Base44
 * 
 * Features:
 * - Provider health monitoring
 * - Dynamic fallback selection
 * - Per-provider JSON mode
 * - Audit persona support
 * - Real-time performance metrics
 */

import { base44 } from "@/api/base44Client";
import { getChainManager, PROVIDER_CONFIG, PERSONAS, CHAIN_MODES } from "./chainManager";

class GlyphLockError extends Error {
  constructor(message, code, status, details) {
    super(message);
    this.name = "GlyphLockError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

class GlyphLockClient {
  constructor(config = {}) {
    this.config = {
      chainMode: config.chainMode || "gemini-first",
      environment: config.environment || "production",
      timeoutMs: config.timeoutMs || 30000,
      enableHealthRouting: config.enableHealthRouting !== false,
      maxRetries: config.maxRetries || 3,
      ...config
    };
    
    // Initialize chain manager
    this.chainManager = getChainManager(this.config);
  }

  /**
   * Get available chain modes
   */
  static get CHAIN_MODES() {
    return Object.keys(CHAIN_MODES);
  }

  /**
   * Get available personas
   */
  static get PERSONAS() {
    return Object.keys(PERSONAS);
  }

  /**
   * Get provider configurations
   */
  static get PROVIDERS() {
    return PROVIDER_CONFIG;
  }

  /**
   * Run AI chain with health-aware fallback support
   * @param {Object} options
   * @param {string} options.input - The prompt/input text
   * @param {string} [options.model] - Primary model (e.g., "openai:gpt-4o")
   * @param {string[]} [options.fallback] - Fallback models
   * @param {string} [options.persona] - Persona (GENERAL, AUDIT, SECURITY, etc.)
   * @param {boolean} [options.jsonMode] - Force JSON output
   * @param {Object} [options.jsonSchema] - JSON schema for structured output
   * @param {number} [options.temperature] - Temperature (0-1)
   * @param {number} [options.maxTokens] - Max output tokens
   * @param {string} [options.chainMode] - Chain mode override
   * @param {Object} [options.metadata] - Additional metadata
   * @returns {Promise<ChainRunResult>}
   */
  async chainRun(options) {
    const {
      input,
      model,
      fallback,
      persona = 'GENERAL',
      jsonMode = false,
      jsonSchema,
      temperature,
      maxTokens,
      chainMode,
      metadata
    } = options;

    const startTime = Date.now();
    const traceId = crypto.randomUUID();
    
    // Get health-optimized provider chain
    const providerChain = this.chainManager.getChainOrder({
      persona,
      jsonMode,
      chainMode: chainMode || this.config.chainMode
    });

    let lastError = null;
    let attemptCount = 0;

    // Try providers in order
    for (const providerInfo of providerChain) {
      attemptCount++;
      const providerId = providerInfo.id;
      const providerStart = Date.now();

      try {
        // Build request payload with provider-specific config
        const payload = this.chainManager.buildRequestPayload(providerId, {
          input,
          messages: [{ role: 'user', content: input }],
          persona,
          jsonMode,
          jsonSchema,
          temperature,
          maxTokens
        });

        const response = await base44.functions.invoke('glyphbotLLM', payload);
        const latencyMs = Date.now() - providerStart;

        // Record success
        this.chainManager.recordProviderResult(providerId, true, latencyMs);

        return {
          output: response.data?.text || '',
          modelUsed: response.data?.model || providerInfo.config?.label || 'unknown',
          provider: providerId,
          providerLabel: response.data?.providerLabel || providerInfo.config?.label,
          tokensIn: response.data?.tokensIn,
          tokensOut: response.data?.tokensOut,
          latencyMs,
          totalLatencyMs: Date.now() - startTime,
          traceId,
          attemptCount,
          jsonMode: response.data?.jsonModeUsed || false,
          audit: response.data?.audit,
          meta: {
            ...response.data?.meta,
            healthScore: providerInfo.health?.score
          }
        };

      } catch (error) {
        const latencyMs = Date.now() - providerStart;
        lastError = error;

        // Record failure
        this.chainManager.recordProviderResult(providerId, false, latencyMs, error.message);
        console.warn(`[GlyphLock] Provider ${providerId} failed:`, error.message);
        continue;
      }
    }

    // All providers failed
    throw new GlyphLockError(
      lastError?.message || 'All providers failed',
      'CHAIN_EXHAUSTED',
      503,
      { attemptCount, traceId, lastError }
    );
  }

  /**
   * Run audit analysis with structured output
   * @param {Object} options
   * @param {string} options.target - Target to audit (URL, code, etc.)
   * @param {string} [options.type] - Audit type (url, code, api, system)
   * @param {Object} [options.context] - Additional context
   * @returns {Promise<AuditResult>}
   */
  async runAudit(options) {
    const { target, type = 'other', context = {} } = options;

    const prompt = `Perform a security audit on the following target:

Target: ${target}
Type: ${type}
Context: ${JSON.stringify(context)}

Provide a comprehensive security assessment with risk score, severity, identified issues, and remediation recommendations.`;

    const result = await this.chainRun({
      input: prompt,
      persona: 'AUDIT',
      jsonMode: true,
      chainMode: 'audit-optimized'
    });

    // Parse structured audit output
    let auditData = result.audit;
    if (!auditData && result.output) {
      try {
        auditData = JSON.parse(result.output);
      } catch {
        auditData = {
          subject: target,
          type,
          risk_score: 0,
          severity: 'low',
          issues: [],
          overall_assessment: result.output
        };
      }
    }

    return {
      ...result,
      audit: auditData
    };
  }

  /**
   * Encode data into a steganographic QR code
   * @param {Object} options
   * @param {string} options.data - Data to encode
   * @param {string} [options.mode] - "stego" or "raw"
   * @param {string} [options.level] - Error correction level
   * @param {string} [options.format] - Output format (png/svg)
   * @param {Object} [options.metadata] - Additional metadata
   * @returns {Promise<QREncodeResult>}
   */
  async qrEncode(options) {
    const { data, mode = 'stego', level = 'high', format = 'png', metadata } = options;

    try {
      const response = await base44.functions.invoke('generateQrAsset', {
        payload: data,
        format,
        errorCorrection: level.toUpperCase(),
        stegoMode: mode === 'stego',
        metadata
      });

      return {
        imageUrl: response.data?.qrUrl,
        format,
        checksum: response.data?.checksum || this._generateChecksum(data)
      };
    } catch (error) {
      throw new GlyphLockError(
        error.message || 'QR encode failed',
        'QR_ENCODE_ERROR',
        500,
        error
      );
    }
  }

  /**
   * Decode a QR code
   * @param {string} imageUrl - URL of the QR image
   * @returns {Promise<QRDecodeResult>}
   */
  async qrDecode(imageUrl) {
    try {
      const response = await base44.functions.invoke('extractStegoPayload', {
        imageUrl
      });

      return {
        data: response.data?.payload || '',
        mode: response.data?.stegoDetected ? 'stego' : 'raw',
        metadata: response.data?.metadata
      };
    } catch (error) {
      throw new GlyphLockError(
        error.message || 'QR decode failed',
        'QR_DECODE_ERROR',
        500,
        error
      );
    }
  }

  /**
   * Verify covenant access decision
   * @param {Object} options
   * @param {string} options.token - Auth token
   * @param {string} options.action - Action to verify
   * @param {string} options.resource - Resource path
   * @param {Object} [options.context] - Additional context
   * @returns {Promise<CovenantResult>}
   */
  async covenantVerify(options) {
    const { token, action, resource, context } = options;

    // For now, this is a client-side stub
    // In production, this would call a backend covenant verification service
    return {
      allowed: true,
      reason: null,
      policyId: 'default-allow',
      traceId: crypto.randomUUID()
    };
  }

  /**
   * Send a message to GlyphBot with full options
   * @param {Object} options
   * @param {string} options.message - User message
   * @param {string} [options.persona] - Bot persona
   * @param {boolean} [options.auditMode] - Enable audit mode
   * @param {boolean} [options.jsonMode] - Force JSON output
   * @param {string} [options.provider] - Specific provider
   * @returns {Promise<GlyphBotResponse>}
   */
  async chat(options) {
    const { 
      message, 
      persona = 'GENERAL', 
      auditMode = false, 
      jsonMode = false,
      provider = 'AUTO' 
    } = options;

    return this.chainRun({
      input: message,
      persona: auditMode ? 'AUDIT' : persona,
      jsonMode,
      chainMode: provider === 'AUTO' ? this.config.chainMode : undefined
    });
  }

  /**
   * Health check / ping with provider health report
   * @returns {Promise<HealthReport>}
   */
  async ping() {
    try {
      const response = await base44.functions.invoke('glyphbotLLM', {
        messages: [{ role: 'user', content: 'ping' }]
      });

      return {
        status: response.data?.status || 'ok',
        providers: response.data?.providers || [],
        health: this.getHealthReport()
      };
    } catch (error) {
      return {
        status: 'error',
        error: error.message,
        health: this.getHealthReport()
      };
    }
  }

  /**
   * Get provider health report
   * @returns {HealthReport}
   */
  getHealthReport() {
    return this.chainManager.getHealthReport();
  }

  /**
   * Get recommended provider chain based on health
   * @param {Object} options
   * @param {boolean} [options.requireJsonMode] - Filter to JSON-capable providers
   * @param {boolean} [options.requireAudit] - Filter to audit-capable providers
   * @returns {Array<ProviderInfo>}
   */
  getRecommendedChain(options = {}) {
    return this.chainManager.getChainOrder({
      ...options,
      chainMode: this.config.chainMode
    });
  }

  /**
   * Reset provider health metrics
   */
  resetHealth() {
    this.chainManager.resetHealth();
  }

  /**
   * Update chain configuration
   * @param {Object} config
   */
  setChainMode(mode) {
    if (CHAIN_MODES[mode]) {
      this.config.chainMode = mode;
      this.chainManager.config.chainMode = mode;
    } else {
      throw new GlyphLockError(`Invalid chain mode: ${mode}`, 'INVALID_CONFIG', 400);
    }
  }

  // Private helpers

  _mapModelToProvider(model) {
    if (!model) return null;
    
    const mapping = {
      'openai:gpt-4o': 'OPENAI',
      'openai:gpt-4o-mini': 'OPENAI',
      'anthropic:opus': 'CLAUDE',
      'anthropic:sonnet': 'CLAUDE',
      'gemini:pro': 'GEMINI',
      'gemini:flash': 'GEMINI'
    };

    return mapping[model] || null;
  }

  _generateChecksum(data) {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  }
}

// Singleton instance
let instance = null;

export function getGlyphLock(config) {
  if (!instance) {
    instance = new GlyphLockClient(config);
  }
  return instance;
}

export { GlyphLockClient, GlyphLockError };
export default GlyphLockClient;