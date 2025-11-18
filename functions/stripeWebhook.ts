import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import Stripe from 'npm:stripe@14.14.0';

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"), {
  apiVersion: '2023-10-16',
});

const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

Deno.serve(async (req) => {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature || !webhookSecret) {
      return Response.json({ error: 'Missing signature or webhook secret' }, { status: 400 });
    }

    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret
    );

    const base44 = createClientFromRequest(req);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userEmail = session.customer_email || session.metadata?.user_email;

        if (userEmail && session.subscription) {
          const users = await base44.asServiceRole.entities.User.filter({ email: userEmail });
          if (users.length > 0) {
            const subscription = await stripe.subscriptions.retrieve(session.subscription);
            const priceId = subscription.items.data[0]?.price?.id;
            
            let planName = 'Unknown';
            if (priceId === 'price_1SUlImAOe9xXPv0na5BmMKKY') planName = 'Professional';
            else if (priceId === 'price_1SUlRKAOe9xXPv0nW0uH1IQl') planName = 'Enterprise';

            await base44.asServiceRole.entities.User.update(users[0].id, {
              subscription_status: 'active',
              subscription_id: session.subscription,
              stripe_customer_id: session.customer,
              plan_name: planName,
              subscription_start_date: new Date(subscription.current_period_start * 1000).toISOString(),
              subscription_end_date: new Date(subscription.current_period_end * 1000).toISOString(),
              cancel_at_period_end: false
            });
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const users = await base44.asServiceRole.entities.User.filter({ 
          subscription_id: subscription.id 
        });
        
        if (users.length > 0) {
          await base44.asServiceRole.entities.User.update(users[0].id, {
            subscription_status: subscription.status,
            subscription_end_date: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end || false
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const users = await base44.asServiceRole.entities.User.filter({ 
          subscription_id: subscription.id 
        });
        
        if (users.length > 0) {
          await base44.asServiceRole.entities.User.update(users[0].id, {
            subscription_status: 'canceled',
            subscription_id: null,
            plan_name: null,
            cancel_at_period_end: false
          });
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        if (invoice.subscription) {
          const users = await base44.asServiceRole.entities.User.filter({ 
            subscription_id: invoice.subscription 
          });
          
          if (users.length > 0) {
            await base44.asServiceRole.entities.User.update(users[0].id, {
              subscription_status: 'active'
            });
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        if (invoice.subscription) {
          const users = await base44.asServiceRole.entities.User.filter({ 
            subscription_id: invoice.subscription 
          });
          
          if (users.length > 0) {
            await base44.asServiceRole.entities.User.update(users[0].id, {
              subscription_status: 'past_due'
            });
          }
        }
        break;
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ error: error.message }, { status: 400 });
  }
});