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
    relative block w-full min-h-[80px] p-4 rounded-xl
    bg-slate-900/60 backdrop-blur-xl
    border-2 border-purple-500/30
    shadow-[0_0_30px_rgba(168,85,247,0.15)]
    transition-all duration-300
    active:scale-[0.98] active:shadow-[0_0_15px_rgba(168,85,247,0.3)]
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