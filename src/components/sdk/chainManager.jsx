/**
 * GlyphLock Chain Manager v2.0
 * 
 * Advanced AI chain orchestration with:
 * - Provider health monitoring
 * - Dynamic fallback selection based on real-time metrics
 * - Per-provider JSON mode configuration
 * - Audit persona support
 * - Performance-based routing
 */

// Provider configuration with capabilities
const PROVIDER_CONFIG = {
  GEMINI: {
    id: 'GEMINI',
    label: 'Gemini Flash',
    priority: 1,
    costTier: 'free',
    jsonMode: true,
    maxTokens: 8192,
    models: ['gemini-1.5-flash', 'gemini-1.5-pro'],
    defaultModel: 'gemini-1.5-flash',
    supportsAudit: true,
    supportsStreaming: true
  },
  OPENAI: {
    id: 'OPENAI',
    label: 'OpenAI GPT-4o',
    priority: 2,
    costTier: 'paid',
    jsonMode: true,
    jsonSchema: true, // Supports strict JSON schema
    maxTokens: 4096,
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo'],
    defaultModel: 'gpt-4o',
    supportsAudit: true,
    supportsStreaming: true
  },
  CLAUDE: {
    id: 'CLAUDE',
    label: 'Claude Sonnet',
    priority: 3,
    costTier: 'paid',
    jsonMode: true,
    maxTokens: 4096,
    models: ['claude-3-5-sonnet-20241022', 'claude-3-opus-20240229'],
    defaultModel: 'claude-3-5-sonnet-20241022',
    supportsAudit: true,
    supportsStreaming: true
  },
  OPENROUTER: {
    id: 'OPENROUTER',
    label: 'OpenRouter',
    priority: 4,
    costTier: 'variable',
    jsonMode: true,
    maxTokens: 4096,
    models: ['google/gemini-flash-1.5', 'anthropic/claude-3.5-sonnet', 'openai/gpt-4o'],
    defaultModel: 'google/gemini-flash-1.5',
    supportsAudit: true,
    supportsStreaming: false
  },
  LOCAL_OSS: {
    id: 'LOCAL_OSS',
    label: 'Local Fallback',
    priority: 999,
    costTier: 'free',
    jsonMode: false,
    maxTokens: 1000,
    models: ['local-stub'],
    defaultModel: 'local-stub',
    supportsAudit: false,
    supportsStreaming: false
  }
};

// Chain modes define provider priority order
const CHAIN_MODES = {
  'gemini-first': ['GEMINI', 'OPENAI', 'CLAUDE', 'OPENROUTER', 'LOCAL_OSS'],
  'openai-first': ['OPENAI', 'GEMINI', 'CLAUDE', 'OPENROUTER', 'LOCAL_OSS'],
  'claude-first': ['CLAUDE', 'OPENAI', 'GEMINI', 'OPENROUTER', 'LOCAL_OSS'],
  'balanced': ['GEMINI', 'OPENAI', 'CLAUDE', 'OPENROUTER', 'LOCAL_OSS'],
  'free-only': ['GEMINI', 'OPENROUTER', 'LOCAL_OSS'],
  'audit-optimized': ['OPENAI', 'CLAUDE', 'GEMINI', 'OPENROUTER', 'LOCAL_OSS']
};

// Persona configurations
const PERSONAS = {
  GENERAL: {
    id: 'GENERAL',
    systemPrompt: 'You are GlyphBot, an elite AI security assistant. Respond directly and concisely.',
    temperature: 0.7,
    jsonMode: false
  },
  SECURITY: {
    id: 'SECURITY',
    systemPrompt: 'You are GlyphBot in security mode. Focus on threats, vulnerabilities, and secure patterns.',
    temperature: 0.5,
    jsonMode: false
  },
  AUDIT: {
    id: 'AUDIT',
    systemPrompt: `You are GlyphBot in forensic audit mode. Provide structured security analysis.
Output must include: risk_score (0-100), severity (low/moderate/high/critical), issues array, and recommendations.
Be precise, technical, and actionable. No fluff.`,
    temperature: 0.3,
    jsonMode: true,
    jsonSchema: {
      type: 'object',
      properties: {
        subject: { type: 'string' },
        type: { type: 'string', enum: ['url', 'domain', 'code', 'api', 'system', 'other'] },
        risk_score: { type: 'number', minimum: 0, maximum: 100 },
        severity: { type: 'string', enum: ['low', 'moderate', 'high', 'critical'] },
        issues: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              description: { type: 'string' },
              impact: { type: 'string' },
              remediation: { type: 'string' }
            }
          }
        },
        recommendations: { type: 'array', items: { type: 'string' } },
        overall_assessment: { type: 'string' }
      },
      required: ['subject', 'risk_score', 'severity']
    }
  },
  BLOCKCHAIN: {
    id: 'BLOCKCHAIN',
    systemPrompt: 'You are GlyphBot in blockchain mode. Focus on smart contracts, DeFi security, and cryptographic concepts.',
    temperature: 0.4,
    jsonMode: false
  },
  DEBUGGER: {
    id: 'DEBUGGER',
    systemPrompt: 'You are GlyphBot in debugger mode. Identify bugs and propose efficient fixes with code examples.',
    temperature: 0.3,
    jsonMode: false
  },
  ANALYTICS: {
    id: 'ANALYTICS',
    systemPrompt: 'You are GlyphBot in analytics mode. Analyze data patterns and provide structured insights.',
    temperature: 0.4,
    jsonMode: true
  }
};

/**
 * Provider Health Monitor
 * Tracks real-time performance metrics for dynamic routing
 */
class ProviderHealthMonitor {
  constructor() {
    this.metrics = {};
    this.healthThresholds = {
      maxFailureRate: 0.5,      // 50% failure rate = unhealthy
      maxLatencyMs: 15000,      // 15s avg latency = slow
      minSuccessStreak: 3,      // Need 3 successes to recover
      cooldownMs: 60000         // 1 minute cooldown after failures
    };
  }

  initProvider(providerId) {
    if (!this.metrics[providerId]) {
      this.metrics[providerId] = {
        totalCalls: 0,
        successCount: 0,
        failureCount: 0,
        totalLatencyMs: 0,
        lastLatencyMs: 0,
        lastErrorTime: null,
        lastErrorType: null,
        lastSuccessTime: null,
        consecutiveFailures: 0,
        consecutiveSuccesses: 0,
        status: 'healthy',
        cooldownUntil: null
      };
    }
    return this.metrics[providerId];
  }

  recordSuccess(providerId, latencyMs) {
    const m = this.initProvider(providerId);
    m.totalCalls++;
    m.successCount++;
    m.totalLatencyMs += latencyMs;
    m.lastLatencyMs = latencyMs;
    m.lastSuccessTime = Date.now();
    m.consecutiveFailures = 0;
    m.consecutiveSuccesses++;
    m.lastErrorType = null;
    
    // Recovery check
    if (m.status === 'degraded' && m.consecutiveSuccesses >= this.healthThresholds.minSuccessStreak) {
      m.status = 'healthy';
      m.cooldownUntil = null;
    }
  }

  recordFailure(providerId, errorType, latencyMs = 0) {
    const m = this.initProvider(providerId);
    m.totalCalls++;
    m.failureCount++;
    m.lastLatencyMs = latencyMs;
    m.lastErrorTime = Date.now();
    m.lastErrorType = errorType;
    m.consecutiveSuccesses = 0;
    m.consecutiveFailures++;
    
    // Health degradation
    const failureRate = m.failureCount / m.totalCalls;
    if (failureRate > this.healthThresholds.maxFailureRate || m.consecutiveFailures >= 3) {
      m.status = 'degraded';
      m.cooldownUntil = Date.now() + this.healthThresholds.cooldownMs;
    }
  }

  getProviderHealth(providerId) {
    const m = this.initProvider(providerId);
    const now = Date.now();
    
    // Check cooldown
    if (m.cooldownUntil && now < m.cooldownUntil) {
      return {
        ...m,
        status: 'cooldown',
        remainingCooldownMs: m.cooldownUntil - now
      };
    } else if (m.cooldownUntil && now >= m.cooldownUntil) {
      m.cooldownUntil = null;
      m.status = 'recovering';
    }
    
    const avgLatency = m.totalCalls > 0 ? m.totalLatencyMs / m.totalCalls : 0;
    const failureRate = m.totalCalls > 0 ? m.failureCount / m.totalCalls : 0;
    const successRate = m.totalCalls > 0 ? m.successCount / m.totalCalls : 1;
    
    return {
      ...m,
      avgLatencyMs: Math.round(avgLatency),
      failureRate: Math.round(failureRate * 100) / 100,
      successRate: Math.round(successRate * 100) / 100,
      isHealthy: m.status === 'healthy' || m.status === 'recovering',
      score: this.calculateHealthScore(m)
    };
  }

  calculateHealthScore(metrics) {
    // Score 0-100, higher is better
    let score = 100;
    
    // Penalize for failures
    const failureRate = metrics.totalCalls > 0 ? metrics.failureCount / metrics.totalCalls : 0;
    score -= failureRate * 50;
    
    // Penalize for high latency
    const avgLatency = metrics.totalCalls > 0 ? metrics.totalLatencyMs / metrics.totalCalls : 0;
    if (avgLatency > 5000) score -= 20;
    else if (avgLatency > 2000) score -= 10;
    else if (avgLatency > 1000) score -= 5;
    
    // Penalize for consecutive failures
    score -= metrics.consecutiveFailures * 10;
    
    // Bonus for consecutive successes
    score += Math.min(metrics.consecutiveSuccesses * 2, 10);
    
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  getAllHealth() {
    const result = {};
    for (const id of Object.keys(PROVIDER_CONFIG)) {
      result[id] = this.getProviderHealth(id);
    }
    return result;
  }

  getBestProviders(chainMode = 'gemini-first', options = {}) {
    const { requireJsonMode = false, requireAudit = false, maxProviders = 5 } = options;
    
    const baseOrder = CHAIN_MODES[chainMode] || CHAIN_MODES['gemini-first'];
    const healthData = this.getAllHealth();
    
    // Filter and score providers
    const scored = baseOrder
      .filter(id => {
        const config = PROVIDER_CONFIG[id];
        if (requireJsonMode && !config.jsonMode) return false;
        if (requireAudit && !config.supportsAudit) return false;
        return true;
      })
      .map(id => ({
        id,
        config: PROVIDER_CONFIG[id],
        health: healthData[id],
        score: healthData[id].score,
        priority: PROVIDER_CONFIG[id].priority
      }))
      .sort((a, b) => {
        // Sort by health score first, then priority
        const healthDiff = b.score - a.score;
        if (Math.abs(healthDiff) > 20) return healthDiff;
        return a.priority - b.priority;
      });
    
    return scored.slice(0, maxProviders);
  }

  reset() {
    this.metrics = {};
  }
}

/**
 * Chain Manager
 * Orchestrates AI chain execution with health-aware routing
 */
class ChainManager {
  constructor(config = {}) {
    this.config = {
      chainMode: config.chainMode || 'gemini-first',
      defaultTimeout: config.timeoutMs || 30000,
      maxRetries: config.maxRetries || 3,
      enableHealthRouting: config.enableHealthRouting !== false,
      ...config
    };
    this.healthMonitor = new ProviderHealthMonitor();
  }

  getProviderConfig(providerId) {
    return PROVIDER_CONFIG[providerId] || null;
  }

  getPersonaConfig(personaId) {
    return PERSONAS[personaId] || PERSONAS.GENERAL;
  }

  getChainOrder(options = {}) {
    const { persona, jsonMode, chainMode } = options;
    const personaConfig = this.getPersonaConfig(persona);
    
    // Use audit-optimized chain for audit persona
    const mode = persona === 'AUDIT' ? 'audit-optimized' : (chainMode || this.config.chainMode);
    
    if (this.config.enableHealthRouting) {
      return this.healthMonitor.getBestProviders(mode, {
        requireJsonMode: jsonMode || personaConfig.jsonMode,
        requireAudit: persona === 'AUDIT'
      });
    }
    
    return (CHAIN_MODES[mode] || CHAIN_MODES['gemini-first']).map(id => ({
      id,
      config: PROVIDER_CONFIG[id],
      health: this.healthMonitor.getProviderHealth(id)
    }));
  }

  buildRequestPayload(providerId, options) {
    const providerConfig = PROVIDER_CONFIG[providerId];
    const personaConfig = this.getPersonaConfig(options.persona);
    
    const payload = {
      messages: options.messages || [{ role: 'user', content: options.input }],
      persona: options.persona || 'GENERAL',
      provider: providerId,
      autoProvider: false,
      temperature: options.temperature ?? personaConfig.temperature,
      maxTokens: options.maxTokens || providerConfig.maxTokens
    };
    
    // Add JSON mode if supported and requested
    if (options.jsonMode || personaConfig.jsonMode) {
      if (providerConfig.jsonMode) {
        payload.jsonModeForced = true;
        payload.structuredMode = providerConfig.jsonSchema && personaConfig.jsonSchema;
        if (payload.structuredMode && personaConfig.jsonSchema) {
          payload.jsonSchema = personaConfig.jsonSchema;
        }
      }
    }
    
    // Add audit mode
    if (options.persona === 'AUDIT' || options.auditMode) {
      payload.auditMode = true;
    }
    
    return payload;
  }

  recordProviderResult(providerId, success, latencyMs, errorType = null) {
    if (success) {
      this.healthMonitor.recordSuccess(providerId, latencyMs);
    } else {
      this.healthMonitor.recordFailure(providerId, errorType, latencyMs);
    }
  }

  getHealthReport() {
    return {
      providers: this.healthMonitor.getAllHealth(),
      chainMode: this.config.chainMode,
      healthRoutingEnabled: this.config.enableHealthRouting,
      recommendedChain: this.getChainOrder()
    };
  }

  resetHealth() {
    this.healthMonitor.reset();
  }
}

// Singleton instance
let chainManagerInstance = null;

export function getChainManager(config) {
  if (!chainManagerInstance) {
    chainManagerInstance = new ChainManager(config);
  }
  return chainManagerInstance;
}

export {
  ChainManager,
  ProviderHealthMonitor,
  PROVIDER_CONFIG,
  CHAIN_MODES,
  PERSONAS
};

export default ChainManager;