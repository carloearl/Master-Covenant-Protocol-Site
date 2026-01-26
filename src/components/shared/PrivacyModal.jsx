import React, { useState } from 'react';
import { X, Camera, HardDrive, Cookie, Shield, AlertCircle, Lock } from 'lucide-react';

/**
 * 🔒 PRIVACY MODAL
 * Clean, SVG-based privacy disclosure with user-first messaging
 * Shows privacy permissions, data handling, and consent options
 */
export default function PrivacyModal({ isOpen, onClose }) {
  const [expanded, setExpanded] = useState(null);

  if (!isOpen) return null;

  const sections = [
    {
      id: 'camera',
      title: 'Camera Use',
      icon: Camera,
      description: 'Used only for scanning. Nothing is saved unless you choose to save it.',
      color: 'from-cyan-500/20 to-cyan-500/5'
    },
    {
      id: 'images',
      title: 'Image Uploads & Gallery',
      icon: HardDrive,
      description: 'You can upload images for processing. The system only stores images you save to your gallery.',
      color: 'from-purple-500/20 to-purple-500/5'
    },
    {
      id: 'memory',
      title: 'Memory & Preferences',
      icon: Lock,
      description: 'Your preferences and saved items stay in your account until you remove them.',
      color: 'from-indigo-500/20 to-indigo-500/5'
    },
    {
      id: 'scanner',
      title: 'Scanner Data',
      icon: AlertCircle,
      description: 'Processed on your device. Saved only if you choose to keep it.',
      color: 'from-amber-500/20 to-amber-500/5'
    },
    {
      id: 'cookies',
      title: 'Cookies & Headers',
      icon: Cookie,
      description: 'Only what\'s needed for login and security. No tracking.',
      color: 'from-rose-500/20 to-rose-500/5'
    },
    {
      id: 'privacy',
      title: 'Your Privacy',
      icon: Shield,
      description: 'Everything stays encrypted and under your control.',
      color: 'from-emerald-500/20 to-emerald-500/5'
    }
  ];

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-2 border-purple-500/30 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-transparent">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/30 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Privacy & Data</h2>
                <p className="text-sm text-slate-400 mt-1">How we handle your information</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all p-2 rounded-lg"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-3">
          {sections.map((section, idx) => {
            const IconComponent = section.icon;
            const isExpanded = expanded === section.id;

            return (
              <div
                key={section.id}
                className={`border-2 rounded-xl transition-all duration-300 ${
                  isExpanded
                    ? 'border-cyan-400/50 bg-gradient-to-r from-cyan-500/15 to-transparent'
                    : 'border-slate-700/50 bg-gradient-to-r ' + section.color + ' hover:border-slate-600'
                }`}
              >
                <button
                  onClick={() => setExpanded(isExpanded ? null : section.id)}
                  className="w-full px-5 py-4 flex items-center gap-4 text-left"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                    isExpanded
                      ? 'bg-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                      : 'bg-slate-800/60'
                  }`}>
                    <IconComponent className={`w-5 h-5 transition-colors ${
                      isExpanded ? 'text-cyan-300' : 'text-slate-400'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold transition-colors ${
                      isExpanded ? 'text-cyan-300' : 'text-white'
                    }`}>
                      {section.title}
                    </h3>
                  </div>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    isExpanded ? 'bg-cyan-500/30 rotate-180' : 'bg-slate-800/60'
                  }`}>
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-4 border-t border-cyan-400/30">
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {section.description}
                    </p>
                  </div>
                )}
              </div>
            );
          })}

          {/* Bottom Trust Note */}
          <div className="mt-6 p-4 rounded-xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-transparent">
            <div className="flex gap-3">
              <Lock className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-slate-300">
                <p className="font-semibold text-emerald-300 mb-1">You're in control</p>
                <p>All data is encrypted. You can request deletion anytime in Settings.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-purple-500/20 bg-gradient-to-r from-transparent to-purple-500/5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-lg border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white font-semibold transition-all"
          >
            Close
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold transition-all shadow-lg shadow-cyan-500/30"
          >
            ✓ I Understand
          </button>
        </div>
      </div>
    </div>
  );
}