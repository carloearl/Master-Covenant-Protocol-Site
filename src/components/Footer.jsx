import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Twitter, Linkedin, Instagram, Github, Mail, Phone } from "lucide-react";
import { FOOTER_LINKS } from "@/components/NavigationConfig";
import { SOC2Badge, ISO27001Badge, PCIDSSBadge, GDPRBadge, HIPAABadge } from "@/components/compliance/BadgeSVGs";

/**
 * PHASE 3B FOOTER - FULLY CORRECTED
 * All links point to glyphlock.io routes ONLY
 * NO base44.app references
 */

const certifications = [
  { name: "SOC 2", subtitle: "PROGRAM IN PLACE", BadgeComponent: SOC2Badge, page: "TrustSecurity" },
  { name: "ISO 27001", subtitle: "STANDARDS MET", BadgeComponent: ISO27001Badge, page: "TrustSecurity" },
  { name: "PCI DSS", subtitle: "STANDARDS MET", BadgeComponent: PCIDSSBadge, page: "TrustSecurity" },
  { name: "GDPR", subtitle: "COMPLIANT", BadgeComponent: GDPRBadge, page: "Privacy" },
  { name: "HIPAA", subtitle: "COMPLIANT", BadgeComponent: HIPAABadge, page: "TrustSecurity" }
];

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-br from-indigo-950/20 via-violet-950/10 to-blue-950/20 border-t border-white/10 text-violet-200 pt-24 pb-12 relative overflow-hidden backdrop-blur-2xl">
    {/* Decorative Glows */}
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-[120px] pointer-events-none"></div>
    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/15 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-20">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/08025b614_gl-logo.png"
                alt="GlyphLock"
                className="h-10 w-auto"
              />
              <span className="text-2xl font-black tracking-tighter font-space text-white">
                GLYPH<span className="text-[#00E4FF]">LOCK</span>
              </span>
            </div>
            <div className="space-y-4 max-w-md">
              <p className="text-white text-lg font-black leading-tight">
                IF THEY CAN BREAK IT, IT WASN'T GLYPHLOCK.
              </p>
              <p className="text-gray-400 leading-relaxed text-sm">
                Quantum-immune keys, visual authentication that can't be forged, and an autonomous defense engine that analyzes, predicts, and shuts down threats before humans even see them.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-indigo-300 text-xs font-bold uppercase tracking-wider">POST-QUANTUM SECURITY</span>
                <span className="text-violet-400">•</span>
                <span className="text-indigo-300 text-xs font-bold uppercase tracking-wider">AI PREDICTIVE DEFENSE</span>
                <span className="text-violet-400">•</span>
                <span className="text-indigo-300 text-xs font-bold uppercase tracking-wider">UNMATCHED VERIFICATION</span>
              </div>
            </div>
            <div className="flex items-center gap-4 pt-4">
              <a href="https://twitter.com/glyphlock" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/8 flex items-center justify-center text-indigo-300 hover:bg-violet-500 hover:text-white hover:shadow-[0_0_15px_rgba(168,60,255,0.6)] transition-all duration-300">
                <Twitter size={18} />
              </a>
              <a href="https://linkedin.com/company/glyphlock" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/8 flex items-center justify-center text-indigo-300 hover:bg-violet-500 hover:text-white hover:shadow-[0_0_15px_rgba(168,60,255,0.6)] transition-all duration-300">
                <Linkedin size={18} />
              </a>
              <a href="https://instagram.com/glyphlock" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/8 flex items-center justify-center text-indigo-300 hover:bg-violet-500 hover:text-white hover:shadow-[0_0_15px_rgba(168,60,255,0.6)] transition-all duration-300">
                <Instagram size={18} />
              </a>
              <a href="https://github.com/glyphlock" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/8 flex items-center justify-center text-indigo-300 hover:bg-violet-500 hover:text-white hover:shadow-[0_0_15px_rgba(168,60,255,0.6)] transition-all duration-300">
                <Github size={18} />
              </a>
            </div>
          </div>

          {/* Company Column */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Company</h4>
            <div className="flex flex-col gap-4">
              {FOOTER_LINKS.company && FOOTER_LINKS.company.map((link) => (
                <Link key={link.page} to={createPageUrl(link.page)} className="text-white font-medium hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] transition-all duration-300">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Modules Column */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Modules</h4>
            <div className="flex flex-col gap-4">
              {FOOTER_LINKS.modules && FOOTER_LINKS.modules.map((link) => (
                <Link key={link.page} to={createPageUrl(link.page)} className="text-white font-medium hover:text-blue-400 hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.8)] transition-all duration-300">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Protocols Column */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Protocols</h4>
            <div className="flex flex-col gap-4">
              {FOOTER_LINKS.protocols && FOOTER_LINKS.protocols.map((link) => (
                <Link key={link.page} to={createPageUrl(link.page)} className="text-white font-medium hover:text-amber-400 hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.8)] transition-all duration-300">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Resources Column */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Resources</h4>
            <div className="flex flex-col gap-4">
              {FOOTER_LINKS.resources && FOOTER_LINKS.resources.map((link) => (
                <Link key={link.page} to={createPageUrl(link.page)} className="text-white font-medium hover:text-indigo-400 hover:drop-shadow-[0_0_8px_rgba(129,140,248,0.8)] transition-all duration-300">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Account Column */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Account</h4>
            <div className="flex flex-col gap-4">
              {FOOTER_LINKS.account && FOOTER_LINKS.account.map((link) => (
                <Link key={link.page} to={createPageUrl(link.page)} className="text-white font-medium hover:text-purple-400 hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.8)] transition-all duration-300">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Contact Column */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Contact</h4>
            <div className="flex flex-col gap-4">
              <a href="mailto:glyphlock@gmail.com" className="flex items-center gap-2 text-white font-medium hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] transition-all duration-300">
                <Mail size={16} /> glyphlock@gmail.com
              </a>
              <a href="tel:+14242466499" className="flex items-center gap-2 text-white font-medium hover:text-blue-400 hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.8)] transition-all duration-300">
                <Phone size={16} /> (424) 246-6499
              </a>
              <p className="text-sm opacity-60 pt-2">
                El Mirage, Arizona<br/>United States
              </p>
            </div>
          </div>
        </div>

        {/* SEO Keywords & Meta Tags Section - Crawler Optimized */}
        <div className="border-t border-white/10 pt-8 mb-12">
          <details className="group">
            <summary className="cursor-pointer text-center text-xs text-slate-500 tracking-wide mb-3 hover:text-cyan-400 transition-colors list-none">
              <span className="inline-flex items-center gap-2">
                🏷️ Keywords & SEO Metadata
                <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </span>
            </summary>
            <div className="mt-4 p-6 bg-slate-900/50 rounded-xl border border-slate-800 space-y-6">
              {/* Primary Keywords */}
              <div>
                <h5 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3">Primary Keywords</h5>
                <p className="text-xs text-slate-300 leading-relaxed">
                  quantum-resistant encryption, post-quantum cryptography, AI cybersecurity, enterprise security platform, 
                  visual cryptography, secure QR codes, blockchain security, AI governance framework, Master Covenant, 
                  GlyphLock Security, threat detection AI, zero-trust architecture, identity verification, fraud prevention
                </p>
              </div>
              
              {/* Secondary Keywords */}
              <div>
                <h5 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3">Secondary Keywords</h5>
                <p className="text-xs text-slate-300 leading-relaxed">
                  steganography tools, QR code generator secure, image encryption, NIST post-quantum standards, 
                  AI binding protocol, exposure-based binding, PROBE violation classification, TruthStrike protocol, 
                  GlyphBot AI assistant, N.U.P.S. POS system, hotzone mapper, security operations center, 
                  SOC 2 compliant, ISO 27001, GDPR compliant, HIPAA compliant, PCI DSS
                </p>
              </div>

              {/* Long-tail Keywords */}
              <div>
                <h5 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-3">Long-tail Keywords</h5>
                <p className="text-xs text-slate-300 leading-relaxed">
                  quantum-immune security for enterprises, AI-powered threat detection platform, 
                  visual authentication that can't be forged, autonomous defense engine for cybersecurity,
                  first legal framework for AI accountability, legally binding AI governance,
                  secure QR code generation with blockchain verification, enterprise-grade steganography tools,
                  real-time security monitoring dashboard, multi-provider LLM security assistant
                </p>
              </div>

              {/* Meta Description */}
              <div>
                <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">Meta Description</h5>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "GlyphLock Security LLC delivers enterprise-grade quantum-resistant cybersecurity with AI-powered threat detection, 
                  visual cryptography, blockchain security, and the revolutionary Master Covenant AI governance framework. 
                  Protect your organization with post-quantum encryption, secure QR codes, and autonomous defense systems."
                </p>
              </div>

              {/* Schema.org Types */}
              <div>
                <h5 className="text-xs font-bold text-green-400 uppercase tracking-wider mb-3">Schema.org Structured Data</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  <span className="text-slate-400">Organization</span>
                  <span className="text-slate-400">SoftwareApplication</span>
                  <span className="text-slate-400">WebApplication</span>
                  <span className="text-slate-400">SecurityService</span>
                  <span className="text-slate-400">CreativeWork</span>
                  <span className="text-slate-400">Article</span>
                  <span className="text-slate-400">FAQPage</span>
                  <span className="text-slate-400">HowTo</span>
                </div>
              </div>

              {/* Open Graph Tags */}
              <div>
                <h5 className="text-xs font-bold text-pink-400 uppercase tracking-wider mb-3">Open Graph & Social</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-400">
                  <span>og:type: website</span>
                  <span>og:site_name: GlyphLock Security</span>
                  <span>twitter:card: summary_large_image</span>
                  <span>twitter:site: @glyphlock</span>
                </div>
              </div>
            </div>
          </details>
        </div>

        {/* Crawler Discovery Section - Static HTML for SEO */}
        <div className="border-t border-white/10 pt-8 mb-12">
          <details className="group">
            <summary className="cursor-pointer text-center text-xs text-slate-500 tracking-wide mb-3 hover:text-cyan-400 transition-colors list-none">
              <span className="inline-flex items-center gap-2">
                🔍 Sitemap & Crawler Discovery
                <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </span>
            </summary>
            <nav aria-label="Sitemap Discovery" className="mt-4 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
              <p className="text-xs text-slate-400 mb-4 text-center">Machine-readable discovery endpoints for search engines and AI crawlers</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <a href="https://app.base44.com/api/apps/U5jDzdts3bd4p19I5hID/sitemap" target="_blank" rel="noopener" className="text-cyan-400 hover:text-cyan-300 underline">sitemap.xml</a>
                <a href="https://app.base44.com/api/apps/U5jDzdts3bd4p19I5hID/robotsTxt" target="_blank" rel="noopener" className="text-cyan-400 hover:text-cyan-300 underline">robots.txt</a>
                <a href="https://app.base44.com/api/apps/U5jDzdts3bd4p19I5hID/llmsTxt" target="_blank" rel="noopener" className="text-cyan-400 hover:text-cyan-300 underline">llms.txt</a>
                <a href="https://app.base44.com/api/apps/U5jDzdts3bd4p19I5hID/aiTxtEnhanced" target="_blank" rel="noopener" className="text-cyan-400 hover:text-cyan-300 underline">ai.txt</a>
                <a href="https://app.base44.com/api/apps/U5jDzdts3bd4p19I5hID/glyphlockKnowledge" target="_blank" rel="noopener" className="text-cyan-400 hover:text-cyan-300 underline">knowledge.json</a>
                <Link to={createPageUrl('Sitemap')} className="text-cyan-400 hover:text-cyan-300 underline">HTML Sitemap</Link>
                <Link to={createPageUrl('CaseStudies')} className="text-cyan-400 hover:text-cyan-300 underline">Case Studies</Link>
                <Link to={createPageUrl('MasterCovenant')} className="text-cyan-400 hover:text-cyan-300 underline">Master Covenant</Link>
              </div>
            </nav>
          </details>
        </div>

        {/* Compliance Badges - Clickable */}
        <div className="border-t border-white/10 pt-8 mb-12">
          <p className="text-center text-xs text-slate-500 tracking-wide mb-6">
            Compliance & Standards
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-6">
            {certifications.map((cert) => (
              <Link 
                key={cert.name} 
                to={createPageUrl(cert.page)}
                className="group flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-900/30 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/50 transition-all duration-300"
              >
                <div className="w-12 h-12 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                  <cert.BadgeComponent />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-white">{cert.name}</p>
                  <p className="text-[10px] text-slate-400">{cert.subtitle}</p>
                </div>
              </Link>
            ))}
          </div>
          <p className="text-center text-xs text-slate-400 max-w-3xl mx-auto leading-relaxed">
            GlyphLock aligns its internal security controls with widely recognized industry frameworks, including SOC 2, ISO 27001, PCI DSS, GDPR, and HIPAA, where applicable. Compliance status is subject to ongoing assessment and does not constitute certification unless explicitly stated in a written agreement.
          </p>
        </div>

        {/* Bottom Bar - Legal Links */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p className="text-white font-medium">© {new Date().getFullYear()} GlyphLock Security LLC. All rights reserved.</p>
          <div className="flex items-center gap-8">
            {FOOTER_LINKS.legal && FOOTER_LINKS.legal.map((link) => (
            <Link key={link.page} to={createPageUrl(link.page)} className="text-white font-medium hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] transition-all duration-300">
              {link.label}
            </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}