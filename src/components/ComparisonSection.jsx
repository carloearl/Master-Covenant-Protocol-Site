import React from 'react';
import { Check, X } from 'lucide-react';

export default function ComparisonSection() {
  const features = [
    { name: "Post-Quantum Encryption", glyphlock: true, competitors: false },
    { name: "AI Threat Detection", glyphlock: true, competitors: "Limited" },
    { name: "24/7 Monitoring", glyphlock: true, competitors: true },
    { name: "Zero-Trust Architecture", glyphlock: true, competitors: false },
    { name: "Real-Time Security Audits", glyphlock: true, competitors: false },
    { name: "Blockchain Verification", glyphlock: true, competitors: false },
    { name: "Visual Cryptography Suite", glyphlock: true, competitors: false },
    { name: "Response Time", glyphlock: "<1ms", competitors: ">5ms" },
    { name: "Multi-Factor Authentication", glyphlock: true, competitors: true },
    { name: "Compliance Automation", glyphlock: true, competitors: "Partial" }
  ];

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Why <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">GlyphLock</span> Stands Out
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Compare our enterprise security features with traditional solutions
          </p>
        </div>

        <div className="max-w-4xl mx-auto glass-royal rounded-2xl overflow-hidden border-blue-500/30">
          <div className="grid grid-cols-3 bg-blue-500/20 p-4 border-b border-blue-500/30">
            <div className="text-white font-semibold">Feature</div>
            <div className="text-center">
              <div className="text-white font-bold text-lg">GlyphLock</div>
            </div>
            <div className="text-center text-white font-semibold">Traditional Solutions</div>
          </div>

          {features.map((feature, idx) => (
            <div
              key={idx}
              className={`grid grid-cols-3 p-4 items-center ${
                idx % 2 === 0 ? 'glass-dark' : 'bg-blue-500/5'
              } border-b border-blue-500/10`}
            >
              <div className="text-white font-medium">{feature.name}</div>
              <div className="flex justify-center">
                {typeof feature.glyphlock === 'boolean' ? (
                  feature.glyphlock ? (
                    <div className="bg-green-500/20 p-2 rounded-full">
                      <Check className="w-5 h-5 text-green-400" />
                    </div>
                  ) : (
                    <div className="bg-red-500/20 p-2 rounded-full">
                      <X className="w-5 h-5 text-red-400" />
                    </div>
                  )
                ) : (
                  <span className="text-blue-400 font-bold">{feature.glyphlock}</span>
                )}
              </div>
              <div className="flex justify-center">
                {typeof feature.competitors === 'boolean' ? (
                  feature.competitors ? (
                    <div className="bg-green-500/20 p-2 rounded-full">
                      <Check className="w-5 h-5 text-green-400" />
                    </div>
                  ) : (
                    <div className="bg-red-500/20 p-2 rounded-full">
                      <X className="w-5 h-5 text-red-400" />
                    </div>
                  )
                ) : (
                  <span className="text-white/60">{feature.competitors}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}