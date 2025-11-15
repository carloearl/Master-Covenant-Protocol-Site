import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Eye, Database } from "lucide-react";

export default function Privacy() {
  const sections = [
    {
      icon: Database,
      title: "Data Collection",
      content: "We collect only essential information needed to provide our services: email, name, and usage data. We never sell your data to third parties."
    },
    {
      icon: Lock,
      title: "Data Security",
      content: "All data is encrypted using AES-256 encryption at rest and in transit. We maintain SOC 2 compliance and follow industry best practices."
    },
    {
      icon: Eye,
      title: "Data Usage",
      content: "We use your data solely to provide and improve our services. Analytics data is anonymized and aggregated."
    },
    {
      icon: Shield,
      title: "Your Rights",
      content: "You have the right to access, modify, or delete your data at any time. Contact us at glyphlock@gmail.com for data requests."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Privacy <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Policy</span>
            </h1>
            <p className="text-gray-400">Last updated: May 2025</p>
          </div>

          <div className="space-y-6 mb-12">
            {sections.map((section, idx) => {
              const Icon = section.icon;
              return (
                <Card key={idx} className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-blue-400" />
                      </div>
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 leading-relaxed">{section.content}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-700/10 border-blue-500/30">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-white mb-4">Questions?</h3>
              <p className="text-gray-300 mb-4">
                If you have any questions about our privacy policy, please contact us at{" "}
                <a href="mailto:glyphlock@gmail.com" className="text-blue-400 hover:text-blue-300">
                  glyphlock@gmail.com
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}