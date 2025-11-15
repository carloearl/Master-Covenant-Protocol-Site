
// Single Source of Truth for All Site Navigation
export const navigationConfig = {
  main: [
    { label: "Home", page: "Home" },
    {
      label: "Company",
      dropdown: [
        { label: "About Us", page: "About" },
        { label: "Roadmap", page: "Roadmap" },
        { label: "Master Covenant", page: "MasterCovenant" },
      ]
    },
    {
      label: "Services",
      dropdown: [
        { label: "QR Generator", page: "QRGenerator" },
        { label: "Steganography", page: "Steganography" },
        { label: "Blockchain Security", page: "Blockchain" },
        { label: "Security Operations", page: "SecurityOperations" },
        { label: "Complete Security Ecosystem", page: "SecurityTools" },
      ]
    },
    { label: "GlyphBot AI", page: "GlyphBot" },
    { label: "N.U.P.S. POS", page: "NUPSLogin" },
    { label: "Pricing", page: "Pricing" },
    { label: "Contact", page: "Contact" },
  ],
  
  footer: {
    company: [
      { label: "About Us", page: "About" },
      { label: "Roadmap", page: "Roadmap" },
      { label: "Master Covenant", page: "MasterCovenant" },
      { label: "Contact", page: "Contact" },
    ],
    services: [
      { label: "Complete Security Ecosystem", page: "SecurityTools" },
      { label: "QR Generator", page: "QRGenerator" },
      { label: "Steganography", page: "Steganography" },
      { label: "Blockchain", page: "Blockchain" },
      { label: "Security Operations", page: "SecurityOperations" },
      { label: "GlyphBot AI", page: "GlyphBot" },
      { label: "N.U.P.S. POS", page: "NUPSLogin" },
    ],
    legal: [
      { label: "Privacy Policy", page: "Privacy" },
      { label: "Terms of Service", page: "Terms" },
      { label: "Security Documentation", page: "SecurityDocs" },
    ]
  }
};
