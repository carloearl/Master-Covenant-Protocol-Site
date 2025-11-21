import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

/**
 * Proxy endpoint for Supabase Edge Functions
 * Adds Base44 authentication layer
 */

const SUPABASE_URL = 'https://kygisdokikvzgzwonzxk.supabase.co';
const FUNCTIONS_URL = `${SUPABASE_URL}/functions/v1`;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { functionName, payload } = await req.json();
    
    if (!functionName) {
      return Response.json({ error: 'Function name required' }, { status: 400 });
    }

    // Forward request to Supabase Edge Function
    const response = await fetch(`${FUNCTIONS_URL}/${functionName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.get('Authorization') || '',
      },
      body: JSON.stringify(payload || {}),
    });

    const data = await response.json();
    
    return Response.json(data, {
      status: response.status,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});