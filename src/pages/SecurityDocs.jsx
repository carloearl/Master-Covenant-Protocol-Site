import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Key, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SecurityDocs() {
  const docs = [
    {
      icon: Shield,
      title: "Encryption Standards",
      description: "We use AES-256 encryption for data at rest and TLS 1.3 for data in transit. All cryptographic operations follow NIST standards.",
      badge: "AES-256"
    },
    {
      icon: Key,
      title: "Authentication",
      description: "Multi-factor authentication, OAuth 2.0, and JWT tokens with secure key rotation every 30 days.",
      badge: "MFA Enabled"
    },
    {
      icon: Lock,
      title: "Data Protection",
      description: "All user data is encrypted, backed up daily, and stored in SOC 2 compliant data centers with 99.99% uptime SLA.",
      badge: "SOC 2"
    },
    {
      icon: FileText,
      title: "Compliance",
      description: "GDPR compliant, CCPA ready, and working towards ISO 27001 certification. Regular third-party security audits.",
      badge: "GDPR"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Security <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Documentation</span>
            </h1>
            <p className="text-xl text-gray-400">
              Transparency in our security practices
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {docs.map((doc, idx) => {
              const Icon = doc.icon;
              return (
                <Card key={idx} className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <Icon className="w-6 h-6 text-blue-400" />
                        </div>
                        <CardTitle className="text-white text-lg">{doc.title}</CardTitle>
                      </div>
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                        {doc.badge}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 leading-relaxed">{doc.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-700/10 border-blue-500/30">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Security Reporting</h3>
              <p className="text-gray-300 mb-4">
                Found a security vulnerability? We take security seriously and appreciate responsible disclosure.
              </p>
              <p className="text-gray-300">
                Report security issues to:{" "}
                <a href="mailto:security@glyphlock.com" className="text-blue-400 hover:text-blue-300 font-semibold">
                  security@glyphlock.com
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}