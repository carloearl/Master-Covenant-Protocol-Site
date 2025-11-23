/**
 * LLM Broker Client - Unified LLM Access Layer
 * 
 * ALL LLM calls MUST route through base44.integrations.Core.InvokeLLM
 * This ensures:
 * - Automatic model selection and fallbacks
 * - Centralized authentication
 * - Consistent error handling
 * - Rate limiting and safety filters
 * - Cost optimization
 * - Audit logging
 */

import { base44 } from "@/api/base44Client";

/**
 * Retry with exponential backoff
 */
async function retryWithBackoff(fn, maxRetries = 3, initialDelay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const delay = initialDelay * Math.pow(2, i);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

/**
 * Central LLM call wrapper
 * @param {Object} options - LLM options
 * @param {string} options.prompt - The prompt text
 * @param {Array} options.messages - Conversation messages [{role, content}]
 * @param {boolean} options.useInternet - Add context from internet search
 * @param {Array} options.fileUrls - File URLs for additional context
 * @param {Object} options.jsonSchema - Response JSON schema for structured output
 * @param {string} options.systemPrompt - System prompt override
 * @param {boolean} options.retry - Enable retry with backoff (default: true)
 * @returns {Promise<string|Object>} LLM response
 */
export async function invokeLLM(options = {}) {
  const {
    prompt,
    messages,
    useInternet = false,
    fileUrls = null,
    jsonSchema = null,
    systemPrompt = null,
    retry = true
  } = options;

  // Build final prompt
  let finalPrompt = "";
  
  if (systemPrompt) {
    finalPrompt += `${systemPrompt}\n\n`;
  }
  
  if (messages && Array.isArray(messages)) {
    finalPrompt += messages.map(m => 
      `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`
    ).join('\n\n');
  } else if (prompt) {
    finalPrompt += prompt;
  }

  if (!finalPrompt.trim()) {
    throw new Error("No prompt or messages provided");
  }

  // Call Base44 LLM broker
  const params = {
    prompt: finalPrompt,
    add_context_from_internet: useInternet
  };

  if (fileUrls) {
    params.file_urls = fileUrls;
  }

  if (jsonSchema) {
    params.response_json_schema = jsonSchema;
  }

  const callLLM = async () => {
    try {
      return await base44.integrations.Core.InvokeLLM(params);
    } catch (error) {
      const errorMsg = error?.message || String(error);
      throw new Error(`LLM broker error: ${errorMsg}`);
    }
  };

  if (retry) {
    return await retryWithBackoff(callLLM, 3, 1000);
  } else {
    return await callLLM();
  }
}

/**
 * Chat-style LLM call with conversation history
 */
export async function chatLLM(messages, systemPrompt = null, options = {}) {
  return invokeLLM({
    messages,
    systemPrompt,
    ...options
  });
}

/**
 * Simple prompt-based LLM call
 */
export async function promptLLM(prompt, useInternet = false, options = {}) {
  return invokeLLM({
    prompt,
    useInternet,
    ...options
  });
}

/**
 * LLM call with structured JSON output
 */
export async function structuredLLM(prompt, jsonSchema, options = {}) {
  return invokeLLM({
    prompt,
    jsonSchema,
    ...options
  });
}

/**
 * LLM call with file analysis
 */
export async function analyzeLLM(prompt, fileUrls, options = {}) {
  return invokeLLM({
    prompt,
    fileUrls,
    ...options
  });
}

/**
 * Security-focused LLM call with strict validation
 */
export async function securityLLM(prompt, options = {}) {
  const securityPrompt = `[SECURITY ANALYSIS MODE]
You are a cybersecurity expert. Provide accurate, professional security analysis.
Follow Master Covenant security principles: zero trust, defense in depth, least privilege.

${prompt}`;

  return invokeLLM({
    prompt: securityPrompt,
    useInternet: options.useInternet || false,
    ...options
  });
}

// Export Base44 client for direct access when needed
export { base44 };