import { useEffect } from 'react';

/**
 * Unified Mobile Optimization Core
 * Consolidates MobileScalingSystem, MobileTouchOptimizer, and MobileOptimizer
 * into a single, efficient utility component
 */
export default function MobileCore() {
  useEffect(() => {
    // Only run on mobile devices
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) return;

    // Prevent multiple initializations
    if (window.glyphMobileCoreInitialized) return;
    window.glyphMobileCoreInitialized = true;

    // 1. Fix viewport height for iOS address bar
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);

    // 2. Configure viewport meta tag
    let viewport = document.querySelector('meta[name=viewport]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.name = 'viewport';
      document.head.appendChild(viewport);
    }
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes');

    // 3. Enable smooth scrolling
    document.body.style.overflowY = 'scroll';
    document.body.style.webkitOverflowScrolling = 'touch';
    document.body.style.touchAction = 'pan-y pan-x';
    
    // 4. Force 300ms tap delay removal
    document.addEventListener('touchstart', function(){}, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);

  return null;
}