import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Shield, AlertTriangle } from "lucide-react";
import StatCard from "@/components/shared/StatCard";

export default function SecurityAnalytics() {
  const { data: threats = [] } = useQuery({
    queryKey: ['threats'],
    queryFn: () => base44.entities.HotzoneThreat.list('-created_date', 100)
  });

  const totalThreats = threats.length;
  const criticalThreats = threats.filter(t => t.severity === "critical").length;
  const resolvedThreats = threats.filter(t => t.status === "resolved").length;
  const activeThreats = threats.filter(t => t.status === "detected" || t.status === "investigating").length;

  const resolutionRate = totalThreats > 0 ? Math.round((resolvedThreats / totalThreats) * 100) : 0;

  const threatsByType = threats.reduce((acc, threat) => {
    acc[threat.threat_type] = (acc[threat.threat_type] || 0) + 1;
    return acc;
  }, {});

  const threatsBySeverity = {
    critical: threats.filter(t => t.severity === "critical").length,
    high: threats.filter(t => t.severity === "high").length,
    medium: threats.filter(t => t.severity === "medium").length,
    low: threats.filter(t => t.severity === "low").length
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard icon={Shield} value={totalThreats} label="Total Threats" color="blue" />
        <StatCard icon={AlertTriangle} value={criticalThreats} label="Critical" color="red" />
        <StatCard icon={TrendingUp} value={activeThreats} label="Active" color="yellow" />
        <StatCard icon={BarChart3} value={`${resolutionRate}%`} label="Resolution Rate" color="green" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white text-sm">Threats by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(threatsByType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">{type}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500"
                        style={{ width: `${(count / totalThreats) * 100}%` }}
                      />
                    </div>
                    <span className="text-white font-semibold text-sm w-8">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white text-sm">Threats by Severity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(threatsBySeverity).map(([severity, count]) => {
                const colors = {
                  critical: "bg-red-500",
                  high: "bg-orange-500",
                  medium: "bg-yellow-500",
                  low: "bg-blue-500"
                };
                return (
                  <div key={severity} className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm capitalize">{severity}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${colors[severity]}`}
                          style={{ width: `${totalThreats > 0 ? (count / totalThreats) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="text-white font-semibold text-sm w-8">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}