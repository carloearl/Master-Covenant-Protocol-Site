import React from "react";
import { Badge } from "@/components/ui/badge";

export default function SeverityBadge({ severity }) {
  const getColor = () => {
    switch(severity) {
      case "critical": return "bg-red-500/20 text-red-400 border-red-500/50";
      case "high": return "bg-orange-500/20 text-orange-400 border-orange-500/50";
      case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "low": return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  return (
    <Badge className={getColor()}>
      {severity}
    </Badge>
  );
}