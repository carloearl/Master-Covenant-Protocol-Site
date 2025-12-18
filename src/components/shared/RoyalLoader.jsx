import React from "react";
import { motion } from "framer-motion";

export default function RoyalLoader({ text = "Loading..." }) {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="text-center space-y-4">
        <div className="relative w-16 h-16 mx-auto">
          {/* Outer ring - Royal Blue */}
          <motion.div 
            className="absolute inset-0 border-[3px] border-blue-500/20 border-t-blue-400 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            style={{ boxShadow: '0 0 20px rgba(59,130,246,0.5)' }}
          />
          {/* Inner ring - Indigo */}
          <motion.div 
            className="absolute inset-2 border-[3px] border-indigo-500/20 border-t-indigo-400 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
            style={{ boxShadow: '0 0 15px rgba(99,102,241,0.5)' }}
          />
          {/* Center pulse */}
          <motion.div 
            className="absolute inset-5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full"
            animate={{ scale: [0.7, 1, 0.7], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ boxShadow: '0 0 25px rgba(59,130,246,0.8)' }}
          />
        </div>
        <motion.p 
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-sm text-blue-300 font-semibold tracking-wide"
        >
          {text}
        </motion.p>
      </div>
    </div>
  );
}