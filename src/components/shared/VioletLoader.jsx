import React from "react";
import { motion } from "framer-motion";

export default function VioletLoader({ text = "Processing..." }) {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="text-center space-y-4">
        <div className="relative w-16 h-16 mx-auto">
          {/* Hexagon spinner */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <linearGradient id="violetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#A855F7" />
                </linearGradient>
              </defs>
              <polygon 
                points="50,5 93.3,27.5 93.3,72.5 50,95 6.7,72.5 6.7,27.5" 
                fill="none" 
                stroke="url(#violetGrad)" 
                strokeWidth="3"
                opacity="0.6"
                filter="drop-shadow(0 0 10px rgba(139,92,246,0.8))"
              />
            </svg>
          </motion.div>
          
          {/* Inner pulse */}
          <motion.div 
            className="absolute inset-4 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full"
            animate={{ scale: [0.6, 1, 0.6], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ boxShadow: '0 0 30px rgba(139,92,246,0.8)' }}
          />
        </div>
        <motion.p 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-sm text-violet-300 font-semibold tracking-wide"
        >
          {text}
        </motion.p>
      </div>
    </div>
  );
}