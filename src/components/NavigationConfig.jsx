
// Single Source of Truth for All Site Navigation
export const navigationConfig = {
  main: [
    { label: "Home", page: "Home" },
    {
      label: "Company",
      dropdown: [
        { label: "About Us", page: "About" },
        { label: "Roadmap", page: "Roadmap" },
        { label: "Governance Hub", page: "GovernanceHub" },
        { label: "Partners & Valuation", page: "Partners" },
      ]
    },
    {
      label: "Security",
      dropdown: [
        { label: "Visual Cryptography", page: "VisualCryptography" },
        { label: "Blockchain Security", page: "Blockchain" },
        { label: "Security Operations", page: "SecurityOperationsCenter" },
        { label: "Complete Ecosystem", page: "SecurityTools" },
      ]
    },
    { label: "GlyphBot AI", page: "GlyphBot" },
    { label: "AI Image Generator", page: "ImageGenerator" },
    { label: "N.U.P.S. POS", page: "NUPSLogin" },
    { label: "Pricing", page: "Pricing" },
    { label: "Contact", page: "Contact" },
  ],
  
  footer: {
    company: [
      { label: "About Us", page: "About" },
      { label: "Roadmap", page: "Roadmap" },
      { label: "Governance Hub", page: "GovernanceHub" },
      { label: "Partners & Valuation", page: "Partners" },
      { label: "Contact", page: "Contact" },
      { label: "FAQ", page: "FAQ" },
    ],
    services: [
      { label: "Complete Security Ecosystem", page: "SecurityTools" },
      { label: "Visual Cryptography", page: "VisualCryptography" },
      { label: "Blockchain", page: "Blockchain" },
      { label: "Security Operations", page: "SecurityOperationsCenter" },
      { label: "GlyphBot AI", page: "GlyphBot" },
      { label: "AI Image Generator", page: "ImageGenerator" },
      { label: "N.U.P.S. POS", page: "NUPSLogin" },
    ],
    legal: [
      { label: "Privacy Policy", page: "Privacy" },
      { label: "Terms of Service", page: "Terms" },
      { label: "Security Documentation", page: "SecurityDocs" },
    ]
  }
};
