import { useEffect } from 'react';

/**
 * Enhanced Mobile Touch Optimizer for Samsung S25+ and All Mobile Devices
 * - Fixes button interaction issues
 * - Ensures card flips work reliably
 * - Prevents accidental scroll navigation
 * - Optimizes all touch event handling
 */
export default function MobileTouchOptimizer() {
  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) return;

    // Viewport setup
    const setViewport = () => {
      let viewport = document.querySelector('meta[name=viewport]');
      if (!viewport) {
        viewport = document.createElement('meta');
        viewport.name = 'viewport';
        document.head.appendChild(viewport);
      }
      viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover';
    };

    // Prevent iOS zoom on input focus
    const preventInputZoom = () => {
      const inputs = document.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        if (!input.style.fontSize || parseFloat(input.style.fontSize) < 16) {
          input.style.fontSize = '16px';
        }
      });
    };

    // Enhanced touch event normalization
    const normalizeTouchEvents = () => {
      const interactiveElements = document.querySelectorAll('button, a, input, textarea, select, [role="button"], [onclick], [class*="cursor-pointer"]');
      
      interactiveElements.forEach(el => {
        // Set proper touch action
        el.style.touchAction = 'manipulation';
        el.style.webkitTapHighlightColor = 'transparent';
        
        // Ensure minimum touch target
        const rect = el.getBoundingClientRect();
        if (rect.width < 44 || rect.height < 44) {
          const currentPadding = window.getComputedStyle(el).padding;
          if (currentPadding === '0px') {
            el.style.minWidth = '44px';
            el.style.minHeight = '44px';
            el.style.display = 'inline-flex';
            el.style.alignItems = 'center';
            el.style.justifyContent = 'center';
          }
        }

        // Remove existing duplicated handlers
        const existingHandler = el._glyphTouchHandler;
        if (existingHandler) {
          el.removeEventListener('touchend', existingHandler);
        }

        // Add reliable touch handler
        const touchHandler = (e) => {
          e.stopPropagation();
          const touch = e.changedTouches[0];
          const target = document.elementFromPoint(touch.clientX, touch.clientY);
          
          if (target === el || el.contains(target)) {
            e.preventDefault();
            el.click();
          }
        };

        el._glyphTouchHandler = touchHandler;
        el.addEventListener('touchend', touchHandler, { passive: false });
      });
    };

    // Fix scroll snap issues
    const fixScrollSnap = () => {
      document.body.style.overscrollBehavior = 'none';
      document.documentElement.style.overscrollBehavior = 'none';
      
      // Disable scroll-snap on mobile to prevent accidental navigation
      const snapContainers = document.querySelectorAll('[style*="scroll-snap"]');
      snapContainers.forEach(container => {
        container.style.scrollSnapType = 'none';
      });
    };

    // Apply all fixes
    setViewport();
    preventInputZoom();
    normalizeTouchEvents();
    fixScrollSnap();

    // Re-apply on DOM changes with debounce
    let timeoutId;
    const observer = new MutationObserver(() => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        preventInputZoom();
        normalizeTouchEvents();
        fixScrollSnap();
      }, 100);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, []);

  return null;
}