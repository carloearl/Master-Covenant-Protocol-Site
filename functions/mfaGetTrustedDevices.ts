/**
 * GET /api/mfa/trusted-devices
 * Get list of user's trusted devices
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userEntities = await base44.entities.User.filter({ email: user.email });
    const userData = userEntities[0];
    
    if (!userData) {
      return Response.json({ trustedDevices: [] });
    }
    
    // Filter out expired devices and clean sensitive data
    const now = new Date();
    const activeTrustedDevices = (userData.trustedDevices || [])
      .filter(d => new Date(d.expiresAt) > now)
      .map(d => ({
        deviceName: d.deviceName,
        trustGrantedAt: d.trustGrantedAt,
        expiresAt: d.expiresAt,
        lastUsedAt: d.lastUsedAt,
        deviceId: d.deviceId.slice(0, 8) + '...' // Show partial ID for identification
      }));
    
    return Response.json({ trustedDevices: activeTrustedDevices });
    
  } catch (error) {
    console.error('[MFA Get Trusted Devices]', error);
    return Response.json({ error: 'Failed to get trusted devices' }, { status: 500 });
  }
});