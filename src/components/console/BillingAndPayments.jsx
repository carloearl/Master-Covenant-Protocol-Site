import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2, DollarSign, Zap, Shield, Brain, Lock, Check, Eye, FileCode } from 'lucide-react';
import { toast } from 'sonner';

const productCatalog = [
  {
    product: {
      id: "prod_TRecvO5HfpAWvl",
      name: "Pro",
      description: "All Visual Cryptography Tools, Blockchain Security Suite, GlyphBot AI Assistant, Up to 1,000 QR codes/month, Standard Support, Data Dashboard Access"
    },
    prices: [{
      id: "price_1SUlImAOe9xXPv0na5BmMKKY",
      type: "recurring",
      unit_amount: 20000,
      currency: "usd",
      recurring: { interval: "month" }
    }]
  },
  {
    product: {
      id: "prod_TRekwPtbRKWuMl",
      name: "Enterprise",
      description: "Everything in Pro, Unlimited QR Generation, Priority AI Processing, Security Operations Center, N.U.P.S. POS System, 24/7 Premium Support, Custom Integrations, Dedicated Account Manager"
    },
    prices: [{
      id: "price_1SUlRKAOe9xXPv0nW0uH1IQl",
      type: "recurring",
      unit_amount: 200000,
      currency: "usd",
      recurring: { interval: "month" }
    }]
  },
  {
    product: {
      id: "prod_Sx7YM5pcBfBwPW",
      name: "GlyphLock Voucher",
      description: "Secure digital voucher, Fraud-proof cryptographic protection, Redeemable at partner locations, Available in multiple denominations"
    },
    prices: [{
      id: "price_1S1DIvAOe9xXPv0nQ9Twkqar",
      type: "one_time",
      unit_amount: 100,
      currency: "usd"
    }]
  },
  {
    product: {
      id: "prod_Sx7bODyLES1aqB",
      name: "Vouchers Bundle",
      description: "Bulk secure vouchers, Enterprise fraud prevention, Instant traceability, Partner network access"
    },
    prices: [{
      id: "price_1S1DLyAOe9xXPv0nuUfZTu9S",
      type: "one_time",
      unit_amount: 100,
      currency: "usd"
    }]
  },
  {
    product: {
      id: "prod_Sx7g6cB08UxB3D",
      name: "Enterprise Vouchers",
      description: "Enterprise-grade voucher package, Ongoing authentication, Advanced reporting, Continuous monitoring, Bulk management"
    },
    prices: [{
      id: "price_1S1E4uAOe9xXPv0nByLqrpFg",
      type: "one_time",
      unit_amount: 200000,
      currency: "usd"
    }]
  }
];

const featureIcons = {
  "Visual Cryptography": <Eye className="h-4 w-4 mr-2 text-cyan-400" />,
  "Blockchain": <Lock className="h-4 w-4 mr-2 text-purple-400" />,
  "GlyphBot": <Brain className="h-4 w-4 mr-2 text-blue-400" />,
  "QR": <FileCode className="h-4 w-4 mr-2 text-green-400" />,
  "Security": <Shield className="h-4 w-4 mr-2 text-red-400" />,
  "AI": <Zap className="h-4 w-4 mr-2 text-yellow-400" />
};

const getFeaturesList = (description) => {
  return description.split(',').map(f => f.trim()).filter(Boolean);
};

export default function BillingAndPayments() {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get('session_id');

    if (sessionId) {
      setLoading(true);
      base44.functions.invoke('stripePoll', { sessionId })
        .then(response => {
          setPaymentStatus(response.data.status);
          toast.success(`Payment status: ${response.data.status}`);
        })
        .catch(error => {
          console.error("Error polling Stripe session:", error);
          toast.error("Failed to retrieve payment status.");
        })
        .finally(() => {
          setLoading(false);
          navigate(location.pathname, { replace: true });
        });
    }
  }, [location.search, navigate, location.pathname]);

  const handleCheckout = async (productId, priceId, mode) => {
    setLoading(true);
    try {
      const response = await base44.functions.invoke('stripeCheckout', {
        productId,
        priceId,
        mode
      });
      
      if (response.data?.checkoutUrl) {
        window.location.href = response.data.checkoutUrl;
      } else {
        toast.error("Failed to get Stripe checkout URL.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(`Checkout failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-bold text-center text-white mb-4">Billing & Payments</h1>
      <p className="text-xl text-center text-white/70 mb-12">Manage your subscriptions and one-time purchases</p>

      {loading && (
        <div className="flex justify-center items-center mb-8">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
          <span className="ml-3 text-white">Processing...</span>
        </div>
      )}

      {paymentStatus && (
        <div className="mb-8 p-4 rounded-lg glass-card border-cyan-500/30 flex items-center justify-center">
          {paymentStatus === 'active' || paymentStatus === 'trialing' ? (
            <>
              <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
              <span className="text-white">Payment successful! Status: {paymentStatus}</span>
            </>
          ) : (
            <>
              <XCircle className="h-6 w-6 text-red-500 mr-3" />
              <span className="text-white">Payment status: {paymentStatus}</span>
            </>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {productCatalog.map((item) => (
          <Card key={item.product.id} className="glass-card border-cyan-500/30 flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-cyan-400 mb-2">{item.product.name}</CardTitle>
              <CardDescription className="text-white/70 min-h-[80px]">{item.product.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {item.prices.map(price => (
                <div key={price.id} className="mb-4">
                  <p className="text-4xl font-extrabold text-white">
                    ${(price.unit_amount / 100).toFixed(2)}
                    {price.recurring && <span className="text-lg font-normal text-white/60"> / {price.recurring.interval}</span>}
                  </p>
                  <p className="text-sm text-white/50 mb-4">
                    {price.type === "recurring" ? "Recurring subscription" : "One-time purchase"}
                  </p>
                  <ul className="space-y-2 text-white/80">
                    {getFeaturesList(item.product.description).slice(0, 4).map((feature, idx) => {
                      const iconKey = Object.keys(featureIcons).find(key => feature.includes(key));
                      return (
                        <li key={idx} className="flex items-center text-sm">
                          {iconKey ? featureIcons[iconKey] : <Check className="h-4 w-4 mr-2 text-purple-400" />}
                          <span>{feature}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              {item.prices.map(price => (
                <Button
                  key={price.id}
                  onClick={() => handleCheckout(item.product.id, price.id, price.type === "recurring" ? "subscription" : "payment")}
                  className="w-full bg-gradient-to-r from-[#8C4BFF] to-[#00E4FF] hover:opacity-90 text-white font-bold"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    price.type === "recurring" ? "Subscribe Now" : "Purchase"
                  )}
                </Button>
              ))}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}