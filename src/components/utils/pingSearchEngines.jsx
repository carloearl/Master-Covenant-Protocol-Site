/**
 * Ping Search Engines Utility
 * Notifies major search engines when sitemap is updated
 */

export async function pingSearchEngines() {
  const sitemap = "https://glyphlock.io/sitemap.xml";

  const engines = [
    `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemap)}`,
    `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemap)}`,
    `https://search.brave.com/ping?sitemap=${encodeURIComponent(sitemap)}`
  ];

  const results = [];

  for (const url of engines) {
    try {
      await fetch(url, { mode: 'no-cors' });
      results.push({ url, status: 'success' });
    } catch (error) {
      results.push({ url, status: 'failed', error: error.message });
    }
  }

  return {
    success: true,
    message: "Search engines notified.",
    results
  };
}

export default pingSearchEngines;