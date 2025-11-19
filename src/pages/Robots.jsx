import React, { useEffect } from 'react';

export default function Robots() {
  useEffect(() => {
    // Set proper content type for robots.txt
    const robotsContent = `# GlyphLock Security LLC - robots.txt
# https://glyphlock.io
# El Mirage, Arizona | Founded January 2025

# Allow all search engines and AI crawlers to index public content
User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /admin
Disallow: /manage-subscription
Disallow: /manage
Disallow: /payment
Disallow: /api/
Disallow: /_next/
Disallow: /static/

# Explicitly allow major search engines
User-agent: Googlebot
User-agent: Googlebot-Image
User-agent: Googlebot-News
User-agent: Googlebot-Video
Allow: /
Disallow: /dashboard
Disallow: /admin
Disallow: /manage-subscription
Disallow: /payment
Disallow: /api/

User-agent: Bingbot
Allow: /
Disallow: /dashboard
Disallow: /admin
Disallow: /manage-subscription
Disallow: /payment
Disallow: /api/

# Allow AI crawlers to learn about our security platform
User-agent: GPTBot
User-agent: ChatGPT-User
User-agent: CCBot
User-agent: anthropic-ai
User-agent: Claude-Web
User-agent: Google-Extended
User-agent: PerplexityBot
User-agent: Applebot
Allow: /
Allow: /about
Allow: /pricing
Allow: /consultation
Allow: /glyphbot
Allow: /securitytools
Allow: /qrgenerator
Allow: /steganography
Allow: /blockchain
Allow: /hotzonemapper
Allow: /hsss
Allow: /dreamteam
Allow: /roadmap
Allow: /partners
Disallow: /dashboard
Disallow: /admin
Disallow: /manage-subscription
Disallow: /payment
Disallow: /api/
Disallow: /functions/

# Block malicious bots and scrapers
User-agent: scrapy
User-agent: webcopier
User-agent: HTTrack
User-agent: WebReaper
User-agent: WebSauger
User-agent: Teleport
User-agent: TeleportPro
User-agent: Wget
User-agent: curl
User-agent: nikto
User-agent: sqlmap
User-agent: nmap
User-agent: MJ12bot
User-agent: SemrushBot
User-agent: AhrefsBot
User-agent: DotBot
Disallow: /

# Crawl rate
Crawl-delay: 1

# Sitemap
Sitemap: https://glyphlock.io/sitemap.xml
Sitemap: https://www.glyphlock.io/sitemap.xml

# Contact
# Email: glyphlock@gmail.com
# Phone: +1-424-246-6499
# Location: El Mirage, Arizona, USA
`;

    // Create a downloadable version
    const blob = new Blob([robotsContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Also display it as text for manual copying
    const pre = document.getElementById('robots-content');
    if (pre) {
      pre.textContent = robotsContent;
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-6 text-center">
          <span className="bg-gradient-to-r from-blue-400 to-violet-600 bg-clip-text text-transparent">
            robots.txt for GlyphLock Security
          </span>
        </h1>
        
        <div className="glass-card-dark border-blue-500/30 p-8 rounded-xl space-y-6">
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <p className="text-green-400 font-semibold">✓ Configured for maximum SEO and AI crawler visibility</p>
            <p className="text-sm text-white/70 mt-2">
              This robots.txt allows all major search engines and AI assistants (GPT, Claude, Perplexity, etc.) 
              to crawl and index your public pages while protecting sensitive areas.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-blue-400 mb-3">robots.txt Content:</h2>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre id="robots-content" className="text-xs text-green-400 font-mono whitespace-pre">
                Loading...
              </pre>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-400 mb-3">Implementation Instructions:</h3>
            <ol className="space-y-2 text-sm text-white/70 list-decimal list-inside">
              <li>Copy the content above</li>
              <li>Create a file named <code className="bg-blue-500/20 px-2 py-0.5 rounded text-blue-300">robots.txt</code></li>
              <li>Upload to your website root directory (same level as index.html)</li>
              <li>Verify at: <a href="https://glyphlock.io/robots.txt" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">https://glyphlock.io/robots.txt</a></li>
              <li>Submit to <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Google Search Console</a></li>
            </ol>
          </div>

          <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-violet-400 mb-2">What's Allowed:</h3>
            <ul className="text-sm text-white/70 space-y-1 list-disc list-inside">
              <li>All public pages (home, about, pricing, services)</li>
              <li>Google, Bing, and other major search engines</li>
              <li>AI crawlers (GPT, Claude, Perplexity, etc.)</li>
              <li>Social media bots for link previews</li>
            </ul>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-red-400 mb-2">What's Blocked:</h3>
            <ul className="text-sm text-white/70 space-y-1 list-disc list-inside">
              <li>Dashboard and admin areas</li>
              <li>Payment and subscription management pages</li>
              <li>API endpoints and backend functions</li>
              <li>Malicious scrapers and unauthorized bots</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-white/60">
          <p>This robots.txt is optimized for GlyphLock Security LLC</p>
          <p>El Mirage, Arizona | glyphlock@gmail.com | +1-424-246-6499</p>
        </div>
      </div>
    </div>
  );
}