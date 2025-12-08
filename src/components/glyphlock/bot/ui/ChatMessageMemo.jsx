import React from 'react';
import { Volume2 } from 'lucide-react';

const ChatMessage = React.memo(function ChatMessage({ msg, isAssistant, onReplay }) {
  if (!msg || !msg.content) return null;

  return (
    <div
      className={`max-w-[80%] p-5 rounded-2xl mb-4 font-semibold shadow-lg relative ${
        isAssistant ? 'mr-auto text-left' : 'ml-auto text-right'
      }`}
      style={{
        background: 'rgba(30, 64, 175, 0.3)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '2px solid rgba(59, 130, 246, 0.4)',
        boxShadow: '0 0 30px rgba(59, 130, 246, 0.3), inset 0 0 20px rgba(59, 130, 246, 0.1)',
        color: '#ffffff',
        position: 'relative',
        zIndex: 9999,
        fontSize: '16px',
        lineHeight: '1.6',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word'
      }}
    >
      {msg.content}
      {isAssistant && onReplay && msg.ttsMetadata && (
        <button
          onClick={() => onReplay(msg.id, msg.ttsMetadata)}
          className="absolute top-2 right-2 p-1.5 rounded-lg bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 hover:bg-cyan-500/30 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
          title="Replay with original voice settings"
          aria-label="Replay message"
        >
          <Volume2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.msg.id === nextProps.msg.id &&
    prevProps.msg.content === nextProps.msg.content &&
    prevProps.isAssistant === nextProps.isAssistant
  );
});

export default ChatMessage;