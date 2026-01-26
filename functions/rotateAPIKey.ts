import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

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

    const { key_id, type } = await req.json();

    if (!key_id || !type) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Fetch existing key
    const existingKeys = await base44.entities.APIKey.list({ id: key_id }, 1);
    if (!existingKeys.length) {
      return Response.json({ error: 'Key not found' }, { status: 404 });
    }
    const currentKey = existingKeys[0];

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

    const envTag = currentKey.environment?.toUpperCase() || "LIVE";
    const updates = {
      last_rotated: new Date().toISOString(),
      // Generate new mock blockchain hash on rotation
      blockchain_hash: `0x${hash(64)}`
    };

    // Rotate requested parts
    if (type === 'public' || type === 'all') {
      updates.public_key = `GLX-PUB-${envTag}-${hash(4)}-${rand(6)}`;
    }
    
    if (type === 'secret' || type === 'all') {
      updates.secret_key = `GLX-SEC-${envTag}-${hash(6)}-${rand(20)}`;
    }
    
    if (type === 'env' || type === 'all') {
      updates.env_key = `GLX-ENV-CORE-${envTag}-${hash(3)}`;
    }

    // Update the key
    const updatedKey = await base44.entities.APIKey.update(key_id, updates);

    // Log to Audit System
    await base44.entities.SystemAuditLog.create({
      event_type: type === 'all' ? 'KEY_KILL_SWITCH' : 'KEY_ROTATION',
      description: `Rotated ${type} component(s) for key: ${currentKey.name}`,
      actor_email: user.email,
      resource_id: key_id,
      metadata: {
        rotation_type: type,
        previous_hash: currentKey.blockchain_hash,
        new_hash: updates.blockchain_hash
      },
      ip_address: "Unknown (SDK)", // In a real deployment, we'd parse headers
      status: "success"
    });

    return Response.json(updatedKey);

  } catch (error) {
    console.error("Rotation error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});