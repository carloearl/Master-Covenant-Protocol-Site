// Unified Navigation Configuration
// Single source of truth for Navbar and Footer

export const NAV = [
  { label: "Home", href: "/" },
  { label: "Dream Team", href: "/DreamTeam" },
  { label: "GlyphBot Jr", href: "/GlyphBotJunior" },
  { label: "Command Center", href: "/CommandCenter" },
  { label: "Pricing", href: "/Pricing" },
  { label: "Consultation", href: "/Consultation" }
];

export const NAV_SECTIONS = [
  {
    title: "Products",
    label: "Products",
    links: [
      { label: "QR Generator", href: "/qr-generator", page: "QrGenerator" },
      { label: "QR Create", href: "/qr-generator/create", page: "QrGeneratorCreate" },
      { label: "QR Security", href: "/qr-generator/security", page: "QrGeneratorSecurity" },
      { label: "Image Lab", href: "/ImageLab", page: "ImageLab" },
      { label: "Steganography", href: "/Steganography", page: "Steganography" },
      { label: "GlyphBot", href: "/GlyphBot", page: "GlyphBot" },
      { label: "Blockchain", href: "/Blockchain", page: "Blockchain" }
    ],
    items: [
      { label: "QR Generator", page: "QrGenerator" },
      { label: "Image Lab", page: "ImageLab" },
      { label: "Steganography", page: "Steganography" },
      { label: "GlyphBot", page: "GlyphBot" },
      { label: "Blockchain", page: "Blockchain" }
    ]
  },
  {
    title: "Solutions",
    label: "Solutions",
    links: [
      { label: "Security Tools", href: "/SecurityTools", page: "SecurityTools" },
      { label: "Visual Cryptography", href: "/VisualCryptography", page: "VisualCryptography" },
      { label: "NUPS POS", href: "/NUPSLogin", page: "NUPSLogin" },
      { label: "SOC", href: "/SecurityOperationsCenter", page: "SecurityOperationsCenter" },
      { label: "Master Covenant", href: "/MasterCovenant", page: "MasterCovenant" }
    ],
    items: [
      { label: "Security Tools", page: "SecurityTools" },
      { label: "Visual Cryptography", page: "VisualCryptography" },
      { label: "NUPS POS", page: "NUPSLogin" },
      { label: "SOC", page: "SecurityOperationsCenter" },
      { label: "Master Covenant", page: "MasterCovenant" }
    ]
  },
  {
    title: "Company",
    label: "Company",
    links: [
      { label: "About", href: "/About", page: "About" },
      { label: "Pricing", href: "/Pricing", page: "Pricing" },
      { label: "Contact", href: "/Contact", page: "Contact" },
      { label: "Partners", href: "/Partners", page: "Partners" },
      { label: "Roadmap", href: "/Roadmap", page: "Roadmap" }
    ],
    items: [
      { label: "About", page: "About" },
      { label: "Pricing", page: "Pricing" },
      { label: "Contact", page: "Contact" },
      { label: "Partners", page: "Partners" },
      { label: "Roadmap", page: "Roadmap" }
    ]
  },
  {
    title: "Resources",
    label: "Resources",
    links: [
      { label: "Documentation", href: "/SecurityDocs", page: "SecurityDocs" },
      { label: "FAQ", href: "/FAQ", page: "FAQ" },
      { label: "Dream Team", href: "/DreamTeam", page: "DreamTeam" },
      { label: "Consultation", href: "/Consultation", page: "Consultation" }
    ],
    items: [
      { label: "Documentation", page: "SecurityDocs" },
      { label: "FAQ", page: "FAQ" },
      { label: "Dream Team", page: "DreamTeam" },
      { label: "Consultation", page: "Consultation" }
    ]
  }
];

export const FOOTER_LINKS = {
  legal: [
    { label: "Privacy Policy", href: "/Privacy", page: "Privacy" },
    { label: "Terms of Service", href: "/Terms", page: "Terms" },
    { label: "Cookie Policy", href: "/Cookies", page: "Cookies" },
    { label: "Accessibility", href: "/Accessibility", page: "Accessibility" }
  ],
  general: [
    { label: "Home", href: "/", page: "Home" },
    { label: "Dream Team", href: "/DreamTeam", page: "DreamTeam" },
    { label: "GlyphBot Jr", href: "/GlyphBotJunior", page: "GlyphBotJunior" },
    { label: "Command Center", href: "/CommandCenter", page: "CommandCenter" }
  ],
  company: [
    { label: "About Us", page: "About" },
    { label: "Pricing", page: "Pricing" },
    { label: "Contact", page: "Contact" },
    { label: "Partners", page: "Partners" },
    { label: "Roadmap", page: "Roadmap" }
  ],
  solutions: [
    { label: "Security Tools", page: "SecurityTools" },
    { label: "QR Generator", page: "QrGenerator", href: "/qr-generator" },
    { label: "QR Create", page: "QrGeneratorCreate", href: "/qr-generator/create" },
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

export default { NAV, NAV_SECTIONS, FOOTER_LINKS };