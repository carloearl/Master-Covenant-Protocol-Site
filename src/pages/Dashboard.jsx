import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DataTable from "@/components/dashboard/DataTable";
import DeveloperKeys from "@/components/dashboard/DeveloperKeys";
import GlyphLoader from "@/components/GlyphLoader";

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

  return (
    <div className="min-h-screen bg-black flex" style={{ backgroundColor: '#000000' }}>
      <DashboardSidebar 
        selectedModel={selectedModel} 
        setSelectedModel={setSelectedModel}
      />
      
      <div className="flex-1 flex flex-col" style={{ backgroundColor: '#000000' }}>
        <div className="glass-royal border-b border-blue-500/30 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-400">
              {user?.email} • {user?.role}
            </p>
          </div>
        </div>

        {selectedModel?.id === 'api-keys' ? (
          <DeveloperKeys />
        ) : (
          <DataTable selectedModel={selectedModel} />
        )}
      </div>
    </div>
  );
}