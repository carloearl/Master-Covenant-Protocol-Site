import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Shield, Lock, Eye, Zap, Server, Activity } from "lucide-react";

export default function SecurityTools() {
  const tools = [
    {
      title: "QR Studio & Visual Cryptography",
      description: "Generate secure, threat-aware QR codes and hide encrypted data within images using LSB encoding.",
      price: "$179.99",
      link: "Qr",
      icon: Eye,
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/584a72f27_quantum-encryption-visualization-with-glowing-part.jpg"
    },
    {
      title: "Blockchain Security",
      description: "SHA-256/512 hashing, Merkle trees, block mining simulation, and cryptographic verification tools.",
      price: "$99.99",
      link: "Blockchain",
      icon: Lock,
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/9be80d6ca_Whisk_43831818b9d5e77953345c3626f3d976eg.jpg"
    },
    {
      title: "Security Operations Center",
      description: "Real-time threat monitoring, interactive mapping, and comprehensive security analytics.",
      price: "Enterprise",
      link: "SecurityOperationsCenter",
      icon: Activity,
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/7e319a981_Whisk_429a6543b81e30d9bab4065457f3b62ddr.jpg"
    },
    {
      title: "GlyphBot AI",
      description: "AI assistant with code execution, security scanning, and automated auditing capabilities.",
      price: "$50/mo",
      link: "GlyphBot",
      icon: Zap,
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/9774d266e_openai-logo-inspired-abstract.png"
    },
    {
      title: "N.U.P.S. POS",
      description: "Enterprise point-of-sale with three-tier access control and real-time analytics.",
      price: "Enterprise",
      link: "NUPSLogin",
      icon: Server,
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/b6f63d51b_Whisk_b9fd7532ee1e87a9152439bac427f256dr.jpg"
    }
  ];

  return (
    <div className="text-white min-h-screen" style={{ background: 'transparent' }}>
      <section className="relative py-20 overflow-hidden" style={{ background: 'transparent' }}>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)",
          backgroundSize: "50px 50px"
        }} />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Complete Security <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Ecosystem</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Professional-grade cybersecurity suites for visual cryptography, blockchain security, and real-time surveillance.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20" style={{ background: 'transparent' }}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {tools.map((tool, index) => (
              <Link key={index} to={createPageUrl(tool.link)}>
                <Card className="glass-card-dark border-blue-500/30 hover:border-blue-500/50 transition-all duration-300 h-full group cursor-pointer" style={{background: 'rgba(30, 58, 138, 0.2)', backdropFilter: 'blur(16px)'}}>
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <img 
                      src={tool.image}
                      alt={tool.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-800 via-gray-800/50 to-transparent" />
                    <div className="absolute top-4 right-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                        <tool.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                        {tool.title}
                      </h3>
                      <span className="text-sm font-semibold text-blue-400">
                        {tool.price}
                      </span>
                    </div>
                    <p className="text-gray-400 mb-4 text-sm">
                      {tool.description}
                    </p>
                    <div className="flex items-center text-blue-400 text-sm font-semibold">
                      Try Now <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20" style={{ background: 'transparent' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Why Choose Our <span className="text-blue-400">Complete Security Ecosystem?</span>
            </h2>
            <p className="text-gray-400 mb-12">
              Enterprise-grade security features for modern threats
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Enterprise Security</h3>
                <p className="text-gray-400">Military-grade encryption and security standards</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">AI-Powered</h3>
                <p className="text-gray-400">Real-time threat detection with machine learning</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Comprehensive Suites</h3>
                <p className="text-gray-400">Integrated tools for complete protection</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20" style={{ background: 'transparent' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6 text-white">
              Ready to Enhance Your Security?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Start using our professional security suites today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("Qr")}>
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
                  Try QR Studio
                </Button>
              </Link>
              <Link to={createPageUrl("Consultation")}>
                <Button size="lg" variant="outline" className="border-blue-500/50 hover:bg-blue-500/10 text-white">
                  Get Expert Help
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}