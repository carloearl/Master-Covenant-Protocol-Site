import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function StatCard({ 
  icon: Icon, 
  value, 
  label, 
  trend,
  color = "blue" 
}) {
  const colorClasses = {
    blue: "from-blue-500/10 to-blue-700/10 border-blue-500/30 text-blue-400",
    red: "from-red-500/10 to-red-700/10 border-red-500/30 text-red-400",
    green: "from-green-500/10 to-green-700/10 border-green-500/30 text-green-400",
    yellow: "from-yellow-500/10 to-yellow-700/10 border-yellow-500/30 text-yellow-400",
    purple: "from-purple-500/10 to-purple-700/10 border-purple-500/30 text-purple-400"
  };

  return (
    <Card className={`bg-gradient-to-br ${colorClasses[color]}`}>
      <CardContent className="p-6 text-center">
        <Icon className={`w-10 h-10 ${colorClasses[color].split(' ')[2]} mx-auto mb-3`} />
        <div className="text-3xl font-bold text-white mb-1">{value}</div>
        <div className="text-sm text-gray-400">{label}</div>
        {trend && (
          <div className={`text-xs mt-2 ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </div>
        )}
      </CardContent>
    </Card>
  );
}