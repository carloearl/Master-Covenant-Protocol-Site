import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import Stripe from 'npm:stripe@14.14.0';

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"), {
  apiVersion: '2023-10-16',
});

Deno.serve(async (req) => {
  try {
    const signature = req.headers.get('stripe-signature');
    const body = await req.text();

    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      Deno.env.get("STRIPE_WEBHOOK_SECRET")
    );

    const base44 = createClientFromRequest(req);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.user_id;
        const userEmail = session.metadata?.user_email;

        if (session.mode === 'payment') {
          await base44.asServiceRole.entities.Consultation.filter({ email: userEmail }).then(async consultations => {
            if (consultations.length > 0) {
              await base44.asServiceRole.entities.Consultation.update(consultations[0].id, {
                payment_status: 'paid',
                stripe_payment_intent_id: session.payment_intent,
                amount_paid: session.amount_total,
                payment_date: new Date().toISOString(),
              });
            }
          });
        }
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        console.log('Payment succeeded:', paymentIntent.id);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        console.error('Payment failed:', paymentIntent.id);
        break;
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ error: error.message }, { status: 400 });
  }
});