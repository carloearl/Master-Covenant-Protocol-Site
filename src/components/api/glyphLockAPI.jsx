import { base44 } from '@/api/base44Client';
import { FUNCTIONS_URL } from './supabaseClient';

/**
 * GlyphLock Enterprise API Layer
 * All backend functions with Base44 authentication
 */

const callFunction = async (functionName, payload = {}) => {
  const user = await base44.auth.me();
  const token = localStorage.getItem('base44_token');
  
  const response = await fetch(`${FUNCTIONS_URL}/${functionName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API call failed');
  }

  return await response.json();
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