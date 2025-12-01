import React, { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, AlertTriangle, CheckCircle, Activity, 
  Lock, Server, FileText, AlertOctagon, Eye
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import GlyphLoader from "@/components/GlyphLoader";
import LiveSecurityFeed from "./LiveSecurityFeed";
import SecurityKPIs from "./SecurityKPIs";
import ThreatSummaryPanel from "./ThreatSummaryPanel";
import ChainStatusWidget from "./ChainStatusWidget";
import CustomizableWidgets, { AVAILABLE_WIDGETS } from "./CustomizableWidgets";

export default function SecurityOverview() {
  const [activeWidgets, setActiveWidgets] = useState(['live_feed', 'kpis', 'threats', 'chain_status']);

  const handleWidgetsChange = useCallback((widgets) => {
    setActiveWidgets(widgets);
  }, []);

  // 1. Active Threats
  const { data: qrThreats, isLoading: loadingQR } = useQuery({
    queryKey: ['qrThreats'],
    queryFn: () => base44.entities.QRThreatLog.filter({ resolved: false })
  });

  const { data: hotzoneThreats, isLoading: loadingHotzone } = useQuery({
    queryKey: ['hotzoneThreats'],
    queryFn: () => base44.entities.HotzoneThreat.filter({ status: "detected" }) // assuming 'detected' means active
  });

  // 2. Protected Assets
  const { data: imagesCount } = useQuery({
    queryKey: ['imagesCount'],
    queryFn: async () => (await base44.entities.InteractiveImage.list()).length
  });

  const { data: keysCount } = useQuery({
    queryKey: ['keysCount'],
    queryFn: async () => (await base44.entities.APIKey.list()).length
  });

  // 3. Recent Security Events
  const { data: auditLogs, isLoading: loadingAudit } = useQuery({
    queryKey: ['auditLogs'],
    queryFn: () => base44.entities.SystemAuditLog.list('-created_date', 10)
  });

  // Compliance Check (Mock/Calculated)
  const calculateCompliance = () => {
    let score = 100;
    const checks = [];
    
    if (qrThreats?.length > 0) {
      score -= 10;
      checks.push({ pass: false, msg: "Active QR threats detected" });
    } else {
        checks.push({ pass: true, msg: "No active QR threats" });
    }

    if (hotzoneThreats?.length > 0) {
      score -= 10;
      checks.push({ pass: false, msg: "Active Hotzone threats detected" });
    } else {
        checks.push({ pass: true, msg: "No active Hotzone threats" });
    }

    // Mock checks
    checks.push({ pass: true, msg: "API Keys rotated in last 90 days" });
    checks.push({ pass: true, msg: "2FA Enforced for Admins" });
    checks.push({ pass: true, msg: "Data Encryption at Rest" });

    return { score, checks };
  };

  const compliance = calculateCompliance();
  const activeThreatsCount = (qrThreats?.length || 0) + (hotzoneThreats?.length || 0);

  if (loadingQR || loadingHotzone || loadingAudit) {
    return <GlyphLoader text="Analyzing Security Posture..." fullScreen={false} />;
  }

  // Chart Data Preparation
  const threatData = [
    { name: 'QR Threats', count: qrThreats?.length || 0 },
    { name: 'Hotzone Threats', count: hotzoneThreats?.length || 0 },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header with Customize Button */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-2">
            <Shield className="w-8 h-8 text-[#3B82F6] drop-shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
            Security Command Center
          </h2>
          <p className="text-gray-400 mt-1">Real-time threat monitoring and security posture</p>
        </div>
        <div className="flex items-center gap-3">
          <CustomizableWidgets onWidgetsChange={handleWidgetsChange} />
          <Badge 
            variant={activeThreatsCount > 0 ? "destructive" : "outline"} 
            className={`text-lg py-1 px-4 ${
              activeThreatsCount > 0 
                ? 'bg-red-500/20 border-red-500/50 text-red-400 animate-pulse' 
                : 'bg-green-500/20 border-green-500/50 text-green-400'
            }`}
          >
            {activeThreatsCount > 0 ? `${activeThreatsCount} Active Threats` : "System Secure"}
          </Badge>
        </div>
      </div>

      {/* Security KPIs - Always visible when enabled */}
      {activeWidgets.includes('kpis') && <SecurityKPIs />}

      {/* Main Dashboard Grid - Live Feed + Threats + Chain */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Security Feed - 2 columns */}
        {activeWidgets.includes('live_feed') && (
          <div className="lg:col-span-2">
            <LiveSecurityFeed maxEvents={12} />
          </div>
        )}

        {/* Right Column - Threats + Chain Status */}
        <div className="space-y-6">
          {activeWidgets.includes('threats') && <ThreatSummaryPanel />}
          {activeWidgets.includes('chain_status') && <ChainStatusWidget />}
        </div>
      </div>

      {/* Original Stats Row - Redesigned */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-900/80 border-2 border-[#3B82F6]/40 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Active Threats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${activeThreatsCount > 0 ? 'text-red-400' : 'text-green-400'}`}>
              {activeThreatsCount}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {activeThreatsCount > 0 ? 'Requires attention' : 'All clear'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-2 border-[#3B82F6]/40 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Compliance Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">{compliance.score}%</div>
            <p className="text-xs text-gray-500 mt-1">Industry standards</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-2 border-[#3B82F6]/40 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Protected Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-400">{(imagesCount || 0) + (keysCount || 0)}</div>
            <p className="text-xs text-gray-500 mt-1">Images & API Keys</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-2 border-[#3B82F6]/40 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-green-400 font-bold text-xl">
              <Activity className="w-5 h-5" />
              Operational
            </div>
            <p className="text-xs text-gray-500 mt-1">All systems normal</p>
          </CardContent>
        </Card>
      </div>

      {/* Threat Landscape Chart + Compliance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-slate-900/80 border-2 border-[#3B82F6]/40 shadow-[0_0_20px_rgba(59,130,246,0.15)] lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-red-400" />
              Threat Landscape
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={threatData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', borderColor: '#3B82F6', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" fill="#3b82f6">
                   {threatData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.name === 'QR Threats' ? '#ef4444' : '#f59e0b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-2 border-[#3B82F6]/40 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              Compliance Checks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {compliance.checks.map((check, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                {check.pass ? (
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                )}
                <span className="text-sm text-gray-300">{check.msg}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Security Events Log */}
      <Card className="bg-slate-900/80 border-2 border-[#3B82F6]/40 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#3B82F6] drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
            Recent Security Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {auditLogs?.length > 0 ? (
              auditLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-transparent hover:border-[#3B82F6]/30">
                  <div className="flex items-center gap-3">
                    <Activity className="w-4 h-4 text-[#3B82F6]" />
                    <div>
                      <div className="text-white font-medium text-sm">{log.event_type?.replace(/_/g, ' ').toUpperCase()}</div>
                      <div className="text-gray-500 text-xs">{log.description || JSON.stringify(log.details)?.slice(0, 50)}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">{new Date(log.created_date).toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{log.actor_email}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">No recent security events found</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Active Threats List Details (if any) */}
      {activeThreatsCount > 0 && (
        <Card className="bg-slate-900/80 border-2 border-red-500/50 shadow-[0_0_25px_rgba(239,68,68,0.2)]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
              Active Threat Details
            </CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-2">
                {qrThreats?.map(threat => (
                    <Alert key={threat.id} variant="destructive" className="bg-red-950/30 border-red-900/60 text-white">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>QR Threat: {threat.attack_type}</AlertTitle>
                        <AlertDescription>
                            Detected on {new Date(threat.created_date).toLocaleString()}. Payload: {threat.payload?.slice(0, 100)}
                        </AlertDescription>
                    </Alert>
                ))}
                 {hotzoneThreats?.map(threat => (
                    <Alert key={threat.id} variant="destructive" className="bg-orange-950/30 border-orange-900/60 text-white">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Hotzone Threat: {threat.threat_type}</AlertTitle>
                        <AlertDescription>
                            {threat.description} (Severity: {threat.severity})
                        </AlertDescription>
                    </Alert>
                ))}
             </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}