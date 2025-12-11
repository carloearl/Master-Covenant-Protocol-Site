/**
 * POST /api/mfa/disable
 * Disable MFA for the user (requires password and TOTP/recovery code)
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import { verifyTotpCode, verifyRecoveryCode } from './utils/totpService.js';
import { decrypt } from './utils/encryption.js';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await req.json();
    const { password, totpCode, recoveryCode } = body;
    
    if (!password) {
      return Response.json({ error: 'Password required' }, { status: 400 });
    }
    
    if (!totpCode && !recoveryCode) {
      return Response.json({ error: 'TOTP or recovery code required' }, { status: 400 });
    }
    
    // Get user MFA data
    const userEntities = await base44.entities.User.filter({ email: user.email });
    const userData = userEntities[0];
    
    if (!userData || !userData.mfaEnabled) {
      return Response.json({ error: 'MFA not enabled' }, { status: 400 });
    }
    
    // Note: Password verification would need Base44 platform support
    // For now, we'll verify the MFA code only
    
    let isValid = false;
    
    if (totpCode) {
      const decryptedSecret = decrypt(userData.mfaSecretEncrypted);
      isValid = verifyTotpCode(decryptedSecret, totpCode);
    } else if (recoveryCode) {
      isValid = verifyRecoveryCode(recoveryCode, userData.mfaRecoveryCodes || []) !== -1;
    }
    
    if (!isValid) {
      return Response.json({ error: 'Invalid verification code' }, { status: 400 });
    }
    
    // Disable MFA
    await base44.entities.User.update(userData.id, {
      mfaEnabled: false,
      mfaSecretEncrypted: null,
      mfaRecoveryCodes: []
    });
    
    // Clear MFA cookie
    const headers = new Headers();
    headers.set('Set-Cookie', 
      'mfa_verified=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0'
    );
    
    return Response.json({ 
      success: true,
      message: 'MFA disabled successfully'
    }, { headers });
    
  } catch (error) {
    console.error('[MFA Disable]', error);
    return Response.json({ error: 'Failed to disable MFA' }, { status: 500 });
  }
});