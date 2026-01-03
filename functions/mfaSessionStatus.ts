/**
 * GET /api/mfa/session-status
 * Returns MFA status for the current authenticated user
 */

/**
 * GET /api/mfa/session-status
 * 
 * ROUTING CONTRACT FOR FRONTEND DEVELOPERS:
 * This endpoint is the single source of truth for MFA state.
 * 
 * Frontend routing logic:
 * 1. If authenticated = false → Call base44.auth.redirectToLogin()
 * 2. If mfaEnabled = false → Render app normally (no MFA required)
 * 3. If mfaEnabled = true AND mfaVerified = false → Show MFA challenge UI
 * 4. If mfaEnabled = true AND mfaVerified = true → Render app normally
 * 
 * MFA verification can be achieved via:
 * - Session cookie (mfa_verified=true) set after successful TOTP/recovery verification
 * - Trusted device mechanism (device fingerprint matches stored trusted device)
 * 
 * Session-level MFA state (cookie) expires:
 * - After 24 hours (Max-Age=86400)
 * - On explicit logout
 * - When browser session ends (if browser doesn't persist cookies)
 * 
 * Trusted device state persists for 30 days unless explicitly revoked.
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import { generateDeviceFingerprint, findTrustedDevice } from './utils/deviceFingerprint.js';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // PHASE A: Check Base44 authentication (Factor 1)
    let user;
    try {
      user = await base44.auth.me();
    } catch (authError) {
      // User is not authenticated with Base44
      return Response.json({
        authenticated: false,
        mfaEnabled: false,
        mfaVerified: false
      });
    }
    
    if (!user) {
      return Response.json({
        authenticated: false,
        mfaEnabled: false,
        mfaVerified: false
      });
    }
    
    // User is authenticated via Base44
    // Now check MFA settings from User entity
    const userEntity = await base44.entities.User.filter({ email: user.email });
    const userData = userEntity[0] || {};
    
    const mfaEnabled = userData.mfaEnabled || false;
    
    // PHASE B: If MFA is not enabled, user can access app
    if (!mfaEnabled) {
      return Response.json({
        authenticated: true,
        mfaEnabled: false,
        mfaVerified: true // Always true when MFA is disabled
      });
    }
    
    // PHASE C: MFA is enabled - check session-level verification
    
    // Check 1: Session cookie (set by /api/mfa/verify-login after successful TOTP/recovery)
    const mfaVerifiedCookie = req.headers.get('cookie')?.includes('mfa_verified=true');
    
    // Check 2: Trusted device mechanism (bypasses MFA for 30 days)
    const deviceId = generateDeviceFingerprint(req);
    const trustedDevice = findTrustedDevice(userData.trustedDevices, deviceId);
    
    // Update lastUsedAt for trusted device
    if (trustedDevice) {
      const updatedDevices = (userData.trustedDevices || []).map(d => 
        d.deviceId === deviceId 
          ? { ...d, lastUsedAt: new Date().toISOString() }
          : d
      );
      
      // Fire and forget - don't block response
      base44.entities.User.update(userData.id, { trustedDevices: updatedDevices })
        .catch(err => console.error('[MFA] Failed to update device lastUsedAt:', err));
    }
    
    const mfaVerified = mfaVerifiedCookie || !!trustedDevice;
    
    // PHASE D: Return deterministic contract
    return Response.json({
      authenticated: true,
      mfaEnabled: true,
      mfaVerified
    });
    
  } catch (error) {
    console.error('[MFA Session Status]', error);
    
    // On error, fail safely - require MFA verification
    return Response.json({ 
      authenticated: false,
      mfaEnabled: false,
      mfaVerified: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
});