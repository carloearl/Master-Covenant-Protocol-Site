import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Shield, Lock, Eye, FileCode } from "lucide-react";

export default function SecurityTools() {
  const tools = [
    {
      title: "Visual Cryptography Suite",
      description: "Generate secure, threat-aware QR codes and hide encrypted data within images using LSB encoding. Protect and transmit information in plain sight.",
      price: "$179.99",
      link: "QRGenerator",
      icon: Eye,
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/584a72f27_quantum-encryption-visualization-with-glowing-part.jpg"
    },
    {
      title: "Blockchain Security",
      description: "SHA-256/512 hashing, Merkle trees, block mining simulation, and cryptographic verification tools.",
      price: "$99.99",
      link: "Blockchain",
      icon: Lock,
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop"
    },
    {
      title: "HSSS Command Suite",
      description: "Premier enterprise security platform combining interactive threat mapping with real-time AI surveillance and incident tracking.",
      price: "Enterprise",
      link: "SecurityOperations",
      icon: Shield,
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/7e319a981_Whisk_429a6543b81e30d9bab4065457f3b62ddr.jpg"
    },
    {
      title: "Smart Contracts",
      description: "Generate and validate smart contracts with automated security auditing and deployment tools.",
      price: "Coming Soon",
      link: "SmartContracts",
      icon: FileCode,
      image: "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=800&h=600&fit=crop"
    }
  ];

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-black" />
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
              Security <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Tools</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Professional-grade cybersecurity suites for visual cryptography, blockchain security, and real-time surveillance.
            </p>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {tools.map((tool, index) => (
              <Link key={index} to={createPageUrl(tool.link)}>
                <Card className="bg-gray-800 border-gray-700 hover:border-blue-500/50 transition-all duration-300 h-full group cursor-pointer">
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
                      <span className={`text-sm font-semibold ${
                        tool.price === "Free" ? "text-green-400" : 
                        tool.price === "Coming Soon" ? "text-gray-400" : "text-blue-400"
                      }`}>
                        {tool.price}
                      </span>
                    </div>
                    <p className="text-gray-400 mb-4 text-sm">
                      {tool.description}
                    </p>
                    <div className="flex items-center text-blue-400 text-sm font-semibold">
                      {tool.price === "Coming Soon" ? "Learn More" : "Try Now"} <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}

            {/* Custom Solution Card */}
            <Card className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 border-blue-500/30 hover:border-blue-500/50 transition-all h-full">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                <Shield className="w-16 h-16 text-blue-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-3">
                  Custom Security Solution
                </h3>
                <p className="text-gray-400 mb-6">
                  Need a specialized security tool or enterprise solution? Our team can build it for you.
                </p>
                <Link to={createPageUrl("Contact")}>
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
                    Contact Us
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Why Choose Our <span className="text-blue-400">Security Tools?</span>
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

      {/* CTA */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6 text-white">
              Ready to Enhance Your Security?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Start using our professional security suites today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("QRGenerator")}>
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
                  Try Visual Cryptography
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