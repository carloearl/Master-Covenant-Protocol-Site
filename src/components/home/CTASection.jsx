import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, ArrowRight, Zap, Shield, Sparkles } from "lucide-react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

export default function CTASection() {
  const [email, setEmail] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.5]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.98]);

  const handleGetStarted = () => {
    window.location.href = createPageUrl("Consultation") + `?email=${encodeURIComponent(email)}`;
  };

  const benefits = [
    { text: "Protocol-governed access control", icon: Shield },
    { text: "System-enforced verification", icon: Zap },
    { text: "Credentialed integrity framework", icon: CheckCircle2 },
    { text: "Provisioned support channel", icon: Sparkles }
  ];

  // Stagger animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  const slideLeftVariants = {
    hidden: { opacity: 0, x: -60 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  const slideRightVariants = {
    hidden: { opacity: 0, x: 60 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  return (
    <motion.div 
      ref={containerRef}
      className="w-full max-w-6xl mx-auto px-4 py-20 relative"
      style={{ background: 'transparent', pointerEvents: 'auto', scale }}
    >
      {/* Animated background orbs - Royal Blue/Indigo */}
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ y: backgroundY }}
      >
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/25 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/25 rounded-full blur-[120px]"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.3, 0.4]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </motion.div>

      <motion.div
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Main card with animated border */}
        <div className="relative rounded-3xl overflow-hidden">
          {/* Animated gradient border - Royal Blue/Indigo */}
          <motion.div
            className="absolute inset-0 rounded-3xl p-[2px]"
            style={{
              background: 'linear-gradient(90deg, #3B82F6, #6366F1, #8B5CF6, #3B82F6)',
              backgroundSize: '300% 100%'
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-[2px] rounded-3xl bg-gradient-to-br from-blue-950/95 via-indigo-950/95 to-violet-950/95 backdrop-blur-2xl" />
          </motion.div>

          {/* Pulsing glow overlay - Royal Blue */}
          <motion.div
            className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600 rounded-3xl blur-2xl"
            style={{ opacity: glowOpacity }}
            animate={{
              opacity: isHovered ? 0.5 : 0.3
            }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Content container - Royal Blue theme */}
          <div className="relative bg-gradient-to-br from-blue-900/40 via-indigo-900/50 to-violet-900/40 backdrop-blur-2xl rounded-3xl p-8 md:p-14 overflow-hidden border border-indigo-500/30">
            {/* Grid pattern overlay - Purple/Blue */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `
                linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }} />

            {/* Top accent line - Royal Blue */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-[2px]"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              style={{
                background: 'linear-gradient(90deg, transparent, #3B82F6 30%, #8B5CF6 70%, transparent)'
              }}
            />
            
            <div className="relative z-10 text-center">
              {/* Badge - Royal Blue */}
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/15 border border-blue-400/30 mb-6"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles size={14} className="text-blue-400" />
                </motion.div>
                <span className="text-blue-300 text-sm font-medium tracking-wide">Quantum-Grade Security</span>
              </motion.div>

              {/* Title with slide animations */}
              <motion.h2
                variants={slideLeftVariants}
                className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]"
              >
                READY TO SECURE YOUR{' '}
                <motion.span 
                  className="bg-gradient-to-r from-[#3B82F6] via-[#6366F1] to-[#8B5CF6] bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  style={{
                    backgroundSize: '200% 100%'
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  DIGITAL ASSETS?
                </motion.span>
              </motion.h2>

              <motion.p
                variants={slideRightVariants}
                className="text-base md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto font-medium"
              >
                Protocol-governed verification for credentialed operators
              </motion.p>

              {/* Email form with animations */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-3 md:gap-4 max-w-lg mx-auto mb-10"
              >
                <div className="flex-1 relative group">
                  <Input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/8 backdrop-blur-md border-2 border-white/20 text-white placeholder:text-white/50 focus:border-indigo-400 focus:shadow-[0_0_30px_rgba(87,61,255,0.5)] transition-all h-14 rounded-xl text-base"
                  />
                  {/* Focus glow */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-indigo-500/20 opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity pointer-events-none" />
                </div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    onClick={handleGetStarted}
                    size="lg"
                    className="relative overflow-hidden h-14 px-8 bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] hover:from-[#2563EB] hover:to-[#60A5FA] text-white font-black tracking-wide shadow-[0_0_25px_rgba(59,130,246,0.5)] hover:shadow-[0_0_40px_rgba(30,64,175,0.7)] transition-all duration-300 rounded-xl"
                  >
                    {/* Shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                    />
                    <span className="relative flex items-center gap-2">
                      INITIATE VERIFICATION
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight size={18} />
                      </motion.span>
                    </span>
                  </Button>
                </motion.div>
              </motion.div>

              {/* Benefits grid with stagger - Royal Blue theme */}
              <motion.div
                variants={containerVariants}
                className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto"
              >
                {benefits.map((benefit, idx) => {
                  const Icon = benefit.icon;
                  return (
                    <motion.div
                      key={idx}
                      variants={idx % 2 === 0 ? slideLeftVariants : slideRightVariants}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className="flex items-center gap-3 text-white font-medium p-3 rounded-xl bg-white/5 border border-white/10 hover:border-blue-400/40 hover:bg-white/10 transition-all cursor-default"
                    >
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center"
                      >
                        <Icon className="w-4 h-4 text-[#3B82F6]" style={{ filter: 'drop-shadow(0 0 8px rgba(59,130,246,0.8))' }} />
                      </motion.div>
                      <span className="text-sm tracking-wide">{benefit.text}</span>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}