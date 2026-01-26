import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const LOGO_DATA = [
  { name: "AWS", logo: "https://www.vectorlogo.zone/logos/amazon_aws/amazon_aws-ar21.svg" },
  { name: "Google Cloud", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg" },
  { name: "Microsoft Azure", logo: "https://www.vectorlogo.zone/logos/microsoft_azure/microsoft_azure-ar21.svg" },
  { name: "OpenAI", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg" },
  { name: "Stripe", logo: "https://logo.clearbit.com/stripe.com" },
  { name: "Base44", logo: "https://avatars.githubusercontent.com/u/145019558?s=200&v=4" }
];

export default function TechMarquee({ title, subtitle, logos = LOGO_DATA }) {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  const repeated = [...logos, ...logos, ...logos];

  return (
    <div ref={containerRef} className="w-full max-w-7xl mx-auto px-4 py-16">
      {title && (
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, x: -80 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-2xl md:text-3xl font-bold text-white mb-4"
          >
            {title}
          </motion.h2>
          {subtitle && (
            <motion.p 
              initial={{ opacity: 0, x: 80 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg text-white/90 max-w-4xl mx-auto"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 0.35 }}
        className="marquee-container"
      >
        <div className="marquee-content">
          {repeated.map((company, idx) => (
            <div key={`${company.name}-${idx}`} className="logo-item">
              <img 
                src={company.logo} 
                alt={company.name}
                className="logo-img"
                loading="lazy"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          ))}
        </div>
      </motion.div>

      <style>{`
        .marquee-container {
          overflow: hidden;
          position: relative;
          width: 100%;
          padding: 0.75rem 0;
          -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
          mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
        }
        .marquee-content {
          display: flex;
          gap: 2rem;
          width: max-content;
          animation: marquee-scroll 60s linear infinite;
          will-change: transform;
        }
        .marquee-container:hover .marquee-content {
          animation-play-state: paused;
        }
        .logo-item {
          flex-shrink: 0;
          width: 120px;
          height: 60px;
          padding: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
        }
        .logo-img {
          max-width: 100%;
          max-height: 100%;
          width: auto;
          height: auto;
          object-fit: contain;
          filter: brightness(0) invert(1) opacity(0.7);
          transition: all 0.4s;
        }
        .logo-item:hover {
          transform: scale(1.15);
        }
        .logo-item:hover .logo-img {
          filter: brightness(1) invert(0) opacity(1);
        }
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(calc(-100% / 3)); }
        }
      `}</style>
    </div>
  );
}