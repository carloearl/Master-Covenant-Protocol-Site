import { buildSitemapXml } from './sitemapShared.ts';

Deno.serve(() => {
    const xml = buildSitemapXml();
    return new Response(xml, { headers: { "Content-Type": "application/xml" } });
});