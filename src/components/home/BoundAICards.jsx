import React, { useRef, useState, useEffect } from "react";
import { Brain, Zap, Shield, Eye, Lock, Cpu } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const AICard = ({ icon: Icon, title, description, index }) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { damping: 20, stiffness: 150 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), springConfig);
  
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) / rect.width);
    y.set((e.clientY - centerY) / rect.height);
  };
  
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };
  
  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      viewport={{ once: true }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative"
    >
      <div className="glass-card rounded-2xl p-8 h-full relative overflow-hidden group cursor-pointer">
        <motion.div
          animate={{
            scale: isHovered ? 1.1 : 1,
            rotate: isHovered ? 360 : 0,
          }}
          transition={{ duration: 0.6 }}
          className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20"
        />
        
        <motion.div
          style={{ translateZ: 50 }}
          className="relative z-10"
        >
          <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Icon className="w-8 h-8 text-blue-400" />
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
          <p className="text-white/70 leading-relaxed">{description}</p>
          
          <motion.div
            animate={{
              opacity: isHovered ? 1 : 0,
              y: isHovered ? 0 : 10,
            }}
            className="mt-6 flex items-center gap-2 text-blue-400 font-semibold"
          >
            <span>Explore</span>
            <motion.div
              animate={{ x: isHovered ? 5 : 0 }}
              transition={{ repeat: Infinity, duration: 0.8, repeatType: "reverse" }}
            >
              →
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{
                opacity: isHovered ? [0, 1, 0] : 0,
                y: isHovered ? [0, -100] : 0,
                x: [0, Math.random() * 50 - 25],
              }}
              transition={{
                duration: 2,
                delay: i * 0.2,
                repeat: isHovered ? Infinity : 0,
              }}
              className="absolute bottom-0 left-1/2 w-1 h-1 bg-blue-400 rounded-full"
              style={{ left: `${30 + i * 20}%` }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default function BoundAICards() {
  const cards = [
    {
      icon: Brain,
      title: "Neural Analytics",
      description: "Advanced AI algorithms process millions of data points to predict and prevent security threats before they happen.",
    },
    {
      icon: Cpu,
      title: "Quantum Processing",
      description: "Harness quantum computing power for encryption that's impossible to break with traditional methods.",
    },
    {
      icon: Shield,
      title: "Adaptive Defense",
      description: "Self-learning security systems that evolve with emerging threats and automatically strengthen weak points.",
    },
    {
      icon: Eye,
      title: "Real-Time Vision",
      description: "24/7 monitoring with AI-powered threat detection that identifies anomalies in milliseconds.",
    },
    {
      icon: Zap,
      title: "Instant Response",
      description: "Automated incident response triggered by AI analysis, neutralizing threats at machine speed.",
    },
    {
      icon: Lock,
      title: "Zero-Knowledge AI",
      description: "Privacy-preserving AI that protects your data while delivering powerful security insights.",
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            AI-Powered <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 bg-clip-text text-transparent">Security Intelligence</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Experience the future of cybersecurity with our bound AI systems that work together seamlessly
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <AICard key={index} {...card} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}