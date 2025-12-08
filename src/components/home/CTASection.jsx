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
    <div className="w-full max-w-5xl mx-auto px-4 py-16 relative" style={{ background: 'transparent', pointerEvents: 'auto' }}>
      <div className="relative backdrop-blur-xl border-2 border-indigo-500/60 rounded-2xl p-8 md:p-12 text-center shadow-[0_0_50px_rgba(87,61,255,0.5)] hover:shadow-[0_0_80px_rgba(87,61,255,0.7)] transition-all duration-600 ease-out" style={{ background: 'rgba(87,61,255,0.08)' }}>
        {/* Pulsing glow overlay */}
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 via-violet-500 to-blue-600 rounded-2xl blur-xl opacity-30 animate-pulse pointer-events-none"></div>
        
        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]">
            READY TO SECURE YOUR <span className="bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] bg-clip-text text-transparent">DIGITAL ASSETS?</span>
          </h2>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto font-medium">
            Join hundreds of enterprises protecting their infrastructure with GlyphLock
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-8">
            <Input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/8 backdrop-blur-md border-2 border-white/20 text-white placeholder:text-white/50 focus:border-indigo-400 focus:shadow-[0_0_30px_rgba(87,61,255,0.5)] transition-all"
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