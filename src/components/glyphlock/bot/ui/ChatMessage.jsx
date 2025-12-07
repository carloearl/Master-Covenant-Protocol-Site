import React from 'react';

export default function ChatMessage({ msg, isAssistant }) {
  if (!msg || !msg.content) return null;

  return (
    <div
      className={`max-w-[80%] p-5 rounded-2xl mb-4 font-semibold shadow-lg ${
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
    </div>
  );
}