import React, { useState, useEffect } from 'react';
import { X, Lock, Volume2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

/**
 * 🎙️ VOICE CONSENT BANNER
 * GDPR/CCPA compliant consent for voice features
 * - Shows once per user
 * - Explains voice data usage
 * - Requires explicit opt-in
 * - Remembers preference in database
 */
export default function VoiceConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  // Load consent status on mount
  useEffect(() => {
    (async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (isAuth) {
          const user = await base44.auth.me();
          setCurrentUser(user);

          // Check if user has already consented
          const prefs = await base44.entities.UserPreferences.filter({
            created_by: user.email
          });

          if (prefs.length === 0 || !prefs[0].voiceConsentGiven) {
            setShowBanner(true);
          }
        }
      } catch (err) {
        console.error('[VoiceConsent] Load error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleConsent = async (consented) => {
    if (!currentUser) return;

    try {
      const prefs = await base44.entities.UserPreferences.filter({
        created_by: currentUser.email
      });

      const updateData = {
        voiceConsentGiven: consented,
        voiceConsentDate: new Date().toISOString(),
        voiceConsentVersion: 1
      };

      if (prefs.length > 0) {
        await base44.entities.UserPreferences.update(prefs[0].id, updateData);
      } else {
        await base44.entities.UserPreferences.create(updateData);
      }

      setShowBanner(false);
    } catch (err) {
      console.error('[VoiceConsent] Save error:', err);
    }
  };

  if (loading || !showBanner) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex items-end justify-center p-4 pointer-events-none">
      <div 
        className="bg-gradient-to-r from-slate-900 to-slate-950 border-2 border-blue-500/30 rounded-2xl shadow-2xl max-w-md w-full pointer-events-auto"
        style={{
          boxShadow: '0 0 40px rgba(37, 99, 235, 0.4), 0 0 80px rgba(37, 99, 235, 0.2)'
        }}
      >
        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600/30 flex items-center justify-center flex-shrink-0">
              <Volume2 className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white">Voice Features</h3>
              <p className="text-sm text-blue-200">We'd like your permission to enable voice</p>
            </div>
            <button
              onClick={() => handleConsent(false)}
              className="text-slate-400 hover:text-slate-200 transition-colors p-1"
              aria-label="Dismiss"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-3 text-sm text-slate-300">
            <p>
              🎙️ <strong>Voice Synthesis:</strong> Your text will be converted to natural-sounding audio using premium AI voices. No recordings are made.
            </p>
            <p>
              🔒 <strong>Your Privacy:</strong> Voice settings are encrypted and stored securely. We never share your voice data with third parties.
            </p>
            <p>
              ⏱️ <strong>Data Retention:</strong> Voice preferences are deleted after 30 days of account inactivity, per GDPR/CCPA.
            </p>
            <div className="flex items-start gap-2 pt-2 pb-1 border-t border-slate-700">
              <Lock className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-400">
                This feature is optional. You can disable it anytime in Settings.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => handleConsent(false)}
              className="flex-1 px-4 py-2.5 rounded-lg border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white text-sm font-semibold transition-all"
            >
              Not Now
            </button>
            <button
              onClick={() => handleConsent(true)}
              className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-sm font-semibold transition-all shadow-lg"
              style={{
                boxShadow: '0 0 15px rgba(37, 99, 235, 0.4)'
              }}
            >
              ✓ I Agree
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}