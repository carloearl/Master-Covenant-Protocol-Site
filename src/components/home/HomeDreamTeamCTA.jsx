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

      <div className="relative mx-auto max-w-6xl space-y-12">
        {/* DREAM TEAM CREST */}
        <div className="flex flex-col items-center space-y-6">
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/54c764af0_Whisk_bd85583b947dcac83fc479363a774286dr.jpg"
            alt="Dream Team Emblem"
            className="w-80 h-80 md:w-96 md:h-96 object-contain drop-shadow-[0_0_30px_rgba(120,0,255,0.7)] animate-pulse"
          />
          <h1 className="text-4xl md:text-6xl font-black tracking-wide text-center text-white">
            THE DREAM TEAM
          </h1>
          <p className="text-xl md:text-2xl text-cyan-100/80 text-center max-w-3xl">
            Multiple Models. One Machine. Zero Weak Links.
          </p>
        </div>

        {/* BEHIND GLYPHLOCK SECTION */}
        <div className="w-full bg-gradient-to-br from-indigo-900/50 to-blue-900/40 border border-indigo-700/30 rounded-3xl p-10 shadow-xl backdrop-blur-xl space-y-6">
          <h2 className="text-3xl font-bold mb-4 text-white">Behind GlyphLock</h2>

          <p className="text-lg leading-relaxed text-white/90">
            GlyphLock doesn't "use" AI — it deploys it.  
            This system isn't praying one model gets the answer right.  
            It runs a coordinated AI roster, each operator built to challenge the others,
            override errors, and reinforce the truth.
          </p>

          <ul className="list-disc ml-8 space-y-2 text-indigo-200">
            <li><strong>Positioned</strong> — every engine has a defined job, not a guess.</li>
            <li><strong>Cross-Checked</strong> — outputs are reviewed and corrected across operators.</li>
            <li><strong>Covenant-Bound</strong> — no rogue models, no free agents, no silent failures.</li>
            <li><strong>No Single Point of Failure</strong> — redundancy by design, intelligence by rotation.</li>
          </ul>

          <p className="text-lg leading-relaxed text-white/90 mt-4">
            GlyphLock isn't "one AI." It's a five-position machine running one vision:
            execution without compromise.
          </p>
        </div>

        {/* OPERATOR ROLES BOX */}
        <div className="relative w-full bg-black/40 border border-blue-700/40 rounded-3xl p-10 shadow-xl backdrop-blur-xl overflow-hidden">
          {/* LOCK/BRAIN BADGE */}
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/6db20a295_34226b41-415a-418e-821f-a17c8751522d.jpg"
            alt="GlyphLock Core Badge"
            className="absolute right-6 top-6 w-44 h-44 md:w-56 md:h-56 opacity-80 pointer-events-none select-none animate-pulse"
          />

          <h3 className="text-3xl font-bold mb-8 text-white">Operator Roles</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-lg text-white/90">
            <div className="space-y-3">
              <p><strong>Claude</strong> — Deep Reasoning · Cross-Examination · Audit</p>
              <p><strong>Alfred</strong> — System Orchestration · Flow Enforcement</p>
              <p><strong>GPT</strong> — Creative Intelligence · Expansion Logic</p>
            </div>
            <div className="space-y-3">
              <p><strong>Cursor</strong> — Code Precision · Refactor Discipline</p>
              <p><strong>Perplexity</strong> — Real-Time Recall · Signal Verification</p>
            </div>
          </div>

          <p className="text-center text-indigo-300 mt-6 text-lg tracking-wide">
            One roster. Many positions. Zero blind spots.
          </p>
        </div>

        {/* CTA SECTION */}
        <div className="w-full bg-gradient-to-br from-blue-800/40 to-indigo-900/40 border border-blue-700/40 rounded-3xl p-10 shadow-xl backdrop-blur-2xl flex flex-col md:flex-row items-center gap-10">
          {/* CTA IMAGE LEFT */}
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/b3faa0663_Whisk_700dafa6070c5a48ef74745234e723a3dr.jpg"
            alt="Dream Team Lock Emblem"
            className="w-64 h-64 md:w-80 md:h-80 object-contain drop-shadow-[0_0_35px_rgba(0,150,255,0.7)]"
          />

          {/* CTA TEXT RIGHT */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-4xl font-bold text-white">Enter the Dream Team</h3>
            <p className="text-lg text-white/80 max-w-xl">
              Meet the operators. See the roles.  
              Understand the architecture behind GlyphLock's firepower.
            </p>
            <Link
              to="/dreamteam"
              className="mt-4 inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg hover:opacity-90 transition text-lg font-semibold text-white"
            >
              Enter the Dream Team
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}