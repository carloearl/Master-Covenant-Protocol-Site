/**
 * robots.txt endpoint
 * Serves the robots.txt file for search engine crawlers
 * Access at: https://glyphlock.io/robots.txt
 */

const SITE_URL = 'https://glyphlock.io';

Deno.serve(async (req) => {
  const robotsContent = `# GlyphLock Security LLC - robots.txt
# https://glyphlock.io
# Generated: ${new Date().toISOString()}

User-agent: *
Allow: /

# Public Tools
Allow: /qr-generator
Allow: /qr-generator/*
Allow: /image-lab
Allow: /steganography
Allow: /blockchain
Allow: /glyphbot
Allow: /glyphbot-junior

# Block admin/private areas
Disallow: /dashboard
Disallow: /command-center
Disallow: /nups-staff
Disallow: /nups-owner
Disallow: /api/
Disallow: /functions/
Disallow: /admin/

# Primary Sitemap Index
Sitemap: ${SITE_URL}/sitemap.xml

# Crawl-delay for politeness
Crawl-delay: 1

# Google-specific
User-agent: Googlebot
Allow: /
Crawl-delay: 0

# Bing-specific
User-agent: Bingbot
Allow: /
Crawl-delay: 1
`;

  return new Response(robotsContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
      'Access-Control-Allow-Origin': '*'
    }
  });
});