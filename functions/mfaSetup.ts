/**
 * POST /api/mfa/setup
 * Initialize MFA setup - generate TOTP secret and QR code
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import { generateTotpSecret, generateQrCodeDataUrl } from './utils/totpService.js';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if MFA is already enabled
    const userEntity = await base44.entities.User.filter({ email: user.email });
    const userData = userEntity[0] || {};
    
    if (userData.mfaEnabled) {
      return Response.json({ 
        error: 'MFA is already enabled. Disable it first to reconfigure.' 
      }, { status: 400 });
    }
    
    // Generate TOTP secret
    const { secret, otpauthUrl } = generateTotpSecret(user.email);
    
    // Generate QR code
    const qrCodeDataUrl = await generateQrCodeDataUrl(otpauthUrl);
    
    // Store secret in session temporarily (don't persist yet)
    // For simplicity, we'll include it in the response and require it in verify-setup
    // In production, consider using a signed JWT or server-side session
    
    return Response.json({
      qrCodeDataUrl,
      manualKey: secret,
      tempSecret: secret // Client will send this back during verification
    });
    
  } catch (error) {
    console.error('[MFA Setup]', error);
    return Response.json({ error: 'Failed to initialize MFA setup' }, { status: 500 });
  }
});