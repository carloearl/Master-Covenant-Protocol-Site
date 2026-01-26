import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

export default Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { name = "Default Key", environment = "live" } = await req.json();
    const envTag = environment.toUpperCase();

    // Helper to generate random string
    const rand = (len) => {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let result = '';
      for (let i = 0; i < len; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };

    // Helper to generate pseudo-hash
    const hash = (len) => {
      const chars = '0123456789ABCDEF';
      let result = '';
      for (let i = 0; i < len; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };

    // 1. Public Key: GLX-PUB-{ENV}-{GlyphHash4}-{Entropy6}
    const publicKey = `GLX-PUB-${envTag}-${hash(4)}-${rand(6)}`;

    // 2. Secret Key: GLX-SEC-{ENV}-{GlyphHash6}-{Entropy20}
    const secretKey = `GLX-SEC-${envTag}-${hash(6)}-${rand(20)}`;

    // 3. Env Key: GLX-ENV-{service}-{env}-{GlyphHash3}
    // Using 'CORE' as default service name for now
    const envKey = `GLX-ENV-CORE-${envTag}-${hash(3)}`;

    // Mock Blockchain Hash (SHA-256 like)
    const blockchainHash = `0x${hash(64)}`;

    // Save to DB
    const apiKey = await base44.entities.APIKey.create({
      name,
      public_key: publicKey,
      secret_key: secretKey,
      env_key: envKey,
      status: 'active',
      environment,
      created_date: new Date().toISOString(),
      last_rotated: new Date().toISOString(),
      blockchain_hash: blockchainHash,
      rotation_schedule: "none",
      ip_allowlist: "",
      geo_lock: false,
      device_lock: false
    });

    // Log creation to Audit System
    await base44.entities.SystemAuditLog.create({
      event_type: 'KEY_CREATION',
      description: `Created new API Key: ${name}`,
      actor_email: user.email,
      resource_id: apiKey.id,
      metadata: {
        environment,
        blockchain_hash: blockchainHash
      },
      ip_address: "Unknown (SDK)",
      status: "success"
    });

    return Response.json(apiKey);

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});