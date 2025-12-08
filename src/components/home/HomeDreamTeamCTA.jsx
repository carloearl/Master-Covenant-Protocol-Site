// DREAM TEAM CTA — HOME ONLY
// Do not render flip cards here. Full roster lives at /dreamteam.

import React from "react";
import { Link } from "react-router-dom";

export default function HomeDreamTeamCTA() {
  return (
    <section className="relative py-12 px-4 md:px-8 lg:px-12 overflow-hidden">
      {/* soft glow behind card */}
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -top-40 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-600/40 blur-3xl" />
        <div className="absolute -bottom-40 left-10 h-64 w-64 rounded-full bg-violet-500/35 blur-3xl" />
        <div className="absolute -bottom-32 right-10 h-56 w-56 rounded-full bg-sky-500/30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* DREAM TEAM CREST */}
        <div className="flex flex-col items-center space-y-2 mb-4">
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/168848645_Whisk_dc6bc22c5ef0f01a1264315f95279f3edr.jpeg"
            alt="GlyphLock Dream Team Logo"
            className="w-48 h-48 md:w-56 md:h-56 object-contain drop-shadow-[0_0_35px_rgba(87,61,255,0.8)] animate-pulse"
            style={{ mixBlendMode: 'screen', filter: 'brightness(1.2) contrast(1.3)' }}
          />
          <h1 className="text-2xl md:text-4xl font-black tracking-wide text-center text-white">
            THE DREAM TEAM
          </h1>
          <p className="text-base md:text-lg text-cyan-100/80 text-center max-w-2xl">
            Multiple Models. One Machine. Zero Weak Links.
          </p>
        </div>

        {/* UNIFIED CARD */}
        <div className="relative w-full border border-blue-700/40 rounded-2xl p-4 md:p-6 shadow-xl backdrop-blur-xl overflow-hidden">
          {/* Holographic court background */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/7e8ba0de1_3880beef-889a-4dec-9b80-2b561f3c47a3.jpg"
              alt=""
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-indigo-950/40 to-blue-950/50" />
          </div>

          <div className="relative z-10 space-y-4 text-center">
            {/* Behind GlyphLock */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Behind GlyphLock</h2>
              <p className="text-sm md:text-base leading-relaxed text-white/90 mb-2 max-w-4xl mx-auto">
                GlyphLock doesn't "use" AI — it deploys it. This system runs a coordinated AI roster, each operator built to challenge the others, override errors, and reinforce the truth.
              </p>
              <ul className="list-none space-y-1 text-xs md:text-sm text-indigo-200 max-w-3xl mx-auto">
                <li><strong>Positioned</strong> — every engine has a defined job, not a guess.</li>
                <li><strong>Cross-Checked</strong> — outputs are reviewed and corrected across operators.</li>
                <li><strong>Covenant-Bound</strong> — no rogue models, no free agents, no silent failures.</li>
                <li><strong>No Single Point of Failure</strong> — redundancy by design, intelligence by rotation.</li>
              </ul>
            </div>

            {/* Operator Roles */}
            <div className="border-t border-white/10 pt-4">
              <h3 className="text-xl md:text-2xl font-bold mb-3 text-white">Operator Roles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 text-sm md:text-base text-white/90 max-w-3xl mx-auto">
                <div className="space-y-1.5">
                  <p><strong>Claude</strong> — Deep Reasoning · Audit</p>
                  <p><strong>Alfred</strong> — System Orchestration</p>
                  <p><strong>GPT</strong> — Creative Intelligence</p>
                </div>
                <div className="space-y-1.5">
                  <p><strong>Cursor</strong> — Code Precision</p>
                  <p><strong>Perplexity</strong> — Real-Time Recall</p>
                </div>
              </div>
              <p className="text-indigo-300 mt-3 text-sm md:text-base tracking-wide">
                One roster. Many positions. Zero blind spots.
              </p>
            </div>

            {/* CTA */}
            <div className="border-t border-white/10 pt-4 flex flex-col items-center text-center space-y-2">
              <h3 className="text-xl md:text-2xl font-bold text-white">Enter the Dream Team</h3>
              <p className="text-sm md:text-base text-white/80 max-w-2xl">
                Meet the operators. See the roles. Understand the architecture behind GlyphLock's firepower.
              </p>
              <Link
                to="/dreamteam"
                className="mt-1 inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg hover:opacity-90 transition text-sm md:text-base font-semibold text-white"
              >
                Enter the Dream Team
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}