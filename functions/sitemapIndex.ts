/**
 * Sitemap Index - Primary sitemap index for GlyphLock.io
 * Serves at: https://glyphlock.io/sitemap.xml
 * References all child sitemaps with proper .xml extensions
 */

import { buildSitemapIndex } from './sitemapShared.ts';

Deno.serve(() => {
  const xml = buildSitemapIndex();

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'X-Robots-Tag': 'noarchive',
      'Access-Control-Allow-Origin': '*'
    }
  });
});