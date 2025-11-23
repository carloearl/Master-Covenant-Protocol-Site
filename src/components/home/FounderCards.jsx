import React from 'react';
import DreamTeamCard from '@/components/DreamTeamCard';
import { Shield, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function FounderCards() {
  const founders = [
    {
      name: "Carlo Rene Earl",
      position: "Founder & Owner",
      role: "Chief Executive Officer",
      class: "Leadership - Visionary",
      frontImage: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/carlo-card-front.jpg",
      bindingType: "FOUNDER_COVENANT",
      quote: "Building the future of quantum-resistant security for the AI era",
      binding: {
        method: "Master Covenant Architect",
        mechanism: "Patent Application No. 18/584,961",
        covenant: "GlyphLock Security Framework Pioneer"
      },
      signature: `╔═══════════════════════════╗
║   CARLO RENE EARL         ║
║   FOUNDER & CEO           ║
╠═══════════════════════════╣
║ FOUNDED: January 2025     ║
║ LOCATION: El Mirage, AZ   ║
║ VISION: Quantum Security  ║
╚═══════════════════════════╝
★ Master Covenant Creator
★ Patent Application Lead
★ Security Architecture`
    },
    {
      name: "Collin Vanderginst",
      position: "Chief Technology Officer",
      role: "CTO & Co-Founder",
      class: "Technology - Architect",
      frontImage: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/collin-card-front.jpg",
      bindingType: "TECHNICAL_LEADERSHIP",
      quote: "Engineering secure, scalable systems that protect what matters most",
      binding: {
        method: "Technical Infrastructure Lead",
        mechanism: "Full-Stack Security Architecture",
        covenant: "Platform Engineering & AI Integration"
      },
      signature: `╔═══════════════════════════╗
║   COLLIN VANDERGINST      ║
║   CHIEF TECHNOLOGY        ║
╠═══════════════════════════╣
║ ROLE: Platform Architect  ║
║ FOCUS: AI/Security Ops    ║
║ EXPERTISE: Full-Stack     ║
╚═══════════════════════════╝
⚡ GlyphBot Architecture
⚡ NUPS POS Development
⚡ Blockchain Integration`
    },
    {
      name: "Jacub Lough",
      position: "CSO & CFO",
      role: "Chief Security Officer & Chief Financial Officer",
      class: "Security - Operations",
      frontImage: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/jacub-card-front.jpg",
      bindingType: "SECURITY_OPERATIONS",
      quote: "Securing operations with financial precision and strategic oversight",
      binding: {
        method: "Dual Executive Authority",
        mechanism: "Security Operations & Financial Control",
        covenant: "Enterprise Risk Management Framework"
      },
      signature: `╔═══════════════════════════╗
║   JACUB LOUGH             ║
║   CSO & CFO               ║
╠═══════════════════════════╣
║ SECURITY: Threat Analysis ║
║ FINANCE: Strategic Ops    ║
║ COMPLIANCE: SOC 2 Ready   ║
╚═══════════════════════════╝
🛡️ Security Operations
💼 Financial Oversight
📊 Risk Management`
    }
  ];

  return (
    <section className="py-12 md:py-24 relative overflow-hidden bg-black">
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-blue-500/5" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8 md:mb-16">
          <Badge className="mb-4 md:mb-6 bg-cyan-500/20 text-cyan-400 border-cyan-500/50 px-4 md:px-6 py-1.5 md:py-2 text-xs md:text-sm backdrop-blur-md">
            <Users className="w-3 h-3 md:w-4 md:h-4 mr-2" />
            Leadership Team - GlyphLock Founders
          </Badge>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 px-4">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-600 bg-clip-text text-transparent">
              Meet The Founders
            </span>
          </h2>
          <p className="text-base md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-3 md:mb-4 px-4">
            <span className="hidden md:inline">Click each card to flip and view founder details, expertise, and leadership vision</span>
            <span className="md:hidden">Tap cards to flip for founder details</span>
          </p>
          <p className="text-xs md:text-sm text-gray-500 px-4">
            Founded January 2025 • El Mirage, Arizona
          </p>
        </div>

        {/* Mobile: Single Card Carousel */}
        <div className="block md:hidden mb-16">
          <div className="relative max-w-md mx-auto">
            <div className="overflow-x-auto snap-x snap-mandatory scrollbar-hide">
              <div className="flex gap-4 px-4">
                {founders.map((founder, idx) => (
                  <div key={idx} className="snap-center flex-shrink-0 w-[85vw] max-w-sm">
                    <DreamTeamCard card={founder} />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center gap-2 mt-6">
              {founders.map((_, idx) => (
                <div key={idx} className="w-2 h-2 rounded-full bg-cyan-500/30" />
              ))}
            </div>
          </div>
        </div>

        {/* Desktop: Grid Layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {founders.map((founder, idx) => (
            <DreamTeamCard key={idx} card={founder} />
          ))}
        </div>

        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>

        {/* Company Info */}
        <div className="max-w-4xl mx-auto">
          <div className="glass-card backdrop-blur-xl bg-cyan-500/5 border-cyan-500/30 p-6 md:p-8 rounded-xl md:rounded-2xl">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-cyan-400" />
              <h3 className="text-xl md:text-2xl font-bold text-white">
                GlyphLock Security LLC
              </h3>
            </div>
            <p className="text-gray-300 text-center mb-4 text-sm md:text-base px-2">
              Founded in January 2025, GlyphLock Security is pioneering quantum-resistant cybersecurity solutions 
              for the AI era. Based in El Mirage, Arizona, our team combines deep technical expertise with 
              innovative security frameworks to protect enterprises worldwide.
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 md:p-4">
                <div className="text-lg md:text-2xl font-bold text-cyan-400 mb-1">2025</div>
                <div className="text-xs text-gray-400">Founded</div>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 md:p-4">
                <div className="text-lg md:text-2xl font-bold text-blue-400 mb-1">3</div>
                <div className="text-xs text-gray-400">Founders</div>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 md:p-4">
                <div className="text-lg md:text-2xl font-bold text-purple-400 mb-1">AZ</div>
                <div className="text-xs text-gray-400">El Mirage</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}