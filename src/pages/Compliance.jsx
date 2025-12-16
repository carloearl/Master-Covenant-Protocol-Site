import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, FileText, CheckCircle2, AlertTriangle } from "lucide-react";
import SEOHead from "@/components/SEOHead";

export default function Compliance() {
  const compliancePrograms = [
    {
      standard: "SOC 2 Type II",
      status: "Program In Place",
      icon: FileText,
      color: "text-blue-400",
      description: "System and Organization Controls audit covering security, availability, processing integrity, confidentiality, and privacy.",
      controls: [
        "Access controls and multi-factor authentication",
        "Encryption at rest and in transit (AES-256)",
        "Continuous security monitoring",
        "Incident response procedures",
        "Regular security assessments"
      ]
    },
    {
      standard: "ISO 27001",
      status: "Standards Met",
      icon: Shield,
      color: "text-purple-400",
      description: "International standard for information security management systems (ISMS).",
      controls: [
        "Risk assessment methodology",
        "Security policy framework",
        "Asset management procedures",
        "Access control policies",
        "Business continuity planning"
      ]
    },
    {
      standard: "PCI DSS",
      status: "Standards Met",
      icon: Lock,
      color: "text-green-400",
      description: "Payment Card Industry Data Security Standard for secure payment processing.",
      controls: [
        "Secure network architecture",
        "Cardholder data protection",
        "Vulnerability management program",
        "Strong access control measures",
        "Regular security testing"
      ]
    },
    {
      standard: "GDPR",
      status: "Compliant",
      icon: Shield,
      color: "text-cyan-400",
      description: "EU General Data Protection Regulation compliance program.",
      controls: [
        "Data processing agreements",
        "Privacy by design principles",
        "User consent management",
        "Data subject rights procedures",
        "Breach notification protocols"
      ]
    },
    {
      standard: "HIPAA",
      status: "Compliant",
      icon: Lock,
      color: "text-indigo-400",
      description: "Health Insurance Portability and Accountability Act compliance program.",
      controls: [
        "Business Associate Agreements (BAAs)",
        "PHI encryption and access controls",
        "Audit logging and monitoring",
        "Security risk assessments",
        "Workforce training programs"
      ]
    }
  ];

  return (
    <div className="min-h-screen text-white pt-20 pb-16" style={{ background: 'transparent' }}>
      <SEOHead 
        title="Compliance & Security Standards - GlyphLock"
        description="Detailed compliance documentation for SOC 2, ISO 27001, PCI DSS, GDPR, and HIPAA standards"
        url="/compliance"
      />

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Compliance & Security Standards
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            GlyphLock maintains comprehensive security and compliance programs 
            aligned with industry-leading standards.
          </p>
        </div>

        {/* Verification Notice */}
        <Card className="glyph-glass-card border-yellow-500/50 mb-12">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-yellow-400 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Certification Verification</h3>
                <p className="text-sm text-slate-300 mb-4">
                  This page documents GlyphLock's security and compliance programs. 
                  Official certification verification is available upon request.
                </p>
                <p className="text-sm text-slate-400">
                  For audit reports or certification verification, contact:{" "}
                  <a href="mailto:glyphlock@gmail.com" className="text-blue-400 hover:underline">
                    glyphlock@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Programs */}
        <div className="space-y-8">
          {compliancePrograms.map((program, idx) => {
            const Icon = program.icon;
            return (
              <Card key={idx} className="glyph-glass-card card-elevated-hover">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <Icon className={`w-10 h-10 ${program.color}`} />
                      <div>
                        <CardTitle className="text-2xl text-white">{program.standard}</CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                          <span className="text-sm text-green-400 font-semibold">{program.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 mb-6">{program.description}</p>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">
                      Security Controls
                    </h4>
                    <ul className="space-y-2">
                      {program.controls.map((control, cidx) => (
                        <li key={cidx} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-slate-300">{control}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Security Information */}
        <Card className="glyph-glass-card mt-12">
          <CardHeader>
            <CardTitle className="text-white">Security Infrastructure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-bold text-white mb-2">Encryption Standards</h4>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• AES-256 encryption at rest</li>
                  <li>• TLS 1.3 for data in transit</li>
                  <li>• Post-quantum cryptography ready</li>
                  <li>• Hardware security module (HSM) integration</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-2">Access Controls</h4>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Multi-factor authentication (MFA)</li>
                  <li>• Role-based access control (RBAC)</li>
                  <li>• Session management and monitoring</li>
                  <li>• Privileged access management</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-2">Monitoring & Response</h4>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• 24/7 security operations center</li>
                  <li>• Real-time threat detection</li>
                  <li>• Automated incident response</li>
                  <li>• Comprehensive audit logging</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-2">Testing & Validation</h4>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Penetration testing (quarterly)</li>
                  <li>• Vulnerability assessments</li>
                  <li>• Third-party security audits</li>
                  <li>• Continuous compliance monitoring</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact for Verification */}
        <Card className="glyph-glass-card mt-12 border-blue-500/50">
          <CardContent className="pt-6">
            <div className="text-center">
              <Shield className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">
                Request Compliance Documentation
              </h3>
              <p className="text-sm text-slate-300 mb-6 max-w-2xl mx-auto">
                Official audit reports, certification letters, and detailed security documentation 
                are available to qualified parties under NDA.
              </p>
              <a
                href="mailto:glyphlock@gmail.com?subject=Compliance Documentation Request"
                className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Request Documentation
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}