import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { CheckCircle, Sparkles, Shield, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import SEOHead from "@/components/SEOHead";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <SEOHead title="Payment Successful - GlyphLock" />
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00E4FF]/20 rounded-full blur-[150px] animate-pulse"></div>
          <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-[#8C4BFF]/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/hexellence.png')] opacity-5"></div>
        </div>

        {/* Confetti effect */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-10%`,
                  background: i % 2 === 0 ? '#00E4FF' : '#8C4BFF',
                }}
                animate={{
                  y: ['0vh', '110vh'],
                  x: [0, Math.random() * 100 - 50],
                  rotate: [0, 360],
                  opacity: [1, 0],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  delay: Math.random() * 0.5,
                  ease: 'easeOut',
                }}
              />
            ))}
          </div>
        )}

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl w-full relative z-10"
        >
          <div className="bg-gradient-to-br from-[#0A0F24]/90 to-black/80 backdrop-blur-2xl border border-[#00E4FF]/30 rounded-3xl p-12 shadow-[0_0_60px_rgba(0,228,255,0.3)]">
            
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="relative mb-8"
            >
              <div className="absolute inset-0 bg-[#00E4FF]/30 rounded-full blur-3xl animate-pulse"></div>
              <CheckCircle className="w-28 h-28 text-[#00E4FF] mx-auto relative z-10 drop-shadow-[0_0_30px_rgba(0,228,255,0.8)]" strokeWidth={1.5} />
            </motion.div>

            {/* Success Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center mb-12"
            >
              <h1 className="text-5xl font-black mb-4 font-space">
                <span className="text-transparent bg-gradient-to-r from-[#00E4FF] via-[#8C4BFF] to-[#9F00FF] bg-clip-text">
                  PAYMENT SUCCESSFUL
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-2">
                Welcome to <span className="text-[#00E4FF] font-bold">GlyphLock Premium</span>
              </p>
              <p className="text-sm text-gray-500">
                Your quantum-grade security is now activated
              </p>
              {sessionId && (
                <p className="text-xs text-gray-600 mt-4 font-mono">
                  Session: {sessionId.slice(0, 20)}...
                </p>
              )}
            </motion.div>

            {/* Features Unlocked */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-3 gap-4 mb-10"
            >
              {[
                { icon: Shield, label: "Full Access" },
                { icon: Zap, label: "AI Tools" },
                { icon: Sparkles, label: "Premium Support" },
              ].map((item, idx) => (
                <div key={idx} className="text-center p-4 rounded-xl bg-white/5 border border-[#00E4FF]/20 hover:border-[#00E4FF]/40 transition-all group">
                  <item.icon className="w-8 h-8 text-[#00E4FF] mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-xs text-gray-400 font-semibold">{item.label}</p>
                </div>
              ))}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-4"
            >
              <Link to={createPageUrl("Dashboard")} className="block">
                <Button className="w-full bg-gradient-to-r from-[#00E4FF] to-[#0099FF] hover:to-[#00E4FF] text-black font-bold text-lg py-6 shadow-[0_0_30px_rgba(0,228,255,0.4)] hover:shadow-[0_0_50px_rgba(0,228,255,0.6)] transition-all group">
                  <span>Access Dashboard</span>
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to={createPageUrl("CommandCenter")} className="block">
                <Button variant="outline" className="w-full border-[#8C4BFF]/50 text-[#8C4BFF] hover:bg-[#8C4BFF]/10 hover:border-[#8C4BFF] py-6 text-lg">
                  Command Center
                </Button>
              </Link>
              <Link to={createPageUrl("Home")} className="block">
                <Button variant="ghost" className="w-full text-gray-400 hover:text-white hover:bg-white/5 py-6">
                  Return Home
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Bottom message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center text-gray-500 text-sm mt-6"
          >
            A confirmation email has been sent to your inbox
          </motion.p>
        </motion.div>
      </div>
    </>
  );
}