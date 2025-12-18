import React, { useRef } from "react";
import { Shield, Zap, Lock, Eye } from "lucide-react";
import { motion, useInView } from "framer-motion";

export default function FeaturesSection() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.15 });

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

  // Animation directions for feature cards
  const featureDirections = [
    { x: -60, y: 0, rotate: -5 },
    { x: 0, y: -50, rotate: 0 },
    { x: 0, y: 50, rotate: 0 },
    { x: 60, y: 0, rotate: 5 }
  ];

  return (
    <section ref={containerRef} className="py-24 relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          {/* Title - Slide from left */}
          <motion.h2 
            initial={{ opacity: 0, x: -100, filter: "blur(20px)" }}
            animate={isInView ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-4xl md:text-5xl font-bold mb-6 text-white"
          >
            Why Choose <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">GlyphLock</span>
          </motion.h2>
          
          {/* Subtitle - Slide from right */}
          <motion.p 
            initial={{ opacity: 0, x: 100, filter: "blur(15px)" }}
            animate={isInView ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 1.4, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-xl text-white/70 max-w-3xl mx-auto"
          >
            Military-grade security that adapts to emerging threats
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            const dir = featureDirections[idx];
            return (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, x: dir.x, y: dir.y, rotate: dir.rotate, scale: 0.85 }}
                animate={isInView ? { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 } : {}}
                transition={{ 
                  duration: 1.2, 
                  delay: 0.5 + (idx * 0.2),
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                whileHover={{ y: -10, scale: 1.05, boxShadow: "0 0 50px rgba(6,182,212,0.4)" }}
                className="glass-royal p-8 rounded-2xl hover:border-cyan-500/60 transition-colors duration-300 group"
              >
                <motion.div 
                  whileHover={{ rotate: 360, scale: 1.15 }}
                  transition={{ duration: 0.8 }}
                  className="bg-cyan-500/20 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-cyan-500/30 transition-colors"
                >
                  <Icon className="w-8 h-8 text-cyan-400" />
                </motion.div>
                <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/11242d8a3_Whisk_ecd15257dc62aafae4b457b73ff01aa9dr.jpg", alt: "Smart Contract", icon: Lock, title: "Smart Contracts", desc: "Automated, secure, and transparent agreements" },
            { img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/fd28593b3_Whisk_938e90eff0a4d8da277467baf360248edr.jpg", alt: "Full Stack Development", icon: Shield, title: "Full Stack Security", desc: "End-to-end protection for your entire stack" },
            { img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/870d85755_Whisk_429a6543b81e30d9bab4065457f3b62ddr.jpg", alt: "Web Development", icon: Eye, title: "Secure Development", desc: "Build with security at the foundation" }
          ].map((card, idx) => {
            const Icon = card.icon;
            const directions = [{ x: -80, rotate: -8 }, { y: 60, rotate: 0 }, { x: 80, rotate: 8 }];
            const dir = directions[idx];
            
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: dir.x || 0, y: dir.y || 0, rotate: dir.rotate, scale: 0.85 }}
                animate={isInView ? { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 } : {}}
                transition={{ 
                  duration: 1.3, 
                  delay: 1.4 + (idx * 0.25),
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                whileHover={{ y: -12, scale: 1.03 }}
                className="relative group overflow-hidden rounded-2xl"
              >
                <img
                  src={card.img}
                  alt={card.alt}
                  className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex items-end p-8">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <Icon className="w-7 h-7 text-cyan-400" />
                      <h3 className="text-2xl font-bold text-white">{card.title}</h3>
                    </div>
                    <p className="text-white/80">{card.desc}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}