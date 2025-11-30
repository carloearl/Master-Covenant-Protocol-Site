import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import SEOHead from '@/components/SEOHead';
import { 
  Activity, Zap, CheckCircle, XCircle, AlertCircle, Clock,
  ArrowLeft, RefreshCw, Shield, Cpu, TrendingUp, Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// OMEGA CHAIN V3: Gemini Primary (FREE) → OpenAI → Claude → OpenRouter → OSS
const PRIORITY_ORDER_AUDIT = ['GEMINI', 'OPENAI', 'CLAUDE', 'OPENROUTER', 'LOCAL_OSS'];
const PRIORITY_ORDER_GENERAL = ['GEMINI', 'OPENAI', 'CLAUDE', 'OPENROUTER', 'LOCAL_OSS'];

const PROVIDER_LABELS = {
  'GEMINI': 'Gemini Flash (Primary)',
  'OPENAI': 'OpenAI GPT-4',
  'CLAUDE': 'Claude Sonnet',
  'OPENROUTER': 'OpenRouter',
  'LOCAL_OSS': 'Local Fallback',
  'BASE44_BROKER': 'Base44 Broker'
};

function getStatusColor(provider) {
  if (!provider?.enabled) return 'border-slate-700 bg-slate-800/50 text-slate-600';
  if (!provider?.stats) return 'border-slate-600 bg-slate-800/30 text-slate-400';
  
  const { successCount, failureCount } = provider.stats;
  if (successCount > 0 && failureCount === 0) return 'border-emerald-500 bg-emerald-500/10 text-emerald-400';
  if (successCount > 0 && failureCount > 0) return 'border-yellow-500 bg-yellow-500/10 text-yellow-400';
  if (failureCount > 0 && successCount === 0) return 'border-red-500 bg-red-500/10 text-red-400';
  return 'border-slate-600 bg-slate-800/30 text-slate-400';
}

function getStatusIcon(provider) {
  if (!provider?.enabled) return <XCircle className="w-4 h-4 text-slate-500" />;
  if (!provider?.stats) return <Clock className="w-4 h-4 text-slate-400" />;
  
  const { successCount, failureCount } = provider.stats;
  if (successCount > 0 && failureCount === 0) return <CheckCircle className="w-4 h-4 text-emerald-400" />;
  if (successCount > 0 && failureCount > 0) return <AlertCircle className="w-4 h-4 text-yellow-400" />;
  if (failureCount > 0 && successCount === 0) return <XCircle className="w-4 h-4 text-red-400" />;
  return <Clock className="w-4 h-4 text-slate-400" />;
}

export default function ProviderConsole() {
  const [providerMeta, setProviderMeta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem('glyphbot_provider_meta');
    if (stored) {
      try {
        setProviderMeta(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse provider meta:', e);
      }
    }
    setLoading(false);
  }, []);

  const providers = providerMeta?.availableProviders || [];
  const stats = providerMeta?.providerStats || {};
  const totalCalls = Object.values(stats).reduce((sum, s) => sum + (s?.totalCalls || 0), 0);
  const totalSuccess = Object.values(stats).reduce((sum, s) => sum + (s?.successCount || 0), 0);
  const totalFailure = Object.values(stats).reduce((sum, s) => sum + (s?.failureCount || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#030712] via-slate-950 to-[#030712] text-slate-50 pt-20 pb-16">
      <SEOHead 
        title="Provider Console | GlyphBot Chain Analytics"
        description="Real-time LLM provider monitoring and chain orchestration for GlyphBot."
      />

      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Link to={createPageUrl('Home')}>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-800">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Link to={createPageUrl('GlyphBot')}>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-800">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to GlyphBot
                </Button>
              </Link>
            </div>
            <div className="h-6 w-px bg-slate-700" />
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <Activity className="w-6 h-6 text-cyan-400" />
              Provider Chain Console
            </h1>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.location.reload()}
            className="border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full" />
          </div>
        ) : !providerMeta ? (
          <div className="text-center py-20">
            <Cpu className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-400 mb-2">No Provider Data</h2>
            <p className="text-slate-500 mb-6">Send a message in GlyphBot to initialize the provider chain.</p>
            <Link to={createPageUrl('GlyphBot')}>
              <Button className="bg-cyan-600 hover:bg-cyan-500">
                Open GlyphBot
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Enabled Providers</div>
                <div className="text-3xl font-bold text-white">{providers.filter(p => p.enabled).length}</div>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Calls</div>
                <div className="text-3xl font-bold text-cyan-400">{totalCalls}</div>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Success Rate</div>
                <div className="text-3xl font-bold text-emerald-400">
                  {totalCalls > 0 ? Math.round((totalSuccess / totalCalls) * 100) : 0}%
                </div>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Failures</div>
                <div className="text-3xl font-bold text-red-400">{totalFailure}</div>
              </div>
            </div>

            {/* Provider Chain Visualization */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                Active Provider Chain
              </h2>
              
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {PRIORITY_ORDER_GENERAL.map((providerId, idx) => {
                  const provider = providers.find(p => p.id === providerId);
                  const providerStats = stats[providerId];
                  const isUsed = providerMeta?.providerUsed === providerId;
                  
                  return (
                    <React.Fragment key={providerId}>
                      {idx > 0 && (
                        <div className="text-slate-600 text-lg">→</div>
                      )}
                      <div className={`
                        flex items-center gap-2 px-4 py-3 rounded-lg border transition-all
                        ${provider ? getStatusColor(provider) : 'border-slate-700 bg-slate-800/30 text-slate-600'}
                        ${isUsed ? 'ring-2 ring-cyan-400/60 shadow-lg shadow-cyan-500/20' : ''}
                      `}>
                        {provider ? getStatusIcon(provider) : <XCircle className="w-4 h-4 text-slate-600" />}
                        <div>
                          <div className="text-sm font-medium whitespace-nowrap">
                            {PROVIDER_LABELS[providerId] || providerId}
                          </div>
                          {providerStats && (
                            <div className="text-[10px] text-slate-500">
                              {providerStats.totalCalls} calls • {providerStats.lastLatencyMs || 0}ms
                            </div>
                          )}
                        </div>
                        {isUsed && (
                          <span className="ml-2 px-1.5 py-0.5 bg-cyan-500/20 text-cyan-300 text-[9px] rounded uppercase">Active</span>
                        )}
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Individual Provider Stats */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                Provider Statistics
              </h2>
              
              <div className="grid gap-3">
                {providers.map(provider => {
                  const providerStats = stats[provider.id];
                  return (
                    <div 
                      key={provider.id}
                      className={`flex items-center justify-between p-4 rounded-lg border ${getStatusColor(provider)}`}
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(provider)}
                        <div>
                          <div className="font-medium">{provider.label}</div>
                          <div className="text-xs text-slate-500">
                            Priority: {provider.priority} • JSON Mode: {provider.jsonMode ? 'Yes' : 'No'}
                          </div>
                        </div>
                      </div>
                      
                      {providerStats && (
                        <div className="flex items-center gap-6 text-sm">
                          <div className="text-center">
                            <div className="text-slate-400">Calls</div>
                            <div className="font-bold">{providerStats.totalCalls}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-emerald-400">Success</div>
                            <div className="font-bold text-emerald-400">{providerStats.successCount}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-red-400">Fail</div>
                            <div className="font-bold text-red-400">{providerStats.failureCount}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-slate-400">Latency</div>
                            <div className="font-bold">{providerStats.lastLatencyMs || 0}ms</div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chain Priority Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-3">
                  Audit Mode Chain
                </h3>
                <div className="flex flex-wrap gap-2">
                  {PRIORITY_ORDER_AUDIT.map((id, idx) => (
                    <span key={id} className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs">
                      {idx + 1}. {PROVIDER_LABELS[id] || id}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-3">
                  General Chat Chain
                </h3>
                <div className="flex flex-wrap gap-2">
                  {PRIORITY_ORDER_GENERAL.map((id, idx) => (
                    <span key={id} className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs">
                      {idx + 1}. {PROVIDER_LABELS[id] || id}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Auto-Selector Info */}
            <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <Shield className="w-8 h-8 text-cyan-400 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Omega Chain Auto-Selector</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    The Omega Chain automatically routes requests through the optimal provider path. 
                    <strong className="text-cyan-300"> Gemini Flash is the primary provider (FREE)</strong>, with 
                    <strong className="text-purple-300"> OpenAI as the first fallback</strong> and 
                    <strong className="text-blue-300"> Claude as the secondary fallback</strong>. 
                    DeepSeek has been permanently disabled from the chain.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}