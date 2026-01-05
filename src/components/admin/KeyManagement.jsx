import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Key, ShieldCheck, AlertTriangle, RefreshCw, CheckCircle, Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function KeyManagement() {
  const queryClient = useQueryClient();
  const [isInitializing, setIsInitializing] = useState(false);

  const { data: keys = [], isLoading } = useQuery({
    queryKey: ['qrKeys'],
    queryFn: async () => {
      try {
        return await base44.entities.QRKeyRegistry.list('-created_date');
      } catch (e) {
        console.warn('QRKeyRegistry not found, returning empty array');
        return [];
      }
    }
  });

  const initializeKey = async () => {
    try {
      setIsInitializing(true);
      const { data } = await base44.functions.invoke('initializeKeys');
      if (data?.error) throw new Error(data.error);
      
      toast.success('Platform key initialized successfully');
      queryClient.invalidateQueries(['qrKeys']);
    } catch (error) {
      console.error('Key init error:', error);
      toast.error('Failed to initialize key - backend function may not be available');
    } finally {
      setIsInitializing(false);
    }
  };

  const activeKeys = keys.filter(k => !k.revokedAt);
  const revokedKeys = keys.filter(k => k.revokedAt);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            Key Registry
          </h2>
          <p className="text-sm text-slate-400">Manage cryptographic trust anchors for QR and Asset signing</p>
        </div>
        <Button 
          onClick={initializeKey} 
          disabled={isInitializing || activeKeys.length > 0}
          className={activeKeys.length > 0 ? "bg-green-600/50 hover:bg-green-600/50 cursor-not-allowed" : "bg-cyan-600 hover:bg-cyan-700"}
        >
          {isInitializing ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : activeKeys.length > 0 ? (
            <CheckCircle className="w-4 h-4 mr-2" />
          ) : (
            <Key className="w-4 h-4 mr-2" />
          )}
          {activeKeys.length > 0 ? "Key Active" : "Initialize Platform Key"}
        </Button>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
          </div>
        ) : keys.length === 0 ? (
          <Card className="bg-slate-900/50 border-slate-800 border-dashed">
            <CardContent className="p-8 text-center">
              <Key className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No cryptographic keys found</p>
              <p className="text-sm text-slate-500 mt-2">
                Initialize a platform key to enable secure signing for QR codes and assets.
              </p>
            </CardContent>
          </Card>
        ) : (
          keys.map((key) => (
            <Card key={key.id} className={`bg-slate-900/50 border-slate-800 ${key.revokedAt ? 'opacity-75' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${key.revokedAt ? 'bg-red-500/10' : 'bg-green-500/10'}`}>
                      {key.revokedAt ? (
                        <AlertTriangle className="w-6 h-6 text-red-400" />
                      ) : (
                        <Key className="w-6 h-6 text-green-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-medium">{key.kid}</h3>
                        <Badge variant={key.revokedAt ? "destructive" : "outline"} className={!key.revokedAt ? "text-green-400 border-green-500/30" : ""}>
                          {key.revokedAt ? "Revoked" : "Active"}
                        </Badge>
                        <Badge variant="secondary" className="bg-slate-800 text-slate-400">
                          {key.keyType}
                        </Badge>
                      </div>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span className="w-20">Fingerprint:</span>
                          <code className="bg-slate-950 px-2 py-0.5 rounded text-cyan-400/80 font-mono">
                            {key.publicKey.substring(0, 16)}...{key.publicKey.substring(key.publicKey.length - 8)}
                          </code>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span className="w-20">Created:</span>
                          <span>{new Date(key.created_date).toLocaleString()}</span>
                        </div>
                        {key.revokedAt && (
                           <div className="flex items-center gap-2 text-xs text-red-400">
                           <span className="w-20">Revoked:</span>
                           <span>{new Date(key.revokedAt).toLocaleString()}</span>
                         </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {!key.revokedAt && (
                     <div className="flex flex-col gap-2">
                        {/* Placeholder for rotation/revocation features */}
                        <Button size="sm" variant="ghost" className="text-slate-500 hover:text-white" disabled>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Rotate
                        </Button>
                     </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}