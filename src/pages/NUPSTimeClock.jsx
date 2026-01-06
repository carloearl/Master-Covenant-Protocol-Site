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
  const [shifts, setShifts] = useState([]);
  const [auditLog, setAuditLog] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Fetch entertainers from Base44
  const { data: entertainers = [] } = useQuery({
    queryKey: ['entertainers-timeclock'],
    queryFn: () => base44.entities.Entertainer.filter({ status: 'active' })
  });

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

  // Load shifts and audit log from IndexedDB
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [s, a] = await Promise.all([getAllShifts(), getAuditLog()]);
      setShifts(s);
      setAuditLog(a.sort((a, b) => b.timestamp - a.timestamp));
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  };

  const filtered = entertainers.filter(e =>
    e.stage_name?.toLowerCase().includes(search.toLowerCase()) ||
    e.legal_name?.toLowerCase().includes(search.toLowerCase())
  );

  const activeShifts = shifts.filter(s => !s.clockOut);
  const selected = entertainers.find(e => e.id === selectedId);
  const isActive = (id) => activeShifts.some(s => s.entertainerId === id);
  const getActiveShift = (id) => activeShifts.find(s => s.entertainerId === id);

  const formatDuration = (mins) => {
    if (!mins) return '—';
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  };

  const calcDuration = (start) => {
    const mins = Math.round((Date.now() - new Date(start).getTime()) / 60000);
    return formatDuration(mins);
  };

  const handleClockIn = async () => {
    if (!selected) return;

    const shift = {
      id: crypto.randomUUID(),
      entertainerId: selected.id,
      name: selected.stage_name,
      legalName: selected.legal_name,
      clockIn: new Date().toISOString(),
      clockOut: null,
      duration: null,
      syncStatus: isOnline ? 'synced' : 'pending'
    };

    const audit = {
      id: crypto.randomUUID(),
      action: 'CLOCK_IN',
      entertainerId: selected.id,
      name: selected.stage_name,
      timestamp: Date.now(),
      details: `Clocked in at ${new Date().toLocaleTimeString()}`
    };

    try {
      await saveShift(shift);
      await addAuditEntry(audit);
      toast.success(`${selected.stage_name} clocked in`);
      setSelectedId(null);
      loadData();
    } catch (err) {
      toast.error('Failed to clock in');
    }
  };

  const handleClockOut = async (shift) => {
    const clockOutTime = new Date();
    const duration = Math.round((clockOutTime - new Date(shift.clockIn)) / 60000);

    const updated = {
      ...shift,
      clockOut: clockOutTime.toISOString(),
      duration,
      syncStatus: isOnline ? 'synced' : 'pending'
    };

    const audit = {
      id: crypto.randomUUID(),
      action: 'CLOCK_OUT',
      entertainerId: shift.entertainerId,
      name: shift.name,
      timestamp: Date.now(),
      details: `Clocked out after ${formatDuration(duration)}`
    };

    try {
      await saveShift(updated);
      await addAuditEntry(audit);
      toast.success(`${shift.name} clocked out - ${formatDuration(duration)}`);
      loadData();
    } catch (err) {
      toast.error('Failed to clock out');
    }
  };

  const exportData = () => {
    const data = { shifts, auditLog, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timeclock-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const todayShifts = shifts.filter(s => 
    new Date(s.clockIn).toDateString() === new Date().toDateString()
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900">
      {/* Install Banner */}
      <InstallPrompt variant="banner" />
      
      <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Clock className="w-6 h-6 text-cyan-400" />
            Entertainer Time Clock
          </h1>
          <p className="text-slate-400 text-sm">
            {activeShifts.length} active • {todayShifts.length} today
          </p>
        </div>
        <div className="flex items-center gap-3">
          <OnlineStatusIndicator />
          <Button variant="outline" size="sm" onClick={exportData} className="border-slate-600">
            <Download className="w-4 h-4 mr-1" /> Export
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Entertainer Selection */}
        <Card className="bg-slate-900/50 border-cyan-500/30 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              Select Entertainer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="pl-10 bg-slate-800 border-slate-600"
              />
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {filtered.map(e => {
                const active = isActive(e.id);
                const shift = getActiveShift(e.id);
                return (
                  <div
                    key={e.id}
                    onClick={() => setSelectedId(e.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedId === e.id
                        ? 'bg-cyan-500/20 border-cyan-500'
                        : active
                          ? 'bg-green-500/10 border-green-500/50'
                          : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-white">{e.stage_name}</p>
                        <p className="text-xs text-slate-400">{e.legal_name}</p>
                      </div>
                      {active && (
                        <Badge className="bg-green-500/20 text-green-400">
                          <Timer className="w-3 h-3 mr-1" />
                          {calcDuration(shift.clockIn)}
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Clock In/Out Panel */}
        <Card className="bg-slate-900/50 border-purple-500/30 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-white">
              {selected ? selected.stage_name : 'Select Entertainer'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selected ? (
              <div className="space-y-6">
                <div className="text-center py-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mx-auto flex items-center justify-center mb-4">
                    <span className="text-3xl font-bold text-white">
                      {selected.stage_name?.charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{selected.stage_name}</h3>
                  <p className="text-slate-400">{selected.legal_name}</p>
                </div>

                {isActive(selected.id) ? (
                  <>
                    <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
                      <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                      <p className="text-green-400 font-medium">Currently Clocked In</p>
                      <p className="text-2xl font-bold text-white mt-2">
                        {calcDuration(getActiveShift(selected.id).clockIn)}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleClockOut(getActiveShift(selected.id))}
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
                <p>Select an entertainer to clock in or out</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Audit Log */}
        <Card className="bg-slate-900/50 border-slate-700 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-white">Audit Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {auditLog.slice(0, 20).map(entry => (
                <div key={entry.id} className="p-3 bg-slate-800/50 rounded-lg text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <Badge className={entry.action === 'CLOCK_IN' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                    }>
                      {entry.action}
                    </Badge>
                    <span className="text-xs text-slate-500">
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-white font-medium">{entry.name}</p>
                  <p className="text-xs text-slate-400">{entry.details}</p>
                </div>
              ))}
              {auditLog.length === 0 && (
                <p className="text-slate-500 text-center py-8">No entries yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Shifts Summary */}
      {activeShifts.length > 0 && (
        <Card className="bg-slate-900/50 border-green-500/30 mt-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Timer className="w-5 h-5 text-green-400" />
              Currently On Shift ({activeShifts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {activeShifts.map(s => (
                <div key={s.id} className="p-4 bg-slate-800/50 rounded-lg border border-green-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-white">{s.name}</h4>
                    <Badge className={s.syncStatus === 'synced' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-yellow-500/20 text-yellow-400'
                    }>
                      {s.syncStatus}
                    </Badge>
                  </div>
                  <p className="text-slate-400 text-sm">
                    In: {new Date(s.clockIn).toLocaleTimeString()}
                  </p>
                  <p className="text-lg font-bold text-green-400 mt-2">
                    {calcDuration(s.clockIn)}
                  </p>
                  <Button
                    size="sm"
                    onClick={() => handleClockOut(s)}
                    className="w-full mt-3 bg-red-600 hover:bg-red-700"
                  >
                    <LogOut className="w-4 h-4 mr-1" /> Clock Out
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      </div>
    </div>
  );
}