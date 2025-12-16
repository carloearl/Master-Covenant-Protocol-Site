import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Clock, Target, Rocket, Trophy } from "lucide-react";
import SEOHead from "@/components/SEOHead";

export default function Roadmap() {
  const quarters = [
    {
      quarter: "Q2 2025",
      status: "completed",
      icon: CheckCircle2,
      items: [
        { title: "Master Covenant Patent Filing", status: "completed" },
        { title: "Dream Team AI Binding", status: "completed" },
        { title: "Visual Cryptography Suite Launch", status: "completed" },
        { title: "N.U.P.S. POS MVP", status: "completed" }
      ]
    },
    {
      quarter: "Q3 2025",
      status: "completed",
      icon: CheckCircle2,
      items: [
        { title: "Security Operations Center", status: "completed" },
        { title: "GlyphBot AI Enhancement", status: "completed" },
        { title: "Blockchain Security Suite", status: "completed" },
        { title: "Enterprise Dashboard", status: "completed" },
        { title: "Stripe Payment Integration", status: "completed" },
        { title: "Governance Hub Launch", status: "completed" },
        { title: "Partners Portal", status: "completed" }
      ]
    },
    {
      quarter: "Q4 2025",
      status: "in-progress",
      icon: Rocket,
      highlight: true,
      items: [
        { title: "SEO Optimization & Sitemap", status: "completed" },
        { title: "AI Crawler Integration", status: "completed" },
        { title: "Mobile App Launch", status: "in-progress" },
        { title: "Smart Contract Generator", status: "in-progress" },
        { title: "Advanced Threat Detection", status: "in-progress" },
        { title: "SOC 2 Certification", status: "planned" }
      ]
    },
    {
      quarter: "Q1 2026",
      status: "planned",
      icon: Clock,
      items: [
        { title: "Full Quantum Encryption", status: "planned" },
        { title: "Global CDN Deployment", status: "planned" },
        { title: "Enterprise API Platform", status: "in-progress" },
        { title: "ISO 27001 Certification", status: "planned" }
      ]
    },
    {
      quarter: "Q2 2026",
      status: "planned",
      icon: Clock,
      items: [
        { title: "Multi-Language Support", status: "planned" },
        { title: "Hardware Security Key Integration", status: "planned" },
        { title: "Advanced Biometric Authentication", status: "planned" },
        { title: "Government Contract Expansion", status: "planned" }
      ]
    },
    {
      quarter: "Q3 2026",
      status: "planned",
      icon: Clock,
      items: [
        { title: "International Data Center Deployment", status: "planned" },
        { title: "AI-Powered Threat Prediction", status: "in-progress" },
        { title: "White Label Platform Release", status: "in-progress" },
        { title: "Enterprise SDK Launch", status: "in-progress" }
      ]
    },
    {
      quarter: "Q4 2026",
      status: "planned",
      icon: Clock,
      items: [
        { title: "Post-Quantum Cryptography Standard", status: "planned" },
        { title: "Decentralized Identity Verification", status: "planned" },
        { title: "GDPR & CCPA Full Compliance", status: "planned" },
        { title: "Partner Network Expansion (50+ Partners)", status: "planned" }
      ]
    },
    {
      quarter: "2027-2030",
      status: "planned",
      icon: Trophy,
      items: [
        { title: "Protocol Authority Recognition", status: "planned" },
        { title: "Global Credentialed Operator Network", status: "planned" },
        { title: "Quantum Security Standard Certification", status: "planned" },
        { title: "International Patent Portfolio Expansion", status: "planned" },
        { title: "Strategic Protocol Partnerships", status: "planned" },
        { title: "Master Covenant Framework Adoption", status: "planned" }
      ]
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case "completed": return "bg-green-500/10 text-green-400 border-green-500/30";
      case "in-progress": return "bg-[#00E4FF]/10 text-[#00E4FF] border-[#00E4FF]/30";
      default: return "bg-white/5 text-gray-400 border-white/10";
    }
  };

  return (
    <>
      <SEOHead 
        title="Product Roadmap - GlyphLock Development Timeline & Future Features"
        description="Explore GlyphLock's product roadmap from Q4 2025 through 2030: AI enhancements, quantum encryption, enterprise expansion, government contracts, international deployment, and $1B+ valuation milestones."
        keywords="cybersecurity roadmap, product development timeline, AI security features, quantum encryption roadmap, enterprise expansion plan, GlyphLock future, technology milestones, security platform development, innovation timeline"
        url="/roadmap"
      />
      <div className="min-h-screen bg-black text-white py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#00E4FF]/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#8C4BFF]/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="container mx-auto px-6 max-w-5xl relative z-10">
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-7xl font-black mb-6 font-space tracking-tighter">
              PRODUCT <span className="text-transparent bg-gradient-to-r from-[#00E4FF] to-[#8C4BFF] bg-clip-text">ROADMAP</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Protocol expansion milestones and enforcement authority maturity.
            </p>
          </div>

          <div className="relative space-y-12">
            {/* Vertical Line */}
            <div className="absolute left-[27px] md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#00E4FF] via-[#8C4BFF] to-transparent hidden md:block opacity-30"></div>

            {quarters.map((quarter, idx) => {
              const Icon = quarter.icon;
              return (
                <div key={idx} className={`relative flex md:items-center gap-8 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  
                  {/* Timeline Dot */}
                  <div className="absolute left-[19px] md:left-1/2 top-8 w-4 h-4 bg-[#000000] border-2 border-[#00E4FF] rounded-full transform md:-translate-x-1/2 z-20 shadow-[0_0_10px_rgba(0,228,255,0.5)] hidden md:block"></div>

                  {/* Content Card */}
                  <div className="flex-1">
                    <div className={`glass-card rounded-2xl border p-8 transition-all hover:scale-[1.02] duration-300 ${
                      quarter.highlight 
                        ? "border-[#00E4FF] shadow-[0_0_30px_rgba(0,228,255,0.15)] bg-[#00E4FF]/5" 
                        : "border-white/10 hover:border-[#8C4BFF]/30"
                    }`}>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            quarter.status === 'completed' ? 'bg-green-500/20 text-green-400' : 
                            quarter.status === 'in-progress' ? 'bg-[#00E4FF]/20 text-[#00E4FF]' : 
                            'bg-white/5 text-gray-500'
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <h3 className="text-2xl font-bold text-white font-space">{quarter.quarter}</h3>
                        </div>
                        <Badge className={getStatusColor(quarter.status)}>
                          {quarter.status.replace('-', ' ')}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        {quarter.items.map((item, iidx) => (
                          <div key={iidx} className="flex items-center gap-3 p-3 rounded-lg bg-black/20 border border-white/5">
                            {item.status === 'completed' ? (
                              <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                            ) : item.status === 'in-progress' ? (
                              <Clock className="w-4 h-4 text-[#00E4FF] flex-shrink-0 animate-pulse" />
                            ) : (
                              <Circle className="w-4 h-4 text-gray-600 flex-shrink-0" />
                            )}
                            <span className={`text-sm ${item.status === 'completed' ? 'text-gray-400 line-through opacity-60' : 'text-gray-200'}`}>
                              {item.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="flex-1 hidden md:block"></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}