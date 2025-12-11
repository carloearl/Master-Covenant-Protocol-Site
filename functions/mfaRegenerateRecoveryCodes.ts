/**
 * POST /api/mfa/recovery-codes/regenerate
 * Regenerate recovery codes (requires valid TOTP code)
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import { verifyTotpCode, generateRecoveryCodes } from './utils/totpService.js';
import { decrypt } from './utils/encryption.js';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await req.json();
    const { totpCode } = body;
    
    if (!totpCode) {
      return Response.json({ error: 'TOTP code required' }, { status: 400 });
    }
    
    // Get user MFA data
    const userEntities = await base44.entities.User.filter({ email: user.email });
    const userData = userEntities[0];
    
    if (!userData || !userData.mfaEnabled) {
      return Response.json({ error: 'MFA not enabled' }, { status: 400 });
    }
    
    // Verify TOTP code
    const decryptedSecret = decrypt(userData.mfaSecretEncrypted);
    const isValid = verifyTotpCode(decryptedSecret, totpCode);
    
    if (!isValid) {
      return Response.json({ error: 'Invalid TOTP code' }, { status: 400 });
    }
    
    // Generate new recovery codes
    const { rawCodes, hashedCodes } = generateRecoveryCodes();
    
    // Update user entity
    await base44.entities.User.update(userData.id, {
      mfaRecoveryCodes: hashedCodes
    });
    
    return Response.json({
      success: true,
      recoveryCodes: rawCodes
    });
    
  } catch (error) {
    console.error('[MFA Regenerate Codes]', error);
    return Response.json({ error: 'Failed to regenerate recovery codes' }, { status: 500 });
  }
});