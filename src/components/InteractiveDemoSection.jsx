import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Eye, Zap, PlayCircle } from 'lucide-react';

export default function InteractiveDemoSection() {
  const [activeDemo, setActiveDemo] = useState('encryption');

  const demos = {
    encryption: {
      icon: Lock,
      title: "Quantum-Resistant Encryption",
      description: "See how our hybrid PQC key exchange protects your data against future quantum attacks",
      visual: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/584a72f27_quantum-encryption-visualization-with-glowing-part.jpg"
    },
    monitoring: {
      icon: Eye,
      title: "Real-Time Threat Detection",
      description: "Watch our AI-powered system identify and neutralize threats in milliseconds",
      visual: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/7e319a981_Whisk_429a6543b81e30d9bab4065457f3b62ddr.jpg"
    },
    blockchain: {
      icon: Shield,
      title: "Blockchain Verification",
      description: "Immutable audit trails that ensure complete data integrity and transparency",
      visual: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/9be80d6ca_Whisk_43831818b9d5e77953345c3626f3d976eg.jpg"
    },
    ai: {
      icon: Zap,
      title: "AI-Powered Security Analysis",
      description: "Machine learning algorithms that adapt and evolve with emerging threat patterns",
      visual: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/9774d266e_openai-logo-inspired-abstract.png"
    }
  };

  const currentDemo = demos[activeDemo];
  const DemoIcon = currentDemo.icon;

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Experience <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">GlyphLock</span> in Action
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Interactive demonstrations of our core security features
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {Object.entries(demos).map(([key, demo]) => {
              const Icon = demo.icon;
              return (
                <button
                  key={key}
                  onClick={() => setActiveDemo(key)}
                  className={`glass-royal p-4 rounded-xl border transition-all duration-300 ${
                    activeDemo === key
                      ? 'border-blue-500 bg-blue-500/20 scale-105'
                      : 'border-blue-500/30 hover:border-blue-500/50'
                  }`}
                >
                  <Icon className={`w-8 h-8 mx-auto mb-2 ${
                    activeDemo === key ? 'text-blue-400' : 'text-white/70'
                  }`} />
                  <div className={`text-sm font-medium ${
                    activeDemo === key ? 'text-white' : 'text-white/70'
                  }`}>
                    {demo.title.split(' ')[0]}
                  </div>
                </button>
              );
            })}
          </div>

          <Card className="glass-royal border-blue-500/30 overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2">
                <div className="relative h-80 md:h-96 overflow-hidden group">
                  <img
                    src={currentDemo.visual}
                    alt={currentDemo.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="bg-blue-500/80 hover:bg-blue-500 text-white p-6 rounded-full transition-all duration-300 hover:scale-110 glow-royal">
                      <PlayCircle className="w-12 h-12" />
                    </button>
                  </div>
                </div>

                <div className="p-8 flex flex-col justify-center glass-dark">
                  <div className="bg-blue-500/20 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                    <DemoIcon className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{currentDemo.title}</h3>
                  <p className="text-white/80 leading-relaxed mb-6">
                    {currentDemo.description}
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      <span className="text-white/80 text-sm">Live monitoring active</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                      <span className="text-white/80 text-sm">Quantum-resistant protocols enabled</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                      <span className="text-white/80 text-sm">AI analysis in progress</span>
                    </div>
                  </div>
                  <Button className="mt-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
                    Try This Feature
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}