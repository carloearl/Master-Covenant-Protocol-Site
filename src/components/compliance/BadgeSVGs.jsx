import React from "react";

/**
 * OFFICIAL-STYLE COMPLIANCE BADGE SVGs
 * Professional SVG representations for compliance standards
 * 
 * NOTE: For production use with actual certifications:
 * - Replace with official badge files from certification bodies
 * - SOC 2: Download from AICPA or auditing firm
 * - ISO 27001: Download from certification body (BSI, DNV, SGS)
 * - PCI DSS: Download from PCI Security Standards Council
 */

export const SOC2Badge = ({ className = "w-24 h-24" }) => (
  <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Shield Background */}
    <path d="M60 10L20 30V55C20 75 35 92 60 110C85 92 100 75 100 55V30L60 10Z" fill="url(#soc2Grad)" stroke="#1E40AF" strokeWidth="2"/>
    
    {/* Checkmark */}
    <path d="M45 60L55 70L75 45" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
    
    {/* Text */}
    <text x="60" y="92" fontSize="12" fontWeight="bold" fill="white" textAnchor="middle">SOC 2</text>
    <text x="60" y="104" fontSize="8" fill="white" textAnchor="middle">TYPE II</text>
    
    <defs>
      <linearGradient id="soc2Grad" x1="20" y1="10" x2="100" y2="110">
        <stop offset="0%" stopColor="#3B82F6"/>
        <stop offset="100%" stopColor="#1E40AF"/>
      </linearGradient>
    </defs>
  </svg>
);

export const ISO27001Badge = ({ className = "w-24 h-24" }) => (
  <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Circular Badge */}
    <circle cx="60" cy="60" r="48" fill="url(#isoGrad)" stroke="#7C3AED" strokeWidth="2"/>
    <circle cx="60" cy="60" r="42" fill="none" stroke="white" strokeWidth="1" strokeDasharray="3 3"/>
    
    {/* Lock Icon */}
    <rect x="50" y="52" width="20" height="18" rx="2" fill="white"/>
    <path d="M52 52V48C52 43.5817 55.5817 40 60 40C64.4183 40 68 43.5817 68 48V52" stroke="white" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="60" cy="62" r="2" fill="#7C3AED"/>
    
    {/* Text */}
    <text x="60" y="88" fontSize="11" fontWeight="bold" fill="white" textAnchor="middle">ISO 27001</text>
    <text x="60" y="100" fontSize="7" fill="white" textAnchor="middle">CERTIFIED</text>
    
    <defs>
      <linearGradient id="isoGrad" x1="12" y1="12" x2="108" y2="108">
        <stop offset="0%" stopColor="#9333EA"/>
        <stop offset="100%" stopColor="#6B21A8"/>
      </linearGradient>
    </defs>
  </svg>
);

export const PCIDSSBadge = ({ className = "w-24 h-24" }) => (
  <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Hexagon Background */}
    <path d="M60 10L95 32.5V77.5L60 100L25 77.5V32.5L60 10Z" fill="url(#pciGrad)" stroke="#047857" strokeWidth="2"/>
    
    {/* Credit Card Icon */}
    <rect x="40" y="48" width="40" height="24" rx="3" fill="white"/>
    <rect x="40" y="52" width="40" height="6" fill="#10B981"/>
    <rect x="44" y="64" width="12" height="4" rx="1" fill="#047857"/>
    
    {/* Text */}
    <text x="60" y="92" fontSize="11" fontWeight="bold" fill="white" textAnchor="middle">PCI DSS</text>
    <text x="60" y="102" fontSize="7" fill="white" textAnchor="middle">COMPLIANT</text>
    
    <defs>
      <linearGradient id="pciGrad" x1="25" y1="10" x2="95" y2="100">
        <stop offset="0%" stopColor="#10B981"/>
        <stop offset="100%" stopColor="#047857"/>
      </linearGradient>
    </defs>
  </svg>
);

export const GDPRBadge = ({ className = "w-24 h-24" }) => (
  <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* EU Flag-inspired Background */}
    <rect x="10" y="10" width="100" height="100" rx="8" fill="url(#gdprGrad)"/>
    
    {/* Stars in circle (simplified EU flag) */}
    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
      const angle = (i * 30 - 90) * Math.PI / 180;
      const x = 60 + 25 * Math.cos(angle);
      const y = 55 + 25 * Math.sin(angle);
      return (
        <circle key={i} cx={x} cy={y} r="2" fill="#FCD34D"/>
      );
    })}
    
    {/* Shield Icon */}
    <path d="M60 35L45 42V55C45 63 50 70 60 78C70 70 75 63 75 55V42L60 35Z" fill="white" opacity="0.9"/>
    
    {/* Text */}
    <text x="60" y="92" fontSize="12" fontWeight="bold" fill="white" textAnchor="middle">GDPR</text>
    <text x="60" y="103" fontSize="7" fill="white" textAnchor="middle">COMPLIANT</text>
    
    <defs>
      <linearGradient id="gdprGrad" x1="10" y1="10" x2="110" y2="110">
        <stop offset="0%" stopColor="#0284C7"/>
        <stop offset="100%" stopColor="#0369A1"/>
      </linearGradient>
    </defs>
  </svg>
);

export const HIPAABadge = ({ className = "w-24 h-24" }) => (
  <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Medical Cross Background */}
    <circle cx="60" cy="60" r="48" fill="url(#hipaaGrad)" stroke="#4338CA" strokeWidth="2"/>
    
    {/* Medical Cross */}
    <rect x="55" y="35" width="10" height="50" rx="2" fill="white"/>
    <rect x="35" y="55" width="50" height="10" rx="2" fill="white"/>
    
    {/* Lock overlay */}
    <circle cx="60" cy="60" r="12" fill="#4338CA"/>
    <rect x="56" y="58" width="8" height="8" rx="1" fill="white"/>
    <path d="M57 58V55C57 53.3431 58.3431 52 60 52C61.6569 52 63 53.3431 63 55V58" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    
    {/* Text */}
    <text x="60" y="96" fontSize="12" fontWeight="bold" fill="white" textAnchor="middle">HIPAA</text>
    <text x="60" y="106" fontSize="7" fill="white" textAnchor="middle">COMPLIANT</text>
    
    <defs>
      <linearGradient id="hipaaGrad" x1="12" y1="12" x2="108" y2="108">
        <stop offset="0%" stopColor="#6366F1"/>
        <stop offset="100%" stopColor="#4338CA"/>
      </linearGradient>
    </defs>
  </svg>
);

export const BadgeComponents = {
  SOC2Badge,
  ISO27001Badge,
  PCIDSSBadge,
  GDPRBadge,
  HIPAABadge
};