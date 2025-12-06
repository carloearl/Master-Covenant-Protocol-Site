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
    description: "AI-powered POS system with advanced analytics",
    link: "NUPSLogin",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/9184b512b_Whisk_b9fd7532ee1e87a9152439bac427f256dr.jpg",
    icon: Zap
  },
  {
    title: "Master Covenant",
    description: "Smart contract platform with blockchain security",
    link: "MasterCovenant",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/8f4e28351_Whisk_05f17d65a57cf59bf1a4fdd31ffd7d8edr.jpg",
    icon: FileCode
  },
  {
    title: "QR Studio",
    description: "Secure QR generation with steganography & anti-quishing",
    link: "Qr",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/ef8ed5e35_ee8d4930-e046-49b0-8beb-87745181d506.jpg",
    icon: Eye
  },
  {
    title: "Blockchain Solutions",
    description: "Decentralized security infrastructure",
    link: "Blockchain",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/b91660fea_Whisk_8fdb6d2b015dc9e846648880fcd03ca1dr.jpg",
    icon: Lock
  },
  {
    title: "Image Lab",
    description: "Advanced image processing and steganography tools",
    link: "ImageLab",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/9167e5df2_08f33231-115f-4c95-9719-682f4e9679cc.jpg",
    icon: Image
  },
  {
    title: "GlyphBot AI Assistant",
    description: "Intelligent security automation",
    link: "GlyphBot",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/0e2155dc3_Whisk_df925aca34d95e09a3b4274e0bd16f08dr.jpg",
    icon: Brain
  }
];

export default function ServicesGrid() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 pt-8 pb-16 relative" style={{ background: 'transparent' }}>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-black text-white mb-4 drop-shadow-[0_0_25px_rgba(255,255,255,0.3)]">
          Complete Security <span className="bg-gradient-to-r from-[#1E40AF] via-[#3B82F6] to-[#60A5FA] bg-clip-text text-transparent">Ecosystem</span>
        </h2>
        <p className="text-lg text-white/70">
          Integrated tools designed for enterprise-level protection
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, idx) => (
          <Link key={idx} to={createPageUrl(service.link)}>
            <div className="bg-black/60 border-2 border-[#3B82F6]/40 rounded-xl overflow-hidden group cursor-pointer hover:scale-105 transition-all duration-300 h-full shadow-[0_0_25px_rgba(59,130,246,0.2)] hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] hover:border-[#3B82F6]/60 backdrop-blur-sm">
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
                <p className="text-white/70">{service.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}