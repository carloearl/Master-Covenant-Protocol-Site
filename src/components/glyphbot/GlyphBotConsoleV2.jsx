import React, { useEffect, useRef } from "react";

/**
 * GlyphBot Console V2 - Elite AI Security & Chain Orchestration
 * OMEGA CHAIN: OpenAI Primary → Claude/Gemini Chain → OSS Fallback
 */

export default function GlyphBotConsoleV2(props) {
  const {
    persona,
    personas = [],
    onPersonaChange,
    model,
    models = [],
    onModelChange,
    providers = [],
    activeProviderId,
    onProviderChange,
    messages = [],
    isStreaming,
    onSend,
    onStop,
    onRegenerate,
    modes = {},
    onToggleMode,
    ttsAvailable = false,
    onPlayTTS,
  } = props;

  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [inputValue, setInputValue] = React.useState("");

  useEffect(() => {
    const el = chatContainerRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [messages.length, isStreaming]);

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    onSend && onSend(trimmed);
    setInputValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const currentProviderLabel =
    providers.find((p) => p.id === activeProviderId)?.label || "Auto";

  return (
    <div className="w-full h-full flex flex-col bg-[#050712] text-slate-100 rounded-2xl border border-slate-800 shadow-[0_0_40px_rgba(0,0,0,0.65)] overflow-hidden">
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
          <button
            type="button"
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-900/80 border border-slate-600/70 hover:border-cyan-400/80 hover:text-cyan-200 transition-colors"
          >
            Console
          </button>
        </div>
      </header>

      {/* TOP CONTROLS STRIP */}
      <section className="px-4 pt-3 pb-2 border-b border-slate-900 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-slate-950/90">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Persona</label>
              <select
                className="min-w-[160px] text-xs bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-400/70"
                value={persona}
                onChange={(e) => onPersonaChange && onPersonaChange(e.target.value)}
              >
                {personas.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Model</label>
              <select
                className="min-w-[160px] text-xs bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-400/70"
                value={model}
                onChange={(e) => onModelChange && onModelChange(e.target.value)}
              >
                {models.map((m) => (
                  <option key={m.id} value={m.id}>{m.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 justify-end">
            {renderModeToggle("voice", "Voice", modes, onToggleMode)}
            {renderModeToggle("live", "Live", modes, onToggleMode)}
            {renderModeToggle("audit", "Audit", modes, onToggleMode)}
            {renderModeToggle("test", "Test", modes, onToggleMode)}
            {renderModeToggle("json", "{ } JSON", modes, onToggleMode)}
            {renderModeToggle("struct", "Struct", modes, onToggleMode)}
            {renderModeToggle("panel", "Panel", modes, onToggleMode)}
          </div>
        </div>
      </section>

      {/* MAIN LAYOUT */}
      <main className="flex-1 flex min-h-0">
        <section className="flex-1 flex flex-col border-r border-slate-900 bg-gradient-to-b from-slate-950 via-[#050814] to-slate-950">
          {/* Provider rail */}
          <div className="px-4 py-2 border-b border-slate-900 bg-slate-950/80">
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
              {providers.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onProviderChange && onProviderChange(p.id)}
                  className={[
                    "px-2.5 py-1 rounded-full text-[10px] uppercase tracking-[0.18em] shrink-0 border transition-all",
                    p.id === activeProviderId
                      ? "bg-cyan-500/15 border-cyan-400/80 text-cyan-200 shadow-[0_0_16px_rgba(34,211,238,0.9)]"
                      : "bg-slate-950 border-slate-700/80 text-slate-400 hover:border-slate-400/80",
                    p.error ? "border-rose-500/80 text-rose-300" : "",
                  ].filter(Boolean).join(" ")}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* CHAT AREA */}
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
                isAssistant={msg.role === "assistant"}
                providerLabel={msg.providerId ? providers.find((p) => p.id === msg.providerId)?.label : undefined}
                ttsAvailable={ttsAvailable}
                onPlayTTS={onPlayTTS}
              />
            ))}

            {isStreaming && (
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
                  ref={inputRef}
                  rows={1}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything about security, code, blockchain, or chains…"
                  className="w-full resize-none rounded-xl bg-slate-950 border border-slate-700/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400/80"
                  style={{ fontSize: '16px' }}
                />
                <div className="mt-1 flex justify-between text-[10px] text-slate-500">
                  <span>Enter = send · Shift+Enter = new line</span>
                  {isStreaming && <span>Streaming… press Stop to cut chain.</span>}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                {isStreaming ? (
                  <button
                    type="button"
                    onClick={onStop}
                    className="px-3 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_16px_rgba(248,113,113,0.75)]"
                  >
                    Stop
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSend}
                    className="px-3 py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_18px_rgba(34,211,238,0.85)] disabled:opacity-40 disabled:shadow-none"
                    disabled={!inputValue.trim()}
                  >
                    Send
                  </button>
                )}
                <button
                  type="button"
                  onClick={onRegenerate}
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
                        {providers.find((p) => p.id === m.providerId)?.label}
                      </span>
                    )}
                  </div>
                  <div className="line-clamp-3 text-[11px] text-slate-300">{m.content}</div>
                  {(m.tokens || m.latencyMs) && (
                    <div className="mt-1 flex justify-between text-[9px] text-slate-500">
                      <span>{m.tokens ? `${m.tokens} tok` : null}</span>
                      <span>{m.latencyMs ? `${m.latencyMs} ms` : null}</span>
                    </div>
                  )}
                </div>
              ))}

            {messages.length === 0 && (
              <div className="text-[11px] text-slate-500">
                Chains, provider hops, token usage, and latency will show here once you start talking to GlyphBot.
              </div>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
}

function renderModeToggle(key, label, modes, onToggleMode) {
  if (!onToggleMode) return null;
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
  return (
    <div className={"flex gap-2 " + (isAssistant ? "justify-start" : "justify-end")}>
      {isAssistant && (
        <div className="mt-1 h-7 w-7 rounded-2xl bg-slate-900 border border-cyan-500/60 flex items-center justify-center text-[9px] font-semibold text-cyan-200">
          GB
        </div>
      )}

      <div className={[
        "max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm border",
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

      {!isAssistant && (
        <div className="mt-1 h-7 w-7 rounded-2xl bg-slate-900 border border-slate-600 flex items-center justify-center text-[9px] font-semibold text-slate-200">
          U
        </div>
      )}
    </div>
  );
}