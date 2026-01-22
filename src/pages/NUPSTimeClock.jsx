/**
 * NUPS TIME CLOCK PAGE
 * Entertainer clock in/out with IndexedDB storage
 */

import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, LogIn, LogOut, Users, Search, Timer, 
  CheckCircle, Wifi, WifiOff, Download
} from 'lucide-react';
import { toast } from 'sonner';
import OnlineStatusIndicator from '@/components/nups/OnlineStatusIndicator';
import InstallPrompt from '@/components/nups/InstallPrompt';

// IndexedDB inline implementation
const DB_NAME = 'NUPS_TimeClock';
const DB_VERSION = 1;

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('shifts')) {
        db.createObjectStore('shifts', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('auditLog')) {
        db.createObjectStore('auditLog', { keyPath: 'id' });
      }
    };
  });
}

async function saveShift(shift) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('shifts', 'readwrite');
    tx.objectStore('shifts').put(shift);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function getAllShifts() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('shifts', 'readonly');
    const request = tx.objectStore('shifts').getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

async function addAuditEntry(entry) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('auditLog', 'readwrite');
    tx.objectStore('auditLog').add(entry);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function getAuditLog() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('auditLog', 'readonly');
    const request = tx.objectStore('auditLog').getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

export default function NUPSTimeClock() {
    const [currentUser, setCurrentUser] = useState(null);
    const [userShifts, setUserShifts] = useState([]);
    const [auditLog, setAuditLog] = useState([]);
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    // Fetch current user from Base44
    useEffect(() => {
        const fetchUser = async () => {
            try {
                // This should be populated from the login flow, but we'll fetch it here
                // In a real app, you'd use a global state (Context, Redux, etc.)
                const user = await base44.auth.me();
                setCurrentUser(user || { stage_name: "Guest", legal_name: "Guest User", id: 'guest' });
            } catch (err) {
                console.error("Failed to fetch user", err);
                setCurrentUser({ stage_name: "Guest", legal_name: "Guest User", id: 'guest' });
            }
        };
        fetchUser();
    }, []);

    // Online status listener
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Load data from IndexedDB when user is available
    useEffect(() => {
        if (currentUser) {
            loadData();
        }
    }, [currentUser]);

    const loadData = async () => {
        if (!currentUser) return;
        try {
            const [allShifts, allAudits] = await Promise.all([getAllShifts(), getAuditLog()]);
            const currentUserShifts = allShifts.filter(s => s.entertainerId === currentUser.id);
            setUserShifts(currentUserShifts);
            setAuditLog(allAudits.sort((a, b) => b.timestamp - a.timestamp));
        } catch (err) {
            console.error('Failed to load data:', err);
        }
    };

    const activeShift = userShifts.find(s => !s.clockOut);

    const formatDuration = (mins) => {
        if (mins === null || isNaN(mins)) return '—';
        return `${Math.floor(mins / 60)}h ${mins % 60}m`;
    };

    const calcDuration = (start) => {
        const mins = Math.round((Date.now() - new Date(start).getTime()) / 60000);
        return formatDuration(mins);
    };

    const handleClockIn = async () => {
        if (!currentUser) return;

        const shift = {
            id: crypto.randomUUID(),
            entertainerId: currentUser.id,
            name: currentUser.stage_name,
            legalName: currentUser.legal_name,
            clockIn: new Date().toISOString(),
            clockOut: null,
            duration: null,
            syncStatus: isOnline ? 'synced' : 'pending'
        };

        const audit = {
            id: crypto.randomUUID(),
            action: 'CLOCK_IN',
            entertainerId: currentUser.id,
            name: currentUser.stage_name,
            timestamp: Date.now(),
            details: `Clocked in at ${new Date().toLocaleTimeString()}`
        };

        try {
            await saveShift(shift);
            await addAuditEntry(audit);
            toast.success(`${currentUser.stage_name} clocked in`);
            loadData();
        } catch (err) {
            toast.error('Failed to clock in');
        }
    };

    const handleClockOut = async (shiftToClockOut) => {
        const clockOutTime = new Date();
        const duration = Math.round((clockOutTime - new Date(shiftToClockOut.clockIn)) / 60000);

        const updated = {
            ...shiftToClockOut,
            clockOut: clockOutTime.toISOString(),
            duration,
            syncStatus: isOnline ? 'synced' : 'pending'
        };

        const audit = {
            id: crypto.randomUUID(),
            action: 'CLOCK_OUT',
            entertainerId: shiftToClockOut.entertainerId,
            name: shiftToClockOut.name,
            timestamp: Date.now(),
            details: `Clocked out after ${formatDuration(duration)}`
        };

        try {
            await saveShift(updated);
            await addAuditEntry(audit);
            toast.success(`${shiftToClockOut.name} clocked out - ${formatDuration(duration)}`);
            loadData();
        } catch (err) {
            toast.error('Failed to clock out');
        }
    };

    const exportData = () => {
        const data = { shifts: userShifts, auditLog, exportedAt: new Date().toISOString() };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `timeclock-${currentUser.stage_name}-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const todayShifts = userShifts.filter(s =>
        new Date(s.clockIn).toDateString() === new Date().toDateString()
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-white">
            <InstallPrompt variant="banner" />

            <div className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Clock className="w-6 h-6 text-cyan-400" />
                            Entertainer Time Clock
                        </h1>
                        <p className="text-slate-400 text-sm">
                            {activeShift ? 'Currently Clocked In' : 'Clocked Out'} • {todayShifts.length} shifts today
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <OnlineStatusIndicator />
                        <Button variant="outline" size="sm" onClick={exportData} className="border-slate-600">
                            <Download className="w-4 h-4 mr-1" /> Export My Data
                        </Button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    <Card className="bg-slate-900/50 border-purple-500/30">
                        <CardHeader>
                            <CardTitle>
                                {currentUser ? currentUser.stage_name : 'Loading...'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {currentUser ? (
                                <div className="space-y-6">
                                    <div className="text-center py-6">
                                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mx-auto flex items-center justify-center mb-4">
                                            <span className="text-3xl font-bold">
                                                {currentUser.stage_name?.charAt(0)}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold">{currentUser.stage_name}</h3>
                                        <p className="text-slate-400">{currentUser.legal_name}</p>
                                    </div>

                                    {activeShift ? (
                                        <>
                                            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
                                                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                                                <p className="font-medium text-green-400">Currently Clocked In</p>
                                                <p className="text-2xl font-bold mt-2">
                                                    {calcDuration(activeShift.clockIn)}
                                                </p>
                                            </div>
                                            <Button
                                                onClick={() => handleClockOut(activeShift)}
                                                className="w-full h-14 bg-gradient-to-r from-red-600 to-orange-600 text-lg"
                                            >
                                                <LogOut className="w-5 h-5 mr-2" /> Clock Out
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            onClick={handleClockIn}
                                            className="w-full h-14 bg-gradient-to-r from-green-600 to-cyan-600 text-lg"
                                        >
                                            <LogIn className="w-5 h-5 mr-2" /> Clock In
                                        </Button>
                                    )}

                                    {!isOnline && (
                                        <p className="text-xs text-amber-400 text-center">
                                            ⚠️ Offline mode - will sync when online
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-slate-500">
                                    <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>Loading user data...</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900/50 border-slate-700">
                        <CardHeader>
                            <CardTitle>My Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 max-h-[500px] overflow-y-auto">
                                {auditLog.filter(a => a.entertainerId === currentUser?.id).slice(0, 20).map(entry => (
                                    <div key={entry.id} className="p-3 bg-slate-800/50 rounded-lg text-sm">
                                        <div className="flex items-center justify-between mb-1">
                                            <Badge className={entry.action === 'CLOCK_IN' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                                                {entry.action}
                                            </Badge>
                                            <span className="text-xs text-slate-500">
                                                {new Date(entry.timestamp).toLocaleTimeString()}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-400">{entry.details}</p>
                                    </div>
                                ))}
                                {auditLog.filter(a => a.entertainerId === currentUser?.id).length === 0 && (
                                    <p className="text-slate-500 text-center py-8">No entries yet</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}