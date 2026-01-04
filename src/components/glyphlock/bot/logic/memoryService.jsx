import { base44 } from '@/api/base44Client';

// Topic detection keywords
const TOPIC_PATTERNS = {
  qr: /qr|code|scan|generate|studio/i,
  image: /image|photo|lab|generate|create|gallery/i,
  pricing: /price|cost|plan|subscription|payment|upgrade/i,
  security: /security|audit|safe|protect|encrypt/i,
  help: /help|support|contact|assist/i
};

/**
 * Detect topic from message text
 */
export function detectTopic(text) {
  for (const [topic, pattern] of Object.entries(TOPIC_PATTERNS)) {
    if (pattern.test(text)) return topic;
  }
  return null;
}

/**
 * Load user's GlyphBot memory
 */
export async function loadMemory(userEmail) {
  if (!userEmail) return null;
  
  try {
    const memories = await base44.entities.GlyphBotMemory.filter({ created_by: userEmail });
    return memories[0] || null;
  } catch (err) {
    console.error('[Memory] Load failed:', err);
    return null;
  }
}

/**
 * Save/update user's memory
 */
export async function saveMemory(userEmail, updates) {
  if (!userEmail) return;
  
  try {
    const existing = await loadMemory(userEmail);
    
    if (existing) {
      await base44.entities.GlyphBotMemory.update(existing.id, {
        ...updates,
        last_interaction: new Date().toISOString(),
        interaction_count: (existing.interaction_count || 0) + 1
      });
    } else {
      await base44.entities.GlyphBotMemory.create({
        ...updates,
        last_interaction: new Date().toISOString(),
        interaction_count: 1
      });
    }
  } catch (err) {
    console.error('[Memory] Save failed:', err);
  }
}

/**
 * Update topics discussed
 */
export async function trackTopic(userEmail, topic) {
  if (!userEmail || !topic) return;
  
  try {
    const memory = await loadMemory(userEmail);
    const topics = memory?.topics_discussed || [];
    
    // Keep last 10 topics, avoid duplicates in recent
    if (topics[topics.length - 1] !== topic) {
      const updatedTopics = [...topics, topic].slice(-10);
      await saveMemory(userEmail, { topics_discussed: updatedTopics });
    }
  } catch (err) {
    console.error('[Memory] Track topic failed:', err);
  }
}

/**
 * Get personalized greeting based on memory
 */
export function getPersonalizedGreeting(memory) {
  if (!memory) {
    return "Hi there! I'm GlyphBot Junior! 🌟 How can I help you today?";
  }
  
  const count = memory.interaction_count || 0;
  const lastTopic = memory.topics_discussed?.[memory.topics_discussed.length - 1];
  
  if (count === 0) {
    return "Hi there! I'm GlyphBot Junior! 🌟 How can I help you today?";
  } else if (count < 5) {
    return `Welcome back! 👋 Ready to help with anything GlyphLock!`;
  } else if (lastTopic) {
    const topicNames = { qr: 'QR codes', image: 'Image Lab', pricing: 'pricing', security: 'security' };
    return `Hey again! 🌟 Last time we chatted about ${topicNames[lastTopic] || 'GlyphLock'}. What's on your mind today?`;
  }
  
  return `Great to see you again! 💠 What can I help with?`;
}

/**
 * Load chat history from localStorage
 */
export function loadChatHistory(sessionId) {
  try {
    const stored = localStorage.getItem(`glyphbot_history_${sessionId}`);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Save chat history to localStorage
 */
export function saveChatHistory(sessionId, messages) {
  try {
    // Keep last 50 messages
    const toSave = messages.slice(-50);
    localStorage.setItem(`glyphbot_history_${sessionId}`, JSON.stringify(toSave));
  } catch (err) {
    console.error('[History] Save failed:', err);
  }
}

/**
 * Generate session ID
 */
export function getSessionId() {
  let sessionId = sessionStorage.getItem('glyphbot_session');
  if (!sessionId) {
    sessionId = `gb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('glyphbot_session', sessionId);
  }
  return sessionId;
}