import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import * as ed25519 from 'npm:@noble/ed25519@2.0.0';
import { encrypt } from '../utils/encryption.js';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    console.log('InitKeys User:', user);

    // Admin only
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const KID = 'glyphlock-platform-2025-01';

    // Check if key already exists
    const existing = await base44.entities.QRKeyRegistry.filter({ kid: KID });
    if (existing.length > 0) {
      return Response.json({ message: 'Platform key already exists', kid: KID });
    }

    // Generate Key Pair
    const privateKey = ed25519.utils.randomPrivateKey();
    const publicKey = await ed25519.getPublicKey(privateKey);
    
    // Convert to hex for storage/encryption
    const privateKeyHex = Buffer.from(privateKey).toString('hex');
    const publicKeyBase64 = Buffer.from(publicKey).toString('base64url');

    // Encrypt private key
    const encryptedPrivateKey = encrypt(privateKeyHex);

    // Store in Registry
    await base44.asServiceRole.entities.QRKeyRegistry.create({
      kid: KID,
      publicKey: publicKeyBase64,
      encryptedPrivateKey,
      keyType: 'platform'
    });

    // Log Action
    await base44.entities.SystemAuditLog.create({
      event_type: 'KEY_GENERATION',
      description: `Platform key generated: ${KID}`,
      actor_email: user.email,
      status: 'success',
      severity: 'high'
    });

    return Response.json({ success: true, kid: KID, message: 'Platform key initialized' });

  } catch (error) {
    console.error('Key Init Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});