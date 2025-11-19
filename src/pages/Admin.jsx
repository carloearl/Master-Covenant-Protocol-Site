import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  LayoutDashboard, Users, Calendar, DollarSign, 
  Shield, TrendingUp, Search, Filter, Download,
  CheckCircle, Clock, XCircle, AlertCircle, FileCheck
} from "lucide-react";
import AdminConsultations from "../components/admin/AdminConsultations";
import AdminUsers from "../components/admin/AdminUsers";
import AdminPayments from "../components/admin/AdminPayments";
import AdminAnalytics from "../components/admin/AdminAnalytics";
import AdminSecurity from "../components/admin/AdminSecurity";
import SiteAuditReport from "./SiteAuditReport";

export default function Admin() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) {
        base44.auth.redirectToLogin(window.location.pathname);
        return;
      }
      
      const userData = await base44.auth.me();
      
      if (userData.role !== 'admin') {
        window.location.href = '/';
        return;
      }
      
      setUser(userData);
    } catch (err) {
      console.error("Admin access check failed:", err);
      window.location.href = '/';
    }
  };

  const { data: consultations = [] } = useQuery({
    queryKey: ['all-consultations'],
    queryFn: () => base44.entities.Consultation.list('-created_date', 100),
    enabled: !!user,
    initialData: []
  });

  const { data: users = [] } = useQuery({
    queryKey: ['all-users'],
    queryFn: () => base44.entities.User.list('-created_date', 100),
    enabled: !!user,
    initialData: []
  });

  const { data: qrCodes = [] } = useQuery({
    queryKey: ['all-qr-codes'],
    queryFn: () => base44.entities.QRGenHistory.list('-created_date', 100),
    enabled: !!user,
    initialData: []
  });

  const stats = {
    totalConsultations: consultations.length,
    pendingConsultations: consultations.filter(c => c.status === 'pending').length,
    confirmedConsultations: consultations.filter(c => c.status === 'confirmed').length,
    completedConsultations: consultations.filter(c => c.status === 'completed').length,
    totalRevenue: consultations.filter(c => c.payment_status === 'paid').length * 299,
    paidConsultations: consultations.filter(c => c.payment_status === 'paid').length,
    pendingPayments: consultations.filter(c => c.payment_status === 'pending').length,
    totalUsers: users.length,
    adminUsers: users.filter(u => u.role === 'admin').length,
    qrCodesGenerated: qrCodes.length,
    secureQRCodes: qrCodes.filter(q => q.status === 'safe').length
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center relative">
        <div className="fixed inset-0 opacity-20 pointer-events-none">
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/8cd0364f8_Whisk_2bd57b9a449d359968944ab33f98257edr-Copy.jpg"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-center relative z-10">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-20 relative">
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <img
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/8cd0364f8_Whisk_2bd57b9a449d359968944ab33f98257edr-Copy.jpg"
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  Admin <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Dashboard</span>
                </h1>
                <p className="text-white">Manage GlyphLock platform and users</p>
              </div>
              <Badge className="bg-red-500/20 text-red-400 border-red-500/50">
                Admin Access
              </Badge>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="glass-card-dark border-blue-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Calendar className="w-8 h-8 text-white" />
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white">{stats.totalConsultations}</div>
                    <div className="text-sm text-white/60">Total</div>
                  </div>
                </div>
                <div className="text-sm text-white font-semibold">Consultations</div>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline" className="border-yellow-500/50 text-yellow-400 bg-yellow-500/10 text-xs">
                    {stats.pendingConsultations} Pending
                  </Badge>
                  <Badge variant="outline" className="border-green-500/50 text-green-400 bg-green-500/10 text-xs">
                    {stats.confirmedConsultations} Confirmed
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card-dark border-green-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="w-8 h-8 text-green-400" />
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white">${stats.totalRevenue.toLocaleString()}</div>
                    <div className="text-sm text-white/60">Revenue</div>
                  </div>
                </div>
                <div className="text-sm text-green-400 font-semibold">Total Earnings</div>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline" className="border-green-500/50 text-green-400 bg-green-500/10 text-xs">
                    {stats.paidConsultations} Paid
                  </Badge>
                  <Badge variant="outline" className="border-yellow-500/50 text-yellow-400 bg-yellow-500/10 text-xs">
                    {stats.pendingPayments} Pending
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card-dark border-purple-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-8 h-8 text-purple-400" />
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white">{stats.totalUsers}</div>
                    <div className="text-sm text-white/60">Total</div>
                  </div>
                </div>
                <div className="text-sm text-purple-400 font-semibold">Platform Users</div>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline" className="border-purple-500/50 text-purple-400 bg-purple-500/10 text-xs">
                    {stats.adminUsers} Admins
                  </Badge>
                  <Badge variant="outline" className="border-blue-500/50 text-blue-400 bg-blue-500/10 text-xs">
                    {stats.totalUsers - stats.adminUsers} Regular
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card-dark border-orange-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Shield className="w-8 h-8 text-orange-400" />
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white">{stats.qrCodesGenerated}</div>
                    <div className="text-sm text-white/60">Generated</div>
                  </div>
                </div>
                <div className="text-sm text-orange-400 font-semibold">QR Codes</div>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline" className="border-green-500/50 text-green-400 bg-green-500/10 text-xs">
                    {stats.secureQRCodes} Secure
                  </Badge>
                  <Badge variant="outline" className="border-yellow-500/50 text-yellow-400 bg-yellow-500/10 text-xs">
                    {stats.qrCodesGenerated - stats.secureQRCodes} Flagged
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="glass-card-dark border border-blue-500/30">
              <TabsTrigger value="overview" className="text-white data-[state=active]:bg-blue-500/30">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="consultations" className="text-white data-[state=active]:bg-blue-500/30">
                <Calendar className="w-4 h-4 mr-2" />
                Consultations
              </TabsTrigger>
              <TabsTrigger value="users" className="text-white data-[state=active]:bg-blue-500/30">
                <Users className="w-4 h-4 mr-2" />
                Users
              </TabsTrigger>
              <TabsTrigger value="payments" className="text-white data-[state=active]:bg-blue-500/30">
                <DollarSign className="w-4 h-4 mr-2" />
                Payments
              </TabsTrigger>
              <TabsTrigger value="security" className="text-white data-[state=active]:bg-blue-500/30">
                <Shield className="w-4 h-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-blue-500/30">
                <TrendingUp className="w-4 h-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="audit" className="text-white data-[state=active]:bg-blue-500/30">
                <FileCheck className="w-4 h-4 mr-2" />
                Site Audit
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Consultations */}
                <Card className="glass-card-dark border-blue-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Consultations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {consultations.slice(0, 5).map((consultation, index) => (
                        <div key={index} className="flex items-center justify-between p-3 glass-card-dark rounded-lg border border-blue-500/20">
                          <div className="flex-1">
                            <div className="font-semibold text-white">{consultation.full_name}</div>
                            <div className="text-sm text-white/80">{consultation.service_interest}</div>
                          </div>
                          <Badge className={
                            consultation.payment_status === 'paid'
                              ? 'bg-green-500/20 text-green-400 border-green-500/50'
                              : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                          }>
                            {consultation.payment_status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* System Health */}
                <Card className="glass-card-dark border-blue-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">System Health</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 glass-card-dark border border-green-500/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-white">Payment System</span>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/50">Online</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 glass-card-dark border border-green-500/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-white">Database</span>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/50">Healthy</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 glass-card-dark border border-green-500/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-white">Security Scanning</span>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/50">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 glass-card-dark border border-blue-500/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-white" />
                        <span className="text-white">API Response Time</span>
                      </div>
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">124ms</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Consultations Tab */}
            <TabsContent value="consultations">
              <AdminConsultations consultations={consultations} />
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users">
              <AdminUsers users={users} />
            </TabsContent>

            {/* Payments Tab */}
            <TabsContent value="payments">
              <AdminPayments consultations={consultations} />
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <AdminSecurity qrCodes={qrCodes} />
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <AdminAnalytics 
                consultations={consultations} 
                users={users} 
                qrCodes={qrCodes} 
              />
            </TabsContent>

            {/* Site Audit Tab */}
            <TabsContent value="audit">
              <SiteAuditReport />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}