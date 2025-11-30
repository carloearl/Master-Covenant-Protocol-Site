import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import glyphbotClient from '@/components/glyphbot/glyphbotClient';
import SEOHead from '@/components/SEOHead';
import { Activity, Settings2 } from 'lucide-react';
import GlyphAuditCard from '@/components/glyphaudit/GlyphAuditCard';
import GlyphProviderChain from '@/components/provider/GlyphProviderChain';
import ProviderStatusPanel from '@/components/glyphbot/ProviderStatusPanel';
import { createPageUrl } from '@/utils';

const PERSONAS = [
  { id: 'GENERAL', name: 'General', desc: 'Default security assistant' },
  { id: 'SECURITY', name: 'Security', desc: 'Threat analysis & safety' },
  { id: 'BLOCKCHAIN', name: 'Blockchain', desc: 'Smart contracts & DeFi' },
  { id: 'AUDIT', name: 'Audit', desc: 'Forensic precision, risk-focused' },
  { id: 'DEBUGGER', name: 'Debugger', desc: 'Bug fixes & stack traces' },
  { id: 'PERFORMANCE', name: 'Performance', desc: 'Optimization focus' },
  { id: 'REFACTOR', name: 'Refactor', desc: 'Code cleanup & architecture' },
  { id: 'ANALYTICS', name: 'Analytics', desc: 'Logs & pattern detection' },
];

const MODEL_OPTIONS = [
  { id: 'AUTO', label: 'Auto (Omega Chain)' },
  { id: 'OPENAI', label: 'OpenAI GPT-4 (Primary)' },
  { id: 'CLAUDE', label: 'Claude Sonnet 4.5 (Chain)' },
  { id: 'GEMINI', label: 'Gemini 2.0 Flash (Chain)' },
  { id: 'LLAMA_OSS', label: 'Llama (OSS)' },
  { id: 'MISTRAL_OSS', label: 'Mistral (OSS)' },
  { id: 'GEMMA_OSS', label: 'Gemma (OSS)' },
  { id: 'LOCAL_OSS', label: 'Local Fallback (No Key)' },
];

const GlyphBotPage = () => {
  // =====================================================
  // ALL EXISTING LOGIC PRESERVED — DO NOT MODIFY
  // =====================================================
  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      role: 'assistant',
      content: 'Hi, I am GlyphBot. Ask me anything about security, code, or blockchain.',
      audit: null
    }
  ]);

  const [input, setInput] = useState('');
  const [persona, setPersona] = useState('GENERAL');
  const [provider, setProvider] = useState('AUTO');
  const [isSending, setIsSending] = useState(false);

  const [voiceOn, setVoiceOn] = useState(false);
  const [auditOn, setAuditOn] = useState(false);
  const [testOn, setTestOn] = useState(false);
  const [realTimeOn, setRealTimeOn] = useState(false);
  const [jsonModeOn, setJsonModeOn] = useState(false);
  const [structuredOn, setStructuredOn] = useState(false);
  const [showProviderPanel, setShowProviderPanel] = useState(false);

  const [lastMeta, setLastMeta] = useState(null);
  const [providerMeta, setProviderMeta] = useState(null);
  const chatContainerRef = useRef(null);

  // Auto-scroll ONLY the chat container, not the whole page
  useEffect(() => {
    const el = chatContainerRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isSending]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const newUserMsg = { id: `user-${Date.now()}`, role: 'user', content: trimmed };
    const newMessages = [...messages, newUserMsg];
    setMessages(newMessages);
    setInput('');
    setIsSending(true);

    try {
      const response = await glyphbotClient.sendMessage(newMessages, {
        persona,
        auditMode: auditOn,
        oneTestMode: testOn,
        realTime: realTimeOn,
        tts: voiceOn,
        enforceGlyphFormat: true,
        formatOverride: true,
        systemFirst: true,
        provider: provider === 'AUTO' ? null : provider,
        autoProvider: provider === 'AUTO',
        jsonModeForced: jsonModeOn,
        structuredMode: structuredOn
      });

      const botText = response.text || '[No response text]';

      setMessages(prev => [
        ...prev,
        { 
          id: `bot-${Date.now()}`,
          role: 'assistant', 
          content: botText,
          audit: response.audit || null,
          providerId: response.providerUsed,
          latencyMs: response.meta?.providerStats?.[response.providerUsed]?.lastLatencyMs
        }
      ]);

      setLastMeta({
        model: response.model,
        providerUsed: response.providerUsed,
        providerLabel: response.providerLabel,
        realTimeUsed: response.realTimeUsed,
        shouldSpeak: response.shouldSpeak
      });

      if (response.meta) {
        setProviderMeta(response.meta);
        sessionStorage.setItem('glyphbot_provider_meta', JSON.stringify(response.meta));
      }

    } catch (err) {
      console.error('GlyphBot send error:', err);
      setMessages(prev => [
        ...prev,
        { id: `err-${Date.now()}`, role: 'assistant', content: 'Something went wrong talking to GlyphBot. Try again.', audit: null }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const runSystemTest = async () => {
    setIsSending(true);
    try {
      const result = await glyphbotClient.systemCheck();
      setMessages(prev => [
        ...prev,
        { id: `test-${Date.now()}`, role: 'assistant', content: `**System Integrity Test**\n\`\`\`json\n${JSON.stringify(result, null, 2)}\n\`\`\`` }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { id: `testerr-${Date.now()}`, role: 'assistant', content: 'System test failed: ' + err.message }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const clearChat = () => {
    setMessages([
      { id: 'clear-1', role: 'assistant', content: 'Chat cleared. How can I help you?', audit: null }
    ]);
    setLastMeta(null);
  };

  const handleRegenerate = async () => {
    if (messages.length < 2) return;
    const lastUserIdx = [...messages].reverse().findIndex(m => m.role === 'user');
    if (lastUserIdx === -1) return;
    const lastUserMsg = messages[messages.length - 1 - lastUserIdx];
    setInput(lastUserMsg.content);
  };

  const modes = {
    voice: voiceOn,
    live: realTimeOn,
    audit: auditOn,
    test: testOn,
    json: jsonModeOn,
    struct: structuredOn,
    panel: showProviderPanel
  };

  const handleToggleMode = (key) => {
    switch(key) {
      case 'voice': setVoiceOn(v => !v); break;
      case 'live': setRealTimeOn(v => !v); break;
      case 'audit': setAuditOn(v => !v); break;
      case 'test': setTestOn(v => !v); break;
      case 'json': setJsonModeOn(v => !v); break;
      case 'struct': setStructuredOn(v => !v); break;
      case 'panel': setShowProviderPanel(v => !v); break;
    }
  };

  // Build providers array for UI
  const providers = providerMeta?.availableProviders?.map(p => ({
    id: p.id,
    label: p.label,
    active: p.enabled,
    error: p.stats?.failureCount > 0 && p.stats?.successCount === 0
  })) || MODEL_OPTIONS.map(m => ({ id: m.id, label: m.label, active: true, error: false }));

  const currentProviderLabel = providers.find(p => p.id === (lastMeta?.providerUsed || provider))?.label || 'Auto (Omega Chain)';

  // =====================================================
  // V2 CONSOLE UI — REPLACES OLD JSX ONLY
  // =====================================================
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50 flex flex-col pt-20 pb-4 px-4">
      <SEOHead 
        title="GlyphBot Console V2 - Elite AI Security Expert | GlyphLock"
        description="Chat with GlyphBot, your elite AI security assistant for code auditing, blockchain analysis, threat detection, and debugging."
      />
      
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col">
        {/* V2 CONSOLE CONTAINER */}
        <div className="flex-1 flex flex-col bg-[#050712] text-slate-100 rounded-2xl border border-slate-800 shadow-[0_0_40px_rgba(0,0,0,0.65)] overflow-hidden">
          
          {/* HEADER BAR */}
          <header className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-gradient-to-r from-[#050712] via-[#060b1c] to-[#070b20]">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-2xl bg-slate-950 border border-cyan-400/60 shadow-[0_0_18px_rgba(45,212,191,0.8)] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-[2px] rounded-2xl bg-gradient-to-br from-cyan-500/20 via-sky-500/10 to-fuchsia-500/20" />
                <div className="relative text-xs font-black tracking-[0.1em] uppercase">GL</div>
              </div>
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-[0.2em] text-cyan-300/80">GlyphBot Console V2</span>
                <span className="text-sm text-slate-300">Elite AI Security & Chain Orchestration</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-1 text-xs text-slate-400">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
                <span>Online</span>
                <span className="text-slate-500 mx-1">|</span>
                <span className="text-slate-300">
                  Provider: <span className="text-cyan-300">{currentProviderLabel}</span>
                </span>
              </div>
              <Link
                to={createPageUrl('ProviderConsole')}
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-900/80 border border-slate-600/70 hover:border-cyan-400/80 hover:text-cyan-200 transition-colors flex items-center gap-1"
              >
                <Activity className="w-3 h-3" />
                Console
              </Link>
            </div>
          </header>

          {/* TOP CONTROLS STRIP */}
          <section className="px-4 pt-3 pb-2 border-b border-slate-900 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-slate-950/90">
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div className="flex flex-wrap gap-3 items-center">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Persona</label>
                  <select
                    className="min-w-[140px] text-xs bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-400/70"
                    value={persona}
                    onChange={(e) => setPersona(e.target.value)}
                  >
                    {PERSONAS.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Model</label>
                  <select
                    className="min-w-[180px] text-xs bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-400/70"
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                  >
                    {MODEL_OPTIONS.map((m) => (
                      <option key={m.id} value={m.id}>{m.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 justify-end">
                {renderModeToggle("voice", "Voice", modes, handleToggleMode)}
                {renderModeToggle("live", "Live", modes, handleToggleMode)}
                {renderModeToggle("audit", "Audit", modes, handleToggleMode)}
                {renderModeToggle("test", "Test", modes, handleToggleMode)}
                {renderModeToggle("json", "{ } JSON", modes, handleToggleMode)}
                {renderModeToggle("struct", "Struct", modes, handleToggleMode)}
                {renderModeToggle("panel", "Panel", modes, handleToggleMode)}
                <button
                  onClick={clearChat}
                  className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-[0.14em] uppercase border bg-rose-900/30 border-rose-500/50 text-rose-300 hover:bg-rose-900/50 transition-all"
                >
                  Clear
                </button>
              </div>
            </div>
          </section>

          {/* MAIN LAYOUT */}
          <main className="flex-1 flex min-h-0">
            {/* LEFT: Chat and messages */}
            <section className="flex-1 flex flex-col border-r border-slate-900 bg-gradient-to-b from-slate-950 via-[#050814] to-slate-950">
              
              {/* Provider rail */}
              <div className="px-4 py-2 border-b border-slate-900 bg-slate-950/80">
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                  {providers.slice(0, 8).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setProvider(p.id)}
                      className={[
                        "px-2.5 py-1 rounded-full text-[10px] uppercase tracking-[0.18em] shrink-0 border transition-all",
                        p.id === provider
                          ? "bg-cyan-500/15 border-cyan-400/80 text-cyan-200 shadow-[0_0_16px_rgba(34,211,238,0.9)]"
                          : "bg-slate-950 border-slate-700/80 text-slate-400 hover:border-slate-400/80",
                        p.error ? "border-rose-500/80 text-rose-300" : "",
                      ].filter(Boolean).join(" ")}
                    >
                      {p.label.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Provider Chain Display */}
              {providerMeta && (
                <div className="px-4 py-1 border-b border-slate-900/50 bg-slate-950/50">
                  <GlyphProviderChain
                    availableProviders={providerMeta.availableProviders}
                    providerStats={providerMeta.providerStats}
                    providerUsed={providerMeta.providerUsed}
                  />
                </div>
              )}

              {/* Provider Panel (expandable) */}
              {showProviderPanel && providerMeta && (
                <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/60">
                  <ProviderStatusPanel
                    availableProviders={providerMeta.availableProviders}
                    providerStats={providerMeta.providerStats}
                    providerUsed={providerMeta.providerUsed}
                    jsonModeEnabled={jsonModeOn || structuredOn || auditOn}
                    onProviderSelect={(id) => setProvider(id)}
                  />
                </div>
              )}

              {/* Test Mode Button */}
              {testOn && (
                <div className="px-4 py-2 border-b border-slate-900">
                  <button
                    onClick={runSystemTest}
                    disabled={isSending}
                    className="w-full py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-xl text-xs font-semibold disabled:opacity-50 transition-all"
                  >
                    ⚠️ Run System Integrity Test
                  </button>
                </div>
              )}

              {/* CHAT AREA — SCROLLS INDEPENDENTLY */}
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scroll-smooth"
              >
                {messages.length === 0 && (
                  <div className="mt-10 text-center text-sm text-slate-500">
                    <div className="text-slate-300 mb-1">Awaiting your query. Keep it security-related.</div>
                    <div className="text-xs text-slate-500">GlyphBot can chain OpenAI, Claude, and Gemini while keeping DeepSeek exiled.</div>
                  </div>
                )}

                {messages.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    msg={msg}
                    isAssistant={msg.role === 'assistant'}
                    providerLabel={msg.providerId ? providers.find((p) => p.id === msg.providerId)?.label : undefined}
                    ttsAvailable={voiceOn}
                    onPlayTTS={() => {/* TTS hook placeholder */}}
                  />
                ))}

                {isSending && (
                  <div className="flex items-center gap-2 text-xs text-cyan-300/80 mt-2">
                    <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span>Streaming chain response…</span>
                  </div>
                )}
              </div>

              {/* INPUT BAR */}
              <div className="border-t border-slate-900 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950 px-4 py-3">
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <textarea
                      rows={1}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask anything about security, code, blockchain, or chains…"
                      className="w-full resize-none rounded-xl bg-slate-950 border border-slate-700/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400/80"
                      style={{ fontSize: '16px' }}
                    />
                    <div className="mt-1 flex justify-between text-[10px] text-slate-500">
                      <span>Enter = send · Shift+Enter = new line</span>
                      {isSending && <span>Streaming… press Stop to cut chain.</span>}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    {isSending ? (
                      <button
                        type="button"
                        onClick={() => setIsSending(false)}
                        className="px-3 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_16px_rgba(248,113,113,0.75)]"
                      >
                        Stop
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSend}
                        className="px-3 py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_18px_rgba(34,211,238,0.85)] disabled:opacity-40 disabled:shadow-none"
                        disabled={!input.trim()}
                      >
                        Send
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleRegenerate}
                      className="px-3 py-1.5 rounded-xl text-[10px] font-semibold bg-slate-900/90 border border-slate-700/80 text-slate-300 hover:border-cyan-400/70 hover:text-cyan-200 transition-colors"
                    >
                      Re-run
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* RIGHT: Telemetry panel */}
            <aside className="hidden lg:flex w-64 flex-col bg-slate-950/95">
              <div className="px-4 py-3 border-b border-slate-900">
                <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Chain Telemetry</div>
                <div className="mt-1 text-xs text-slate-300">Last {Math.min(messages.length, 6)} exchanges</div>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 text-[11px] text-slate-400">
                {messages
                  .filter((m) => m.role !== "system")
                  .slice(-6)
                  .reverse()
                  .map((m) => (
                    <div key={m.id} className="rounded-lg border border-slate-800 bg-slate-950/70 px-2.5 py-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className={"px-1.5 py-[2px] rounded-full text-[9px] font-semibold tracking-[0.16em] uppercase " +
                          (m.role === "assistant"
                            ? "bg-cyan-500/15 text-cyan-200 border border-cyan-400/60"
                            : "bg-slate-800 text-slate-200 border border-slate-600")}>
                          {m.role === "assistant" ? "Bot" : "User"}
                        </span>
                        {m.providerId && (
                          <span className="text-[9px] text-slate-500">
                            {providers.find((p) => p.id === m.providerId)?.label?.split(' ')[0]}
                          </span>
                        )}
                      </div>
                      <div className="line-clamp-3 text-[11px] text-slate-300">{m.content}</div>
                      {m.latencyMs && (
                        <div className="mt-1 text-right text-[9px] text-slate-500">{m.latencyMs}ms</div>
                      )}
                    </div>
                  ))}

                {messages.length === 0 && (
                  <div className="text-[11px] text-slate-500">
                    Chains, provider hops, token usage, and latency will show here once you start talking to GlyphBot.
                  </div>
                )}

                {/* Meta info */}
                {lastMeta && (
                  <div className="mt-4 p-2 rounded-lg border border-slate-800 bg-slate-900/50 text-[10px] space-y-1">
                    <div className="text-slate-500 uppercase tracking-wider">Last Response</div>
                    <div className="text-cyan-300">{lastMeta.providerLabel || lastMeta.model}</div>
                    {lastMeta.realTimeUsed && <div className="text-emerald-400">✓ Real-time web</div>}
                    {lastMeta.shouldSpeak && <div className="text-sky-400">✓ Voice ready</div>}
                    {providerMeta?.jsonModeEnabled && <div className="text-purple-400">✓ JSON mode</div>}
                  </div>
                )}
              </div>
            </aside>
          </main>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// HELPER COMPONENTS
// =====================================================

function renderModeToggle(key, label, modes, onToggleMode) {
  const active = modes?.[key];
  return (
    <button
      type="button"
      onClick={() => onToggleMode(key)}
      className={[
        "px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-[0.14em] uppercase border transition-all",
        active
          ? "bg-cyan-500/15 border-cyan-400/80 text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.8)]"
          : "bg-slate-950 border-slate-700/80 text-slate-400 hover:border-slate-400/80",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function MessageBubble({ msg, isAssistant, providerLabel, ttsAvailable, onPlayTTS }) {
  const hasAudit = msg.audit && (msg.audit.json || msg.audit.report);
  
  return (
    <div className={"flex gap-2 " + (isAssistant ? "justify-start" : "justify-end")}>
      {isAssistant && (
        <div className="mt-1 h-7 w-7 rounded-2xl bg-slate-900 border border-cyan-500/60 flex items-center justify-center text-[9px] font-semibold text-cyan-200 shrink-0">
          GB
        </div>
      )}

      <div className={`space-y-2 ${hasAudit ? 'max-w-[90%] w-full' : 'max-w-[80%]'}`}>
        <div className={[
          "rounded-2xl px-3 py-2 text-sm shadow-sm border",
          isAssistant
            ? "bg-slate-900/90 border-slate-700/80 text-slate-100"
            : "bg-cyan-500/10 border-cyan-400/70 text-cyan-50",
        ].join(" ")}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
              {isAssistant ? "GlyphBot" : "You"}
            </span>
            <div className="flex items-center gap-2">
              {providerLabel && <span className="text-[9px] text-slate-500">{providerLabel}</span>}
              {isAssistant && ttsAvailable && (
                <button
                  type="button"
                  onClick={() => onPlayTTS && onPlayTTS(msg.id)}
                  className="text-[10px] px-1.5 py-[1px] rounded-full border border-slate-600 text-slate-300 hover:border-cyan-400 hover:text-cyan-200"
                >
                  ▷ Voice
                </button>
              )}
            </div>
          </div>
          <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
        </div>
        
        {hasAudit && <GlyphAuditCard audit={msg.audit} />}
      </div>

      {!isAssistant && (
        <div className="mt-1 h-7 w-7 rounded-2xl bg-slate-900 border border-slate-600 flex items-center justify-center text-[9px] font-semibold text-slate-200 shrink-0">
          U
        </div>
      )}
    </div>
  );
}

export default GlyphBotPage;