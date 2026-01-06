/**
 * PWA INSTALL PROMPT
 * Prompts users to install NUPS as standalone app
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, X, Smartphone, Monitor, CheckCircle, Zap } from 'lucide-react';

export default function InstallPrompt({ variant = 'banner' }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if previously dismissed
    const dismissedTime = localStorage.getItem('nups_install_dismissed');
    if (dismissedTime && Date.now() - parseInt(dismissedTime) < 86400000) {
      setDismissed(true);
    }

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('[NUPS] App installed');
    }
    
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('nups_install_dismissed', Date.now().toString());
  };

  // Already installed
  if (isInstalled) {
    if (variant === 'badge') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
          <CheckCircle className="w-3 h-3" /> Installed
        </span>
      );
    }
    return null;
  }

  // Not installable or dismissed
  if (!isInstallable || dismissed) return null;

  // Button variant
  if (variant === 'button') {
    return (
      <Button onClick={handleInstall} className="bg-gradient-to-r from-cyan-600 to-blue-600">
        <Download className="w-4 h-4 mr-2" />
        Install NUPS
      </Button>
    );
  }

  // Compact button
  if (variant === 'compact') {
    return (
      <Button size="sm" variant="outline" onClick={handleInstall} className="border-cyan-500/50 text-cyan-400">
        <Download className="w-4 h-4 mr-1" />
        Install
      </Button>
    );
  }

  // Banner variant (default)
  return (
    <div className="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 border-b border-cyan-500/30 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/20 rounded-lg">
            <Zap className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">Install NUPS</h3>
            <p className="text-xs text-slate-400">Work offline • Faster access • No app store needed</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button onClick={handleInstall} size="sm" className="bg-cyan-600 hover:bg-cyan-700">
            <Download className="w-4 h-4 mr-1" />
            Install Now
          </Button>
          <Button onClick={handleDismiss} size="sm" variant="ghost" className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Full install card for settings page
export function InstallCard() {
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    setIsInstalled(window.matchMedia('(display-mode: standalone)').matches);
  }, []);

  if (isInstalled) {
    return (
      <Card className="bg-green-900/20 border-green-500/30">
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">NUPS is Installed</h3>
          <p className="text-sm text-slate-400">Running as standalone app</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900/50 border-cyan-500/30">
      <CardContent className="p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Download className="w-5 h-5 text-cyan-400" />
          Install NUPS
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg">
            <Monitor className="w-5 h-5 text-cyan-400 mt-0.5" />
            <div>
              <p className="font-medium text-white text-sm">Desktop</p>
              <p className="text-xs text-slate-400">Click install icon in address bar or use button below</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg">
            <Smartphone className="w-5 h-5 text-cyan-400 mt-0.5" />
            <div>
              <p className="font-medium text-white text-sm">Mobile</p>
              <p className="text-xs text-slate-400">Share → Add to Home Screen</p>
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-6 text-sm">
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle className="w-4 h-4 text-green-400" />
            Works 100% offline
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle className="w-4 h-4 text-green-400" />
            Launches instantly from home screen
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle className="w-4 h-4 text-green-400" />
            No app store required
          </div>
        </div>

        <InstallPrompt variant="button" />
      </CardContent>
    </Card>
  );
}