import React, { useEffect, useState } from "react";

// LAUNCH MOMENT (Arizona Standard Time = UTC-7)
const launchUTC = Date.UTC(2026, 0, 1, 7, 0, 0); 
// 2026-01-01 07:00:00 UTC == 12:00AM Jan 1 AZ time

function getRemaining() {
  const nowUTC = Date.now(); // always UTC epoch
  const diff = launchUTC - nowUTC;

  if (diff <= 0) {
    return { over: true, d: 0, h: 0, m: 0, s: 0 };
  }

  return {
    over: false,
    d: Math.floor(diff / (1000 * 60 * 60 * 24)),
    h: Math.floor((diff / (1000 * 60 * 60)) % 24),
    m: Math.floor((diff / (1000 * 60)) % 60),
    s: Math.floor((diff / 1000) % 60),
  };
}

export default function CountdownPill() {
  const [t, setT] = useState(getRemaining());

  useEffect(() => {
    const i = setInterval(() => setT(getRemaining()), 1000);
    return () => clearInterval(i);
  }, []);

  const u = (v) => v.toString().padStart(2, "0");

  return (
    <div className="w-full flex justify-center mt-8 mb-4 px-4">
      <div
        className="
          relative rounded-full max-w-2xl w-full
          px-8 py-4 sm:px-10 sm:py-5
          bg-gradient-to-r from-[#0A0018]/80 via-[#120033]/70 to-[#170040]/80
          border border-violet-500/40 backdrop-blur-xl
          shadow-[0_0_45px_rgba(168,85,247,0.28)]
          animate-[shimmer_6s_linear_infinite]
          overflow-hidden
        "
      >

        {/* hologram shimmer overlay */}
        <div className="
          absolute inset-0 rounded-full pointer-events-none
          bg-[radial-gradient(circle_at_20%_40%,rgba(255,255,255,0.11),transparent_60%)]
          opacity-40 mix-blend-screen
        " />

        {/* main text */}
        <div className="flex flex-col items-center gap-1 z-10 relative">
          <p className="text-violet-200/90 text-xs tracking-[0.30em] uppercase">
            Pre-Launch Engineering Mode
          </p>

          <p className="text-violet-100 text-lg sm:text-xl font-semibold">
            Launching{" "}
            <span className="text-violet-300 font-bold">
              January 1st, 2026
            </span>
          </p>
        </div>

        {/* countdown or final message */}
        {!t.over ? (
          <div className="mt-3 flex justify-center gap-5 sm:gap-8 z-10 relative">
            {[
              ["Days", t.d],
              ["Hours", t.h],
              ["Minutes", t.m],
              ["Seconds", t.s],
            ].map(([label, value]) => (
              <div key={label} className="flex flex-col items-center">
                <span className="
                  text-lg sm:text-2xl font-bold text-violet-100 tabular-nums
                ">
                  {u(value)}
                </span>
                <span className="
                  text-[0.55rem] sm:text-xs uppercase tracking-[0.2em] text-violet-300/75
                ">
                  {label}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center mt-3 text-violet-200 font-medium text-sm">
            Launch Phase Activated — Systems Online.
          </p>
        )}

        {/* micro note */}
        <p className="text-center text-[0.6rem] mt-3 text-violet-400/60 tracking-wide z-10 relative">
          Countdown synchronized to the official launch moment (UTC-anchored).
        </p>

      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes shimmer {
          0% { box-shadow: 0 0 28px rgba(168,85,247,0.22); }
          50% { box-shadow: 0 0 55px rgba(168,85,247,0.42); }
          100% { box-shadow: 0 0 28px rgba(168,85,247,0.22); }
        }
      `}</style>
    </div>
  );
}