import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

export default Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name = "Default Key", environment = "live" } = await req.json();

    // Generate keys
    const prefix = environment === 'live' ? 'live' : 'test';
    const randomString = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    const publicKey = `pk_${prefix}_${randomString()}`;
    const secretKey = `sk_${prefix}_${randomString()}${randomString()}`;

    // Save to DB
    const apiKey = await base44.entities.APIKey.create({
      name,
      public_key: publicKey,
      secret_key: secretKey,
      status: 'active',
      environment
    });

    return Response.json(apiKey);

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});