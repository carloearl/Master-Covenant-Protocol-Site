import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import Stripe from 'npm:stripe@14.14.0';

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"), {
  apiVersion: '2023-10-16',
});

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { priceId, mode = 'payment', successUrl, cancelUrl } = body;

    if (!priceId) {
      return Response.json({ error: 'priceId is required' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: mode,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl || `${req.headers.get('origin')}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${req.headers.get('origin')}/pricing`,
      customer_email: user.email,
      metadata: {
        user_id: user.id,
        user_email: user.email,
      },
    });

    return Response.json({ 
      sessionId: session.id, 
      url: session.url,
      publishableKey: Deno.env.get("STRIPE_PUBLISHABLE_KEY")
    });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return Response.json({ 
      error: error.message,
      details: error.stack 
    }, { status: 500 });
  }
});