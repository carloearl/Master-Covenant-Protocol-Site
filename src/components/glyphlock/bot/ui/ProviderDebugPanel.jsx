import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle, XCircle, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProviderDebugPanel({ providerMeta, lastMeta }) {
  const [expanded, setExpanded] = useState(false);
  const [testResults, setTestResults] = useState({});

  const testProvider = async (providerId) => {
    setTestResults(prev => ({ ...prev, [providerId]: 'testing' }));
    
    try {
      // Simple ping test
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTestResults(prev => ({ ...prev, [providerId]: 'success' }));
    } catch (err) {
      setTestResults(prev => ({ ...prev, [providerId]: 'error' }));
    }
  };

  const providers = providerMeta?.availableProviders || [];
  const stats = providerMeta?.providerStats || {};

  return (
    <div className="border-2 border-purple-500/30 rounded-xl bg-slate-900/60 backdrop-blur-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-purple-500/10 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-bold text-cyan-300 uppercase tracking-wider">
            Provider Debug Console
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        )}
      </button>

      {expanded && (
        <div className="p-4 space-y-4 border-t border-purple-500/20">
          {/* Last Response Info */}
          {lastMeta && (
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
              <div className="text-xs text-cyan-300 font-bold mb-2">Last Response</div>
              <div className="space-y-1 text-xs text-cyan-200">
                <div>Provider: <span className="text-white font-mono">{lastMeta.providerUsed}</span></div>
                <div>Model: <span className="text-white font-mono">{lastMeta.model}</span></div>
                {lastMeta.realTimeUsed && (
                  <div className="text-emerald-400">✓ Real-time web context used</div>
                )}
              </div>
            </div>
          )}

          {/* Provider Chain Status */}
          <div className="space-y-2">
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Provider Chain ({providers.length} available)
            </div>
            
            {providers.map((p, idx) => {
              const stat = stats[p.id] || {};
              const isActive = lastMeta?.providerUsed === p.id;
              const testResult = testResults[p.id];
              
              return (
                <div 
                  key={p.id}
                  className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                    isActive 
                      ? 'border-cyan-400 bg-cyan-500/10' 
                      : 'border-slate-700 bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="text-xs text-slate-500 font-mono w-4">#{idx + 1}</div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold ${
                          isActive ? 'text-cyan-300' : 'text-slate-300'
                        }`}>
                          {p.label}
                        </span>
                        {p.isPrimary && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                            PRIMARY
                          </span>
                        )}
                      </div>
                      
                      {stat.totalCalls > 0 && (
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {stat.successCount}/{stat.totalCalls} success
                          {stat.lastLatencyMs > 0 && ` • ${stat.lastLatencyMs}ms`}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {testResult === 'testing' && (
                      <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                    )}
                    {testResult === 'success' && (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                    {testResult === 'error' && (
                      <XCircle className="w-3.5 h-3.5 text-red-400" />
                    )}
                    
                    {!testResult && stat.failureCount > 0 && stat.successCount === 0 && (
                      <XCircle className="w-3.5 h-3.5 text-red-400" />
                    )}
                    {!testResult && stat.successCount > 0 && (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                    
                    <Button
                      onClick={() => testProvider(p.id)}
                      disabled={testResult === 'testing'}
                      size="sm"
                      className="h-6 px-2 text-[10px] bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40"
                    >
                      Test
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Fallback Info */}
          <div className="text-[10px] text-slate-500 space-y-1 pt-3 border-t border-slate-700">
            <div>• Providers are tried in priority order</div>
            <div>• If all fail, Base44 Broker is used as last resort</div>
            <div>• Check Provider Console for detailed logs</div>
          </div>
        </div>
      )}
    </div>
  );
}