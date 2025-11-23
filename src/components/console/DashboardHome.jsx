import React, { useState, useEffect } from "react";
import { Activity, Key, Zap, Shield, TrendingUp, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { glyphLockAPI } from "@/components/api/glyphLockAPI";
import DashboardMetrics from "./DashboardMetrics";
import RealtimeActivityFeed from "./RealtimeActivityFeed";
import SystemHealthMonitor from "./SystemHealthMonitor";

export default function DashboardHome({ user }) {
  const [stats, setStats] = useState({
    apiKeys: 0,
    functions: 0,
    requests: 0,
    uptime: "99.9%"
  });
  const [health, setHealth] = useState("checking");
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(() => loadDashboardData(true), 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async (silent = false) => {
    if (!silent) setLoading(true);
    setRefreshing(silent);
    
    try {
      const [healthStatus, usageSummary, recentLogsData] = await Promise.all([
        glyphLockAPI.healthCheck(),
        glyphLockAPI.usage.getSummary(),
        glyphLockAPI.logs.listRecent()
      ]);

      setHealth(healthStatus.status);
      setStats({
        apiKeys: usageSummary.api_keys?.active || 0,
        functions: usageSummary.functions?.deployed || 0,
        requests: usageSummary.requests?.today || 0,
        uptime: healthStatus.uptime || "99.9%"
      });

      const activities = (recentLogsData.logs || []).map(log => ({
        id: log.id,
        type: log.status === 'failure' ? 'warning' : 
              log.event_type.includes('ROTATION') ? 'success' : 'info',
        message: log.description,
        time: new Date(log.created_date).toLocaleString()
      }));

      setRecentLogs(activities.length > 0 ? activities : [
        { id: 1, type: "info", message: "No recent activity", time: "Just now" }
      ]);
    } catch (err) {
      console.error("Dashboard load error:", err);
      setHealth("error");
      setRecentLogs([
        { id: 1, type: "warning", message: "Failed to load dashboard data", time: "Just now" }
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const statCards = [
    { label: "Active API Keys", value: stats.apiKeys, icon: Key, color: "#8C4BFF" },
    { label: "Edge Functions", value: stats.functions, icon: Zap, color: "#00E4FF" },
    { label: "Requests Today", value: stats.requests.toLocaleString(), icon: Activity, color: "#9F00FF" },
    { label: "System Uptime", value: stats.uptime, icon: TrendingUp, color: "#00FF88" }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00E4FF]/30 border-t-[#00E4FF] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-white/70">Welcome back, {user?.email}</p>
        </div>
        <button
          onClick={() => loadDashboardData()}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00E4FF]/10 border border-[#00E4FF]/30 text-[#00E4FF] hover:bg-[#00E4FF]/20 transition-all disabled:opacity-50"
        >
          <Activity className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* System Health */}
      <SystemHealthMonitor />

      {/* Stats Grid - Realtime Metrics */}
      <DashboardMetrics />

      {/* Usage Limits Card */}
      <Card className="bg-[#0A0F24]/80 border-[#00E4FF]/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">Resource Limits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-[#00E4FF]/5 border border-[#00E4FF]/20">
              <p className="text-white/60 text-sm mb-1">API Keys</p>
              <p className="text-white font-bold text-2xl">50</p>
            </div>
            <div className="p-4 rounded-lg bg-[#8C4BFF]/5 border border-[#8C4BFF]/20">
              <p className="text-white/60 text-sm mb-1">Team Seats</p>
              <p className="text-white font-bold text-2xl">5</p>
            </div>
            <div className="p-4 rounded-lg bg-[#9F00FF]/5 border border-[#9F00FF]/20">
              <p className="text-white/60 text-sm mb-1">Functions</p>
              <p className="text-white font-bold text-2xl">Unlimited</p>
            </div>
            <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
              <p className="text-white/60 text-sm mb-1">SDK Downloads</p>
              <p className="text-white font-bold text-2xl">100/mo</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity - Real-time Feed */}
      <RealtimeActivityFeed maxItems={15} />

      {/* Quick Actions */}
      <Card className="bg-[#0A0F24]/80 border-[#00E4FF]/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="group p-6 rounded-lg bg-gradient-to-br from-[#00E4FF]/10 to-transparent border border-[#00E4FF]/20 hover:border-[#00E4FF]/50 hover:from-[#00E4FF]/20 transition-all text-left">
              <Key className="w-8 h-8 text-[#00E4FF] mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-white font-medium mb-1">Generate API Key</h3>
              <p className="text-sm text-white/60">Create new cryptographic key</p>
            </button>

            <button className="group p-6 rounded-lg bg-gradient-to-br from-[#8C4BFF]/10 to-transparent border border-[#8C4BFF]/20 hover:border-[#8C4BFF]/50 hover:from-[#8C4BFF]/20 transition-all text-left">
              <Zap className="w-8 h-8 text-[#8C4BFF] mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-white font-medium mb-1">Deploy Function</h3>
              <p className="text-sm text-white/60">Push edge function live</p>
            </button>

            <button className="group p-6 rounded-lg bg-gradient-to-br from-[#9F00FF]/10 to-transparent border border-[#9F00FF]/20 hover:border-[#9F00FF]/50 hover:from-[#9F00FF]/20 transition-all text-left">
              <Shield className="w-8 h-8 text-[#9F00FF] mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-white font-medium mb-1">Security Audit</h3>
              <p className="text-sm text-white/60">Deep system analysis</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}