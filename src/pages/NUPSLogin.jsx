
import React, { useState, useEffect } from "react";
import { Shield, Briefcase, Mic, LogIn, LogOut } from "lucide-react";
import { GlyphInput, GlyphButton, GlyphFormPanel } from "@/components/ui/GlyphForm";

/**
 * NUPS PRIMARY AUTHORITY
 * SINGLE FILE
 * HARD OVERRIDE
 * NO TAPER
 * NO GUEST
 */

export default function NUPSLogin() {
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [name, setName] = useState("");
  const [secret, setSecret] = useState("");

  // 🔒 HARD AUTHORITY OVERRIDE — WINS OVER EVERYTHING
  useEffect(() => {
    const raw = localStorage.getItem("nups_session");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.source !== "NUPS_PRIMARY") {
        localStorage.removeItem("nups_session");
      } else {
        setSession(parsed);
      }
    }
  }, []);

  const establishSession = () => {
    const newSession = {
      source: "NUPS_PRIMARY",
      role,
      user: {
        id: crypto.randomUUID(),
        name
      },
      clockedIn: false
    };
    localStorage.setItem("nups_session", JSON.stringify(newSession));
    setSession(newSession);
  };

  const toggleClock = () => {
    const updated = {
      ...session,
      clockedIn: !session.clockedIn
    };
    localStorage.setItem("nups_session", JSON.stringify(updated));
    setSession(updated);
  };

  // ===== CLOCK VIEW =====
  if (session) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <GlyphFormPanel title="">
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-black text-white">
              {session.user.name}
            </h1>

            <div className="text-sm tracking-widest uppercase text-indigo-400">
              {session.role}
            </div>

            <GlyphButton
              onClick={toggleClock}
              className={`w-full h-16 text-xl ${
                session.clockedIn
                  ? "bg-gradient-to-r from-red-600 to-orange-600"
                  : "bg-gradient-to-r from-green-600 to-cyan-600"
              }`}
            >
              {session.clockedIn ? (
                <>
                  <LogOut className="mr-2" /> Clock Out
                </>
              ) : (
                <>
                  <LogIn className="mr-2" /> Clock In
                </>
              )}
            </GlyphButton>

            <button
              className="text-xs text-white/40 hover:underline"
              onClick={() => {
                localStorage.removeItem("nups_session");
                setSession(null);
                setRole(null);
              }}
            >
              End Session
            </button>
          </div>
        </GlyphFormPanel>
      </div>
    );
  }

  // ===== LOGIN VIEW =====
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <GlyphFormPanel title="">
        {!role ? (
          <div className="space-y-4">
            <GlyphButton onClick={() => setRole("admin")} variant="outline">
              <Shield className="mr-2" /> Admin
            </GlyphButton>
            <GlyphButton onClick={() => setRole("staff")} variant="outline">
              <Briefcase className="mr-2" /> Staff
            </GlyphButton>
            <GlyphButton onClick={() => setRole("entertainer")} variant="outline">
              <Mic className="mr-2" /> Entertainer
            </GlyphButton>
          </div>
        ) : (
          <div className="space-y-4">
            <GlyphInput
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <GlyphInput
              type="password"
              placeholder="PIN / Password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
            />

            <GlyphButton
              onClick={establishSession}
              disabled={!name || !secret}
              className="w-full"
            >
              Enter NUPS
            </GlyphButton>

            <button
              className="text-xs text-white/40 hover:underline"
              onClick={() => setRole(null)}
            >
              Back
            </button>
          </div>
        )}
      </GlyphFormPanel>
    </div>
  );
}
