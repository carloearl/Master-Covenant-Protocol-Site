import React, { useState, useEffect, useRef } from 'react';
import glyphbotClient from '@/components/glyphbot/glyphbotClient';
import SEOHead from '@/components/SEOHead';

const PERSONAS = [
  { id: 'GENERAL', label: 'General', desc: 'Default security assistant' },
  { id: 'SECURITY', label: 'Security', desc: 'Threat analysis & safety' },
  { id: 'BLOCKCHAIN', label: 'Blockchain', desc: 'Smart contracts & DeFi' },
  { id: 'AUDIT', label: 'Audit', desc: 'Deep code & security reviews' },
  { id: 'DEBUGGER', label: 'Debugger', desc: 'Bug fixes & stack traces' },
  { id: 'PERFORMANCE', label: 'Performance', desc: 'Optimization focus' },
  { id: 'REFACTOR', label: 'Refactor', desc: 'Code cleanup & architecture' },
  { id: 'ANALYTICS', label: 'Analytics', desc: 'Logs & pattern detection' },
  { id: 'AUDITOR', label: 'Auditor', desc: 'Forensic audits' },
];

const GlyphBotPage = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi, I am GlyphBot. Ask me anything about security, code, or blockchain.'
    }
  ]);

  const [input, setInput] = useState('');
  const [persona, setPersona] = useState('GENERAL');
  const [isSending, setIsSending] = useState(false);

  const [voiceOn, setVoiceOn] = useState(false);
  const [auditOn, setAuditOn] = useState(false);
  const [testOn, setTestOn] = useState(false);
  const [realTimeOn, setRealTimeOn] = useState(false);

  const [lastMeta, setLastMeta] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const newUserMsg = { role: 'user', content: trimmed };
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
        tts: voiceOn
      });

      const botText = response.text || '[No response text]';

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: botText }
      ]);

      setLastMeta({
        model: response.model,
        providerUsed: response.providerUsed,
        realTimeUsed: response.realTimeUsed,
        shouldSpeak: response.shouldSpeak
      });

    } catch (err) {
      console.error('GlyphBot send error:', err);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Something went wrong talking to GlyphBot. Try again.' }
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
        { role: 'assistant', content: `**System Integrity Test**\n\`\`\`json\n${JSON.stringify(result, null, 2)}\n\`\`\`` }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'System test failed: ' + err.message }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const clearChat = () => {
    setMessages([
      { role: 'assistant', content: 'Chat cleared. How can I help you?' }
    ]);
    setLastMeta(null);
  };

  const currentPersona = PERSONAS.find(p => p.id === persona);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50 flex flex-col">
      <SEOHead 
        title="GlyphBot - Elite AI Security Expert | GlyphLock"
        description="Chat with GlyphBot, your elite AI security assistant for code auditing, blockchain analysis, threat detection, and debugging."
      />
      
      <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col px-4 pb-8 pt-24">
        
        {/* Header */}
        <header className="mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-lg">
                <span className="text-xl font-bold text-white">⚡</span>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  GlyphBot — Elite AI Security Expert
                </h1>
                <p className="text-sm text-slate-400">
                  Ask anything about security, code, blockchain, or debugging.
                </p>
              </div>
            </div>
            <a
              href="/glyphbotjunior"
              className="px-4 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-200 rounded-xl text-sm font-medium hover:bg-amber-500/30 transition-all"
            >
              Switch to Junior ☀
            </a>
          </div>
        </header>

        {/* Active Mode Badges */}
        {(auditOn || testOn || realTimeOn || voiceOn) && (
          <div className="mb-3 flex flex-wrap gap-2">
            {auditOn && (
              <span className="px-2 py-1 bg-green-500/20 border border-green-500/40 text-green-300 rounded-lg text-xs">
                🛡️ Audit Mode
              </span>
            )}
            {testOn && (
              <span className="px-2 py-1 bg-blue-500/20 border border-blue-500/40 text-blue-300 rounded-lg text-xs">
                ⚠️ Test Mode
              </span>
            )}
            {realTimeOn && (
              <span className="px-2 py-1 bg-orange-500/20 border border-orange-500/40 text-orange-300 rounded-lg text-xs">
                🌐 Live Web Search
              </span>
            )}
            {voiceOn && (
              <span className="px-2 py-1 bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 rounded-lg text-xs">
                🔊 Voice Enabled
              </span>
            )}
          </div>
        )}

        {/* Controls */}
        <section className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Persona selector */}
          <div className="flex items-center gap-2 flex-wrap">
            <label className="text-xs uppercase tracking-wide text-slate-400">
              Persona
            </label>
            <select
              value={persona}
              onChange={e => setPersona(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm min-h-[40px] focus:outline-none focus:ring-1 focus:ring-purple-400"
            >
              {PERSONAS.map(p => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
            {currentPersona?.desc && (
              <span className="text-xs text-slate-500 hidden md:inline">
                — {currentPersona.desc}
              </span>
            )}
          </div>

          {/* Mode toggles */}
          <div className="flex flex-wrap gap-2 text-xs">
            <ToggleChip label="🔊 Voice" active={voiceOn} onClick={() => setVoiceOn(v => !v)} />
            <ToggleChip label="🌐 Live" active={realTimeOn} onClick={() => setRealTimeOn(v => !v)} />
            <ToggleChip label="🛡️ Audit" active={auditOn} onClick={() => setAuditOn(v => !v)} />
            <ToggleChip label="⚠️ Test" active={testOn} onClick={() => setTestOn(v => !v)} />
            <button
              onClick={clearChat}
              className="px-3 py-1 rounded-full border bg-red-900/30 border-red-500/40 text-red-300 text-xs hover:bg-red-900/50 transition-all"
            >
              Clear
            </button>
          </div>
        </section>

        {/* Meta line */}
        {lastMeta && (
          <div className="mb-2 text-xs text-slate-500 flex flex-wrap gap-3 bg-slate-900/50 rounded-lg px-3 py-2 border border-slate-800">
            <span>Model: <span className="text-purple-400">{lastMeta.model || 'unknown'}</span></span>
            <span>Provider: <span className="text-slate-300">{lastMeta.providerUsed || 'base44-broker'}</span></span>
            {lastMeta.realTimeUsed && <span className="text-emerald-400">✓ real-time web</span>}
            {lastMeta.shouldSpeak && <span className="text-sky-400">✓ voice-ready</span>}
          </div>
        )}

        {/* Test Mode Button */}
        {testOn && (
          <button
            onClick={runSystemTest}
            disabled={isSending}
            className="mb-3 w-full py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-xl text-sm font-semibold disabled:opacity-50 transition-all"
          >
            ⚠️ Run System Integrity Test
          </button>
        )}

        {/* Chat area */}
        <div className="flex-1 min-h-[320px] max-h-[520px] rounded-2xl bg-slate-950/70 border border-slate-800 overflow-y-auto p-4 space-y-3">
          {messages.map((m, idx) => (
            <ChatBubble key={idx} role={m.role} content={m.content} />
          ))}
          {isSending && (
            <div className="flex justify-start">
              <div className="bg-slate-800/80 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="mt-4 flex items-end gap-2">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            placeholder={`Ask ${currentPersona?.label || 'GlyphBot'} anything...`}
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-cyan-400 min-h-[52px]"
            style={{ fontSize: '16px' }}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={isSending || !input.trim()}
            className="h-[52px] px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-cyan-400 hover:to-blue-400 transition-all"
          >
            {isSending ? '...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

const ChatBubble = ({ role, content }) => {
  const isUser = role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed ${
          isUser
            ? 'bg-gradient-to-br from-cyan-600 to-blue-600 text-white rounded-br-sm shadow-lg'
            : 'bg-slate-800/80 text-slate-50 rounded-bl-sm border border-slate-700'
        }`}
      >
        {content}
      </div>
    </div>
  );
};

const ToggleChip = ({ label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all min-h-[32px] ${
      active
        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-sm'
        : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
    }`}
  >
    {label}
  </button>
);

export default GlyphBotPage;