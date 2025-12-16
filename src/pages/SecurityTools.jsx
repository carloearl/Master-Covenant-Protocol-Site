import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Shield, Lock, Eye, Zap, Server, Activity } from "lucide-react";
import SEOHead from "@/components/SEOHead";

export default function SecurityTools() {
  const tools = [
    {
      title: "QR Verification Module",
      description: "Cryptographic QR generation with steganographic encoding – governed by protocol, accessible only with provisioned credentials.",
      price: "Credentialed",
      link: "Qr",
      icon: Eye,
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/584a72f27_quantum-encryption-visualization-with-glowing-part.jpg"
    },
    {
      title: "Blockchain Verification Module",
      description: "Immutable ledger integrity – protocol-enforced verification with cryptographic governance.",
      price: "Credentialed",
      link: "Blockchain",
      icon: Lock,
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/9be80d6ca_Whisk_43831818b9d5e77953345c3626f3d976eg.jpg"
    },
    {
      title: "Security Operations Module",
      description: "System-enforced threat monitoring – credentialed access to real-time intelligence.",
      price: "Credentialed",
      link: "SecurityOperationsCenter",
      icon: Activity,
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/7e319a981_Whisk_429a6543b81e30d9bab4065457f3b62ddr.jpg"
    },
    {
      title: "GlyphBot Intelligence Module",
      description: "Autonomous security analysis – AI-driven threat suppression restricted to credentialed operators.",
      price: "Credentialed",
      link: "GlyphBot",
      icon: Zap,
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/9774d266e_openai-logo-inspired-abstract.png"
    },
    {
      title: "NUPS Transaction Verification",
      description: "Protocol-governed transaction module – system-enforced verification restricted to authorized venues.",
      price: "Credentialed",
      link: "NUPSLogin",
      icon: Server,
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/b6f63d51b_Whisk_b9fd7532ee1e87a9152439bac427f256dr.jpg"
    }
  ];

  return (
    <>
      <SEOHead
        title="Security Tools | GlyphLock Cybersecurity Suite"
        description="Professional cybersecurity toolkit: QR security, steganography, blockchain verification, AI threat detection, and secure POS systems for enterprise protection."
        url="/security-tools"
      />
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
              Credentialed Verification <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">System</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Protocol-governed modules for cryptographic verification, blockchain integrity, and system-enforced monitoring.
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
              Why Deploy <span className="text-blue-400">Protocol-Governed Verification?</span>
            </h2>
            <p className="text-gray-400 mb-12">
              System-enforced capabilities restricted to credentialed operators
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">System-Enforced Verification</h3>
                <p className="text-gray-400">Quantum-resistant cryptographic governance</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Autonomous Intelligence</h3>
                <p className="text-gray-400">AI-driven threat suppression with protocol enforcement</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Credentialed Integrity</h3>
                <p className="text-gray-400">Protocol-governed modules with provisioned access</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20" style={{ background: 'transparent' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6 text-white">
              Ready to Deploy Credentialed Verification?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Initiate protocol-governed access to system-enforced modules
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("Qr")}>
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
                  Access QR Module
                </Button>
              </Link>
              <Link to={createPageUrl("Consultation")}>
                <Button size="lg" variant="outline" className="border-blue-500/50 hover:bg-blue-500/10 text-white">
                  Request Credentials
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}