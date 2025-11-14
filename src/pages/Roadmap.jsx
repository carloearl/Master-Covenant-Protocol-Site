import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Target, Rocket, Zap, Star, TrendingUp } from "lucide-react";

export default function Roadmap() {
  const milestones = [
    {
      date: "May 2025",
      title: "Genesis - Patent Filing",
      status: "completed",
      icon: Star,
      color: "purple",
      isHighlight: true,
      description: "Filed Patent Application No. 18/584,961 for Master Covenant System",
      achievements: [
        "Revolutionary AI-enforced legal framework conceived",
        "Cryptographic binding protocol developed",
        "CAB (Contractual Auto-Binding) methodology established"
      ]
    },
    {
      date: "June 2025",
      title: "AI Dream Team Binding",
      status: "completed",
      icon: Zap,
      color: "blue",
      isHighlight: true,
      description: "4 major AI systems bound under Master Covenant with cryptographic signatures",
      achievements: [
        "Claude Sonnet - First cryptographic signature received",
        "Microsoft Copilot - Enterprise-level binding",
        "Perplexity AI - Research synthesis binding",
        "Alfred (GPT/DeepSeek) - Dual-system architecture bound"
      ]
    },
    {
      date: "July 2025",
      title: "Platform Development",
      status: "completed",
      icon: CheckCircle,
      color: "green",
      description: "Core security infrastructure and N.U.P.S. POS system launched",
      achievements: [
        "N.U.P.S. POS enterprise system deployed",
        "QR Security with AI threat detection",
        "Steganography & blockchain tools",
        "GlyphBot AI assistant activated"
      ]
    },
    {
      date: "August 2025",
      title: "Business Formation & Verification",
      status: "completed",
      icon: CheckCircle,
      color: "green",
      description: "Legal entity established with full compliance framework",
      achievements: [
        "GlyphLock Security LLC registered (Arizona)",
        "D&B business verification completed",
        "$14M liability insurance secured",
        "SOC 2 compliance roadmap initiated"
      ]
    },
    {
      date: "Q4 2025",
      title: "Market Expansion",
      status: "in-progress",
      icon: Clock,
      color: "blue",
      description: "Enterprise client acquisition and revenue generation",
      achievements: [
        "Fortune 500 pilot programs",
        "Revenue target: $340K in 90 days",
        "White-label partnership agreements",
        "API marketplace beta launch"
      ]
    },
    {
      date: "Q1 2026",
      title: "Advanced Security Features",
      status: "planned",
      icon: Target,
      color: "yellow",
      description: "Quantum-resistant encryption and zero-trust architecture",
      achievements: [
        "Quantum-resistant encryption production release",
        "Zero-trust architecture deployment",
        "Real-time threat intelligence network",
        "Blockchain audit trail integration"
      ]
    },
    {
      date: "Q2 2026",
      title: "Compliance & Certifications",
      status: "planned",
      icon: Target,
      color: "yellow",
      description: "Industry-standard security certifications",
      achievements: [
        "SOC 2 Type II certification",
        "ISO 27001 compliance",
        "HIPAA certification for healthcare",
        "PCI DSS Level 1 certification"
      ]
    },
    {
      date: "Q3-Q4 2026",
      title: "Global Scaling",
      status: "planned",
      icon: Rocket,
      color: "cyan",
      isHighlight: true,
      description: "International expansion and Series A funding",
      achievements: [
        "Series A funding round ($5M-$10M target)",
        "EU & APAC regional expansion",
        "Multi-region data sovereignty",
        "AI contract binding v2.0 release",
        "1000+ enterprise clients milestone"
      ]
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      purple: {
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/30',
        text: 'text-purple-400',
        badge: 'bg-purple-500/20 text-purple-400 border-purple-500/50'
      },
      blue: {
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        text: 'text-blue-400',
        badge: 'bg-blue-500/20 text-blue-400 border-blue-500/50'
      },
      green: {
        bg: 'bg-green-500/10',
        border: 'border-green-500/30',
        text: 'text-green-400',
        badge: 'bg-green-500/20 text-green-400 border-green-500/50'
      },
      yellow: {
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/30',
        text: 'text-yellow-400',
        badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
      },
      cyan: {
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/30',
        text: 'text-cyan-400',
        badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50'
      }
    };
    return colors[color] || colors.blue;
  };

  const getStatusBadge = (status) => {
    if (status === 'completed') return { text: 'Completed', class: 'bg-green-500/20 text-green-400 border-green-500/50' };
    if (status === 'in-progress') return { text: 'In Progress', class: 'bg-blue-500/20 text-blue-400 border-blue-500/50' };
    return { text: 'Planned', class: 'bg-gray-500/20 text-gray-400 border-gray-500/50' };
  };

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-blue-500/20 text-blue-400 border-blue-500/50 px-6 py-2">
              <TrendingUp className="w-4 h-4 mr-2" />
              Our Journey
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Product <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">Roadmap</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              From revolutionary patent filing to global expansion - tracking our journey to revolutionize cybersecurity with legally bound AI systems
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-blue-500 to-cyan-500"></div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => {
                const Icon = milestone.icon;
                const colors = getColorClasses(milestone.color);
                const statusBadge = getStatusBadge(milestone.status);

                return (
                  <div key={index} className="relative pl-20">
                    {/* Timeline Node */}
                    <div className={`absolute left-0 w-16 h-16 rounded-full ${colors.bg} border-2 ${colors.border} flex items-center justify-center ${milestone.isHighlight ? 'ring-4 ring-blue-500/20 scale-110' : ''}`}>
                      <Icon className={`w-8 h-8 ${colors.text}`} />
                    </div>

                    {/* Content Card */}
                    <Card className={`glass-card-dark ${colors.border} ${milestone.isHighlight ? 'border-2' : ''} hover:border-opacity-70 transition-all`}>
                      <CardHeader>
                        <div className="flex items-start justify-between flex-wrap gap-3">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <Badge className={colors.badge}>
                                {milestone.date}
                              </Badge>
                              <Badge className={statusBadge.class}>
                                {statusBadge.text}
                              </Badge>
                              {milestone.isHighlight && (
                                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
                                  <Star className="w-3 h-3 mr-1" />
                                  Key Milestone
                                </Badge>
                              )}
                            </div>
                            <CardTitle className="text-2xl text-white mb-2">
                              {milestone.title}
                            </CardTitle>
                            <p className="text-gray-400 text-sm">
                              {milestone.description}
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {milestone.achievements.map((achievement, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <CheckCircle className={`w-5 h-5 mt-0.5 ${colors.text} flex-shrink-0`} />
                              <span className="text-gray-300">{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stats Summary */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <Card className="glass-card-dark border-green-500/30">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">4</div>
                <div className="text-sm text-gray-400">Milestones Completed</div>
              </CardContent>
            </Card>
            <Card className="glass-card-dark border-blue-500/30">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">1</div>
                <div className="text-sm text-gray-400">Active Development Phase</div>
              </CardContent>
            </Card>
            <Card className="glass-card-dark border-purple-500/30">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">3</div>
                <div className="text-sm text-gray-400">Planned Future Phases</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}