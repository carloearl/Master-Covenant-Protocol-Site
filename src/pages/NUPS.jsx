/**
 * NUPS 2.0 - Unified Operations Module
 * OMEGA DIRECTIVE: SOLE authoritative operational interface
 * All POS, VIP, Staff, Vouchers, Contracts, Reports, Inventory consolidated
 */

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, Receipt, FileText, HelpCircle, Shield, ShoppingCart, 
  Package, Users, DoorOpen, BarChart3, Brain, UserCheck, Loader2, Boxes
} from 'lucide-react';
import OnlineStatusIndicator from '@/components/nups/OnlineStatusIndicator';
import InstallPrompt from '@/components/nups/InstallPrompt';
import { useAccessControl } from '@/components/nups/ProtectedField';

// Lazy load all content components
const TimeClockContent = lazy(() => import('@/components/nups/TimeClockContent'));
const VoucherContent = lazy(() => import('@/components/nups/VoucherContent'));
const ContractContent = lazy(() => import('@/components/nups/ContractContent'));
const OfflineHelpContent = lazy(() => import('@/components/nups/OfflineHelpContent'));
const POSCashRegister = lazy(() => import('@/components/nups/POSCashRegister'));
const ProductManagement = lazy(() => import('@/components/nups/ProductManagement'));
const BatchManagement = lazy(() => import('@/components/nups/BatchManagement'));
const TransactionHistory = lazy(() => import('@/components/nups/TransactionHistory'));
const ZReportGenerator = lazy(() => import('@/components/nups/ZReportGenerator'));
const VIPMemberForm = lazy(() => import('@/components/nups/VIPMemberForm'));
const GuestTracking = lazy(() => import('@/components/nups/GuestTracking'));
const VIPRoomManagement = lazy(() => import('@/components/nups/VIPRoomManagement'));
const VIPAIRecommendations = lazy(() => import('@/components/nups/VIPAIRecommendations'));
const EntertainerCheckIn = lazy(() => import('@/components/nups/EntertainerCheckIn'));
const EntertainerContract = lazy(() => import('@/components/nups/EntertainerContract'));
const AISalesReports = lazy(() => import('@/components/nups/AISalesReports'));
const AIStaffPerformance = lazy(() => import('@/components/nups/AIStaffPerformance'));
// AIInsightsPanel exports named components - import the VoucherAIPanel for AI tab
const AIInsightsPanelLazy = lazy(() => import('@/components/nups/AIInsightsPanel').then(mod => ({ default: mod.VoucherAIPanel })));
const InventoryManagement = lazy(() => import('@/components/nups/InventoryManagement'));

// Audit logging utility
async function logAuditEvent(action, details, role, sessionId) {
  const entry = {
    id: crypto.randomUUID(),
    action,
    details,
    role,
    sessionId: sessionId || sessionStorage.getItem('nups_session_id') || crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    deviceInfo: navigator.userAgent
  };
  
  // Store in IndexedDB
  try {
    const db = await openAuditDB();
    const tx = db.transaction('auditLog', 'readwrite');
    tx.objectStore('auditLog').add(entry);
    await new Promise((r, e) => { tx.oncomplete = r; tx.onerror = e; });
  } catch (err) {
    console.error('Audit log failed:', err);
  }
  return entry;
}

async function openAuditDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('NUPS_AuditLog', 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('auditLog')) {
        db.createObjectStore('auditLog', { keyPath: 'id' });
      }
    };
  });
}

function TabLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
    </div>
  );
}

export default function NUPS() {
  const [activeTab, setActiveTab] = useState('timeclock');
  const { isAdmin, isManager, isStaff, user, userRole } = useAccessControl();
  const [sessionId] = useState(() => {
    let sid = sessionStorage.getItem('nups_session_id');
    if (!sid) {
      sid = crypto.randomUUID();
      sessionStorage.setItem('nups_session_id', sid);
    }
    return sid;
  });

  // Log session start
  useEffect(() => {
    if (user?.email) {
      logAuditEvent('SESSION_START', `User ${user.email} opened NUPS`, userRole, sessionId);
    }
  }, [user?.email]);

  // Role-based tab configuration
  // Admin: all tabs
  // Manager: all except AI Insights
  // Staff: Time Clock, POS, VIP Members, VIP Rooms, Entertainers, Help
  // Entertainer: Time Clock, Help only
  const tabs = [
    { id: 'timeclock', label: 'Time Clock', icon: Clock, color: 'cyan', roles: ['admin', 'manager', 'staff', 'entertainer', 'user'] },
    { id: 'pos', label: 'POS', icon: ShoppingCart, color: 'green', roles: ['admin', 'manager', 'staff'] },
    { id: 'vouchers', label: 'Vouchers', icon: Receipt, color: 'amber', roles: ['admin', 'manager'] },
    { id: 'contracts', label: 'Contracts', icon: FileText, color: 'purple', roles: ['admin', 'manager'] },
    { id: 'vip', label: 'VIP Members', icon: Users, color: 'pink', roles: ['admin', 'manager', 'staff'] },
    { id: 'rooms', label: 'VIP Rooms', icon: DoorOpen, color: 'indigo', roles: ['admin', 'manager', 'staff'] },
    { id: 'entertainers', label: 'Entertainers', icon: UserCheck, color: 'rose', roles: ['admin', 'manager', 'staff'] },
    { id: 'inventory', label: 'Inventory', icon: Boxes, color: 'teal', roles: ['admin', 'manager'] },
    { id: 'products', label: 'Products', icon: Package, color: 'orange', roles: ['admin', 'manager'] },
    { id: 'reports', label: 'Reports', icon: BarChart3, color: 'blue', roles: ['admin', 'manager'] },
    { id: 'ai', label: 'AI Insights', icon: Brain, color: 'violet', roles: ['admin'] },
    { id: 'help', label: 'Help', icon: HelpCircle, color: 'slate', roles: ['admin', 'manager', 'staff', 'entertainer', 'user'] },
  ];

  const currentRole = userRole?.toLowerCase() || 'user';
  const visibleTabs = (tabs || []).filter(t => {
    if (!t.roles || !Array.isArray(t.roles)) return isAdmin;
    return t.roles.includes(currentRole) || isAdmin;
  });

  // Show loader while auth is loading
  if (!visibleTabs || visibleTabs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
      </div>
    );
  }

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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-slate-900/50 border border-slate-700 p-1 flex flex-wrap gap-1 h-auto">
            {visibleTabs.map(tab => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id} 
                className={`flex items-center gap-1.5 text-xs sm:text-sm data-[state=active]:bg-${tab.color}-600`}
                onClick={() => logAuditEvent('TAB_ACCESS', `Accessed ${tab.label}`, userRole, sessionId)}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.roles && tab.roles.length <= 2 && <Badge className="ml-1 text-[10px] bg-slate-600 px-1">Admin</Badge>}
              </TabsTrigger>
            ))}
          </TabsList>

          <Suspense fallback={<TabLoader />}>
            {/* Time Clock */}
            <TabsContent value="timeclock">
              <TimeClockContent />
            </TabsContent>

            {/* POS */}
            <TabsContent value="pos">
              <div className="space-y-6">
                <Tabs defaultValue="register" className="space-y-4">
                  <TabsList className="bg-slate-800/50 border border-slate-700">
                    <TabsTrigger value="register">Cash Register</TabsTrigger>
                    <TabsTrigger value="batch">Batch/Drawer</TabsTrigger>
                    <TabsTrigger value="history">Transactions</TabsTrigger>
                    <TabsTrigger value="zreport">Z-Report</TabsTrigger>
                  </TabsList>
                  <TabsContent value="register"><POSCashRegister user={user} /></TabsContent>
                  <TabsContent value="batch"><BatchManagement user={user} /></TabsContent>
                  <TabsContent value="history"><TransactionHistory transactions={[]} /></TabsContent>
                  <TabsContent value="zreport"><ZReportGenerator user={user} /></TabsContent>
                </Tabs>
              </div>
            </TabsContent>

            {/* Vouchers */}
            <TabsContent value="vouchers">
              <VoucherContent />
            </TabsContent>

            {/* Contracts */}
            <TabsContent value="contracts">
              <div className="space-y-6">
                <Tabs defaultValue="vip" className="space-y-4">
                  <TabsList className="bg-slate-800/50 border border-slate-700">
                    <TabsTrigger value="vip">VIP Contracts</TabsTrigger>
                    <TabsTrigger value="entertainer">Entertainer Contracts</TabsTrigger>
                  </TabsList>
                  <TabsContent value="vip"><ContractContent /></TabsContent>
                  <TabsContent value="entertainer"><EntertainerContract /></TabsContent>
                </Tabs>
              </div>
            </TabsContent>

            {/* VIP Members */}
            <TabsContent value="vip">
              <div className="space-y-6">
                <Tabs defaultValue="tracking" className="space-y-4">
                  <TabsList className="bg-slate-800/50 border border-slate-700">
                    <TabsTrigger value="tracking">Guest Tracking</TabsTrigger>
                    <TabsTrigger value="register">Register New</TabsTrigger>
                    <TabsTrigger value="ai">AI Recommendations</TabsTrigger>
                  </TabsList>
                  <TabsContent value="tracking"><GuestTracking /></TabsContent>
                  <TabsContent value="register"><VIPMemberForm /></TabsContent>
                  <TabsContent value="ai"><VIPAIRecommendations /></TabsContent>
                </Tabs>
              </div>
            </TabsContent>

            {/* VIP Rooms */}
            <TabsContent value="rooms">
              <VIPRoomManagement />
            </TabsContent>

            {/* Entertainers */}
            <TabsContent value="entertainers">
              <EntertainerCheckIn />
            </TabsContent>

            {/* Inventory (Admin/Manager) */}
            <TabsContent value="inventory">
              <InventoryManagement products={[]} />
            </TabsContent>

            {/* Products (Admin/Manager) */}
            <TabsContent value="products">
              <ProductManagement />
            </TabsContent>

            {/* Reports (Admin/Manager) */}
            <TabsContent value="reports">
              <div className="space-y-6">
                <Tabs defaultValue="sales" className="space-y-4">
                  <TabsList className="bg-slate-800/50 border border-slate-700">
                    <TabsTrigger value="sales">AI Sales Reports</TabsTrigger>
                    <TabsTrigger value="staff">Staff Performance</TabsTrigger>
                    <TabsTrigger value="zreports">Z-Reports</TabsTrigger>
                  </TabsList>
                  <TabsContent value="sales"><AISalesReports /></TabsContent>
                  <TabsContent value="staff"><AIStaffPerformance /></TabsContent>
                  <TabsContent value="zreports"><ZReportGenerator user={user} /></TabsContent>
                </Tabs>
              </div>
            </TabsContent>

            {/* AI Insights (Admin) */}
            <TabsContent value="ai">
              <AIInsightsPanelLazy venue="DP" />
            </TabsContent>

            {/* Offline Help */}
            <TabsContent value="help">
              <OfflineHelpContent />
            </TabsContent>
          </Suspense>
        </Tabs>
      </div>
    </div>
  );
}