import React from 'react';

const ROBOTS_CONTENT = `# GlyphLock Security LLC - robots.txt
# https://glyphlock.io

User-agent: *
Allow: /

# Public QR Generator
Allow: /qr-generator
Allow: /qr-generator/*

# Block admin/private areas
Disallow: /dashboard
Disallow: /command-center
Disallow: /nups-staff
Disallow: /nups-owner
Disallow: /api/

# Sitemaps
Sitemap: https://glyphlock.io/sitemap.xml
Sitemap: https://glyphlock.io/sitemap-qr.xml
Sitemap: https://glyphlock.io/sitemap-app.xml
Sitemap: https://glyphlock.io/sitemap-images.xml
Sitemap: https://glyphlock.io/sitemap-interactive.xml
Sitemap: https://glyphlock.io/sitemap-dynamic.xml

# Crawl-delay for politeness
Crawl-delay: 1`;

export default function Robots() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        <h1 className="text-2xl font-bold mb-4 text-cyan-400">robots.txt</h1>
        <p className="text-gray-400 mb-6 text-sm">
          This file instructs search engine crawlers on how to index GlyphLock. 
          For the actual robots.txt, access it via the backend function endpoint.
        </p>
        <pre className="bg-gray-900 p-6 rounded-lg text-sm text-gray-300 overflow-x-auto whitespace-pre-wrap border border-cyan-500/20">
{ROBOTS_CONTENT}
        </pre>
        <div className="mt-6 flex gap-4">
          <a 
            href="/api/robotsTxt" 
            target="_blank"
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm transition-colors"
          >
            View Raw robots.txt
          </a>
        </div>
      </div>
    </div>
  );
}