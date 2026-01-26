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
import MobileCore from "@/components/mobile/MobileCore";
import MobileBottomNav from "@/components/mobile/MobileBottomNav";
import MobileSlideMenu from "@/components/mobile/MobileSlideMenu";
import ErrorBoundary from "@/components/ErrorBoundary";

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
        // Canonical domain enforcement: www.glyphlock.io → glyphlock.io
        const canonicalDomain = 'glyphlock.io';
        const allowedDomains = ['glyphlock.io', 'www.glyphlock.io'];
        
        if (allowedDomains.includes(host)) {
          // Redirect www to non-www for canonical URL
          if (host.startsWith('www.')) {
            const target = `https://${canonicalDomain}${window.location.pathname}${window.location.search}${window.location.hash}`;
            window.location.replace(target);
            return;
          }
        }
      }
    }
  }, []);

  useEffect(() => {
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
    <ErrorBoundary>
    <ThemeProvider>
      {/* GLYPHLOCK: Analytics, SEO & Security */}
      <GoogleAnalytics />
      <StructuredDataOrg />
      <SecurityHeaders />
      <CrawlerFallback />
      <PrerenderHints />
      
      {/* Background layers - ALWAYS VISIBLE ON DESKTOP */}
      <div className="hidden md:block" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <NebulaLayer intensity={1.0} />
      </div>
      <div className="hidden md:block" style={{ position: 'fixed', inset: 0, zIndex: 2, pointerEvents: 'none' }}>
        <CursorOrb />
      </div>

      <div 
        className="min-h-screen text-white flex flex-col relative overflow-x-hidden selection:bg-[#00E4FF] selection:text-black touch-pan-y" 
        style={{ 
          background: 'transparent',
          paddingBottom: 'env(safe-area-inset-bottom)',
          position: 'relative',
          zIndex: 3,
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {/* Skip to main content for keyboard users */}
        <a href="#main-content" className="skip-to-main">
          Skip to main content
        </a>
        <MobileCore />
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
        <main id="main-content" className="flex-1 relative pt-4 pb-28 md:pb-4 px-4 md:px-0" role="main">
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
        </ErrorBoundary>
        );
        }