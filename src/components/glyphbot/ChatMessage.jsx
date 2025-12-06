import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Volume2, Check, Bot, User } from 'lucide-react';
import GlyphAuditCard from '@/components/glyphaudit/GlyphAuditCard';
import FeedbackWidget from './FeedbackWidget';

export default function ChatMessage({ 
  msg, 
  isAssistant, 
  providerLabel, 
  ttsAvailable = true, 
  isSpeaking = false,
  onPlayTTS,
  showFeedback = true,
  persona,
  onReplayWithSettings
}) {
  const [copied, setCopied] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const hasAudit = msg.audit && (msg.audit.json || msg.audit.report);

  const handleTTS = () => {
    if (onPlayTTS) {
      onPlayTTS(msg.id);
    }
  };

  const handleReplayWithSettings = () => {
    if (onReplayWithSettings && msg.ttsMetadata) {
      onReplayWithSettings(msg.id, msg.ttsMetadata);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex gap-3 ${isAssistant ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      {isAssistant && (
        <div className="shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.3)]">
          <Bot className="w-4 h-4 text-cyan-400" />
        </div>
      )}

      <div className={`space-y-2 ${hasAudit ? 'max-w-[90%] w-full' : 'max-w-[80%]'}`}>
        <div className={`
          rounded-2xl px-4 py-3 shadow-lg border backdrop-blur-sm
          ${isAssistant 
            ? 'bg-slate-900/80 border-slate-700/60 text-slate-100' 
            : 'bg-gradient-to-br from-cyan-500/15 to-blue-500/15 border-cyan-400/50 text-cyan-50'
          }
        `}>
          {/* Header */}
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-700/30">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] uppercase tracking-[0.15em] font-semibold ${isAssistant ? 'text-cyan-400' : 'text-slate-400'}`}>
                {isAssistant ? 'GlyphBot' : 'You'}
              </span>
              {providerLabel && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-800/80 text-slate-500 border border-slate-700/50">
                  {providerLabel}
                </span>
              )}
              {msg.latencyMs && (
                <span className="text-[9px] text-slate-600">{msg.latencyMs}ms</span>
              )}
            </div>
            
            <div className="flex items-center gap-1.5">
              {isAssistant && (
                <button
                  onClick={handleCopy}
                  className="p-1 rounded-md hover:bg-slate-700/50 text-slate-500 hover:text-slate-300 transition-colors"
                  title="Copy message"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              )}
              {isAssistant && (
                <>
                  <button
                    onClick={handleTTS}
                    className={`p-1 rounded-md hover:bg-slate-700/50 transition-colors ${
                      isSpeaking ? 'text-cyan-400 animate-pulse' : 'text-slate-500 hover:text-cyan-400'
                    }`}
                    title={isSpeaking ? "Speaking..." : "Play voice"}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                  {msg.ttsMetadata && onReplayWithSettings && (
                    <button
                      onClick={handleReplayWithSettings}
                      className="p-1 rounded-md hover:bg-slate-700/50 text-slate-500 hover:text-purple-400 transition-colors"
                      title={`Replay with ${msg.ttsMetadata.emotion || 'custom'} voice`}
                    >
                      <Volume2 className="w-3.5 h-3.5" strokeWidth={3} />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Content */}
          {isAssistant ? (
            <div className="prose prose-sm prose-invert max-w-none prose-p:my-2 prose-headings:text-cyan-300 prose-code:text-fuchsia-300 prose-code:bg-slate-800/80 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-700/50 prose-a:text-cyan-400 prose-strong:text-white">
              <ReactMarkdown
                components={{
                  code: ({ inline, className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || '');
                    if (!inline && match) {
                      return (
                        <div className="relative group my-3">
                          <div className="absolute top-2 right-2 flex items-center gap-2">
                            <span className="text-[9px] uppercase text-slate-600">{match[1]}</span>
                            <button
                              onClick={() => navigator.clipboard.writeText(String(children))}
                              className="p-1 rounded bg-slate-800/80 text-slate-500 hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                          <pre className="!bg-slate-950/90 !border !border-slate-700/50 rounded-lg overflow-x-auto">
                            <code className={className} {...props}>{children}</code>
                          </pre>
                        </div>
                      );
                    }
                    return <code className={className} {...props}>{children}</code>;
                  },
                  p: ({ children }) => <p className="leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="my-2 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="my-2 space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="text-slate-300">{children}</li>,
                  a: ({ children, href }) => (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2">
                      {children}
                    </a>
                  ),
                }}
              >
                {msg.content}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="whitespace-pre-wrap leading-relaxed text-sm">{msg.content}</div>
          )}
        </div>
        
        {hasAudit && <GlyphAuditCard audit={msg.audit} />}
        
        {/* Feedback Widget for assistant messages */}
        {isAssistant && showFeedback && !feedbackGiven && (
          <div className="mt-2">
            <FeedbackWidget
              messageId={msg.id}
              providerId={msg.providerId}
              model={providerLabel}
              persona={persona}
              latencyMs={msg.latencyMs}
              promptSnippet={msg.promptSnippet}
              responseSnippet={msg.content}
              onFeedbackSubmitted={() => setFeedbackGiven(true)}
            />
          </div>
        )}
      </div>

      {!isAssistant && (
        <div className="shrink-0 w-8 h-8 rounded-xl bg-slate-800 border border-slate-600/50 flex items-center justify-center">
          <User className="w-4 h-4 text-slate-400" />
        </div>
      )}
    </div>
  );
}