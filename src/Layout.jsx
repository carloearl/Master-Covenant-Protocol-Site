import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import SecurityMonitor from "@/components/SecurityMonitor";
import GlyphBotJr from "@/components/GlyphBotJr";
import InteractiveNebula from "@/components/InteractiveNebula";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
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
      }
    })();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

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
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden flex flex-col">
      <SecurityMonitor />
      <InteractiveNebula />

      <Navbar user={user} onLogin={handleLogin} onLogout={handleLogout} />

      <main className="flex-1 relative z-10">
        {children}
      </main>

      <GlyphBotJr />

      <Footer />
    </div>
  );
}