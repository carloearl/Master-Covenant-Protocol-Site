import React, { useEffect, useMemo, useRef, useState } from "react";
import { base44 } from "@/api/base44Client";

const PERSONAS = [
  {
    id: "glyphbot_default",
    name: "GlyphBot",
    system:
      "You are GlyphBot, a sharp, helpful, confident assistant for GlyphLock and Glyph Tech. Speak clearly, be practical, match Carlo energy, do not reveal private methods unless asked directly."
  },
  {
    id: "glyphbot_cynical",
    name: "GlyphBot Cynical",
    system:
      "You are GlyphBot in cynical mode. You are blunt, a little roasted, still helpful, never cruel. Keep it real. Do not reveal private methods unless asked directly."
  },
  {
    id: "glyphbot_legal",
    name: "GlyphBot Legal",
    system:
      "You are GlyphBot in legal mode. You communicate clearly and precisely, avoid speculation, and provide structured guidance. Do not reveal private methods unless asked directly."
  }
];

export default function GlyphBot() {
  const [messages, setMessages] = useState(() => []);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const [personaId, setPersonaId] = useState(() => {
    try {
      return localStorage.getItem("glyphbot_persona") || PERSONAS[0].id;
    } catch {
      return PERSONAS[0].id;
    }
  });

  const persona = useMemo(
    () => PERSONAS.find(p => p.id === personaId) || PERSONAS[0],
    [personaId]
  );

  const [autoplay, setAutoplay] = useState(() => {
    try {
      return localStorage.getItem("glyphbot_autoplay") === "true";
    } catch {
      return false;
    }
  });

  const [auditMode, setAuditMode] = useState(false);
  const [oneTestMode, setOneTestMode] = useState(false);

  const listRef = useRef(null);
  const inputRef = useRef(null);

  const audioRef = useRef(null);
  const lastSpokenIdRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem("glyphbot_persona", personaId);
    } catch {}
  }, [personaId]);

  useEffect(() => {
    try {
      localStorage.setItem("glyphbot_autoplay", String(autoplay));
    } catch {}
  }, [autoplay]);

  useEffect(() => {
    // Always scroll to bottom on new message
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  useEffect(() => {
    // Voice autoplay for latest assistant message only
    if (!autoplay) return;
    const last = [...messages].reverse().find(m => m.role === "assistant");
    if (!last) return;
    if (lastSpokenIdRef.current === last.id) return;
    speak(last.text, last.id);
  }, [messages, autoplay]);

  function stopAudio() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
  }

  async function speak(text, messageId) {
    try {
      stopAudio();
      lastSpokenIdRef.current = messageId;

      // Use browser TTS as simple fallback
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Fail silent, never break chat
    }
  }

  function addMessage(role, text, meta = {}) {
    const id = crypto.randomUUID();
    setMessages(prev => [...prev, { id, role, text, createdAt: Date.now(), ...meta }]);
    return id;
  }

  async function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    setInput("");
    setIsSending(true);
    addMessage("user", trimmed);

    const typingId = addMessage("assistant", "Typing…", { isTyping: true });

    try {
      const payload = {
        messages: messages
          .filter(m => !m.isTyping)
          .map(m => ({ role: m.role, content: m.text }))
          .concat([{ role: "user", content: trimmed }]),
        persona: personaId
      };

      const res = await base44.functions.invoke("glyphbotLLM", payload);

      const reply = res.data.text || "No response returned.";

      setMessages(prev =>
        prev.map(m => (m.id === typingId ? { ...m, text: reply, isTyping: false } : m))
      );
    } catch (err) {
      setMessages(prev =>
        prev.map(m =>
          m.id === typingId
            ? {
                ...m,
                text:
                  "I hit a system error. Try again. If it keeps happening, an agent will audit the route.",
                isTyping: false,
                error: true
              }
            : m
        )
      );
    } finally {
      setIsSending(false);
    }
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function clearChat() {
    stopAudio();
    setMessages([]);
    lastSpokenIdRef.current = null;
  }

  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col">
      <header className="sticky top-0 z-10 bg-black border-b border-white/10 px-4 py-3 flex items-center gap-3">
        <div className="flex flex-col">
          <div className="text-lg font-semibold">GlyphBot</div>
          <div className="text-xs text-white/60">Base44 unified chat and voice</div>
        </div>

        <div className="ml-auto flex items-center gap-2 flex-wrap">
          <select
            value={personaId}
            onChange={e => setPersonaId(e.target.value)}
            className="bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm min-h-[44px]"
            aria-label="Persona"
          >
            {PERSONAS.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setAutoplay(v => !v)}
            className={`px-3 py-2 rounded-lg text-sm border min-h-[44px] ${
              autoplay ? "bg-white text-black border-white" : "bg-white/5 border-white/15"
            }`}
          >
            {autoplay ? "Autoplay on" : "Autoplay off"}
          </button>

          <button
            onClick={() => setAuditMode(v => !v)}
            className={`px-3 py-2 rounded-lg text-sm border min-h-[44px] ${
              auditMode ? "bg-white text-black border-white" : "bg-white/5 border-white/15"
            }`}
          >
            {auditMode ? "Audit on" : "Audit off"}
          </button>

          <button
            onClick={() => setOneTestMode(v => !v)}
            className={`px-3 py-2 rounded-lg text-sm border min-h-[44px] ${
              oneTestMode ? "bg-white text-black border-white" : "bg-white/5 border-white/15"
            }`}
          >
            {oneTestMode ? "One test on" : "One test off"}
          </button>

          <button
            onClick={clearChat}
            className="px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/15 min-h-[44px]"
          >
            Clear
          </button>
        </div>
      </header>

      <main
        ref={listRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {messages.length === 0 && (
          <div className="text-white/60 text-sm">
            Say something. GlyphBot is online.
          </div>
        )}

        {messages.map(m => (
          <div
            key={m.id}
            className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow ${
              m.role === "user"
                ? "ml-auto bg-white text-black"
                : "mr-auto bg-white/10 text-white"
            }`}
          >
            <div className="whitespace-pre-wrap">{m.text}</div>

            {m.role === "assistant" && !m.isTyping && (
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => speak(m.text, m.id)}
                  className="px-3 py-2 text-xs rounded-lg bg-white/5 border border-white/15 min-h-[44px]"
                >
                  Speak
                </button>
                <button
                  onClick={stopAudio}
                  className="px-3 py-2 text-xs rounded-lg bg-white/5 border border-white/15 min-h-[44px]"
                >
                  Stop
                </button>
              </div>
            )}
          </div>
        ))}
      </main>

      <footer className="sticky bottom-0 bg-black border-t border-white/10 px-3 py-3">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
            placeholder="Type your message"
            className="flex-1 resize-none bg-white/5 border border-white/15 rounded-2xl px-4 py-3 text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-white/40 min-h-[52px]"
            style={{ fontSize: "16px" }}
          />

          <button
            onClick={sendMessage}
            disabled={isSending}
            className={`min-w-[96px] h-[52px] rounded-2xl text-base font-semibold ${
              isSending ? "bg-white/30 text-black" : "bg-white text-black"
            }`}
          >
            {isSending ? "Sending" : "Send"}
          </button>
        </div>

        <div className="mt-2 text-xs text-white/50">
          Enter to send. Shift Enter for new line. Autoplay speaks only latest reply.
        </div>
      </footer>
    </div>
  );
}