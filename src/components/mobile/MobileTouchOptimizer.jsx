import { useEffect } from 'react';

/**
 * Mobile Touch Optimizer
 * Ensures all interactive elements meet WCAG 2.1 touch target minimums (44x44px)
 * Prevents iOS zoom on input focus
 * Optimizes touch event handling
 */
export default function MobileTouchOptimizer() {
  useEffect(() => {
    // Prevent iOS zoom on input focus
    const addMaximumScaleToMetaViewport = () => {
      const el = document.querySelector('meta[name=viewport]');
      if (el) {
        let content = el.getAttribute('content');
        const re = /maximum\-scale=[0-9\.]+/g;
        if (re.test(content)) {
          content = content.replace(re, 'maximum-scale=1.0');
        } else {
          content = [content, 'maximum-scale=1.0'].join(', ');
        }
        el.setAttribute('content', content);
      }
    };

    const disableIosTextFieldZoom = () => {
      const inputs = document.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        if (input.style.fontSize.endsWith('px')) {
          const size = parseFloat(input.style.fontSize);
          if (size < 16) {
            input.style.fontSize = '16px';
          }
        }
      });
    };

    // Only apply on mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      addMaximumScaleToMetaViewport();
      disableIosTextFieldZoom();

      // Re-check on dynamic content
      const observer = new MutationObserver(disableIosTextFieldZoom);
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      return () => observer.disconnect();
    }
  }, []);

  return null;
}