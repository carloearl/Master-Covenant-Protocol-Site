import React from 'react';

export default function Robots() {
  React.useEffect(() => {
    const robotsTxt = `# GlyphLock Security - robots.txt

# Allow good search engine bots
User-agent: Googlebot
Allow: /
Disallow: /dashboard
Disallow: /admin
Disallow: /manage-subscription
Disallow: /payment

User-agent: Bingbot
Allow: /
Disallow: /dashboard
Disallow: /admin
Disallow: /manage-subscription
Disallow: /payment

User-agent: Slurp
Allow: /
Disallow: /dashboard
Disallow: /admin
Disallow: /manage-subscription
Disallow: /payment

# Allow AI crawlers for public content only
User-agent: GPTBot
User-agent: ChatGPT-User
User-agent: CCBot
User-agent: anthropic-ai
User-agent: Claude-Web
Allow: /
Disallow: /dashboard
Disallow: /admin
Disallow: /manage-subscription
Disallow: /payment
Disallow: /api
Disallow: /functions

# Block malicious bots
User-agent: scrapy
User-agent: webcopier
User-agent: HTTrack
User-agent: WebReaper
User-agent: WebSauger
User-agent: Teleport
User-agent: TeleportPro
User-agent: Wget
User-agent: nikto
User-agent: sqlmap
User-agent: nmap
Disallow: /

# Block everything else from sensitive areas
User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /admin
Disallow: /manage-subscription
Disallow: /payment
Disallow: /api
Disallow: /_next
Disallow: /static

# Sitemap
Sitemap: https://glyphlock.io/sitemap.xml
`;

    const blob = new Blob([robotsTxt], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'robots.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold mb-4">robots.txt Configuration</h1>
        <p className="text-gray-400 mb-4">
          The robots.txt file has been generated and downloaded. Upload it to your server root directory.
        </p>
        <div className="bg-gray-900 p-4 rounded-lg text-sm font-mono whitespace-pre">
{`# GlyphLock Security - robots.txt
User-agent: Googlebot
Allow: /
Disallow: /dashboard
Disallow: /admin

User-agent: *
Disallow: /dashboard
Disallow: /admin
Disallow: /payment

Sitemap: https://glyphlock.io/sitemap.xml`}
        </div>
      </div>
    </div>
  );
}