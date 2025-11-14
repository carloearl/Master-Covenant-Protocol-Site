import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Shield, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email) {
      navigate(createPageUrl("Consultation") + `?email=${encodeURIComponent(email)}`);
    }
  };

  const services = [
    {
      title: "N.U.P.S. POS",
      description: "Enterprise point-of-sale system with three-tier access control and real-time analytics.",
      link: "NUPSLogin",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
      price: "Enterprise"
    },
    {
      title: "GlyphBot AI",
      description: "Advanced AI assistant with code execution, security scanning, and automated auditing.",
      link: "GlyphBot",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
      price: "$50/mo"
    },
    {
      title: "QR Security",
      description: "Secure QR generation with AI threat detection and custom branding capabilities.",
      link: "QRGenerator",
      image: "https://images.unsplash.com/photo-1616432043562-3671ea2e5242?w=800&h=600&fit=crop",
      price: "$49.99"
    },
    {
      title: "Steganography",
      description: "Hide encrypted data within images using LSB encoding for covert communications.",
      link: "Steganography",
      image: "https://images.unsplash.com/photo-1633265486064-086b219458ec?w=800&h=600&fit=crop",
      price: "$149.99"
    },
    {
      title: "Blockchain Security",
      description: "SHA-256/512 hashing, Merkle trees, and immutable verification systems.",
      link: "Blockchain",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop",
      price: "$99.99"
    },
    {
      title: "Hotzone Mapper",
      description: "Interactive vulnerability mapping with severity tracking and threat analysis.",
      link: "HotzoneMapper",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
      price: "$99.99"
    },
    {
      title: "HSSS Surveillance",
      description: "Real-time threat monitoring with AI detection and incident tracking.",
      link: "HSSS",
      image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&h=600&fit=crop",
      price: "Enterprise"
    },
    {
      title: "Security Suite",
      description: "Comprehensive security tools with quantum-resistant encryption.",
      link: "SecurityTools",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=600&fit=crop",
      price: "Custom"
    }
  ];

  const partners = [
    { name: "AWS" },
    { name: "Google Cloud" },
    { name: "Microsoft Azure" },
    { name: "Stripe" },
    { name: "OpenAI" },
    { name: "Vercel" },
    { name: "Supabase" },
    { name: "MongoDB" }
  ];

  return (
    <div className="bg-black text-white">
      {/* Hero Section - Full Screen Video */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-contain md:object-cover bg-black"
        >
          <source src="https://glyph-merge-pro-glyphlock.replit.app/assets/hero-video-CxU5xRpe.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />
      </section>

      {/* Tagline Section - Below Video */}
      <section className="relative bg-black py-16 z-10 border-t border-blue-500/20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-5xl mx-auto">
            <p className="text-gray-400 text-lg md:text-xl font-medium tracking-wider uppercase mb-6">
              Invisible Layers. Infinite Possibilities. Absolute Protection.
            </p>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-white">Universal Security Platform</span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-blue-600 to-blue-700 bg-clip-text text-transparent">
                with Smart Contracts
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
              Enterprise cybersecurity with AI integration and $14M liability coverage.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("Consultation")}>
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-lg px-8">
                  Get Started
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to={createPageUrl("SecurityTools")}>
                <Button size="lg" variant="outline" className="border-blue-500/50 hover:bg-blue-500/10 text-white text-lg px-8">
                  Explore Tools
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative bg-black py-20 z-10">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-5xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide mb-8 text-white">
              Protecting the $10 Trillion Digital Economy
            </h2>

            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              <Badge variant="outline" className="border-green-500/50 bg-green-500/10 text-green-400 px-4 py-2 text-sm font-mono">
                <Zap className="w-4 h-4 mr-2" />
                $340K Revenue in 90 Days
              </Badge>
              <Badge variant="outline" className="border-blue-500/50 bg-blue-500/10 text-blue-400 px-4 py-2 text-sm font-mono">
                <Shield className="w-4 h-4 mr-2" />
                99.97% Threat Detection
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {[
                { label: "Annual IP Theft", value: "$283B" },
                { label: "Market Size", value: "$10T" },
                { label: "Insurance", value: "$14M" },
                { label: "Detection Rate", value: "99.97%" }
              ].map((stat, index) => (
                <div key={index} className="glass-card-dark border-blue-500/30 rounded-lg p-6">
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Security <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Platform</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Enterprise-grade tools with quantum-resistant encryption
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Link key={index} to={createPageUrl(service.link)}>
                <Card className="bg-gray-800/80 backdrop-blur-md border-gray-700 hover:border-blue-500/50 transition-all duration-300 h-full group cursor-pointer overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-800 via-gray-800/50 to-transparent" />
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-blue-500/80 text-white border-blue-500">
                        {service.price}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-2 text-white group-hover:text-blue-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Partners */}
      <section className="py-20 bg-black relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Powered by <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Industry Leaders</span>
            </h2>
            <p className="text-gray-400">Enterprise infrastructure trusted by Fortune 500</p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8">
            {partners.map((partner, index) => (
              <div key={index} className="glass-card-dark border-blue-500/20 rounded-lg px-8 py-4">
                <span className="text-white font-bold text-lg">{partner.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Ready to Secure Your <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Digital Assets?</span>
            </h2>
            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              Join enterprises protecting against the $283 billion IP theft crisis with quantum-resistant encryption and 99.97% threat detection.
            </p>

            <form onSubmit={handleEmailSubmit} className="max-w-2xl mx-auto mb-8">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Enter your work email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400 h-12 text-lg flex-1"
                  required
                />
                <Button 
                  type="submit"
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-lg px-8 h-12"
                >
                  Book Demo
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </form>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("Contact")}>
                <Button size="lg" variant="outline" className="border-blue-500/50 hover:bg-blue-500/10 text-white text-lg px-8">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}