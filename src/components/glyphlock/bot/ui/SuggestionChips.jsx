import React from 'react';
import { Sparkles, QrCode, Image, CreditCard, Shield, HelpCircle } from 'lucide-react';

const SUGGESTION_MAP = {
  qr: [
    { label: 'Try Image Lab', icon: Image, action: 'explore_image_lab' },
    { label: 'View Pricing', icon: CreditCard, action: 'view_pricing' },
    { label: 'Security Features', icon: Shield, action: 'security_info' }
  ],
  image: [
    { label: 'Create QR Code', icon: QrCode, action: 'explore_qr' },
    { label: 'View Gallery', icon: Image, action: 'view_gallery' },
    { label: 'Upgrade Plan', icon: CreditCard, action: 'view_pricing' }
  ],
  pricing: [
    { label: 'Start Free Trial', icon: Sparkles, action: 'start_trial' },
    { label: 'See Features', icon: HelpCircle, action: 'see_features' }
  ],
  security: [
    { label: 'Run Audit', icon: Shield, action: 'run_audit' },
    { label: 'QR Security', icon: QrCode, action: 'qr_security' }
  ],
  default: [
    { label: 'QR Studio', icon: QrCode, action: 'explore_qr' },
    { label: 'Image Lab', icon: Image, action: 'explore_image_lab' },
    { label: 'Get Help', icon: HelpCircle, action: 'get_help' }
  ]
};

const ACTION_PROMPTS = {
  explore_qr: "Tell me about QR Studio and how to create secure QR codes",
  explore_image_lab: "What can I do in Image Lab?",
  view_pricing: "Show me pricing plans and features",
  view_gallery: "How do I view my saved images?",
  security_info: "What security features does GlyphLock offer?",
  start_trial: "How do I start a free trial?",
  see_features: "What features are included in each plan?",
  run_audit: "How do I run a security audit?",
  qr_security: "How does QR code security work?",
  get_help: "What can you help me with?"
};

export default function SuggestionChips({ lastTopic, onSuggestionClick }) {
  const suggestions = SUGGESTION_MAP[lastTopic] || SUGGESTION_MAP.default;

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {suggestions.map((suggestion, idx) => {
        const Icon = suggestion.icon;
        return (
          <button
            key={idx}
            onClick={() => onSuggestionClick(ACTION_PROMPTS[suggestion.action] || suggestion.label)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-400/30 rounded-full text-xs text-blue-200 hover:text-white transition-all hover:scale-105"
          >
            <Icon className="w-3 h-3" />
            {suggestion.label}
          </button>
        );
      })}
    </div>
  );
}