import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Briefcase, Mic, LogIn, LogOut } from "lucide-react";
import {
  GlyphInput,
  GlyphButton,
  GlyphFormPanel
} from "@/components/ui/GlyphForm";

/**
 * NUPS — Single Authority
 * Login + Role Selection + Clock In/Out
 * NO guest
 * NO IndexedDB
 * NO second page
 */

export default function NUPS() {
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [name, setName] = useState("");
  const [secret, setSecret] = useState("");
  const [clockedIn, setClockedIn] = useState(false);

  /* Load existing session */
  useEffect(() => {
    const raw = localStorage.getItem("nups_session");
    if (raw) setSession(JSON.parse(raw));
  }, []);

  /* Persist session */
  const establishSession = () => {
    const newSession = {
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

  /* Clock logic */
  const toggleClock = () => {
    const updated = {
      ...session,
      clockedIn: !session.clockedIn
    };
    localStorage.setItem("nups_session", JSON.stringify(updated));
    setSession(updated);
    setClockedIn(updated.clockedIn);
  };

  /* ===== CLOCK VIEW ===== */
  if (session) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <GlyphFormPanel title="">
          <div className="text-center space-y-6">
            <h1 className="text-3xl font-black text-white">
              {session.user.name}
            </h1>

            <p className="text-white/60">
              Role: <span className="text-indigo-400">{session.role}</span>
            </p>

            <GlyphButton
              onClick={toggleClock}
              className={`w-full h-14 text-lg ${
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

  /* ===== LOGIN VIEW ===== */
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
