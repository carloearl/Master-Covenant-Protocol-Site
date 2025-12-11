/**
 * RequireMFA Component
 * Wraps protected content and enforces MFA verification
 */

import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import MFAVerifyModal from './MFAVerifyModal';
import GlyphLoader from '@/components/GlyphLoader';

export default function RequireMFA({ children }) {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mfaStatus, setMfaStatus] = useState(null);
  const [showMFAChallenge, setShowMFAChallenge] = useState(false);

  useEffect(() => {
    checkAuthAndMFA();
  }, []);

  const checkAuthAndMFA = async () => {
    setIsChecking(true);

    try {
      // Check Base44 authentication first
      const isAuth = await base44.auth.isAuthenticated();
      
      if (!isAuth) {
        setIsAuthenticated(false);
        base44.auth.redirectToLogin();
        return;
      }

      setIsAuthenticated(true);

      // Check MFA status
      const response = await base44.functions.invoke('mfaSessionStatus', {});
      setMfaStatus(response.data);

      // If MFA is enabled but not verified, show challenge
      if (response.data.mfaEnabled && !response.data.mfaVerified) {
        setShowMFAChallenge(true);
      }
    } catch (error) {
      console.error('[RequireMFA] Check failed:', error);
      // On error, allow access but log the issue
      setMfaStatus({ mfaEnabled: false, mfaVerified: true });
    } finally {
      setIsChecking(false);
    }
  };

  const handleMFASuccess = async () => {
    setShowMFAChallenge(false);
    // Refresh MFA status
    await checkAuthAndMFA();
  };

  if (isChecking) {
    return <GlyphLoader text="Verifying security..." />;
  }

  if (!isAuthenticated) {
    return <GlyphLoader text="Redirecting to login..." />;
  }

  if (showMFAChallenge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 flex items-center justify-center">
        <MFAVerifyModal
          isOpen={true}
          onSuccess={handleMFASuccess}
        />
      </div>
    );
  }

  return <>{children}</>;
}