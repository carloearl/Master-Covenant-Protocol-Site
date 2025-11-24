/**
 * Sitemap Generation Endpoint
 * Returns XML sitemap for search engine indexing
 */

Deno.serve(async (req) => {
  try {
    const baseUrl = 'https://glyphlock.io';
    
    const pages = [
      { path: '', priority: '1.0', changefreq: 'daily' },
      { path: '/about', priority: '0.8', changefreq: 'monthly' },
      { path: '/pricing', priority: '0.9', changefreq: 'weekly' },
      { path: '/qr-generator', priority: '0.9', changefreq: 'weekly' },
      { path: '/image-lab', priority: '0.9', changefreq: 'weekly' },
      { path: '/faq', priority: '0.85', changefreq: 'weekly' },
      { path: '/blockchain', priority: '0.8', changefreq: 'monthly' },
      { path: '/steganography', priority: '0.8', changefreq: 'monthly' },
      { path: '/security-tools', priority: '0.8', changefreq: 'monthly' },
      { path: '/glyphbot', priority: '0.8', changefreq: 'weekly' },
      { path: '/content-generator', priority: '0.7', changefreq: 'monthly' },
      { path: '/master-covenant', priority: '0.8', changefreq: 'monthly' },
      { path: '/consultation', priority: '0.7', changefreq: 'monthly' },
      { path: '/contact', priority: '0.6', changefreq: 'monthly' },
      { path: '/security-docs', priority: '0.7', changefreq: 'monthly' },
      { path: '/roadmap', priority: '0.6', changefreq: 'monthly' },
      { path: '/faq', priority: '0.6', changefreq: 'monthly' },
      { path: '/dream-team', priority: '0.5', changefreq: 'monthly' },
      { path: '/partners', priority: '0.5', changefreq: 'monthly' },
      { path: '/terms', priority: '0.4', changefreq: 'yearly' },
      { path: '/privacy', priority: '0.4', changefreq: 'yearly' },
    ];

    const lastmod = new Date().toISOString();

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${baseUrl}${page.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return new Response(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
});