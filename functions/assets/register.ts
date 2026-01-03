import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import * as ed25519 from 'npm:@noble/ed25519@2.0.0';
import { createHash } from 'node:crypto';
import { decrypt } from '../utils/encryption.js';
import { Buffer } from 'node:buffer';

const ASSET_SIGNATURE_CONTEXT = 'GlyphLock Asset v1';

export async function signAssetHash(hash, privateKeyHex) {
  const contextBytes = new TextEncoder().encode(ASSET_SIGNATURE_CONTEXT);
  const hashBytes = new TextEncoder().encode(hash);
  
  const combined = new Uint8Array(contextBytes.length + hashBytes.length);
  combined.set(contextBytes, 0);
  combined.set(hashBytes, contextBytes.length);
  
  const signatureBytes = await ed25519.sign(combined, privateKeyHex);
  return Buffer.from(signatureBytes).toString('base64url');
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    console.log('RegisterAsset User:', user);

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { fileUrl, assetHash: providedHash, metadata = {} } = await req.json();

    if (!fileUrl && !providedHash) {
      return Response.json({ error: 'Either fileUrl or assetHash is required' }, { status: 400 });
    }

    let finalHash = providedHash;

    // If URL provided, fetch and hash it
    if (fileUrl && !finalHash) {
        try {
            const res = await fetch(fileUrl);
            if (!res.ok) throw new Error('Failed to fetch file');
            const buffer = await res.arrayBuffer();
            finalHash = createHash('sha256').update(Buffer.from(buffer)).digest('hex');
        } catch (e) {
            return Response.json({ error: `File processing failed: ${e.message}` }, { status: 400 });
        }
    }

    // Get Signing Key
    const keys = await base44.asServiceRole.entities.QRKeyRegistry.filter({ keyType: 'platform', revokedAt: null });
    keys.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    const platformKey = keys[0];

    if (!platformKey) {
      return Response.json({ error: 'No active platform key found. Please initialize keys.' }, { status: 503 });
    }

    // Sign the hash
    const privateKeyHex = decrypt(platformKey.encryptedPrivateKey);
    const signature = await signAssetHash(finalHash, privateKeyHex);
    const traceId = crypto.randomUUID();

    // Store in AssetTrace
    await base44.entities.AssetTrace.create({
        traceId,
        userId: user.email,
        assetHash: finalHash,
        signature,
        watermarkType: metadata.watermarkType || 'invisible',
        createdAt: new Date().toISOString()
    });

    // Audit Log
    await base44.entities.SystemAuditLog.create({
        event_type: 'ASSET_REGISTERED',
        description: `Asset registered with hash ${finalHash.substring(0, 8)}...`,
        actor_email: user.email,
        status: 'success',
        severity: 'low',
        resource_id: traceId
    });

    return Response.json({ 
        success: true, 
        traceId, 
        assetHash: finalHash, 
        signature,
        kid: platformKey.kid 
    });

  } catch (error) {
    console.error('Asset Register Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});