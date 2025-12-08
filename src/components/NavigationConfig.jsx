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
  { label: "Command Center", href: "/CommandCenter" },
  { label: "Pricing", href: "/Pricing" },
  { label: "Consultation", href: "/Consultation" }
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
    label: "Products",
    items: [
      { label: "QR Studio", page: "Qr" },
      { label: "Image Lab", page: "ImageLab" },
      { label: "GlyphBot AI", page: "GlyphBot" },
      { label: "NUPS POS", page: "NUPSLogin" },
      { label: "Security Tools", page: "SecurityTools" },
      { label: "Media Upload Hub", page: "VideoUpload" }
    ]
  },
  {
    label: "Resources",
    items: [
      { label: "Documentation", page: "SecurityDocs" },
      { label: "SDK Docs", page: "SDKDocs" },
      { label: "Dream Team", page: "DreamTeam" },
      { label: "Pricing", page: "Pricing" },
      { label: "FAQ", page: "FAQ" },
      { label: "Roadmap", page: "Roadmap" },
      { label: "Consultation", page: "Consultation" }
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
  products: [
    { label: "QR Studio", page: "Qr" },
    { label: "Image Lab", page: "ImageLab" },
    { label: "GlyphBot AI", page: "GlyphBot" },
    { label: "NUPS POS", page: "NUPSLogin" },
    { label: "Security Tools", page: "SecurityTools" }
  ],
  resources: [
    { label: "Documentation", page: "SecurityDocs" },
    { label: "SDK Docs", page: "SDKDocs" },
    { label: "Dream Team", page: "DreamTeam" },
    { label: "Pricing", page: "Pricing" },
    { label: "FAQ", page: "FAQ" },
    { label: "Roadmap", page: "Roadmap" },
    { label: "Consultation", page: "Consultation" }
  ],
  legal: [
    { label: "Privacy Policy", page: "Privacy" },
    { label: "Terms of Service", page: "Terms" },
    { label: "Cookie Policy", page: "Cookies" }
  ]
};

export default { NAV, NAV_SECTIONS, FOOTER_LINKS };