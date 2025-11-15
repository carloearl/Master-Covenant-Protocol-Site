import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { guest_name, room_number, duration_minutes, rate_per_hour } = await req.json();

    if (!guest_name || !room_number) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate single-use, time-limited contract token
    const contractToken = `vip_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Create VIP room booking
    const booking = await base44.asServiceRole.entities.VIPRoom.create({
      room_number,
      room_name: `VIP Suite ${room_number}`,
      status: "occupied",
      guest_name,
      start_time: new Date().toISOString(),
      duration_minutes: duration_minutes || 60,
      rate_per_hour: rate_per_hour || 300,
      total_charge: ((duration_minutes || 60) / 60) * (rate_per_hour || 300),
    });

    // Store contract token with expiry
    await base44.asServiceRole.entities.SecureDataHistory.create({
      action_id: contractToken,
      action_type: "vip_contract_token",
      payload: JSON.stringify({ guest_name, room_number, booking_id: booking.id }),
      user_id: user.email,
      metadata: {
        expires_at: expiresAt.toISOString(),
        booking_id: booking.id,
        single_use: true,
        used: false,
      },
      status: "safe"
    });

    const contractUrl = `${req.headers.get('origin')}/vip-contract?token=${contractToken}`;

    return Response.json({ 
      success: true, 
      contract_url: contractUrl,
      booking_id: booking.id,
      expires_at: expiresAt.toISOString()
    });
  } catch (error) {
    console.error('VIP contract generation error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});