import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import QrStudio from "@/components/qr/QrStudio";
import SEOHead from "@/components/SEOHead";

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

  return (
    <>
      <SEOHead
        title="GlyphLock QR Studio | Secure QR Code Generator with Anti-Quishing Protection"
        description="Create secure QR codes with GlyphLock's unified QR Studio. Features anti-quishing protection, steganography, hot zones, 90+ payload types, and military-grade encryption."
        keywords="QR code generator, secure QR codes, anti-quishing, steganography QR, QR security, hot zones QR, bulk QR generation, GlyphLock QR Studio, dynamic QR codes"
        url="/qr"
      />
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black text-white relative">
        {/* Cosmic Background */}
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/30 via-cyan-900/10 to-transparent pointer-events-none z-0" />
        <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDYsIDE4MiwgMjEyLCAwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20 pointer-events-none z-0" />
        <div className="glyph-orb fixed top-20 right-20 opacity-20 pointer-events-none" style={{ animation: "float-orb 8s ease-in-out infinite", background: "radial-gradient(circle, rgba(6,182,212,0.3), rgba(59,130,246,0.2))" }}></div>
        <div className="glyph-orb fixed bottom-40 left-40 opacity-15 pointer-events-none" style={{ animation: "float-orb 10s ease-in-out infinite", width: "150px", height: "150px", background: "radial-gradient(circle, rgba(168,85,247,0.3), rgba(59,130,246,0.2))" }}></div>

        <div className="relative z-10 py-8">
          <QrStudio initialTab={initialTab} />
        </div>
      </div>
    </>
  );
}