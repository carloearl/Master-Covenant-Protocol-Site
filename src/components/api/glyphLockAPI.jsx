import { base44 } from '@/api/base44Client';

/**
 * GlyphLock Enterprise API Layer
 * Calls Supabase Edge Functions via Base44 proxy
 */

const callFunction = async (functionName, payload = {}) => {
  try {
    const user = await base44.auth.me();
    
    // Use Base44 proxy to call Supabase functions
    const response = await base44.functions.invoke('supabaseProxy', {
      functionName,
      payload: { ...payload, userId: user.id, userEmail: user.email }
    });

    return response.data;
  } catch (error) {
    console.error(`Error calling ${functionName}:`, error);
    throw error;
  }
};

export const glyphLockAPI = {
  // Health Check
  health: async () => {
    const response = await fetch(`${FUNCTIONS_URL}/health`);
    return await response.json();
  },

  // API Keys Management
  keys: {
    generate: async (name, env = 'DEV', service = 'GLYPH') => {
      return await callFunction('keys-generate', { name, env, service });
    },
    
    rotate: async (apiKeyId) => {
      return await callFunction('keys-rotate', { apiKeyId });
    },
  },

  // Stripe Integration
  stripe: {
    createCheckout: async (line_items, mode = 'payment') => {
      return await callFunction('stripe-checkout', { line_items, mode });
    },
  },

  // SDK Distribution
  sdk: {
    generate: async (language, version) => {
      return await callFunction('sdk-generate', { language, version });
    },
  },

  // CRM Integration
  crm: {
    sync: async (provider, payload) => {
      return await callFunction('crm-sync', { provider, payload });
    },
  },

  // Audit Logs
  logs: {
    list: async () => {
      return await callFunction('logs-list');
    },
  },

  // Admin Functions
  admin: {
    listUsers: async () => {
      return await callFunction('admin-users-list');
    },
    
    updateUser: async (userId, role, status, fullName) => {
      return await callFunction('admin-users-update', { userId, role, status, fullName });
    },
  },
};