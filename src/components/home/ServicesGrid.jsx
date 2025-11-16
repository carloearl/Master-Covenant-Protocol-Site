import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Shield, Zap, Eye, Brain, Lock, FileCode } from "lucide-react";

const services = [
  {
    title: "NEXUS N.U.P.S.",
    description: "AI-powered POS system with advanced analytics",
    link: "NUPSLogin",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
    price: "Enterprise",
    icon: Zap
  },
  {
    title: "Master Covenant",
    description: "Smart contract platform with blockchain security",
    link: "MasterCovenant",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80",
    price: "$50/mo",
    icon: FileCode
  },
  {
    title: "Visual Cryptography",
    description: "QR generation and steganography tools",
    link: "VisualCryptography",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80",
    price: "$179.99",
    icon: Eye
  },
  {
    title: "Blockchain Solutions",
    description: "Decentralized security infrastructure",
    link: "Blockchain",
    image: "https://images.unsplash.com/photo-1639762681057-408e52192e55?w=800&q=80",
    price: "$99.99",
    icon: Lock
  },
  {
    title: "Security Operations Center",
    description: "24/7 threat monitoring and response",
    link: "SecurityOperationsCenter",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
    price: "Enterprise",
    icon: Shield
  },
  {
    title: "GlyphBot AI Assistant",
    description: "Intelligent security automation",
    link: "GlyphBot",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    price: "Custom",
    icon: Brain
  }
];

export default function ServicesGrid() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
          Complete Security Ecosystem
        </h2>
        <p className="text-lg text-white/70">
          Integrated tools designed for enterprise-level protection
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, idx) => (
          <Link key={idx} to={createPageUrl(service.link)}>
            <div className="glass-card rounded-xl overflow-hidden group cursor-pointer hover:scale-105 transition-all duration-300 h-full">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-blue-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white">
                  {service.price}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <service.icon className="w-6 h-6 text-blue-400" />
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