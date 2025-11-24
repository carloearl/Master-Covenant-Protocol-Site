import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

const SITE_URL = 'https://glyphlock.io';

const STATIC_ROUTES = [
  { path: '/', priority: 1.0, changefreq: 'daily' },
  { path: '/qr-generator', priority: 0.9, changefreq: 'daily' },
  { path: '/image-lab', priority: 0.9, changefreq: 'daily' },
  { path: '/interactive-image-studio', priority: 0.8, changefreq: 'weekly' },
  { path: '/steganography', priority: 0.8, changefreq: 'weekly' },
  { path: '/blockchain', priority: 0.8, changefreq: 'weekly' },
  { path: '/glyphbot', priority: 0.9, changefreq: 'daily' },
  { path: '/pricing', priority: 0.9, changefreq: 'weekly' },
  { path: '/faq', priority: 0.8, changefreq: 'weekly' },
  { path: '/about', priority: 0.7, changefreq: 'monthly' },
  { path: '/contact', priority: 0.7, changefreq: 'monthly' },
  { path: '/master-covenant', priority: 0.8, changefreq: 'monthly' },
  { path: '/dashboard', priority: 0.7, changefreq: 'daily' },
  { path: '/security-docs', priority: 0.8, changefreq: 'weekly' },
  { path: '/roadmap', priority: 0.7, changefreq: 'monthly' },
  { path: '/dream-team', priority: 0.6, changefreq: 'monthly' },
  { path: '/partners', priority: 0.6, changefreq: 'monthly' },
  { path: '/consultation', priority: 0.8, changefreq: 'weekly' },
  { path: '/sitemap', priority: 0.5, changefreq: 'weekly' },
  { path: '/terms', priority: 0.4, changefreq: 'monthly' },
  { path: '/privacy', priority: 0.4, changefreq: 'monthly' }
];

const QR_ROUTES = [
  { path: '/qr-generator', priority: 1.0, changefreq: 'daily' },
  { path: '/qr-generator#create', priority: 0.9, changefreq: 'daily' },
  { path: '/qr-generator#preview', priority: 0.8, changefreq: 'daily' },
  { path: '/qr-generator#customize', priority: 0.8, changefreq: 'daily' },
  { path: '/qr-generator#hotzones', priority: 0.8, changefreq: 'weekly' },
  { path: '/qr-generator#stego', priority: 0.8, changefreq: 'weekly' },
  { path: '/qr-generator#security', priority: 0.9, changefreq: 'daily' },
  { path: '/qr-generator#analytics', priority: 0.7, changefreq: 'daily' },
  { path: '/qr-generator#bulk', priority: 0.7, changefreq: 'weekly' }
];

const IMAGE_ROUTES = [
  { path: '/image-lab', priority: 1.0, changefreq: 'daily' },
  { path: '/image-lab#generate', priority: 0.9, changefreq: 'daily' },
  { path: '/image-lab#interactive', priority: 0.9, changefreq: 'daily' },
  { path: '/image-lab#gallery', priority: 0.8, changefreq: 'daily' },
  { path: '/image-generator', priority: 0.8, changefreq: 'weekly' }
];

const INTERACTIVE_ROUTES = [
  { path: '/interactive-image-studio', priority: 1.0, changefreq: 'daily' },
  { path: '/interactive-image-studio#upload', priority: 0.8, changefreq: 'weekly' },
  { path: '/interactive-image-studio#editor', priority: 0.9, changefreq: 'daily' },
  { path: '/interactive-image-studio#verify', priority: 0.7, changefreq: 'weekly' }
];

const DYNAMIC_ROUTES = [
  { path: '/glyphbot', priority: 0.9, changefreq: 'daily' },
  { path: '/dashboard', priority: 0.7, changefreq: 'daily' },
  { path: '/command-center', priority: 0.6, changefreq: 'daily' },
  { path: '/security-operations-center', priority: 0.8, changefreq: 'weekly' },
  { path: '/governance-hub', priority: 0.6, changefreq: 'monthly' }
];

function generateUrlEntry(route, lastmod) {
  return `  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
}

function generateSitemapXML(routes, includeImageSchema = false) {
  const lastmod = new Date().toISOString().split('T')[0] + 'T00:00:00+00:00';
  const xmlns = includeImageSchema 
    ? 'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"'
    : 'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';
    
  const urls = routes.map(route => generateUrlEntry(route, lastmod)).join('\n');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset ${xmlns}>
${urls}
</urlset>`;
}

function generateSitemapIndex() {
  const lastmod = new Date().toISOString().split('T')[0] + 'T00:00:00+00:00';
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_URL}/sitemap-app.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-qr.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-images.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-interactive.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-dynamic.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
</sitemapindex>`;
}

Deno.serve(async (req) => {
  try {
    const url = new URL(req.url);
    const path = url.pathname;

    let xml = '';
    
    // Route to specific sitemap
    if (path === '/' || path === '/sitemap.xml') {
      xml = generateSitemapIndex();
    } else if (path === '/sitemap-app.xml') {
      xml = generateSitemapXML(STATIC_ROUTES);
    } else if (path === '/sitemap-qr.xml') {
      xml = generateSitemapXML(QR_ROUTES);
    } else if (path === '/sitemap-images.xml') {
      xml = generateSitemapXML(IMAGE_ROUTES, true);
    } else if (path === '/sitemap-interactive.xml') {
      xml = generateSitemapXML(INTERACTIVE_ROUTES);
    } else if (path === '/sitemap-dynamic.xml') {
      xml = generateSitemapXML(DYNAMIC_ROUTES);
    } else {
      return Response.json({ error: 'Sitemap not found' }, { status: 404 });
    }

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=86400'
      }
    });

  } catch (error) {
    console.error('Sitemap error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});