/**
 * Offline Help Content - extracted from NUPSOfflineHelp page
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, Wifi, WifiOff, Database, RefreshCw, Download, Shield, Clock, Receipt, FileText } from 'lucide-react';
import { InstallCard } from '@/components/nups/InstallPrompt';

export default function NUPSOfflineHelpContent() {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Install Card */}
        <InstallCard />

        {/* Offline Capabilities */}
        <Card className="bg-slate-900/50 border-cyan-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <WifiOff className="w-5 h-5 text-cyan-400" />
              Offline Capabilities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-green-400 mt-0.5" />
              <div>
                <p className="text-white font-medium">Time Clock</p>
                <p className="text-xs text-slate-400">Clock in/out works 100% offline. Data syncs when online.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Receipt className="w-5 h-5 text-green-400 mt-0.5" />
              <div>
                <p className="text-white font-medium">Vouchers</p>
                <p className="text-xs text-slate-400">Print & redeem vouchers offline. Serial validation works locally.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-amber-400 mt-0.5" />
              <div>
                <p className="text-white font-medium">Contracts</p>
                <p className="text-xs text-slate-400">Requires online connection to save signatures to server.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* How It Works */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-purple-400" />
            How Offline Storage Works
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <Badge className="bg-cyan-500/20 text-cyan-400 mb-2">Step 1</Badge>
              <p className="text-white font-medium">Local Storage</p>
              <p className="text-xs text-slate-400">All data is saved to IndexedDB on your device immediately.</p>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <Badge className="bg-purple-500/20 text-purple-400 mb-2">Step 2</Badge>
              <p className="text-white font-medium">Sync Queue</p>
              <p className="text-xs text-slate-400">Offline changes are queued with 'pending' status.</p>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <Badge className="bg-green-500/20 text-green-400 mb-2">Step 3</Badge>
              <p className="text-white font-medium">Auto Sync</p>
              <p className="text-xs text-slate-400">When online, pending data syncs automatically.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Troubleshooting */}
      <Card className="bg-slate-900/50 border-amber-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            Troubleshooting
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <p className="text-white font-medium mb-2">Data not syncing?</p>
              <ul className="text-sm text-slate-400 space-y-1 list-disc list-inside">
                <li>Check your internet connection</li>
                <li>Look for the sync button in the header</li>
                <li>Export data as backup before clearing cache</li>
              </ul>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <p className="text-white font-medium mb-2">App not working offline?</p>
              <ul className="text-sm text-slate-400 space-y-1 list-disc list-inside">
                <li>Make sure you've installed the app (see above)</li>
                <li>Visit each page once while online to cache</li>
                <li>Clear browser cache and reinstall if issues persist</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Note */}
      <Card className="bg-slate-900/50 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-400" />
            Security & Privacy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400 text-sm">
            All offline data is stored locally on your device using IndexedDB encryption. 
            Sensitive data like contract signatures are hashed with SHA-256 before storage. 
            No data leaves your device until you're online and sync is triggered.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}