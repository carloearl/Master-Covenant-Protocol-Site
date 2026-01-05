import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Crown, Wine, DoorOpen, Clock, DollarSign, Star, 
  Printer, FileText, Fingerprint, User, Calendar,
  Sparkles, TrendingUp, Gift, Heart, ArrowLeft,
  CheckCircle, PenTool, Loader2, Download
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import VIPReceiptCard from "../components/nups/VIPReceiptCard";
import VIPContractCard from "../components/nups/VIPContractCard";
import VIPAIRecommendations from "../components/nups/VIPAIRecommendations";

export default function VIPMemberProfile() {
  const [user, setUser] = useState(null);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [showContractDialog, setShowContractDialog] = useState(false);
  const urlParams = new URLSearchParams(window.location.search);
  const guestId = urlParams.get('id');

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (err) {
        console.error('Auth error:', err);
      }
    };
    loadUser();
  }, []);

  const { data: guest, isLoading: guestLoading } = useQuery({
    queryKey: ['vip-guest', guestId],
    queryFn: async () => {
      if (!guestId) return null;
      const guests = await base44.entities.VIPGuest.filter({ id: guestId });
      return guests[0] || null;
    },
    enabled: !!guestId
  });

  const { data: allGuests = [] } = useQuery({
    queryKey: ['vip-guests-list'],
    queryFn: () => base44.entities.VIPGuest.list('-created_date', 50),
    enabled: !guestId
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ['guest-transactions', guest?.id],
    queryFn: () => base44.entities.POSTransaction.list('-created_date', 100),
    enabled: !!guest
  });

  const { data: roomSessions = [] } = useQuery({
    queryKey: ['guest-rooms', guest?.id],
    queryFn: async () => {
      const rooms = await base44.entities.VIPRoom.list('-created_date', 50);
      return rooms.filter(r => r.guest_name?.toLowerCase().includes(guest?.guest_name?.toLowerCase()));
    },
    enabled: !!guest
  });

  const { data: entertainers = [] } = useQuery({
    queryKey: ['entertainers'],
    queryFn: () => base44.entities.Entertainer.list()
  });

  // Calculate guest stats
  const guestTransactions = transactions.filter(t => 
    t.customer_id === guest?.id || 
    t.notes?.toLowerCase().includes(guest?.guest_name?.toLowerCase())
  );
  
  const todayDate = new Date().toDateString();
  const todayTransactions = guestTransactions.filter(t => 
    new Date(t.created_date).toDateString() === todayDate
  );
  const todaySpend = todayTransactions.reduce((sum, t) => sum + (t.total || 0), 0);
  const lifetimeSpend = guestTransactions.reduce((sum, t) => sum + (t.total || 0), 0);
  const todayRooms = roomSessions.filter(r => 
    new Date(r.start_time).toDateString() === todayDate
  );

  const activeGuest = guest || selectedGuest;

  if (!guestId && !selectedGuest) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link to={createPageUrl('NUPSDashboard')}>
              <Button variant="outline" size="sm" className="border-slate-600">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to NUPS
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-pink-400 bg-clip-text text-transparent">
                VIP Member Profiles
              </h1>
              <p className="text-slate-400">Select a VIP guest to view their profile</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allGuests.map(g => (
              <Card 
                key={g.id} 
                className="bg-slate-900/50 border-amber-500/30 cursor-pointer hover:border-amber-400 transition-all"
                onClick={() => setSelectedGuest(g)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-pink-500 flex items-center justify-center">
                      <Crown className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold">{g.guest_name}</h3>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-amber-500/20 text-amber-400 text-xs">
                          {g.vip_tier || 'Standard'}
                        </Badge>
                        {g.status === 'in_building' && (
                          <Badge className="bg-green-500/20 text-green-400 text-xs">Here Now</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  {g.membership_number && (
                    <p className="text-xs text-slate-500 mt-2">#{g.membership_number}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (guestLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900/50 to-pink-900/50 border-b border-amber-500/30 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Link to={createPageUrl('NUPSDashboard')}>
              <Button variant="outline" size="sm" className="border-slate-600">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-slate-600"
              onClick={() => { setSelectedGuest(null); window.history.pushState({}, '', createPageUrl('VIPMemberProfile')); }}
            >
              All VIPs
            </Button>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-pink-500 flex items-center justify-center">
                <Crown className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{activeGuest?.guest_name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-amber-500/20 text-amber-400">
                    {activeGuest?.vip_tier || 'Standard VIP'}
                  </Badge>
                  {activeGuest?.membership_number && (
                    <span className="text-slate-400 text-sm">#{activeGuest.membership_number}</span>
                  )}
                  {activeGuest?.status === 'in_building' && (
                    <Badge className="bg-green-500/20 text-green-400">Currently Here</Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => setShowContractDialog(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600"
              >
                <FileText className="w-4 h-4 mr-2" />
                View Contract
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-slate-900/50 border-green-500/30">
            <CardContent className="p-4">
              <DollarSign className="w-5 h-5 text-green-400 mb-1" />
              <div className="text-2xl font-bold text-green-400">${todaySpend.toFixed(0)}</div>
              <div className="text-xs text-slate-400">Today's Spend</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-amber-500/30">
            <CardContent className="p-4">
              <TrendingUp className="w-5 h-5 text-amber-400 mb-1" />
              <div className="text-2xl font-bold text-amber-400">${lifetimeSpend.toFixed(0)}</div>
              <div className="text-xs text-slate-400">Lifetime Value</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-pink-500/30">
            <CardContent className="p-4">
              <DoorOpen className="w-5 h-5 text-pink-400 mb-1" />
              <div className="text-2xl font-bold text-pink-400">{todayRooms.length}</div>
              <div className="text-xs text-slate-400">VIP Sessions Today</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-purple-500/30">
            <CardContent className="p-4">
              <Star className="w-5 h-5 text-purple-400 mb-1" />
              <div className="text-2xl font-bold text-purple-400">{guestTransactions.length}</div>
              <div className="text-xs text-slate-400">Total Visits</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="today" className="space-y-6">
          <TabsList className="bg-slate-900 border border-slate-700">
            <TabsTrigger value="today">Today's Activity</TabsTrigger>
            <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="contract">Contract</TabsTrigger>
          </TabsList>

          {/* Today's Activity */}
          <TabsContent value="today">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Today's Receipt */}
              <VIPReceiptCard 
                guest={activeGuest}
                transactions={todayTransactions}
                roomSessions={todayRooms}
                entertainers={entertainers}
                date={new Date()}
              />

              {/* Live Recommendations */}
              <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    Staff Action Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <VIPAIRecommendations 
                    guest={activeGuest} 
                    todaySpend={todaySpend}
                    lifetimeSpend={lifetimeSpend}
                    roomSessions={todayRooms}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* AI Recommendations */}
          <TabsContent value="recommendations">
            <VIPAIRecommendations 
              guest={activeGuest} 
              todaySpend={todaySpend}
              lifetimeSpend={lifetimeSpend}
              roomSessions={todayRooms}
              fullView
            />
          </TabsContent>

          {/* History */}
          <TabsContent value="history">
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {guestTransactions.map(tx => (
                    <div key={tx.id} className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                      <div>
                        <div className="text-sm text-white">{tx.transaction_id}</div>
                        <div className="text-xs text-slate-400">
                          {new Date(tx.created_date).toLocaleDateString()} at {new Date(tx.created_date).toLocaleTimeString()}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {tx.items?.slice(0, 3).map((item, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{item.product_name}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-400 font-bold">${tx.total?.toFixed(2)}</div>
                        <Badge className="text-xs">{tx.payment_method}</Badge>
                      </div>
                    </div>
                  ))}
                  {guestTransactions.length === 0 && (
                    <div className="text-center py-8 text-slate-500">No transaction history</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contract */}
          <TabsContent value="contract">
            <VIPContractCard guest={activeGuest} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Contract Dialog */}
      <Dialog open={showContractDialog} onOpenChange={setShowContractDialog}>
        <DialogContent className="bg-slate-900 border-purple-500/30 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">VIP Service Agreement</DialogTitle>
          </DialogHeader>
          <VIPContractCard guest={activeGuest} printMode />
        </DialogContent>
      </Dialog>
    </div>
  );
}