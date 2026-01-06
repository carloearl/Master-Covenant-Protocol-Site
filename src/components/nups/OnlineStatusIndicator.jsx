/**
 * ONLINE STATUS INDICATOR
 * Shows online/offline status with last synced timestamp
 */

import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OnlineStatusIndicator({ showSyncButton = true, compact = false }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSynced, setLastSynced] = useState(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    // Load last synced from localStorage
    const stored = localStorage.getItem('nups_last_synced');
    if (stored) setLastSynced(new Date(stored));

    const handleOnline = () => {
      setIsOnline(true);
      const now = new Date();
      setLastSynced(now);
      localStorage.setItem('nups_last_synced', now.toISOString());
    };

    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleManualSync = () => {
    if (!isOnline) return;
    setSyncing(true);
    console.log('[NUPS] Manual sync triggered');
    
    // Simulate sync delay
    setTimeout(() => {
      const now = new Date();
      setLastSynced(now);
      localStorage.setItem('nups_last_synced', now.toISOString());
      setSyncing(false);
    }, 1000);
  };

  const formatLastSynced = () => {
    if (!lastSynced) return 'Never';
    const diff = Date.now() - lastSynced.getTime();
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    return lastSynced.toLocaleTimeString();
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs ${
        isOnline ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
      }`}>
        {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
        {isOnline ? 'Online' : 'Offline'}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
      <div className={`flex items-center gap-2 ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
        <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
        {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
        <span className="font-medium text-sm">{isOnline ? 'Online' : 'Offline'}</span>
      </div>

      <div className="text-xs text-slate-500 border-l border-slate-600 pl-3">
        Last synced: {formatLastSynced()}
      </div>

      {showSyncButton && isOnline && (
        <Button
          size="sm"
          variant="ghost"
          onClick={handleManualSync}
          disabled={syncing}
          className="h-7 px-2 text-slate-400 hover:text-white"
        >
          <RefreshCw className={`w-3 h-3 ${syncing ? 'animate-spin' : ''}`} />
        </Button>
      )}
    </div>
  );
}