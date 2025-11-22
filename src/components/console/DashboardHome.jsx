import React, { useState, useEffect } from "react";
import { Activity, Key, Zap, Shield, TrendingUp, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { glyphLockAPI } from "@/components/api/glyphLockAPI";
import UsagePanel from "./UsagePanel";

export default function DashboardHome({ user }) {
  const [stats, setStats] = useState({
    apiKeys: 0,
    functions: 0,
    requests: 0,
    uptime: "99.9%"
  });
  const [health, setHealth] = useState("checking");
  const [recentLogs, setRecentLogs] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Fetch real data from backend
      const [healthStatus, usageSummary, recentLogsData] = await Promise.all([
        glyphLockAPI.healthCheck(),
        glyphLockAPI.usage.getSummary(),
        glyphLockAPI.logs.listRecent()
      ]);

      setHealth(healthStatus.status);
      
      // Set real stats from backend
      setStats({
        apiKeys: usageSummary.api_keys?.active || 0,
        functions: usageSummary.functions?.deployed || 0,
        requests: usageSummary.requests?.today || 0,
        uptime: healthStatus.uptime || "99.9%"
      });

      // Transform logs into activity items
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
    }
  };

  const statCards = [
    { label: "Active API Keys", value: stats.apiKeys, icon: Key, color: "#8C4BFF" },
    { label: "Edge Functions", value: stats.functions, icon: Zap, color: "#00E4FF" },
    { label: "Requests Today", value: stats.requests.toLocaleString(), icon: Activity, color: "#9F00FF" },
    { label: "System Uptime", value: stats.uptime, icon: TrendingUp, color: "#00FF88" }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-white/70">Welcome back, {user?.email}</p>
      </div>

      {/* System Health */}
      <Card className="bg-[#0A0F24] border-[#00E4FF]/20 hover:border-[#00E4FF]/40 transition-all">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${health === 'healthy' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
              <span className="text-white font-medium">System Status: {health === 'healthy' ? 'All Systems Operational' : 'Checking...'}</span>
            </div>
            <Shield className="w-5 h-5 text-[#00E4FF]" />
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="bg-[#0A0F24]/80 border-[#00E4FF]/20 hover:border-[#00E4FF]/50 transition-all backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Icon className="w-8 h-8" style={{ color: stat.color }} />
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br opacity-20" style={{ backgroundImage: `linear-gradient(to bottom right, ${stat.color}, ${stat.color}40)` }} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-sm text-white/60">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

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

      {/* Recent Activity */}
      <Card className="bg-[#0A0F24]/80 border-[#00E4FF]/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentLogs.map((log) => (
              <div key={log.id} className="flex items-center gap-3 p-3 rounded-lg bg-[#00E4FF]/5 border border-[#00E4FF]/10 hover:border-[#00E4FF]/30 transition-all">
                <div className={`w-2 h-2 rounded-full ${log.type === 'success' ? 'bg-green-500' : log.type === 'warning' ? 'bg-yellow-500' : 'bg-[#00E4FF]'}`} />
                <span className="flex-1 text-sm text-white">{log.message}</span>
                <span className="text-xs text-white/50">{log.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="group p-6 rounded-lg bg-[#0A0F24]/80 border border-[#00E4FF]/20 hover:border-[#00E4FF]/50 hover:bg-[#00E4FF]/5 transition-all text-left backdrop-blur-xl">
          <Key className="w-8 h-8 text-[#00E4FF] mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="text-white font-medium mb-1">Generate API Key</h3>
          <p className="text-sm text-white/60">Create new cryptographic key</p>
        </button>

        <button className="group p-6 rounded-lg bg-[#0A0F24]/80 border border-[#8C4BFF]/20 hover:border-[#8C4BFF]/50 hover:bg-[#8C4BFF]/5 transition-all text-left backdrop-blur-xl">
          <Zap className="w-8 h-8 text-[#8C4BFF] mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="text-white font-medium mb-1">Deploy Function</h3>
          <p className="text-sm text-white/60">Push edge function live</p>
        </button>

        <button className="group p-6 rounded-lg bg-[#0A0F24]/80 border border-[#9F00FF]/20 hover:border-[#9F00FF]/50 hover:bg-[#9F00FF]/5 transition-all text-left backdrop-blur-xl">
          <Shield className="w-8 h-8 text-[#9F00FF] mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="text-white font-medium mb-1">Security Audit</h3>
          <p className="text-sm text-white/60">Deep system analysis</p>
        </button>
      </div>
    </div>
  );
}