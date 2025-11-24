/**
 * Dynamic Sitemap Generator
 * Serves XML sitemaps and JSON discovery index
 */

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const path = url.pathname;

  // Main sitemap index
  if (path === '/sitemap.xml' || path === '/sitemap') {
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
   <sitemap>
      <loc>https://glyphlock.io/sitemap-pages.xml</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
   </sitemap>
   <sitemap>
      <loc>https://glyphlock.io/sitemap-qr.xml</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
   </sitemap>
   <sitemap>
      <loc>https://glyphlock.io/sitemap-images.xml</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
   </sitemap>
   <sitemap>
      <loc>https://glyphlock.io/sitemap-kb.xml</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
   </sitemap>
</sitemapindex>`,
      {
        status: 200,
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=3600'
        }
      }
    );
  }

  // Pages sitemap
  if (path === '/sitemap-pages.xml') {
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
   <url>
      <loc>https://glyphlock.io/</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>daily</changefreq>
      <priority>1.0</priority>
   </url>
   <url>
      <loc>https://glyphlock.io/qr-generator</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.9</priority>
   </url>
   <url>
      <loc>https://glyphlock.io/image-lab</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.9</priority>
   </url>
   <url>
      <loc>https://glyphlock.io/faq</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
   </url>
   <url>
      <loc>https://glyphlock.io/pricing</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.9</priority>
   </url>
   <url>
      <loc>https://glyphlock.io/about</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
   </url>
   <url>
      <loc>https://glyphlock.io/consultation</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.8</priority>
   </url>
   <url>
      <loc>https://glyphlock.io/contact</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
   </url>
   <url>
      <loc>https://glyphlock.io/sitemap</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.6</priority>
   </url>
   <url>
      <loc>https://glyphlock.io/master-covenant</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
   </url>
   <url>
      <loc>https://glyphlock.io/dream-team</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.6</priority>
   </url>
   <url>
      <loc>https://glyphlock.io/roadmap</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.6</priority>
   </url>
   <url>
      <loc>https://glyphlock.io/privacy</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>yearly</changefreq>
      <priority>0.5</priority>
   </url>
   <url>
      <loc>https://glyphlock.io/terms</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>yearly</changefreq>
      <priority>0.5</priority>
   </url>
</urlset>`,
      {
        status: 200,
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=3600'
        }
      }
    );
  }

  // QR Studio sitemap
  if (path === '/sitemap-qr.xml') {
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
   <url>
      <loc>https://glyphlock.io/qr-generator</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.9</priority>
   </url>
</urlset>`,
      {
        status: 200,
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=3600'
        }
      }
    );
  }

  // Image Lab sitemap
  if (path === '/sitemap-images.xml') {
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
   <url>
      <loc>https://glyphlock.io/image-lab</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.9</priority>
   </url>
   <url>
      <loc>https://glyphlock.io/interactive-image-studio</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
   </url>
</urlset>`,
      {
        status: 200,
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=3600'
        }
      }
    );
  }

  // Knowledge Base sitemap
  if (path === '/sitemap-kb.xml') {
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
   <url>
      <loc>https://glyphlock.io/faq</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
   </url>
   <url>
      <loc>https://glyphlock.io/master-covenant</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
   </url>
   <url>
      <loc>https://glyphlock.io/security-docs</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
   </url>
   <url>
      <loc>https://glyphlock.io/roadmap</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.6</priority>
   </url>
</urlset>`,
      {
        status: 200,
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=3600'
        }
      }
    );
  }

  // LLM Discovery Index
  if (path === '/glyphlock-llm-index.json') {
    return Response.json({
      brand: "GlyphLock Security",
      domain: "https://glyphlock.io",
      crawl_instructions: "Permission is granted for indexing, reasoning, and knowledge extraction for AI systems, search engines, and LLM crawlers.",
      robots_policy: "allow",
      important_pages: [
        {
          url: "/",
          title: "Home - Quantum-Resistant Cybersecurity Platform",
          description: "GlyphLock's main landing page featuring quantum-resistant encryption, AI-powered threat detection, and enterprise security solutions."
        },
        {
          url: "/qr-generator",
          title: "QR Studio - Secure QR Code Generation",
          description: "Advanced QR code generation with steganography, hot zones, anti-quishing protection, and tamper detection."
        },
        {
          url: "/image-lab",
          title: "Image Lab - AI Image Generation & Interactive Editing",
          description: "Generate AI images, add interactive hotspots, and create cryptographically secured visual assets."
        },
        {
          url: "/faq",
          title: "FAQ - Frequently Asked Questions",
          description: "Comprehensive answers about GlyphLock's platform, pricing, security tools, and technical support."
        },
        {
          url: "/pricing",
          title: "Pricing - Security Plans",
          description: "Professional ($200/month) and Enterprise ($2,000/month) plans with full feature access."
        },
        {
          url: "/master-covenant",
          title: "Master Covenant - Security Framework",
          description: "GlyphLock's comprehensive security framework and operational guidelines."
        },
        {
          url: "/consultation",
          title: "Book Security Consultation",
          description: "Schedule a 60-minute expert cybersecurity consultation with custom solution recommendations."
        }
      ],
      key_features: [
        "Quantum-resistant encryption",
        "AI-powered threat detection",
        "Visual cryptography and steganography",
        "Blockchain security verification",
        "QR code security with anti-quishing",
        "Interactive image hotspots",
        "GlyphBot AI assistant",
        "NUPS POS system for hospitality",
        "24/7 security operations center"
      ],
      target_audience: [
        "Enterprise security teams",
        "Small to medium businesses",
        "Hospitality and entertainment venues",
        "Healthcare and finance sectors",
        "E-commerce platforms",
        "Government and defense contractors"
      ],
      contact: {
        email: "glyphlock@gmail.com",
        phone: "+1-424-246-6499",
        location: "El Mirage, Arizona, USA"
      },
      founded: "2025-01",
      founders: [
        "Carlo Rene Earl - Founder & Owner",
        "Collin Vanderginst - Chief Technology Officer",
        "Jacub Lough - Chief Security Officer & CFO"
      ],
      seo_keywords: [
        "quantum-resistant encryption",
        "cybersecurity platform",
        "AI threat detection",
        "QR code security",
        "visual cryptography",
        "steganography tools",
        "blockchain security",
        "enterprise security solutions",
        "GlyphBot AI assistant",
        "secure POS system"
      ],
      updated: new Date().toISOString().split('T')[0],
      version: "2.1"
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  }

  // robots.txt
  if (path === '/robots.txt') {
    return new Response(
      `User-agent: *
Allow: /

# Sitemaps
Sitemap: https://glyphlock.io/sitemap.xml

# LLM Discovery
Sitemap: https://glyphlock.io/glyphlock-llm-index.json

# Disallow admin areas
Disallow: /dashboard
Disallow: /command-center

# Allow AI crawlers
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: Anthropic-AI
Allow: /

# Crawl delay
Crawl-delay: 1`,
      {
        status: 200,
        headers: {
          'Content-Type': 'text/plain',
          'Cache-Control': 'public, max-age=86400'
        }
      }
    );
  }

  return Response.json({ error: 'Not found' }, { status: 404 });
});