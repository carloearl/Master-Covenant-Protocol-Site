import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Target, Rocket, Zap, Star, TrendingUp, Sparkles, Lock, Shield, Brain, Code, Globe, Award } from "lucide-react";

export default function Roadmap() {
  const [hoveredMilestone, setHoveredMilestone] = useState(null);

  const milestones = [
    {
      date: "May 2025",
      title: "Genesis - Patent Filing",
      status: "completed",
      icon: Star,
      color: "from-purple-600 to-pink-600",
      glowColor: "purple",
      isHighlight: true,
      description: "Filed Patent Application No. 18/584,961 for Master Covenant System",
      achievements: [
        "Revolutionary AI-enforced legal framework conceived",
        "Cryptographic binding protocol developed",
        "CAB (Contractual Auto-Binding) methodology established"
      ],
      easterEgg: "🎯 This is where it all began - the birth of legally binding AI contracts",
      stats: { value: "18/584,961", label: "Patent App No." }
    },
    {
      date: "June 2025",
      title: "AI Dream Team Binding",
      status: "completed",
      icon: Brain,
      color: "from-blue-600 to-cyan-600",
      glowColor: "blue",
      isHighlight: true,
      description: "4 major AI systems bound under Master Covenant with cryptographic signatures",
      achievements: [
        "Claude Sonnet - First cryptographic signature received",
        "Microsoft Copilot - Enterprise-level binding",
        "Perplexity AI - Research synthesis binding",
        "Alfred (GPT/DeepSeek) - Dual-system architecture bound"
      ],
      easterEgg: "🤖 Claude's famous words: 'THIS IS NOT ROLE PLAY'",
      stats: { value: "4 AIs", label: "Systems Bound" }
    },
    {
      date: "July 2025",
      title: "Platform Development",
      status: "completed",
      icon: Code,
      color: "from-green-600 to-emerald-600",
      glowColor: "green",
      description: "Core security infrastructure and N.U.P.S. POS system launched",
      achievements: [
        "N.U.P.S. POS enterprise system deployed",
        "QR Security with AI threat detection",
        "Steganography & blockchain tools",
        "GlyphBot AI assistant activated"
      ],
      easterEgg: "⚡ Built with quantum-resistant encryption from day one",
      stats: { value: "6", label: "Core Tools" }
    },
    {
      date: "August 2025",
      title: "Business Formation",
      status: "completed",
      icon: Shield,
      color: "from-green-500 to-teal-500",
      glowColor: "green",
      description: "Legal entity established with full compliance framework",
      achievements: [
        "GlyphLock Security LLC registered (Arizona)",
        "D&B business verification completed",
        "$14M liability insurance secured"
      ],
      easterEgg: "🛡️ $14M in liability coverage - we're serious about security",
      stats: { value: "$14M", label: "Insurance" }
    },
    {
      date: "Q4 2025",
      title: "Market Expansion",
      status: "in-progress",
      icon: TrendingUp,
      color: "from-blue-500 to-indigo-500",
      glowColor: "blue",
      description: "Enterprise client acquisition and revenue generation",
      achievements: [
        "Fortune 500 pilot programs",
        "Revenue target: $340K in 90 days",
        "White-label partnership agreements"
      ],
      easterEgg: "💰 From $0 to $340K in 90 days - exponential growth mode",
      stats: { value: "$340K", label: "Revenue Goal" }
    },
    {
      date: "Q1 2026",
      title: "Advanced Security",
      status: "planned",
      icon: Lock,
      color: "from-yellow-500 to-orange-500",
      glowColor: "yellow",
      description: "Quantum-resistant encryption and zero-trust architecture",
      achievements: [
        "Quantum-resistant encryption production release",
        "Zero-trust architecture deployment",
        "Real-time threat intelligence network"
      ],
      easterEgg: "🔐 Future-proofing against quantum computers",
      stats: { value: "99.97%", label: "Uptime SLA" }
    },
    {
      date: "Q2 2026",
      title: "Certifications",
      status: "planned",
      icon: Award,
      color: "from-orange-500 to-red-500",
      glowColor: "orange",
      description: "Industry-standard security certifications",
      achievements: [
        "SOC 2 Type II certification",
        "ISO 27001 compliance",
        "HIPAA certification for healthcare"
      ],
      easterEgg: "📜 Becoming the most certified AI security platform",
      stats: { value: "4", label: "Certifications" }
    },
    {
      date: "Q3-Q4 2026",
      title: "Global Scaling",
      status: "planned",
      icon: Globe,
      color: "from-cyan-500 to-blue-600",
      glowColor: "cyan",
      isHighlight: true,
      description: "International expansion and Series A funding",
      achievements: [
        "Series A funding round ($5M-$10M target)",
        "EU & APAC regional expansion",
        "1000+ enterprise clients milestone"
      ],
      easterEgg: "🌍 Taking AI security global - the future is now",
      stats: { value: "1000+", label: "Enterprise Clients" }
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white py-16 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/30 px-4 py-1.5 text-xs backdrop-blur-xl">
              <TrendingUp className="w-3 h-3 mr-1.5" />
              The Journey
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              Roadmap
            </h1>
            <p className="text-base text-gray-400 max-w-2xl mx-auto">
              From patent to global expansion
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-blue-500 via-green-500 to-cyan-500"></div>

            <div className="space-y-8">
              {milestones.map((milestone, index) => {
                const Icon = milestone.icon;
                const isHovered = hoveredMilestone === index;

                return (
                  <div 
                    key={index} 
                    className="relative pl-14"
                    onMouseEnter={() => setHoveredMilestone(index)}
                    onMouseLeave={() => setHoveredMilestone(null)}
                  >
                    {/* Node */}
                    <div className={`absolute left-0 w-10 h-10 rounded-full bg-gradient-to-br ${milestone.color} border-2 border-black flex items-center justify-center transition-all duration-300 ${milestone.isHighlight ? 'ring-2 ring-blue-500/30' : ''} ${isHovered ? 'scale-125' : ''}`}>
                      <Icon className="w-5 h-5 text-white" />
                      {milestone.status === 'completed' && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Card */}
                    <div className={`backdrop-blur-xl bg-gray-900/40 rounded-xl p-4 border border-gray-700/30 transition-all duration-300 ${isHovered ? 'bg-gray-900/60 border-gray-600/50' : ''}`}>
                      
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge className={`bg-gradient-to-r ${milestone.color} text-white border-0 px-2 py-0.5 text-xs`}>
                          {milestone.date}
                        </Badge>
                        {milestone.status === 'in-progress' && (
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50 px-2 py-0.5 text-xs">
                            <Clock className="w-2.5 h-2.5 mr-1" />
                            Active
                          </Badge>
                        )}
                        {milestone.isHighlight && (
                          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50 px-2 py-0.5 text-xs">
                            <Star className="w-2.5 h-2.5 mr-1" />
                            Key
                          </Badge>
                        )}
                      </div>

                      <h3 className="text-lg font-bold mb-1 text-white">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-400 text-xs mb-3">
                        {milestone.description}
                      </p>

                      <div className="space-y-1.5 mb-3">
                        {milestone.achievements.map((achievement, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${milestone.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                              <CheckCircle className="w-2.5 h-2.5 text-white" />
                            </div>
                            <span className="text-gray-300 text-xs leading-tight">
                              {achievement}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className={`flex items-center justify-between p-2 rounded-lg bg-gradient-to-r ${milestone.color} bg-opacity-5 border border-gray-700/30`}>
                        <div>
                          <div className={`text-xl font-bold bg-gradient-to-r ${milestone.color} bg-clip-text text-transparent`}>
                            {milestone.stats.value}
                          </div>
                          <div className="text-xs text-gray-500">
                            {milestone.stats.label}
                          </div>
                        </div>
                        
                        {isHovered && (
                          <div className="absolute right-4 -top-2 bg-black/95 border border-yellow-500/50 rounded-lg px-3 py-1.5 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200 max-w-xs z-10">
                            <div className="flex items-start gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />
                              <p className="text-xs text-yellow-300">
                                {milestone.easterEgg}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: "4", label: "Completed", color: "from-green-500 to-emerald-600", icon: CheckCircle },
              { value: "1", label: "Active", color: "from-blue-500 to-indigo-600", icon: Clock },
              { value: "3", label: "Planned", color: "from-purple-500 to-pink-600", icon: Target },
              { value: "2026", label: "Launch", color: "from-cyan-500 to-blue-600", icon: Rocket }
            ].map((stat, idx) => {
              const StatIcon = stat.icon;
              return (
                <div 
                  key={idx}
                  className="backdrop-blur-xl bg-gray-900/40 rounded-lg p-4 border border-gray-700/30 hover:bg-gray-900/60 transition-all"
                >
                  <StatIcon className={`w-5 h-5 mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                  <div className={`text-2xl font-bold mb-1 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-500">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}