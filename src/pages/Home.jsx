import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email) {
      navigate(createPageUrl("Consultation") + `?email=${encodeURIComponent(email)}`);
    }
  };

  const stats = [
    { 
      label: "IP Theft Crisis", 
      value: "$283B+",
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/b55c5807c_08f33231-115f-4c95-9719-682f4e9679cc-Copy-Copy-Copy-Copy-Copy-Copy.jpg"
    },
    { 
      label: "Market", 
      value: "$10T+",
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/8cd0364f8_Whisk_2bd57b9a449d359968944ab33f98257edr-Copy.jpg"
    },
    { 
      label: "Insurance", 
      value: "$14M",
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/eab90f603_Whisk_a031d7a8f4d67e79d2d4deb5ac0e0183eg.jpg"
    },
    { 
      label: "Threat Detection", 
      value: "99.97%",
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/4c116ea06_Whisk_311edc975728fa8ad384b1950238341bdr-Copy-Copy.jpg"
    }
  ];

  const services = [
    {
      title: "Master Covenant",
      description: "Legally binding AI contracts. 5 AI systems bound with cryptographic proof and liability coverage.",
      link: "MasterCovenant",
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/ee388f8e1_ai-covenant-binding.jpg"
    },
    {
      title: "Security Tools & Blockchain",
      description: "Complete cybersecurity suite with QR Generator, Steganography, and SHA-256/512 hashing.",
      link: "SecurityTools",
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/b55c5807c_08f33231-115f-4c95-9719-682f4e9679cc-Copy-Copy-Copy-Copy-Copy-Copy.jpg"
    },
    {
      title: "GlyphBot AI Assistant",
      description: "Advanced AI powered by Gemini with code execution, security scanning, and automated auditing.",
      link: "GlyphBot",
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/fde39a76a_card-bg-ai-powered.jpg"
    },
    {
      title: "QR Code Generator",
      description: "Secure QR code generation with custom branding, analytics tracking, and encryption.",
      link: "QRGenerator",
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/b5ad362ca_futuristic-qr-code.jpg"
    },
    {
      title: "Steganography",
      description: "Hide encrypted data within images using LSB encoding for secure communications.",
      link: "Steganography",
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/eab90f603_Whisk_a031d7a8f4d67e79d2d4deb5ac0e0183eg.jpg"
    },
    {
      title: "Blockchain Security",
      description: "SHA-256/512 hashing, immutable verification, and cryptographic proof systems.",
      link: "Blockchain",
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/4c116ea06_Whisk_311edc975728fa8ad384b1950238341bdr-Copy-Copy.jpg"
    }
  ];

  const partners = [
    { name: "AWS", logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" },
    { name: "Google Cloud", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg" },
    { name: "Microsoft Azure", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure.svg" },
    { name: "Stripe", logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" },
    { name: "OpenAI", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg" },
    { name: "Vercel", logo: "https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png" },
    { name: "Supabase", logo: "https://supabase.com/dashboard/_next/image?url=%2Fdashboard%2Fimg%2Fsupabase-logo.svg&w=64&q=75" },
    { name: "MongoDB", logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/MongoDB_Logo.svg" },
    { name: "Redis", logo: "https://upload.wikimedia.org/wikipedia/commons/6/64/Logo-redis.svg" },
    { name: "PostgreSQL", logo: "https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg" },
    { name: "Docker", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Docker_%28container_engine%29_logo.svg" },
    { name: "Kubernetes", logo: "https://upload.wikimedia.org/wikipedia/commons/3/39/Kubernetes_logo_without_workmark.svg" },
    { name: "GitHub", logo: "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" },
    { name: "GitLab", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e1/GitLab_logo.svg" },
    { name: "TypeScript", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg" },
    { name: "React", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" },
    { name: "Node.js", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg" },
    { name: "Python", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg" }
  ];

  return (
    <div className="bg-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/2e63b60aa_Whisk_6ce7908b81aaa96a4b5434151a039e8cdr.jpg"
            alt="Futuristic Cityscape"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-block mb-6">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/a7577ec26_db-revenue-badge.jpg"
                alt="D&B Verified Revenue"
                className="h-24 w-auto mx-auto"
              />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-white">Universal Security Platform</span>
              <br />
              <span className="text-white">with <span className="bg-gradient-to-r from-blue-400 via-blue-600 to-blue-700 bg-clip-text text-transparent">Smart Contracts</span></span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Next-generation cybersecurity platform pioneering AI-contract integration technology with quantum-resistant encryption.
            </p>

            <form onSubmit={handleEmailSubmit} className="max-w-2xl mx-auto mb-12">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Input
                  type="email"
                  placeholder="Enter your email"
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
                  Book Consultation
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </form>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="relative group overflow-hidden rounded-lg">
                  <div className="absolute inset-0">
                    <img 
                      src={stat.image}
                      alt={stat.label}
                      className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-300"
                    />
                  </div>
                  <div className="relative bg-gray-900/40 backdrop-blur-md border border-blue-500/30 rounded-lg p-6">
                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-white">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Platform & <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Services</span>
            </h2>
            <p className="text-xl text-white max-w-3xl mx-auto">
              Complete cybersecurity and AI platform with premium tools, enterprise solutions, and legal AI binding framework
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Link key={index} to={createPageUrl(service.link)}>
                <Card className="bg-gray-900 border-gray-800 hover:border-blue-500/50 transition-all duration-300 h-full group cursor-pointer overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-white mb-4">
                      {service.description}
                    </p>
                    <div className="flex items-center text-blue-400 text-sm font-semibold">
                      Learn More <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Partners - Scrolling Marquee with Open Source Logos */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/8cd0364f8_Whisk_2bd57b9a449d359968944ab33f98257edr-Copy.jpg"
            alt="Tech Background"
            className="w-full h-full object-cover opacity-5"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Powered by <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Industry Leaders</span>
            </h2>
            <p className="text-white">Built on enterprise-grade infrastructure</p>
          </div>

          {/* Scrolling Marquee with Company Logos */}
          <div className="relative overflow-hidden">
            <style>{`
              @keyframes scroll {
                0% {
                  transform: translateX(0);
                }
                100% {
                  transform: translateX(-50%);
                }
              }
              .marquee {
                animation: scroll 40s linear infinite;
              }
              .marquee:hover {
                animation-play-state: paused;
              }
            `}</style>
            
            <div className="flex">
              <div className="flex marquee">
                {/* First set of partners */}
                {partners.map((partner, index) => (
                  <div
                    key={`first-${index}`}
                    className="flex-shrink-0 mx-4 px-8 py-6 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-blue-500/20 hover:border-blue-500/50 transition-colors flex items-center justify-center min-w-[180px] h-24"
                  >
                    <img 
                      src={partner.logo} 
                      alt={partner.name}
                      className="h-12 w-auto max-w-[140px] object-contain filter brightness-0 invert opacity-80 hover:opacity-100 transition-opacity"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <span className="text-white font-bold text-lg hidden">
                      {partner.name}
                    </span>
                  </div>
                ))}
                {/* Duplicate set for seamless loop */}
                {partners.map((partner, index) => (
                  <div
                    key={`second-${index}`}
                    className="flex-shrink-0 mx-4 px-8 py-6 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-blue-500/20 hover:border-blue-500/50 transition-colors flex items-center justify-center min-w-[180px] h-24"
                  >
                    <img 
                      src={partner.logo} 
                      alt={partner.name}
                      className="h-12 w-auto max-w-[140px] object-contain filter brightness-0 invert opacity-80 hover:opacity-100 transition-opacity"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <span className="text-white font-bold text-lg hidden">
                      {partner.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/4c116ea06_Whisk_311edc975728fa8ad384b1950238341bdr-Copy-Copy.jpg"
            alt="Quantum Energy"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Ready to Transform Your <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Digital Infrastructure?</span>
            </h2>
            <p className="text-xl text-white mb-8 leading-relaxed">
              GlyphLock is the world's first platform to bind 5 AI systems to legally enforceable contracts. Our revolutionary Master Covenant System combines cryptographic proof with $14M liability coverage, creating unprecedented accountability in AI-powered security.
            </p>
            <p className="text-white mb-8 leading-relaxed">
              Built by a team that generated $340K in verified revenue within 90 days, we're addressing the $283 billion annual IP theft crisis with quantum-resistant encryption, 99.97% threat detection accuracy, and enterprise-grade infrastructure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("Consultation")}>
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-lg px-8">
                  Book Consultation
                </Button>
              </Link>
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