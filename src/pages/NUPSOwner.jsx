import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, DollarSign, ShoppingCart, Package, TrendingUp, 
  Users, LogOut, Calendar, BarChart3, UserCheck, DoorOpen, FileText, FileSignature
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import NUPSProductManagement from "../components/nups/ProductManagement";
import NUPSTransactionHistory from "../components/nups/TransactionHistory";
import NUPSSalesReport from "../components/nups/SalesReport";
import AIInsights from "../components/nups/AIInsights";
import CustomerManagement from "../components/nups/CustomerManagement";
import CustomerInsights from "../components/nups/CustomerInsights";
import MarketingCampaigns from "../components/nups/MarketingCampaigns";
import EntertainerCheckIn from "../components/nups/EntertainerCheckIn";
import VIPRoomManagement from "../components/nups/VIPRoomManagement";
import GuestTracking from "../components/nups/GuestTracking";
import ZReportGenerator from "../components/nups/ZReportGenerator";
import EntertainerContract from "../components/nups/EntertainerContract";

export default function NUPSOwner() {
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await base44.auth.me();
        if (currentUser.role !== 'admin') {
          window.location.href = '/nups-staff';
        }
        setUser(currentUser);
      } catch (error) {
        base44.auth.redirectToLogin('/nups-login');
      }
    };
    checkAuth();
  }, []);

  const { data: transactions = [] } = useQuery({
    queryKey: ['pos-transactions'],
    queryFn: () => base44.entities.POSTransaction.list('-created_date')
  });

  const { data: products = [] } = useQuery({
    queryKey: ['pos-products'],
    queryFn: () => base44.entities.POSProduct.list()
  });

  const { data: entertainers = [] } = useQuery({
    queryKey: ['entertainers'],
    queryFn: () => base44.entities.Entertainer.list()
  });

  const { data: activeShifts = [] } = useQuery({
    queryKey: ['active-shifts'],
    queryFn: async () => {
      const allShifts = await base44.entities.EntertainerShift.list('-created_date', 100);
      return allShifts.filter(shift => !shift.check_out_time);
    }
  });

  const { data: vipRooms = [] } = useQuery({
    queryKey: ['vip-rooms'],
    queryFn: () => base44.entities.VIPRoom.list()
  });

  const { data: vipGuests = [] } = useQuery({
    queryKey: ['vip-guests'],
    queryFn: () => base44.entities.VIPGuest.list('-created_date', 100)
  });

  const todayTransactions = transactions.filter(t => {
    const txDate = new Date(t.created_date);
    const today = new Date();
    return txDate.toDateString() === today.toDateString();
  });

  const todayRevenue = todayTransactions.reduce((sum, t) => sum + (t.total || 0), 0);
  const totalRevenue = transactions.reduce((sum, t) => sum + (t.total || 0), 0);
  const activeGuestsCount = vipGuests.filter(g => g.status === 'in_building').length;
  const occupiedRooms = vipRooms.filter(r => r.status === 'occupied').length;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="glass-nav border-b border-purple-500/20 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-purple-400" />
            <div>
              <h1 className="text-xl font-bold text-white">N.U.P.S. Administration</h1>
              <p className="text-sm text-gray-400">Owner Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <EntertainerContract onContractSigned={() => queryClient.invalidateQueries({ queryKey: ['entertainers'] })} />
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-white">{user?.email}</span>
              <Badge variant="outline" className="border-purple-500/50 text-purple-400">Owner</Badge>
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

      <div className="container mx-auto p-6">
        {/* Main Content Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="glass-card-dark border-gray-800">
            <TabsTrigger value="dashboard" className="text-white data-[state=active]:text-cyan-400">Dashboard</TabsTrigger>
            <TabsTrigger value="floor" className="text-white data-[state=active]:text-purple-400">
              <UserCheck className="w-4 h-4 mr-2" />
              Floor
            </TabsTrigger>
            <TabsTrigger value="vip" className="text-white data-[state=active]:text-pink-400">
              <DoorOpen className="w-4 h-4 mr-2" />
              VIP Rooms
            </TabsTrigger>
            <TabsTrigger value="guests" className="text-white data-[state=active]:text-cyan-400">
              <Users className="w-4 h-4 mr-2" />
              Guests
            </TabsTrigger>
            <TabsTrigger value="zreport" className="text-white data-[state=active]:text-yellow-400">
              <FileText className="w-4 h-4 mr-2" />
              Z-Report
            </TabsTrigger>
            <TabsTrigger value="ai-insights" className="text-white data-[state=active]:text-cyan-400">AI Insights</TabsTrigger>
            <TabsTrigger value="customers" className="text-white data-[state=active]:text-cyan-400">Customers</TabsTrigger>
            <TabsTrigger value="campaigns" className="text-white data-[state=active]:text-cyan-400">Campaigns</TabsTrigger>
            <TabsTrigger value="products" className="text-white data-[state=active]:text-cyan-400">Products</TabsTrigger>
            <TabsTrigger value="sales" className="text-white data-[state=active]:text-cyan-400">Sales</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            {/* Stats Overview */}
            <div className="grid md:grid-cols-5 gap-6 mb-8">
              <Card className="glass-card-hover border-cyan-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <DollarSign className="w-8 h-8 text-cyan-400" />
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="text-3xl font-bold text-cyan-400 mb-1">
                    ${todayRevenue.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-400">Today's Revenue</div>
                </CardContent>
              </Card>

              <Card className="glass-card-hover border-purple-500/30">
                <CardContent className="p-6">
                  <ShoppingCart className="w-8 h-8 text-purple-400 mb-2" />
                  <div className="text-3xl font-bold text-purple-400 mb-1">
                    {todayTransactions.length}
                  </div>
                  <div className="text-sm text-gray-400">Today's Transactions</div>
                </CardContent>
              </Card>

              <Card className="glass-card-hover border-green-500/30">
                <CardContent className="p-6">
                  <UserCheck className="w-8 h-8 text-green-400 mb-2" />
                  <div className="text-3xl font-bold text-green-400 mb-1">
                    {activeShifts.length}/{entertainers.length}
                  </div>
                  <div className="text-sm text-gray-400">Entertainers Active</div>
                </CardContent>
              </Card>

              <Card className="glass-card-hover border-pink-500/30">
                <CardContent className="p-6">
                  <DoorOpen className="w-8 h-8 text-pink-400 mb-2" />
                  <div className="text-3xl font-bold text-pink-400 mb-1">
                    {occupiedRooms}/{vipRooms.length}
                  </div>
                  <div className="text-sm text-gray-400">VIP Rooms Occupied</div>
                </CardContent>
              </Card>

              <Card className="glass-card-hover border-orange-500/30">
                <CardContent className="p-6">
                  <BarChart3 className="w-8 h-8 text-orange-400 mb-2" />
                  <div className="text-3xl font-bold text-orange-400 mb-1">
                    ${totalRevenue.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-400">Total Revenue</div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Overview */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glass-card-dark border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Entertainers on Floor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {activeShifts.length === 0 ? (
                      <p className="text-gray-400 text-center py-4">No active shifts</p>
                    ) : (
                      activeShifts.slice(0, 5).map(shift => (
                        <div key={shift.id} className="flex items-center justify-between p-2 bg-gray-800/50 rounded">
                          <span className="text-white font-semibold">{shift.stage_name}</span>
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                            {shift.location}
                          </Badge>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card-dark border-cyan-500/30">
                <CardHeader>
                  <CardTitle className="text-white">VIP Guests in Building</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {activeGuestsCount === 0 ? (
                      <p className="text-gray-400 text-center py-4">No guests checked in</p>
                    ) : (
                      vipGuests.filter(g => g.status === 'in_building').slice(0, 5).map(guest => (
                        <div key={guest.id} className="flex items-center justify-between p-2 bg-gray-800/50 rounded">
                          <span className="text-white font-semibold">{guest.guest_name}</span>
                          <div className="text-right">
                            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50 text-xs">
                              {guest.current_location}
                            </Badge>
                            <div className="text-xs text-gray-400 mt-1">
                              ${(guest.total_spent_tonight || 0).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="floor">
            <EntertainerCheckIn />
          </TabsContent>

          <TabsContent value="vip">
            <VIPRoomManagement />
          </TabsContent>

          <TabsContent value="guests">
            <GuestTracking />
          </TabsContent>

          <TabsContent value="zreport">
            <ZReportGenerator user={user} />
          </TabsContent>

          <TabsContent value="ai-insights">
            <AIInsights />
          </TabsContent>

          <TabsContent value="customers">
            <CustomerManagement />
          </TabsContent>

          <TabsContent value="campaigns">
            <MarketingCampaigns />
          </TabsContent>

          <TabsContent value="products">
            <NUPSProductManagement />
          </TabsContent>

          <TabsContent value="sales">
            <NUPSTransactionHistory transactions={transactions} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}