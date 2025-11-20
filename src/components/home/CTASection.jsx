import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function CTASection() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(createPageUrl("Consultation") + `?email=${encodeURIComponent(email)}`);
  };

  const benefits = [
    "Free security assessment",
    "Custom implementation plan",
    "Enterprise-grade protection",
    "24/7 support included"
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-16">
      <div className="glass-card-dark border-cyan-500/30 rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
          Ready to Secure Your Digital Assets?
        </h2>
        <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
          Join hundreds of enterprises protecting their infrastructure with GlyphLock
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-8">
          <Input
            type="email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="glass-card-dark border-cyan-500/30 text-white placeholder:text-white/50"
          />
          <Button 
            type="submit"
            size="lg"
            className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-black font-bold"
          >
            Get Started
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>

        <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="flex items-center gap-2 text-white">
              <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}