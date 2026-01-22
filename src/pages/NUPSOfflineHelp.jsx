/**
 * NUPS OFFLINE HELP PAGE
 * Explains offline-first architecture and benefits
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Wifi, WifiOff, Zap, Shield, HardDrive, RefreshCw, 
  Download, Smartphone, Monitor, Database, Lock, 
  CheckCircle, Clock, CloudOff, FileText, HelpCircle
} from 'lucide-react';
import { InstallCard } from '@/components/nups/InstallPrompt';
import OnlineStatusIndicator from '@/components/nups/OnlineStatusIndicator';

export default function NUPSOfflineHelp() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">How NUPS Works Offline</h1>
          <p className="text-slate-400">Understanding your offline-first point-of-sale system</p>
        </div>

        {/* Current Status */}
        <Card className="bg-slate-900/50 border-slate-700 mb-8">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Current Status:</span>
              <OnlineStatusIndicator />
            </div>
          </CardContent>
        </Card>

        {/* Core Concept */}
        <Card className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border-cyan-500/30 mb-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-cyan-500/20 rounded-xl">
                <Database className="w-8 h-8 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Your Data Stays on Your Device</h2>
                <p className="text-slate-300 leading-relaxed">
                  NUPS stores all your data directly on this device using IndexedDB, a powerful browser database. 
                  This means you can clock in employees, print vouchers, sign contracts, and manage operations 
                  <strong className="text-cyan-400"> even without an internet connection</strong>.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Explanation */}
        <Card className="bg-slate-900/50 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-purple-400" />
              Automatic Sync When Online
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-300">
              When your device reconnects to the internet, NUPS can sync changes to the cloud 
              (if cloud backup is enabled). Look for the status indicator:
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <Wifi className="w-4 h-4 text-green-400" />
                  <span className="font-semibold text-green-400">Online</span>
                </div>
                <p className="text-sm text-slate-400">All changes saving automatically</p>
              </div>
              
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full" />
                  <WifiOff className="w-4 h-4 text-red-400" />
                  <span className="font-semibold text-red-400">Offline</span>
                </div>
                <p className="text-sm text-slate-400">Changes saved locally, will sync when online</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefits Grid */}
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          Benefits of Offline-First Design
        </h2>
        
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-5">
              <Zap className="w-8 h-8 text-amber-400 mb-3" />
              <h3 className="font-bold text-white mb-2">Lightning Fast</h3>
              <p className="text-sm text-slate-400">
                No network delays. Every action is instant because data is stored locally on your device.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-5">
              <CloudOff className="w-8 h-8 text-blue-400 mb-3" />
              <h3 className="font-bold text-white mb-2">Works Anywhere</h3>
              <p className="text-sm text-slate-400">
                Poor cell signal? No WiFi? No problem. NUPS works perfectly in areas with unreliable connectivity.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-5">
              <Lock className="w-8 h-8 text-purple-400 mb-3" />
              <h3 className="font-bold text-white mb-2">Privacy-Focused</h3>
              <p className="text-sm text-slate-400">
                Your data stays on your device by default. You control if and when it syncs to the cloud.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-5">
              <HardDrive className="w-8 h-8 text-green-400 mb-3" />
              <h3 className="font-bold text-white mb-2">Complete Ownership</h3>
              <p className="text-sm text-slate-400">
                Export all your data as JSON anytime. Import it on another device. You own your data completely.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-5">
              <Shield className="w-8 h-8 text-cyan-400 mb-3" />
              <h3 className="font-bold text-white mb-2">Reliable Operations</h3>
              <p className="text-sm text-slate-400">
                Internet outages don't stop your business. NUPS keeps working and syncs when connectivity returns.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-5">
              <Clock className="w-8 h-8 text-pink-400 mb-3" />
              <h3 className="font-bold text-white mb-2">Auto-Sync</h3>
              <p className="text-sm text-slate-400">
                When online, changes can sync automatically. Or trigger manual sync anytime with one click.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Install Section */}
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Download className="w-5 h-5 text-cyan-400" />
          Install NUPS
        </h2>
        
        <div className="mb-8">
          <InstallCard />
        </div>

        {/* Manual Install Instructions */}
        <Card className="bg-slate-900/50 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white text-lg">Manual Installation Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-4">
              <Monitor className="w-6 h-6 text-cyan-400 mt-1" />
              <div>
                <h4 className="font-semibold text-white mb-2">Desktop (Chrome/Edge)</h4>
                <ol className="text-sm text-slate-400 space-y-1 list-decimal list-inside">
                  <li>Look for the install icon (⊕) in the address bar</li>
                  <li>Or click the "Install NUPS" button above</li>
                  <li>Click "Install" in the popup</li>
                  <li>NUPS will open as a standalone app</li>
                </ol>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <Smartphone className="w-6 h-6 text-cyan-400 mt-1" />
              <div>
                <h4 className="font-semibold text-white mb-2">Mobile (iOS/Android)</h4>
                <ol className="text-sm text-slate-400 space-y-1 list-decimal list-inside">
                  <li>Tap the share button in your browser</li>
                  <li>Select "Add to Home Screen"</li>
                  <li>Tap "Add" to confirm</li>
                  <li>Launch NUPS from your home screen</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-amber-400" />
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-4 mb-8">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-5">
              <h4 className="font-semibold text-white mb-2">What happens if my device breaks?</h4>
              <p className="text-sm text-slate-400">
                If cloud sync is enabled, your data is backed up automatically. Otherwise, make sure to 
                export your data regularly using the Export function in Settings.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-5">
              <h4 className="font-semibold text-white mb-2">Can I use NUPS on multiple devices?</h4>
              <p className="text-sm text-slate-400">
                Yes! Each device stores data locally. With cloud sync enabled, data synchronizes 
                across all devices where you're logged in.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-5">
              <h4 className="font-semibold text-white mb-2">How much data can NUPS store?</h4>
              <p className="text-sm text-slate-400">
                IndexedDB can store several gigabytes of data. This is more than enough for years of 
                time clock entries, contracts, and vouchers.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-5">
              <h4 className="font-semibold text-white mb-2">Is my data secure?</h4>
              <p className="text-sm text-slate-400">
                Yes. Data is encrypted in the browser, and all network communication uses HTTPS. 
                Sensitive fields (IDs, SSN) are only visible to admins with proper access levels.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-5">
              <h4 className="font-semibold text-white mb-2">How do I back up my data?</h4>
              <p className="text-sm text-slate-400">
                Go to any NUPS page and click the "Export" button. This downloads a JSON file 
                containing all your data. Keep this file safe for backup purposes.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Data Storage Info */}
        <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <FileText className="w-8 h-8 text-purple-400" />
              <div>
                <h3 className="font-bold text-white mb-2">What Data is Stored Locally?</h3>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• <strong>Time Clock:</strong> All clock in/out entries and shift history</li>
                  <li>• <strong>Vouchers:</strong> Printed batches, serial numbers, redemption status</li>
                  <li>• <strong>Contracts:</strong> Signed documents, signatures, hash seals</li>
                  <li>• <strong>Audit Log:</strong> All actions with timestamps</li>
                  <li>• <strong>Settings:</strong> Your preferences and configurations</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}