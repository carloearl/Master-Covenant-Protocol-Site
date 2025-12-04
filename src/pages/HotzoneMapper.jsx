import React from "react";
import SEOHead from "@/components/SEOHead";
import { MapPin, Shield, AlertTriangle } from "lucide-react";

export default function HotzoneMapper() {
  return (
    <>
      <SEOHead 
        title="Hotzone Mapper - Security Threat Visualization | GlyphLock"
        description="Visualize and map security threats with GlyphLock's Hotzone Mapper. Real-time threat detection and geographic security analysis."
        keywords="security mapping, threat visualization, hotzone detection, security analysis, geographic threats"
        url="/hotzone-mapper"
      />
      <div className="min-h-screen bg-black text-white py-24 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#3B82F6]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#7C3AED]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          {/* Hero */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/30 mb-6">
              <MapPin className="w-4 h-4 text-[#3B82F6]" />
              <span className="text-sm text-[#3B82F6] font-medium">Security Visualization</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
              HOTZONE <span className="text-transparent bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] bg-clip-text">MAPPER</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Real-time security threat visualization and geographic mapping for enterprise protection.
            </p>
          </div>

          {/* Placeholder Content */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {[
              { icon: MapPin, title: "Geographic Mapping", desc: "Visualize threats across locations" },
              { icon: Shield, title: "Real-time Detection", desc: "Live threat monitoring and alerts" },
              { icon: AlertTriangle, title: "Risk Assessment", desc: "Automated threat level analysis" }
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-900/80 border-2 border-[#3B82F6]/30 rounded-xl p-6 shadow-[0_0_25px_rgba(59,130,246,0.2)]">
                <item.icon className="w-8 h-8 text-[#3B82F6] mb-4 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Coming Soon Notice */}
          <div className="text-center p-8 rounded-2xl bg-slate-900/60 border-2 border-[#7C3AED]/30">
            <h2 className="text-2xl font-bold text-white mb-4">Full Feature Coming Soon</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              The Hotzone Mapper is currently in development. Contact us for early access to our 
              security threat visualization platform.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}