// DREAM TEAM CTA — HOME ONLY
// Do not render flip cards here. Full roster lives at /dreamteam.

import React from "react";
import { Link } from "react-router-dom";

export default function HomeDreamTeamCTA() {
  return (
    <section className="relative py-20 px-4 md:px-10 lg:px-16 overflow-hidden">
      {/* soft glow behind card */}
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -top-40 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-600/40 blur-3xl" />
        <div className="absolute -bottom-40 left-10 h-64 w-64 rounded-full bg-violet-500/35 blur-3xl" />
        <div className="absolute -bottom-32 right-10 h-56 w-56 rounded-full bg-sky-500/30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl space-y-8 md:space-y-10">
        {/* DREAM TEAM CREST */}
        <div className="flex flex-col items-center space-y-4">
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/6db20a295_34226b41-415a-418e-821f-a17c8751522d.jpg"
            alt="Dream Team Emblem"
            className="w-64 h-64 md:w-80 md:h-80 object-contain drop-shadow-[0_0_30px_rgba(120,0,255,0.7)] animate-pulse"
          />
          <h1 className="text-3xl md:text-5xl font-black tracking-wide text-center text-white">
            THE DREAM TEAM
          </h1>
          <p className="text-lg md:text-xl text-cyan-100/80 text-center max-w-2xl">
            Multiple Models. One Machine. Zero Weak Links.
          </p>
        </div>

        {/* BEHIND GLYPHLOCK SECTION */}
        <div className="w-full bg-gradient-to-br from-indigo-900/50 to-blue-900/40 border border-indigo-700/30 rounded-3xl p-6 md:p-8 shadow-xl backdrop-blur-xl space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Behind GlyphLock</h2>

          <p className="text-base md:text-lg leading-relaxed text-white/90">
            GlyphLock doesn't "use" AI — it deploys it. This system runs a coordinated AI roster, each operator built to challenge the others, override errors, and reinforce the truth.
          </p>

          <ul className="list-disc ml-6 space-y-1.5 text-sm md:text-base text-indigo-200">
            <li><strong>Positioned</strong> — every engine has a defined job, not a guess.</li>
            <li><strong>Cross-Checked</strong> — outputs are reviewed and corrected across operators.</li>
            <li><strong>Covenant-Bound</strong> — no rogue models, no free agents, no silent failures.</li>
            <li><strong>No Single Point of Failure</strong> — redundancy by design, intelligence by rotation.</li>
          </ul>
        </div>

        {/* OPERATOR ROLES BOX */}
        <div className="relative w-full border border-blue-700/40 rounded-3xl p-6 md:p-8 shadow-xl backdrop-blur-xl overflow-hidden">
          {/* Basketball court background */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/24df5ae09_Whisk_700dafa6070c5a48ef74745234e723a3dr.jpg"
              alt=""
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-indigo-950/70 to-blue-950/80" />
          </div>

          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">Operator Roles</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-base md:text-lg text-white/90">
              <div className="space-y-2">
                <p><strong>Claude</strong> — Deep Reasoning · Cross-Examination · Audit</p>
                <p><strong>Alfred</strong> — System Orchestration · Flow Enforcement</p>
                <p><strong>GPT</strong> — Creative Intelligence · Expansion Logic</p>
              </div>
              <div className="space-y-2">
                <p><strong>Cursor</strong> — Code Precision · Refactor Discipline</p>
                <p><strong>Perplexity</strong> — Real-Time Recall · Signal Verification</p>
              </div>
            </div>

            <p className="text-center text-indigo-300 mt-5 text-base md:text-lg tracking-wide">
              One roster. Many positions. Zero blind spots.
            </p>
          </div>
        </div>

        {/* CTA SECTION */}
        <div className="w-full bg-gradient-to-br from-blue-800/40 to-indigo-900/40 border border-blue-700/40 rounded-3xl p-6 md:p-8 shadow-xl backdrop-blur-2xl flex flex-col md:flex-row items-center gap-6 md:gap-8">
          {/* CTA IMAGE LEFT */}
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/b3faa0663_Whisk_700dafa6070c5a48ef74745234e723a3dr.jpg"
            alt="Dream Team Lock Emblem"
            className="w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-[0_0_35px_rgba(0,150,255,0.7)]"
          />

          {/* CTA TEXT RIGHT */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-2xl md:text-3xl font-bold text-white">Enter the Dream Team</h3>
            <p className="text-base md:text-lg text-white/80">
              Meet the operators. See the roles. Understand the architecture behind GlyphLock's firepower.
            </p>
            <Link
              to="/dreamteam"
              className="mt-2 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg hover:opacity-90 transition text-base md:text-lg font-semibold text-white"
            >
              Enter the Dream Team
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}