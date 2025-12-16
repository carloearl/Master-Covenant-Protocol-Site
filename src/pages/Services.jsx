import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Shield, Lock, Cpu, QrCode, Eye, Map, Zap, Database, 
  ShoppingCart, Brain, Globe, AlertCircle, CheckCircle2
} from "lucide-react";
import SEOHead from "@/components/SEOHead";

export default function Services() {
  const services = [
    {
      id: "visual-cryptography",
      icon: Eye,
      title: "Visual Cryptography Module",
      description: "QR verification and steganographic encoding module – governed by protocol, accessible only with provisioned credentials.",
      features: [
        "Quantum-resistant QR code generation with embedded encryption",
        "Steganographic encoding - hide encrypted data within images",
        "AI-powered threat detection to prevent quishing attacks",
        "Blockchain immutability for transaction verification",
        "Custom branding and logo embedding",
        "Multiple format support (PNG, SVG, JPG)"
      ],
      page: "SecurityTools",
      color: "blue"
    },
    {
      id: "glyphbot-ai",
      icon: Brain,
      title: "GlyphBot Intelligence Module",
      description: "Autonomous threat suppression module – AI-driven security analysis restricted to credentialed operators.",
      features: [
        "Real-time threat analysis and detection",
        "Secure code execution in isolated environments",
        "Automated vulnerability scanning",
        "Security audit report generation",
        "Natural language security consultations",
        "WhatsApp integration for mobile access",
        "Multiple AI personas for specialized tasks"
      ],
      page: "GlyphBot",
      color: "violet"
    },
    {
      id: "nups-pos",
      icon: ShoppingCart,
      title: "NUPS Transaction Verification",
      description: "Protocol-governed transaction module – system-enforced verification restricted to authorized venues.",
      features: [
        "Real-time inventory tracking with low-stock alerts",
        "Customer loyalty programs and rewards",
        "VIP room management and tracking",
        "Entertainer check-in and contract management",
        "Multi-location support with centralized reporting",
        "Z-report generation for daily reconciliation",
        "Marketing campaign management (Email/SMS)",
        "AI-powered product recommendations"
      ],
      page: "NUPSLogin",
      color: "emerald"
    },
    {
      id: "hotzone-mapper",
      icon: Map,
      title: "Hotzone Verification Module",
      description: "Facility verification module – operating under protocol-governed authorization with credentialed access.",
      features: [
        "Interactive security map creation",
        "Threat hotspot marking with severity levels",
        "Real-time threat monitoring and alerts",
        "Incident tracking and resolution workflow",
        "Multiple map types (network, physical, infrastructure)",
        "Team collaboration and assignment",
        "Analytics dashboard with threat trends"
      ],
      page: "HotzoneMapper",
      color: "orange"
    },
    {
      id: "security-operations",
      icon: Shield,
      title: "Security Operations Module",
      description: "System-enforced monitoring module – credentialed threat intelligence restricted to provisioned operators.",
      features: [
        "24/7 real-time threat monitoring",
        "Automated vulnerability scanning",
        "Incident response workflow automation",
        "Threat intelligence integration",
        "Security audit logging and compliance",
        "Custom security policies and rules",
        "Enterprise-grade encryption and access control"
      ],
      page: "SecurityOperationsCenter",
      color: "red"
    },
    {
      id: "blockchain-security",
      icon: Database,
      title: "Blockchain Verification Module",
      description: "Immutable ledger module – protocol-enforced integrity verification with cryptographic governance.",
      features: [
        "Immutable transaction records",
        "Smart contract integration",
        "Cryptographic verification",
        "Audit trail generation",
        "Tamper-proof data storage",
        "Multi-signature authentication"
      ],
      page: "Blockchain",
      color: "cyan"
    }
  ];

  const industries = [
    {
      name: "Hospitality & Entertainment",
      description: "Clubs, bars, restaurants, hotels, and entertainment venues requiring secure payment processing, customer tracking, and VIP management."
    },
    {
      name: "Enterprise & Corporate",
      description: "Large organizations needing comprehensive security operations, threat monitoring, and compliance management."
    },
    {
      name: "Technology & Software",
      description: "Tech companies requiring AI security, intellectual property protection, and secure development workflows."
    },
    {
      name: "Healthcare & Finance",
      description: "Regulated industries needing HIPAA and PCI DSS compliant security solutions with audit trails."
    },
    {
      name: "Retail & E-commerce",
      description: "Online and brick-and-mortar retailers needing secure payment processing and fraud prevention."
    },
    {
      name: "Government & Defense",
      description: "Public sector organizations requiring quantum-resistant encryption and classified data protection."
    }
  ];

  return (
    <>
      <SEOHead 
        title="Services - Cybersecurity Solutions | GlyphLock Platform"
        description="Explore GlyphLock's comprehensive cybersecurity services including Visual Cryptography, GlyphBot AI, NUPS POS System, Security Operations Center, Blockchain Security, and Hotzone Mapper. Quantum-resistant protection for enterprises."
        keywords="cybersecurity services, visual cryptography, QR security, steganography, GlyphBot AI, NUPS POS, security operations center, blockchain security, hotzone mapper, threat detection, vulnerability scanning"
        url="/services"
      />
      
      <div className="min-h-screen bg-black text-white py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-violet-500 to-emerald-400 bg-clip-text text-transparent">
                GlyphLock System Modules
              </span>
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8">
              Protocol-governed verification modules – credentialed integrity system operating under cryptographic governance.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to={createPageUrl("Consultation")}>
                <Button className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white">
                  Request Credentials
                </Button>
              </Link>
            </div>
          </div>

          {/* Services Grid */}
          <div className="space-y-12 mb-16">
            {services.map((service, idx) => (
              <div key={service.id} className="glass-card-dark border border-blue-500/30 rounded-xl p-8" style={{ background: 'rgba(30, 58, 138, 0.2)', backdropFilter: 'blur(16px)' }}>
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-500/50">
                    <service.icon className="w-8 h-8 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">{service.title}</h3>
                    <p className="text-white/70">{service.description}</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-3 mb-6">
                  {service.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                      <span className="text-sm text-white/80">{feature}</span>
                    </div>
                  ))}
                </div>
                <Link to={createPageUrl(service.page)}>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Learn More & Try Demo
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          {/* Industries Served */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">
              <span className="text-white">Industries We </span>
              <span className="text-blue-400">Protect</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {industries.map((industry, idx) => (
                <div key={idx} className="glass-card-dark border border-blue-500/30 rounded-xl p-6" style={{ background: 'rgba(30, 58, 138, 0.2)', backdropFilter: 'blur(16px)' }}>
                  <h3 className="text-lg font-semibold text-white mb-2">{industry.name}</h3>
                  <p className="text-sm text-white/70">{industry.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Technology Stack */}
          <div className="glass-card-dark border border-blue-500/30 rounded-xl p-8 text-center" style={{ background: 'rgba(30, 58, 138, 0.2)', backdropFilter: 'blur(16px)' }}>
            <h2 className="text-3xl font-bold text-white mb-4">
              System-Enforced Verification Architecture
            </h2>
            <p className="text-white/70 mb-6 max-w-3xl mx-auto">
              Quantum-resistant cryptographic governance with autonomous threat suppression. 
              Protocol-enforced compliance with SOC 2, GDPR, ISO 27001, PCI DSS, and HIPAA.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-400" />
                <span>AES-256 Encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span>Quantum-Resistant</span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-violet-400" />
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" />
                <span>Blockchain Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-orange-400" />
                <span>Global Infrastructure</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Deploy Protocol-Governed Verification?
            </h2>
            <p className="text-white/70 mb-8 max-w-2xl mx-auto">
              Initiate credentialed access verification with GlyphLock specialists to provision system-enforced capabilities.
            </p>
            <Link to={createPageUrl("Consultation")}>
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white">
                Request Credentials
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}