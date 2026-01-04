import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Bell, Shield, Key, Eye, EyeOff, Copy, RefreshCw, Trash2,
  Settings, Layout, Palette, Globe, Mail, Smartphone,
  CheckCircle, AlertTriangle, Clock, Plus, ArrowLeft
} from "lucide-react";
import { motion } from "framer-motion";

export default function UserSettings() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState({});
  const [apiKeys, setApiKeys] = useState([]);
  
  const [preferences, setPreferences] = useState({
    notifications: {
      systemStatus: true,
      protocolAnnouncements: true,
      securityAlerts: true,
      weeklyDigest: false,
      emailNotifications: true,
      pushNotifications: false
    },
    dashboard: {
      defaultView: "grid",
      showRecentActivity: true,
      showQuickActions: true,
      compactMode: false,
      darkMode: true
    },
    privacy: {
      showProfilePublicly: false,
      allowAnalytics: true,
      shareUsageData: false
    }
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) {
        navigate(createPageUrl("Home"));
        return;
      }
      const userData = await base44.auth.me();
      setUser(userData);
      
      if (userData.settings) {
        setPreferences(prev => ({ ...prev, ...userData.settings }));
      }
      
      // Load API keys
      const keys = await base44.entities.APIKey.filter({ owner_id: userData.email });
      setApiKeys(keys);
    } catch (err) {
      console.error("Failed to load user:", err);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    setSaving(true);
    try {
      await base44.auth.updateMe({ settings: preferences });
      toast.success("Settings saved successfully");
    } catch (err) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const generateApiKey = async () => {
    try {
      const keyName = `API Key ${apiKeys.length + 1}`;
      const publicKey = `gl_pk_${crypto.randomUUID().replace(/-/g, '').slice(0, 24)}`;
      const secretKey = `gl_sk_${crypto.randomUUID().replace(/-/g, '')}`;
      
      await base44.entities.APIKey.create({
        name: keyName,
        public_key: publicKey,
        secret_key_hash: btoa(secretKey),
        owner_id: user.email,
        status: "active",
        permissions: ["read", "write"]
      });
      
      toast.success("API Key generated! Copy your secret key now - it won't be shown again.", {
        description: secretKey,
        duration: 15000
      });
      
      loadUserData();
    } catch (err) {
      toast.error("Failed to generate API key");
    }
  };

  const revokeApiKey = async (keyId) => {
    try {
      await base44.entities.APIKey.update(keyId, { status: "revoked" });
      toast.success("API key revoked");
      loadUserData();
    } catch (err) {
      toast.error("Failed to revoke key");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <>
      <SEOHead 
        title="User Settings - GlyphLock"
        description="Manage your GlyphLock account settings, notifications, and API keys"
        url="/UserSettings"
      />
      
      <div className="min-h-screen py-24 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(createPageUrl("CommandCenter"))}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">User Settings</h1>
              <p className="text-gray-400">Manage your account preferences and security</p>
            </div>
          </div>

          <Tabs defaultValue="notifications" className="space-y-6">
            <TabsList className="bg-blue-950/50 border border-blue-500/30 p-1">
              <TabsTrigger value="notifications" className="data-[state=active]:bg-blue-600">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-blue-600">
                <Layout className="w-4 h-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-blue-600">
                <Shield className="w-4 h-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="api" className="data-[state=active]:bg-blue-600">
                <Key className="w-4 h-4 mr-2" />
                API Keys
              </TabsTrigger>
            </TabsList>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card className="bg-blue-950/30 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Bell className="w-5 h-5 text-blue-400" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>Control how and when you receive updates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Alert Types</h3>
                    
                    {[
                      { key: "systemStatus", label: "System Status Updates", desc: "Get notified when system status changes" },
                      { key: "protocolAnnouncements", label: "Protocol Announcements", desc: "New covenant updates and enforcement news" },
                      { key: "securityAlerts", label: "Security Alerts", desc: "Critical security notifications for your account" },
                      { key: "weeklyDigest", label: "Weekly Digest", desc: "Summary of activity and updates" }
                    ].map(item => (
                      <div key={item.key} className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-white/5">
                        <div>
                          <p className="text-white font-medium">{item.label}</p>
                          <p className="text-sm text-gray-400">{item.desc}</p>
                        </div>
                        <Switch
                          checked={preferences.notifications[item.key]}
                          onCheckedChange={(checked) => setPreferences(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, [item.key]: checked }
                          }))}
                        />
                      </div>
                    ))}
                  </div>

                  <Separator className="bg-white/10" />

                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Delivery Methods</h3>
                    
                    <div className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-white/5">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="text-white font-medium">Email Notifications</p>
                          <p className="text-sm text-gray-400">{user?.email}</p>
                        </div>
                      </div>
                      <Switch
                        checked={preferences.notifications.emailNotifications}
                        onCheckedChange={(checked) => setPreferences(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, emailNotifications: checked }
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-white/5">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="text-white font-medium">Push Notifications</p>
                          <p className="text-sm text-gray-400">Browser notifications</p>
                        </div>
                      </div>
                      <Switch
                        checked={preferences.notifications.pushNotifications}
                        onCheckedChange={(checked) => setPreferences(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, pushNotifications: checked }
                        }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard">
              <Card className="bg-blue-950/30 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Layout className="w-5 h-5 text-blue-400" />
                    Dashboard Customization
                  </CardTitle>
                  <CardDescription>Personalize your dashboard experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { key: "showRecentActivity", label: "Show Recent Activity", desc: "Display activity feed on dashboard" },
                      { key: "showQuickActions", label: "Quick Actions Panel", desc: "Show shortcuts to common tasks" },
                      { key: "compactMode", label: "Compact Mode", desc: "Reduce spacing for more content" },
                      { key: "darkMode", label: "Dark Mode", desc: "Use dark theme (recommended)" }
                    ].map(item => (
                      <div key={item.key} className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-white/5">
                        <div>
                          <p className="text-white font-medium">{item.label}</p>
                          <p className="text-sm text-gray-400">{item.desc}</p>
                        </div>
                        <Switch
                          checked={preferences.dashboard[item.key]}
                          onCheckedChange={(checked) => setPreferences(prev => ({
                            ...prev,
                            dashboard: { ...prev.dashboard, [item.key]: checked }
                          }))}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-lg bg-black/20 border border-white/5">
                    <Label className="text-white mb-2 block">Default Dashboard View</Label>
                    <div className="flex gap-2">
                      {["grid", "list", "compact"].map(view => (
                        <Button
                          key={view}
                          variant={preferences.dashboard.defaultView === view ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPreferences(prev => ({
                            ...prev,
                            dashboard: { ...prev.dashboard, defaultView: view }
                          }))}
                          className={preferences.dashboard.defaultView === view ? "bg-blue-600" : ""}
                        >
                          {view.charAt(0).toUpperCase() + view.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card className="bg-blue-950/30 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    Privacy & Security
                  </CardTitle>
                  <CardDescription>Manage your privacy settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    { key: "showProfilePublicly", label: "Public Profile", desc: "Allow others to see your profile" },
                    { key: "allowAnalytics", label: "Usage Analytics", desc: "Help improve GlyphLock with anonymous usage data" },
                    { key: "shareUsageData", label: "Share Usage Data", desc: "Share feature usage for research" }
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-white/5">
                      <div>
                        <p className="text-white font-medium">{item.label}</p>
                        <p className="text-sm text-gray-400">{item.desc}</p>
                      </div>
                      <Switch
                        checked={preferences.privacy[item.key]}
                        onCheckedChange={(checked) => setPreferences(prev => ({
                          ...prev,
                          privacy: { ...prev.privacy, [item.key]: checked }
                        }))}
                      />
                    </div>
                  ))}

                  <Separator className="bg-white/10" />

                  <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                      <div>
                        <p className="text-yellow-400 font-medium">Advanced Security</p>
                        <p className="text-sm text-gray-400 mt-1">
                          For MFA, trusted devices, and session management, visit the{" "}
                          <Button variant="link" className="p-0 h-auto text-blue-400" onClick={() => navigate(createPageUrl("AccountSecurity"))}>
                            Account Security
                          </Button>{" "}
                          page.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* API Keys Tab */}
            <TabsContent value="api">
              <Card className="bg-blue-950/30 border-blue-500/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Key className="w-5 h-5 text-blue-400" />
                        API Keys
                      </CardTitle>
                      <CardDescription>Manage your API access credentials</CardDescription>
                    </div>
                    <Button onClick={generateApiKey} className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Generate Key
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {apiKeys.length === 0 ? (
                    <div className="text-center py-12">
                      <Key className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">No API keys yet</p>
                      <p className="text-sm text-gray-500">Generate a key to access the GlyphLock API</p>
                    </div>
                  ) : (
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-3">
                        {apiKeys.map(key => (
                          <motion.div
                            key={key.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 rounded-lg bg-black/20 border border-white/5"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-white font-medium">{key.name}</span>
                                <Badge variant={key.status === "active" ? "default" : "destructive"}>
                                  {key.status}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => copyToClipboard(key.public_key)}
                                  className="text-gray-400 hover:text-white"
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                                {key.status === "active" && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => revokeApiKey(key.id)}
                                    className="text-red-400 hover:text-red-300"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <code className="text-sm text-gray-400 bg-black/30 px-2 py-1 rounded">
                                {key.public_key}
                              </code>
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Created {new Date(key.created_date).toLocaleDateString()}
                              </span>
                              {key.last_used && (
                                <span>Last used {new Date(key.last_used).toLocaleDateString()}</span>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Save Button */}
          <div className="flex justify-end mt-6">
            <Button 
              onClick={savePreferences} 
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 min-w-[150px]"
            >
              {saving ? (
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}