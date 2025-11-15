import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, CheckCircle2, Activity, Bell, BellOff, 
  Radio, Wifi, WifiOff, RefreshCw 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LiveThreatMonitor({ threats, onRefresh }) {
  const [isLive, setIsLive] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [recentThreats, setRecentThreats] = useState([]);
  const [systemStatus, setSystemStatus] = useState({
    surveillance: 'operational',
    ai_detection: 'operational',
    database: 'operational',
    api: 'operational'
  });

  // Simulate real-time threat detection
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      // Check for new threats (last 5 minutes)
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const newThreats = threats.filter(t => 
        new Date(t.created_date) > fiveMinutesAgo
      );
      
      if (newThreats.length > recentThreats.length) {
        const latestThreat = newThreats[newThreats.length - 1];
        if (alertsEnabled && (latestThreat.severity === 'critical' || latestThreat.severity === 'high')) {
          showCriticalAlert(latestThreat);
        }
      }
      
      setRecentThreats(newThreats);
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive, threats, recentThreats.length, alertsEnabled]);

  const showCriticalAlert = (threat) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🚨 Critical Security Alert', {
        body: `${threat.threat_type} detected at ${threat.hotspot_name}`,
        icon: '/icon.png',
        badge: '/badge.png',
        tag: threat.id,
        requireInteraction: true
      });
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const criticalCount = threats.filter(t => t.severity === 'critical' && !t.resolved).length;
  const highCount = threats.filter(t => t.severity === 'high' && !t.resolved).length;

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 ${isLive ? 'text-green-400' : 'text-gray-500'}`}>
              {isLive ? <Radio className="w-5 h-5 animate-pulse" /> : <WifiOff className="w-5 h-5" />}
              <CardTitle className="text-white">Live Threat Monitor</CardTitle>
            </div>
            {isLive && (
              <Badge className="bg-green-500/20 text-green-400 animate-pulse">
                LIVE
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setAlertsEnabled(!alertsEnabled)}
              className={`${alertsEnabled ? 'text-blue-400 border-blue-500/50' : 'text-gray-500 border-gray-700'}`}
            >
              {alertsEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsLive(!isLive)}
              className="text-white border-gray-700"
            >
              {isLive ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onRefresh}
              className="text-white border-gray-700"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* System Status */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(systemStatus).map(([system, status]) => (
            <div key={system} className="bg-gray-800/50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 capitalize">{system.replace('_', ' ')}</span>
                {status === 'operational' ? (
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                )}
              </div>
              <div className="text-sm text-white mt-1 capitalize">{status}</div>
            </div>
          ))}
        </div>

        {/* Critical Alerts */}
        <AnimatePresence>
          {criticalCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Alert className="bg-red-500/10 border-red-500/50">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-300">
                  <strong>{criticalCount} CRITICAL</strong> and <strong>{highCount} HIGH</strong> priority threats require immediate attention!
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recent Activity Feed */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">Recent Activity (Last 5 min)</h3>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            <AnimatePresence>
              {recentThreats.slice(-5).reverse().map((threat, idx) => (
                <motion.div
                  key={threat.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-gray-800/30 rounded-lg p-3 border-l-2 border-blue-500"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={
                          threat.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                          threat.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }>
                          {threat.severity}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {new Date(threat.created_date).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-white">{threat.hotspot_name}</p>
                      <p className="text-xs text-gray-400">{threat.threat_type}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {recentThreats.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">No new threats detected</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}