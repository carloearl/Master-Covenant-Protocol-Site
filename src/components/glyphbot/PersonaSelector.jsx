import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Code, Lock, Blocks, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const personas = [
  {
    id: "default",
    name: "GlyphBot",
    icon: Zap,
    description: "Balanced AI assistant for general cybersecurity and development",
    color: "cyan",
    gradient: "from-cyan-500 to-blue-600"
  },
  {
    id: "ethical-hacker",
    name: "Ethical Hacker",
    icon: Shield,
    description: "Offensive security expert focused on penetration testing and exploit analysis",
    color: "red",
    gradient: "from-red-500 to-orange-600"
  },
  {
    id: "senior-developer",
    name: "Senior Developer",
    icon: Code,
    description: "Software architect emphasizing clean code and engineering excellence",
    color: "green",
    gradient: "from-green-500 to-emerald-600"
  },
  {
    id: "security-auditor",
    name: "Security Auditor",
    icon: Lock,
    description: "Compliance and risk assessment specialist with deep security knowledge",
    color: "purple",
    gradient: "from-purple-500 to-pink-600"
  },
  {
    id: "smart-contract-auditor",
    name: "Smart Contract Auditor",
    icon: Blocks,
    description: "Blockchain security expert specializing in DeFi and smart contract vulnerabilities",
    color: "indigo",
    gradient: "from-indigo-500 to-purple-600"
  }
];

export default function PersonaSelector({ selectedPersona, onSelect }) {
  return (
    <div className="grid grid-cols-1 gap-3">
      {personas.map((persona) => {
        const Icon = persona.icon;
        const isSelected = selectedPersona === persona.id;
        
        return (
          <Card
            key={persona.id}
            onClick={() => onSelect(persona.id)}
            className={cn(
              "cursor-pointer transition-all duration-200 group border-2",
              isSelected
                ? `bg-gradient-to-br ${persona.gradient} bg-opacity-20 border-blue-500`
                : "bg-blue-900/20 border-blue-500/30 hover:border-blue-500/50"
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                  isSelected 
                    ? `bg-gradient-to-br ${persona.gradient}`
                    : "bg-gray-700 group-hover:bg-gray-600"
                )}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm">{persona.name}</h3>
                    {isSelected && (
                      <Badge variant="outline" className={`text-xs border-${persona.color}-500 text-${persona.color}-400`}>
                        Active
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {persona.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}