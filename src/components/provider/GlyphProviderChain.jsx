import React from 'react';
import { motion } from 'framer-motion';
import { Zap, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react';

const PRIORITY_ORDER = [
  'LLAMA_OSS',
  'MISTRAL_OSS', 
  'GEMMA_OSS',
  'DEEPSEEK_OSS',
  'CLAUDE',
  'OPENAI',
  'GEMINI',
  'BASE44_BROKER',
  'LOCAL_OSS'
];

function getProviderStatus(provider) {
  if (!provider.enabled) return 'disabled';
  if (!provider.stats) return 'idle';
  
  const { successCount, failureCount, lastErrorType } = provider.stats;
  
  if (successCount > 0 && failureCount === 0) return 'healthy';
  if (successCount > 0 && failureCount > 0) return 'degraded';
  if (failureCount > 0 && successCount === 0) return 'failed';
  
  return 'idle';
}

function getStatusColor(status) {
  switch (status) {
    case 'healthy': return 'border-emerald-500 bg-emerald-500/10 text-emerald-400';
    case 'degraded': return 'border-yellow-500 bg-yellow-500/10 text-yellow-400';
    case 'failed': return 'border-red-500 bg-red-500/10 text-red-400';
    case 'disabled': return 'border-slate-700 bg-slate-800/50 text-slate-600';
    default: return 'border-slate-600 bg-slate-800/30 text-slate-500';
  }
}

function getStatusIcon(status) {
  switch (status) {
    case 'healthy': return CheckCircle;
    case 'degraded': return AlertCircle;
    case 'failed': return XCircle;
    default: return Clock;
  }
}

export default function GlyphProviderChain({ availableProviders, providerStats, providerUsed }) {
  if (!availableProviders || availableProviders.length === 0) {
    return null;
  }

  const sortedProviders = [...availableProviders].sort((a, b) => {
    const aIdx = PRIORITY_ORDER.indexOf(a.id);
    const bIdx = PRIORITY_ORDER.indexOf(b.id);
    return (aIdx === -1 ? 999 : aIdx) - (bIdx === -1 ? 999 : bIdx);
  });

  return (
    <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-2">
      <div className="flex items-center gap-1 text-[10px] text-slate-500 mr-2 whitespace-nowrap">
        <Zap className="w-3 h-3" />
        <span className="uppercase tracking-wider font-mono">Signal Chain</span>
      </div>
      
      {sortedProviders.map((provider, idx) => {
        const status = getStatusColor(getProviderStatus(provider));
        const StatusIcon = getStatusIcon(getProviderStatus(provider));
        const isActive = provider.id === providerUsed;
        const stats = provider.stats || providerStats?.[provider.id];
        
        return (
          <React.Fragment key={provider.id}>
            {idx > 0 && (
              <div className="text-slate-700 text-[10px]">→</div>
            )}
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className={`
                relative flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[10px] font-mono
                transition-all duration-200 whitespace-nowrap
                ${status}
                ${isActive ? 'ring-2 ring-cyan-400/50 shadow-lg shadow-cyan-500/20' : ''}
              `}
              title={`${provider.label}${stats ? ` | Calls: ${stats.totalCalls} | Success: ${stats.successCount} | Fail: ${stats.failureCount}` : ''}`}
            >
              <StatusIcon className="w-3 h-3" />
              <span className="hidden sm:inline">{provider.label.split(' ')[0]}</span>
              <span className="sm:hidden">{provider.id.slice(0, 3)}</span>
              
              {stats && stats.lastLatencyMs > 0 && (
                <span className="text-[8px] opacity-60">
                  {stats.lastLatencyMs}ms
                </span>
              )}
              
              {isActive && (
                <motion.div
                  className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </motion.div>
          </React.Fragment>
        );
      })}
    </div>
  );
}