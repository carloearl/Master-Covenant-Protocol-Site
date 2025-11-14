import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Store, DollarSign, ShoppingCart, Package, TrendingUp, 
  Users, LogOut, MapPin, BarChart3, Calendar, UserCheck, DoorOpen, FileText
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import NUPSInventoryManagement from "../components/nups/InventoryManagement.jsx";
import NUPSLocationManagement from "../components/nups/LocationManagement.jsx";
import NUPSStaffManagement from "../components/nups/StaffManagement.jsx";
import NUPSAdvancedReporting from "../components/nups/AdvancedReporting.jsx";
import NUPSLoyaltyProgram from "../components/nups/LoyaltyProgram.jsx";
import EntertainerCheckIn from "../components/nups/EntertainerCheckIn.jsx";
import VIPRoomManagement from "../components/nups/VIPRoomManagement.jsx";
import GuestTracking from "../components/nups/GuestTracking.jsx";
import ZReportGenerator from "../components/nups/ZReportGenerator.jsx";

export default function NUPSManager() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        base44.auth.redirectToLogin('/nups-login');
      }
    };
    checkAuth();
  }, []);

  const { data: transactions = [] } = useQuery({
    queryKey: ['pos-transactions'],
    queryFn: () => base44.entities.POSTransaction.list('-created_date', 100)
  });

  const { data: products = [] } = useQuery({
    queryKey: ['pos-products'],
    queryFn: () => base44.entities.POSProduct.list()
  });

  const { data: customers = [] } = useQuery({
    queryKey: ['pos-customers'],
    queryFn: () => base44.entities.POSCustomer.list()
  });

  const { data: locations = [] } = useQuery({
    queryKey: ['pos-locations'],
    queryFn: () => base44.entities.POSLocation.list()
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
  const lowStockProducts = products.filter(p => p.stock_quantity <= (p.low_stock_threshold || 10));
  const activeGuestsCount = vipGuests.filter(g => g.status === 'in_building').length;
  const occupiedRooms = vipRooms.filter(r => r.status === 'occupied').length;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="glass-nav border-b border-green-500/20 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Store className="w-6 h-6 text-green-400" />
            <div>
              <h1 className="text-xl font-bold text-white">N.U.P.S. Management</h1>
              <p className="text-sm text-gray-400">Manager Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-white">{user?.email}</span>
              <Badge variant="outline" className="border-green-500/50 text-green-400">Manager</Badge>
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
        {/* Stats Overview */}
        <div className="grid md:grid-cols-6 gap-4 mb-8">
          <Card className="glass-card-hover border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-6 h-6 text-green-400" />
                <TrendingUp className="w-4 h-4 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-green-400 mb-1">
                ${todayRevenue.toFixed(2)}
              </div>
              <div className="text-xs text-gray-400">Today's Revenue</div>
            </CardContent>
          </Card>

          <Card className="glass-card-hover border-blue-500/30">
            <CardContent className="p-4">
              <ShoppingCart className="w-6 h-6 text-blue-400 mb-2" />
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {todayTransactions.length}
              </div>
              <div className="text-xs text-gray-400">Today's Sales</div>
            </CardContent>
          </Card>

          <Card className="glass-card-hover border-purple-500/30">
            <CardContent className="p-4">
              <UserCheck className="w-6 h-6 text-purple-400 mb-2" />
              <div className="text-2xl font-bold text-purple-400 mb-1">
                {activeShifts.length}
              </div>
              <div className="text-xs text-gray-400">On Shift</div>
            </CardContent>
          </Card>

          <Card className="glass-card-hover border-pink-500/30">
            <CardContent className="p-4">
              <DoorOpen className="w-6 h-6 text-pink-400 mb-2" />
              <div className="text-2xl font-bold text-pink-400 mb-1">
                {occupiedRooms}/{vipRooms.length}
              </div>
              <div className="text-xs text-gray-400">VIP Rooms</div>
            </CardContent>
          </Card>

          <Card className="glass-card-hover border-cyan-500/30">
            <CardContent className="p-4">
              <Users className="w-6 h-6 text-cyan-400 mb-2" />
              <div className="text-2xl font-bold text-cyan-400 mb-1">
                {activeGuestsCount}
              </div>
              <div className="text-xs text-gray-400">Guests In</div>
            </CardContent>
          </Card>

          <Card className="glass-card-hover border-orange-500/30">
            <CardContent className="p-4">
              <Package className="w-6 h-6 text-orange-400 mb-2" />
              <div className="text-2xl font-bold text-orange-400 mb-1">
                {lowStockProducts.length}
              </div>
              <div className="text-xs text-gray-400">Low Stock</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="floor" className="space-y-6">
          <TabsList className="glass-card-dark border-gray-800">
            <TabsTrigger value="floor" className="text-white data-[state=active]:text-green-400">
              <UserCheck className="w-4 h-4 mr-2" />
              Floor Management
            </TabsTrigger>
            <TabsTrigger value="vip" className="text-white data-[state=active]:text-purple-400">
              <DoorOpen className="w-4 h-4 mr-2" />
              VIP Rooms
            </TabsTrigger>
            <TabsTrigger value="guests" className="text-white data-[state=active]:text-cyan-400">
              <Users className="w-4 h-4 mr-2" />
              Guest Tracking
            </TabsTrigger>
            <TabsTrigger value="zreport" className="text-white data-[state=active]:text-yellow-400">
              <FileText className="w-4 h-4 mr-2" />
              Z-Report
            </TabsTrigger>
            <TabsTrigger value="inventory" className="text-white data-[state=active]:text-green-400">
              <Package className="w-4 h-4 mr-2" />
              Inventory
            </TabsTrigger>
            <TabsTrigger value="locations" className="text-white data-[state=active]:text-green-400">
              <MapPin className="w-4 h-4 mr-2" />
              Locations
            </TabsTrigger>
            <TabsTrigger value="loyalty" className="text-white data-[state=active]:text-green-400">
              <TrendingUp className="w-4 h-4 mr-2" />
              Loyalty
            </TabsTrigger>
            <TabsTrigger value="reports" className="text-white data-[state=active]:text-green-400">
              <BarChart3 className="w-4 h-4 mr-2" />
              Reports
            </TabsTrigger>
          </TabsList>

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

          <TabsContent value="inventory">
            <NUPSInventoryManagement products={products} />
          </TabsContent>

          <TabsContent value="locations">
            <NUPSLocationManagement locations={locations} />
          </TabsContent>

          <TabsContent value="loyalty">
            <NUPSLoyaltyProgram customers={customers} />
          </TabsContent>

          <TabsContent value="reports">
            <NUPSAdvancedReporting 
              transactions={transactions}
              products={products}
              customers={customers}
              locations={locations}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}