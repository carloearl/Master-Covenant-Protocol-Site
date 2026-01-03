/**
 * POST /api/mfa/setup
 * Initialize MFA setup - generate TOTP secret and QR code
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import speakeasy from 'npm:speakeasy@2.0.0';
import QRCode from 'npm:qrcode@1.5.3';

const ISSUER = 'GlyphLock';

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
    const secret = speakeasy.generateSecret({
      name: `${ISSUER} (${user.email})`,
      issuer: ISSUER,
      length: 32
    });
    
    // Generate QR code
    const qrCodeDataUrl = await QRCode.toDataURL(secret.otpauth_url, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 300,
      margin: 2
    });
    
    return Response.json({
      qrCodeDataUrl,
      manualKey: secret.base32,
      tempSecret: secret.base32
    });
    
  } catch (error) {
    console.error('[MFA Setup]', error);
    return Response.json({ error: 'Failed to initialize MFA setup' }, { status: 500 });
  }
});