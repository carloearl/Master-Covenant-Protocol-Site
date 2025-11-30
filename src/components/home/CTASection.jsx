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
      <div className="relative bg-slate-900/90 border-2 border-[#3B82F6]/50 rounded-2xl p-8 md:p-12 text-center shadow-[0_0_60px_rgba(59,130,246,0.3)] hover:shadow-[0_0_80px_rgba(30,64,175,0.4)] transition-all duration-500">
        {/* Pulsing glow overlay */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#1E3A8A] via-[#3B82F6] to-[#1E40AF] rounded-2xl blur-xl opacity-20 animate-pulse pointer-events-none"></div>
        
        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]">
            READY TO SECURE YOUR <span className="bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] bg-clip-text text-transparent">DIGITAL ASSETS?</span>
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto font-medium">
            Join hundreds of enterprises protecting their infrastructure with GlyphLock
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-8">
            <Input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-800/80 border-2 border-[#3B82F6]/40 text-white placeholder:text-white/50 focus:border-[#3B82F6] focus:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all"
            />
            <Button 
              type="submit"
              size="lg"
              className="bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] hover:from-[#2563EB] hover:to-[#60A5FA] text-white font-black tracking-wide shadow-[0_0_25px_rgba(59,130,246,0.5)] hover:shadow-[0_0_40px_rgba(30,64,175,0.7)] transition-all duration-300"
            >
              GET STARTED
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-2 text-white font-medium">
                <CheckCircle2 className="w-5 h-5 text-[#3B82F6] flex-shrink-0 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                <span className="tracking-wide">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}