import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Shield, Twitter, Linkedin, Instagram, Github, Mail, Phone } from "lucide-react";
import { FOOTER_LINKS } from "@/components/NavigationConfig";

const certifications = [
  { name: "SOC 2", subtitle: "TYPE II" },
  { name: "GDPR", subtitle: "COMPLIANT" },
  { name: "ISO 27001", subtitle: "CERTIFIED" },
  { name: "PCI DSS", subtitle: "COMPLIANT" },
  { name: "HIPAA", subtitle: "COMPLIANT" }
];

export default function Footer() {
  return (
    <footer className="w-full bg-[#000000] border-t border-[#8C4BFF]/20 text-gray-400 pt-24 pb-12 relative overflow-hidden">
      {/* Decorative Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00E4FF]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#8C4BFF]/5 rounded-full blur-[120px] pointer-events-none"></div>

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
            <p className="text-gray-400 leading-relaxed max-w-sm">
              The world's first quantum-resistant security platform for the AI era. 
              Protecting your digital sovereignty with military-grade encryption and autonomous governance.
            </p>
            <div className="flex items-center gap-4 pt-4">
              {[Twitter, Linkedin, Instagram, Github].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#00E4FF] hover:text-black transition-all duration-300">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns - Using Shared Config */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Company</h4>
            <div className="flex flex-col gap-4">
              {FOOTER_LINKS.company.map((link) => (
                <Link key={link.page} to={createPageUrl(link.page)} className="hover:text-[#00E4FF] transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Solutions</h4>
            <div className="flex flex-col gap-4">
              {FOOTER_LINKS.solutions.map((link) => (
                <Link key={link.page} to={createPageUrl(link.page)} className="hover:text-[#00E4FF] transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Resources</h4>
            <div className="flex flex-col gap-4">
              {FOOTER_LINKS.resources.map((link) => (
                <Link key={link.page} to={createPageUrl(link.page)} className="hover:text-[#00E4FF] transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Contact</h4>
            <div className="flex flex-col gap-4">
              <a href="mailto:glyphlock@gmail.com" className="flex items-center gap-2 hover:text-[#00E4FF] transition-colors">
                <Mail size={16} /> glyphlock@gmail.com
              </a>
              <a href="tel:+14242466499" className="flex items-center gap-2 hover:text-[#00E4FF] transition-colors">
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
          <p className="text-center text-xs font-bold uppercase tracking-widest text-gray-500 mb-8">Security & Compliance Standards</p>
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

        {/* Bottom Bar - Using Shared Config */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p>© {new Date().getFullYear()} GlyphLock Security LLC. All rights reserved.</p>
          <div className="flex items-center gap-8">
            {FOOTER_LINKS.legal.map((link) => (
              <Link key={link.page} to={createPageUrl(link.page)} className="hover:text-white transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}