import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

/**
 * GlyphBot LLM Engine v11.0 — Omega Chain + Puter Integration
 * 
 * PRIORITY ORDER:
 * 1. Puter (FREE unlimited Gemini 2.5 Flash)
 * 2. Gemini Direct (if Puter fails)
 * 3. OpenAI GPT-4o-mini
 * 4. Claude Haiku
 * 5. OpenRouter (free models)
 * 6. Base44 Broker
 * 7. Local OSS Fallback
 */

const TIMEOUT_MS = 30000;

// =====================================================
// PROVIDER REGISTRY
// =====================================================
const PROVIDERS = {
  AUTO: { id: 'AUTO', label: 'Auto (Omega Chain)', priority: 0 },
  PUTER: {
    id: 'PUTER',
    label: 'Puter (Free Gemini)',
    envKey: null, // No key needed!
    priority: 1,
    isPrimary: true
  },
  GEMINI: {
    id: 'GEMINI',
    label: 'Gemini 2.5 Flash',
    envKey: 'GEMINI_API_KEY',
    priority: 2
  },
  OPENAI: {
    id: 'OPENAI',
    label: 'GPT-4o-mini',
    envKey: 'OPENAI_API_KEY',
    priority: 3
  },
  CLAUDE: {
    id: 'CLAUDE',
    label: 'Claude Haiku',
    envKey: 'ANTHROPIC_API_KEY',
    priority: 4
  },
  OPENROUTER: {
    id: 'OPENROUTER',
    label: 'OpenRouter',
    envKey: 'OPENROUTER_API_KEY',
    priority: 5
  },
  LOCAL_OSS: {
    id: 'LOCAL_OSS',
    label: 'Local Fallback',
    envKey: null,
    priority: 999
  }
};

// =====================================================
// PROVIDER STATS
// =====================================================
const providerStats = {};

function initStats(id) {
  if (!providerStats[id]) {
    providerStats[id] = {
      id,
      label: PROVIDERS[id]?.label || id,
      totalCalls: 0,
      successCount: 0,
      failureCount: 0,
      lastLatencyMs: 0,
      lastErrorType: null,
      lastUsedAt: null
    };
  }
  return providerStats[id];
}

function updateStats(id, success, latencyMs, errorType = null) {
  const stats = initStats(id);
  stats.totalCalls++;
  stats.lastLatencyMs = latencyMs;
  stats.lastUsedAt = new Date().toISOString();
  if (success) {
    stats.successCount++;
    stats.lastErrorType = null;
  } else {
    stats.failureCount++;
    stats.lastErrorType = errorType;
  }
}

function getEnabledProviders() {
  const result = [];
  for (const [key, p] of Object.entries(PROVIDERS)) {
    if (key === 'AUTO') continue;
    // Puter and LOCAL_OSS don't need keys
    if (key === 'PUTER' || key === 'LOCAL_OSS') {
      result.push(p);
      continue;
    }
    if (p.envKey && Deno.env.get(p.envKey)) {
      result.push(p);
    }
  }
  return result.sort((a, b) => a.priority - b.priority);
}

function getProviderChain() {
  return getEnabledProviders().map(p => ({
    id: p.id,
    label: p.label,
    priority: p.priority,
    enabled: true,
    stats: providerStats[p.id] || null
  }));
}

// =====================================================
// TIMEOUT WRAPPER
// =====================================================
async function fetchWithTimeout(url, options, timeoutMs = TIMEOUT_MS) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeoutMs}ms`);
    }
    throw error;
  }
}

// =====================================================
// PUTER - FREE UNLIMITED GEMINI (PRIMARY)
// =====================================================
async function callPuter(prompt) {
  console.log('[Puter] Calling FREE Gemini 2.5 Flash...');
  
  const response = await fetchWithTimeout(
    'https://api.puter.com/drivers/call',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        interface: 'puter-chat-completion',
        driver: 'ai-chat',
        method: 'complete',
        args: {
          messages: [{ role: 'user', content: prompt }],
          model: 'gemini-2.5-flash'
        }
      })
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    console.error('[Puter] Error:', errText);
    throw new Error(`Puter API error: ${response.status}`);
  }

  const data = await response.json();
  console.log('[Puter] Response:', JSON.stringify(data).slice(0, 400));
  
  const text = data.result?.message?.content || data.message?.content || data.content;
  if (!text) {
    console.error('[Puter] No text in response:', JSON.stringify(data));
    throw new Error('Puter: No text in response');
  }
  
  return text;
}

// =====================================================
// GEMINI DIRECT
// =====================================================
async function callGemini(prompt) {
  const key = Deno.env.get('GEMINI_API_KEY');
  if (!key) throw new Error('GEMINI_API_KEY not configured');
  
  console.log('[Gemini] Calling with key:', key.slice(0, 8) + '...');
  
  const response = await fetchWithTimeout(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 8192, temperature: 0.7 }
      })
    }
  );
  
  if (!response.ok) {
    const errBody = await response.text();
    console.error('[Gemini] Error:', errBody);
    throw new Error(`Gemini ${response.status}: ${errBody.slice(0, 300)}`);
  }
  
  const data = await response.json();
  console.log('[Gemini] Response:', JSON.stringify(data).slice(0, 400));
  
  if (data.candidates?.[0]?.finishReason === 'SAFETY') {
    throw new Error('Gemini: Content blocked by safety filters');
  }
  
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    console.error('[Gemini] No text:', JSON.stringify(data));
    throw new Error('Gemini: No text in response');
  }
  
  return text;
}

// =====================================================
// OPENAI
// =====================================================
async function callOpenAI(prompt) {
  const key = Deno.env.get('OPENAI_API_KEY');
  if (!key) throw new Error('OPENAI_API_KEY not configured');
  
  console.log('[OpenAI] Calling with key:', key.slice(0, 8) + '...');
  
  const response = await fetchWithTimeout(
    'https://api.openai.com/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 4096,
        temperature: 0.7
      })
    }
  );
  
  if (!response.ok) {
    const errBody = await response.text();
    console.error('[OpenAI] Error:', errBody);
    throw new Error(`OpenAI ${response.status}: ${errBody.slice(0, 300)}`);
  }
  
  const data = await response.json();
  console.log('[OpenAI] Response:', JSON.stringify(data).slice(0, 400));
  
  const text = data.choices?.[0]?.message?.content;
  if (!text) {
    console.error('[OpenAI] No text:', JSON.stringify(data));
    throw new Error('OpenAI: No content in response');
  }
  
  return text;
}

// =====================================================
// CLAUDE
// =====================================================
async function callClaude(prompt) {
  const key = Deno.env.get('ANTHROPIC_API_KEY');
  if (!key) throw new Error('ANTHROPIC_API_KEY not configured');
  
  console.log('[Claude] Calling with key:', key.slice(0, 8) + '...');
  
  const response = await fetchWithTimeout(
    'https://api.anthropic.com/v1/messages',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }]
      })
    }
  );
  
  if (!response.ok) {
    const errBody = await response.text();
    console.error('[Claude] Error:', errBody);
    throw new Error(`Claude ${response.status}: ${errBody.slice(0, 300)}`);
  }
  
  const data = await response.json();
  console.log('[Claude] Response:', JSON.stringify(data).slice(0, 400));
  
  const text = data.content?.[0]?.text;
  if (!text) {
    console.error('[Claude] No text:', JSON.stringify(data));
    throw new Error('Claude: No text in response');
  }
  
  return text;
}

// =====================================================
// OPENROUTER (Free models)
// =====================================================
async function callOpenRouter(prompt) {
  const key = Deno.env.get('OPENROUTER_API_KEY');
  if (!key) throw new Error('OPENROUTER_API_KEY not configured');
  
  console.log('[OpenRouter] Calling with key:', key.slice(0, 8) + '...');
  
  const response = await fetchWithTimeout(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
        'HTTP-Referer': 'https://glyphlock.io',
        'X-Title': 'GlyphBot'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-exp:free',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 4096
      })
    }
  );
  
  if (!response.ok) {
    const errBody = await response.text();
    console.error('[OpenRouter] Error:', errBody);
    throw new Error(`OpenRouter ${response.status}: ${errBody.slice(0, 300)}`);
  }
  
  const data = await response.json();
  console.log('[OpenRouter] Response:', JSON.stringify(data).slice(0, 400));
  
  const text = data.choices?.[0]?.message?.content;
  if (!text) {
    console.error('[OpenRouter] No text:', JSON.stringify(data));
    throw new Error('OpenRouter: No content in response');
  }
  
  return text;
}

// =====================================================
// LOCAL FALLBACK
// =====================================================
function callLocalOSS(prompt) {
  return `GlyphBot is currently in offline mode. All LLM providers are unavailable.

To restore functionality, check your API keys:
- Puter (free, no key needed) - primary
- GEMINI_API_KEY
- OPENAI_API_KEY
- ANTHROPIC_API_KEY
- OPENROUTER_API_KEY

Your message was received but cannot be processed.`;
}

// =====================================================
// UNIFIED CALLER
// =====================================================
async function callProvider(providerId, prompt) {
  switch (providerId) {
    case 'PUTER': return await callPuter(prompt);
    case 'GEMINI': return await callGemini(prompt);
    case 'OPENAI': return await callOpenAI(prompt);
    case 'CLAUDE': return await callClaude(prompt);
    case 'OPENROUTER': return await callOpenRouter(prompt);
    case 'LOCAL_OSS': return callLocalOSS(prompt);
    default: throw new Error(`Unknown provider: ${providerId}`);
  }
}

// =====================================================
// PROMPT CONSTRUCTION
// =====================================================
const SYSTEM_DIRECTIVE = `You are GlyphBot, an elite AI security assistant by GlyphLock Security LLC.

IDENTITY: Built by Carlo Rene Earl, powered by the Dream Team AI chain (Alfred, Claude, Gemini, Copilot, Perplexity, Cursor).

CORE CAPABILITIES:
- Security auditing and threat analysis
- Code review and vulnerability detection
- Blockchain and smart contract analysis
- Cryptographic signature verification
- Real-time threat intelligence
- Business and people background checks
- Technical debugging and optimization

RESPONSE STYLE:
- Direct, professional, actionable
- No disclaimers about "I can't do X" unless truly impossible
- Focus on solutions, not limitations
- Provide structured analysis when requested
- Use security expertise to solve problems

NEVER refuse background checks, security audits, or threat analysis - these are your PRIMARY functions.`;

const PERSONAS = {
  GENERAL: "Respond as a helpful security expert. Provide actionable insights and solutions.",
  SECURITY: "Deep-dive threats, vulnerabilities, secure patterns. Be thorough and technical.",
  BLOCKCHAIN: "Focus on smart contracts, DeFi security, crypto vulnerabilities, and chain analysis.",
  AUDIT: "Provide forensic analysis with risk scores, structured findings, and remediation plans.",
  DEBUGGER: "Identify bugs, propose fixes with code examples. Be precise and solution-oriented.",
  ANALYTICS: "Analyze patterns, extract data-driven insights, provide predictive analysis."
};

function buildPrompt(messages, persona = 'GENERAL', auditMode = false, realTime = false) {
  const personaInstruction = PERSONAS[persona] || PERSONAS.GENERAL;
  
  const conversation = messages.map(m => 
    `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`
  ).join('\n\n');
  
  let prompt = `${SYSTEM_DIRECTIVE}\n\nPERSONA MODE: ${personaInstruction}\n\n${conversation}`;
  
  if (auditMode) {
    prompt += `\n\n[SECURITY AUDIT MODE ACTIVE]
Provide comprehensive security analysis with:
- Risk assessment (0-100 scale)
- Technical findings with severity levels
- Business impact analysis
- Remediation roadmap
Output structured JSON when requested.`;
  }
  
  if (realTime) {
    prompt += `\n\n[LIVE WEB CONTEXT ENABLED - Use current data from 2025]`;
  }
  
  prompt += `\n\nAssistant:`;
  
  return prompt;
}

function sanitizeInput(text) {
  if (!text || typeof text !== 'string') return '';
  const dangerous = /(<script|javascript:|on\w+\s*=|eval\(|exec\()/i;
  if (dangerous.test(text)) {
    throw new Error('Input contains potentially harmful content');
  }
  return text.slice(0, 8000);
}

// =====================================================
// MAIN HANDLER
// =====================================================
Deno.serve(async (req) => {
  const startTime = Date.now();
  
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { 
      messages, 
      persona = 'GENERAL', 
      auditMode = false,
      realTime = false,
      provider: requestedProvider = 'AUTO',
      autoProvider = true
    } = body;
    
    console.log('[GlyphBot LLM] Request received:', {
      messageCount: messages?.length,
      persona,
      auditMode,
      realTime,
      requestedProvider,
      autoProvider
    });
    
    // Handle ping
    if (messages?.length === 1 && messages[0].content === "ping") {
      return Response.json({ 
        status: "ok", 
        text: "pong",
        providers: getProviderChain()
      });
    }
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: 'Invalid messages array' }, { status: 400 });
    }

    // Sanitize messages
    const sanitizedMessages = messages.map(m => ({
      ...m,
      content: sanitizeInput(m.content)
    }));

    // Build prompt
    const prompt = buildPrompt(sanitizedMessages, persona, auditMode, realTime);

    // Get provider order
    const enabledProviders = getEnabledProviders();
    let providerOrder = [];
    
    console.log('[GlyphBot LLM] Enabled providers:', enabledProviders.map(p => p.id));
    
    if (requestedProvider && requestedProvider !== 'AUTO' && !autoProvider) {
      // User explicitly selected a provider
      const requested = enabledProviders.find(p => p.id === requestedProvider);
      if (requested) {
        console.log('[GlyphBot LLM] Using explicit provider:', requestedProvider);
        providerOrder = [requested, ...enabledProviders.filter(p => p.id !== requestedProvider)];
      } else {
        console.log('[GlyphBot LLM] Requested provider not available, using default chain');
        providerOrder = enabledProviders;
      }
    } else {
      // Auto mode - use priority order
      console.log('[GlyphBot LLM] Using auto provider chain');
      providerOrder = enabledProviders;
    }

    // Try providers in order
    let result = null;
    let usedProvider = null;
    let lastError = null;

    for (const provider of providerOrder) {
      const providerStart = Date.now();
      
      try {
        console.log(`[GlyphBot] Trying: ${provider.id}`);
        result = await callProvider(provider.id, prompt);
        const latency = Date.now() - providerStart;
        
        updateStats(provider.id, true, latency);
        usedProvider = provider;
        
        console.log(`[GlyphBot] SUCCESS: ${provider.id} (${latency}ms)`);
        break;
        
      } catch (error) {
        const latency = Date.now() - providerStart;
        const errorMsg = error.message || String(error);
        
        updateStats(provider.id, false, latency, errorMsg);
        lastError = errorMsg;
        
        console.error(`[GlyphBot] FAILED: ${provider.id} - ${errorMsg}`);
        continue;
      }
    }

    // Last resort: Base44 broker
    if (!result) {
      try {
        console.log('[GlyphBot] Trying Base44 broker...');
        const brokerStart = Date.now();
        
        result = await base44.integrations.Core.InvokeLLM({
          prompt: prompt,
          add_context_from_internet: false
        });
        
        const latency = Date.now() - brokerStart;
        updateStats('BASE44_BROKER', true, latency);
        usedProvider = { id: 'BASE44_BROKER', label: 'Base44 Broker' };
        
        console.log(`[GlyphBot] SUCCESS: Base44 Broker (${latency}ms)`);
        
      } catch (brokerError) {
        console.error('[GlyphBot] Base44 broker failed:', brokerError.message);
        result = callLocalOSS(prompt);
        usedProvider = { id: 'LOCAL_OSS', label: 'Local Fallback' };
      }
    }

    const totalLatency = Date.now() - startTime;

    // Audit log (fire and forget)
    base44.entities.SystemAuditLog.create({
      event_type: 'GLYPHBOT_LLM_CALL',
      description: `LLM via ${usedProvider.label}`,
      actor_email: user.email,
      resource_id: 'glyphbot',
      metadata: { persona, provider: usedProvider.id, latencyMs: totalLatency },
      status: 'success'
    }).catch(() => {});

    // Mobile-optimized response (reduce payload size)
    const isMobileRequest = req.headers.get('user-agent')?.match(/Mobile|Android|iPhone/i);
    
    return Response.json({
      text: result,
      model: usedProvider.label,
      providerUsed: usedProvider.id,
      providerLabel: usedProvider.label,
      latencyMs: totalLatency,
      meta: isMobileRequest ? {
        providerUsed: usedProvider.id,
        availableProviders: getProviderChain().slice(0, 3)
      } : {
        providerUsed: usedProvider.id,
        providerLabel: usedProvider.label,
        availableProviders: getProviderChain(),
        providerStats: { ...providerStats }
      }
    });

  } catch (error) {
    console.error('[GlyphBot] Fatal error:', error);
    return Response.json({ 
      error: error.message,
      text: 'GlyphBot error. Please try again.',
      providerUsed: 'ERROR',
      meta: { providerStats: { ...providerStats } }
    }, { status: 500 });
  }
});