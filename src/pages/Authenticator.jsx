import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Scan, Shield, Star, Lock, Key, Smartphone, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SEOHead from '@/components/SEOHead';
import QRScanner from '@/components/authenticator/QRScanner';
import CredentialCard from '@/components/authenticator/CredentialCard';
import ManualEntryForm from '@/components/authenticator/ManualEntryForm';
import { toast } from 'sonner';

export default function AuthenticatorPage() {
  const [user, setUser] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [mfaStatus, setMfaStatus] = useState({ enabled: false, loading: true });
  const [sessions, setSessions] = useState([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    (async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (isAuth) {
          const userData = await base44.auth.me();
          setUser(userData);
        } else {
          base44.auth.redirectToLogin();
        }
      } catch (e) {
        console.error('Auth check failed:', e);
      }
    })();
  }, []);

  const { data: credentials = [], isLoading } = useQuery({
    queryKey: ['authenticator-credentials'],
    queryFn: () => base44.entities.AuthenticatorCredential.list('-sort_order', 100),
    enabled: !!user,
  });

  // Fetch MFA status
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { data } = await base44.functions.invoke('mfaSessionStatus');
        setMfaStatus({ enabled: data?.mfaEnabled || false, loading: false });
      } catch (err) {
        console.error('MFA status check failed:', err);
        setMfaStatus({ enabled: false, loading: false });
      }
    })();
  }, [user]);

  // Fetch active sessions
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { data } = await base44.functions.invoke('mfaGetTrustedDevices');
        setSessions(data?.devices || []);
      } catch (err) {
        console.error('Failed to load sessions:', err);
      }
    })();
  }, [user]);

  const createCredentialMutation = useMutation({
    mutationFn: (data) => base44.entities.AuthenticatorCredential.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authenticator-credentials'] });
      toast.success('Credential added successfully');
      setShowScanner(false);
      setShowManualEntry(false);
    },
    onError: (err) => {
      toast.error('Failed to add credential');
      console.error('Create credential error:', err);
    }
  });

  const updateCredentialMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.AuthenticatorCredential.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authenticator-credentials'] });
      toast.success('Credential updated');
    }
  });

  const deleteCredentialMutation = useMutation({
    mutationFn: (id) => base44.entities.AuthenticatorCredential.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authenticator-credentials'] });
      toast.success('Credential deleted');
    }
  });

  const handleQRScan = (data) => {
    try {
      const url = new URL(data);
      if (url.protocol !== 'otpauth:') {
        toast.error('Invalid authenticator QR code');
        return;
      }

      const type = url.hostname; // totp or hotp
      const label = decodeURIComponent(url.pathname.slice(1));
      const params = new URLSearchParams(url.search);

      const secret = params.get('secret');
      if (!secret) {
        toast.error('QR code missing secret key');
        return;
      }

      const [issuer, accountName] = label.includes(':') 
        ? label.split(':').map(s => s.trim()) 
        : [params.get('issuer') || 'Unknown', label];

      createCredentialMutation.mutate({
        account_name: accountName,
        issuer: issuer,
        secret: secret,
        algorithm: params.get('algorithm') || 'SHA1',
        digits: parseInt(params.get('digits') || '6'),
        period: parseInt(params.get('period') || '30')
      });
    } catch (err) {
      toast.error('Invalid QR code format');
      console.error('QR parse error:', err);
    }
  };

  const handleManualAdd = (data) => {
    createCredentialMutation.mutate(data);
  };

  const handleToggleFavorite = (id, isFavorite) => {
    updateCredentialMutation.mutate({ id, data: { is_favorite: !isFavorite } });
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this credential?')) {
      deleteCredentialMutation.mutate(id);
    }
  };

  const handleToggleMFA = async () => {
    if (mfaStatus.enabled) {
      if (confirm('Are you sure you want to disable 2FA? This will make your account less secure.')) {
        try {
          await base44.functions.invoke('mfaDisable');
          setMfaStatus({ enabled: false, loading: false });
          toast.success('2FA disabled');
        } catch (err) {
          toast.error('Failed to disable 2FA');
        }
      }
    } else {
      window.location.href = '/account-security?action=setup-mfa';
    }
  };

  const handleRevokeSession = async (deviceId) => {
    if (confirm('Revoke this device? You will need to verify again on next login.')) {
      try {
        await base44.functions.invoke('mfaRevokeTrustedDevice', { deviceId });
        setSessions(sessions.filter(s => s.deviceId !== deviceId));
        toast.success('Device revoked');
      } catch (err) {
        toast.error('Failed to revoke device');
      }
    }
  };

  const favorites = credentials.filter(c => c.is_favorite);
  const regular = credentials.filter(c => !c.is_favorite);

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen text-white p-4 sm:p-6 lg:p-8">
      <SEOHead 
        title="Security Hub - 2FA & Account Protection | GlyphLock"
        description="Manage two-factor authentication, TOTP credentials, and account security settings"
        url="/authenticator"
      />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 border-2 border-emerald-400/60 flex items-center justify-center">
            <Shield className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300">Security Hub</h1>
            <p className="text-sm text-slate-400">2FA, Credentials & Account Protection</p>
          </div>
        </div>

        <Tabs defaultValue="credentials" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="credentials" className="flex items-center gap-2">
              <Key className="w-4 h-4" />
              <span className="hidden sm:inline">TOTP Credentials</span>
              <span className="sm:hidden">Credentials</span>
            </TabsTrigger>
            <TabsTrigger value="mfa" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span className="hidden sm:inline">2FA Settings</span>
              <span className="sm:hidden">2FA</span>
            </TabsTrigger>
            <TabsTrigger value="sessions" className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              <span className="hidden sm:inline">Active Sessions</span>
              <span className="sm:hidden">Sessions</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="credentials">
            <div className="flex justify-end gap-2 mb-6">
              <Button
                onClick={() => setShowScanner(true)}
                className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 preserve-size"
              >
                <Scan className="w-4 h-4 mr-2" />
                Scan QR
              </Button>
              <Button
                onClick={() => setShowManualEntry(true)}
                variant="outline"
                className="border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/20 preserve-size"
              >
                <Plus className="w-4 h-4 mr-2" />
                Manual
              </Button>
            </div>

            {/* Credentials List */}
            {isLoading ? (
              <div className="text-center text-slate-400 py-12">Loading credentials...</div>
            ) : credentials.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-700 rounded-2xl">
                <Shield className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 mb-4">No credentials added yet</p>
                <p className="text-sm text-slate-500 mb-6">Scan a QR code or add manually to get started</p>
                <Button
                  onClick={() => setShowScanner(true)}
                  className="bg-gradient-to-r from-emerald-600 to-cyan-600"
                >
                  <Scan className="w-4 h-4 mr-2" />
                  Scan First QR Code
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Favorites */}
                {favorites.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3 text-sm text-emerald-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-semibold uppercase tracking-wider">Favorites</span>
                    </div>
                    <div className="grid gap-3">
                      {favorites.map(cred => (
                        <CredentialCard
                          key={cred.id}
                          credential={cred}
                          onToggleFavorite={handleToggleFavorite}
                          onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Regular Credentials */}
                {regular.length > 0 && (
                  <div>
                    {favorites.length > 0 && (
                      <div className="mb-3 text-sm text-slate-400 font-semibold uppercase tracking-wider">
                        All Accounts
                      </div>
                    )}
                    <div className="grid gap-3">
                      {regular.map(cred => (
                        <CredentialCard
                          key={cred.id}
                          credential={cred}
                          onToggleFavorite={handleToggleFavorite}
                          onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="mfa">
            <div className="grid gap-6">
              <Card className="bg-slate-900/60 border-2 border-emerald-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-emerald-300">
                    <Lock className="w-5 h-5" />
                    Two-Factor Authentication
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {mfaStatus.enabled ? (
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-amber-400" />
                        )}
                        <span className="font-semibold text-white">
                          {mfaStatus.enabled ? '2FA Enabled' : '2FA Disabled'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400">
                        {mfaStatus.enabled 
                          ? 'Your account is protected with two-factor authentication'
                          : 'Enable 2FA to add an extra layer of security to your account'}
                      </p>
                    </div>
                    <Button
                      onClick={handleToggleMFA}
                      disabled={mfaStatus.loading}
                      className={mfaStatus.enabled 
                        ? 'bg-red-600 hover:bg-red-500' 
                        : 'bg-gradient-to-r from-emerald-600 to-cyan-600'}
                    >
                      {mfaStatus.enabled ? 'Disable 2FA' : 'Enable 2FA'}
                    </Button>
                  </div>

                  {mfaStatus.enabled && (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                      <p className="text-sm text-emerald-200 mb-2">
                        <strong>Protected:</strong> You'll be prompted for a verification code on new devices
                      </p>
                      <p className="text-xs text-slate-400">
                        Store recovery codes in a secure location. You'll need them if you lose access to your authenticator.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-slate-900/60 border-2 border-cyan-500/30">
                <CardHeader>
                  <CardTitle className="text-cyan-300">Security Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-cyan-400 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white mb-1">Use TOTP Authenticator</p>
                      <p className="text-sm text-slate-400">Prefer TOTP apps over SMS for better security</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-cyan-400 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white mb-1">Backup Recovery Codes</p>
                      <p className="text-sm text-slate-400">Store codes offline in case you lose your device</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-cyan-400 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white mb-1">Review Active Sessions</p>
                      <p className="text-sm text-slate-400">Regularly check for unauthorized devices</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sessions">
            <Card className="bg-slate-900/60 border-2 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-purple-300">Active Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                {sessions.length === 0 ? (
                  <div className="text-center py-12">
                    <Smartphone className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">No trusted devices found</p>
                    <p className="text-sm text-slate-500 mt-2">Devices will appear here after successful 2FA verification</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sessions.map((session) => (
                      <div key={session.deviceId} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-purple-500/20">
                        <div className="flex items-start gap-3">
                          <Smartphone className="w-5 h-5 text-purple-400 mt-1" />
                          <div>
                            <p className="font-semibold text-white">{session.deviceName || 'Unknown Device'}</p>
                            <p className="text-sm text-slate-400">Last active: {new Date(session.lastUsed).toLocaleDateString()}</p>
                            <p className="text-xs text-slate-500 mt-1">{session.ipAddress || 'IP unavailable'}</p>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleRevokeSession(session.deviceId)}
                          variant="outline"
                          size="sm"
                          className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                        >
                          Revoke
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* QR Scanner Modal */}
      {showScanner && (
        <QRScanner
          onScan={handleQRScan}
          onClose={() => setShowScanner(false)}
        />
      )}

      {/* Manual Entry Modal */}
      {showManualEntry && (
        <ManualEntryForm
          onSubmit={handleManualAdd}
          onClose={() => setShowManualEntry(false)}
          isSubmitting={createCredentialMutation.isPending}
        />
      )}
    </div>
  );
}