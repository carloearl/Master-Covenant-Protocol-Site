/**
 * NUPS 2.0 — Unified Clock Authority
 * =====================================
 * • Admin / Manager / Staff → Staff Clock with DB persistence
 * • Entertainer → Check-In with contract agreement
 * • Real audit logging to database
 */

import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, LogIn, LogOut, UserCheck, History, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAccessControl } from "@/components/nups/ProtectedField";

/* ===============================
   ENTRY POINT
   =============================== */

export default function TimeClockContent() {
  const { userRole, user } = useAccessControl();
  const role = (userRole || "user").toLowerCase();

  if (role === "entertainer") {
    return <EntertainerCheckIn user={user} />;
  }

  return <StaffClock user={user} />;
}

/* ===============================
   STAFF / ADMIN CLOCK
   =============================== */

function StaffClock({ user }) {
  const queryClient = useQueryClient();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Get active shift for current user
  const { data: activeShift, isLoading } = useQuery({
    queryKey: ['my-active-shift', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const shifts = await base44.entities.EntertainerShift.filter(
        { created_by: user.email, status: 'on_floor' },
        '-created_date',
        1
      );
      return shifts.find(s => !s.check_out_time) || null;
    },
    enabled: !!user?.email,
    refetchInterval: 30000
  });

  // Get recent audit log
  const { data: auditLog = [] } = useQuery({
    queryKey: ['clock-audit-log'],
    queryFn: () => base44.entities.SystemAuditLog.filter(
      { event_type: 'CLOCK_EVENT' },
      '-created_date',
      20
    )
  });

  const clockIn = useMutation({
    mutationFn: async () => {
      const shift = await base44.entities.EntertainerShift.create({
        entertainer_id: user.id || user.email,
        stage_name: user.full_name || user.email.split('@')[0],
        check_in_time: new Date().toISOString(),
        location: 'Staff Area',
        status: 'on_floor',
        shift_earnings: 0,
        vip_sessions: 0
      });
      
      await base44.entities.SystemAuditLog.create({
        event_type: 'CLOCK_EVENT',
        description: `${user.full_name || user.email} clocked in`,
        actor_email: user.email,
        resource_id: shift.id,
        status: 'success',
        metadata: { action: 'clock_in', shift_id: shift.id }
      });
      
      return shift;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-active-shift'] });
      queryClient.invalidateQueries({ queryKey: ['clock-audit-log'] });
      toast.success("Clocked in successfully");
    },
    onError: (err) => toast.error("Failed to clock in: " + err.message)
  });

  const clockOut = useMutation({
    mutationFn: async () => {
      if (!activeShift) return;
      
      await base44.entities.EntertainerShift.update(activeShift.id, {
        check_out_time: new Date().toISOString(),
        status: 'checked_out'
      });
      
      await base44.entities.SystemAuditLog.create({
        event_type: 'CLOCK_EVENT',
        description: `${user.full_name || user.email} clocked out`,
        actor_email: user.email,
        resource_id: activeShift.id,
        status: 'success',
        metadata: { action: 'clock_out', shift_id: activeShift.id }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-active-shift'] });
      queryClient.invalidateQueries({ queryKey: ['clock-audit-log'] });
      toast.success("Clocked out successfully");
    },
    onError: (err) => toast.error("Failed to clock out: " + err.message)
  });

  const duration = activeShift
    ? Math.floor((now.getTime() - new Date(activeShift.check_in_time).getTime()) / 60000)
    : 0;

  if (isLoading) {
    return (
      <Card className="bg-slate-900/60 border-cyan-500/40">
        <CardContent className="p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mx-auto" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Main Clock Card */}
      <Card className="lg:col-span-2 bg-slate-900/60 border-cyan-500/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Clock className="w-5 h-5 text-cyan-400" />
            Staff Time Clock
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 text-center">
          <div className="text-6xl font-mono text-cyan-400">
            {now.toLocaleTimeString()}
          </div>
          
          <div className="text-sm text-slate-400">
            {now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>

          {activeShift ? (
            <>
              <Badge className="bg-green-500/20 text-green-400 px-4 py-2 text-lg">
                On Shift — {Math.floor(duration / 60)}h {duration % 60}m
              </Badge>
              
              <div className="text-sm text-slate-400">
                Clocked in at {new Date(activeShift.check_in_time).toLocaleTimeString()}
              </div>

              <Button
                className="w-full h-16 bg-gradient-to-r from-red-600 to-orange-600 text-xl"
                onClick={() => clockOut.mutate()}
                disabled={clockOut.isPending}
              >
                {clockOut.isPending ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <LogOut className="w-5 h-5 mr-2" />
                )}
                Clock Out
              </Button>
            </>
          ) : (
            <Button
              className="w-full h-16 bg-gradient-to-r from-green-600 to-cyan-600 text-xl"
              onClick={() => clockIn.mutate()}
              disabled={clockIn.isPending}
            >
              {clockIn.isPending ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <LogIn className="w-5 h-5 mr-2" />
              )}
              Clock In
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Audit Log */}
      <Card className="bg-slate-900/60 border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-white text-sm">
            <History className="w-4 h-4 text-slate-400" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            {auditLog.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-4">No recent activity</p>
            ) : (
              <div className="space-y-2">
                {auditLog.map((log) => (
                  <div key={log.id} className="p-2 bg-slate-800/50 rounded text-xs">
                    <p className="text-slate-300">{log.description}</p>
                    <p className="text-slate-500 mt-1">
                      {new Date(log.created_date).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

/* ===============================
   ENTERTAINER CHECK-IN
   =============================== */

function EntertainerCheckIn({ user }) {
  const queryClient = useQueryClient();
  const [agreed, setAgreed] = useState(false);

  // Check if already checked in today
  const { data: todayShift } = useQuery({
    queryKey: ['my-entertainer-shift', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const today = new Date().toDateString();
      const shifts = await base44.entities.EntertainerShift.filter(
        { created_by: user.email },
        '-created_date',
        5
      );
      return shifts.find(s => 
        new Date(s.check_in_time).toDateString() === today && !s.check_out_time
      ) || null;
    },
    enabled: !!user?.email
  });

  const checkIn = useMutation({
    mutationFn: async () => {
      const shift = await base44.entities.EntertainerShift.create({
        entertainer_id: user.id || user.email,
        stage_name: user.full_name || user.email.split('@')[0],
        check_in_time: new Date().toISOString(),
        location: 'Main Floor',
        status: 'on_floor',
        shift_earnings: 0,
        vip_sessions: 0
      });
      
      await base44.entities.SystemAuditLog.create({
        event_type: 'CLOCK_EVENT',
        description: `Entertainer ${user.full_name || user.email} checked in (agreement accepted)`,
        actor_email: user.email,
        resource_id: shift.id,
        status: 'success',
        metadata: { action: 'entertainer_check_in', agreement_accepted: true }
      });
      
      return shift;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-entertainer-shift'] });
      toast.success("Checked in successfully!");
    },
    onError: (err) => toast.error("Failed to check in: " + err.message)
  });

  const checkedIn = !!todayShift;

  return (
    <Card className="max-w-lg mx-auto bg-slate-900/60 border-rose-500/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <UserCheck className="w-5 h-5 text-rose-400" />
          Entertainer Check-In
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {checkedIn ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
              <UserCheck className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <p className="text-white text-lg font-medium">You're Checked In</p>
              <p className="text-slate-400 text-sm">
                Since {new Date(todayShift.check_in_time).toLocaleTimeString()}
              </p>
            </div>
            <Badge className="bg-green-500/20 text-green-400">Active on Floor</Badge>
          </div>
        ) : (
          <>
            <div className="p-4 bg-slate-800/60 rounded-lg text-sm text-slate-300 border border-slate-700">
              <p className="font-medium text-white mb-2">Agreement Required</p>
              By checking in, you confirm that you have read, understand, and agree
              to all Entertainer Agreements, Club Policies, and Compensation Terms
              currently on file.
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="agree"
                checked={agreed}
                onCheckedChange={setAgreed}
                className="mt-1"
              />
              <label htmlFor="agree" className="text-sm text-white cursor-pointer">
                I agree to the Entertainer Agreement & Terms and confirm I am fit to work today
              </label>
            </div>

            <Button
              disabled={!agreed || checkIn.isPending}
              className={`w-full h-14 text-lg ${
                agreed
                  ? "bg-gradient-to-r from-rose-600 to-pink-600"
                  : "bg-slate-700 cursor-not-allowed"
              }`}
              onClick={() => checkIn.mutate()}
            >
              {checkIn.isPending ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <LogIn className="w-5 h-5 mr-2" />
              )}
              Check In
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}