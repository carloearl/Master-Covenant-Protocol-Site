import React from "react";
import { Shield, Zap, Lock, Eye } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: "Post-Quantum Ready",
      description: "Hybrid PQC key exchange with AES-256 encryption for future-proof security"
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
    <section className="py-24 relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Why Choose <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">GlyphLock</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Military-grade security that adapts to emerging threats
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="glass-royal p-8 rounded-2xl hover:border-blue-500/60 transition-all duration-300 group">
                <div className="bg-blue-500/20 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/30 transition-colors">
                  <Icon className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </div>
            );
          })}
        </div>

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
                <p className="text-white/80">Automated, secure, and transparent agreements</p>
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
                <p className="text-white/80">End-to-end protection for your entire stack</p>
              </div>
            </div>
          </div>

          <div className="relative group overflow-hidden rounded-2xl">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/fd28593b3_Whisk_938e90eff0a4d8da277467baf360248edr.jpg"
              alt="Web Development"
              className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex items-end p-8">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Eye className="w-7 h-7 text-blue-400" />
                  <h3 className="text-2xl font-bold text-white">Secure Development</h3>
                </div>
                <p className="text-white/80">Build with security at the foundation</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}