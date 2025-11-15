import React from "react";
import { Badge } from "@/components/ui/badge";

export default function SecurityBadge({ score, size = "default" }) {
  const getConfig = () => {
    if (score >= 80) return { 
      label: "Verified", 
      color: "bg-green-500/20 text-green-400 border-green-500/50" 
    };
    if (score >= 65) return { 
      label: "Use with Caution", 
      color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50" 
    };
    return { 
      label: "Blocked", 
      color: "bg-red-500/20 text-red-400 border-red-500/50" 
    };
  };

  const config = getConfig();
  const className = size === "sm" ? "text-xs px-2 py-1" : "px-4 py-2";

  return (
    <Badge className={`${config.color} ${className}`}>
      {config.label}
    </Badge>
  );
}