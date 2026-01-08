import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LogIn,
  LogOut,
  ShieldCheck,
  UserCog,
  Users
} from "lucide-react";

/**
 * PROPS EXPECTED
 * role: "admin" | "staff" | "entertainer"
 * selectedEntertainer
 * isActive
 * activeShift
 * calcDuration
 * handleAdminLogin
 * handleEntertainerClockIn
 * handleClockOut
 */

export default function NUPSTimeClockUnified({
  role,
  selectedEntertainer,
  isActive,
  activeShift,
  calcDuration,
  handleAdminLogin,
  handleEntertainerClockIn,
  handleClockOut
}) {
  const [agreed, setAgreed] = useState(false);

  const isAdmin = role === "admin" || role === "staff";
  const isEntertainer = role === "entertainer";

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}
      <Card className="bg-slate-900/70 border-cyan-500/40">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">
              N.U.P.S. Time Control
            </h2>
            <p className="text-slate-400 text-sm">
              {isAdmin
                ? "Staff / Admin Access"
                : "Entertainer Check-In"}
            </p>
          </div>
          <Badge className="bg-cyan-500/20 text-cyan-400">
            {isAdmin ? "ADMIN MODE" : "ENTERTAINER MODE"}
          </Badge>
        </CardContent>
      </Card>

      {/* ================= ADMIN / STAFF LOGIN ================= */}
      {isAdmin && (
        <Card className="bg-slate-900/60 border-blue-500/40">
          <CardHeader>
            <CardTitle className="text-blue-400 flex items-center gap-2">
              <UserCog className="w-5 h-5" />
              Staff Login
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-300 text-sm">
              Administrative access to N.U.P.S. systems including
              Time Clock, POS, Contracts, and Reports.
            </p>

            <Button
              onClick={handleAdminLogin}
              className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-cyan-600"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Staff / Admin Login
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ================= ENTERTAINER CHECK-IN ================= */}
      {isEntertainer && (
        <Card className="bg-slate-900/60 border-purple-500/40">
          <CardHeader>
            <CardTitle className="text-purple-400 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Entertainer Check-In
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {selectedEntertainer ? (
              <>
                {/* STATUS */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl font-bold text-white">
                      {selectedEntertainer.stage_name}
                    </p>
                    <p className="text-slate-400 text-sm">
                      {selectedEntertainer.legal_name}
                    </p>
                  </div>

                  {isActive ? (
                    <Badge className="bg-green-500/20 text-green-400">
                      ON SHIFT
                    </Badge>
                  ) : (
                    <Badge className="bg-slate-600/40 text-slate-300">
                      OFF SHIFT
                    </Badge>
                  )}
                </div>

                {/* ACTIVE SHIFT */}
                {isActive && activeShift && (
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
                    <p className="text-green-400 font-medium">
                      Active Shift
                    </p>
                    <p className="text-2xl font-bold text-white mt-1">
                      {calcDuration(activeShift.clockIn)}
                    </p>
                  </div>
                )}

                {/* AGREEMENT CHECK */}
                {!isActive && (
                  <>
                    <div className="p-4 rounded-lg bg-slate-800/60 border border-slate-600 text-sm text-slate-300">
                      By checking in, I acknowledge that I have read and
                      agree to the active Entertainment Contract on file.
                      This agreement governs compensation, conduct, and
                      operational terms for this shift.
                    </div>

                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="w-5 h-5 accent-purple-500"
                      />
                      <span className="text-white font-medium">
                        I agree to the Entertainment Contract
                      </span>
                    </label>
                  </>
                )}

                {/* ACTION */}
                {isActive ? (
                  <Button
                    onClick={() => handleClockOut(activeShift)}
                    className="w-full h-14 text-lg bg-gradient-to-r from-red-600 to-orange-600"
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    Clock Out
                  </Button>
                ) : (
                  <Button
                    onClick={handleEntertainerClockIn}
                    disabled={!agreed}
                    className={`w-full h-14 text-lg ${
                      agreed
                        ? "bg-gradient-to-r from-green-600 to-cyan-600"
                        : "bg-slate-700 cursor-not-allowed"
                    }`}
                  >
                    <ShieldCheck className="w-5 h-5 mr-2" />
                    Check In
                  </Button>
                )}
              </>
            ) : (
              <p className="text-slate-500 text-center py-8">
                Select an entertainer to check in
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
