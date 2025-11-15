import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Clock } from "lucide-react";

export default function Roadmap() {
  const quarters = [
    {
      quarter: "Q2 2025",
      status: "completed",
      items: [
        { title: "Master Covenant Patent Filing", status: "completed" },
        { title: "Dream Team AI Binding", status: "completed" },
        { title: "Visual Cryptography Suite Launch", status: "completed" },
        { title: "N.U.P.S. POS MVP", status: "completed" }
      ]
    },
    {
      quarter: "Q3 2025",
      status: "in-progress",
      items: [
        { title: "Security Operations Center", status: "completed" },
        { title: "GlyphBot AI Enhancement", status: "in-progress" },
        { title: "Blockchain Security Suite", status: "in-progress" },
        { title: "Enterprise Dashboard", status: "in-progress" }
      ]
    },
    {
      quarter: "Q4 2025",
      status: "planned",
      items: [
        { title: "Mobile App Launch", status: "planned" },
        { title: "Smart Contract Generator", status: "planned" },
        { title: "Advanced Threat Detection", status: "planned" },
        { title: "SOC 2 Certification", status: "planned" }
      ]
    },
    {
      quarter: "Q1 2026",
      status: "planned",
      items: [
        { title: "Full Quantum Encryption", status: "planned" },
        { title: "Global CDN Deployment", status: "planned" },
        { title: "Enterprise API Platform", status: "planned" },
        { title: "ISO 27001 Certification", status: "planned" }
      ]
    }
  ];

  const getStatusIcon = (status) => {
    switch(status) {
      case "completed": return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case "in-progress": return <Clock className="w-5 h-5 text-yellow-400" />;
      default: return <Circle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "completed": return "bg-green-500/20 text-green-400 border-green-500/50";
      case "in-progress": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Product <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Roadmap</span>
            </h1>
            <p className="text-xl text-gray-400">
              Our journey to building the world's most advanced security platform
            </p>
          </div>

          <div className="space-y-8">
            {quarters.map((quarter, idx) => (
              <Card key={idx} className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-2xl">{quarter.quarter}</CardTitle>
                    <Badge className={getStatusColor(quarter.status)}>
                      {quarter.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {quarter.items.map((item, iidx) => (
                      <div key={iidx} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                        {getStatusIcon(item.status)}
                        <span className={`flex-1 ${item.status === 'completed' ? 'text-gray-300' : 'text-white'}`}>
                          {item.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}