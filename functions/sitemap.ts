import { buildSitemapIndex, buildSitemapXml } from './sitemapShared.ts';

Deno.serve((req) => {
  const path = new URL(req.url).pathname;

  const xml = path === '/index.xml' ? buildSitemapIndex() : buildSitemapXml();

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400'
    }
  });
});
