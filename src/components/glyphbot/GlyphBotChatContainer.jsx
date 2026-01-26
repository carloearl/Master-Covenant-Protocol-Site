import React, { useRef, useEffect } from 'react';
import ChatMessageMemo from '@/components/glyphlock/bot/ui/ChatMessageMemo';

/**
 * GlyphBot Chat Container
 * Handles message display and scrolling
 */
export default function GlyphBotChatContainer({ 
  messages, 
  isSending, 
  onReplayWithSettings 
}) {
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const el = chatContainerRef.current;
    if (el) {
      requestAnimationFrame(() => {
        el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
      });
    }
  }, [messages, isSending]);

  return (
    <div 
      ref={chatContainerRef}
      className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-4 py-4 sm:py-6 space-y-3 sm:space-y-4 pb-20 sm:pb-6"
    >
      {messages.filter(msg => msg && msg.content).map((msg, idx) => {
        const msgId = msg.id || `msg-${idx}`;
        return (
          <ChatMessageMemo 
            key={msgId}
            msg={msg}
            isAssistant={msg.role === 'assistant'}
            onReplay={onReplayWithSettings}
          />
        );
      })}

      {isSending && (
        <div className="flex items-center gap-3 text-sm animate-in fade-in p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 animate-bounce shadow-[0_0_8px_rgba(6,182,212,0.8)]" style={{ animationDelay: '0ms' }} />
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 animate-bounce shadow-[0_0_8px_rgba(168,85,247,0.8)]" style={{ animationDelay: '150ms' }} />
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 animate-bounce shadow-[0_0_8px_rgba(59,130,246,0.8)]" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="font-bold drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" style={{ color: '#39ff14' }}>GlyphBot is thinking...</span>
        </div>
      )}
    </div>
  );
}