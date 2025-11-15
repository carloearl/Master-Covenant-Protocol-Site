import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Target, Users, Zap } from "lucide-react";

export default function About() {
  const values = [
    {
      icon: Shield,
      title: "Security First",
      description: "Every decision we make prioritizes the security and privacy of our clients"
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Pushing the boundaries of cybersecurity with cutting-edge technology"
    },
    {
      icon: Users,
      title: "Client Success",
      description: "Your success is our success. We're committed to your digital safety"
    },
    {
      icon: Target,
      title: "Excellence",
      description: "We maintain the highest standards in every aspect of our work"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">GlyphLock</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Pioneering quantum-resistant cybersecurity solutions for the digital age
            </p>
          </div>

          <Card className="bg-gray-900 border-gray-800 mb-12">
            <CardContent className="p-8">
              <div className="prose prose-invert max-w-none">
                <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Founded in May 2025 in El Mirage, Arizona, GlyphLock Security LLC emerged from a vision to create 
                  next-generation cybersecurity tools that combine quantum-resistant encryption with artificial intelligence.
                </p>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Our flagship technologies include the GlyphLock Master Covenant (Patent App. No. 18/584,961), 
                  a revolutionary legal framework that binds AI systems through Contractual Auto-Binding (CAB), 
                  and our comprehensive suite of security tools designed for enterprise-level protection.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  We believe that security should be accessible, intelligent, and adaptive. That's why we've built 
                  an ecosystem of integrated tools that work together to protect your digital assets against both 
                  current and future threats.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-white mb-12">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {values.map((value, idx) => {
                const Icon = value.icon;
                return (
                  <Card key={idx} className="bg-gray-900 border-gray-800">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
                          <p className="text-gray-400">{value.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-700/10 border-blue-500/30">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Work Together?
              </h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Let's discuss how GlyphLock can protect your organization
              </p>
              <Link to={createPageUrl("Consultation")}>
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700">
                  Schedule a Consultation
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}