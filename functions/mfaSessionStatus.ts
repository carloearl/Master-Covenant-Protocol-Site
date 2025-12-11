/**
 * GET /api/mfa/session-status
 * Returns MFA status for the current authenticated user
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get user entity to check MFA settings
    const userEntity = await base44.entities.User.filter({ email: user.email });
    const userData = userEntity[0] || {};
    
    // Check if MFA is verified for this session
    const mfaVerifiedCookie = req.headers.get('cookie')?.includes('mfa_verified=true');
    
    return Response.json({
      mfaEnabled: userData.mfaEnabled || false,
      mfaVerified: userData.mfaEnabled ? mfaVerifiedCookie : true,
      userEmail: user.email
    });
    
  } catch (error) {
    console.error('[MFA Session Status]', error);
    return Response.json({ 
      error: 'Failed to check MFA status',
      mfaEnabled: false,
      mfaVerified: false
    }, { status: 500 });
  }
});