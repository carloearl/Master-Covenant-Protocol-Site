import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Shield, Twitter, Linkedin, Instagram, Github, Mail, Phone } from "lucide-react";
import { FOOTER_LINKS } from "@/components/NavigationConfig";

/**
 * PHASE 3B FOOTER - FULLY CORRECTED
 * All links point to glyphlock.io routes ONLY
 * NO base44.app references
 */

const certifications = [
  { name: "SOC 2", subtitle: "TYPE II" },
  { name: "GDPR", subtitle: "COMPLIANT" },
  { name: "ISO 27001", subtitle: "CERTIFIED" },
  { name: "PCI DSS", subtitle: "COMPLIANT" },
  { name: "HIPAA", subtitle: "COMPLIANT" }
];

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-br from-indigo-950/20 via-violet-950/10 to-blue-950/20 border-t border-white/10 text-violet-200 pt-24 pb-12 relative overflow-hidden backdrop-blur-2xl">
    {/* Decorative Glows */}
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-[120px] pointer-events-none"></div>
    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/15 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 mb-20">
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
              {FOOTER_LINKS.company.map((link) => (
                <Link key={link.page} to={createPageUrl(link.page)} className="text-white font-medium hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] transition-all duration-300">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Products Column */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Products</h4>
            <div className="flex flex-col gap-4">
              {FOOTER_LINKS.products.map((link) => (
                <Link key={link.page} to={createPageUrl(link.page)} className="text-white font-medium hover:text-blue-400 hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.8)] transition-all duration-300">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Resources Column */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Resources</h4>
            <div className="flex flex-col gap-4">
              {FOOTER_LINKS.resources.map((link) => (
                <Link key={link.page} to={createPageUrl(link.page)} className="text-white font-medium hover:text-indigo-400 hover:drop-shadow-[0_0_8px_rgba(129,140,248,0.8)] transition-all duration-300">
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

        {/* Certifications */}
        <div className="border-t border-white/10 pt-12 mb-12">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-violet-300 mb-8">Security & Compliance Standards</p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {certifications.map((cert, idx) => (
              <div key={idx} className="group relative bg-white/5 border border-white/10 rounded-lg px-6 py-4 flex items-center gap-3 hover:border-[#00E4FF]/50 hover:bg-[#00E4FF]/5 transition-all duration-300">
                <Shield className="w-6 h-6 text-gray-500 group-hover:text-[#00E4FF] transition-colors" />
                <div className="text-left">
                  <div className="text-white font-bold text-sm group-hover:text-[#00E4FF] transition-colors">{cert.name}</div>
                  <div className="text-[10px] text-gray-500 tracking-wider group-hover:text-white/70">{cert.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar - Legal Links */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p className="text-white font-medium">© {new Date().getFullYear()} GlyphLock Security LLC. All rights reserved.</p>
          <div className="flex items-center gap-8">
            {FOOTER_LINKS.legal.map((link) => (
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