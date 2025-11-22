import React, { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { MessageCircle, X } from "lucide-react";

export default function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "🦕 Roar! I'm DinoBot. How can I help?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const msgRef = useRef(null);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    if (msgRef.current) {
      msgRef.current.scrollTo({
        top: msgRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages]);

  const playVoice = async (text) => {
    try {
      const cleanText = text.replace(/[#*`🦕💠]/g, '').replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
      const apiUrl = `https://api.streamelements.com/kappa/v2/speech?voice=Joanna&text=${encodeURIComponent(cleanText)}`;
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("TTS failed");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const audio = audioRef.current;
      audio.pause();
      audio.currentTime = 0;
      audio.src = url;
      audio.play().catch(() => {});
    } catch (e) {
      console.error("Voice error:", e);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are DinoBot, a friendly AI assistant. Be helpful and professional. User question: ${userMessage}`,
        add_context_from_internet: false
      });

      setMessages(prev => [...prev, { role: "assistant", text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: "assistant",
        text: "🦕 Connection issue. Please try again!"
      }]);
    }

    setLoading(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="dino-fab"
        aria-label="Open chat"
      >
        <MessageCircle className="w-7 h-7" />
      </button>
    );
  }

  return (
    <div className="dino-chat-container">
      <div className="dino-header">
        <div className="dino-title">GlyphBot • Dino Edition</div>
        <button onClick={() => setIsOpen(false)} className="dino-close-btn">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="dino-messages" ref={msgRef}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`dino-bubble ${msg.role === "user" ? "dino-user" : "dino-assistant"}`}
          >
            <div className="dino-avatar">
              {msg.role === "user" ? "🦖" : "💠"}
            </div>
            <div className="dino-text">{msg.text}</div>
            {msg.role === "assistant" && (
              <button
                className="dino-speak-btn"
                onClick={() => playVoice(msg.text)}
                title="Play voice"
              >
                🔊
              </button>
            )}
          </div>
        ))}
        {loading && (
          <div className="dino-bubble dino-assistant">
            <div className="dino-avatar">💠</div>
            <div className="dino-text">...</div>
          </div>
        )}
      </div>

      <div className="dino-input-zone">
        <input
          type="text"
          className="dino-input"
          value={input}
          placeholder="Type your message…"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={loading}
        />
        <button 
          className="dino-send-btn" 
          onClick={handleSend}
          disabled={loading || !input.trim()}
        >
          🦴
        </button>
      </div>
    </div>
  );
}