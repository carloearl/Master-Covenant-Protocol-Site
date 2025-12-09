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
import ThemeProvider from "@/components/ThemeProvider";

const { GlyphBotJr } = UI;

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
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
    // Initialize mobile scaling system
    if (typeof window !== 'undefined') {
      new MobileScalingSystem();
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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
      {/* SITE-WIDE NEBULA - Absolute bottom layer */}
      <div 
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          zIndex: -10, 
          pointerEvents: 'none !important',
          transform: 'translateZ(0)',
          willChange: 'transform',
          backfaceVisibility: 'hidden'
        }}
      >
        <NebulaLayer intensity={1.0} />
      </div>

      {/* CURSOR ORB - Desktop only, above nebula */}
      <div 
        className="hidden md:block" 
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          zIndex: -9, 
          pointerEvents: 'none !important',
          transform: 'translateZ(0)',
          willChange: 'transform',
          backfaceVisibility: 'hidden'
        }}
      >
        <CursorOrb />
      </div>

      <div 
        className="min-h-screen text-white flex flex-col relative overflow-x-hidden selection:bg-[#00E4FF] selection:text-black" 
        style={{ 
          background: 'transparent',
          paddingBottom: 'env(safe-area-inset-bottom)',
          overscrollBehavior: 'none',
          zIndex: 10,
          position: 'relative'
        }}
      >
        <MobileTouchOptimizer />
        <SecurityMonitor />

        {/* Navbar - Hidden on Dream Team page */}
        {currentPageName !== 'DreamTeam' && (
          <div style={{ position: 'relative', zIndex: 9998, pointerEvents: 'auto' }}>
            <Navbar user={user} onLogin={handleLogin} onLogout={handleLogout} />
          </div>
        )}

        {/* Main content */}
        <main className={`flex-1 relative ${currentPageName === 'DreamTeam' ? '' : 'pt-4'}`} style={{ background: 'transparent', zIndex: currentPageName === 'DreamTeam' ? 'auto' : 100, pointerEvents: 'auto', position: 'relative' }}>
          {children}
        </main>

        {/* GlyphBot Jr */}
        <div style={{ 
          position: 'fixed', 
          bottom: 0, 
          right: 0, 
          zIndex: 99999, 
          pointerEvents: 'auto !important',
          isolation: 'isolate',
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
          display: 'block !important',
          visibility: 'visible !important'
        }}>
          <GlyphBotJr />
        </div>

        {/* Footer - Hidden on Dream Team page */}
        {currentPageName !== 'DreamTeam' && (
          <div className="relative z-10 overflow-hidden" style={{ pointerEvents: 'auto', isolation: 'isolate' }}>
            <Footer />
          </div>
        )}
      </div>
    </ThemeProvider>
  );
  }