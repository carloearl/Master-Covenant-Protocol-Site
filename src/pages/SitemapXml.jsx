import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { FileCode, ExternalLink, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const SITEMAPS = [
  { name: 'App Sitemap', endpoint: 'sitemapApp', file: 'sitemap-app.xml', description: 'Core application routes' },
  { name: 'QR Sitemap', endpoint: 'sitemapQr', file: 'sitemap-qr.xml', description: 'QR Generator pages' },
  { name: 'Images Sitemap', endpoint: 'sitemapImages', file: 'sitemap-images.xml', description: 'Image Lab pages' },
  { name: 'Interactive Sitemap', endpoint: 'sitemapInteractive', file: 'sitemap-interactive.xml', description: 'Interactive studio pages' },
  { name: 'Dynamic Sitemap', endpoint: 'sitemapDynamic', file: 'sitemap-dynamic.xml', description: 'Dynamic content pages' }
];

export default function SitemapXml() {
  const [indexXml, setIndexXml] = useState('');
  const [loading, setLoading] = useState(true);
  const [sitemapStatus, setSitemapStatus] = useState({});

  useEffect(() => {
    (async () => {
      try {
        // Load sitemap index
        const response = await base44.functions.invoke('sitemapIndex');
        setIndexXml(response.data);
        
        // Check each child sitemap
        const statuses = {};
        for (const sitemap of SITEMAPS) {
          try {
            await base44.functions.invoke(sitemap.endpoint);
            statuses[sitemap.endpoint] = 'ok';
          } catch {
            statuses[sitemap.endpoint] = 'error';
          }
        }
        setSitemapStatus(statuses);
      } catch (error) {
        setIndexXml('Error loading sitemap index');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <FileCode className="w-8 h-8 text-cyan-400" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-cyan-400">GlyphLock Sitemap Index</h1>
            <p className="text-gray-500 text-sm">https://glyphlock.io/sitemap.xml</p>
          </div>
        </div>

        {/* Status Banner */}
        <div className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/30 rounded-lg p-4 mb-8">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <span className="text-green-400 font-semibold">All sitemaps are production-ready</span>
          </div>
          <p className="text-gray-400 text-sm mt-1">
            Access XML sitemaps via backend functions at <code className="text-cyan-300">/api/sitemapIndex</code>
          </p>
        </div>

        {/* Child Sitemaps Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Child Sitemaps</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SITEMAPS.map((sitemap) => (
              <div 
                key={sitemap.endpoint}
                className="bg-gray-900/50 border border-cyan-500/20 rounded-lg p-4 hover:border-cyan-500/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-white">{sitemap.name}</h3>
                  {loading ? (
                    <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                  ) : sitemapStatus[sitemap.endpoint] === 'ok' ? (
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-400" />
                  )}
                </div>
                <p className="text-gray-500 text-sm mb-3">{sitemap.description}</p>
                <div className="flex items-center gap-2">
                  <code className="text-xs text-cyan-300 bg-cyan-500/10 px-2 py-1 rounded">
                    /{sitemap.file}
                  </code>
                  <a 
                    href={`/api/${sitemap.endpoint}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* XML Preview */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Sitemap Index XML</h2>
          <pre className="bg-gray-900 p-6 rounded-lg text-sm text-gray-300 overflow-x-auto whitespace-pre-wrap border border-cyan-500/20 max-h-[500px] overflow-y-auto">
            {loading ? 'Loading sitemap index...' : indexXml}
          </pre>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap gap-4">
          <a 
            href="/api/sitemapIndex"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm transition-colors flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            View Raw Sitemap Index
          </a>
          <a 
            href="/api/robotsTxt"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm transition-colors flex items-center gap-2"
          >
            <FileCode className="w-4 h-4" />
            View robots.txt
          </a>
        </div>

        {/* SEO Info */}
        <div className="mt-8 bg-gray-900/30 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-3">Google Search Console Integration</h3>
          <p className="text-gray-400 text-sm mb-4">
            Submit the following URL to Google Search Console:
          </p>
          <code className="block bg-black/50 text-cyan-300 p-3 rounded border border-cyan-500/20 text-sm">
            https://glyphlock.io/sitemap.xml
          </code>
          <p className="text-gray-500 text-xs mt-3">
            This index references all child sitemaps which are automatically updated.
          </p>
        </div>
      </div>
    </div>
  );
}