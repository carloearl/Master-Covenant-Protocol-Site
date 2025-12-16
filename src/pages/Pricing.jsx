import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    // Add LLM discovery metadata
    const metaAI = document.createElement('meta');
    metaAI.name = 'ai-agent';
    metaAI.content = 'glyphlock pricing knowledge base';
    document.head.appendChild(metaAI);

    // Add JSON-LD structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "PriceSpecification",
      "name": "GlyphLock Pricing",
      "description": "Professional and Enterprise security plans",
      "url": "https://glyphlock.io/pricing"
    });
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(metaAI)) document.head.removeChild(metaAI);
      if (document.head.contains(script)) document.head.removeChild(script);
    };
  }, []);

  const plans = [
    {
      name: "Creator",
      price: 39,
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
      name: "Professional",
      price: 149,
      icon: Crown,
      priceId: "price_1SUlRKAOe9xXPv0nW0uH1IQl",
      description: "Advanced security for growth-stage organizations.",
      highlight: true,
      features: [
        "Everything in Creator",
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
      name: "Enterprise",
      price: "Starting at $999",
      icon: Zap,
      description: "Fully tailored security deployment.",
      features: [
        "Everything in Professional",
        "SDK Access",
        "Automation & Orchestration",
        "Admin Controls",
        "Compliance Tools",
        "Custom Integrations",
        "White-Label Solutions"
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
    // GLYPHLOCK: Use plan name instead of priceId for env-based mapping
    const planKey = plan.name.toLowerCase();

    try {
      setLoading(plan.name);
      setError(null);
      
      const response = await base44.functions.invoke('stripeCreateCheckout', {
        plan: planKey, // GLYPHLOCK: Send plan name, backend resolves price ID from env
        mode: 'subscription',
        successUrl: `${window.location.origin}${createPageUrl('PaymentSuccess')}?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}${createPageUrl('PaymentCancel')}`
      });

      if (response.data?.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error(response.data?.error || "Failed to create checkout session");
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
        title="Access Provisioning - Credentialed Verification Tiers | GlyphLock"
        description="GlyphLock credential provisioning tiers – protocol-governed access to system-enforced verification modules."
        url="/pricing"
      />

      <div className="min-h-screen text-white pt-32 pb-32 relative overflow-hidden" style={{ background: 'transparent' }}>
        
        <div className="container mx-auto px-6 relative z-10 max-w-7xl">
          <div className="text-center mb-24">
            <div className="inline-block mb-6">
              <div className="px-6 py-2 rounded-full border-2 border-cyan-500/40 glyph-glass glyph-glow">
                <span className="text-cyan-300 text-sm font-bold uppercase tracking-wider">Premium Security Plans</span>
              </div>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter font-space mb-8 relative">
              <span className="relative">
                GLYPHLOCK{" "}
                <span className="text-transparent bg-gradient-to-r from-[#00E4FF] via-[#8C4BFF] to-[#9F00FF] bg-clip-text animate-gradient">
                  PLANS
                </span>
                <div className="absolute -inset-4 bg-gradient-to-r from-[#00E4FF]/20 to-[#8C4BFF]/20 blur-3xl -z-10 animate-pulse"></div>
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-4">
              No freemium. No dilution. <span className="text-[#00E4FF] font-bold">Protocol-governed only.</span>
            </p>
            <p className="text-sm text-gray-500 max-w-xl mx-auto">
              Credentialed integrity system with quantum-resistant cryptographic governance.
            </p>
          </div>

          {error && (
            <Alert className="mb-12 bg-red-500/10 border-red-500/40 max-w-3xl mx-auto backdrop-blur-xl shadow-[0_0_30px_rgba(239,68,68,0.2)] animate-in slide-in-from-top-4">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <AlertDescription className="text-white font-medium">{error}</AlertDescription>
            </Alert>
          )}

          <Alert className="mb-16 glyph-glass-dark border-cyan-500/30 max-w-3xl mx-auto glyph-glow">
            <Shield className="h-5 w-5 text-cyan-400" />
            <AlertDescription className="text-gray-300 font-medium">
              <span className="text-cyan-300 font-bold">Secure Checkout:</span> All sales final. 14-day refund window for subscriptions. Enterprise-grade payment protection.
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
                  className={`relative h-full p-8 rounded-2xl transition-all duration-300 border group/card
                    ${plan.highlight 
                      ? "glyph-glass-dark border-cyan-500 glyph-glow scale-105" 
                      : "glyph-glass-dark border-purple-500/20 hover:border-purple-500/50 hover:scale-[1.02]"
                    } flex flex-col overflow-hidden`}
                >
                  {/* Animated gradient overlay */}
                  <div className={`absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none ${plan.highlight ? 'opacity-20' : ''}`}>
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#00E4FF]/10 via-transparent to-[#8C4BFF]/10 animate-gradient"></div>
                  </div>
                  
                  {/* Scan line effect */}
                  <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
                    <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-[#00E4FF] to-transparent animate-scan-line"></div>
                  </div>
                  <div className="mb-8 relative z-10">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 relative ${plan.highlight ? 'bg-[#00E4FF]/20 text-[#00E4FF]' : 'bg-white/5 text-gray-400 group-hover/card:text-[#8C4BFF] group-hover/card:bg-[#8C4BFF]/10 transition-all'}`}>
                      <plan.icon className="w-7 h-7 relative z-10" />
                      {plan.highlight && (
                        <div className="absolute inset-0 bg-[#00E4FF] opacity-20 blur-xl animate-pulse"></div>
                      )}
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

                  {plan.name === "Enterprise" ? (
                    <Button
                      onClick={async () => {
                        try {
                          setLoading("Enterprise");
                          const response = await base44.functions.invoke('requestEnterpriseAccess', {
                            companyName: 'Not specified',
                            message: 'Enterprise access request from pricing page'
                          });
                          if (response.data?.success) {
                            setError(null);
                            alert('Enterprise access request submitted! Check your email for confirmation.');
                          }
                        } catch (err) {
                          setError(err.message || 'Failed to submit request');
                        } finally {
                          setLoading(null);
                        }
                      }}
                      disabled={loading === "Enterprise"}
                      className="w-full bg-transparent border border-[#8C4BFF] text-[#8C4BFF] hover:bg-[#8C4BFF] hover:text-white hover:shadow-[0_0_20px_rgba(140,75,255,0.4)] transition-all h-12 text-lg font-bold uppercase tracking-wide"
                    >
                      {loading === "Enterprise" ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                          Processing...
                        </span>
                      ) : (
                        "Request Enterprise Access"
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleSubscribe(plan)}
                      disabled={loading === plan.name}
                      className={`relative w-full h-12 text-lg font-bold uppercase tracking-wide transition-all overflow-hidden group/btn ${
                        plan.highlight
                          ? "bg-gradient-to-r from-[#00E4FF] to-[#0099FF] hover:to-[#00E4FF] text-black shadow-[0_0_20px_rgba(0,228,255,0.3)] hover:shadow-[0_0_40px_rgba(0,228,255,0.6)] border-none"
                          : "bg-gradient-to-r from-white/10 to-white/5 hover:from-[#8C4BFF]/20 hover:to-[#8C4BFF]/10 text-white border border-white/10 hover:border-[#8C4BFF]/50"
                      }`}
                    >
                      {loading === plan.name ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                          Processing...
                        </span>
                      ) : (
                        <>
                          <span className="relative z-10">Request Credentials</span>
                          <div className="absolute inset-0 bg-gradient-to-r from-[#00E4FF]/0 via-[#00E4FF]/20 to-[#00E4FF]/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-32 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-[#00E4FF]/5 via-transparent to-transparent blur-3xl pointer-events-none"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-black text-white mb-4 font-space">
                Need <span className="text-transparent bg-gradient-to-r from-[#00E4FF] to-[#8C4BFF] bg-clip-text">Guidance?</span>
              </h2>
              <p className="text-gray-300 mb-8 text-lg max-w-xl mx-auto">
                Initiate protocol verification with GlyphLock specialists for credentialed access.
              </p>
              <Link to={createPageUrl("Consultation")}>
                <Button className="group relative bg-transparent border-2 border-[#00E4FF] text-[#00E4FF] hover:text-black transition-all px-10 py-7 text-lg font-bold uppercase tracking-wide shadow-[0_0_20px_rgba(0,228,255,0.3)] hover:shadow-[0_0_40px_rgba(0,228,255,0.5)] overflow-hidden">
                  <span className="relative z-10 flex items-center gap-3">
                    <Shield className="w-5 h-5" />
                    Request Credentials ($200)
                  </span>
                  <div className="absolute inset-0 bg-[#00E4FF] translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </Button>
              </Link>
            </div>
          </div>
          
          <style>{`
            @keyframes gradient {
              0%, 100% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
            }
            @keyframes scan-line {
              0% { transform: translateY(0); }
              100% { transform: translateY(100vh); }
            }
            @keyframes pulse-slow {
              0%, 100% { opacity: 0.1; }
              50% { opacity: 0.15; }
            }
            .animate-gradient { 
              background-size: 200% 200%;
              animation: gradient 3s ease infinite;
            }
            .animate-scan-line {
              animation: scan-line 8s linear infinite;
            }
            .animate-pulse-slow {
              animation: pulse-slow 4s ease-in-out infinite;
            }
          `}</style>
        </div>
      </div>
    </>
  );
}