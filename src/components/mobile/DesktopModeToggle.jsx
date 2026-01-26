import React, { useState, useEffect } from 'react';
import { Monitor, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DesktopModeToggle() {
  const [desktopMode, setDesktopMode] = useState(false);
  
  useEffect(() => {
    const savedMode = localStorage.getItem('glyphlock_desktop_mode');
    if (savedMode === 'true') {
      setDesktopMode(true);
      applyDesktopMode();
    }
  }, []);
  
  const applyDesktopMode = () => {
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport) {
      viewport.setAttribute('content', 'width=1280, initial-scale=0.4, user-scalable=yes');
    }
    document.documentElement.style.minWidth = '1280px';
  };
  
  const applyMobileMode = () => {
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
    document.documentElement.style.minWidth = 'auto';
  };
  
  const toggleMode = () => {
    const newMode = !desktopMode;
    setDesktopMode(newMode);
    localStorage.setItem('glyphlock_desktop_mode', newMode);
    
    if (newMode) {
      applyDesktopMode();
    } else {
      applyMobileMode();
    }
    
    // Force reload to apply changes
    window.location.reload();
  };
  
  // Only show on mobile devices
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (!isMobile) return null;
  
  return (
    <div className="md:hidden fixed top-4 right-4 z-[9999]">
      <Button
        onClick={toggleMode}
        size="sm"
        className={`min-w-[56px] min-h-[56px] rounded-full shadow-lg ${
          desktopMode 
            ? 'bg-gradient-to-r from-green-600 to-emerald-600' 
            : 'bg-gradient-to-r from-purple-600 to-blue-600'
        }`}
      >
        {desktopMode ? <Monitor className="w-6 h-6" /> : <Smartphone className="w-6 h-6" />}
      </Button>
    </div>
  );
}