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

      <div className="relative mx-auto max-w-5xl rounded-3xl border border-indigo-400/40 bg-gradient-to-b from-indigo-950/80 via-[#030518]/95 to-black/95 px-6 py-10 shadow-[0_0_40px_rgba(56,189,248,0.35)] backdrop-blur-xl">
        {/* Badge */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-gradient-to-r from-indigo-700/60 via-blue-700/70 to-violet-700/60 px-4 py-1 text-xs font-semibold tracking-[0.18em] uppercase text-cyan-100/90 shadow-[0_0_20px_rgba(56,189,248,0.5)]">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,1)]" />
            <span>AI Operators · Roster Engine</span>
          </div>
        </div>

        {/* Heading & subheading */}
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            The{" "}
            <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              Dream Team
            </span>{" "}
            Behind GlyphLock
          </h2>

          <p className="mt-4 text-base md:text-lg text-sky-100/85">
            AI is a roster, not a religion. When one model stumbles, another
            picks up the play.
          </p>

          <p className="mt-3 text-sm md:text-base text-indigo-100/80 max-w-2xl mx-auto">
            GlyphLock runs multiple AI operators like a championship lineup —
            each assigned to a role, cross-checking the others, and logged into
            the Master Covenant. Their overlap turns "one model&apos;s answer"
            into audited intelligence.
          </p>
        </div>

        {/* Content grid */}
        <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-start">
          {/* Left: bullets / explanation */}
          <div className="space-y-4 text-sm md:text-[0.95rem] text-indigo-50/90">
            <div className="flex gap-3">
              <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
              <p>
                <span className="font-semibold text-sky-100">
                  Positioned, not random —
                </span>{" "}
                Claude, Alfred, GPT, Cursor, Perplexity and others each have a
                defined job: analysis, orchestration, creative lift, code
                precision, real-time recall.
              </p>
            </div>

            <div className="flex gap-3">
              <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.9)]" />
              <p>
                <span className="font-semibold text-sky-100">
                  Overlap by design —
                </span>{" "}
                outputs are compared and cross-checked so hallucinations,
                missing context, and bad logic get flagged instead of shipped.
              </p>
            </div>

            <div className="flex gap-3">
              <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-violet-400 shadow-[0_0_10px_rgba(129,140,248,0.9)]" />
              <p>
                <span className="font-semibold text-sky-100">
                  Bound by contract —
                </span>{" "}
                every operator runs under the same proof, logging, and
                accountability rules as the rest of GlyphLock. No free agents,
                no rogue answers.
              </p>
            </div>

            <p className="pt-1 text-xs md:text-[0.8rem] uppercase tracking-[0.18em] text-indigo-200/70">
              Claude · Alfred · GPT · CoPilot · Cursor · Perplexity — one
              system, many positions.
            </p>
          </div>

          {/* Right: mini roster / chips */}
          <div className="rounded-2xl border border-indigo-500/50 bg-gradient-to-b from-indigo-900/70 via-blue-950/80 to-black/90 p-4 shadow-[0_0_25px_rgba(56,189,248,0.35)]">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-200/90 mb-3">
              Operator Roles
            </p>

            <div className="space-y-2 text-xs md:text-sm text-sky-100/90">
              <div className="flex justify-between gap-3 border-b border-indigo-500/30 pb-2">
                <span>Claude</span>
                <span className="text-sky-300/90">Deep Reasoning · Audit</span>
              </div>
              <div className="flex justify-between gap-3 border-b border-indigo-500/20 pb-2">
                <span>Alfred</span>
                <span className="text-sky-300/90">
                  System Orchestration · Flow
                </span>
              </div>
              <div className="flex justify-between gap-3 border-b border-indigo-500/20 pb-2">
                <span>GPT</span>
                <span className="text-sky-300/90">
                  Creative Intelligence · Language
                </span>
              </div>
              <div className="flex justify-between gap-3 border-b border-indigo-500/20 pb-2">
                <span>Cursor</span>
                <span className="text-sky-300/90">Code Precision · Refactor</span>
              </div>
              <div className="flex justify-between gap-3">
                <span>Perplexity</span>
                <span className="text-sky-300/90">Real-Time Recall · Signals</span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 text-[0.7rem]">
              <span className="rounded-full border border-cyan-300/60 bg-cyan-500/20 px-3 py-1 text-cyan-100">
                Model overlap
              </span>
              <span className="rounded-full border border-sky-300/60 bg-sky-500/20 px-3 py-1 text-sky-100">
                Covenant-bound
              </span>
              <span className="rounded-full border border-violet-300/60 bg-violet-500/20 px-3 py-1 text-violet-100">
                No single point of failure
              </span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 flex flex-col items-center gap-2">
          <Link
            to="/dreamteam"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 via-blue-500 to-violet-500 px-8 py-3 text-sm md:text-base font-semibold text-white shadow-[0_0_25px_rgba(59,130,246,0.75)] transition-transform hover:scale-[1.03] hover:shadow-[0_0_35px_rgba(59,130,246,0.9)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            Enter the Dream Team
          </Link>
          <p className="text-[0.8rem] md:text-xs text-indigo-200/75">
            See the full roster, positions, and how each AI is bound into the
            GlyphLock stack.
          </p>
        </div>
      </div>
    </section>
  );
}