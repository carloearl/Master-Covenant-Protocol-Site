/**
 * ScrollReveal - Reusable scroll-based animation components
 * Modern reveal effects: fade, slide, scale, stagger
 */

import React, { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

// Base variants for different animation types
const variants = {
  fadeUp: {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 }
  },
  fadeDown: {
    hidden: { opacity: 0, y: -60 },
    visible: { opacity: 1, y: 0 }
  },
  fadeLeft: {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 }
  },
  fadeRight: {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0 }
  },
  scaleUp: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  },
  scaleDown: {
    hidden: { opacity: 0, scale: 1.2 },
    visible: { opacity: 1, scale: 1 }
  },
  rotate: {
    hidden: { opacity: 0, rotate: -10, scale: 0.9 },
    visible: { opacity: 1, rotate: 0, scale: 1 }
  },
  blur: {
    hidden: { opacity: 0, filter: 'blur(20px)' },
    visible: { opacity: 1, filter: 'blur(0px)' }
  },
  slideScale: {
    hidden: { opacity: 0, x: -50, scale: 0.95 },
    visible: { opacity: 1, x: 0, scale: 1 }
  }
};

// Main ScrollReveal component
export function ScrollReveal({
  children,
  animation = 'fadeUp',
  delay = 0,
  duration = 0.6,
  threshold = 0.2,
  once = true,
  className = '',
  ease = [0.25, 0.46, 0.45, 0.94],
  ...props
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: threshold });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants[animation]}
      transition={{ duration, delay, ease }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Stagger container for multiple items
export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  containerDelay = 0,
  threshold = 0.1,
  once = true,
  className = '',
  ...props
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: threshold });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: containerDelay
          }
        }
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Stagger item (use inside StaggerContainer)
export function StaggerItem({
  children,
  animation = 'fadeUp',
  duration = 0.5,
  className = '',
  ...props
}) {
  return (
    <motion.div
      variants={variants[animation]}
      transition={{ duration, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Parallax scroll effect
export function ParallaxScroll({
  children,
  speed = 0.5,
  className = '',
  ...props
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed]);

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Horizontal scroll reveal (slide from left or right)
export function HorizontalReveal({
  children,
  direction = 'left',
  distance = 100,
  delay = 0,
  duration = 0.7,
  threshold = 0.2,
  once = true,
  className = '',
  ...props
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: threshold });
  
  const xStart = direction === 'left' ? -distance : distance;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: xStart }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: xStart }}
      transition={{ duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Scale reveal with glow effect
export function GlowReveal({
  children,
  delay = 0,
  duration = 0.6,
  threshold = 0.2,
  once = true,
  glowColor = 'rgba(0, 228, 255, 0.3)',
  className = '',
  ...props
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: threshold });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9, boxShadow: `0 0 0 ${glowColor}` }}
      animate={isInView ? {
        opacity: 1,
        scale: 1,
        boxShadow: `0 0 60px ${glowColor}`
      } : {
        opacity: 0,
        scale: 0.9,
        boxShadow: `0 0 0 ${glowColor}`
      }}
      transition={{ duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Text reveal with character animation
export function TextReveal({
  text,
  delay = 0,
  staggerDelay = 0.03,
  threshold = 0.3,
  once = true,
  className = '',
  charClassName = '',
  ...props
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: threshold });
  
  const words = text.split(' ');

  return (
    <motion.span
      ref={ref}
      className={className}
      {...props}
    >
      {words.map((word, wordIdx) => (
        <span key={wordIdx} className="inline-block mr-[0.25em]">
          {word.split('').map((char, charIdx) => (
            <motion.span
              key={charIdx}
              className={`inline-block ${charClassName}`}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{
                duration: 0.4,
                delay: delay + (wordIdx * word.length + charIdx) * staggerDelay,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.span>
  );
}

// Counter animation
export function CounterReveal({
  value,
  duration = 2,
  delay = 0,
  threshold = 0.3,
  once = true,
  prefix = '',
  suffix = '',
  className = '',
  ...props
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: threshold });
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    if (!isInView) return;
    
    const startTime = Date.now();
    const endTime = startTime + duration * 1000;
    
    const timer = setInterval(() => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setDisplayValue(Math.round(eased * value));
      
      if (progress >= 1) clearInterval(timer);
    }, 16);
    
    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
      {...props}
    >
      {prefix}{displayValue.toLocaleString()}{suffix}
    </motion.span>
  );
}

// Card reveal with 3D tilt effect
export function TiltCard({
  children,
  className = '',
  glareEnabled = true,
  tiltAmount = 10,
  ...props
}) {
  const ref = useRef(null);
  const [tilt, setTilt] = React.useState({ x: 0, y: 0 });
  const [glare, setGlare] = React.useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setTilt({
      x: (y - 0.5) * tiltAmount,
      y: (x - 0.5) * -tiltAmount
    });
    
    if (glareEnabled) {
      setGlare({ x: x * 100, y: y * 100, opacity: 0.15 });
    }
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: tilt.x,
        rotateY: tilt.y
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative ${className}`}
      style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
      {...props}
    >
      {children}
      {glareEnabled && (
        <div
          className="absolute inset-0 pointer-events-none rounded-inherit"
          style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.opacity}), transparent 50%)`,
            borderRadius: 'inherit'
          }}
        />
      )}
    </motion.div>
  );
}

// Infinite marquee/carousel
export function Marquee({
  children,
  speed = 30,
  direction = 'left',
  pauseOnHover = true,
  className = '',
  ...props
}) {
  const [isPaused, setIsPaused] = React.useState(false);
  
  return (
    <div
      className={`overflow-hidden ${className}`}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      {...props}
    >
      <motion.div
        className="flex gap-8"
        animate={{
          x: direction === 'left' ? [0, '-50%'] : ['-50%', 0]
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: speed,
            ease: "linear"
          }
        }}
        style={{
          animationPlayState: isPaused ? 'paused' : 'running'
        }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}

export default ScrollReveal;