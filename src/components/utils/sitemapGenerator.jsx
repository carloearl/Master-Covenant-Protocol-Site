/**
 * GlyphLock Sitemap Generator Utility
 * Used for generating and validating sitemap XML
 */

export const SITE_URL = 'https://glyphlock.io';

export const STATIC_ROUTES = [
  { path: '/', priority: 1.0, changefreq: 'daily' },
  { path: '/qr-generator', priority: 0.9, changefreq: 'daily' },
  { path: '/image-lab', priority: 0.9, changefreq: 'daily' },
  { path: '/interactive-image-studio', priority: 0.8, changefreq: 'weekly' },
  { path: '/steganography', priority: 0.8, changefreq: 'weekly' },
  { path: '/blockchain', priority: 0.8, changefreq: 'weekly' },
  { path: '/glyphbot', priority: 0.9, changefreq: 'daily' },
  { path: '/pricing', priority: 0.9, changefreq: 'weekly' },
  { path: '/faq', priority: 0.8, changefreq: 'weekly' },
  { path: '/about', priority: 0.7, changefreq: 'monthly' },
  { path: '/contact', priority: 0.7, changefreq: 'monthly' },
  { path: '/master-covenant', priority: 0.8, changefreq: 'monthly' },
  { path: '/dashboard', priority: 0.7, changefreq: 'daily' },
  { path: '/security-docs', priority: 0.8, changefreq: 'weekly' },
  { path: '/roadmap', priority: 0.7, changefreq: 'monthly' },
  { path: '/dream-team', priority: 0.6, changefreq: 'monthly' },
  { path: '/partners', priority: 0.6, changefreq: 'monthly' },
  { path: '/consultation', priority: 0.8, changefreq: 'weekly' },
  { path: '/sitemap', priority: 0.5, changefreq: 'weekly' },
  { path: '/terms', priority: 0.4, changefreq: 'monthly' },
  { path: '/privacy', priority: 0.4, changefreq: 'monthly' }
];

/**
 * Validates XML structure
 */
export function validateXML(xml) {
  const errors = [];
  
  // Check for XML declaration
  if (!xml.startsWith('<?xml')) {
    errors.push('Missing XML declaration');
  }
  
  // Check for required namespace
  if (!xml.includes('xmlns=')) {
    errors.push('Missing XML namespace');
  }
  
  // Check for unclosed tags
  const openTags = (xml.match(/<([a-z][a-z0-9]*)[^>]*>/gi) || []).length;
  const closeTags = (xml.match(/<\/([a-z][a-z0-9]*)>/gi) || []).length;
  
  if (openTags !== closeTags) {
    errors.push('Mismatched opening and closing tags');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

export default {
  SITE_URL,
  STATIC_ROUTES,
  validateXML
};