/**
 * App Sitemap - Core application routes for GlyphLock.io
 * Serves at: https://glyphlock.io/sitemap-app.xml
 */

const SITE_URL = 'https://glyphlock.io';

const ROUTES = [
  // Homepage
  { path: '/', priority: 1.0, changefreq: 'daily' },
  
  // Core Tools (Public)
  { path: '/qr-generator', priority: 0.95, changefreq: 'daily' },
  { path: '/image-lab', priority: 0.9, changefreq: 'daily' },
  { path: '/interactive-image-studio', priority: 0.85, changefreq: 'weekly' },
  { path: '/steganography', priority: 0.85, changefreq: 'weekly' },
  { path: '/blockchain', priority: 0.8, changefreq: 'weekly' },
  { path: '/glyphbot', priority: 0.9, changefreq: 'daily' },
  { path: '/glyphbot-junior', priority: 0.75, changefreq: 'weekly' },
  
  // Business Pages
  { path: '/pricing', priority: 0.9, changefreq: 'weekly' },
  { path: '/consultation', priority: 0.85, changefreq: 'weekly' },
  { path: '/services', priority: 0.8, changefreq: 'monthly' },
  { path: '/solutions', priority: 0.8, changefreq: 'monthly' },
  
  // Company Info
  { path: '/about', priority: 0.7, changefreq: 'monthly' },
  { path: '/contact', priority: 0.7, changefreq: 'monthly' },
  { path: '/partners', priority: 0.6, changefreq: 'monthly' },
  { path: '/roadmap', priority: 0.65, changefreq: 'monthly' },
  { path: '/dream-team', priority: 0.7, changefreq: 'monthly' },
  
  // Resources
  { path: '/faq', priority: 0.8, changefreq: 'weekly' },
  { path: '/security-docs', priority: 0.8, changefreq: 'weekly' },
  { path: '/master-covenant', priority: 0.75, changefreq: 'monthly' },
  
  // Legal
  { path: '/terms', priority: 0.4, changefreq: 'monthly' },
  { path: '/privacy', priority: 0.4, changefreq: 'monthly' },
  { path: '/cookies', priority: 0.3, changefreq: 'monthly' },
  { path: '/accessibility', priority: 0.3, changefreq: 'monthly' },
  
  // Security Tools
  { path: '/security-tools', priority: 0.8, changefreq: 'weekly' },
  { path: '/visual-cryptography', priority: 0.75, changefreq: 'weekly' }
];

Deno.serve(async (req) => {
  const lastmod = new Date().toISOString();
  
  const urls = ROUTES.map(route => `  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n');
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <!-- GlyphLock.io App Sitemap -->
  <!-- Generated: ${lastmod} -->
${urls}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*'
    }
  });
});