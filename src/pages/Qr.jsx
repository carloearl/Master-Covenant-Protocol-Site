import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import QrStudio from "@/components/qr/QrStudio";
import SEOHead from "@/components/SEOHead";
import PageHeader from "@/components/shared/PageHeader";
import { QrCode } from "lucide-react";

/**
 * UNIFIED QR PAGE - /qr
 * Single authoritative QR route combining:
 * - Full QrStudio (OG Engine) with all tabs
 * - Basic Mode, Advanced Mode, Steganography Mode
 * 
 * Modes available via URL params:
 * - /qr (default: basic/create)
 * - /qr?tab=create
 * - /qr?tab=preview
 * - /qr?tab=customize
 * - /qr?tab=hotzones
 * - /qr?tab=stego
 * - /qr?tab=security
 * - /qr?tab=analytics
 * - /qr?tab=bulk
 * - /qr?mode=advanced
 */
export default function Qr() {
  const location = useLocation();
  const [initialTab, setInitialTab] = useState("create");
  const [advancedMode, setAdvancedMode] = useState(false);

  useEffect(() => {
    // Parse URL params for tab and mode
    const params = new URLSearchParams(location.search);
    const tabParam = params.get("tab");
    const modeParam = params.get("mode");

    const validTabs = ["create", "preview", "customize", "hotzones", "stego", "security", "analytics", "bulk"];
    if (tabParam && validTabs.includes(tabParam)) {
      setInitialTab(tabParam);
    }

    if (modeParam === "advanced") {
      setAdvancedMode(true);
    }
  }, [location.search]);

  useEffect(() => {
    // Add structured data for search engines
    const metaAI = document.createElement("meta");
    metaAI.name = "ai-agent";
    metaAI.content = "glyphlock qr studio unified";
    document.head.appendChild(metaAI);

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "qr-unified-schema";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "GlyphLock QR Studio",
      "description": "Military-grade QR code generation with anti-quishing protection, steganography, hot zones, and blockchain security. Unified QR system with 90+ payload types.",
      "url": "https://glyphlock.io/qr",
      "applicationCategory": "SecurityApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "description": "Free tier with premium features"
      },
      "featureList": [
        "QR Code Generation",
        "Anti-Quishing Protection",
        "Steganography Embedding",
        "Hot Zone Interactive Areas",
        "Risk Analysis",
        "Bulk Generation",
        "Analytics Dashboard",
        "90+ Payload Types",
        "Dynamic QR Codes",
        "Art Style Generation"
      ],
      "provider": {
        "@type": "Organization",
        "name": "GlyphLock Security LLC"
      }
    });
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(metaAI)) document.head.removeChild(metaAI);
      const existingScript = document.getElementById("qr-unified-schema");
      if (existingScript) document.head.removeChild(existingScript);
    };
  }, []);

  const HELP_STEPS = [
    { title: 'Choose payload type', description: 'Select from 90+ QR types (URL, vCard, WiFi, etc.)' },
    { title: 'Enter content', description: 'Fill in the payload data for your QR code' },
    { title: 'Customize design', description: 'Style colors, shapes, and add logos' },
    { title: 'Add hot zones', description: 'Create interactive clickable areas (optional)' },
    { title: 'Download or share', description: 'Export as PNG/SVG or get a trackable link' }
  ];

  const SHORTCUTS = [
    { action: 'Generate QR', keys: 'Cmd/Ctrl + Enter' },
    { action: 'Download', keys: 'Cmd/Ctrl + D' },
    { action: 'Copy to clipboard', keys: 'Cmd/Ctrl + C' }
  ];

  const TIPS = [
    'Use Dynamic QR for trackable, editable links',
    'Add hot zones for interactive marketing',
    'Steganography hides data inside normal images',
    'Security tab shows threat analysis'
  ];

  return (
    <>
      <SEOHead
        title="GlyphLock QR Studio | Secure QR Code Generator with Anti-Quishing Protection"
        description="Create secure QR codes with GlyphLock's unified QR Studio. Features anti-quishing protection, steganography, hot zones, 90+ payload types, and military-grade encryption."
        keywords="QR code generator, secure QR codes, anti-quishing, steganography QR, QR security, hot zones QR, bulk QR generation, GlyphLock QR Studio, dynamic QR codes"
        url="/qr"
      />
      
      <PageHeader
        title="QR Studio"
        subtitle="Secure QR codes with anti-quishing protection"
        icon={QrCode}
        badge="90+ Types"
        backTo="Home"
        helpSteps={HELP_STEPS}
        shortcuts={SHORTCUTS}
        tips={TIPS}
      />
      
      <div className="min-h-screen text-white relative" style={{ background: 'transparent', pointerEvents: 'auto' }}>
        <div className="relative z-10 py-4 px-2 sm:px-4" style={{ pointerEvents: 'auto' }}>
          <QrStudio initialTab={initialTab} />
        </div>
      </div>
    </>
  );
}