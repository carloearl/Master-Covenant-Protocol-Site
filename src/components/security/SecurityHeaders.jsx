import { useEffect } from 'react';

/**
 * GLYPHLOCK SECURITY HEADERS COMPONENT
 * Adds client-side security meta tags
 * Note: Server-side headers handled via backend functions
 */
export default function SecurityHeaders() {
  useEffect(() => {
    // Add security-related meta tags
    const metaTags = [
      { name: 'referrer', content: 'strict-origin-when-cross-origin' },
      { httpEquiv: 'X-Content-Type-Options', content: 'nosniff' },
      { httpEquiv: 'X-Frame-Options', content: 'DENY' },
      { httpEquiv: 'X-XSS-Protection', content: '1; mode=block' }
    ];

    const addedElements = [];

    metaTags.forEach(({ name, httpEquiv, content }) => {
      const existing = document.querySelector(
        name ? `meta[name="${name}"]` : `meta[http-equiv="${httpEquiv}"]`
      );
      
      if (!existing) {
        const meta = document.createElement('meta');
        if (name) meta.setAttribute('name', name);
        if (httpEquiv) meta.setAttribute('http-equiv', httpEquiv);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
        addedElements.push(meta);
      }
    });

    return () => {
      addedElements.forEach(el => {
        if (document.head.contains(el)) {
          document.head.removeChild(el);
        }
      });
    };
  }, []);

  return null;
}