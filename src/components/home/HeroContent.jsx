import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Shield, Lock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function HeroContent() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-16 relative" style={{ background: 'transparent', pointerEvents: 'auto' }}>
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 text-white tracking-tight drop-shadow-[0_0_30px_rgba(255,255,255,0.3)] leading-tight">
          THE FUTURE OF SECURITY ISN'T COMING — <span className="bg-gradient-to-r from-[#1E40AF] via-[#3B82F6] to-[#60A5FA] bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(59,130,246,0.8)] animate-pulse">IT'S ALREADY HERE.</span>
        </h1>
        <p className="text-xl md:text-2xl text-white max-w-4xl mx-auto mb-6 font-medium leading-relaxed">
          Quantum-immune authentication, autonomous threat suppression, and AI-driven audit intelligence designed for infrastructures that cannot afford to fail.
        </p>
        <Badge className="mb-10 bg-white/10 backdrop-blur-md border-2 border-white/20 text-white px-6 py-2 shadow-[0_0_30px_rgba(87,61,255,0.5)]">
          <span className="font-black tracking-[0.2em] text-sm">PQC-HARDENED | ZERO-TRUST AI | SUB-MILLISECOND RESPONSE</span>
        </Badge>
        
        <div className="flex items-center justify-center gap-6 mb-12">
          <div className="bg-white/15 backdrop-blur-md backdrop-saturate-150 border border-white/20 px-6 py-4 rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_45px_rgba(59,130,246,0.5)] hover:bg-white/20 transition-all duration-600 ease-out">
            <Lock className="w-6 h-6 text-[#60A5FA] mx-auto mb-2 drop-shadow-[0_0_15px_rgba(96,165,250,1)]" />
            <div className="text-sm text-white font-bold tracking-wider">AES-256</div>
          </div>
          <div className="bg-white/15 backdrop-blur-md backdrop-saturate-150 border border-white/20 px-6 py-4 rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_45px_rgba(59,130,246,0.5)] hover:bg-white/20 transition-all duration-600 ease-out">
            <Shield className="w-6 h-6 text-[#60A5FA] mx-auto mb-2 drop-shadow-[0_0_15px_rgba(96,165,250,1)]" />
            <div className="text-sm text-white font-bold tracking-wider">PQC KEY EXCHANGE</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to={createPageUrl("Consultation")}>
            <Button size="lg" className="bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] hover:from-[#2563EB] hover:to-[#60A5FA] text-white text-lg px-8 font-black tracking-wide shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:shadow-[0_0_50px_rgba(30,64,175,0.7)] transition-all duration-300">
              BOOK FREE CONSULTATION
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link to={createPageUrl("SecurityTools")}>
            <Button size="lg" variant="outline" className="border-2 border-[#3B82F6]/60 text-white hover:bg-[#1E40AF]/20 text-lg px-8 font-bold tracking-wide shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_35px_rgba(30,64,175,0.5)] transition-all duration-300">
              EXPLORE SECURITY ECOSYSTEM
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {[
          { label: "THREATS DETECTED", value: "500K+", icon: Shield },
          { label: "AI MONITORING", value: "24/7", icon: Lock },
          { label: "ENCRYPTION", value: "AES-256", icon: Lock },
          { label: "RESPONSE TIME", value: "<1ms", icon: Shield }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white/15 backdrop-blur-md backdrop-saturate-150 border border-white/20 p-6 rounded-xl text-center shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(59,130,246,0.4)] hover:bg-white/20 hover:border-white/30 transition-all duration-600 ease-out group">
              <Icon className="w-8 h-8 text-[#60A5FA] mx-auto mb-3 drop-shadow-[0_0_15px_rgba(96,165,250,1)] group-hover:scale-110 transition-transform duration-300" />
              <div className="text-3xl font-black text-white mb-2 tracking-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">{stat.value}</div>
              <div className="text-sm text-white font-bold tracking-wider">{stat.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}