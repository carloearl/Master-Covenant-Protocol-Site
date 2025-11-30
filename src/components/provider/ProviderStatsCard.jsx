import React from 'react';
import { motion } from 'framer-motion';
import { Activity, CheckCircle, XCircle, Clock, Zap } from 'lucide-react';

export default function ProviderStatsCard({ provider }) {
  if (!provider) return null;

  const { id, label, enabled, stats } = provider;
  const hasStats = stats && stats.totalCalls > 0;
  
  const successRate = hasStats 
    ? Math.round((stats.successCount / stats.totalCalls) * 100) 
    : 0;

  const getHealthColor = () => {
    if (!enabled) return 'from-slate-800 to-slate-900';
    if (!hasStats) return 'from-slate-700 to-slate-800';
    if (successRate >= 90) return 'from-emerald-900/50 to-slate-900';
    if (successRate >= 50) return 'from-yellow-900/50 to-slate-900';
    return 'from-red-900/50 to-slate-900';
  };

  const getBorderColor = () => {
    if (!enabled) return 'border-slate-700';
    if (!hasStats) return 'border-slate-600';
    if (successRate >= 90) return 'border-emerald-500/50';
    if (successRate >= 50) return 'border-yellow-500/50';
    return 'border-red-500/50';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative rounded-xl border p-4 overflow-hidden
        bg-gradient-to-br ${getHealthColor()} ${getBorderColor()}
      `}
    >
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
      
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-200">{label}</h3>
          <p className="text-[10px] text-slate-500 font-mono">{id}</p>
        </div>
        <div className={`
          px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider
          ${enabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-500'}
        `}>
          {enabled ? 'Enabled' : 'Disabled'}
        </div>
      </div>
      
      {hasStats ? (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 rounded-lg bg-slate-900/50">
              <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
                <Activity className="w-3 h-3" />
              </div>
              <div className="text-lg font-bold text-slate-200">{stats.totalCalls}</div>
              <div className="text-[9px] text-slate-500 uppercase">Calls</div>
            </div>
            
            <div className="text-center p-2 rounded-lg bg-slate-900/50">
              <div className="flex items-center justify-center gap-1 text-emerald-400 mb-1">
                <CheckCircle className="w-3 h-3" />
              </div>
              <div className="text-lg font-bold text-emerald-400">{stats.successCount}</div>
              <div className="text-[9px] text-slate-500 uppercase">Success</div>
            </div>
            
            <div className="text-center p-2 rounded-lg bg-slate-900/50">
              <div className="flex items-center justify-center gap-1 text-red-400 mb-1">
                <XCircle className="w-3 h-3" />
              </div>
              <div className="text-lg font-bold text-red-400">{stats.failureCount}</div>
              <div className="text-[9px] text-slate-500 uppercase">Failed</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                <span>Success Rate</span>
                <span className="font-mono">{successRate}%</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${
                    successRate >= 90 ? 'bg-emerald-500' :
                    successRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${successRate}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-[10px]">
            <div className="flex items-center gap-1 text-slate-500">
              <Clock className="w-3 h-3" />
              <span>Last: {stats.lastLatencyMs}ms</span>
            </div>
            {stats.lastUsedAt && (
              <span className="text-slate-600 font-mono">
                {new Date(stats.lastUsedAt).toLocaleTimeString()}
              </span>
            )}
          </div>
          
          {stats.lastErrorType && (
            <div className="mt-2 p-2 rounded bg-red-900/20 border border-red-500/30">
              <div className="text-[10px] text-red-400 font-mono truncate">
                {stats.lastErrorType}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center py-4 text-slate-600">
          <div className="text-center">
            <Zap className="w-6 h-6 mx-auto mb-1 opacity-50" />
            <p className="text-[10px]">No calls yet</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}