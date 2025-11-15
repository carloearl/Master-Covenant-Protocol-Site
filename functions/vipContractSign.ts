import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { token, signature, guest_name } = await req.json();

    if (!token || !signature) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Retrieve and validate token
    const tokens = await base44.asServiceRole.entities.SecureDataHistory.filter({
      action_id: token,
      action_type: "vip_contract_token"
    });

    if (tokens.length === 0) {
      return Response.json({ error: 'Invalid contract token' }, { status: 400 });
    }

    const tokenData = tokens[0];
    const metadata = tokenData.metadata;

    // Check if expired
    if (new Date() > new Date(metadata.expires_at)) {
      return Response.json({ error: 'Contract link has expired' }, { status: 400 });
    }

    // Check if already used
    if (metadata.used) {
      return Response.json({ error: 'Contract has already been signed' }, { status: 400 });
    }

    // Get client details
    const clientIP = req.headers.get('cf-connecting-ip') || 
                     req.headers.get('x-forwarded-for') || 
                     'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // Mark token as used
    await base44.asServiceRole.entities.SecureDataHistory.update(tokenData.id, {
      metadata: {
        ...metadata,
        used: true,
        signed_at: new Date().toISOString(),
        signed_by: guest_name,
        signature_ip: clientIP,
      }
    });

    // Create VIP guest record
    await base44.asServiceRole.entities.VIPGuest.create({
      guest_name,
      status: "in_building",
      current_location: "VIP Area",
      check_in_time: new Date().toISOString(),
      total_spent_tonight: 0,
      lifetime_spent: 0,
    });

    // Log digital signature
    await base44.asServiceRole.entities.SecureDataHistory.create({
      action_id: `vip_signature_${Date.now()}_${token}`,
      action_type: "vip_contract_signature",
      payload: signature,
      payload_sha256: await crypto.subtle.digest('SHA-256', new TextEncoder().encode(signature))
        .then(buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')),
      user_id: guest_name,
      metadata: {
        ip_address: clientIP,
        user_agent: userAgent,
        timestamp: new Date().toISOString(),
        booking_id: metadata.booking_id,
        contract_token: token,
      },
      status: "safe"
    });

    return Response.json({ 
      success: true,
      message: 'Contract signed successfully. Welcome to VIP.'
    });
  } catch (error) {
    console.error('VIP contract signing error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});