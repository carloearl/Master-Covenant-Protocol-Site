/**
 * QR Sitemap XML Generator
 * Serves sitemap-qr.xml for QR Generator pages
 * REAL SUBROUTES - No hash fragments (Converted to query params for static indexing where applicable or main app routes)
 * Accessible at: https://glyphlock.io/sitemap-qr.xml
 */

const SITE_URL = 'https://glyphlock.io';

// Real subroutes - pointing to canonical Qr app
const ROUTES = [
  { path: '/Qr', priority: 1.0, changefreq: 'daily', title: 'QR Studio - Main' },
  { path: '/Qr?tab=create', priority: 0.95, changefreq: 'daily', title: 'QR Studio - Create' },
  { path: '/Qr?tab=preview', priority: 0.85, changefreq: 'daily', title: 'QR Studio - Preview' },
  { path: '/Qr?tab=customize', priority: 0.85, changefreq: 'daily', title: 'QR Studio - Customize' },
  { path: '/Qr?tab=hotzones', priority: 0.8, changefreq: 'weekly', title: 'QR Studio - Hot Zones' },
  { path: '/Qr?tab=stego', priority: 0.8, changefreq: 'weekly', title: 'QR Studio - Steganography' },
  { path: '/Qr?tab=security', priority: 0.9, changefreq: 'daily', title: 'QR Studio - Security' },
  { path: '/Qr?tab=analytics', priority: 0.75, changefreq: 'daily', title: 'QR Studio - Analytics' },
  { path: '/Qr?tab=bulk', priority: 0.75, changefreq: 'weekly', title: 'QR Studio - Bulk Upload' },
  { path: '/sitemap-qr', priority: 0.5, changefreq: 'weekly', title: 'QR Sitemap HTML' }
];

Deno.serve(async (req) => {
  const lastmod = new Date().toISOString();
  
  const urls = ROUTES.map(route => `  <url>
    <loc>${SITE_URL}${route.path.replace(/&/g, '&amp;')}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n');
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <!-- GlyphLock QR Generator Sitemap -->
  <!-- Canonical Public Routes -->
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