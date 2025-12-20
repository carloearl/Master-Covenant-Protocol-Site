/**
 * UNIFIED NAVIGATION CONFIGURATION
 * Single source of truth for Navbar and Footer
 * PHASE 3B VERIFIED - All routes confirmed to glyphlock.io ONLY
 * NO base44.app references permitted
 */

export const NAV = [
  { label: "Home", href: "/" },
  { label: "Dream Team", href: "/DreamTeam" },
  { label: "GlyphBot", href: "/GlyphBot" },
  { label: "Media Hub", href: "/VideoUpload" },
  { label: "Command Center", href: "/CommandCenter" },
  { label: "Protocol Verification", href: "/Consultation" }
];

export const NAV_SECTIONS = [
  {
    label: "Company",
    items: [
      { label: "About Us", page: "About" },
      { label: "Founder Story", page: "AboutCarlo" },
      { label: "Partners", page: "Partners" },
      { label: "Contact", page: "Contact" },
      { label: "Accessibility", page: "Accessibility" }
    ]
  },
  {
    label: "Modules",
    items: [
      { label: "QR Verification", page: "Qr" },
      { label: "Image Processing", page: "ImageLab" },
      { label: "GlyphBot Intelligence", page: "GlyphBot" },
      { label: "Site Builder", page: "SiteBuilder" },
      { label: "NUPS Transaction Verification", page: "NUPSLogin" },
      { label: "Security Modules", page: "SecurityTools" },
      { label: "Media Processing Hub", page: "VideoUpload" },
      { label: "QR Sitemap", page: "sitemap-qr" },
      { label: "SDK Documentation", page: "SDKDocs" }
    ]
  },
  {
    label: "Protocols",
    items: [
      { label: "Master Covenant", page: "GovernanceHub" },
      { label: "Protocol Verification", page: "Consultation" },
      { label: "Trust & Security", page: "TrustSecurity" },
      { label: "NIST Challenge", page: "NISTChallenge" },
      { label: "Case Studies", page: "CaseStudies" }
    ]
  },
  {
    label: "Resources",
    items: [
      { label: "Documentation", page: "SecurityDocs" },
      { label: "Dream Team", page: "DreamTeam" },
      { label: "FAQ", page: "FAQ" },
      { label: "Roadmap", page: "Roadmap" }
    ]
  },
  {
    label: "Account",
    items: [
      { label: "Security Settings", page: "AccountSecurity" },
      { label: "Command Center", page: "CommandCenter" }
    ]
  }
];

export const FOOTER_LINKS = {
  company: [
    { label: "About Us", page: "About" },
    { label: "Founder Story", page: "AboutCarlo" },
    { label: "Partners", page: "Partners" },
    { label: "Contact", page: "Contact" },
    { label: "Accessibility", page: "Accessibility" }
  ],
  modules: [
    { label: "QR Verification", page: "Qr" },
    { label: "Image Processing", page: "ImageLab" },
    { label: "GlyphBot Intelligence", page: "GlyphBot" },
    { label: "NUPS Transaction Verification", page: "NUPSLogin" },
    { label: "Security Modules", page: "SecurityTools" },
    { label: "SDK Documentation", page: "SDKDocs" }
  ],
  protocols: [
    { label: "Master Covenant", page: "GovernanceHub" },
    { label: "Protocol Verification", page: "Consultation" },
    { label: "Trust & Security", page: "TrustSecurity" },
    { label: "NIST Challenge", page: "NISTChallenge" },
    { label: "Case Studies", page: "CaseStudies" }
  ],
  resources: [
    { label: "Documentation", page: "SecurityDocs" },
    { label: "Dream Team", page: "DreamTeam" },
    { label: "FAQ", page: "FAQ" },
    { label: "Roadmap", page: "Roadmap" }
  ],
  legal: [
    { label: "Privacy Policy", page: "Privacy" },
    { label: "Terms of Service", page: "Terms" },
    { label: "Cookie Policy", page: "Cookies" }
  ],
  account: [
    { label: "Security Settings", page: "AccountSecurity" },
    { label: "Command Center", page: "CommandCenter" }
  ]
};

export default { NAV, NAV_SECTIONS, FOOTER_LINKS };