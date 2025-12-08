'use client';

import { useEffect } from 'react';

export default function ThemeProvider({ children }) {
  useEffect(() => {
    // Force dark theme on mount (client-side only)
    if (typeof window !== 'undefined') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.backgroundColor = '#000000';
      document.body.style.backgroundColor = '#000000';
      
      // Apply CSS variables
      const root = document.documentElement;
      root.style.setProperty('--background', '0 0% 0%');
      root.style.setProperty('--foreground', '0 0% 100%');
      
      // Prevent theme flicker
      const style = document.createElement('style');
      style.id = 'theme-provider-style';
      style.textContent = `
        html, body { 
          background: #000000 !important; 
          color: #ffffff !important;
        }
      `;
      
      const existing = document.getElementById('theme-provider-style');
      if (existing) {
        existing.remove();
      }
      document.head.appendChild(style);
      
      return () => {
        const el = document.getElementById('theme-provider-style');
        if (el) el.remove();
      };
    }
  }, []);

  return <>{children}</>;
}