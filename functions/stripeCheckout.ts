import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import Stripe from 'npm:stripe';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();
        
        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"), { 
            apiVersion: '2023-10-16' 
        });
        
        const { productId, priceId, mode } = await req.json();

        if (!priceId || !mode) {
            return Response.json({ error: 'Missing priceId or mode' }, { status: 400 });
        }

        const appHost = req.headers.get('x-forwarded-host') || req.headers.get('host');
        const protocol = req.headers.get('x-forwarded-proto') || 'https';
        const successUrl = `${protocol}://${appHost}/payment-success?session_id={CHECKOUT_SESSION_ID}`;
        const cancelUrl = `${protocol}://${appHost}/payment-cancel`;

        const session = await stripe.checkout.sessions.create({
            line_items: [{ 
                price: priceId, 
                quantity: 1 
            }],
            mode: mode,
            success_url: successUrl,
            cancel_url: cancelUrl,
            customer_email: user.email,
            metadata: { 
                userId: user.id, 
                userEmail: user.email, 
                productId: productId || '', 
                priceId: priceId 
            },
        });

        return Response.json({ 
            checkoutUrl: session.url,
            sessionId: session.id 
        });

    } catch (error) {
        console.error("Stripe Checkout Function Error:", error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});