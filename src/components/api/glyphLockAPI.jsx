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
  // Health & Status
  healthCheck: async () => {
    return callFunction('healthCheck');
  },

  // API Key Management
  generateAPIKey: async (name, environment = 'live') => {
    return callFunction('generateAPIKey', { name, environment });
  },

  listAPIKeys: async () => {
    return callFunction('listAPIKeys');
  },

  rotateAPIKey: async (keyId) => {
    return callFunction('rotateAPIKey', { keyId });
  },

  updateKeySettings: async (keyId, settings) => {
    return callFunction('updateKeySettings', { keyId, settings });
  },

  deleteAPIKey: async (keyId) => {
    return callFunction('deleteAPIKey', { keyId });
  },

  // User Management
  listUsers: async () => {
    return callFunction('listUsers');
  },

  updateUserRole: async (userId, role) => {
    return callFunction('updateUserRole', { userId, role });
  },

  // Logs & Monitoring
  getLogs: async (filter = 'all', limit = 50) => {
    return callFunction('getLogs', { filter, limit });
  },

  getAnalytics: async (timeRange = '7d') => {
    return callFunction('getAnalytics', { timeRange });
  },

  // Functions Management
  listFunctions: async () => {
    return callFunction('listFunctions');
  },

  deployFunction: async (functionData) => {
    return callFunction('deployFunction', functionData);
  },

  // Security
  runSecurityAudit: async () => {
    return callFunction('runSecurityAudit');
  },

  updateSecuritySettings: async (settings) => {
    return callFunction('updateSecuritySettings', settings);
  },

  // Stripe Payments
  stripe: {
    startCheckout: async (productId, priceId, mode) => {
      try {
        const response = await base44.functions.invoke('stripeCheckout', {
          productId,
          priceId,
          mode,
        });
        return response.data;
      } catch (error) {
        console.error('Error starting Stripe checkout:', error);
        throw error;
      }
    },
    
    pollPaymentStatus: async (sessionId) => {
      try {
        const response = await base44.functions.invoke('stripePoll', { sessionId });
        return response.data;
      } catch (error) {
        console.error('Error polling payment status:', error);
        throw error;
      }
    }
  },

  // Billing Management
  billing: {
    getStatus: async () => {
      return callFunction('getBillingStatus');
    },
    
    getHistory: async () => {
      return callFunction('getBillingHistory');
    },
    
    adminOverview: async () => {
      return callFunction('getAdminBillingOverview');
    },
    
    updateSubscription: async (priceId) => {
      return callFunction('updateSubscription', { priceId });
    },
    
    cancelSubscription: async () => {
      return callFunction('cancelSubscription');
    },
    
    downloadInvoice: async (invoiceId) => {
      return callFunction('downloadInvoice', { invoiceId });
    }
  }
};

export default glyphLockAPI;