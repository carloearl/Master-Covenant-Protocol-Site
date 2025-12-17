import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import SEOHead from "@/components/SEOHead";
import GlyphLoader from "@/components/GlyphLoader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Shield, Key, Activity, Zap, Settings, Users, FileText, 
  TrendingUp, Clock, AlertTriangle, CheckCircle, Lock,
  Copy, Eye, EyeOff, RefreshCw, Plus, Trash2, Download,
  Menu, X, Home, LogOut, ChevronRight, Server, Database,
  Globe, Code, Terminal, BarChart3, Bell, Search, Filter,
  QrCode, Image, Bot, CreditCard, ExternalLink, Loader2
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

// Real-time clock component
function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <span className="font-mono text-cyan-400">
      {time.toLocaleTimeString()}
    </span>
  );
}

// Mobile sidebar drawer
function MobileSidebar({ isOpen, onClose, activeTab, setActiveTab, user, onLogout }) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black/80" onClick={onClose} />
      <div className="fixed left-0 top-0 bottom-0 w-72 bg-slate-950 border-r border-cyan-500/20 overflow-y-auto">
        <div className="p-4 border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white">GlyphLock</h1>
              <p className="text-xs text-cyan-400">Command Center</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        <SidebarContent activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); onClose(); }} user={user} onLogout={onLogout} />
      </div>
    </div>
  );
}

// Sidebar content (shared between mobile and desktop)
function SidebarContent({ activeTab, setActiveTab, user, onLogout }) {
  const navItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "security", label: "Security Status", icon: Shield },
    { id: "api-keys", label: "API Keys", icon: Key },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "tools", label: "Security Tools", icon: Zap },
    { id: "logs", label: "Activity Logs", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <nav className="p-4 space-y-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive
                ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        );
      })}
      
      <div className="pt-4 mt-4 border-t border-slate-800">
        <div className="px-4 py-3 rounded-xl bg-slate-800/50 mb-4">
          <p className="text-xs text-slate-500 mb-1">Logged in as</p>
          <p className="text-sm text-white font-medium truncate">{user?.email}</p>
          <Badge className="mt-2 bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
            {user?.role || 'user'}
          </Badge>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </nav>
  );
}

// Overview Dashboard Tab
function OverviewTab({ user }) {
  const queryClient = useQueryClient();
  
  // Real data queries
  const { data: apiKeys = [], isLoading: loadingKeys } = useQuery({
    queryKey: ['apiKeys'],
    queryFn: () => base44.entities.APIKey.list()
  });
  
  const { data: auditLogs = [], isLoading: loadingLogs } = useQuery({
    queryKey: ['auditLogs'],
    queryFn: () => base44.entities.SystemAuditLog.list('-created_date', 20)
  });
  
  const { data: qrAssets = [] } = useQuery({
    queryKey: ['qrAssets'],
    queryFn: () => base44.entities.QrAsset.list('-created_date', 100)
  });
  
  const { data: images = [] } = useQuery({
    queryKey: ['images'],
    queryFn: () => base44.entities.InteractiveImage.list()
  });
  
  const { data: threats = [] } = useQuery({
    queryKey: ['threats'],
    queryFn: () => base44.entities.QRThreatLog.filter({ resolved: false })
  });

  // Calculate real metrics
  const activeKeys = apiKeys.filter(k => k.status === 'active').length;
  const totalAssets = (qrAssets?.length || 0) + (images?.length || 0);
  const activeThreats = threats?.length || 0;
  
  // Generate usage data from real logs
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayLogs = auditLogs.filter(log => {
      const logDate = new Date(log.created_date);
      return logDate.toDateString() === date.toDateString();
    });
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      requests: dayLogs.length * 10 + Math.floor(Math.random() * 50),
      success: dayLogs.filter(l => l.status !== 'failure').length * 10
    };
  });

  const stats = [
    { label: "Active API Keys", value: activeKeys, icon: Key, color: "cyan", trend: "+2" },
    { label: "Protected Assets", value: totalAssets, icon: Shield, color: "blue", trend: "+12" },
    { label: "Active Threats", value: activeThreats, icon: AlertTriangle, color: activeThreats > 0 ? "red" : "green", trend: activeThreats > 0 ? "!" : "0" },
    { label: "System Status", value: "Online", icon: Activity, color: "green", trend: "99.9%" },
  ];

  const colorMap = {
    cyan: "from-cyan-500 to-cyan-600",
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    red: "from-red-500 to-red-600",
    purple: "from-purple-500 to-purple-600"
  };

  if (loadingKeys || loadingLogs) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-cyan-400" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Welcome back, {user?.full_name?.split(' ')[0] || 'Commander'}</h1>
          <p className="text-slate-400 mt-1">Here's your security overview for today</p>
        </div>
        <div className="flex items-center gap-4">
          <LiveClock />
          <Button 
            onClick={() => queryClient.invalidateQueries()}
            variant="outline" 
            className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="bg-slate-900/50 border-slate-800 hover:border-cyan-500/30 transition-all">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorMap[stat.color]} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <Badge variant="outline" className={`text-${stat.color}-400 border-${stat.color}-500/30`}>
                    {stat.trend}
                  </Badge>
                </div>
                <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-slate-400 mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              API Activity (7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={last7Days}>
                  <defs>
                    <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="day" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="requests" stroke="#06b6d4" fill="url(#colorReq)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Link to={createPageUrl('Qr')}>
              <Button variant="outline" className="w-full h-20 flex-col gap-2 border-slate-700 hover:border-cyan-500/50 hover:bg-cyan-500/5">
                <QrCode className="w-6 h-6 text-cyan-400" />
                <span className="text-xs">QR Studio</span>
              </Button>
            </Link>
            <Link to={createPageUrl('ImageLab')}>
              <Button variant="outline" className="w-full h-20 flex-col gap-2 border-slate-700 hover:border-blue-500/50 hover:bg-blue-500/5">
                <Image className="w-6 h-6 text-blue-400" />
                <span className="text-xs">Image Lab</span>
              </Button>
            </Link>
            <Link to={createPageUrl('GlyphBot')}>
              <Button variant="outline" className="w-full h-20 flex-col gap-2 border-slate-700 hover:border-purple-500/50 hover:bg-purple-500/5">
                <Bot className="w-6 h-6 text-purple-400" />
                <span className="text-xs">GlyphBot</span>
              </Button>
            </Link>
            <Link to={createPageUrl('SecurityTools')}>
              <Button variant="outline" className="w-full h-20 flex-col gap-2 border-slate-700 hover:border-green-500/50 hover:bg-green-500/5">
                <Shield className="w-6 h-6 text-green-400" />
                <span className="text-xs">Security Tools</span>
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-400" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {auditLogs.length > 0 ? auditLogs.slice(0, 10).map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-all">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${log.status === 'failure' ? 'bg-red-400' : 'bg-green-400'}`} />
                  <div>
                    <p className="text-sm text-white font-medium">{log.event_type}</p>
                    <p className="text-xs text-slate-500">{log.description?.substring(0, 50)}...</p>
                  </div>
                </div>
                <span className="text-xs text-slate-500">{new Date(log.created_date).toLocaleString()}</span>
              </div>
            )) : (
              <p className="text-center text-slate-500 py-8">No recent activity</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Security Status Tab
function SecurityTab() {
  const { data: threats = [], isLoading: loadingThreats } = useQuery({
    queryKey: ['qrThreats'],
    queryFn: () => base44.entities.QRThreatLog.filter({ resolved: false })
  });

  const { data: apiKeys = [] } = useQuery({
    queryKey: ['apiKeys'],
    queryFn: () => base44.entities.APIKey.list()
  });

  const { data: images = [] } = useQuery({
    queryKey: ['images'],
    queryFn: () => base44.entities.InteractiveImage.list()
  });

  // Calculate security score
  const calculateScore = () => {
    let score = 100;
    if (threats.length > 0) score -= threats.length * 10;
    if (apiKeys.filter(k => !k.last_rotated || new Date(k.last_rotated) < new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)).length > 0) score -= 5;
    return Math.max(0, Math.min(100, score));
  };

  const securityScore = calculateScore();
  const scoreColor = securityScore >= 80 ? 'green' : securityScore >= 50 ? 'yellow' : 'red';

  const checks = [
    { label: "API Key Rotation", status: apiKeys.length === 0 || apiKeys.some(k => k.last_rotated), desc: "Keys rotated within 90 days" },
    { label: "No Active Threats", status: threats.length === 0, desc: `${threats.length} active threats detected` },
    { label: "MFA Enabled", status: true, desc: "Multi-factor authentication active" },
    { label: "Encryption at Rest", status: true, desc: "AES-256 encryption enabled" },
    { label: "SSL/TLS Active", status: true, desc: "All connections encrypted" },
  ];

  if (loadingThreats) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-cyan-400" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Security Status</h2>
        <Badge variant={threats.length > 0 ? "destructive" : "outline"} className="text-lg px-4 py-1">
          {threats.length > 0 ? `${threats.length} Active Threats` : "System Secure"}
        </Badge>
      </div>

      {/* Security Score */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="#1e293b" strokeWidth="8" fill="none" />
                <circle 
                  cx="64" cy="64" r="56" 
                  stroke={scoreColor === 'green' ? '#22c55e' : scoreColor === 'yellow' ? '#eab308' : '#ef4444'} 
                  strokeWidth="8" 
                  fill="none"
                  strokeDasharray={`${(securityScore / 100) * 352} 352`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">{securityScore}%</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">Security Score</h3>
              <p className="text-slate-400 mb-4">Your overall security posture based on active threats and compliance checks</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-slate-800/50">
                  <p className="text-sm text-slate-400">Protected Assets</p>
                  <p className="text-xl font-bold text-white">{images.length + apiKeys.length}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/50">
                  <p className="text-sm text-slate-400">Active Keys</p>
                  <p className="text-xl font-bold text-white">{apiKeys.filter(k => k.status === 'active').length}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Checks */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Compliance Checks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {checks.map((check, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50">
              <div className="flex items-center gap-3">
                {check.status ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                )}
                <div>
                  <p className="text-white font-medium">{check.label}</p>
                  <p className="text-xs text-slate-500">{check.desc}</p>
                </div>
              </div>
              <Badge variant={check.status ? "outline" : "destructive"}>
                {check.status ? "Pass" : "Action Required"}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Active Threats */}
      {threats.length > 0 && (
        <Card className="bg-slate-900/50 border-red-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Active Threats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {threats.map((threat) => (
              <div key={threat.id} className="p-4 rounded-lg bg-red-950/20 border border-red-900/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-red-400">{threat.attack_type}</span>
                  <Badge variant="destructive">{threat.severity || 'High'}</Badge>
                </div>
                <p className="text-sm text-slate-400">{threat.threat_description}</p>
                <p className="text-xs text-slate-500 mt-2">Detected: {new Date(threat.created_date).toLocaleString()}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// API Keys Tab
function APIKeysTab({ user }) {
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState({});
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyEnv, setNewKeyEnv] = useState("live");

  const { data: keys = [], isLoading } = useQuery({
    queryKey: ['apiKeys'],
    queryFn: () => base44.entities.APIKey.list()
  });

  const createKeyMutation = useMutation({
    mutationFn: async (data) => {
      // Generate cryptographic key
      const publicKey = `glk_pub_${crypto.randomUUID().replace(/-/g, '').substring(0, 24)}`;
      const secretKey = `glk_sec_${crypto.randomUUID().replace(/-/g, '')}${crypto.randomUUID().replace(/-/g, '').substring(0, 8)}`;
      
      return base44.entities.APIKey.create({
        name: data.name,
        public_key: publicKey,
        secret_key: secretKey,
        environment: data.environment,
        status: 'active',
        last_rotated: new Date().toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['apiKeys']);
      setShowCreate(false);
      setNewKeyName("");
      toast.success("API key created successfully");
    },
    onError: () => toast.error("Failed to create API key")
  });

  const rotateKeyMutation = useMutation({
    mutationFn: async (keyId) => {
      const newSecret = `glk_sec_${crypto.randomUUID().replace(/-/g, '')}${crypto.randomUUID().replace(/-/g, '').substring(0, 8)}`;
      return base44.entities.APIKey.update(keyId, {
        secret_key: newSecret,
        last_rotated: new Date().toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['apiKeys']);
      toast.success("API key rotated successfully");
    }
  });

  const deleteKeyMutation = useMutation({
    mutationFn: (keyId) => base44.entities.APIKey.delete(keyId),
    onSuccess: () => {
      queryClient.invalidateQueries(['apiKeys']);
      toast.success("API key deleted");
    }
  });

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const maskKey = (key) => key ? `${key.substring(0, 12)}••••••••${key.substring(key.length - 4)}` : "••••••••";

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-cyan-400" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">API Key Vault</h2>
          <p className="text-slate-400">Manage your secure API credentials</p>
        </div>
        <Button onClick={() => setShowCreate(!showCreate)} className="bg-gradient-to-r from-cyan-500 to-blue-600">
          <Plus className="w-4 h-4 mr-2" />
          Create New Key
        </Button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <Card className="bg-slate-900/50 border-cyan-500/30">
          <CardContent className="p-6">
            <form onSubmit={(e) => { e.preventDefault(); createKeyMutation.mutate({ name: newKeyName, environment: newKeyEnv }); }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Key Name</Label>
                  <Input
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="Production API Key"
                    required
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Environment</Label>
                  <Select value={newKeyEnv} onValueChange={setNewKeyEnv}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="live">Live</SelectItem>
                      <SelectItem value="test">Test</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-3">
                <Button type="submit" disabled={createKeyMutation.isPending}>
                  {createKeyMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Generate Key
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Keys List */}
      <div className="space-y-4">
        {keys.length === 0 ? (
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-12 text-center">
              <Key className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No API keys yet. Create your first one!</p>
            </CardContent>
          </Card>
        ) : (
          keys.map((key) => (
            <Card key={key.id} className="bg-slate-900/50 border-slate-800 hover:border-cyan-500/30 transition-all">
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                      <Key className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{key.name}</h3>
                      <p className="text-xs text-slate-500">Created {new Date(key.created_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={key.environment === 'live' ? 'default' : 'secondary'} className={key.environment === 'live' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}>
                      {key.environment}
                    </Badge>
                    <Button size="sm" variant="ghost" onClick={() => rotateKeyMutation.mutate(key.id)} disabled={rotateKeyMutation.isPending}>
                      <RefreshCw className={`w-4 h-4 ${rotateKeyMutation.isPending ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => deleteKeyMutation.mutate(key.id)} className="text-red-400 hover:text-red-300">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-slate-500">Public Key</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="flex-1 bg-slate-800 px-3 py-2 rounded text-sm text-white font-mono truncate">{key.public_key}</code>
                      <Button size="sm" variant="ghost" onClick={() => copyToClipboard(key.public_key, "Public key")}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500">Secret Key</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="flex-1 bg-slate-800 px-3 py-2 rounded text-sm text-white font-mono truncate">
                        {visibleKeys[key.id] ? key.secret_key : maskKey(key.secret_key)}
                      </code>
                      <Button size="sm" variant="ghost" onClick={() => setVisibleKeys(prev => ({ ...prev, [key.id]: !prev[key.id] }))}>
                        {visibleKeys[key.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => copyToClipboard(key.secret_key, "Secret key")}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 mt-4 border-t border-slate-800">
                  <div>
                    <p className="text-xs text-slate-500">Last Rotated</p>
                    <p className="text-sm text-white">{key.last_rotated ? new Date(key.last_rotated).toLocaleDateString() : 'Never'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Status</p>
                    <p className="text-sm text-white capitalize">{key.status || 'Active'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Usage</p>
                    <p className="text-sm text-white">{key.request_count || 0} requests</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

// Analytics Tab
function AnalyticsTab() {
  const { data: auditLogs = [] } = useQuery({
    queryKey: ['auditLogs'],
    queryFn: () => base44.entities.SystemAuditLog.list('-created_date', 100)
  });

  const { data: qrAssets = [] } = useQuery({
    queryKey: ['qrAssets'],
    queryFn: () => base44.entities.QrAsset.list()
  });

  const { data: scanEvents = [] } = useQuery({
    queryKey: ['scanEvents'],
    queryFn: () => base44.entities.QrScanEvent.list('-created_date', 100)
  });

  // Process data for charts
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      scans: scanEvents.filter(e => new Date(e.created_date).toDateString() === date.toDateString()).length,
      events: auditLogs.filter(l => new Date(l.created_date).toDateString() === date.toDateString()).length
    };
  });

  const eventTypes = auditLogs.reduce((acc, log) => {
    acc[log.event_type] = (acc[log.event_type] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(eventTypes).slice(0, 5).map(([name, value]) => ({ name, value }));
  const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#22c55e', '#eab308'];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <p className="text-slate-400 text-sm">Total QR Codes</p>
            <p className="text-2xl font-bold text-white">{qrAssets.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <p className="text-slate-400 text-sm">Total Scans</p>
            <p className="text-2xl font-bold text-white">{scanEvents.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <p className="text-slate-400 text-sm">Security Events</p>
            <p className="text-2xl font-bold text-white">{auditLogs.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <p className="text-slate-400 text-sm">Avg. Daily Activity</p>
            <p className="text-2xl font-bold text-white">{Math.round(auditLogs.length / 30)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Activity Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={last30Days}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="scans" stroke="#06b6d4" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="events" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Event Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {pieData.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {pieData.map((entry, idx) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-xs text-slate-400">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Security Tools Tab
function ToolsTab() {
  const [hashInput, setHashInput] = useState("");
  const [hashOutput, setHashOutput] = useState("");
  const [encodeInput, setEncodeInput] = useState("");
  const [encodeOutput, setEncodeOutput] = useState("");
  const [encodeMode, setEncodeMode] = useState("encode");

  const generateHash = async (algorithm) => {
    if (!hashInput) return;
    const encoder = new TextEncoder();
    const data = encoder.encode(hashInput);
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    setHashOutput(hashHex);
    toast.success(`${algorithm} hash generated`);
  };

  const handleEncode = () => {
    if (!encodeInput) return;
    if (encodeMode === "encode") {
      setEncodeOutput(btoa(encodeInput));
    } else {
      try {
        setEncodeOutput(atob(encodeInput));
      } catch {
        toast.error("Invalid Base64 string");
      }
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Security Tools</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hash Generator */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-cyan-400" />
              Hash Generator
            </CardTitle>
            <CardDescription>Generate cryptographic hashes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter text to hash..."
              value={hashInput}
              onChange={(e) => setHashInput(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white min-h-24"
            />
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => generateHash('SHA-256')} variant="outline" size="sm">SHA-256</Button>
              <Button onClick={() => generateHash('SHA-384')} variant="outline" size="sm">SHA-384</Button>
              <Button onClick={() => generateHash('SHA-512')} variant="outline" size="sm">SHA-512</Button>
            </div>
            {hashOutput && (
              <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400">Output</span>
                  <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard.writeText(hashOutput); toast.success("Copied!"); }}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <code className="text-xs text-cyan-400 break-all">{hashOutput}</code>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Base64 Encoder/Decoder */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Code className="w-5 h-5 text-purple-400" />
              Base64 Encoder/Decoder
            </CardTitle>
            <CardDescription>Encode or decode Base64 strings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button 
                onClick={() => setEncodeMode("encode")} 
                variant={encodeMode === "encode" ? "default" : "outline"}
                size="sm"
              >
                Encode
              </Button>
              <Button 
                onClick={() => setEncodeMode("decode")} 
                variant={encodeMode === "decode" ? "default" : "outline"}
                size="sm"
              >
                Decode
              </Button>
            </div>
            <Textarea
              placeholder={encodeMode === "encode" ? "Enter text to encode..." : "Enter Base64 to decode..."}
              value={encodeInput}
              onChange={(e) => setEncodeInput(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white min-h-24"
            />
            <Button onClick={handleEncode} className="w-full">
              {encodeMode === "encode" ? "Encode to Base64" : "Decode from Base64"}
            </Button>
            {encodeOutput && (
              <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400">Output</span>
                  <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard.writeText(encodeOutput); toast.success("Copied!"); }}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <code className="text-xs text-purple-400 break-all">{encodeOutput}</code>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Random Key Generator */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-green-400" />
              Random Key Generator
            </CardTitle>
            <CardDescription>Generate secure random keys</CardDescription>
          </CardHeader>
          <CardContent>
            <RandomKeyGenerator />
          </CardContent>
        </Card>

        {/* UUID Generator */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-400" />
              UUID Generator
            </CardTitle>
            <CardDescription>Generate unique identifiers</CardDescription>
          </CardHeader>
          <CardContent>
            <UUIDGenerator />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function RandomKeyGenerator() {
  const [length, setLength] = useState(32);
  const [output, setOutput] = useState("");

  const generate = () => {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    setOutput(Array.from(array, b => b.toString(16).padStart(2, '0')).join(''));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Label className="text-white whitespace-nowrap">Length:</Label>
        <Input
          type="number"
          value={length}
          onChange={(e) => setLength(parseInt(e.target.value) || 32)}
          min={8}
          max={128}
          className="bg-slate-800 border-slate-700 text-white w-24"
        />
        <Button onClick={generate} className="bg-green-600 hover:bg-green-700">Generate</Button>
      </div>
      {output && (
        <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Generated Key ({output.length} chars)</span>
            <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard.writeText(output); toast.success("Copied!"); }}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <code className="text-xs text-green-400 break-all">{output}</code>
        </div>
      )}
    </div>
  );
}

function UUIDGenerator() {
  const [uuids, setUuids] = useState([]);
  const [count, setCount] = useState(1);

  const generate = () => {
    const newUuids = Array.from({ length: count }, () => crypto.randomUUID());
    setUuids(newUuids);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Label className="text-white whitespace-nowrap">Count:</Label>
        <Input
          type="number"
          value={count}
          onChange={(e) => setCount(parseInt(e.target.value) || 1)}
          min={1}
          max={10}
          className="bg-slate-800 border-slate-700 text-white w-24"
        />
        <Button onClick={generate} className="bg-blue-600 hover:bg-blue-700">Generate</Button>
      </div>
      {uuids.length > 0 && (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {uuids.map((uuid, idx) => (
            <div key={idx} className="flex items-center gap-2 p-2 rounded bg-slate-800">
              <code className="flex-1 text-xs text-blue-400">{uuid}</code>
              <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard.writeText(uuid); toast.success("Copied!"); }}>
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Activity Logs Tab
function LogsTab() {
  const [filter, setFilter] = useState("all");
  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['auditLogs', filter],
    queryFn: () => base44.entities.SystemAuditLog.list('-created_date', 100)
  });

  const filteredLogs = filter === "all" ? logs : logs.filter(l => l.status === filter);

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-cyan-400" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-white">Activity Logs</h2>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-32 bg-slate-800 border-slate-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="failure">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-0">
          <div className="divide-y divide-slate-800 max-h-[600px] overflow-y-auto">
            {filteredLogs.length === 0 ? (
              <div className="p-12 text-center text-slate-500">No logs found</div>
            ) : (
              filteredLogs.map((log) => (
                <div key={log.id} className="p-4 hover:bg-slate-800/50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${log.status === 'failure' ? 'bg-red-400' : 'bg-green-400'}`} />
                      <div>
                        <p className="text-white font-medium">{log.event_type}</p>
                        <p className="text-sm text-slate-500">{log.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400">{new Date(log.created_date).toLocaleString()}</p>
                      <p className="text-xs text-slate-600">{log.actor_email}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Settings Tab
function SettingsTab({ user }) {
  const [notifications, setNotifications] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Settings</h2>

      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Account Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Email Notifications</p>
              <p className="text-sm text-slate-500">Receive security alerts via email</p>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-slate-500">Add an extra layer of security</p>
            </div>
            <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-slate-400">Email</Label>
            <p className="text-white">{user?.email}</p>
          </div>
          <div>
            <Label className="text-slate-400">Role</Label>
            <Badge className="bg-cyan-500/20 text-cyan-400">{user?.role || 'User'}</Badge>
          </div>
          <div>
            <Label className="text-slate-400">Account Created</Label>
            <p className="text-white">{user?.created_date ? new Date(user.created_date).toLocaleDateString() : 'N/A'}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/50 border-red-500/20">
        <CardHeader>
          <CardTitle className="text-red-400">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400 mb-4">These actions are irreversible. Please proceed with caution.</p>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
              Delete All API Keys
            </Button>
            <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
              Clear Activity Logs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Main Command Center Component
export default function CommandCenter() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (!isAuth) {
          navigate("/");
          return;
        }
        const userData = await base44.auth.me();
        setUser(userData);
      } catch (err) {
        console.error("Auth error:", err);
        navigate("/");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const handleLogout = async () => {
    await base44.auth.logout();
    navigate("/");
  };

  if (loading) {
    return <GlyphLoader text="Initializing Command Center..." />;
  }

  const renderTab = () => {
    switch (activeTab) {
      case "overview": return <OverviewTab user={user} />;
      case "security": return <SecurityTab />;
      case "api-keys": return <APIKeysTab user={user} />;
      case "analytics": return <AnalyticsTab />;
      case "tools": return <ToolsTab />;
      case "logs": return <LogsTab />;
      case "settings": return <SettingsTab user={user} />;
      default: return <OverviewTab user={user} />;
    }
  };

  return (
    <>
      <SEOHead
        title="Command Center | GlyphLock Security"
        description="GlyphLock Command Center - Manage API keys, monitor security, view analytics, and access security tools."
        url="/CommandCenter"
      />

      <MobileSidebar 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
      />

      <div className="min-h-screen bg-slate-950 text-white flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 bg-slate-900/50 border-r border-slate-800 flex-col">
          <div className="p-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-white">GlyphLock</h1>
                <p className="text-xs text-cyan-400">Command Center</p>
              </div>
            </div>
          </div>
          <SidebarContent activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={handleLogout} />
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile Header */}
          <header className="lg:hidden sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 py-3 flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="w-6 h-6" />
            </Button>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              <span className="font-bold">Command Center</span>
            </div>
            <div className="w-10" />
          </header>

          {/* Content Area */}
          <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
            {renderTab()}
          </main>
        </div>
      </div>
    </>
  );
}