import React from 'react';
import { motion } from 'framer-motion';

/**
 * Mobile-optimized card component with proper touch targets and visual feedback
 */
export default function MobileCard({ 
  children, 
  onClick, 
  className = '', 
  as = 'div',
  href,
  ...props 
}) {
  const Component = as === 'a' ? motion.a : motion.div;
  
  const baseClasses = `
    relative block w-full min-h-[96px] p-6 rounded-2xl
    bg-gradient-to-br from-slate-900/80 via-slate-900/70 to-slate-900/60 backdrop-blur-2xl
    border-3 border-purple-500/40
    shadow-[0_8px_40px_rgba(168,85,247,0.25),0_0_20px_rgba(6,182,212,0.15)]
    transition-all duration-200
    active:scale-[0.96] active:shadow-[0_4px_20px_rgba(168,85,247,0.4)]
    ${onClick || href ? 'cursor-pointer' : ''}
    ${className}
  `;
  
  return (
    <Component
      className={baseClasses}
      onClick={onClick}
      href={href}
      whileTap={{ scale: 0.98 }}
      style={{ 
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'transparent'
      }}
      {...props}
    >
      {children}
    </Component>
  );
}