import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, Activity, AlertTriangle, Eye, Ban, CheckCircle, 
  TrendingUp, Users, Globe, Lock
} from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AdminSecurity() {
  const [trafficStats, setTrafficStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ipToBlock, setIpToBlock] = useState("");

  const fetchTrafficStats = async () => {
    setLoading(true);
    try {
      const response = await base44.functions.invoke('trafficMonitor', { action: 'stats' });
      setTrafficStats(response.data);
    } catch (error) {
      console.error('Failed to fetch traffic stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrafficStats();
    const interval = setInterval(fetchTrafficStats, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const handleBlockIP = async () => {
    if (!ipToBlock) return;
    try {
      await base44.functions.invoke('trafficMonitor', { action: 'block', ip: ipToBlock });
      setIpToBlock("");
      fetchTrafficStats();
    } catch (error) {
      console.error('Failed to block IP:', error);
    }
  };

  const handleUnblockIP = async (ip) => {
    try {
      await base44.functions.invoke('trafficMonitor', { action: 'unblock', ip });
      fetchTrafficStats();
    } catch (error) {
      console.error('Failed to unblock IP:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Security Monitoring</h2>
          <p className="text-gray-400">Real-time traffic analysis and bot detection</p>
        </div>
        <Button onClick={fetchTrafficStats} disabled={loading}>
          <Activity className="w-4 h-4 mr-2" />
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {trafficStats && (
        <>
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="glass-card-dark border-blue-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Globe className="w-8 h-8 text-blue-400" />
                  {trafficStats.isSpike && (
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/50">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Spike
                    </Badge>
                  )}
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {trafficStats.avgRequestsPerMinute}
                </div>
                <div className="text-sm text-gray-400">Requests/Minute</div>
                <div className="text-xs text-gray-500 mt-2">
                  Total: {trafficStats.totalRequests}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card-dark border-orange-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <AlertTriangle className="w-8 h-8 text-orange-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {trafficStats.suspiciousRequests}
                </div>
                <div className="text-sm text-gray-400">Suspicious Requests</div>
                <div className="text-xs text-gray-500 mt-2">
                  Rate: {trafficStats.suspicionRate}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card-dark border-red-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Ban className="w-8 h-8 text-red-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {trafficStats.blockedIPs.length}
                </div>
                <div className="text-sm text-gray-400">Blocked IPs</div>
                <div className="text-xs text-gray-500 mt-2">
                  Auto-blocked
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card-dark border-yellow-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Eye className="w-8 h-8 text-yellow-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {trafficStats.suspiciousIPs.length}
                </div>
                <div className="text-sm text-gray-400">High Activity IPs</div>
                <div className="text-xs text-gray-500 mt-2">
                  Monitoring
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="glass-card-dark border-red-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Ban className="w-5 h-5 text-red-400" />
                  Blocked IP Addresses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {trafficStats.blockedIPs.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Shield className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>No blocked IPs</p>
                    </div>
                  ) : (
                    trafficStats.blockedIPs.map((ip, idx) => (
                      <div
                        key={idx}
                        className="glass-card p-3 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-mono text-white">{ip}</div>
                          <div className="text-xs text-gray-400">Automatically blocked</div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUnblockIP(ip)}
                          className="border-green-500/50 text-green-400"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Unblock
                        </Button>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex gap-2">
                    <Input
                      placeholder="IP address to block"
                      value={ipToBlock}
                      onChange={(e) => setIpToBlock(e.target.value)}
                      className="glass-input text-white"
                    />
                    <Button
                      onClick={handleBlockIP}
                      disabled={!ipToBlock}
                      className="bg-gradient-to-r from-red-500 to-red-600"
                    >
                      <Ban className="w-4 h-4 mr-2" />
                      Block
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card-dark border-yellow-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Activity className="w-5 h-5 text-yellow-400" />
                  High Activity IPs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {trafficStats.suspiciousIPs.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>No high activity detected</p>
                    </div>
                  ) : (
                    trafficStats.suspiciousIPs.map((item, idx) => (
                      <div
                        key={idx}
                        className="glass-card p-3 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-mono text-white">{item.ip}</div>
                          <div className="text-xs text-gray-400">
                            {item.count} requests/minute
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setIpToBlock(item.ip);
                          }}
                          className="border-red-500/50 text-red-400"
                        >
                          <Ban className="w-4 h-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-card-dark border-blue-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Lock className="w-5 h-5 text-blue-400" />
                Security Protection Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="glass-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="font-semibold text-white">Rate Limiting</span>
                  </div>
                  <p className="text-sm text-gray-400">Active - 1000 req/hour auth, 100 req/hour unauth</p>
                </div>
                <div className="glass-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="font-semibold text-white">Bot Detection</span>
                  </div>
                  <p className="text-sm text-gray-400">Active - Allowed bots whitelisted</p>
                </div>
                <div className="glass-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="font-semibold text-white">Traffic Monitoring</span>
                  </div>
                  <p className="text-sm text-gray-400">Active - Real-time analysis</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}