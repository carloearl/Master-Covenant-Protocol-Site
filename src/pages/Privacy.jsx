import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Eye, Server, Bell } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Privacy <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Policy</span>
            </h1>
            <p className="text-gray-400">Last updated: October 20, 2025</p>
          </div>

          <Card className="bg-gray-900 border-gray-800 mb-8">
            <CardContent className="p-8 space-y-8">
              <p className="text-white">
                GlyphLock Security LLC ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our cybersecurity platform and services.
              </p>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Lock className="w-6 h-6 text-blue-400" />
                  1. Information We Collect
                </h2>
                
                <h3 className="text-xl font-semibold text-white mb-3 mt-6">1.1 Personal Information</h3>
                <p className="text-gray-300 mb-4">We collect information that you voluntarily provide to us when you:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-300 mb-4">
                  <li>Register for an account</li>
                  <li>Book a consultation</li>
                  <li>Subscribe to our newsletter</li>
                  <li>Contact us for support</li>
                  <li>Use our services (N.U.P.S., QR tools, security monitoring)</li>
                </ul>
                <p className="text-gray-300 mb-4">This may include: name, email address, phone number, company name, payment information, and any other information you choose to provide.</p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">1.2 Automatically Collected Information</h3>
                <p className="text-gray-300 mb-4">When you access our platform, we automatically collect:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-300 mb-4">
                  <li>Device information (IP address, browser type, operating system)</li>
                  <li>Usage data (pages visited, features used, time spent)</li>
                  <li>Location data (general geographic location)</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">1.3 Security Data</h3>
                <p className="text-gray-300">Our security monitoring systems collect threat intelligence, security events, and system logs necessary to protect your infrastructure and detect potential security breaches.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Eye className="w-6 h-6 text-blue-400" />
                  2. How We Use Your Information
                </h2>
                <p className="text-gray-300 mb-4">We use the collected information for:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>Providing and maintaining our cybersecurity services</li>
                  <li>Processing payments and transactions</li>
                  <li>Sending administrative information and service updates</li>
                  <li>Responding to your inquiries and providing customer support</li>
                  <li>Improving our services and developing new features</li>
                  <li>Detecting, preventing, and addressing security threats</li>
                  <li>Complying with legal obligations</li>
                  <li>Sending marketing communications (with your consent)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Server className="w-6 h-6 text-blue-400" />
                  3. Information Sharing and Disclosure
                </h2>
                <p className="text-gray-300 mb-4">We do not sell your personal information. We may share your information with:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li><strong>Service Providers:</strong> Third-party vendors who perform services on our behalf (e.g., payment processing, cloud hosting)</li>
                  <li><strong>Business Partners:</strong> With your consent, for joint offerings or promotions</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                  <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-blue-400" />
                  4. Data Security
                </h2>
                <p className="text-gray-300 mb-4">We implement industry-leading security measures to protect your information:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-300 mb-4">
                  <li>Quantum-resistant encryption for data in transit and at rest</li>
                  <li>Multi-factor authentication</li>
                  <li>Regular security audits and penetration testing</li>
                  <li>$14M liability coverage for security incidents</li>
                  <li>ISO 27001 certified security practices</li>
                  <li>Access controls and principle of least privilege</li>
                </ul>
                <p className="text-gray-300">However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security but maintain best-in-class protection standards.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">5. Your Privacy Rights</h2>
                <p className="text-gray-300 mb-4">Depending on your location, you may have the following rights:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-300 mb-4">
                  <li><strong>Access:</strong> Request access to your personal information</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate data</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                  <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                  <li><strong>Objection:</strong> Object to processing of your information</li>
                </ul>
                <p className="text-gray-300">To exercise these rights, contact us at privacy@glyphlock.com</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">6. Cookies and Tracking Technologies</h2>
                <p className="text-gray-300">We use cookies and similar technologies to enhance your experience, analyze usage patterns, and deliver personalized content. You can control cookies through your browser settings, but disabling cookies may limit functionality.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">7. Data Retention</h2>
                <p className="text-gray-300">We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. Security logs and threat intelligence data may be retained longer for security purposes.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Bell className="w-6 h-6 text-blue-400" />
                  10. Changes to This Privacy Policy
                </h2>
                <p className="text-gray-300">We may update this Privacy Policy periodically. We will notify you of material changes via email or prominent notice on our platform. Your continued use of our services after such modifications constitutes acceptance of the updated policy.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">11. Contact Us</h2>
                <p className="text-gray-300 mb-4">For questions about this Privacy Policy or our privacy practices, contact us:</p>
                <div className="bg-gray-800 p-6 rounded-lg space-y-2">
                  <p className="text-white font-semibold">GlyphLock Security LLC</p>
                  <p className="text-gray-300">El Mirage, Arizona</p>
                  <p className="text-gray-300">Email: privacy@glyphlock.com</p>
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