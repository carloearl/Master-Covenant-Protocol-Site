export const FAQ_MASTER_DATA = [
  {
    id: "what-is-glyphlock",
    category: "Basics",
    icon: "Sparkles",
    q: "I am new to cybersecurity. What is GlyphLock in simple terms?",
    a: [
      "GlyphLock is a next-generation security system that hides protected data inside images and QR codes.",
      "When someone scans or taps one of these images, GlyphLock checks if the interaction is safe, real, and untampered, then logs proof so ownership and integrity can be verified later.",
      "In simple terms, GlyphLock turns pictures into secure digital checkpoints that protect your business, your customers, and your data in real time."
    ]
  },
  {
    id: "why-qr-matters",
    category: "QR Studio",
    icon: "ScanLine",
    q: "Why are QR codes a core part of GlyphLock?",
    a: [
      "Because QR is the universal bridge between the physical world and digital actions.",
      "GlyphLock upgrades QR into a secure interaction layer with risk scoring, tamper detection, and blockchain audit, instead of a dumb square that just opens a link."
    ]
  },
  {
    id: "artistic-qr-scan",
    category: "QR Studio",
    icon: "ShieldCheck",
    q: "Why do some artistic QR images on the internet look cool but do not scan well?",
    a: [
      "Most artistic QR generators break the math that makes QR readable.",
      "QR scanners need strong contrast, quiet zones, and stable finder patterns. When art overlays blur those zones or change module shapes too much, scanners fail.",
      "GlyphLock solves this by keeping the QR matrix sacred and layering art in a controlled way, with a scannability meter and safe art mode so beauty never destroys readability."
    ]
  },
  {
    id: "anti-quishing",
    category: "Security",
    icon: "AlertTriangle",
    q: "How does GlyphLock protect people from QR phishing?",
    a: [
      "Every code gets a risk score before you activate it.",
      "We flag punycode lookalikes, sketchy shorteners, suspicious domains, and payload tricks, then warn the user or block activation unless they confirm.",
      "This is anti-quishing built into the generator, not an afterthought."
    ]
  },
  {
    id: "tamper-proof",
    category: "Security",
    icon: "LockKeyhole",
    q: "What happens if someone replaces or stickers over my QR code?",
    a: [
      "GlyphLock compares what the scan resolves to against the original signed configuration.",
      "If it does not match, we log a tamper event, optionally auto-revoke the asset, and route scanners to a warning page instead of the real destination."
    ]
  },
  {
    id: "image-lab-what",
    category: "Image Lab",
    icon: "Sparkles",
    q: "What is the Image Lab?",
    a: [
      "Image Lab is a unified platform for AI image generation and interactive hotspot editing.",
      "Generate images with AI, add clickable hotspots, and lock them cryptographically for tamper-proof verification.",
      "Perfect for creating secure interactive assets, QR art covers, and verified visual content."
    ]
  },
  {
    id: "need-technical-knowledge",
    category: "Getting Started",
    icon: "HelpCircle",
    q: "Do I need technical knowledge to use GlyphLock?",
    a: [
      "No! GlyphLock is designed for everyone. Our interface is user-friendly with step-by-step guides.",
      "If you can use a smartphone, you can use GlyphLock. We also offer training videos and 24/7 support to help you."
    ]
  },
  {
    id: "get-started",
    category: "Getting Started",
    icon: "Zap",
    q: "How do I get started?",
    a: [
      "Simple! Sign up for a free account, try our tools with free trials, choose a plan that fits your needs, and start protecting your business.",
      "The whole process takes less than 10 minutes."
    ]
  },
  {
    id: "what-free",
    category: "Getting Started",
    icon: "Gift",
    q: "What do I get for free?",
    a: [
      "Every new user gets free trials of all our security tools: QR Studio, Image Lab, Steganography, Hotzone Mapper, and limited access to GlyphBot AI.",
      "No credit card required to start exploring."
    ]
  },
  {
    id: "pricing-overview",
    category: "Pricing & Billing",
    icon: "DollarSign",
    q: "How much does GlyphLock cost?",
    a: [
      "Professional: $200/month - perfect for small to medium businesses.",
      "Enterprise: $2,000/month - built for large organizations.",
      "Both plans include all security tools. You can try everything free first before committing."
    ]
  },
  {
    id: "professional-plan",
    category: "Pricing & Billing",
    icon: "Package",
    q: "What's included in the Professional plan?",
    a: [
      "All security tools (QR Studio, Image Lab, Steganography, Blockchain, Hotzone Mapper), GlyphBot AI assistant, up to 1,000 QR codes per month, standard email support, and full dashboard access.",
      "Perfect for most businesses."
    ]
  },
  {
    id: "enterprise-features",
    category: "Pricing & Billing",
    icon: "Crown",
    q: "What extra features does Enterprise include?",
    a: [
      "Everything in Professional PLUS: Unlimited QR generation, NUPS POS System, 24/7 priority support with <4 hour response time, custom integrations, dedicated account manager, API access, and Security Operations Center."
    ]
  }
];

export default FAQ_MASTER_DATA;