/**
 * POST /api/mfa/verify-login
 * Verify TOTP code or recovery code during login
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
    const { totpCode, recoveryCode } = body;
    
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
    
    if (!isValid) {
      return Response.json({ error: 'Invalid verification code' }, { status: 400 });
    }
    
    // Set MFA verified cookie (HTTP-only, secure)
    const headers = new Headers();
    headers.set('Set-Cookie', 
      'mfa_verified=true; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400'
    );
    
    return Response.json({ 
      success: true,
      message: 'MFA verification successful'
    }, { headers });
    
  } catch (error) {
    console.error('[MFA Verify Login]', error);
    return Response.json({ error: 'Verification failed' }, { status: 500 });
  }
});