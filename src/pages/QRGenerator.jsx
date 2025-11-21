import React from "react";
import PaywallGuard from "@/components/PaywallGuard";
import QRGeneratorTab from "@/components/crypto/QRGeneratorTab";
import SEOHead from "@/components/SEOHead";

export default function QRGenerator() {
  return (
    <PaywallGuard serviceName="QR Generator" requirePlan="professional">
      <SEOHead 
        title="Quantum Secure QR Generator | GlyphLock"
        description="Generate quantum-resistant, steganographic QR codes protected by GlyphLock security protocols."
        url="/qr-generator"
      />
      <div className="min-h-screen bg-black text-white py-24 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#00E4FF]/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black mb-4 font-space tracking-tight">
              SECURE <span className="text-[#00E4FF]">QR GENERATOR</span>
            </h1>
            <p className="text-gray-400">
              Quantum-resistant encoding with steganographic protection layers.
            </p>
          </div>
          
          <div className="glass-card rounded-2xl border border-white/10 p-1 backdrop-blur-xl shadow-2xl shadow-black/50 max-w-5xl mx-auto">
            <QRGeneratorTab />
          </div>
        </div>
      </div>
    </PaywallGuard>
  );
}