// Shared Navigation Configuration for Navbar and Footer
// Single source of truth for all navigation links

export const NAV_SECTIONS = {
  products: {
    label: "Products",
    items: [
      { label: "QR Generator", page: "QRGenerator", description: "Secure QR code generation" },
      { label: "Image Lab", page: "ImageLab", description: "AI-powered image tools" },
      { label: "Steganography", page: "Steganography", description: "Hidden data encoding" },
      { label: "GlyphBot", page: "GlyphBot", description: "AI security assistant" },
      { label: "Blockchain", page: "Blockchain", description: "Decentralized security" }
    ]
  },
  solutions: {
    label: "Solutions",
    items: [
      { label: "Security Tools", page: "SecurityTools", description: "Enterprise security suite" },
      { label: "Visual Cryptography", page: "VisualCryptography", description: "Visual encryption" },
      { label: "NUPS POS", page: "NUPSLogin", description: "Point of sale system" },
      { label: "SOC", page: "SecurityOperationsCenter", description: "Security operations" },
      { label: "Master Covenant", page: "MasterCovenant", description: "AI governance" }
    ]
  },
  company: {
    label: "Company",
    items: [
      { label: "About", page: "About" },
      { label: "Pricing", page: "Pricing" },
      { label: "Contact", page: "Contact" },
      { label: "Partners", page: "Partners" },
      { label: "Roadmap", page: "Roadmap" }
    ]
  },
  resources: {
    label: "Resources",
    items: [
      { label: "Documentation", page: "SecurityDocs" },
      { label: "FAQ", page: "FAQ" },
      { label: "Dream Team", page: "DreamTeam" },
      { label: "Consultation", page: "Consultation" }
    ]
  }
};

export const FOOTER_LINKS = {
  company: [
    { label: "About Us", page: "About" },
    { label: "Pricing", page: "Pricing" },
    { label: "Contact", page: "Contact" },
    { label: "Partners", page: "Partners" },
    { label: "Roadmap", page: "Roadmap" }
  ],
  solutions: [
    { label: "Security Tools", page: "SecurityTools" },
    { label: "QR Generator", page: "QRGenerator" },
    { label: "Steganography", page: "Steganography" },
    { label: "Image Lab", page: "ImageLab" },
    { label: "GlyphBot AI", page: "GlyphBot" }
  ],
  resources: [
    { label: "Documentation", page: "SecurityDocs" },
    { label: "FAQ", page: "FAQ" },
    { label: "Command Center", page: "CommandCenter" },
    { label: "Dream Team", page: "DreamTeam" },
    { label: "Consultation", page: "Consultation" }
  ]
};

export const LEGAL_LINKS = [
  { label: "Privacy Policy", page: "Privacy" },
  { label: "Terms of Service", page: "Terms" },
  { label: "Cookie Policy", page: "Cookies" },
  { label: "Accessibility", page: "Accessibility" }
];

export default { NAV_SECTIONS, FOOTER_LINKS, LEGAL_LINKS };