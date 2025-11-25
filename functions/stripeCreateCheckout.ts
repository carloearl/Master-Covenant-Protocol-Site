import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import Stripe from 'npm:stripe@^14.14.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { priceId, lineItems, mode = 'subscription', successUrl, cancelUrl } = await req.json();

    if (!priceId && !lineItems) {
      return Response.json({ error: 'Price ID or line items are required' }, { status: 400 });
    }

    // Build line items - either from priceId or custom lineItems
    const checkoutLineItems = lineItems || [
      {
        price: priceId,
        quantity: 1,
      },
    ];

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: checkoutLineItems,
      mode: mode, // 'payment' for one-time, 'subscription' for recurring
      success_url: successUrl || `${req.headers.get('origin')}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${req.headers.get('origin')}/pricing`,
      customer_email: user.email,
      metadata: {
        userId: user.id,
        userEmail: user.email,
      },
      allow_promotion_codes: true,
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Stripe Checkout Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});