import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import * as ed25519 from 'npm:@noble/ed25519@2.0.0';
import canonicalize from 'npm:canonicalize@1.0.8';
import QRCode from 'npm:qrcode@1.5.3';
import { decrypt } from '../utils/encryption.js';
import { randomBytes } from 'node:crypto';
import { Buffer } from 'node:buffer';

const QR_TYPE_POLICIES = {
  voucher: { maxTTL: 86400, allowedClaimKeys: ['amount', 'currency', 'merchantId'], scanMode: 'single_use' },
  access: { maxTTL: 3600, allowedClaimKeys: ['resource', 'permissions', 'audience'], scanMode: 'time_window' },
  identity: { maxTTL: 300, allowedClaimKeys: ['userId', 'email', 'displayName'], scanMode: 'reusable' },
  artifact: { maxTTL: 2592000, allowedClaimKeys: ['assetId', 'traceId', 'watermarkHash'], scanMode: 'reusable' },
  admin: { maxTTL: 300, allowedClaimKeys: ['action', 'targetUserId', 'reason'], scanMode: 'single_use' }
};

const QR_SIGNATURE_CONTEXT = 'GlyphLock QR v1';

async function signQRPayload(payload, privateKeyHex) {
  const { sig, ...unsignedPayload } = payload;
  const canonical = canonicalize(unsignedPayload);
  
  const contextBytes = new TextEncoder().encode(QR_SIGNATURE_CONTEXT);
  const payloadBytes = new TextEncoder().encode(canonical);
  
  const combined = new Uint8Array(contextBytes.length + payloadBytes.length);
  combined.set(contextBytes, 0);
  combined.set(payloadBytes, contextBytes.length);
  
  const signatureBytes = await ed25519.sign(combined, privateKeyHex);
  return { ...payload, sig: Buffer.from(signatureBytes).toString('base64url') };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized', debug: 'No user found' }, { status: 401 });
    }

    const { type, claims, ttl } = await req.json();

    // 1. Validation
    if (!QR_TYPE_POLICIES[type]) {
      return Response.json({ error: 'Invalid QR type' }, { status: 400 });
    }

    const policy = QR_TYPE_POLICIES[type];
    const invalidKeys = Object.keys(claims).filter(k => !policy.allowedClaimKeys.includes(k));
    if (invalidKeys.length > 0) {
      return Response.json({ error: 'Invalid claim keys', invalidKeys }, { status: 400 });
    }

    // 2. Get Signing Key
    const keys = await base44.asServiceRole.entities.QRKeyRegistry.filter({ keyType: 'platform', revokedAt: null });
    // Sort descending by created_date to get latest (if multiple)
    keys.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    const platformKey = keys[0];

    if (!platformKey) {
      return Response.json({ error: 'No active signing key found' }, { status: 500 });
    }

    // 3. Construct Payload
    const qrId = crypto.randomUUID();
    const now = Math.floor(Date.now() / 1000);
    const nonce = randomBytes(12).toString('hex');
    const expiration = now + Math.min(ttl || policy.maxTTL, policy.maxTTL);

    const payload = {
      ver: '1',
      qrId,
      kid: platformKey.kid,
      iat: now,
      exp: expiration,
      nonce,
      type,
      claims
    };

    // 4. Sign Payload
    const privateKeyHex = decrypt(platformKey.encryptedPrivateKey);
    const signedPayload = await signQRPayload(payload, privateKeyHex);
    const qrDataString = JSON.stringify(signedPayload);

    if (qrDataString.length > 1500) {
      return Response.json({ error: 'Payload too large' }, { status: 400 });
    }

    // 5. Generate QR Image
    const qrImageDataURL = await QRCode.toDataURL(qrDataString, { errorCorrectionLevel: 'H', width: 512 });

    // 6. Store Record
    await base44.entities.QRCode.create({
      qrId: qrId,
      userId: user.email, // using email as ID since user.id isn't always available in filter
      kid: platformKey.kid,
      type,
      encodedData: qrDataString,
      expiresAt: new Date(expiration * 1000).toISOString(),
      scanMode: policy.scanMode
    });

    // 7. Audit Log
    await base44.entities.SystemAuditLog.create({
      event_type: 'QR_GENERATED',
      description: `QR Code generated: ${type}`,
      actor_email: user.email,
      status: 'success',
      severity: 'low',
      resource_id: qrId
    });

    return Response.json({ qrId, qrImageDataURL, signedPayload });

  } catch (error) {
    console.error('QR Generate Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});