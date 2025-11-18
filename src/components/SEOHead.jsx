import React from 'react';
import { Helmet } from 'react-helmet';

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

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Robots */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="GlyphLock" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional SEO */}
      <meta name="author" content="GlyphLock Security LLC" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="English" />
      <link rel="canonical" href={fullUrl} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
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
        })}
      </script>
    </Helmet>
  );
}