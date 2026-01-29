import { buildSitemapXml } from './sitemapShared.ts';

Deno.serve(async (req) => {
    try {
        // The request body is ignored intentionally; all callers receive the unified sitemap.
        const xml = buildSitemapXml();
        return Response.json({ xml });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});