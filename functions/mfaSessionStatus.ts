/**
 * GET /api/mfa/session-status
 * Returns MFA status for the current authenticated user
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
    // Check MFA settings from User object (custom fields are included in auth.me())
    const mfaEnabled = user.mfaEnabled || false;
    
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
    const trustedDevice = findTrustedDevice(user.trustedDevices || [], deviceId);
    
    // Update lastUsedAt for trusted device
    if (trustedDevice) {
      const updatedDevices = (user.trustedDevices || []).map(d => 
        d.deviceId === deviceId 
          ? { ...d, lastUsedAt: new Date().toISOString() }
          : d
      );
      
      // Fire and forget - don't block response
      base44.auth.updateMe({ trustedDevices: updatedDevices })
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