/**
 * POST /api/mfa/verify-setup
 * Verify TOTP code and enable MFA
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import { verifyTotpCode, generateRecoveryCodes } from './utils/totpService.js';
import { encrypt } from './utils/encryption.js';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await req.json();
    const { code, tempSecret } = body;
    
    if (!code || !tempSecret) {
      return Response.json({ error: 'Missing code or secret' }, { status: 400 });
    }
    
    // Verify the TOTP code
    const isValid = verifyTotpCode(tempSecret, code);
    
    if (!isValid) {
      return Response.json({ error: 'Invalid verification code' }, { status: 400 });
    }
    
    // Generate recovery codes
    const { rawCodes, hashedCodes } = generateRecoveryCodes();
    
    // Encrypt the TOTP secret
    const encryptedSecret = encrypt(tempSecret);
    
    // Update user using auth.updateMe()
    // This is the preferred way to update user attributes
    await base44.auth.updateMe({
      mfaEnabled: true,
      mfaSecretEncrypted: encryptedSecret,
      mfaRecoveryCodes: hashedCodes
    });
    
    // Return recovery codes (only time they're shown in plain text)
    return Response.json({
      success: true,
      recoveryCodes: rawCodes
    });
    
  } catch (error) {
    console.error('[MFA Verify Setup]', error);
    return Response.json({ error: 'Failed to enable MFA' }, { status: 500 });
  }
});