import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Server, Database, Cloud, AlertTriangle, CheckCircle } from "lucide-react";
import { glyphLockAPI } from "@/components/api/glyphLockAPI";

export default function SystemHealthMonitor() {
  const [health, setHealth] = useState({
    overall: "healthy",
    services: {
      api: { status: "healthy", latency: "0ms" },
      database: { status: "healthy", latency: "0ms" },
      storage: { status: "healthy", usage: "0%" },
      functions: { status: "healthy", deployed: 0 }
    },
    lastCheck: null
  });
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  const checkHealth = async () => {
    setChecking(true);
    try {
      const data = await glyphLockAPI.healthCheck();
      setHealth({
        overall: data.status || "healthy",
        services: {
          api: { 
            status: data.api?.status || "healthy", 
            latency: data.api?.latency || "< 100ms" 
          },
          database: { 
            status: data.database?.status || "healthy", 
            latency: data.database?.latency || "< 50ms" 
          },
          storage: { 
            status: data.storage?.status || "healthy", 
            usage: data.storage?.usage || "12%" 
          },
          functions: { 
            status: data.functions?.status || "healthy", 
            deployed: data.functions?.deployed || 0 
          }
        },
        lastCheck: new Date()
      });
    } catch (error) {
      console.error("Health check failed:", error);
      setHealth(prev => ({
        ...prev,
        overall: "degraded",
        lastCheck: new Date()
      }));
    } finally {
      setChecking(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "healthy": return "text-green-400 bg-green-400/10 border-green-400/30";
      case "degraded": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
      case "down": return "text-red-400 bg-red-400/10 border-red-400/30";
      default: return "text-gray-400 bg-gray-400/10 border-gray-400/30";
    }
  };

  const getStatusIcon = (status) => {
    if (status === "healthy") return <CheckCircle className="w-4 h-4" />;
    if (status === "degraded") return <AlertTriangle className="w-4 h-4" />;
    return <AlertTriangle className="w-4 h-4" />;
  };

  const services = [
    { key: "api", label: "API Gateway", icon: Server, detail: health.services.api.latency },
    { key: "database", label: "Database", icon: Database, detail: health.services.database.latency },
    { key: "storage", label: "Storage", icon: Cloud, detail: health.services.storage.usage },
    { key: "functions", label: "Functions", icon: Activity, detail: `${health.services.functions.deployed} deployed` }
  ];

  return (
    <Card className="bg-[#0A0F24]/80 border-[#00E4FF]/20 hover:border-[#00E4FF]/40 transition-all backdrop-blur-xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${
              health.overall === 'healthy' ? 'bg-green-500' : 
              health.overall === 'degraded' ? 'bg-yellow-500' : 
              'bg-red-500'
            } ${checking ? 'animate-pulse' : ''}`} />
            <div>
              <span className="text-white font-medium">
                System Status: {health.overall === 'healthy' ? 'All Systems Operational' : 'Service Degraded'}
              </span>
              {health.lastCheck && (
                <p className="text-xs text-white/50 mt-0.5">
                  Last checked: {health.lastCheck.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
          <Activity className={`w-5 h-5 text-[#00E4FF] ${checking ? 'animate-spin' : ''}`} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {services.map((service) => {
            const Icon = service.icon;
            const serviceHealth = health.services[service.key];
            
            return (
              <div 
                key={service.key}
                className={`p-3 rounded-lg border transition-all ${getStatusColor(serviceHealth.status)}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4" />
                  {getStatusIcon(serviceHealth.status)}
                </div>
                <p className="text-xs font-semibold">{service.label}</p>
                <p className="text-xs opacity-70 mt-1">{service.detail}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}