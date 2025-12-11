/**
 * What Makes GlyphLock Different - Federal Style
 * Professional comparison maintaining government design standards
 */

import React from 'react';
import { AlertTriangle, ShieldCheck, FileText, Fingerprint, Layers, Link2, Network } from 'lucide-react';

export default function DifferenceComparison() {
  return (
    <section className="py-16 bg-white border-y-2 border-gray-300">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Makes GlyphLock Different?
          </h2>
          <p className="text-base md:text-lg text-gray-700 max-w-3xl mx-auto">
            The Master Covenant: A <span className="font-bold text-blue-700">71-clause legal framework</span> binding AI output to identity, evidence, and accountability standards.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Traditional */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-400 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-red-300">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-700" />
                <h3 className="text-lg font-bold text-gray-900">Traditional AI Detection</h3>
              </div>
              <span className="text-xs font-bold text-red-700 bg-red-200 px-3 py-1 rounded-full">No Covenant</span>
            </div>

            <div className="space-y-3">
              {[
                { step: '1', title: 'Input received', desc: 'Raw text, logs, or evidence enter a black-box model' },
                { step: '2', title: 'Statistical pattern analysis', desc: 'Model predicts most likely answer based on probability' },
                { step: '3', title: 'Single output', desc: 'No cross-validation or secondary verification' },
                { step: '4', title: 'No audit trail', desc: 'Output cannot be traced or verified in legal proceedings' }
              ].map(row => (
                <div key={row.step} className="flex gap-3 bg-white border-2 border-red-300 rounded-lg p-4">
                  <div className="flex-shrink-0 w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {row.step}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{row.title}</p>
                    <p className="text-xs text-gray-700">{row.desc}</p>
                  </div>
                </div>
              ))}

              <div className="mt-4 pt-4 border-t-2 border-red-300 space-y-2 text-xs text-gray-800">
                <p className="flex items-start gap-2"><span className="text-red-600 font-bold">✗</span> No legal framework or contractual binding</p>
                <p className="flex items-start gap-2"><span className="text-red-600 font-bold">✗</span> Limited explainability and no clause-level trace</p>
                <p className="flex items-start gap-2"><span className="text-red-600 font-bold">✗</span> No cryptographic attribution or audit trail</p>
              </div>
            </div>
          </div>

          {/* GlyphLock */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-500 rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-green-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-700" />
                <h3 className="text-lg font-bold text-gray-900">GlyphLock Master Covenant</h3>
              </div>
              <span className="text-xs font-bold text-green-800 bg-green-200 px-3 py-1 rounded-full">Patent-Pending</span>
            </div>

            <div className="space-y-3">
              {[
                { step: '1', title: 'Input received', desc: 'Evidence, transcripts, logs enter covenant pipeline' },
                { step: '2', title: 'Semantic + statistical analysis', desc: 'Models analyze patterns and meaning, not just probability' },
                { step: '3a', title: 'Legal compliance check', desc: '71-clause Master Covenant verification', icon: <FileText className="w-4 h-4 text-green-700" /> },
                { step: '3b', title: 'Identity verification', desc: 'Cannot be impersonated or detached from origin', icon: <Fingerprint className="w-4 h-4 text-green-700" /> },
                { step: '3c', title: 'Multi-agent validation', desc: 'Cross-verification by multiple AI systems', icon: <Network className="w-4 h-4 text-green-700" /> },
                { step: '4', title: 'Dual-layer output', desc: 'Human-readable + machine-readable audit payload', icon: <Layers className="w-4 h-4 text-green-700" /> },
                { step: '5', title: 'Cryptographic signature', desc: 'Verifiable chain-of-custody for legal proceedings', icon: <Link2 className="w-4 h-4 text-green-700" /> }
              ].map(row => (
                <div key={row.step} className="flex gap-3 bg-white border-2 border-green-400 rounded-lg p-4">
                  <div className="flex-shrink-0 w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {row.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-gray-900 text-sm">{row.title}</p>
                      {row.icon}
                    </div>
                    <p className="text-xs text-gray-700">{row.desc}</p>
                  </div>
                </div>
              ))}

              <div className="mt-4 pt-4 border-t-2 border-green-400 space-y-2 text-xs text-gray-800">
                <p className="flex items-start gap-2"><span className="text-green-600 font-bold">✓</span> 71-clause legal framework and patent-pending methodology</p>
                <p className="flex items-start gap-2"><span className="text-green-600 font-bold">✓</span> Identity-bound, cryptographically signed outputs</p>
                <p className="flex items-start gap-2"><span className="text-green-600 font-bold">✓</span> Full audit trail for courtroom and regulatory use</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: <FileText className="w-6 h-6 text-blue-700" />, title: 'Contractual Binding', desc: 'AI output bound to explicit standards, not best-effort guesses' },
            { icon: <Fingerprint className="w-6 h-6 text-blue-700" />, title: 'Identity-Bound Outputs', desc: 'Cryptographic fingerprints tie responses to origin and context' },
            { icon: <Network className="w-6 h-6 text-blue-700" />, title: 'Multi-Agent Validation', desc: 'Alfred, Claude, Gemini, Copilot, Perplexity verify in chain' },
            { icon: <ShieldCheck className="w-6 h-6 text-blue-700" />, title: 'Federal-Grade Trail', desc: 'Designed for NIST evaluation and regulatory compliance' }
          ].map((card, i) => (
            <div key={i} className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-400 rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  {React.cloneElement(card.icon, { className: 'w-5 h-5 text-white' })}
                </div>
                <p className="font-bold text-gray-900 text-sm">{card.title}</p>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}