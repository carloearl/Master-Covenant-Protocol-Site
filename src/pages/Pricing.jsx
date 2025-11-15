import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "$99",
      period: "per month",
      description: "Perfect for small businesses and startups",
      features: [
        "Visual Cryptography Suite",
        "Basic QR Code Generation",
        "Steganography Tools",
        "5GB Storage",
        "Email Support",
        "Community Access"
      ],
      cta: "Start Free Trial",
      popular: false
    },
    {
      name: "Professional",
      price: "$299",
      period: "per month",
      description: "For growing teams and organizations",
      features: [
        "Everything in Starter",
        "Blockchain Security Suite",
        "Advanced QR Security Scanning",
        "Security Operations Center",
        "50GB Storage",
        "Priority Support",
        "GlyphBot AI Assistant",
        "Custom Branding"
      ],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      description: "For large enterprises with custom needs",
      features: [
        "Everything in Professional",
        "N.U.P.S. POS System",
        "Unlimited Storage",
        "Dedicated Account Manager",
        "24/7 Phone Support",
        "Custom Integrations",
        "SLA Guarantee",
        "On-Premise Deployment Option"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-blue-500/20 text-blue-400 border-blue-500/50 px-6 py-2">
              <Shield className="w-4 h-4 mr-2" />
              Flexible Pricing Plans
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Choose Your <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Security Plan</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              All plans include 14-day free trial. No credit card required.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, idx) => (
              <Card 
                key={idx} 
                className={`bg-gray-900 border-gray-800 ${plan.popular ? 'border-blue-500/50 relative' : ''} hover:border-blue-500/50 transition-all`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white">Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-white">
                    <div className="text-2xl font-bold mb-2">{plan.name}</div>
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-4xl font-bold text-blue-400">{plan.price}</span>
                      <span className="text-gray-400 text-sm">{plan.period}</span>
                    </div>
                    <p className="text-sm text-gray-400 font-normal">{plan.description}</p>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, fidx) => (
                      <li key={fidx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to={createPageUrl("Consultation")} className="block">
                    <Button 
                      className={`w-full ${plan.popular ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-gray-800 hover:bg-gray-700'}`}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-700/10 border-blue-500/30">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                Need a Custom Solution?
              </h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                We offer tailored security solutions for enterprises with unique requirements. 
                Contact our team for a personalized consultation.
              </p>
              <Link to={createPageUrl("Consultation")}>
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700">
                  Schedule Consultation
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}