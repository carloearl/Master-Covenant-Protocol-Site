import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, ArrowLeft, Cpu, Shield, Zap, RefreshCw } from 'lucide-react';
import { createPageUrl } from '@/utils';
import SEOHead from '@/components/SEOHead';
import ProviderStatsCard from '@/components/provider/ProviderStatsCard';
import GlyphProviderChain from '@/components/provider/GlyphProviderChain';
import AutoSelectorExplainer from '@/components/provider/AutoSelectorExplainer';

// OMEGA CHAIN PATCH: OpenAI Primary → Claude/Gemini Chain → OSS Fallback
const PRIORITY_ORDER_AUDIT = [
  'OPENAI',       // PRIMARY (always entry/exit)
  'CLAUDE',       // Chain Module
  'GEMINI',       // Chain Module
  'LLAMA_OSS',    // Secondary OSS
  'MISTRAL_OSS',  // Secondary OSS
  'GEMMA_OSS',    // Secondary OSS
  'BASE44_BROKER',
  'LOCAL_OSS'
  // DeepSeek REMOVED
];

const PRIORITY_ORDER_GENERAL = [
  'OPENAI',       // PRIMARY (always entry/exit)
  'CLAUDE',       // Chain fallback
  'GEMINI',       // Chain fallback
  'LLAMA_OSS',    // Secondary OSS
  'MISTRAL_OSS',  // Secondary OSS
  'GEMMA_OSS',    // Secondary OSS
  'BASE44_BROKER',
  'LOCAL_OSS'
  // DeepSeek REMOVED
];

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

  const availableProviders = providerMeta?.availableProviders || [];
  const providerStats = providerMeta?.providerStats || {};
  const providerUsed = providerMeta?.providerUsed || null;

  const enabledCount = availableProviders.filter(p => p.enabled).length;
  const totalCalls = Object.values(providerStats).reduce((sum, s) => sum + (s?.totalCalls || 0), 0);
  const totalSuccess = Object.values(providerStats).reduce((sum, s) => sum + (s?.successCount || 0), 0);
  const totalFail = Object.values(providerStats).reduce((sum, s) => sum + (s?.failureCount || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <SEOHead 
        title="Provider Console | GlyphBot Intelligence Dashboard"
        description="Monitor GlyphBot's multi-provider LLM routing, analytics, and fallback chain status."
      />
      
      <div className="max-w-6xl mx-auto px-4 py-8 pt-24">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              to={createPageUrl('GlyphBot')}
              className="p-2 rounded-lg bg-slate-800 border border-slate-700 hover:border-cyan-500/50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-400" />
            </Link>
            
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Provider Intelligence Console
              </h1>
              <p className="text-sm text-slate-500">
                GlyphBot Multi-Provider Routing System
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-emerald-400"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
              Live Status
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
          </div>
        ) : !providerMeta ? (
          <div className="text-center py-20">
            <Cpu className="w-16 h-16 mx-auto text-slate-700 mb-4" />
            <h2 className="text-xl font-bold text-slate-400 mb-2">No Provider Data Available</h2>
            <p className="text-sm text-slate-600 mb-6">
              Send a message to GlyphBot to populate provider analytics.
            </p>
            <Link
              to={createPageUrl('GlyphBot')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition-colors"
            >
              <Zap className="w-4 h-4" />
              Open GlyphBot
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
              <GlyphProviderChain
                availableProviders={availableProviders}
                providerStats={providerStats}
                providerUsed={providerUsed}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800"
              >
                <div className="flex items-center gap-2 text-slate-500 mb-2">
                  <Cpu className="w-4 h-4" />
                  <span className="text-[10px] uppercase tracking-wider">Providers</span>
                </div>
                <div className="text-2xl font-bold text-slate-200">{enabledCount}</div>
                <div className="text-[10px] text-slate-600">Enabled</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800"
              >
                <div className="flex items-center gap-2 text-slate-500 mb-2">
                  <Activity className="w-4 h-4" />
                  <span className="text-[10px] uppercase tracking-wider">Total Calls</span>
                </div>
                <div className="text-2xl font-bold text-slate-200">{totalCalls}</div>
                <div className="text-[10px] text-slate-600">This Session</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-4 rounded-xl bg-emerald-900/30 border border-emerald-500/30"
              >
                <div className="flex items-center gap-2 text-emerald-400 mb-2">
                  <Shield className="w-4 h-4" />
                  <span className="text-[10px] uppercase tracking-wider">Success</span>
                </div>
                <div className="text-2xl font-bold text-emerald-400">{totalSuccess}</div>
                <div className="text-[10px] text-slate-600">Calls</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-4 rounded-xl bg-red-900/30 border border-red-500/30"
              >
                <div className="flex items-center gap-2 text-red-400 mb-2">
                  <Zap className="w-4 h-4" />
                  <span className="text-[10px] uppercase tracking-wider">Failed</span>
                </div>
                <div className="text-2xl font-bold text-red-400">{totalFail}</div>
                <div className="text-[10px] text-slate-600">Calls</div>
              </motion.div>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-bold text-slate-300 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                Provider Analytics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableProviders.map((provider, idx) => (
                  <motion.div
                    key={provider.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <ProviderStatsCard provider={provider} />
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-400" />
                  Audit Mode Priority Chain
                </h3>
                <div className="flex flex-wrap gap-2">
                  {PRIORITY_ORDER_AUDIT.map((id, idx) => (
                    <div
                      key={id}
                      className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-400"
                    >
                      <span className="text-purple-400">{idx + 1}.</span>
                      {id}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  General Chat Priority Chain
                </h3>
                <div className="flex flex-wrap gap-2">
                  {PRIORITY_ORDER_GENERAL.map((id, idx) => (
                    <div
                      key={id}
                      className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-400"
                    >
                      <span className="text-cyan-400">{idx + 1}.</span>
                      {id}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <AutoSelectorExplainer />
          </>
        )}
      </div>
    </div>
  );
}