import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const SITE_URL = 'https://glyphlock.io';

const STATIC_ROUTES = [
  // Core Pages
  { path: '/', priority: 1.0, changefreq: 'daily' },
  { path: '/about', priority: 0.8, changefreq: 'monthly' },
  { path: '/about-carlo', priority: 0.7, changefreq: 'monthly' },
  { path: '/contact', priority: 0.7, changefreq: 'monthly' },
  { path: '/services', priority: 0.9, changefreq: 'weekly' },
  { path: '/solutions', priority: 0.9, changefreq: 'weekly' },
  { path: '/consultation', priority: 0.9, changefreq: 'weekly' },
  
  // Case Studies
  { path: '/case-studies', priority: 0.95, changefreq: 'weekly' },
  { path: '/case-study-truthstrike', priority: 0.9, changefreq: 'monthly' },
  { path: '/case-study-ai-binding', priority: 0.9, changefreq: 'monthly' },
  { path: '/case-study-covenant-victory', priority: 0.9, changefreq: 'monthly' },
  
  // Master Covenant
  { path: '/master-covenant', priority: 0.95, changefreq: 'monthly' },
  { path: '/governance-hub', priority: 0.8, changefreq: 'monthly' },
  { path: '/nist-challenge', priority: 0.85, changefreq: 'monthly' },
  
  // Tools
  { path: '/qr', priority: 0.9, changefreq: 'daily' },
  { path: '/image-lab', priority: 0.9, changefreq: 'daily' },
  { path: '/interactive-image-studio', priority: 0.8, changefreq: 'weekly' },
  { path: '/blockchain', priority: 0.8, changefreq: 'weekly' },
  { path: '/security-tools', priority: 0.85, changefreq: 'weekly' },
  { path: '/hotzone-mapper', priority: 0.7, changefreq: 'weekly' },
  
  // AI
  { path: '/glyphbot', priority: 0.95, changefreq: 'daily' },
  { path: '/glyphbot-junior', priority: 0.8, changefreq: 'weekly' },
  
  // Docs
  { path: '/security-docs', priority: 0.85, changefreq: 'weekly' },
  { path: '/sdk-docs', priority: 0.8, changefreq: 'weekly' },
  { path: '/faq', priority: 0.8, changefreq: 'weekly' },
  { path: '/roadmap', priority: 0.7, changefreq: 'monthly' },
  
  // Team
  { path: '/dream-team', priority: 0.75, changefreq: 'monthly' },
  { path: '/partners', priority: 0.7, changefreq: 'monthly' },
  
  // Trust
  { path: '/trust-security', priority: 0.8, changefreq: 'monthly' },
  
  // Legal
  { path: '/terms', priority: 0.5, changefreq: 'monthly' },
  { path: '/privacy', priority: 0.5, changefreq: 'monthly' },
  { path: '/cookies', priority: 0.4, changefreq: 'monthly' },
  { path: '/accessibility', priority: 0.4, changefreq: 'monthly' },
  
  // Discovery
  { path: '/sitemap', priority: 0.5, changefreq: 'weekly' }
];

function generateUrlEntry(route, lastmod) {
  return `  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
}

function generateSitemapXML(routes) {
  const lastmod = new Date().toISOString().split('T')[0];
  const urls = routes.map(route => generateUrlEntry(route, lastmod)).join('\n');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

Deno.serve(async (req) => {
  try {
    const xml = generateSitemapXML(STATIC_ROUTES);
    
    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
        'X-Robots-Tag': 'noindex'
      }
    });
  } catch (error) {
    console.error('Sitemap XML generation error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});