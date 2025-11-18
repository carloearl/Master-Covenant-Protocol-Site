import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_live_51S1CnwAOe9xXPv0ngqSu0oJGYYrKzXXqvdJxYE9aKZvQzKxQzJxYE9aKZvQzKxQzJxYE9aKZvQzKxQzJxYE9aKZvQz');

export default function CheckoutEmbed() {
  const [clientSecret, setClientSecret] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    createCheckoutSession();
  }, []);

  const createCheckoutSession = async () => {
    try {
      const params = new URLSearchParams(location.search);
      const priceId = params.get('priceId');
      const mode = params.get('mode') || 'subscription';

      if (!priceId) {
        setError('Missing price information');
        return;
      }

      const origin = window.location.origin;
      const response = await base44.functions.invoke('stripeCreateCheckout', {
        priceId: priceId,
        mode: mode,
        successUrl: `${origin}${createPageUrl('PaymentSuccess')}?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${origin}${createPageUrl('Pricing')}`,
        embedded: true
      });

      if (response.data?.clientSecret) {
        setClientSecret(response.data.clientSecret);
      } else {
        throw new Error(response.data?.error || 'Failed to create checkout session');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.response?.data?.error || err.message || 'Failed to initialize checkout');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Checkout Error</h1>
          <p className="text-white/70 mb-6">{error}</p>
          <Button onClick={() => navigate(createPageUrl('Pricing'))} className="glass-royal border border-blue-500/50">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Pricing
          </Button>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white/70">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button 
          onClick={() => navigate(createPageUrl('Pricing'))} 
          className="mb-6 glass-royal border border-blue-500/50"
          variant="ghost"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Pricing
        </Button>

        <div className="glass-card-dark border-blue-500/30 rounded-xl p-8">
          <h1 className="text-3xl font-bold text-center mb-8">Complete Your Subscription</h1>
          <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      </div>
    </div>
  );
}