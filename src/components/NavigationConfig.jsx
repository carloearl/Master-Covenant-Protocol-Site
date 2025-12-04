
// Unified Navigation Configuration
// Single source of truth for Navbar and Footer
// VERIFIED PAGES - All routes confirmed to exist

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
    label: "Company",
    items: [
      { label: "About Us", page: "About" },
      { label: "Partners", page: "Partners" },
      { label: "Pricing", page: "Pricing" },
      { label: "Contact", page: "Contact" },
      { label: "FAQ", page: "FAQ" },
      { label: "Roadmap", page: "Roadmap" }
    ]
  },
  {
    label: "Solutions",
    items: [
      { label: "Security Tools", page: "SecurityTools" },
      { label: "QR Studio", page: "Qr" },
      { label: "Hotzone Mapper", page: "HotzoneMapper" },
      { label: "Image Lab", page: "ImageLab" },
      { label: "GlyphBot AI", page: "GlyphBot" }
    ]
  },
  {
    label: "Resources",
    items: [
      { label: "Documentation", page: "SecurityDocs" },
      { label: "Dream Team", page: "DreamTeam" },
      { label: "Command Center", page: "CommandCenter" },
      { label: "GlyphBot Junior", page: "GlyphBotJunior" },
      { label: "Consultation", page: "Consultation" }
    ]
  }
];

export const FOOTER_LINKS = {
  company: [
    { label: "About Us", page: "About" },
    { label: "Partners", page: "Partners" },
    { label: "Pricing", page: "Pricing" },
    { label: "Contact", page: "Contact" },
    { label: "FAQ", page: "FAQ" },
    { label: "Roadmap", page: "Roadmap" }
  ],
  solutions: [
    { label: "Security Tools", page: "SecurityTools" },
    { label: "QR Studio", page: "Qr" },
    { label: "Hotzone Mapper", page: "HotzoneMapper" },
    { label: "Image Lab", page: "ImageLab" },
    { label: "GlyphBot AI", page: "GlyphBot" }
  ],
  resources: [
    { label: "Documentation", page: "SecurityDocs" },
    { label: "SDK Docs", page: "SDKDocs" },
    { label: "Dream Team", page: "DreamTeam" },
    { label: "Command Center", page: "CommandCenter" },
    { label: "GlyphBot Junior", page: "GlyphBotJunior" },
    { label: "Consultation", page: "Consultation" }
  ],
  legal: [
    { label: "Privacy Policy", page: "Privacy" },
    { label: "Terms of Service", page: "Terms" },
    { label: "Cookie Policy", page: "Cookies" },
    { label: "Accessibility", page: "Accessibility" }
  ]
};

export default { NAV, NAV_SECTIONS, FOOTER_LINKS };
