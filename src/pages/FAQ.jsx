import React, { useEffect } from "react";
import { HelpCircle } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import FaqSectionGlyphPanel from "@/components/faq/FaqSectionGlyphPanel";

export default function FAQ() {
  useEffect(() => {
    const metaAI = document.createElement('meta');
    metaAI.name = 'ai-agent';
    metaAI.content = 'glyphlock faq knowledge base';
    document.head.appendChild(metaAI);

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "name": "GlyphLock FAQ",
      "url": "https://glyphlock.io/faq"
    });
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(metaAI)) document.head.removeChild(metaAI);
      if (document.head.contains(script)) document.head.removeChild(script);
    };
  }, []);

  return (
    <>
      <SEOHead 
        title="FAQ - Frequently Asked Questions | GlyphLock Help Center"
        description="Find answers to common questions about GlyphLock's cybersecurity platform, pricing, security tools, AI features, NUPS POS system, and technical support."
        keywords="FAQ, help center, support, pricing questions, security tools, GlyphBot AI, NUPS POS, technical support, customer service"
        url="/faq"
      />
      
      <div className="min-h-screen bg-black text-white py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#001F54]/20 to-transparent pointer-events-none"></div>
        
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#00E4FF]/10 rounded-2xl mb-6 border border-[#00E4FF]/20">
              <HelpCircle className="w-8 h-8 text-[#00E4FF]" />
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-6 font-space tracking-tight">
              FREQUENTLY ASKED <span className="text-transparent bg-gradient-to-r from-[#00E4FF] to-[#8C4BFF] bg-clip-text">QUESTIONS</span>
            </h1>
            <p className="text-xl text-gray-400">
              Everything you need to know about the GlyphLock ecosystem.
            </p>
          </div>

          <FaqSectionGlyphPanel />

          <div className="glass-card rounded-2xl border border-[#8C4BFF]/30 p-8 text-center mt-16 bg-[#8C4BFF]/5">
            <h3 className="text-2xl font-bold text-white mb-4 font-space">Still Need Help?</h3>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
              Our security specialists are available 24/7 for enterprise clients, and within 24 hours for all users.
            </p>
            <a
              href="mailto:glyphlock@gmail.com"
              className="inline-flex items-center justify-center bg-gradient-to-r from-[#00E4FF] to-[#8C4BFF] hover:scale-105 text-black font-bold uppercase tracking-wide px-8 py-4 rounded-xl shadow-lg transition-all"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </>
  );
}