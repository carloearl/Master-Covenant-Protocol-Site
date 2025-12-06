import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import SecurityMonitor from "@/components/SecurityMonitor";
import GlyphBotJr from "@/components/GlyphBotJr";
import NebulaLayer from "@/components/global/NebulaLayer";
import CursorOrb from "@/components/global/CursorOrb";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlyphLoader from "@/components/GlyphLoader";
import MobileScalingSystem from "@/components/mobile/mobile-utils";

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
    <div className="min-h-screen text-white flex flex-col relative overflow-x-hidden selection:bg-[#00E4FF] selection:text-black" style={{ background: '#000000' }}>
      <SecurityMonitor />

      {/* SITE-WIDE COSMIC SYSTEM */}
      <NebulaLayer intensity={1.0} />
      <CursorOrb />

      <Navbar user={user} onLogin={handleLogin} onLogout={handleLogout} />

      <main className="flex-1 relative pt-4" style={{ background: 'transparent' }}>
        {children}
      </main>

      <GlyphBotJr />

      <div className="relative z-30">
        <Footer />
      </div>
    </div>
  );
}