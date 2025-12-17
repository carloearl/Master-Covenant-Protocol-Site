/**
 * PrerenderHints - Meta tags for prerender services (Prerender.io, Rendertron, etc.)
 * Signals to prerender services how to handle the page
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function PrerenderHints() {
  const location = useLocation();

  useEffect(() => {
    // Add prerender meta tags
    const addMeta = (name, content) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Prerender.io status code
    addMeta('prerender-status-code', '200');
    
    // AJAX fragment for Google's deprecated but still sometimes used _escaped_fragment_
    addMeta('fragment', '!');
    
    // Tell crawlers this is a SPA with dynamic content
    addMeta('robots', 'index, follow, max-snippet:-1, max-image-preview:large');
    
    // Signal page is ready after React hydration
    const signalReady = () => {
      window.prerenderReady = true;
      // Also dispatch custom event
      window.dispatchEvent(new CustomEvent('prerenderReady'));
    };

    // Signal ready after a short delay to ensure React has rendered
    const timer = setTimeout(signalReady, 1500);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return null;
}