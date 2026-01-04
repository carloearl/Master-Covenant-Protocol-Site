/**
 * Context Service for GlyphBot
 * Provides context-aware responses based on current page and user activity
 */

import FAQ_MASTER_DATA from "@/components/content/faqMasterData";

// System status context
export const SYSTEM_STATUS_CONTEXT = `
SYSTEM STATUS KNOWLEDGE:
GlyphLock monitors these infrastructure components:
- API Gateway: Handles all external API requests
- Database (MongoDB): Primary data storage
- Edge Functions: Serverless compute for backend logic
- Storage: File and asset storage

Security Posture (SIE):
- Active Scans: Automated security scanning
- RLS Policies: Row-level security enforcement
- Web Crypto API: Browser-based cryptography

Feature Analysis tracks:
- QR Generation: Canvas rendering with customization
- Steganography: AES-256 encryption in images
- Security Architecture: Middleware, RLS, Service Role

If user asks about system status, direct them to /SystemStatus page for live data.
`;

// Roadmap context
export const ROADMAP_CONTEXT = `
ROADMAP KNOWLEDGE:
GlyphLock Enforcement Roadmap (2025-2030):

COMPLETED (Q2-Q4 2025):
- Master Covenant Patent Filing (USPTO 18/584,961)
- SHA-256 Hash Verification System
- Timestamped Interaction Logging
- Chain-of-Custody Documentation
- Credentialing Verification Framework

IN PROGRESS (Q1 2026):
- Operator Network Growth (Enterprise/Finance/Tech)
- Comprehensive Exposure Registry Launch
- Formal Covenant Declaration Protocols

PLANNED (Q2-Q4 2026):
- First Litigation Filings
- Regulatory Evidence Submission
- AI Governance Standards Body Engagement
- International Enforcement Actions

VISION (2027-2030):
- Global Credentialed Operator Network
- Master Covenant Framework Universal Adoption

Key message: "The question is not whether binding exists—the question is the timeline of universal recognition."
`;

// Page-specific proactive suggestions
export const PAGE_SUGGESTIONS = {
  "Home": [
    "Would you like to learn about our verification modules?",
    "Ready to start a protocol verification engagement?",
    "Curious about how the Master Covenant works?"
  ],
  "FAQ": [
    "I can answer questions about protocol authority governance",
    "Want me to explain credentialed access in detail?",
    "Need help understanding verification modules?"
  ],
  "Roadmap": [
    "I can explain any milestone in detail",
    "Want to know about current enforcement progress?",
    "Curious about the 2027-2030 vision?"
  ],
  "SystemStatus": [
    "I can explain what each status indicator means",
    "Need help understanding the security posture?",
    "Want to know about recent system changes?"
  ],
  "Consultation": [
    "I can explain the verification engagement process",
    "Have questions about credential requirements?",
    "Want to understand pricing structure?"
  ],
  "Qr": [
    "Need help with QR code customization?",
    "Want to learn about steganographic embedding?",
    "Questions about security features?"
  ],
  "image-lab": [
    "Need help with image generation?",
    "Want to add interactive hotspots?",
    "Questions about cryptographic locking?"
  ],
  "GlyphBot": [
    "I'm the full GlyphBot experience!",
    "Try asking about security audits",
    "I can help with code analysis"
  ],
  "CommandCenter": [
    "Need help navigating your dashboard?",
    "Want to manage your settings?",
    "Questions about your account?"
  ],
  "UserSettings": [
    "Need help with notification preferences?",
    "Want to generate an API key?",
    "Questions about privacy settings?"
  ]
};

// Build FAQ context string
export const buildFaqContext = () => {
  return FAQ_MASTER_DATA.map(item => 
    `Q: ${item.q}\nCategory: ${item.category}\nA: ${item.a.join(' ')}`
  ).join('\n\n');
};

// Get context based on current page
export const getPageContext = (pageName) => {
  const contexts = {
    "SystemStatus": SYSTEM_STATUS_CONTEXT,
    "Roadmap": ROADMAP_CONTEXT,
    "FAQ": `FAQ KNOWLEDGE:\n${buildFaqContext()}`,
  };
  
  return contexts[pageName] || "";
};

// Get proactive suggestion based on page
export const getProactiveSuggestion = (pageName, recentTopics = []) => {
  const suggestions = PAGE_SUGGESTIONS[pageName] || PAGE_SUGGESTIONS["Home"];
  
  // Filter out suggestions related to recently discussed topics
  const filtered = suggestions.filter(s => {
    const lowerS = s.toLowerCase();
    return !recentTopics.some(t => lowerS.includes(t.toLowerCase()));
  });
  
  return filtered.length > 0 
    ? filtered[Math.floor(Math.random() * filtered.length)]
    : suggestions[0];
};

// Detect if user is asking about a specific feature/page
export const detectIntentRedirect = (message) => {
  const intents = [
    { patterns: ["system status", "server status", "is it down", "uptime"], page: "SystemStatus" },
    { patterns: ["roadmap", "timeline", "when will", "planned features"], page: "Roadmap" },
    { patterns: ["faq", "frequently asked", "common questions"], page: "FAQ" },
    { patterns: ["settings", "preferences", "notifications", "api key"], page: "UserSettings" },
    { patterns: ["qr code", "generate qr", "qr studio"], page: "Qr" },
    { patterns: ["image", "generate image", "hotspot", "image lab"], page: "image-lab" },
    { patterns: ["consultation", "verify", "credential", "engagement"], page: "Consultation" },
    { patterns: ["pricing", "cost", "how much", "subscription"], page: "Consultation" },
    { patterns: ["security", "mfa", "two factor", "2fa"], page: "AccountSecurity" },
  ];
  
  const lowerMessage = message.toLowerCase();
  
  for (const intent of intents) {
    if (intent.patterns.some(p => lowerMessage.includes(p))) {
      return intent.page;
    }
  }
  
  return null;
};

// Build comprehensive system prompt with context
export const buildContextAwarePrompt = (baseprompt, currentPage, recentActivity = []) => {
  const pageContext = getPageContext(currentPage);
  const faqContext = buildFaqContext();
  
  return `${baseprompt}

CURRENT USER CONTEXT:
- User is viewing: ${currentPage || 'Unknown page'}
- Recent activity: ${recentActivity.join(', ') || 'None tracked'}

${pageContext}

FAQ KNOWLEDGE BASE (for answering questions):
${faqContext}

${ROADMAP_CONTEXT}

${SYSTEM_STATUS_CONTEXT}

PROACTIVE BEHAVIOR:
- If user seems lost, offer navigation help
- If user asks about features, explain and offer to redirect
- After answering, suggest relevant next steps
- Reference specific pages when appropriate (e.g., "You can see this on the /Roadmap page")
`;
};

export default {
  buildFaqContext,
  getPageContext,
  getProactiveSuggestion,
  detectIntentRedirect,
  buildContextAwarePrompt,
  PAGE_SUGGESTIONS,
  SYSTEM_STATUS_CONTEXT,
  ROADMAP_CONTEXT
};