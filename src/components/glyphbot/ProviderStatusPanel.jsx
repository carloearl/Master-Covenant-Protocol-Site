import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, Clock, CheckCircle, XCircle, AlertCircle, Braces } from 'lucide-react';

// OMEGA CHAIN PATCH: OpenAI Primary → Claude/Gemini Chain → OSS Fallback
const PROVIDER_DISPLAY_ORDER = [
  'OPENAI',       // PRIMARY
  'CLAUDE',       // Chain
  'GEMINI',       // Chain
  'LLAMA_OSS',    // OSS
  'MISTRAL_OSS',  // OSS
  'GEMMA_OSS',    // OSS
  'BASE44_BROKER',
  'LOCAL_OSS'
  // DeepSeek REMOVED
];

const JSON_MODE_SUPPORT = {
  OPENAI: true,
  CLAUDE: true,
  GEMINI: true,
  LLAMA_OSS: true,
  MISTRAL_OSS: true,
  GEMMA_OSS: true,
  LOCAL_OSS: false,
  BASE44_BROKER: false
};

const PROVIDER_LABELS = {
  'OPENAI': 'GPT-4 (Primary)',
  'CLAUDE': 'Claude (Chain)',
  'GEMINI': 'Gemini (Chain)',
  'LLAMA_OSS': 'Llama',
  'MISTRAL_OSS': 'Mistral',
  'GEMMA_OSS': 'Gemma',
  'LOCAL_OSS': 'Local',
  'BASE44_BROKER': 'Base44'
};

function getStatusColor(provider) {
  if (!provider.enabled) return 'bg-slate-700 border-slate-600';
  if (!provider.stats) return 'bg-slate-800 border-slate-600';
  
  const { successCount, failureCount } = provider.stats;
  
  if (successCount > 0 && failureCount === 0) return 'bg-emerald-900/30 border-emerald-500/50';
  if (successCount > 0 && failureCount > 0) return 'bg-yellow-900/30 border-yellow-500/50';
  if (failureCount > 0 && successCount === 0) return 'bg-red-900/30 border-red-500/50';
  
  return 'bg-slate-800 border-slate-600';
}

function getStatusIcon(provider) {
  if (!provider.enabled) return <XCircle className="w-3 h-3 text-slate-500" />;
  if (!provider.stats) return <Clock className="w-3 h-3 text-slate-400" />;
  
  const { successCount, failureCount } = provider.stats;
  
  if (successCount > 0 && failureCount === 0) return <CheckCircle className="w-3 h-3 text-emerald-400" />;
  if (successCount > 0 && failureCount > 0) return <AlertCircle className="w-3 h-3 text-yellow-400" />;
  if (failureCount > 0 && successCount === 0) return <XCircle className="w-3 h-3 text-red-400" />;
  
  return <Clock className="w-3 h-3 text-slate-400" />;
}

export default function ProviderStatusPanel({ 
  availableProviders = [], 
  providerStats = {}, 
  providerUsed = null,
  jsonModeEnabled = false,
  onProviderSelect = null 
}) {
  const sortedProviders = PROVIDER_DISPLAY_ORDER
    .map(id => availableProviders.find(p => p.id === id))
    .filter(Boolean);

  if (sortedProviders.length === 0) {
    return (
      <div className="text-xs text-slate-500 p-2">
        No provider data available
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase tracking-wider">
        <Cpu className="w-3 h-3" />
        <span>Provider Signal Chain</span>
        {jsonModeEnabled && (
          <span className="px-1.5 py-0.5 bg-purple-500/20 text-purple-300 rounded text-[9px]">
            JSON Mode
          </span>
        )}
      </div>
      
      <div className="flex flex-wrap gap-1.5">
        {sortedProviders.map((provider, idx) => {
          const isActive = provider.id === providerUsed;
          const supportsJSON = JSON_MODE_SUPPORT[provider.id] || false;
          const stats = provider.stats || providerStats[provider.id];
          
          return (
            <motion.div
              key={provider.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.03 }}
              onClick={() => onProviderSelect?.(provider.id)}
              className={`
                relative flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-[10px] font-mono
                transition-all duration-200 cursor-pointer
                ${getStatusColor(provider)}
                ${isActive ? 'ring-2 ring-cyan-400/60 shadow-lg shadow-cyan-500/20' : 'hover:border-slate-500'}
              `}
            >
              {getStatusIcon(provider)}
              
              <span className={`${provider.enabled ? 'text-slate-300' : 'text-slate-500'}`}>
                {provider.label.split(' ')[0]}
              </span>
              
              {supportsJSON && (
                <Braces className="w-2.5 h-2.5 text-purple-400" title="JSON Mode Supported" />
              )}
              
              {stats?.lastLatencyMs > 0 && (
                <span className="text-[8px] text-slate-500">
                  {stats.lastLatencyMs}ms
                </span>
              )}
              
              {isActive && (
                <motion.div
                  className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-cyan-400 rounded-full"
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
      
      <div className="flex items-center gap-4 text-[9px] text-slate-500 pt-1">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
          <span>Healthy</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
          <span>Degraded</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500/50" />
          <span>Failed</span>
        </div>
        <div className="flex items-center gap-1">
          <Braces className="w-2.5 h-2.5 text-purple-400" />
          <span>JSON Mode</span>
        </div>
      </div>
    </div>
  );
}