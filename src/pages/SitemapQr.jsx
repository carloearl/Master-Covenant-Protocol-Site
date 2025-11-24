import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';

export default function SitemapQr() {
  const [xml, setXml] = useState('Loading...');

  useEffect(() => {
    (async () => {
      try {
        const response = await base44.functions.invoke('sitemapQr');
        setXml(response.data);
      } catch (error) {
        setXml('Error loading sitemap');
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-4 text-cyan-400">QR Sitemap</h1>
      <pre className="bg-gray-900 p-6 rounded-lg text-sm text-gray-300 overflow-x-auto whitespace-pre-wrap">
        {xml}
      </pre>
    </div>
  );
}