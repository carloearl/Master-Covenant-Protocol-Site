/**
 * NUPS - Unified Module
 * Single entry point with tabbed views for Time Clock, Vouchers, Contracts, Help
 */

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Receipt, FileText, HelpCircle, Shield } from 'lucide-react';
import OnlineStatusIndicator from '@/components/nups/OnlineStatusIndicator';
import InstallPrompt from '@/components/nups/InstallPrompt';

// Import existing page content as components
import NUPSTimeClockContent from '@/components/nups/TimeClockContent';
import NUPSVoucherContent from '@/components/nups/VoucherContent';
import NUPSContractContent from '@/components/nups/ContractContent';
import NUPSOfflineHelpContent from '@/components/nups/OfflineHelpContent';

export default function NUPS() {
  const [activeTab, setActiveTab] = useState('timeclock');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900">
      <InstallPrompt variant="banner" />
      
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Shield className="w-6 h-6 text-purple-400" />
              N.U.P.S. 2.0
            </h1>
            <p className="text-slate-400 text-sm">Nexus Universal Point-of-Sale System</p>
          </div>
          <OnlineStatusIndicator />
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-900/50 border border-slate-700 p-1 flex flex-wrap gap-1">
            <TabsTrigger value="timeclock" className="flex items-center gap-2 data-[state=active]:bg-cyan-600">
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">Time Clock</span>
            </TabsTrigger>
            <TabsTrigger value="vouchers" className="flex items-center gap-2 data-[state=active]:bg-amber-600">
              <Receipt className="w-4 h-4" />
              <span className="hidden sm:inline">Vouchers</span>
            </TabsTrigger>
            <TabsTrigger value="contracts" className="flex items-center gap-2 data-[state=active]:bg-purple-600">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Contracts</span>
            </TabsTrigger>
            <TabsTrigger value="help" className="flex items-center gap-2 data-[state=active]:bg-slate-600">
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Offline Help</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timeclock">
            <NUPSTimeClockContent />
          </TabsContent>

          <TabsContent value="vouchers">
            <NUPSVoucherContent />
          </TabsContent>

          <TabsContent value="contracts">
            <NUPSContractContent />
          </TabsContent>

          <TabsContent value="help">
            <NUPSOfflineHelpContent />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}