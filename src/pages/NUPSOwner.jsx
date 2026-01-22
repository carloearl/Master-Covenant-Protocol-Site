import React, { useState, useEffect, lazy, Suspense } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, DollarSign, ShoppingCart, TrendingUp, 
  Users, LogOut, UserCheck, DoorOpen, FileText
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const EntertainerContract = lazy(() => import("../components/nups/EntertainerContract.jsx"));
const EntertainerCheckIn = lazy(() => import("../components/nups/EntertainerCheckIn.jsx"));
const VIPRoomManagement = lazy(() => import("../components/nups/VIPRoomManagement.jsx"));
const GuestTracking = lazy(() => import("../components/nups/GuestTracking.jsx"));
const ZReportGenerator = lazy(() => import("../components/nups/ZReportGenerator.jsx"));

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
            <Suspense fallback={null}>
              <EntertainerContract onContractSigned={() => queryClient.invalidateQueries({ queryKey: ['entertainers'] })} />
            </Suspense>
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
              <DollarSign className="w-8 h-8 text-orange-400 mb-2" />
              <div className="text-3xl font-bold text-orange-400 mb-1">
                ${totalRevenue.toFixed(2)}
              </div>
              <div className="text-sm text-gray-400">Total Revenue</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="floor" className="space-y-6">
          <TabsList className="glass-card-dark border-gray-800">
            <TabsTrigger value="floor">
              <UserCheck className="w-4 h-4 mr-2" />
              Floor
            </TabsTrigger>
            <TabsTrigger value="vip">
              <DoorOpen className="w-4 h-4 mr-2" />
              VIP Rooms
            </TabsTrigger>
            <TabsTrigger value="guests">
              <Users className="w-4 h-4 mr-2" />
              Guests
            </TabsTrigger>
            <TabsTrigger value="zreport">
              <FileText className="w-4 h-4 mr-2" />
              Z-Report
            </TabsTrigger>
          </TabsList>

          <Suspense fallback={<div className="text-center py-8 text-gray-400">Loading...</div>}>
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
          </Suspense>
        </Tabs>
      </div>
    </div>
  );
}