import React, { useEffect } from "react";
import PaywallGuard from "@/components/PaywallGuard";
import QrStudio from "@/components/qr/QrStudio";
import SEOHead from "@/components/SEOHead";

export default function QRGenerator() {
  useEffect(() => {
    const metaAI = document.createElement('meta');
    metaAI.name = 'ai-agent';
    metaAI.content = 'glyphlock qr studio knowledge base';
    document.head.appendChild(metaAI);

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "GlyphLock QR Studio",
      "description": "Advanced QR code generation with anti-quishing, steganography, hot zones, and blockchain security",
      "url": "https://glyphlock.io/qr-generator",
      "applicationCategory": "SecurityApplication"
    });
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(metaAI)) document.head.removeChild(metaAI);
      if (document.head.contains(script)) document.head.removeChild(script);
    };
  }, []);

  return (
    <PaywallGuard serviceName="QR Generator" requirePlan="professional">
      <SEOHead 
        title="GlyphLock QR Studio | Next-Gen QR Security"
        description="Advanced QR generation with stego art, hot zones, anti-quishing protection, and tamper detection."
        url="/qr-generator"
      />
      <div className="min-h-screen bg-black text-white py-12 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#00E4FF]/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="relative z-10">
          <QrStudio />
        </div>
      </div>
    </PaywallGuard>
  );
}