import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import SEOHead from "@/components/SEOHead";

import { Crown, Shield, Zap, Check, AlertCircle } from "lucide-react";
import GlyphLoader from "@/components/GlyphLoader";

export default function Pricing() {
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const plans = [
    {
      name: "Professional",
      price: 200,
      icon: Shield,
      priceId: "price_1SUlImAOe9xXPv0na5BmMKKY",
      description: "For individuals and small teams.",
      features: [
        "Visual Cryptography Tools",
        "Blockchain Security Suite",
        "GlyphBot AI Assistant",
        "Up to 1,000 QR codes/month",
        "Standard Support",
        "Dashboards + Logs"
      ]
    },
    {
      name: "Enterprise",
      price: 2000,
      icon: Crown,
      priceId: "price_1SUlRKAOe9xXPv0nW0uH1IQl",
      description: "Advanced security for growth-stage organizations.",
      highlight: true,
      features: [
        "Everything in Professional",
        "Unlimited QR Generation",
        "Priority AI Processing",
        "Security Operations Center",
        "N.U.P.S. POS System",
        "24/7 Premium Support",
        "Custom Integrations",
        "Dedicated Account Manager"
      ]
    },
    {
      name: "Custom",
      price: "Contact",
      icon: Zap,
      description: "Fully tailored security deployment.",
      features: [
        "Everything in Enterprise",
        "Custom Feature Development",
        "On-Premise Deployment",
        "White-Label Solutions",
        "SLA Guarantees",
        "Custom Training",
        "API Rate Limit Flexibility"
      ]
    }
  ];

  const handleSubscribe = async (plan) => {
    if (!plan.priceId) return;

    try {
      setLoading(plan.name);
      setError(null);
      
      const response = await base44.functions.invoke('stripeCreateCheckout', {
        priceId: plan.priceId,
        mode: 'subscription' // All plans here seem to be subscriptions based on descriptions
      });

      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error(response.data.error || "Failed to create checkout session");
      }
    } catch (err) {
      console.error("Subscription error:", err);
      setError(err.message || "Failed to process subscription.");
      setLoading(null);
    }
  };

  if (loading) {
    return <GlyphLoader text={`Preparing ${loading} Plan...`} />;
  }

  return (
    <>
      <SEOHead
        title="GlyphLock Pricing | Quantum-Grade Security Plans"
        description="Professional and Enterprise cybersecurity plans featuring visual cryptography, blockchain security, and advanced AI threat tools."
        url="/pricing"
      />

      <div className="min-h-screen bg-black text-white pt-24 pb-32 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at center, rgba(0,120,255,0.8), transparent 60%)"
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)",
            backgroundSize: "60px 60px"
          }}
        />

        <div className="container mx-auto px-4 relative z-10 max-w-7xl">
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-6xl font-black tracking-tight">
              GlyphLock <span className="text-royal-blue">Security Plans</span>
            </h1>
            <p className="text-lg text-gray-400 mt-4">
              Zero free tiers. Zero compromises. Zero games.
            </p>
          </div>

          {error && (
            <Alert className="mb-10 bg-red-500/10 border-red-500/40 max-w-3xl mx-auto">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <AlertDescription className="text-white">{error}</AlertDescription>
            </Alert>
          )}

          <Alert className="mb-12 bg-blue-500/10 border-blue-500/30 max-w-3xl mx-auto">
            <AlertCircle className="h-5 w-5 text-blue-400" />
            <AlertDescription className="text-white">
              All sales are final. Subscription refunds available only within 14 days.
            </AlertDescription>
          </Alert>

          <div className="grid md:grid-cols-3 gap-10">
            {plans.map((plan) => (
              <div key={plan.name} className="relative group">
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                    <Badge className="bg-royal-blue text-white px-4 py-1 rounded-full shadow-xl shadow-royal-blue/40">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <Card
                  className={`relative backdrop-blur-xl transition-all duration-300 border-2
                    ${
                      plan.highlight
                        ? "border-royal-blue shadow-[0_0_25px_rgba(65,105,225,0.6)]"
                        : "border-gray-800 hover:border-royal-blue/40"
                    }
                    bg-gradient-to-br from-gray-900/60 to-gray-950/40
                    h-full group-hover:scale-[1.02]`}
                >
                  <CardHeader>
                    <div className="flex justify-between mb-4">
                      <plan.icon className="w-10 h-10 text-royal-blue" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-white tracking-tight">
                      {plan.name}
                    </CardTitle>
                    <p className="text-gray-400 mt-1">{plan.description}</p>
                  </CardHeader>

                  <CardContent className="space-y-8">
                    <div className="text-5xl font-bold text-white">
                      {typeof plan.price === "number" ? (
                        <>
                          ${plan.price}
                          <span className="text-lg text-gray-500 font-normal">/mo</span>
                        </>
                      ) : (
                        <span className="text-3xl">{plan.price}</span>
                      )}
                    </div>

                    <ul className="space-y-4">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex gap-3">
                          <Check className="w-6 h-6 text-green-400 flex-shrink-0" />
                          <span className="text-gray-300 text-sm">{f}</span>
                        </li>
                      ))}
                    </ul>

                    {plan.name === "Custom" ? (
                      <Link to={createPageUrl("Consultation")}>
                        <Button className="w-full bg-royal-blue hover:bg-blue-700 text-white text-lg">
                          Contact Sales
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        onClick={() => handleSubscribe(plan)}
                        disabled={loading === plan.name}
                        className={`w-full text-lg ${
                          plan.highlight
                            ? "bg-royal-blue hover:bg-blue-700"
                            : "bg-gray-800 hover:bg-gray-700"
                        } text-white`}
                      >
                        {loading === plan.name ? "Processing..." : "Get Started"}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          <div className="text-center mt-24">
            <h2 className="text-3xl font-bold text-white mb-3">
              Not sure which plan fits?
            </h2>
            <p className="text-gray-400 mb-8">
              Talk to a GlyphLock security specialist.
            </p>
            <Link to={createPageUrl("Consultation")}>
              <Button className="text-white border-blue-500/50 hover:bg-blue-500/20 px-8 py-6 text-lg">
                Schedule Consultation ($299)
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}