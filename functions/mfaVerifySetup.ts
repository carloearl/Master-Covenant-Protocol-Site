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

    // Rate Limiting for Setup (10 attempts in 15 minutes)
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const recentFailures = await base44.entities.SystemAuditLog.filter({
      actor_email: user.email,
      event_type: 'MFA_SETUP_FAILURE',
      created_date: { $gte: fifteenMinutesAgo }
    });

    if (recentFailures.length >= 10) {
      await base44.entities.SystemAuditLog.create({
        event_type: 'MFA_RATE_LIMIT_HIT',
        description: 'User exceeded MFA setup verification attempts',
        actor_email: user.email,
        ip_address: req.headers.get('x-forwarded-for') || 'unknown',
        status: 'security_action',
        severity: 'low'
      });
      return Response.json({ error: 'Too many failed attempts. Please try again later.' }, { status: 429 });
    }
    
    // Verify the TOTP code
    const isValid = verifyTotpCode(tempSecret, code);
    
    if (!isValid) {
      // Audit Log Failure
      await base44.entities.SystemAuditLog.create({
        event_type: 'MFA_SETUP_FAILURE',
        description: 'Failed MFA setup verification',
        actor_email: user.email,
        ip_address: req.headers.get('x-forwarded-for') || 'unknown',
        status: 'failure',
        severity: 'low'
      });
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

    // Audit Log
    await base44.entities.SystemAuditLog.create({
      event_type: 'MFA_ENABLED',
      description: 'MFA enabled for user',
      actor_email: user.email,
      ip_address: req.headers.get('x-forwarded-for') || 'unknown',
      status: 'success',
      severity: 'medium'
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