import React, { useEffect } from 'react';

export default function Robots() {
  useEffect(() => {
    // Serve robots.txt content as plain text
    const robotsContent = `User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /command-center
Disallow: /nups-staff
Disallow: /nups-owner

Sitemap: https://glyphlock.io/sitemap.xml
`;
    
    // Create blob and trigger download
    const blob = new Blob([robotsContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'robots.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">robots.txt</h1>
        <pre className="text-left bg-gray-900 p-6 rounded-lg text-sm text-gray-300">
{`User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /command-center
Disallow: /nups-staff
Disallow: /nups-owner

Sitemap: https://glyphlock.io/sitemap.xml`}
        </pre>
      </div>
    </div>
  );
}