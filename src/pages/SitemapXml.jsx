import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';

export default function SitemapXml() {
  const [xml, setXml] = useState('Loading...');

  useEffect(() => {
    (async () => {
      try {
        const response = await base44.functions.invoke('sitemapIndex');
        setXml(response.data);
      } catch (error) {
        setXml('Error loading sitemap');
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-4 text-cyan-400">Sitemap Index</h1>
      <pre className="bg-gray-900 p-6 rounded-lg text-sm text-gray-300 overflow-x-auto">
        {xml}
      </pre>
      <div className="mt-8 space-y-2">
        <h2 className="text-xl font-semibold text-purple-400 mb-4">Available Sitemaps:</h2>
        <a href="/sitemap-app" className="block text-cyan-400 hover:text-cyan-300">→ App Sitemap</a>
        <a href="/sitemap-qr" className="block text-cyan-400 hover:text-cyan-300">→ QR Sitemap</a>
        <a href="/sitemap-images" className="block text-cyan-400 hover:text-cyan-300">→ Images Sitemap</a>
        <a href="/sitemap-interactive" className="block text-cyan-400 hover:text-cyan-300">→ Interactive Sitemap</a>
        <a href="/sitemap-dynamic" className="block text-cyan-400 hover:text-cyan-300">→ Dynamic Sitemap</a>
      </div>
    </div>
  );
}