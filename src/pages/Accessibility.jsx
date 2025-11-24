import React from "react";
import { Eye, Keyboard, Users, Volume2 } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Accessibility() {
  return (
    <>
      <SEOHead 
        title="Accessibility Statement | GlyphLock"
        description="GlyphLock's commitment to accessibility and inclusive design for all users."
        url="/accessibility"
      />
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black text-white py-32 relative overflow-hidden">
        {/* Cosmic Background */}
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/30 via-cyan-900/10 to-transparent pointer-events-none z-0" />
        <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDYsIDE4MiwgMjEyLCAwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20 pointer-events-none z-0" />
        <div className="glyph-orb fixed top-20 right-20 opacity-20 glyph-pulse" style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.3), rgba(59,130,246,0.2))' }}></div>
        
        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center p-4 glyph-glass border-2 border-cyan-500/40 rounded-2xl mb-6 glyph-glow">
              <Eye className="w-12 h-12 text-cyan-400" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter font-space">
              ACCESSIBILITY <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">STATEMENT</span>
            </h1>
            <div className="inline-block px-4 py-2 glyph-glass border border-cyan-500/30 rounded-full">
              <p className="text-cyan-300 text-sm font-bold uppercase tracking-widest">Committed to Inclusive Design</p>
            </div>
          </div>

          <div className="glyph-glass-dark rounded-3xl border-2 border-cyan-500/30 p-8 md:p-12 space-y-12 glyph-glow">
            
            {/* Commitment */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 glyph-glass border border-cyan-500/40 rounded-xl">
                  <Users className="w-6 h-6 text-cyan-400" />
                </div>
                <h2 className="text-2xl font-bold text-white font-space">Our Commitment</h2>
              </div>
              <div className="pl-4 border-l-2 border-cyan-500/20 ml-6 space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  GlyphLock is committed to ensuring digital accessibility for people with disabilities. We continuously improve the user experience for everyone and apply relevant accessibility standards.
                </p>
              </div>
            </section>

            {/* Standards */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 glyph-glass border border-purple-500/40 rounded-xl">
                  <Keyboard className="w-6 h-6 text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold text-white font-space">Accessibility Features</h2>
              </div>
              <div className="pl-4 border-l-2 border-purple-500/20 ml-6 space-y-6">
                
                <div className="glyph-glass border border-cyan-500/20 p-4 rounded-xl">
                  <h3 className="text-cyan-300 font-semibold mb-2 flex items-center gap-2">
                    <Keyboard className="w-4 h-4" />
                    Keyboard Navigation
                  </h3>
                  <p className="text-gray-400 text-sm">Full keyboard support for all interactive elements, with clear focus indicators and logical tab order.</p>
                </div>

                <div className="glyph-glass border border-blue-500/20 p-4 rounded-xl">
                  <h3 className="text-blue-300 font-semibold mb-2 flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Screen Reader Compatible
                  </h3>
                  <p className="text-gray-400 text-sm">ARIA labels, semantic HTML, and descriptive text for assistive technologies.</p>
                </div>

                <div className="glyph-glass border border-purple-500/20 p-4 rounded-xl">
                  <h3 className="text-purple-300 font-semibold mb-2 flex items-center gap-2">
                    <Volume2 className="w-4 h-4" />
                    Text-to-Speech
                  </h3>
                  <p className="text-gray-400 text-sm">GlyphBot includes voice synthesis with customizable speed and clarity for enhanced accessibility.</p>
                </div>
              </div>
            </section>

            {/* Feedback */}
            <section className="mt-16 p-8 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-2 border-cyan-500/30 rounded-2xl text-center glyph-glow">
              <h2 className="text-3xl font-bold text-white mb-4 font-space">Feedback Welcome</h2>
              <p className="text-gray-300 mb-6">We welcome your feedback on accessibility. Contact us to report issues or suggest improvements.</p>
              <a 
                href="mailto:glyphlock@gmail.com" 
                className="inline-flex items-center justify-center bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold uppercase tracking-wide px-8 py-4 rounded-xl transition-all shadow-lg glyph-glow min-h-[52px]"
              >
                Contact Accessibility Team
              </a>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}