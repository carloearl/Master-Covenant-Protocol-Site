/**
 * POST /api/mfaVerifyLogin
 * Verify TOTP code or recovery code during login
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
    
    if (!user.mfaEnabled) {
      return Response.json({ error: 'MFA not enabled' }, { status: 400 });
    }
    
    let isValid = false;
    let usedRecoveryCodeIndex = -1;
    
    if (totpCode) {
      // Verify TOTP code
      if (user.mfaSecretEncrypted) {
        const decryptedSecret = decrypt(user.mfaSecretEncrypted);
        isValid = verifyTotpCode(decryptedSecret, totpCode);
      }
    } else if (recoveryCode) {
      // Verify recovery code
      usedRecoveryCodeIndex = verifyRecoveryCode(
        recoveryCode, 
        user.mfaRecoveryCodes || []
      );
      isValid = usedRecoveryCodeIndex !== -1;
      
      if (isValid) {
        // Remove used recovery code
        const updatedCodes = [...(user.mfaRecoveryCodes || [])];
        updatedCodes.splice(usedRecoveryCodeIndex, 1);
        
        await base44.auth.updateMe({
          mfaRecoveryCodes: updatedCodes
        });
      }
    }
    
    // CRITICAL: Generic error message
    if (!isValid) {
      return Response.json({ error: 'Invalid verification code' }, { status: 401 });
    }
    
    // PHASE A: Set session-level MFA verification flag
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
      
      const trustedDevices = user.trustedDevices || [];
      
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
      await base44.auth.updateMe({
        trustedDevices: filteredDevices
      });
    }
    
    // Return success
    return Response.json({ 
      success: true
    }, { headers });
    
  } catch (error) {
    console.error('[MFA Verify Login]', error);
    return Response.json({ 
      error: 'Verification failed',
      success: false
    }, { status: 500 });
  }
});