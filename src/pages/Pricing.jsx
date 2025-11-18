import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Shield, Zap, Crown, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [loading, setLoading] = useState(null);

  const plans = [
    {
      name: "Professional",
      icon: Shield,
      price: { monthly: 299, annual: 2990 },
      priceId: { monthly: "price_1S1DRYAOe9xXPv0n6sIFWQuk", annual: "price_1S1DRYAOe9xXPv0n6sIFWQuk" },
      description: "For individuals and small teams",
      features: [
        "All Visual Cryptography Tools",
        "Blockchain Security Suite",
        "GlyphBot AI Assistant",
        "Up to 1,000 QR codes/month",
        "Standard Support",
        "Data Dashboard Access"
      ],
      highlighted: false
    },
    {
      name: "Enterprise",
      icon: Crown,
      price: { monthly: 999, annual: 9990 },
      priceId: { monthly: "price_1S1E4uAOe9xXPv0nByLqrpFg", annual: "price_1S1E4uAOe9xXPv0nByLqrpFg" },
      description: "For organizations requiring advanced security",
      features: [
        "Everything in Professional",
        "Unlimited QR Generation",
        "Priority AI Processing",
        "Security Operations Center",
        "N.U.P.S. POS System",
        "24/7 Premium Support",
        "Custom Integrations",
        "Dedicated Account Manager"
      ],
      highlighted: true
    },
    {
      name: "Custom",
      icon: Zap,
      price: { monthly: "Contact", annual: "Contact" },
      description: "Tailored solutions for your needs",
      features: [
        "Everything in Enterprise",
        "Custom Feature Development",
        "On-Premise Deployment",
        "White-Label Options",
        "SLA Guarantees",
        "Custom Training",
        "API Rate Limit Adjustments"
      ],
      highlighted: false
    }
  ];

  const handleSubscribe = async (plan) => {
    try {
      setLoading(plan.name);
      const isAuth = await base44.auth.isAuthenticated();
      
      if (!isAuth) {
        base44.auth.redirectToLogin('/pricing');
        return;
      }

      const response = await base44.functions.invoke('stripeCreateCheckout', {
        priceId: plan.priceId[billingCycle],
        mode: 'subscription',
        successUrl: `${window.location.origin}${createPageUrl('PaymentSuccess')}`,
        cancelUrl: `${window.location.origin}${createPageUrl('Pricing')}`
      });

      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Error creating checkout session. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Choose Your <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Security Plan</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Professional-grade cybersecurity tools. No free tier. All sales final.
            </p>

            <div className="flex items-center justify-center gap-4 mb-8">
              <Button
                onClick={() => setBillingCycle("monthly")}
                variant={billingCycle === "monthly" ? "default" : "outline"}
                className={billingCycle === "monthly" ? "bg-blue-600" : ""}
              >
                Monthly
              </Button>
              <Button
                onClick={() => setBillingCycle("annual")}
                variant={billingCycle === "annual" ? "default" : "outline"}
                className={billingCycle === "annual" ? "bg-blue-600" : ""}
              >
                Annual
                <Badge className="ml-2 bg-green-500">Save 17%</Badge>
              </Button>
            </div>
          </div>

          <Alert className="mb-8 bg-blue-500/10 border-blue-500/30 max-w-3xl mx-auto">
            <AlertCircle className="h-4 w-4 text-blue-400" />
            <AlertDescription className="text-white">
              <strong>Sales Policy:</strong> All sales are final. Subscription plans may be refunded if a valid request is submitted within 14 days.
            </AlertDescription>
          </Alert>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative ${
                  plan.highlighted
                    ? "bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-500"
                    : "bg-gray-900 border-gray-800"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white">Most Popular</Badge>
                  </div>
                )}

                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <plan.icon className="w-10 h-10 text-blue-400" />
                  </div>
                  <CardTitle className="text-white text-2xl">{plan.name}</CardTitle>
                  <p className="text-gray-400 text-sm">{plan.description}</p>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div>
                    <div className="text-4xl font-bold text-white">
                      {typeof plan.price[billingCycle] === "number" ? (
                        <>
                          ${plan.price[billingCycle]}
                          <span className="text-lg text-gray-400 font-normal">
                            /{billingCycle === "monthly" ? "mo" : "yr"}
                          </span>
                        </>
                      ) : (
                        <span className="text-3xl">{plan.price[billingCycle]}</span>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.name === "Custom" ? (
                    <Link to={createPageUrl("Consultation")}>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
                        Contact Sales
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      onClick={() => handleSubscribe(plan)}
                      disabled={loading === plan.name}
                      className={`w-full ${
                        plan.highlighted
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-gray-800 hover:bg-gray-700"
                      } text-white`}
                    >
                      {loading === plan.name ? "Processing..." : "Get Started"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold mb-4 text-white">Need Help Choosing?</h2>
            <p className="text-gray-400 mb-6">
              Book a consultation with our security experts
            </p>
            <Link to={createPageUrl("Consultation")}>
              <Button variant="outline" className="border-blue-500/50 text-white hover:bg-blue-500/10">
                Schedule Consultation ($299)
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}