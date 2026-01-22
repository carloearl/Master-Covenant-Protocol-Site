import React, { useState, useEffect, lazy, Suspense } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, DollarSign, ShoppingCart, Users, LogOut, 
  Printer, Wallet, DoorOpen, FileText, UserCheck,
  Package, BarChart3, Settings, Loader2, Brain, Crown, Plus
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

// Lazy load components
const POSCashRegister = lazy(() => import("../components/nups/POSCashRegister.jsx"));
const VIPRoomManagement = lazy(() => import("../components/nups/VIPRoomManagement.jsx"));
const EntertainerCheckIn = lazy(() => import("../components/nups/EntertainerCheckIn.jsx"));
const GuestTracking = lazy(() => import("../components/nups/GuestTracking.jsx"));
const ZReportGenerator = lazy(() => import("../components/nups/ZReportGenerator.jsx"));
const ProductManagement = lazy(() => import("../components/nups/ProductManagement.jsx"));
const VoucherPrinter4Bill = lazy(() => import("../components/nups/VoucherPrinter4Bill.jsx"));
const VoucherPrinter5Sheet = lazy(() => import("../components/nups/VoucherPrinter5Sheet.jsx"));
const BatchManagement = lazy(() => import("../components/nups/BatchManagement.jsx"));
const TransactionHistory = lazy(() => import("../components/nups/TransactionHistory.jsx"));
const AISalesReports = lazy(() => import("../components/nups/AISalesReports.jsx"));
const AIStaffPerformance = lazy(() => import("../components/nups/AIStaffPerformance.jsx"));
const VIPMemberForm = lazy(() => import("../components/nups/VIPMemberForm.jsx"));
const VIPReceiptCard = lazy(() => import("../components/nups/VIPReceiptCard.jsx"));
const VIPContractCard = lazy(() => import("../components/nups/VIPContractCard.jsx"));
const VIPAIRecommendations = lazy(() => import("../components/nups/VIPAIRecommendations.jsx"));

const LoadingFallback = () => (
  <div className="flex items-center justify-center py-12">
    <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
  </div>
);

// VIP Members Management Tab
function VIPMembersTab() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = React.useState(false);
  const [editingMember, setEditingMember] = React.useState(null);
  const [selectedMember, setSelectedMember] = React.useState(null);
  const [viewMode, setViewMode] = React.useState('list'); // list | profile | contract

  const { data: vipMembers = [], refetch } = useQuery({
    queryKey: ['vip-members-all'],
    queryFn: () => base44.entities.VIPGuest.list('-created_date', 200)
  });

  const { data: allTransactions = [] } = useQuery({
    queryKey: ['all-transactions'],
    queryFn: () => base44.entities.POSTransaction.list('-created_date', 500)
  });

  const { data: entertainers = [] } = useQuery({
    queryKey: ['entertainers-list'],
    queryFn: () => base44.entities.Entertainer.list()
  });

  const { data: roomSessions = [] } = useQuery({
    queryKey: ['all-room-sessions'],
    queryFn: () => base44.entities.VIPRoom.list('-created_date', 200)
  });

  const todayDate = new Date().toDateString();
  const activeMembers = vipMembers.filter(m => m.status === 'in_building');

  const getMemberStats = (member) => {
    const memberTxns = allTransactions.filter(t => 
      t.customer_id === member.id || t.notes?.toLowerCase().includes(member.guest_name?.toLowerCase())
    );
    const todayTxns = memberTxns.filter(t => new Date(t.created_date).toDateString() === todayDate);
    const todayRooms = roomSessions.filter(r => 
      r.guest_name?.toLowerCase().includes(member.guest_name?.toLowerCase()) &&
      new Date(r.start_time).toDateString() === todayDate
    );
    return {
      todaySpend: todayTxns.reduce((sum, t) => sum + (t.total || 0), 0),
      lifetimeSpend: memberTxns.reduce((sum, t) => sum + (t.total || 0), 0),
      todayTransactions: todayTxns,
      todayRooms,
      totalVisits: memberTxns.length
    };
  };

  if (showForm || editingMember) {
    return (
      <Card className="bg-slate-900/50 border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-white">
            {editingMember ? 'Edit VIP Member' : 'Register New VIP Member'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <VIPMemberForm 
            guest={editingMember}
            onSave={() => {
              setShowForm(false);
              setEditingMember(null);
              refetch();
            }}
            onCancel={() => {
              setShowForm(false);
              setEditingMember(null);
            }}
          />
        </CardContent>
      </Card>
    );
  }

  if (selectedMember && viewMode === 'profile') {
    const stats = getMemberStats(selectedMember);
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => setSelectedMember(null)} className="border-slate-600">
          ← Back to Members
        </Button>
        <div className="grid lg:grid-cols-2 gap-6">
          <VIPReceiptCard 
            guest={selectedMember}
            transactions={stats.todayTransactions}
            roomSessions={stats.todayRooms}
            entertainers={entertainers}
            date={new Date()}
          />
          <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <VIPAIRecommendations 
                guest={selectedMember}
                todaySpend={stats.todaySpend}
                lifetimeSpend={stats.lifetimeSpend}
                roomSessions={stats.todayRooms}
              />
            </CardContent>
          </Card>
        </div>
        <VIPContractCard guest={selectedMember} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Crown className="w-6 h-6 text-amber-400" />
            VIP Member Management
          </h2>
          <p className="text-sm text-slate-400">{vipMembers.length} total members • {activeMembers.length} currently here</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-gradient-to-r from-amber-500 to-pink-500">
          <Plus className="w-4 h-4 mr-2" />
          Register VIP
        </Button>
      </div>

      {/* Active Members Highlight */}
      {activeMembers.length > 0 && (
        <Card className="bg-gradient-to-r from-green-900/30 to-cyan-900/30 border-green-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-green-400">Currently In Building</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {activeMembers.map(m => (
                <Badge 
                  key={m.id} 
                  className="bg-green-500/20 text-green-300 cursor-pointer hover:bg-green-500/30"
                  onClick={() => { setSelectedMember(m); setViewMode('profile'); }}
                >
                  {m.display_name || m.guest_name} • {m.current_location}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Members Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vipMembers.map(member => {
          const stats = getMemberStats(member);
          return (
            <Card 
              key={member.id} 
              className={`bg-slate-900/50 border-slate-700 hover:border-amber-500/50 transition-all cursor-pointer ${
                member.status === 'in_building' ? 'ring-1 ring-green-500/50' : ''
              }`}
              onClick={() => { setSelectedMember(member); setViewMode('profile'); }}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      member.vip_tier === 'Diamond' ? 'bg-gradient-to-br from-cyan-400 to-blue-500' :
                      member.vip_tier === 'Platinum' ? 'bg-gradient-to-br from-slate-300 to-slate-500' :
                      member.vip_tier === 'Gold' ? 'bg-gradient-to-br from-amber-400 to-yellow-500' :
                      member.vip_tier === 'Silver' ? 'bg-gradient-to-br from-slate-400 to-slate-600' :
                      'bg-gradient-to-br from-slate-600 to-slate-800'
                    }`}>
                      <Crown className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{member.display_name || member.guest_name}</h3>
                      <p className="text-xs text-slate-400">{member.membership_number || 'No ID'}</p>
                    </div>
                  </div>
                  {member.status === 'in_building' && (
                    <Badge className="bg-green-500/20 text-green-400 text-xs">HERE</Badge>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <Badge className={
                    member.vip_tier === 'Diamond' ? 'bg-cyan-500/20 text-cyan-300' :
                    member.vip_tier === 'Platinum' ? 'bg-slate-500/20 text-slate-300' :
                    member.vip_tier === 'Gold' ? 'bg-amber-500/20 text-amber-300' :
                    member.vip_tier === 'Silver' ? 'bg-slate-400/20 text-slate-300' :
                    'bg-slate-600/20 text-slate-400'
                  }>
                    {member.vip_tier || 'Standard'}
                  </Badge>
                  {member.contract_signed && (
                    <Badge className="bg-purple-500/20 text-purple-400 text-xs">Contract ✓</Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-slate-500 text-xs">Today</p>
                    <p className="text-green-400 font-medium">${stats.todaySpend.toFixed(0)}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">Lifetime</p>
                    <p className="text-amber-400 font-medium">${stats.lifetimeSpend.toFixed(0)}</p>
                  </div>
                </div>

                <div className="flex gap-2 mt-3 pt-3 border-t border-slate-700">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 text-xs h-8"
                    onClick={(e) => { e.stopPropagation(); setEditingMember(member); }}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 text-xs h-8 bg-purple-600"
                    onClick={(e) => { e.stopPropagation(); setSelectedMember(member); setViewMode('profile'); }}
                  >
                    Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// Redemption Analytics Component
function RedemptionAnalyticsTab() {
  const [insights, setInsights] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const { data } = await base44.functions.invoke('nupsAI', {
        action: 'analyzeRedemptionPatterns',
        data: {}
      });
      setInsights(data.insights);
    } catch (err) {
      console.error('Analytics failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900/50 border-purple-500/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">AI Voucher Redemption Analysis</h3>
              <p className="text-sm text-slate-400">Understand promotional effectiveness</p>
            </div>
            <Button onClick={loadAnalytics} disabled={loading} className="bg-gradient-to-r from-purple-600 to-pink-600">
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <BarChart3 className="w-4 h-4 mr-2" />}
              {loading ? 'Analyzing...' : 'Run Analysis'}
            </Button>
          </div>

          {insights && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Effectiveness Score */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <h4 className="text-sm font-medium text-slate-400 mb-3">Campaign Effectiveness</h4>
                  <div className="flex items-center gap-4">
                    <div className="text-4xl font-bold text-purple-400">{insights.effectiveness?.score || 0}%</div>
                    <Badge className={
                      insights.effectiveness?.rating === 'Excellent' ? 'bg-green-500/20 text-green-400' :
                      insights.effectiveness?.rating === 'Good' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }>
                      {insights.effectiveness?.rating}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Peak Times */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <h4 className="text-sm font-medium text-slate-400 mb-3">Peak Redemption Times</h4>
                  <div className="flex flex-wrap gap-2">
                    {insights.peakRedemptionTimes?.map((time, i) => (
                      <Badge key={i} className="bg-cyan-500/20 text-cyan-400">{time}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card className="bg-slate-800/50 border-slate-700 md:col-span-2">
                <CardContent className="p-4">
                  <h4 className="text-sm font-medium text-slate-400 mb-3">AI Recommendations</h4>
                  <ul className="space-y-2">
                    {insights.recommendations?.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                        <span className="text-purple-400">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Suggested Adjustments */}
              {insights.suggestedAdjustments?.length > 0 && (
                <Card className="bg-slate-800/50 border-slate-700 md:col-span-2">
                  <CardContent className="p-4">
                    <h4 className="text-sm font-medium text-slate-400 mb-3">Suggested Adjustments</h4>
                    <div className="space-y-3">
                      {insights.suggestedAdjustments.map((adj, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                          <span className="text-sm text-white">{adj.change}</span>
                          <span className="text-sm text-green-400">{adj.expectedResult}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {!insights && !loading && (
            <div className="text-center py-12 text-slate-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Click "Run Analysis" to get AI-powered insights</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function NUPSDashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (!isAuth) {
          window.location.href = createPageUrl('NUPSLogin');
          return;
        }
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        console.error('Auth error:', error);
        window.location.href = createPageUrl('NUPSLogin');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const isAdmin = user?.role === 'admin';

  const { data: transactions = [] } = useQuery({
    queryKey: ['nups-transactions'],
    queryFn: () => base44.entities.POSTransaction.list('-created_date', 100),
    enabled: !!user
  });

  const { data: entertainers = [] } = useQuery({
    queryKey: ['nups-entertainers'],
    queryFn: () => base44.entities.Entertainer.list(),
    enabled: !!user
  });

  const { data: activeShifts = [] } = useQuery({
    queryKey: ['nups-shifts'],
    queryFn: async () => {
      const shifts = await base44.entities.EntertainerShift.list('-created_date', 100);
      return shifts.filter(s => !s.check_out_time);
    },
    enabled: !!user
  });

  const { data: vipRooms = [] } = useQuery({
    queryKey: ['nups-rooms'],
    queryFn: () => base44.entities.VIPRoom.list(),
    enabled: !!user
  });

  const { data: products = [] } = useQuery({
    queryKey: ['nups-products'],
    queryFn: () => base44.entities.POSProduct.list(),
    enabled: !!user
  });

  // Calculate stats
  const today = new Date().toDateString();
  const todayTransactions = transactions.filter(t => 
    new Date(t.created_date).toDateString() === today
  );
  const todayRevenue = todayTransactions.reduce((sum, t) => sum + (t.total || 0), 0);
  const occupiedRooms = vipRooms.filter(r => r.status === 'occupied').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-400 mx-auto mb-4" />
          <p className="text-gray-400">Loading N.U.P.S. Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-900/50 to-cyan-900/50 border-b border-purple-500/30 p-4 sticky top-0 z-50 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-purple-400" />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                N.U.P.S.
              </h1>
              <p className="text-xs text-gray-400">Nexus Universal Point-of-Sale</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-white">{user?.email}</span>
              <Badge className={isAdmin ? 'bg-purple-500/30 text-purple-400' : 'bg-cyan-500/30 text-cyan-400'}>
                {isAdmin ? 'Owner' : 'Staff'}
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => base44.auth.logout()}
              className="border-red-500/50 text-red-400 hover:bg-red-500/10"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4 md:p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card className="bg-slate-900/50 border-green-500/30">
            <CardContent className="p-4">
              <DollarSign className="w-6 h-6 text-green-400 mb-2" />
              <div className="text-2xl font-bold text-green-400">${todayRevenue.toFixed(0)}</div>
              <div className="text-xs text-gray-400">Today's Revenue</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/50 border-cyan-500/30">
            <CardContent className="p-4">
              <ShoppingCart className="w-6 h-6 text-cyan-400 mb-2" />
              <div className="text-2xl font-bold text-cyan-400">{todayTransactions.length}</div>
              <div className="text-xs text-gray-400">Transactions</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/50 border-purple-500/30">
            <CardContent className="p-4">
              <UserCheck className="w-6 h-6 text-purple-400 mb-2" />
              <div className="text-2xl font-bold text-purple-400">{activeShifts.length}/{entertainers.length}</div>
              <div className="text-xs text-gray-400">Staff Active</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/50 border-pink-500/30">
            <CardContent className="p-4">
              <DoorOpen className="w-6 h-6 text-pink-400 mb-2" />
              <div className="text-2xl font-bold text-pink-400">{occupiedRooms}/{vipRooms.length}</div>
              <div className="text-xs text-gray-400">VIP Rooms</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/50 border-amber-500/30">
            <CardContent className="p-4">
              <Package className="w-6 h-6 text-amber-400 mb-2" />
              <div className="text-2xl font-bold text-amber-400">{products.length}</div>
              <div className="text-xs text-gray-400">Products</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex flex-wrap gap-1 bg-gray-900/50 border border-gray-800 p-1 mb-6">
            <TabsTrigger value="overview" className="min-w-[80px]">
              <BarChart3 className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="pos" className="min-w-[80px]">
                              <Wallet className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">POS</span>
            </TabsTrigger>
            <TabsTrigger value="vip" className="min-w-[80px]">
              <DoorOpen className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">VIP</span>
            </TabsTrigger>
            <TabsTrigger value="staff" className="min-w-[80px]">
              <UserCheck className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Staff</span>
            </TabsTrigger>
            <TabsTrigger value="vip-members" className="min-w-[80px]">
              <Crown className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">VIP Members</span>
            </TabsTrigger>
            {isAdmin && (
              <>
                <TabsTrigger value="vouchers" className="min-w-[80px]">
                  <Printer className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Vouchers</span>
                </TabsTrigger>
                <TabsTrigger value="products" className="min-w-[80px]">
                  <Package className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Products</span>
                </TabsTrigger>
                <TabsTrigger value="reports" className="min-w-[80px]">
                  <FileText className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Reports</span>
                </TabsTrigger>
              </>
            )}
          </TabsList>

          <Suspense fallback={<LoadingFallback />}>
            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <Card className="bg-slate-900/50 border-cyan-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      onClick={() => setActiveTab('pos')} 
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Open Cash Register
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('vip')} 
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                    >
                      <DoorOpen className="w-4 h-4 mr-2" />
                      Manage VIP Rooms
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('staff')} 
                      className="w-full bg-gradient-to-r from-cyan-600 to-blue-600"
                    >
                      <UserCheck className="w-4 h-4 mr-2" />
                      Check In Staff
                    </Button>
                    {isAdmin && (
                      <Button 
                        onClick={() => setActiveTab('vouchers')} 
                        variant="outline"
                        className="w-full border-amber-500/50 text-amber-400"
                      >
                        <Printer className="w-4 h-4 mr-2" />
                        Print Vouchers
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="bg-slate-900/50 border-purple-500/30 md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Transactions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {todayTransactions.slice(0, 10).map(tx => (
                        <div key={tx.id} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                          <div>
                            <div className="text-sm text-white">{tx.transaction_id}</div>
                            <div className="text-xs text-gray-400">
                              {new Date(tx.created_date).toLocaleTimeString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-green-400 font-bold">${tx.total?.toFixed(2)}</div>
                            <Badge variant="outline" className="text-xs">
                              {tx.payment_method}
                            </Badge>
                          </div>
                        </div>
                      ))}
                      {todayTransactions.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          No transactions today
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* POS Tab */}
            <TabsContent value="pos">
              <POSCashRegister user={user} />
            </TabsContent>

            {/* VIP Tab */}
            <TabsContent value="vip">
              <div className="space-y-6">
                <VIPRoomManagement />
                <GuestTracking />
              </div>
            </TabsContent>

            {/* Staff Tab */}
            <TabsContent value="staff">
              <EntertainerCheckIn />
            </TabsContent>

            {/* VIP Members Tab */}
            <TabsContent value="vip-members">
              <VIPMembersTab />
            </TabsContent>

            {/* Vouchers Tab (Admin Only) */}
            {isAdmin && (
              <TabsContent value="vouchers">
                <Tabs defaultValue="4bill">
                  <TabsList className="mb-4">
                    <TabsTrigger value="4bill">4-Bill Printer</TabsTrigger>
                    <TabsTrigger value="5sheet">5-Sheet Printer</TabsTrigger>
                    <TabsTrigger value="analytics">Redemption Analytics</TabsTrigger>
                  </TabsList>
                  <TabsContent value="4bill">
                    <VoucherPrinter4Bill />
                  </TabsContent>
                  <TabsContent value="5sheet">
                    <VoucherPrinter5Sheet />
                  </TabsContent>
                  <TabsContent value="analytics">
                    <RedemptionAnalyticsTab />
                  </TabsContent>
                </Tabs>
              </TabsContent>
            )}

            {/* Products Tab (Admin Only) */}
            {isAdmin && (
              <TabsContent value="products">
                <ProductManagement />
              </TabsContent>
            )}

            {/* Reports Tab (Admin Only) */}
            {isAdmin && (
              <TabsContent value="reports">
                <Tabs defaultValue="zreport" className="space-y-4">
                  <TabsList className="bg-slate-900 border border-slate-700">
                    <TabsTrigger value="zreport">Z-Reports</TabsTrigger>
                    <TabsTrigger value="sales">AI Sales Analytics</TabsTrigger>
                    <TabsTrigger value="staff">Staff Performance</TabsTrigger>
                  </TabsList>
                  <TabsContent value="zreport">
                    <ZReportGenerator user={user} />
                  </TabsContent>
                  <TabsContent value="sales">
                    <AISalesReports />
                  </TabsContent>
                  <TabsContent value="staff">
                    <AIStaffPerformance />
                  </TabsContent>
                </Tabs>
              </TabsContent>
            )}
          </Suspense>
        </Tabs>
      </div>
    </div>
  );
}