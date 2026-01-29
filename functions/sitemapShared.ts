import routes from '../sitemap_routes.json' assert { type: 'json' };

export const SITE_URL = 'https://glyphlock.io';
export const ROUTES: string[] = (routes as string[]).map((route) =>
  route.startsWith('/') ? route : `/${route}`
);

export const DEFAULT_LASTMOD = new Date().toISOString().split('T')[0] + 'T00:00:00+00:00';

export function buildSitemapXml(paths: string[] = ROUTES) {
  const urls = paths
    .map(
      (path) => `  <url>
    <loc>${SITE_URL}${path}</loc>
    <lastmod>${DEFAULT_LASTMOD}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

export function buildSitemapIndex(entries: string[] = ['/sitemap.xml']) {
  const items = entries
    .map(
      (path) => `  <sitemap>
    <loc>${SITE_URL}${path}</loc>
    <lastmod>${DEFAULT_LASTMOD}</lastmod>
  </sitemap>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</sitemapindex>`;
}
