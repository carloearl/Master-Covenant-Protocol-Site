import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Shield, Zap, ArrowUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
    <div className="bg-black text-white relative">
      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-50 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Back to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      {/* Top Tagline */}
      <div className="relative bg-black/80 backdrop-blur-sm py-3 border-b border-blue-500/20 z-10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-blue-400 text-sm md:text-base font-bold tracking-widest uppercase">
            Quantum-Resistant Security Platform
          </p>
        </div>
      </div>

      {/* Hero Video Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-contain md:object-cover bg-black"
        >
          <source src="https://glyph-merge-pro-glyphlock.replit.app/assets/hero-video-CxU5xRpe.mp4" type="video/mp4" />
        </video>
        <div className="grid-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black" />
      </section>

      {/* Taglines - Tight Under Video */}
      <section className="relative bg-black py-6 z-10">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-5xl mx-auto">
            <div className="relative inline-block mb-3">
              <p className="text-gray-400 text-base md:text-lg font-medium tracking-wider uppercase">
                Invisible Layers. <span className="relative">
                  Infinite Possibilities
                  <span className="absolute -top-1 left-0 right-0 bg-blue-500/20 backdrop-blur-sm rounded px-1 text-blue-300 text-xs border border-blue-500/40">
                    *INFINITE
                  </span>
                </span>. Absolute Protection.
              </p>
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-3 leading-tight">
              <span className="text-white">Universal Security Platform</span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-blue-600 to-blue-700 bg-clip-text text-transparent">
                with Smart Contracts
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-5 max-w-3xl mx-auto">
              Enterprise cybersecurity with AI integration and $14M liability coverage.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to={createPageUrl("Consultation")}>
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
                  Get Started
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to={createPageUrl("SecurityTools")}>
                <Button size="lg" variant="outline" className="border-blue-500/50 hover:bg-blue-500/10 text-white">
                  Explore Tools
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative bg-gray-900 py-10 z-10">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-5xl mx-auto mb-6">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-wide mb-4 text-white">
              Protecting the $10 Trillion Digital Economy
            </h2>

            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
              <Badge variant="outline" className="border-green-500/50 bg-green-500/10 text-green-400 px-4 py-2 text-sm font-mono">
                <Zap className="w-4 h-4 mr-2" />
                $340K Revenue in 90 Days
              </Badge>
              <Badge variant="outline" className="border-blue-500/50 bg-blue-500/10 text-blue-400 px-4 py-2 text-sm font-mono">
                <Shield className="w-4 h-4 mr-2" />
                99.97% Threat Detection
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Annual IP Theft", value: "$283B" },
                { label: "Market Size", value: "$10T" },
                { label: "Insurance", value: "$14M" },
                { label: "Detection Rate", value: "99.97%" }
              ].map((stat, index) => (
                <div key={index} className="glass-card-dark border-blue-500/30 rounded-lg p-4">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-xs md:text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-10 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">
              Security <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Platform</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Enterprise-grade tools with quantum-resistant encryption
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((service, index) => (
              <Link key={index} to={createPageUrl(service.link)}>
                <Card className="bg-gray-800/80 backdrop-blur-md border-gray-700 hover:border-blue-500/50 transition-all duration-300 h-full group cursor-pointer overflow-hidden">
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-800 via-gray-800/50 to-transparent" />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-blue-500/80 text-white border-blue-500 text-xs">
                        {service.price}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-base font-bold mb-2 text-white group-hover:text-blue-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-400 text-xs">
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
      <section className="py-10 bg-gray-900 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white">
              Powered by <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Industry Leaders</span>
            </h2>
            <p className="text-gray-400">Enterprise infrastructure trusted by Fortune 500</p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-6">
            {partners.map((partner, index) => (
              <div key={index} className="glass-card-dark border-blue-500/20 rounded-lg px-6 py-3">
                <span className="text-white font-bold text-base">{partner.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 bg-gradient-to-b from-black to-gray-900 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Ready to Secure Your <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Digital Assets?</span>
            </h2>
            <p className="text-lg text-gray-400 mb-5 leading-relaxed">
              Join enterprises protecting against the $283 billion IP theft crisis with quantum-resistant encryption and 99.97% threat detection.
            </p>

            <form onSubmit={handleEmailSubmit} className="max-w-2xl mx-auto mb-5">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Enter your work email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400 h-11 flex-1"
                  required
                />
                <Button 
                  type="submit"
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white h-11"
                >
                  Book Demo
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </form>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to={createPageUrl("Contact")}>
                <Button size="lg" variant="outline" className="border-blue-500/50 hover:bg-blue-500/10 text-white">
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