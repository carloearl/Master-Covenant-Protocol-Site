import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DataTable from "@/components/dashboard/DataTable";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState(null);
  const [darkMode, setDarkMode] = useState(true);

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
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <LoadingSpinner message="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-950' : 'bg-gray-50'} flex`}>
      <DashboardSidebar 
        selectedModel={selectedModel} 
        setSelectedModel={setSelectedModel}
        darkMode={darkMode}
      />
      
      <div className="flex-1 flex flex-col">
        <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10`}>
          <div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Admin Dashboard
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {user?.email} • {user?.role}
            </p>
          </div>
          <Button
            onClick={() => setDarkMode(!darkMode)}
            size="icon"
            variant="outline"
            className={darkMode ? 'border-gray-700' : 'border-gray-300'}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>

        <DataTable selectedModel={selectedModel} darkMode={darkMode} />
      </div>
    </div>
  );
}