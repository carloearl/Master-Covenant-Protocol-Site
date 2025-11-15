import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Terms() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing and using GlyphLock services, you accept and agree to be bound by these terms and conditions."
    },
    {
      title: "2. Service Description",
      content: "GlyphLock provides cybersecurity tools and services including visual cryptography, blockchain security, AI assistance, and security operations monitoring."
    },
    {
      title: "3. User Obligations",
      content: "You agree to use our services lawfully and not to engage in activities that could harm our systems or other users. You are responsible for maintaining the confidentiality of your account."
    },
    {
      title: "4. Intellectual Property",
      content: "All GlyphLock technology, including the Master Covenant, software, and documentation, is protected by intellectual property laws and the CAB framework. Unauthorized use is prohibited."
    },
    {
      title: "5. Limitation of Liability",
      content: "GlyphLock is provided 'as is' without warranties. We are not liable for indirect, incidental, or consequential damages arising from service use."
    },
    {
      title: "6. Termination",
      content: "We reserve the right to terminate or suspend access to our services at any time for violations of these terms."
    },
    {
      title: "7. Governing Law",
      content: "These terms are governed by the laws of Arizona, United States. Disputes will be resolved in Arizona courts."
    },
    {
      title: "8. Changes to Terms",
      content: "We may modify these terms at any time. Continued use of our services constitutes acceptance of modified terms."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Terms of <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Service</span>
            </h1>
            <p className="text-gray-400">Last updated: May 2025</p>
          </div>

          <div className="space-y-6">
            {sections.map((section, idx) => (
              <Card key={idx} className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white text-lg">{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">{section.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-700/10 border-blue-500/30 mt-12">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-white mb-4">Contact Us</h3>
              <p className="text-gray-300">
                For questions about these terms, contact us at{" "}
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