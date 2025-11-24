const SITE_URL = 'https://glyphlock.io';

const ROUTES = [
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

Deno.serve(async (req) => {
  const lastmod = new Date().toISOString().split('T')[0] + 'T00:00:00+00:00';
  const urls = ROUTES.map(route => `  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n');
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400'
    }
  });
});