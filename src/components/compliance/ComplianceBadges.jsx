import React from "react";
import { Shield, Lock, CheckCircle2, FileCheck, Award } from "lucide-react";
import { Card } from "@/components/ui/card";

/**
 * GLYPHLOCK COMPLIANCE BADGES
 * 
 * CRITICAL LEGAL NOTICE:
 * - SOC 2, ISO 27001, PCI DSS badges require active certifications
 * - GDPR and HIPAA have NO official badges (text-based implementation)
 * - CEO must verify all certifications before public display
 * 
 * To use official badges:
 * 1. Place official badge files in /public/badges/
 * 2. Replace ComplianceBadge with <img> tags
 * 3. Update certification_verified to true
 */

const ComplianceBadge = ({ icon: Icon, title, subtitle, color, verified = false }) => (
  <Card className="glyph-glass-card p-6 flex flex-col items-center gap-3 hover:scale-105 transition-transform">
    <div className={`w-20 h-20 rounded-full ${color} flex items-center justify-center`}>
      <Icon className="w-10 h-10 text-white" />
    </div>
    <div className="text-center">
      <div className="text-sm font-black text-white uppercase tracking-wider">{title}</div>
      <div className="text-xs text-slate-400 mt-1">{subtitle}</div>
      {verified && (
        <div className="flex items-center justify-center gap-1 mt-2">
          <CheckCircle2 className="w-3 h-3 text-green-400" />
          <span className="text-xs text-green-400">Verified</span>
        </div>
      )}
    </div>
  </Card>
);

export default function ComplianceBadges({ showVerificationWarning = true }) {
  // CRITICAL: Set to true only after CEO confirms active certifications
  const certifications = {
    soc2: { verified: false, inProgress: true },
    iso27001: { verified: false, inProgress: true },
    pciDss: { verified: false, inProgress: true },
    gdpr: { verified: true, inProgress: false }, // Compliance program (not certification)
    hipaa: { verified: true, inProgress: false }  // Compliance program (not certification)
  };

  return (
    <section className="py-16 relative" style={{ background: 'transparent' }}>
      <div className="container mx-auto px-4">
        {/* Warning Banner - Remove after verification */}
        {showVerificationWarning && (
          <div className="mb-8 p-4 bg-yellow-500/10 border-2 border-yellow-500/50 rounded-lg">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <div className="text-sm font-bold text-yellow-300 mb-1">
                  ⚠️ COMPLIANCE VERIFICATION REQUIRED
                </div>
                <div className="text-xs text-yellow-200">
                  CEO must verify active certifications before public display. 
                  Currently showing compliance programs in place.
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Enterprise-Grade Security Standards
          </h2>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            GlyphLock maintains comprehensive security and compliance programs 
            aligned with industry-leading standards for credentialed integrity systems.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
          {/* SOC 2 Type II */}
          <ComplianceBadge
            icon={FileCheck}
            title="SOC 2"
            subtitle={certifications.soc2.verified ? "Type II Certified" : "Program In Place"}
            color="bg-gradient-to-br from-blue-600 to-blue-800"
            verified={certifications.soc2.verified}
          />

          {/* ISO 27001 */}
          <ComplianceBadge
            icon={Award}
            title="ISO 27001"
            subtitle={certifications.iso27001.verified ? "Certified" : "Standards Met"}
            color="bg-gradient-to-br from-purple-600 to-purple-800"
            verified={certifications.iso27001.verified}
          />

          {/* PCI DSS */}
          <ComplianceBadge
            icon={Lock}
            title="PCI DSS"
            subtitle={certifications.pciDss.verified ? "Compliant" : "Standards Met"}
            color="bg-gradient-to-br from-green-600 to-green-800"
            verified={certifications.pciDss.verified}
          />

          {/* GDPR - No official badge exists */}
          <ComplianceBadge
            icon={Shield}
            title="GDPR"
            subtitle="Compliant"
            color="bg-gradient-to-br from-cyan-600 to-cyan-800"
            verified={certifications.gdpr.verified}
          />

          {/* HIPAA - No official badge exists */}
          <ComplianceBadge
            icon={Lock}
            title="HIPAA"
            subtitle="Compliant"
            color="bg-gradient-to-br from-indigo-600 to-indigo-800"
            verified={certifications.hipaa.verified}
          />
        </div>

        {/* Compliance Documentation Link */}
        <div className="text-center">
          <a
            href="/compliance"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold transition-colors"
          >
            View Detailed Compliance Documentation
            <CheckCircle2 className="w-4 h-4" />
          </a>
        </div>

        {/* Legal Disclaimer */}
        <div className="mt-12 p-6 bg-slate-900/50 border border-slate-700/50 rounded-lg">
          <p className="text-xs text-slate-400 text-center leading-relaxed">
            GlyphLock Security LLC maintains comprehensive security and compliance programs. 
            Compliance status is subject to ongoing audits and assessments. 
            For official certification verification, contact{" "}
            <a href="mailto:glyphlock@gmail.com" className="text-blue-400 hover:underline">
              glyphlock@gmail.com
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * OFFICIAL BADGE INTEGRATION INSTRUCTIONS:
 * 
 * Once certifications are verified:
 * 
 * 1. Download official badges:
 *    - SOC 2: https://us.aicpa.org/ (AICPA official seal)
 *    - ISO 27001: From certification body (BSI, DNV, SGS, etc.)
 *    - PCI DSS: https://www.pcisecuritystandards.org/
 * 
 * 2. Save badges to public directory:
 *    /public/badges/soc2-type2-official.svg
 *    /public/badges/iso27001-certified.svg
 *    /public/badges/pci-dss-compliant.svg
 * 
 * 3. Replace ComplianceBadge components with:
 *    <img 
 *      src="/badges/soc2-type2-official.svg" 
 *      alt="SOC 2 Type II Certified"
 *      className="w-24 h-24 grayscale hover:grayscale-0 transition-all"
 *    />
 * 
 * 4. Update certification_verified flags to true
 * 
 * 5. Remove verification warning banner
 */