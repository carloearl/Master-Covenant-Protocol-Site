import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import glyphbotClient from '@/components/glyphbot/glyphbotClient';
import SEOHead from '@/components/SEOHead';
import { Activity, Zap, Shield, Bot } from 'lucide-react';
import GlyphProviderChain from '@/components/provider/GlyphProviderChain';
import ProviderStatusPanel from '@/components/glyphbot/ProviderStatusPanel';
import ChatMessage from '@/components/glyphbot/ChatMessage';
import ChatInput from '@/components/glyphbot/ChatInput';
import ControlBar from '@/components/glyphbot/ControlBar';
import { createPageUrl } from '@/utils';

const WELCOME_MESSAGE = {
  id: 'welcome-1',
  role: 'assistant',
  content: `Welcome to GlyphBot — your elite AI security assistant.

I can help you with:
• **Security audits** — analyze code, URLs, and systems for vulnerabilities
• **Blockchain analysis** — smart contract review and DeFi security
• **Threat detection** — identify and mitigate potential risks
• **Code debugging** — find and fix issues with precision

What would you like to explore today?`,
  audit: null
};

export default function GlyphBotPage() {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [persona, setPersona] = useState('GENERAL');
  const [provider, setProvider] = useState('AUTO');
  const [isSending, setIsSending] = useState(false);

  const [modes, setModes] = useState({
    voice: false,
    live: false,
    audit: false,
    test: false,
    json: false,
    struct: false,
    panel: false
  });

  const [lastMeta, setLastMeta] = useState(null);
  const [providerMeta, setProviderMeta] = useState(null);
  const chatContainerRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    const el = chatContainerRef.current;
    if (el) {
      requestAnimationFrame(() => {
        el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
      });
    }
  }, [messages, isSending]);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const newUserMsg = { id: `user-${Date.now()}`, role: 'user', content: trimmed };
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsSending(true);

    try {
      const response = await glyphbotClient.sendMessage([...messages, newUserMsg], {
        persona,
        auditMode: modes.audit,
        oneTestMode: modes.test,
        realTime: modes.live,
        tts: modes.voice,
        enforceGlyphFormat: true,
        formatOverride: true,
        systemFirst: true,
        provider: provider === 'AUTO' ? null : provider,
        autoProvider: provider === 'AUTO',
        jsonModeForced: modes.json,
        structuredMode: modes.struct
      });

      const botText = response.text || '[No response received]';

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
      console.error('GlyphBot error:', err);
      setMessages(prev => [
        ...prev,
        { 
          id: `err-${Date.now()}`, 
          role: 'assistant', 
          content: 'I encountered an error processing your request. Please try again.',
          audit: null 
        }
      ]);
    } finally {
      setIsSending(false);
    }
  }, [input, isSending, messages, persona, provider, modes]);

  const handleStop = () => setIsSending(false);

  const handleRegenerate = () => {
    if (messages.length < 2) return;
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMsg) setInput(lastUserMsg.content);
  };

  const handleClear = () => {
    setMessages([WELCOME_MESSAGE]);
    setLastMeta(null);
  };

  const handleToggleMode = (key) => {
    setModes(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Build providers for display
  const providers = providerMeta?.availableProviders?.map(p => ({
    id: p.id,
    label: p.label,
    active: p.enabled,
    error: p.stats?.failureCount > 0 && p.stats?.successCount === 0
  })) || [];

  const currentProviderLabel = providers.find(p => p.id === (lastMeta?.providerUsed || provider))?.label || 'Auto (Omega Chain)';

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#030712] via-slate-950 to-[#030712] text-slate-50 flex flex-col pt-16 pb-0">
      <SEOHead 
        title="GlyphBot - Elite AI Security Assistant | GlyphLock"
        description="Chat with GlyphBot, your elite AI security assistant for code auditing, blockchain analysis, threat detection, and debugging."
      />
      
      <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full">
        {/* Main Console Container */}
        <div className="flex-1 flex flex-col bg-[#0a0a12]/90 border-x border-slate-800/50 shadow-2xl overflow-hidden">
          
          {/* Header */}
          <header className="flex items-center justify-between px-5 py-3 border-b border-slate-800/80 bg-gradient-to-r from-slate-950/90 via-[#0d0d1a] to-slate-950/90 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                <Bot className="w-5 h-5 text-cyan-400" />
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-white tracking-wide">GlyphBot</h1>
                <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em]">Elite AI Security</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                  Online
                </span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-300">{currentProviderLabel}</span>
              </div>
              <Link
                to={createPageUrl('ProviderConsole')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900/80 border border-slate-700/60 text-slate-400 hover:border-cyan-500/50 hover:text-cyan-300 transition-all"
              >
                <Activity className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Console</span>
              </Link>
            </div>
          </header>

          {/* Control Bar */}
          <ControlBar
            persona={persona}
            setPersona={setPersona}
            provider={provider}
            setProvider={setProvider}
            modes={modes}
            onToggleMode={handleToggleMode}
            onClear={handleClear}
          />

          {/* Provider Chain */}
          {providerMeta && (
            <div className="px-4 py-2 border-b border-slate-800/50 bg-slate-950/40">
              <GlyphProviderChain
                availableProviders={providerMeta.availableProviders}
                providerStats={providerMeta.providerStats}
                providerUsed={providerMeta.providerUsed}
              />
            </div>
          )}

          {/* Provider Panel (expandable) */}
          {modes.panel && providerMeta && (
            <div className="px-4 py-3 border-b border-slate-800/50 bg-slate-900/40">
              <ProviderStatusPanel
                availableProviders={providerMeta.availableProviders}
                providerStats={providerMeta.providerStats}
                providerUsed={providerMeta.providerUsed}
                jsonModeEnabled={modes.json || modes.struct || modes.audit}
                onProviderSelect={(id) => setProvider(id)}
              />
            </div>
          )}

          {/* Chat Area */}
          <div className="flex-1 flex min-h-0">
            {/* Messages */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scroll-smooth"
            >
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  msg={msg}
                  isAssistant={msg.role === 'assistant'}
                  providerLabel={msg.providerId ? providers.find(p => p.id === msg.providerId)?.label : undefined}
                  ttsAvailable={modes.voice}
                  onPlayTTS={() => {}}
                  showFeedback={msg.role === 'assistant' && msg.id !== 'welcome-1'}
                  persona={persona}
                />
              ))}

              {isSending && (
                <div className="flex items-center gap-3 text-sm text-cyan-400/80 animate-in fade-in">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span>GlyphBot is thinking...</span>
                </div>
              )}
            </div>

            {/* Telemetry Sidebar - Desktop */}
            <aside className="hidden xl:flex w-72 flex-col border-l border-slate-800/50 bg-slate-950/60">
              <div className="px-4 py-3 border-b border-slate-800/50">
                <div className="flex items-center gap-2 text-xs">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="uppercase tracking-[0.2em] text-slate-500 font-medium">Telemetry</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.slice(-5).reverse().filter(m => m.role !== 'system').map((m) => (
                  <div key={m.id} className="rounded-lg border border-slate-800/60 bg-slate-900/40 p-2.5">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded ${
                        m.role === 'assistant' 
                          ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' 
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {m.role === 'assistant' ? 'Bot' : 'You'}
                      </span>
                      {m.latencyMs && (
                        <span className="text-[9px] text-slate-600">{m.latencyMs}ms</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{m.content}</p>
                  </div>
                ))}

                {lastMeta && (
                  <div className="mt-4 p-3 rounded-lg border border-cyan-500/20 bg-cyan-500/5">
                    <div className="text-[9px] uppercase tracking-[0.2em] text-slate-500 mb-2">Last Response</div>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex items-center gap-2">
                        <Shield className="w-3 h-3 text-cyan-400" />
                        <span className="text-cyan-300">{lastMeta.providerLabel || lastMeta.model}</span>
                      </div>
                      {lastMeta.realTimeUsed && (
                        <div className="text-emerald-400">✓ Real-time web context</div>
                      )}
                      {lastMeta.shouldSpeak && (
                        <div className="text-purple-400">✓ Voice synthesis ready</div>
                      )}
                      {providerMeta?.jsonModeEnabled && (
                        <div className="text-amber-400">✓ Structured JSON output</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>

          {/* Input Bar */}
          <ChatInput
            value={input}
            onChange={setInput}
            onSend={handleSend}
            onStop={handleStop}
            onRegenerate={handleRegenerate}
            isSending={isSending}
          />
        </div>
      </div>
    </div>
  );
}