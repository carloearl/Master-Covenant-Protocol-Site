/**
 * POST /api/mfaVerifyLogin
 * Verify TOTP code or recovery code during login
 */

/**
 * POST /api/mfaVerifyLogin
 * 
 * PHASE C: MFA VERIFICATION ENDPOINT
 * 
 * This endpoint completes Factor 2 authentication (TOTP or recovery code).
 * Called after Base44 authentication (Factor 1) is complete.
 * 
 * Request body:
 * {
 *   "totpCode": "123456" | null,          // 6-digit TOTP from authenticator app
 *   "recoveryCode": "ABCD-EFGH" | null,   // One-time recovery code
 *   "trustDevice": boolean                 // Optional: register device as trusted for 30 days
 * }
 * 
 * Rules:
 * - Exactly ONE of totpCode or recoveryCode must be provided
 * - TOTP codes are verified using speakeasy with time window tolerance
 * - Recovery codes are hashed and compared against stored values
 * - Recovery codes are single-use and permanently invalidated after use
 * 
 * On success:
 * - Sets HTTP-only secure cookie: mfa_verified=true (24 hour expiry)
 * - Optionally registers device as trusted (if trustDevice=true)
 * - Frontend should re-call /api/mfa/session-status to get updated state
 * 
 * Security:
 * - Generic error messages (don't reveal if TOTP or recovery code was close)
 * - Rate limiting recommended (implement in future)
 * - Secrets are decrypted only in memory, never returned to client
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import { verifyTotpCode, verifyRecoveryCode } from './utils/totpService.js';
import { decrypt } from './utils/encryption.js';
import { generateDeviceFingerprint, extractDeviceName } from './utils/deviceFingerprint.js';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await req.json();
    const { totpCode, recoveryCode, trustDevice = false } = body;
    
    if (!totpCode && !recoveryCode) {
      return Response.json({ error: 'No verification code provided' }, { status: 400 });
    }
    
    // Get user MFA data
    const userEntities = await base44.entities.User.filter({ email: user.email });
    const userData = userEntities[0];
    
    if (!userData || !userData.mfaEnabled) {
      return Response.json({ error: 'MFA not enabled' }, { status: 400 });
    }
    
    let isValid = false;
    let usedRecoveryCodeIndex = -1;
    
    if (totpCode) {
      // Verify TOTP code
      const decryptedSecret = decrypt(userData.mfaSecretEncrypted);
      isValid = verifyTotpCode(decryptedSecret, totpCode);
    } else if (recoveryCode) {
      // Verify recovery code
      usedRecoveryCodeIndex = verifyRecoveryCode(
        recoveryCode, 
        userData.mfaRecoveryCodes || []
      );
      isValid = usedRecoveryCodeIndex !== -1;
      
      if (isValid) {
        // Remove used recovery code
        const updatedCodes = [...(userData.mfaRecoveryCodes || [])];
        updatedCodes.splice(usedRecoveryCodeIndex, 1);
        
        await base44.entities.User.update(userData.id, {
          mfaRecoveryCodes: updatedCodes
        });
      }
    }
    
    // CRITICAL: Generic error message - never reveal if code was close
    if (!isValid) {
      return Response.json({ error: 'Invalid verification code' }, { status: 401 });
    }
    
    // PHASE A: Set session-level MFA verification flag
    // Use HTTP-only secure cookie to prevent XSS attacks
    // Cookie expires in 24 hours or on browser session end
    const headers = new Headers();
    headers.set('Set-Cookie', 
      'mfa_verified=true; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400'
    );
    
    // OPTIONAL: Handle trusted device registration (30-day bypass)
    if (trustDevice) {
      const deviceId = generateDeviceFingerprint(req);
      const deviceName = extractDeviceName(req.headers.get('user-agent') || '');
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
      
      const trustedDevices = userData.trustedDevices || [];
      
      // Remove existing entry for this device (refresh trust)
      const filteredDevices = trustedDevices.filter(d => d.deviceId !== deviceId);
      
      // Add new trusted device
      filteredDevices.push({
        deviceId,
        deviceName,
        trustGrantedAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
        lastUsedAt: now.toISOString()
      });
      
      // Update user entity with new trusted device list
      await base44.entities.User.update(userData.id, {
        trustedDevices: filteredDevices
      });
    }
    
    // PHASE D: Return success
    // Frontend should immediately re-call /api/mfa/session-status
    // to get updated mfaVerified=true state
    return Response.json({ 
      success: true
    }, { headers });
    
  } catch (error) {
    console.error('[MFA Verify Login]', error);
    
    // PHASE E: Generic error handling
    // Never leak information about why verification failed
    return Response.json({ 
      error: 'Verification failed',
      success: false
    }, { status: 500 });
  }
});