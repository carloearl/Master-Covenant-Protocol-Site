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
        mode: 'subscription'
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

      <div className="min-h-screen bg-black text-white pt-32 pb-32 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#00E4FF]/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="container mx-auto px-6 relative z-10 max-w-7xl">
          <div className="text-center mb-24">
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter font-space mb-6">
              GLYPHLOCK <span className="text-transparent bg-gradient-to-r from-[#00E4FF] to-[#8C4BFF] bg-clip-text">PLANS</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Zero free tiers. Zero compromises. <span className="text-[#00E4FF] font-bold">Zero games.</span>
            </p>
          </div>

          {error && (
            <Alert className="mb-12 bg-red-500/10 border-red-500/40 max-w-3xl mx-auto neon-border-purple">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <AlertDescription className="text-white">{error}</AlertDescription>
            </Alert>
          )}

          <Alert className="mb-16 bg-[#0A0F24] border-[#00E4FF]/30 max-w-3xl mx-auto">
            <AlertCircle className="h-5 w-5 text-[#00E4FF]" />
            <AlertDescription className="text-white">
              All sales are final. Subscription refunds available only within 14 days.
            </AlertDescription>
          </Alert>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div key={plan.name} className="relative group">
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                    <Badge className="bg-[#00E4FF] text-black font-bold px-4 py-1 rounded-full shadow-[0_0_20px_rgba(0,228,255,0.4)] border-none">
                      MOST POPULAR
                    </Badge>
                  </div>
                )}

                <div
                  className={`relative h-full p-8 rounded-2xl transition-all duration-300 border 
                    ${plan.highlight 
                      ? "bg-[#0A0F24]/80 border-[#00E4FF] shadow-[0_0_30px_rgba(0,228,255,0.15)]" 
                      : "bg-black/40 border-white/10 hover:border-[#8C4BFF]/50 hover:bg-[#0A0F24]/60"
                    } backdrop-blur-xl flex flex-col`}
                >
                  <div className="mb-8">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${plan.highlight ? 'bg-[#00E4FF]/20 text-[#00E4FF]' : 'bg-white/5 text-gray-400 group-hover:text-[#8C4BFF] group-hover:bg-[#8C4BFF]/10 transition-colors'}`}>
                      <plan.icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-3xl font-bold text-white tracking-tight font-space mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-gray-400 text-sm">{plan.description}</p>
                  </div>

                  <div className="mb-8">
                    <div className="text-5xl font-black text-white font-space">
                      {typeof plan.price === "number" ? (
                        <>
                          ${plan.price}
                          <span className="text-lg text-gray-500 font-normal font-sans ml-1">/mo</span>
                        </>
                      ) : (
                        <span className="text-4xl">{plan.price}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 mb-8">
                    <ul className="space-y-4">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex gap-3 items-start">
                          <div className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${plan.highlight ? 'bg-[#00E4FF]/20 text-[#00E4FF]' : 'bg-white/10 text-gray-400'}`}>
                            <Check size={12} strokeWidth={3} />
                          </div>
                          <span className="text-gray-300 text-sm leading-relaxed">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {plan.name === "Custom" ? (
                    <Link to={createPageUrl("Consultation")} className="w-full">
                      <Button className="w-full bg-transparent border border-[#8C4BFF] text-[#8C4BFF] hover:bg-[#8C4BFF] hover:text-white hover:shadow-[0_0_20px_rgba(140,75,255,0.4)] transition-all h-12 text-lg font-bold uppercase tracking-wide">
                        Contact Sales
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      onClick={() => handleSubscribe(plan)}
                      disabled={loading === plan.name}
                      className={`w-full h-12 text-lg font-bold uppercase tracking-wide transition-all ${
                        plan.highlight
                          ? "bg-gradient-to-r from-[#00E4FF] to-[#0099FF] hover:to-[#00E4FF] text-black shadow-[0_0_20px_rgba(0,228,255,0.3)] hover:shadow-[0_0_30px_rgba(0,228,255,0.5)] border-none"
                          : "bg-white/10 hover:bg-white/20 text-white border-none"
                      }`}
                    >
                      {loading === plan.name ? "Processing..." : "Get Started"}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-32">
            <h2 className="text-3xl font-bold text-white mb-4 font-space">
              Need Guidance?
            </h2>
            <p className="text-gray-400 mb-8">
              Talk to a GlyphLock security specialist to find your perfect fit.
            </p>
            <Link to={createPageUrl("Consultation")}>
              <Button className="bg-transparent border border-[#00E4FF] text-[#00E4FF] hover:bg-[#00E4FF] hover:text-black transition-all px-8 py-6 text-lg font-bold uppercase tracking-wide shadow-[0_0_15px_rgba(0,228,255,0.2)]">
                Schedule Consultation ($200)
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}