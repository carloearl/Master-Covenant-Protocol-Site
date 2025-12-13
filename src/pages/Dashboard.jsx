import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DataTable from "@/components/dashboard/DataTable";
import DeveloperKeys from "@/components/dashboard/DeveloperKeys";
import SecurityOverview from "@/components/dashboard/SecurityOverview";
import KeyGenerator from "@/components/dashboard/KeyGenerator";
import HashGenerator from "@/components/dashboard/HashGenerator";
import EncoderDecoder from "@/components/dashboard/EncoderDecoder";
import GlyphLoader from "@/components/GlyphLoader";
import SEOHead from "@/components/SEOHead";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) {
        base44.auth.redirectToLogin(window.location.pathname);
        return;
      }
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (error) {
      console.error("Auth error:", error);
      base44.auth.redirectToLogin(window.location.pathname);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <GlyphLoader text="Loading Dashboard..." />;
  }

  const renderContent = () => {
    if (!selectedModel) {
      return <SecurityOverview />;
    }

    switch (selectedModel.id) {
      case 'security-overview':
        return <SecurityOverview />;
      case 'api-keys':
        return <DeveloperKeys />;
      case 'key-generator':
        return <KeyGenerator />;
      case 'hash-generator':
        return <HashGenerator />;
      case 'encoder-decoder':
        return <EncoderDecoder />;
      default:
        return <DataTable selectedModel={selectedModel} />;
    }
  };

  return (
    <>
      <SEOHead
        title="Dashboard | GlyphLock Security Portal"
        description="Access all GlyphLock security tools. Manage QR codes, analyze threats, view security analytics, and control your enterprise security settings."
        url="/dashboard"
      />
      <div className="min-h-screen flex overflow-hidden relative" style={{ background: 'transparent' }}>
      {/* Cosmic Background */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/30 via-cyan-900/10 to-transparent pointer-events-none z-0" />
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDYsIDE4MiwgMjEyLCAwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20 pointer-events-none z-0" />
      <DashboardSidebar 
        selectedModel={selectedModel} 
        setSelectedModel={setSelectedModel}
      />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        {/* Dashboard Header */}
        <div className="glyph-glass-dark border-b border-cyan-500/20 px-8 py-5 flex items-center justify-between z-20 shrink-0 glyph-glow">
          <div>
            <h1 className="text-2xl font-black text-white font-space tracking-tight">
              ADMIN <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">DASHBOARD</span>
            </h1>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide font-medium">
              {user?.email} • <span className="text-purple-400">{user?.role}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-green-500 glyph-pulse"></div>
            <span className="text-xs text-green-400 font-bold uppercase tracking-wider">System Active</span>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          {renderContent()}
        </div>
      </div>
    </div>
    </>
  );
}