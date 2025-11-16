import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Server, Zap, Eye, Lock } from "lucide-react";

export default function ServicesGrid() {
  const services = [
    {
      title: "N.U.P.S. POS",
      description: "Enterprise point-of-sale with three-tier access control and real-time analytics.",
      link: "NUPSLogin",
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/b6f63d51b_Whisk_b9fd7532ee1e87a9152439bac427f256dr.jpg",
      price: "Enterprise",
      icon: Server
    },
    {
      title: "GlyphBot AI",
      description: "AI assistant with code execution, security scanning, and automated auditing.",
      link: "GlyphBot",
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/9774d266e_openai-logo-inspired-abstract.png",
      price: "$50/mo",
      icon: Zap
    },
    {
      title: "Visual Cryptography Suite",
      description: "Generate secure QR codes and hide encrypted data within images using LSB encoding.",
      link: "VisualCryptography",
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/584a72f27_quantum-encryption-visualization-with-glowing-part.jpg",
      price: "$179.99",
      icon: Eye
    },
    {
      title: "Blockchain Security",
      description: "SHA-256/512 hashing, Merkle trees, and immutable verification.",
      link: "Blockchain",
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/9be80d6ca_Whisk_43831818b9d5e77953345c3626f3d976eg.jpg",
      price: "$99.99",
      icon: Lock
    },
    {
      title: "Security Operations Center",
      description: "Real-time threat monitoring, interactive mapping, and security analytics.",
      link: "SecurityOperationsCenter",
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/7e319a981_Whisk_429a6543b81e30d9bab4065457f3b62ddr.jpg",
      price: "Enterprise",
      icon: Shield
    },
    {
      title: "Complete Security Ecosystem",
      description: "Comprehensive security tools with quantum-resistant encryption.",
      link: "SecurityTools",
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/11242d8a3_Whisk_ecd15257dc62aafae4b457b73ff01aa9dr.jpg",
      price: "Custom",
      icon: Shield
    }
  ];

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4 relative z-50">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Complete Security <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Ecosystem</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Integrated tools designed for enterprise-level protection
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Link key={index} to={createPageUrl(service.link)} style={{ cursor: 'pointer', pointerEvents: 'auto', position: 'relative', zIndex: 100 }}>
                <Card className="glass-royal border-blue-500/30 hover:border-blue-500/60 transition-all duration-300 h-full group cursor-pointer overflow-hidden" style={{ cursor: 'pointer', pointerEvents: 'auto', position: 'relative', zIndex: 100 }}>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-3 right-3" style={{ pointerEvents: 'auto', zIndex: 101 }}>
                      <Badge className="bg-blue-500/90 text-white border-blue-500 font-semibold">
                        {service.price}
                      </Badge>
                    </div>
                    <div className="absolute bottom-3 left-3" style={{ pointerEvents: 'none', zIndex: 10 }}>
                      <div className="bg-blue-500/20 backdrop-blur-md p-2 rounded-lg">
                        <Icon className="w-6 h-6 text-blue-400" />
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6" style={{ cursor: 'pointer', pointerEvents: 'auto', position: 'relative', zIndex: 100 }}>
                    <h3 className="text-lg font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-white/70 text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}