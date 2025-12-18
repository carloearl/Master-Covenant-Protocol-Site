import React from "react";
import { motion } from "framer-motion";

export default function CyanLoader({ text = "Loading..." }) {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="text-center space-y-4">
        <div className="relative w-16 h-16 mx-auto">
          {/* Orbiting dots */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 w-3 h-3 bg-cyan-400 rounded-full"
              style={{ 
                originX: 0.5, 
                originY: 0.5,
                boxShadow: '0 0 15px rgba(6,182,212,0.9)'
              }}
              animate={{
                rotate: 360,
                scale: [1, 1.3, 1]
              }}
              transition={{
                rotate: { duration: 2, repeat: Infinity, ease: "linear", delay: i * 0.33 },
                scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }
              }}
              initial={{ 
                x: Math.cos((i * 120 * Math.PI) / 180) * 25 - 6,
                y: Math.sin((i * 120 * Math.PI) / 180) * 25 - 6
              }}
            />
          ))}
          
          {/* Center glow */}
          <motion.div 
            className="absolute inset-6 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ boxShadow: '0 0 30px rgba(6,182,212,0.7)' }}
          />
        </div>
        <motion.p 
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-sm text-cyan-300 font-semibold tracking-wide"
        >
          {text}
        </motion.p>
      </div>
    </div>
  );
}