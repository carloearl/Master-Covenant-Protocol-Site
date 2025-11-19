import React, { useEffect } from 'react';

export default function SEOHead({ 
  title = "GlyphLock - Quantum-Resistant Cybersecurity & AI Security Platform",
  description = "Next-generation cybersecurity platform with quantum-resistant encryption, AI-powered threat detection, visual cryptography, blockchain security, and enterprise POS systems. Protect your digital assets with GlyphLock.",
  keywords = "cybersecurity, quantum-resistant encryption, AI security, blockchain security, visual cryptography, QR code security, steganography, threat detection, security operations center, enterprise security, POS system, NUPS, GlyphBot AI, secure payment processing, fraud prevention, identity protection, data encryption",
  image = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/d92107808_glyphlock-3d-logo.png",
  url,
  type = "website"
}) {
  const siteUrl = "https://glyphlock.io";
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;

  useEffect(() => {
    // Update title
    document.title = title;

    // Update favicon
    let favicon = document.querySelector('link[rel="icon"]');
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.setAttribute('rel', 'icon');
      document.head.appendChild(favicon);
    }
    favicon.setAttribute('href', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/08025b614_gl-logo.png');
    favicon.setAttribute('type', 'image/png');

    // Update or create meta tags
    const updateMetaTag = (name, content, property = false) => {
      const attribute = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Primary Meta Tags
    updateMetaTag('title', title);
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    updateMetaTag('googlebot', 'index, follow');
    updateMetaTag('bingbot', 'index, follow');
    updateMetaTag('author', 'GlyphLock Security LLC');

    // Open Graph
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:url', fullUrl, true);
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:site_name', 'GlyphLock', true);

    // Twitter
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:url', fullUrl);
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', fullUrl);

    // Structured Data
    let script = document.querySelector('script[type="application/ld+json"]');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "GlyphLock Security LLC",
      "url": siteUrl,
      "logo": image,
      "description": description,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "El Mirage",
        "addressRegion": "AZ",
        "addressCountry": "US"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+1-424-246-6499",
        "contactType": "customer service",
        "email": "glyphlock@gmail.com"
      },
      "sameAs": []
    });
  }, [title, description, keywords, image, fullUrl, type]);

  return null;
}