import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Store, DollarSign, ShoppingCart, Package, TrendingUp, 
  Users, LogOut, MapPin, BarChart3, Calendar
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import NUPSInventoryManagement from "../components/nups/InventoryManagement";
import NUPSLocationManagement from "../components/nups/LocationManagement";
import NUPSStaffManagement from "../components/nups/StaffManagement";
import NUPSAdvancedReporting from "../components/nups/AdvancedReporting";
import NUPSLoyaltyProgram from "../components/nups/LoyaltyProgram";

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

  const todayTransactions = transactions.filter(t => {
    const txDate = new Date(t.created_date);
    const today = new Date();
    return txDate.toDateString() === today.toDateString();
  });

  const todayRevenue = todayTransactions.reduce((sum, t) => sum + (t.total || 0), 0);
  const totalRevenue = transactions.reduce((sum, t) => sum + (t.total || 0), 0);
  const lowStockProducts = products.filter(p => p.stock_quantity <= (p.low_stock_threshold || 10));

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-green-500/20 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Store className="w-6 h-6 text-green-400" />
            <div>
              <h1 className="text-xl font-bold">N.U.P.S. Management</h1>
              <p className="text-sm text-gray-400">Manager Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{user?.email}</span>
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
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-700/10 border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-8 h-8 text-green-400" />
                <TrendingUp className="w-4 h-4 text-green-400" />
              </div>
              <div className="text-3xl font-bold text-green-400 mb-1">
                ${todayRevenue.toFixed(2)}
              </div>
              <div className="text-sm text-gray-400">Today's Revenue</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-700/10 border-blue-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <ShoppingCart className="w-8 h-8 text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-blue-400 mb-1">
                {todayTransactions.length}
              </div>
              <div className="text-sm text-gray-400">Today's Sales</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-700/10 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Package className="w-8 h-8 text-purple-400" />
              </div>
              <div className="text-3xl font-bold text-purple-400 mb-1">
                {products.length}
              </div>
              <div className="text-sm text-gray-400">Total Products</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-700/10 border-orange-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 text-orange-400" />
              </div>
              <div className="text-3xl font-bold text-orange-400 mb-1">
                {customers.length}
              </div>
              <div className="text-sm text-gray-400">Customers</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500/10 to-red-700/10 border-red-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <MapPin className="w-8 h-8 text-red-400" />
              </div>
              <div className="text-3xl font-bold text-red-400 mb-1">
                {locations.length}
              </div>
              <div className="text-sm text-gray-400">Locations</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="inventory" className="space-y-6">
          <TabsList className="bg-gray-900 border border-gray-800">
            <TabsTrigger value="inventory" className="text-white data-[state=active]:text-green-400">
              <Package className="w-4 h-4 mr-2" />
              Inventory
            </TabsTrigger>
            <TabsTrigger value="locations" className="text-white data-[state=active]:text-green-400">
              <MapPin className="w-4 h-4 mr-2" />
              Locations
            </TabsTrigger>
            <TabsTrigger value="staff" className="text-white data-[state=active]:text-green-400">
              <Users className="w-4 h-4 mr-2" />
              Staff
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

          <TabsContent value="inventory">
            <NUPSInventoryManagement products={products} />
          </TabsContent>

          <TabsContent value="locations">
            <NUPSLocationManagement locations={locations} />
          </TabsContent>

          <TabsContent value="staff">
            <NUPSStaffManagement />
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