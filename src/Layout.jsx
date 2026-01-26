import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import SecurityMonitor from "@/components/SecurityMonitor";
import { UI } from "@/components/glyphlock/bot";
import NebulaLayer from "@/components/global/NebulaLayer";
import CursorOrb from "@/components/global/CursorOrb";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlyphLoader from "@/components/GlyphLoader";
import MobileScalingSystem from "@/components/mobile/mobile-utils";
import MobileTouchOptimizer from "@/components/mobile/MobileTouchOptimizer";
import MobileOptimizer from "@/components/mobile/MobileOptimizer";
import MobileBottomNav from "@/components/mobile/MobileBottomNav";
import MobileSlideMenu from "@/components/mobile/MobileSlideMenu";
import ThemeProvider from "@/components/ThemeProvider";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import StructuredDataOrg from "@/components/StructuredDataOrg";
import SecurityHeaders from "@/components/security/SecurityHeaders";
import CrawlerFallback from "@/components/seo/CrawlerFallback";
import PrerenderHints from "@/components/seo/PrerenderHints";

const { GlyphBotJr } = UI;

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    (async () => {
      try {
        const isAuthenticated = await base44.auth.isAuthenticated();
        if (isAuthenticated) {
          const userData = await base44.auth.me();
          setUser(userData);
        }
      } catch (err) {
        console.error("Failed to get user:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const host = window.location.hostname;
      const isLocal = host === 'localhost' || host === '127.0.0.1';
      
      if (!isLocal) {
        // 1. Force non-www (canonical domain) to fix CERT_COMMON_NAME_INVALID
        if (host.startsWith('www.')) {
          const target = `https://${host.replace(/^www\./, '')}${window.location.pathname}${window.location.search}`;
          window.location.replace(target);
          return;
        }
      }

      // Initialize mobile scaling system - only once
      if (!window.glyphMobileSystemInitialized) {
        new MobileScalingSystem();
        window.glyphMobileSystemInitialized = true;
      }
      
      // CRITICAL ANDROID FIX: Force 300ms tap delay removal
      document.addEventListener('touchstart', function(){}, {passive: true});
      
      // ANDROID: Prevent zoom on input focus
      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      }
      
      // ANDROID: Fix 100vh issue
      const setVH = () => {
        document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
      };
      setVH();
      window.addEventListener('resize', setVH);
      window.addEventListener('orientationchange', setVH);
    }
  }, []);

  useEffect(() => {
    // CRITICAL: Enable mobile scroll
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      document.body.style.scrollSnapType = 'none';
      document.documentElement.style.scrollSnapType = 'none';
      document.body.style.touchAction = 'pan-y pan-x';
      document.documentElement.style.touchAction = 'pan-y pan-x';
      document.body.style.overflowY = 'scroll';
      document.body.style.webkitOverflowScrolling = 'touch';
    }
    
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  if (loading) return <GlyphLoader text="Initializing Secure Environment..." />;

  const handleLogout = async () => {
    try {
      await base44.auth.logout();
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleLogin = async () => {
    try {
      await base44.auth.redirectToLogin();
    } catch (err) {
      console.error("Login redirect failed:", err);
    }
  };

  return (
    <ThemeProvider>
      {/* GLYPHLOCK: Analytics, SEO & Security */}
      <GoogleAnalytics />
      <StructuredDataOrg />
      <SecurityHeaders />
      <CrawlerFallback />
      <PrerenderHints />
      
      {/* Background layers - hidden on mobile */}
      <div className="hidden md:block" style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }}>
        <NebulaLayer intensity={1.0} />
      </div>
      <div className="hidden md:block" style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }}>
        <CursorOrb />
      </div>

      <div 
        className="min-h-screen text-white flex flex-col relative overflow-x-hidden selection:bg-[#00E4FF] selection:text-black touch-pan-y" 
        style={{ 
          background: 'transparent',
          paddingBottom: 'env(safe-area-inset-bottom)',
          position: 'relative',
          zIndex: 1,
          isolation: 'isolate',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <MobileTouchOptimizer />
        <MobileOptimizer />
        <SecurityMonitor />

        {/* Desktop Navbar */}
        <div className="hidden md:block">
          <Navbar user={user} onLogin={handleLogin} onLogout={handleLogout} />
        </div>

        {/* Mobile Navigation */}
        <MobileBottomNav onMenuOpen={() => setMobileMenuOpen(true)} />
        <MobileSlideMenu 
          isOpen={mobileMenuOpen} 
          onClose={() => setMobileMenuOpen(false)}
          user={user}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />

        {/* Main content */}
        <main className="flex-1 relative pt-4 pb-28 md:pb-4 px-4 md:px-0">
          {children}
        </main>

        {/* GlyphBot Jr */}
        <div style={{ 
          position: 'fixed', 
          bottom: 0, 
          right: 0, 
          zIndex: 9999, 
          touchAction: 'manipulation'
        }}>
          <GlyphBotJr />
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </ThemeProvider>
  );
  }