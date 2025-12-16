import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Shield, Zap, Eye, Brain, Lock, FileCode, Image } from "lucide-react";

/**
 * PHASE 3B SERVICES GRID
 * QR Studio is the ONLY QR link - points to /Qr
 * Hotzone Mapper REMOVED (it's an Image Suite tool, not a security product)
 */

const services = [
  {
    title: "NEXUS N.U.P.S.",
    description: "Transaction verification module – governed by protocol, accessible only with provisioned credentials",
    link: "NUPSLogin",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/9184b512b_Whisk_b9fd7532ee1e87a9152439bac427f256dr.jpg",
    icon: Zap
  },
  {
    title: "Master Covenant",
    description: "Binding protocol system – cryptographic governance restricted to authorized accounts",
    link: "MasterCovenant",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/8f4e28351_Whisk_05f17d65a57cf59bf1a4fdd31ffd7d8edr.jpg",
    icon: FileCode
  },
  {
    title: "QR Verification Module",
    description: "Cryptographic QR generation with steganographic encoding – protocol-enforced access control",
    link: "Qr",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/ef8ed5e35_ee8d4930-e046-49b0-8beb-87745181d506.jpg",
    icon: Eye
  },
  {
    title: "Blockchain Verification",
    description: "Immutable ledger module – system-enforced capability restricted to credentialed operators",
    link: "Blockchain",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/b91660fea_Whisk_8fdb6d2b015dc9e846648880fcd03ca1dr.jpg",
    icon: Lock
  },
  {
    title: "Image Processing Module",
    description: "Steganographic encoding system – operating under protocol-governed authorization",
    link: "ImageLab",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/9167e5df2_08f33231-115f-4c95-9719-682f4e9679cc.jpg",
    icon: Image
  },
  {
    title: "GlyphBot Intelligence Module",
    description: "Autonomous security analysis – AI-driven threat suppression with credentialed access",
    link: "GlyphBot",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/0e2155dc3_Whisk_df925aca34d95e09a3b4274e0bd16f08dr.jpg",
    icon: Brain
  }
];

export default function ServicesGrid() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 pt-8 pb-16 relative" style={{ background: 'transparent', pointerEvents: 'auto' }}>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-black text-white mb-4 drop-shadow-[0_0_25px_rgba(255,255,255,0.3)]">
          Credentialed Integrity <span className="bg-gradient-to-r from-[#1E40AF] via-[#3B82F6] to-[#60A5FA] bg-clip-text text-transparent">System</span>
        </h2>
        <p className="text-lg text-white/90">
          Protocol-governed modules restricted to provisioned access
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, idx) => (
          <Link key={idx} to={createPageUrl(service.link)}>
            <div className="backdrop-blur-md border-2 border-indigo-500/60 rounded-xl overflow-hidden group cursor-pointer hover:scale-[1.03] transition-all duration-600 ease-out h-full shadow-[0_0_30px_rgba(87,61,255,0.4)] hover:shadow-[0_0_60px_rgba(87,61,255,0.7)] hover:border-indigo-400/80" style={{ background: 'rgba(87,61,255,0.08)' }}>
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <service.icon className="w-6 h-6 text-[#3B82F6] drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                  <h3 className="text-xl font-bold text-white">{service.title}</h3>
                </div>
                <p className="text-white/90">{service.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}