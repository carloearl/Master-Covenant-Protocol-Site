import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, Calendar, QrCode, Shield, 
  User, CreditCard, TrendingUp, CheckCircle,
  Clock, AlertCircle, Download, ExternalLink
} from "lucide-react";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) {
        base44.auth.redirectToLogin(window.location.pathname);
        return;
      }
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (err) {
      console.error("Failed to load user:", err);
      base44.auth.redirectToLogin(window.location.pathname);
    }
  };

  const { data: consultations = [] } = useQuery({
    queryKey: ['user-consultations', user?.email],
    queryFn: () => user ? base44.entities.Consultation.filter({ email: user.email }) : [],
    enabled: !!user,
    initialData: []
  });

  const { data: qrCodes = [] } = useQuery({
    queryKey: ['user-qr-codes', user?.email],
    queryFn: () => user ? base44.entities.QRGenHistory.filter({ creator_id: user.email }) : [],
    enabled: !!user,
    initialData: []
  });

  const stats = {
    totalConsultations: consultations.length,
    upcomingConsultations: consultations.filter(c => c.status === 'confirmed').length,
    qrCodesGenerated: qrCodes.length,
    securityScans: qrCodes.filter(c => c.status === 'safe').length
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
          <p className="text-white">Loading dashboard...</p>
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
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">{user.full_name || 'User'}</span>
            </h1>
            <p className="text-white">Manage your security tools and consultations</p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-blue-900/20 backdrop-blur-md border-blue-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Calendar className="w-8 h-8 text-white" />
                  <Badge variant="outline" className="border-white/30 text-white bg-white/10">
                    Total
                  </Badge>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stats.totalConsultations}</div>
                <div className="text-sm text-white/80">Consultations</div>
              </CardContent>
            </Card>

            <Card className="bg-green-900/20 backdrop-blur-md border-green-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                  <Badge variant="outline" className="border-green-500/50 text-green-400 bg-green-500/10">
                    Active
                  </Badge>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stats.upcomingConsultations}</div>
                <div className="text-sm text-white/80">Upcoming</div>
              </CardContent>
            </Card>

            <Card className="bg-purple-900/20 backdrop-blur-md border-purple-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <QrCode className="w-8 h-8 text-purple-400" />
                  <Badge variant="outline" className="border-purple-500/50 text-purple-400 bg-purple-500/10">
                    Generated
                  </Badge>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stats.qrCodesGenerated}</div>
                <div className="text-sm text-white/80">QR Codes</div>
              </CardContent>
            </Card>

            <Card className="bg-orange-900/20 backdrop-blur-md border-orange-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Shield className="w-8 h-8 text-orange-400" />
                  <Badge variant="outline" className="border-orange-500/50 text-orange-400 bg-orange-500/10">
                    Verified
                  </Badge>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stats.securityScans}</div>
                <div className="text-sm text-white/80">Security Scans</div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-blue-900/30 backdrop-blur-md border border-blue-500/30">
              <TabsTrigger value="overview" className="text-white data-[state=active]:bg-blue-500/30">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="consultations" className="text-white data-[state=active]:bg-blue-500/30">
                <Calendar className="w-4 h-4 mr-2" />
                Consultations
              </TabsTrigger>
              <TabsTrigger value="qr-codes" className="text-white data-[state=active]:bg-blue-500/30">
                <QrCode className="w-4 h-4 mr-2" />
                QR Codes
              </TabsTrigger>
              <TabsTrigger value="security" className="text-white data-[state=active]:bg-blue-500/30">
                <Shield className="w-4 h-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="account" className="text-white data-[state=active]:bg-blue-500/30">
                <User className="w-4 h-4 mr-2" />
                Account
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <Card className="bg-blue-900/20 backdrop-blur-md border-blue-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {consultations.slice(0, 3).map((consultation, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-blue-900/30 backdrop-blur-md rounded-lg border border-blue-500/20">
                          <Calendar className="w-5 h-5 text-white mt-1" />
                          <div className="flex-1">
                            <div className="font-semibold text-white">{consultation.service_interest}</div>
                            <div className="text-sm text-white/80">{consultation.full_name}</div>
                            {consultation.preferred_date && (
                              <div className="text-xs text-white/60 mt-1">
                                {new Date(consultation.preferred_date).toLocaleDateString()}
                              </div>
                            )}
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
                      {consultations.length === 0 && (
                        <div className="text-center py-8 text-white/60">
                          No consultations yet
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="bg-blue-900/20 backdrop-blur-md border-blue-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link to={createPageUrl("Consultation")}>
                      <Button className="w-full bg-blue-500/30 hover:bg-blue-500/50 text-white justify-start border border-blue-500/50">
                        <Calendar className="w-4 h-4 mr-2" />
                        Book New Consultation
                      </Button>
                    </Link>
                    <Link to={createPageUrl("QRGenerator")}>
                      <Button className="w-full bg-purple-500/30 hover:bg-purple-500/50 text-white justify-start border border-purple-500/50">
                        <QrCode className="w-4 h-4 mr-2" />
                        Generate QR Code
                      </Button>
                    </Link>
                    <Link to={createPageUrl("SecurityTools")}>
                      <Button className="w-full bg-green-500/30 hover:bg-green-500/50 text-white justify-start border border-green-500/50">
                        <Shield className="w-4 h-4 mr-2" />
                        Security Tools
                      </Button>
                    </Link>
                    <Link to={createPageUrl("GlyphBot")}>
                      <Button className="w-full bg-orange-500/30 hover:bg-orange-500/50 text-white justify-start border border-orange-500/50">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        GlyphBot AI
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Consultations Tab */}
            <TabsContent value="consultations">
              <Card className="bg-blue-900/20 backdrop-blur-md border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-white">My Consultations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {consultations.map((consultation, index) => (
                      <div key={index} className="p-4 bg-blue-900/30 backdrop-blur-md rounded-lg border border-blue-500/20">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-bold text-white text-lg">{consultation.service_interest}</h3>
                            {consultation.preferred_date && (
                              <div className="flex items-center gap-2 text-sm text-white/80 mt-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(consultation.preferred_date).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Badge className={
                              consultation.status === 'confirmed' 
                                ? 'bg-green-500/20 text-green-400 border-green-500/50'
                                : consultation.status === 'pending'
                                ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                                : 'bg-gray-500/20 text-gray-400 border-gray-500/50'
                            }>
                              {consultation.status}
                            </Badge>
                            <Badge className={
                              consultation.payment_status === 'paid'
                                ? 'bg-green-500/20 text-green-400 border-green-500/50'
                                : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                            }>
                              {consultation.payment_status}
                            </Badge>
                          </div>
                        </div>
                        {consultation.message && (
                          <p className="text-white/80 text-sm mb-3">{consultation.message}</p>
                        )}
                        <div className="flex items-center justify-between pt-3 border-t border-blue-500/20">
                          <div className="text-sm text-white/60">
                            Booking ID: {consultation.id.slice(0, 8).toUpperCase()}
                          </div>
                          {consultation.payment_status === 'paid' && (
                            <Button size="sm" variant="outline" className="border-blue-500/50 text-white hover:bg-blue-500/20">
                              <Download className="w-4 h-4 mr-2" />
                              Receipt
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    {consultations.length === 0 && (
                      <div className="text-center py-12">
                        <Calendar className="w-16 h-16 text-white/40 mx-auto mb-4" />
                        <p className="text-white/60 mb-4">No consultations yet</p>
                        <Link to={createPageUrl("Consultation")}>
                          <Button className="bg-blue-500/30 hover:bg-blue-500/50 text-white border border-blue-500/50">
                            Book Your First Consultation
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* QR Codes Tab */}
            <TabsContent value="qr-codes">
              <Card className="bg-blue-900/20 backdrop-blur-md border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-white">QR Code History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {qrCodes.map((qr, index) => (
                      <div key={index} className="p-4 bg-blue-900/30 backdrop-blur-md rounded-lg border border-blue-500/20">
                        <div className="flex items-center justify-between mb-3">
                          <QrCode className="w-6 h-6 text-white" />
                          <Badge className={
                            qr.status === 'safe'
                              ? 'bg-green-500/20 text-green-400 border-green-500/50'
                              : qr.status === 'suspicious'
                              ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                              : 'bg-red-500/20 text-red-400 border-red-500/50'
                          }>
                            {qr.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-white font-mono mb-2 truncate">
                          {qr.payload}
                        </div>
                        <div className="text-xs text-white/60">
                          {new Date(qr.created_date).toLocaleDateString()}
                        </div>
                        <div className="mt-3 pt-3 border-t border-blue-500/20">
                          <Badge variant="outline" className="border-white/30 text-white bg-white/10 text-xs">
                            {qr.type}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {qrCodes.length === 0 && (
                      <div className="col-span-full text-center py-12">
                        <QrCode className="w-16 h-16 text-white/40 mx-auto mb-4" />
                        <p className="text-white/60 mb-4">No QR codes generated yet</p>
                        <Link to={createPageUrl("QRGenerator")}>
                          <Button className="bg-purple-500/30 hover:bg-purple-500/50 text-white border border-purple-500/50">
                            Generate Your First QR Code
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="bg-blue-900/20 backdrop-blur-md border-blue-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">Security Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-500/10 backdrop-blur-md border border-green-500/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-white">Account Verified</span>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/50">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-500/10 backdrop-blur-md border border-blue-500/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-white" />
                        <span className="text-white">2FA Enabled</span>
                      </div>
                      <Badge className="bg-white/10 text-white border-white/30">Optional</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-500/10 backdrop-blur-md border border-purple-500/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <QrCode className="w-5 h-5 text-purple-400" />
                        <span className="text-white">QR Security Scan</span>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/50">Enabled</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-blue-900/20 backdrop-blur-md border-blue-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Scans</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {qrCodes.filter(q => q.status).slice(0, 5).map((qr, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-blue-900/30 backdrop-blur-md rounded border border-blue-500/20">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-white" />
                            <span className="text-sm text-white/80 truncate max-w-[200px]">
                              {qr.type}
                            </span>
                          </div>
                          <Badge className={
                            qr.status === 'safe'
                              ? 'bg-green-500/20 text-green-400 border-green-500/50'
                              : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                          }>
                            {qr.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Account Tab */}
            <TabsContent value="account">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="bg-blue-900/20 backdrop-blur-md border-blue-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">Account Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-sm text-white/60 mb-1">Full Name</div>
                      <div className="text-white">{user.full_name || 'Not set'}</div>
                    </div>
                    <div>
                      <div className="text-sm text-white/60 mb-1">Email</div>
                      <div className="text-white">{user.email}</div>
                    </div>
                    <div>
                      <div className="text-sm text-white/60 mb-1">Role</div>
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                        {user.role || 'user'}
                      </Badge>
                    </div>
                    <div>
                      <div className="text-sm text-white/60 mb-1">Member Since</div>
                      <div className="text-white">
                        {new Date(user.created_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-blue-900/20 backdrop-blur-md border-blue-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start bg-blue-500/20 hover:bg-blue-500/30 text-white border border-blue-500/30">
                      <User className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button className="w-full justify-start bg-blue-500/20 hover:bg-blue-500/30 text-white border border-blue-500/30">
                      <Shield className="w-4 h-4 mr-2" />
                      Security Settings
                    </Button>
                    <Button className="w-full justify-start bg-blue-500/20 hover:bg-blue-500/30 text-white border border-blue-500/30">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Billing & Payments
                    </Button>
                    <Button 
                      className="w-full justify-start bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
                      onClick={() => base44.auth.logout()}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}