
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Shield, ArrowUp, Lock, Eye, Zap, CheckCircle2, FileText, Scale } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AnimatedBackground from "@/components/AnimatedBackground";

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
      description: "Enterprise point-of-sale with three-tier access control and real-time analytics.",
      link: "NUPSLogin",
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/b6f63d51b_Whisk_b9fd7532ee1e87a9152439bac427f256dr.jpg",
      price: "Enterprise",
      icon: Shield
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
      title: "QR Security",
      description: "Secure QR generation with AI threat detection and custom branding.",
      link: "QRGenerator",
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/584a72f27_quantum-encryption-visualization-with-glowing-part.jpg",
      price: "$49.99",
      icon: Lock
    },
    {
      title: "Steganography",
      description: "Hide encrypted data within images using LSB encoding.",
      link: "Steganography",
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/a86b74f69_data-security-encryption-protection.jpg",
      price: "$149.99",
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
      title: "Hotzone Mapper",
      description: "Interactive vulnerability mapping with severity tracking.",
      link: "HotzoneMapper",
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/7e319a981_Whisk_429a6543b81e30d9bab4065457f3b62ddr.jpg",
      price: "$99.99",
      icon: Shield
    },
    {
      title: "HSSS Surveillance",
      description: "Real-time threat monitoring with AI detection.",
      link: "HSSS",
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/144d647a1_Whisk_938e90eff0a4d8da277467baf360248edr.jpg",
      price: "Enterprise",
      icon: Eye
    },
    {
      title: "Security Suite",
      description: "Comprehensive security tools with quantum-resistant encryption.",
      link: "SecurityTools",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop",
      price: "Custom",
      icon: Shield
    }
  ];

  const stats = [
    { value: "99.97%", label: "Threat Detection" },
    { value: "24/7", label: "AI Monitoring" },
    { value: "256-bit", label: "Encryption" },
    { value: "<1ms", label: "Response Time" }
  ];

  const features = [
    {
      icon: Shield,
      title: "Quantum-Resistant",
      description: "Next-gen encryption that withstands quantum computing attacks"
    },
    {
      icon: Zap,
      title: "AI-Powered",
      description: "Machine learning algorithms detect threats in real-time"
    },
    {
      icon: Lock,
      title: "Zero-Trust Security",
      description: "Every access request is verified and authenticated"
    },
    {
      icon: Eye,
      title: "24/7 Monitoring",
      description: "Continuous surveillance with instant threat response"
    }
  ];

  return (
    <div className="bg-black text-white relative overflow-hidden">
      <AnimatedBackground />
      
      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 glow-royal-blue"
          aria-label="Back to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      {/* Hero Video Section - 1080p optimized */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-black">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          preload="auto"
          className="max-w-[1920px] max-h-[1080px] w-auto h-auto"
          style={{ filter: 'brightness(1.1) contrast(1.1)' }}
        >
          <source src="https://i.imgur.com/zs3sPzJ.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black pointer-events-none" />
        
        {/* GlyphLock Logo Overlay - Covering Veo Watermark */}
        <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2 translate-x-16 z-10">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/08025b614_gl-logo.png"
            alt="GlyphLock"
            className="h-20 w-auto opacity-95"
          />
        </div>
      </section>

      {/* Hero Content - Below Video */}
      <section className="relative py-24 z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <Badge className="mb-6 bg-blue-500/20 text-blue-400 border-blue-500/50 px-6 py-2 text-sm backdrop-blur-md">
              <Shield className="w-4 h-4 mr-2" />
              Quantum-Resistant Security Platform
            </Badge>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
              <span className="text-white drop-shadow-2xl">Secure Your</span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-blue-600 to-blue-800 bg-clip-text text-transparent drop-shadow-2xl">
                Digital Future
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Enterprise-grade cybersecurity with AI integration, quantum-resistant encryption, and zero-trust architecture
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link to={createPageUrl("Consultation")}>
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-lg px-10 py-7 shadow-2xl glow-royal-blue">
                  Book Free Consultation
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to={createPageUrl("SecurityTools")}>
                <Button size="lg" variant="outline" className="border-2 border-white/30 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white text-lg px-10 py-7">
                  Explore Security Tools
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, idx) => (
                <div key={idx} className="glass-card backdrop-blur-xl bg-black/20 border-blue-500/30 p-6 rounded-xl">
                  <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Master Covenant Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-6 bg-blue-500/20 text-blue-400 border-blue-500/50 px-6 py-2 text-sm backdrop-blur-md">
                <Scale className="w-4 h-4 mr-2" />
                Revolutionary Legal Framework
              </Badge>
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">Master Covenant</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                The world's first AI-enforced binding agreement. A revolutionary legal framework that combines smart contracts with traditional law.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="relative group overflow-hidden rounded-2xl">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/b0a1e2ef9_Whisk_05f17d65a57cf59bf1a4fdd31ffd7d8edr-Copy.jpg"
                  alt="AI Covenant Binding"
                  className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-2xl font-bold text-white mb-3">AI-Enforced Agreements</h3>
                  <p className="text-gray-300">Automated enforcement through blockchain and AI verification</p>
                </div>
              </div>

              <div className="relative group overflow-hidden rounded-2xl">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/e2aed6aef_Whisk_65cb3b2c5bdc26b9c3d4d3986ceae795dr.jpg"
                  alt="First Ever AI Covenant"
                  className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-2xl font-bold text-white mb-3">Legally Binding Framework</h3>
                  <p className="text-gray-300">Recognized by law firms and enforceable in court</p>
                </div>
              </div>
            </div>

            <div className="glass-card backdrop-blur-xl bg-black/30 border-blue-500/30 p-8 rounded-2xl">
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-blue-400" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Smart Contract Integration</h4>
                  <p className="text-gray-400 text-sm">Blockchain-verified terms and conditions</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Scale className="w-8 h-8 text-blue-400" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Legal Compliance</h4>
                  <p className="text-gray-400 text-sm">Meets all regulatory requirements</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-blue-400" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Ironclad Protection</h4>
                  <p className="text-gray-400 text-sm">Immutable and tamper-proof agreements</p>
                </div>
              </div>

              <div className="text-center">
                <Link to={createPageUrl("MasterCovenant")}>
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    View Master Covenant
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Choose <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">GlyphLock</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Military-grade security that adapts to emerging threats
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="glass-card backdrop-blur-xl bg-black/30 border-blue-500/30 p-8 rounded-2xl hover:border-blue-500/60 transition-all duration-300 group">
                  <div className="bg-blue-500/20 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/30 transition-colors">
                    <Icon className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              );
            })}
          </div>

          {/* Feature Images */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative group overflow-hidden rounded-2xl">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/11242d8a3_Whisk_ecd15257dc62aafae4b457b73ff01aa9dr.jpg"
                alt="Smart Contract"
                className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex items-end p-8">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <Lock className="w-7 h-7 text-blue-400" />
                    <h3 className="text-2xl font-bold text-white">Smart Contracts</h3>
                  </div>
                  <p className="text-gray-300">Automated, secure, and transparent agreements</p>
                </div>
              </div>
            </div>

            <div className="relative group overflow-hidden rounded-2xl">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/f5f3a5e3b_Whisk_d839f8faee191cd9bbb4d6b3701c0a99dr.jpg"
                alt="Full Stack Development"
                className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex items-end p-8">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="w-7 h-7 text-blue-400" />
                    <h3 className="text-2xl font-bold text-white">Full Stack Security</h3>
                  </div>
                  <p className="text-gray-300">End-to-end protection for your entire stack</p>
                </div>
              </div>
            </div>

            <div className="relative group overflow-hidden rounded-2xl">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/a0f9663fa_Whisk_df925aca34d95e09a3b4274e0bd16f08dr.jpg"
                alt="Web Development"
                className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex items-end p-8">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <Eye className="w-7 h-7 text-blue-400" />
                    <h3 className="text-2xl font-bold text-white">Secure Development</h3>
                  </div>
                  <p className="text-gray-300">Build with security at the foundation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Complete Security <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Ecosystem</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Integrated tools designed for enterprise-level protection
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Link key={index} to={createPageUrl(service.link)}>
                  <Card className="glass-card backdrop-blur-xl bg-black/30 border-blue-500/30 hover:border-blue-500/60 transition-all duration-300 h-full group cursor-pointer overflow-hidden">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent" />
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-blue-500/90 text-white border-blue-500 font-semibold">
                          {service.price}
                        </Badge>
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <div className="bg-blue-500/20 backdrop-blur-md p-2 rounded-lg">
                          <Icon className="w-6 h-6 text-blue-400" />
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
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

      {/* Social Proof */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Trusted by <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Industry Leaders</span>
            </h2>
            <p className="text-xl text-gray-400">Built on enterprise infrastructure you can rely on</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="glass-card backdrop-blur-xl bg-black/30 border-blue-500/30 p-8 rounded-2xl text-center">
              <div className="text-5xl font-bold text-blue-400 mb-2">500+</div>
              <div className="text-gray-400">Enterprise Clients</div>
            </div>
            <div className="glass-card backdrop-blur-xl bg-black/30 border-blue-500/30 p-8 rounded-2xl text-center">
              <div className="text-5xl font-bold text-blue-400 mb-2">99.97%</div>
              <div className="text-gray-400">Uptime Guarantee</div>
            </div>
            <div className="glass-card backdrop-blur-xl bg-black/30 border-blue-500/30 p-8 rounded-2xl text-center">
              <div className="text-5xl font-bold text-blue-400 mb-2">24/7</div>
              <div className="text-gray-400">Security Monitoring</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Secure Your <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Enterprise?</span>
            </h2>
            <p className="text-xl text-gray-400 mb-10 leading-relaxed">
              Join Fortune 500 companies protecting their digital assets with quantum-resistant encryption
            </p>

            <form onSubmit={handleEmailSubmit} className="max-w-2xl mx-auto mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="email"
                  placeholder="Enter your work email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input backdrop-blur-xl bg-black/30 border-blue-500/50 text-white placeholder:text-gray-400 h-14 text-lg flex-1"
                  required
                />
                <Button 
                  type="submit"
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white h-14 px-8 text-lg glow-royal-blue"
                >
                  Get Started Free
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span>Free 14-day trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
