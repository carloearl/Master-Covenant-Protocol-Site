import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Shield, CreditCard, AlertTriangle } from "lucide-react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Terms of <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Service</span>
            </h1>
            <p className="text-gray-400">Last updated: October 20, 2025</p>
          </div>

          <Card className="bg-gray-900 border-gray-800 mb-8">
            <CardContent className="p-8 space-y-8">
              <p className="text-white">
                These Terms of Service ("Terms") govern your access to and use of GlyphLock Security LLC's ("GlyphLock," "we," "us," or "our") cybersecurity platform, services, and products. By accessing or using our services, you agree to be bound by these Terms.
              </p>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-300 mb-4">
                  By creating an account, accessing our platform, or using any of our services (including Master Covenant System, N.U.P.S. platform, QR tools, security monitoring, and consultation services), you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.
                </p>
                <p className="text-gray-300">
                  If you are using our services on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-blue-400" />
                  2. Services Description
                </h2>
                
                <h3 className="text-xl font-semibold text-white mb-3 mt-6">2.1 Master Covenant System</h3>
                <p className="text-gray-300 mb-4">Our pioneering AI-contract binding technology that legally binds 5 AI systems to enforceable contracts with cryptographic proof, quantum-resistant encryption, and automated compliance monitoring.</p>

                <h3 className="text-xl font-semibold text-white mb-3">2.2 N.U.P.S. Platform</h3>
                <p className="text-gray-300 mb-4">Navigate United Platform System - a three-tier POS portal management system with admin, manager, and user access levels, real-time analytics, and payment processing integration.</p>

                <h3 className="text-xl font-semibold text-white mb-3">2.3 Security Monitoring</h3>
                <p className="text-gray-300 mb-4">Real-time threat detection, system health monitoring, and comprehensive security event tracking powered by the Master Covenant System.</p>

                <h3 className="text-xl font-semibold text-white mb-3">2.4 QR Tools & Hotzone Mapping</h3>
                <p className="text-gray-300">Secure QR code generation, management, and interactive hotzone image mapping tools for enterprise applications.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">3. Account Registration and Security</h2>
                <p className="text-gray-300 mb-4">To access certain features, you must create an account. You agree to:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-300 mb-4">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and promptly update your account information</li>
                  <li>Maintain the security of your password and account</li>
                  <li>Immediately notify us of any unauthorized access or security breach</li>
                  <li>Accept responsibility for all activities under your account</li>
                </ul>
                <p className="text-gray-300">We reserve the right to suspend or terminate accounts that violate these Terms or pose security risks to our platform or other users.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-blue-400" />
                  4. Payment Terms
                </h2>
                <p className="text-gray-300 mb-4">Pricing for our services:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-300 mb-4">
                  <li>Master Covenant: $2,500 per project</li>
                  <li>N.U.P.S. Platform: $5,000 per implementation</li>
                  <li>Full-stack Development: $3,500</li>
                  <li>UI/UX Design: $2,000</li>
                  <li>Data Security Solutions: $4,000</li>
                  <li>Comprehensive Package: $10,000</li>
                </ul>
                <p className="text-gray-300 mb-4">Payment terms:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>All payments are processed securely through Stripe</li>
                  <li>Consultation fees must be paid in advance of scheduled services</li>
                  <li>Subscription services are billed monthly or annually as selected</li>
                  <li>Refunds are provided in accordance with our refund policy</li>
                  <li>We reserve the right to modify pricing with 30 days' notice</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-yellow-400" />
                  5. Acceptable Use Policy
                </h2>
                <p className="text-gray-300 mb-4">You agree NOT to use our services to:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe on intellectual property rights</li>
                  <li>Transmit malware, viruses, or harmful code</li>
                  <li>Attempt to gain unauthorized access to our systems or other users' data</li>
                  <li>Reverse engineer, decompile, or attempt to extract source code</li>
                  <li>Use automated systems to access our services without authorization</li>
                  <li>Interfere with or disrupt the integrity or performance of our services</li>
                  <li>Engage in fraudulent activities or misrepresent your identity</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">8. Liability and Insurance</h2>
                <p className="text-gray-300 mb-4">GlyphLock maintains $14 million in liability coverage for security incidents and data breaches. Our coverage includes:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-300 mb-4">
                  <li>Cyber liability insurance for data breaches</li>
                  <li>Professional liability for service delivery</li>
                  <li>Errors and omissions coverage</li>
                  <li>Third-party liability protection</li>
                </ul>
                <p className="text-gray-300">However, to the maximum extent permitted by law, GlyphLock shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, use, or goodwill.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">15. Contact Information</h2>
                <p className="text-gray-300 mb-4">For questions about these Terms of Service, contact:</p>
                <div className="bg-gray-800 p-6 rounded-lg space-y-2">
                  <p className="text-white font-semibold">GlyphLock Security LLC</p>
                  <p className="text-gray-300">El Mirage, Arizona</p>
                  <p className="text-gray-300">Email: legal@glyphlock.com</p>
                  <p className="text-gray-300">Support: support@glyphlock.com</p>
                  <p className="text-gray-300">Phone: (424) 246-6499</p>
                  <p className="text-gray-300">Web: <a href="https://www.glyphlock.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">www.glyphlock.com</a></p>
                </div>
              </section>
            </CardContent>
          </Card>

          <div className="text-center">
            <Link to={createPageUrl("Home")}>
              <span className="text-blue-400 hover:text-blue-300 transition-colors">← Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}