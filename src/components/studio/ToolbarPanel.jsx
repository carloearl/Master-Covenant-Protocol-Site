import React from "react";
import { Card } from "@/components/ui/card";
import { MousePointer, Square, Move, ZoomIn } from "lucide-react";

export default function ToolbarPanel({ activeTool, onToolChange }) {
  const tools = [
    { id: "select", icon: MousePointer, label: "Select" },
    { id: "hotspot", icon: Square, label: "Add Hotspot" },
    { id: "pan", icon: Move, label: "Pan" },
    { id: "zoom", icon: ZoomIn, label: "Zoom" }
  ];

  return (
    <Card className="glass-royal border-cyan-500/30 p-2" style={{background: 'rgba(30, 58, 138, 0.2)', backdropFilter: 'blur(16px)'}}>
      <div className="flex flex-col gap-2">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          
          return (
            <button
              key={tool.id}
              onClick={() => onToolChange(tool.id)}
              className={`
                p-3 rounded-lg transition-all flex flex-col items-center gap-1
                ${isActive 
                  ? 'bg-cyan-500/30 border-2 border-cyan-400 shadow-lg shadow-cyan-500/50' 
                  : 'bg-purple-900/20 border-2 border-purple-500/30 hover:border-cyan-500/50'
                }
              `}
              title={tool.label}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'text-white/70'}`} />
              <span className={`text-[10px] ${isActive ? 'text-cyan-400' : 'text-white/50'}`}>
                {tool.label}
              </span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}