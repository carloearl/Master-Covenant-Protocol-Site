import React from 'react';
import { Cpu, Shield, Zap } from 'lucide-react';

export default function AutoSelectorExplainer() {
  return (
    <div className="rounded-xl border border-cyan-500/20 bg-slate-900/80 p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
          <Cpu className="w-4 h-4 text-cyan-400" />
        </div>
        <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider">
          Auto Model Selector
        </h3>
      </div>
      
      <p className="text-xs text-slate-400 leading-relaxed">
        GlyphBot's Auto mode prioritizes open-source models (Llama, Mistral, Gemma, DeepSeek) when available for maximum transparency and cost efficiency. For audit operations, it activates a deep reasoning chain optimized for forensic analysis. When external providers fail, the system automatically cascades through fallbacks, ultimately reaching the LOCAL_OSS engine which requires no API keys and never fails. This ensures GlyphBot always responds, even in degraded network conditions.
      </p>
      
      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
          <Zap className="w-3 h-3" />
          <span>OSS First</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-purple-400">
          <Shield className="w-3 h-3" />
          <span>Audit Chain</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-amber-400">
          <Cpu className="w-3 h-3" />
          <span>Local Fallback</span>
        </div>
      </div>
    </div>
  );
}