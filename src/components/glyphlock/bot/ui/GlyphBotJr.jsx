import React, { useState, useRef, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Sparkles, Send, Loader2, Volume2, RotateCcw, AlertCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { PERSONAS } from '../config';
import FeedbackButtons from './FeedbackButtons';
import SuggestionChips from './SuggestionChips';
import { useUnifiedVoice } from '@/components/shared/UnifiedVoiceProvider';
import { 
  detectTopic, 
  loadMemory, 
  trackTopic, 
  getPersonalizedGreeting,
  loadChatHistory,
  saveChatHistory,
  getSessionId
} from '../logic/memoryService';
import { 
  buildContextAwarePrompt, 
  getProactiveSuggestion, 
  detectIntentRedirect 
} from '../logic/contextService';

// 🎙️ AURORA LISTEN BUTTON — Plays TTS from agent response
function ListenButton({ text }) {
  const { voiceSettings } = useUnifiedVoice();
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);
  const audioRef = useRef(null);

  const handleListen = async () => {
    if (loading || playing) return;
    
    setError(false);
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    setLoading(true);
    try {
      const { data } = await base44.functions.invoke('glyphBotJrChat', {
        action: 'listen',
        text: text,
        voiceSettings: voiceSettings
      });

      if (data.speak?.enabled && !data.speak?.error) {
        let audioUrl;
        
        if (data.speak.audioBase64) {
          const audioData = atob(data.speak.audioBase64);
          const audioArray = new Uint8Array(audioData.length);
          for (let i = 0; i < audioData.length; i++) {
            audioArray[i] = audioData.charCodeAt(i);
          }
          const blob = new Blob([audioArray], { type: data.speak.mimeType || 'audio/mpeg' });
          audioUrl = URL.createObjectURL(blob);
        } else if (data.speak.audioUrl) {
          audioUrl = data.speak.audioUrl;
        }

        if (audioUrl) {
          const audio = new Audio(audioUrl);
          audioRef.current = audio;
          
          audio.onended = () => {
            if (data.speak.audioBase64) URL.revokeObjectURL(audioUrl);
            setPlaying(false);
            audioRef.current = null;
          };
          audio.onerror = () => {
            setPlaying(false);
            setError(true);
            audioRef.current = null;
          };

          audio.playbackRate = voiceSettings?.speed || 1.0;
          setPlaying(true);
          setLoading(false);
          await audio.play();
          return;
        }
      }
      
      if (data.speak?.error) {
        setError(true);
        setLoading(false);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error('[Aurora TTS] Failed:', err);
      setError(true);
    }
    setLoading(false);
  };

  if (error) {
    return (
      <button
        onClick={handleListen}
        className="text-xs bg-red-600/30 hover:bg-red-600/50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 border border-red-400/30"
        title="Audio failed. Click to retry."
        aria-label="Retry voice playback"
      >
        <AlertCircle className="w-3 h-3" />
        Retry Audio
      </button>
    );
  }

  return (
    <button
      onClick={handleListen}
      disabled={loading}
      className="text-xs bg-blue-600/30 hover:bg-blue-600/50 disabled:opacity-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 border border-blue-400/30 group"
      style={{ boxShadow: '0 0 10px rgba(37, 99, 235, 0.2)' }}
      aria-label={`Listen with ${voiceSettings?.voiceProfile || 'Aurora'} voice. ${loading ? 'Loading' : playing ? 'Playing' : 'Activate'}`}
      role="button"
      aria-pressed={playing}
    >
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {loading ? 'Loading audio' : playing ? 'Audio playing' : error ? 'Audio playback failed' : ''}
      </div>
      {loading ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : (
        <Volume2 className="w-3 h-3 group-active:scale-95 transition-transform" />
      )}
      {playing ? '▶️ Playing' : loading ? 'Loading...' : '🎙️ Aurora'}
    </button>
  );
}

export default function GlyphBotJr() {
  const jrPersona = PERSONAS.find(p => p.id === "glyphbot_jr") || PERSONAS[4];
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [memory, setMemory] = useState(null);
  const [lastTopic, setLastTopic] = useState(null);
  const [sessionId] = useState(() => getSessionId());
  const [currentPage, setCurrentPage] = useState(null);
  const messagesEndRef = useRef(null);
  const initializedRef = useRef(false);
  
  // Track current page for context-aware responses
  useEffect(() => {
    const path = window.location.pathname;
    const pageName = path.split('/').pop() || 'Home';
    setCurrentPage(pageName);
  }, [isOpen]);

  // Load user, memory, and history on mount
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    (async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (isAuth) {
          const user = await base44.auth.me();
          setCurrentUser(user);
          
          // Load persistent memory
          const userMemory = await loadMemory(user.email);
          setMemory(userMemory);
          
          // Set last topic from memory
          if (userMemory?.topics_discussed?.length) {
            setLastTopic(userMemory.topics_discussed[userMemory.topics_discussed.length - 1]);
          }
          
          // Load chat history
          const history = loadChatHistory(sessionId);
          if (history.length > 0) {
            setMessages(history);
          } else {
            const greeting = getPersonalizedGreeting(userMemory);
            setMessages([{ role: "assistant", text: greeting, timestamp: Date.now() }]);
          }
        } else {
          setMessages([{ 
            role: "assistant", 
            text: "Hi there! I'm GlyphBot Junior! 🌟 How can I help you today?", 
            timestamp: Date.now() 
          }]);
        }
      } catch (err) {
        console.error('[GlyphBot] Init error:', err);
        setMessages([{ 
          role: "assistant", 
          text: "Hi there! I'm GlyphBot Junior! 🌟 How can I help you today?", 
          timestamp: Date.now() 
        }]);
      }
    })();
  }, [sessionId]);

  // Auto-scroll and save history
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    if (messages.length > 0) {
      saveChatHistory(sessionId, messages);
    }
  }, [messages, sessionId]);

  const handleSend = async (customMessage) => {
    const userMessage = (customMessage || input).trim();
    if (!userMessage || loading) return;

    setInput("");
    const userMsg = { role: "user", text: userMessage, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    // Detect and track topic
    const detectedTopic = detectTopic(userMessage);
    if (detectedTopic) {
      setLastTopic(detectedTopic);
      if (currentUser?.email) {
        trackTopic(currentUser.email, detectedTopic);
      }
    }

    try {
      const { QR_KNOWLEDGE_BASE } = await import('@/components/qr/QrKnowledgeBase');
      const { IMAGE_LAB_KNOWLEDGE } = await import('@/components/imageLab/ImageLabKnowledge');
      const { default: faqData } = await import('@/components/content/faqMasterData');
      const { default: sitemapKnowledge } = await import('@/components/content/sitemapKnowledge');
      
      const faqContext = faqData.map(item => 
        `Q: ${item.q}\nA: ${item.a.join(' ')}`
      ).join('\n\n');

      const sitemapContext = `
Site Structure:
${sitemapKnowledge.tools.map(t => `- ${t.name} at ${t.path}`).join('\n')}

Navigation Questions:
${sitemapKnowledge.commonQuestions.map(q => `Q: ${q.q}\nA: ${q.a}`).join('\n')}
`;

      // Include memory context
      const memoryContext = memory ? `
User Context:
- Has visited ${memory.interaction_count || 0} times
- Recent interests: ${memory.topics_discussed?.slice(-3).join(', ') || 'none yet'}
- Favorite features: ${memory.favorite_features?.join(', ') || 'exploring'}
` : '';

      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.text
      })).concat([{ role: "user", content: userMessage }]);

      // Check for intent to redirect
      const suggestedPage = detectIntentRedirect(userMessage);

      const systemPrompt = buildContextAwarePrompt(
        `${jrPersona.system}

      ${memoryContext}

      QR Studio Knowledge Base:
      ${QR_KNOWLEDGE_BASE}

      Image Lab Knowledge Base:
      ${JSON.stringify(IMAGE_LAB_KNOWLEDGE, null, 2)}

      GlyphLock FAQ Knowledge Base:
      ${faqContext}

      ${sitemapContext}

      CRITICAL PLATFORM INFO:
      - GlyphLock is 100% OPEN SOURCE and FREE for all users
      - NO trials, NO subscriptions, NO paywalls - everything is accessible immediately
      - All features (QR Studio, Image Lab, GlyphBot, Console, NUPS) are fully available
      - Users only need to sign in to save their work and access advanced features
      - Never mention "free trial" or "upgrade" - the platform is already fully open

      IMPORTANT: After answering, suggest a next step the user might want to take. For example:
      - After QR discussion: "Want to try our Image Lab next?"
      - After security topics: "Would you like me to explain our encryption?"
      ${suggestedPage ? `\nThe user seems interested in ${suggestedPage}. Consider mentioning they can visit /${suggestedPage} for more details.` : ''}

      Be friendly, helpful, and explain things simply!`,
        currentPage,
        memory?.topics_discussed || []
      );

      const { data } = await base44.functions.invoke('glyphBotJrChat', {
        action: 'chat',
        messages: conversationHistory,
        systemPrompt: systemPrompt
      });

      const assistantMessage = { 
        role: "assistant", 
        text: data.text, 
        timestamp: Date.now(),
        userQuery: userMessage,
        speak: data.speak
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
    } catch (error) {
      console.error('[GlyphBot] Chat error:', error);
      setMessages(prev => [...prev, {
        role: "assistant",
        text: "Oops! Something went wrong. Can you try asking again? 😊",
        timestamp: Date.now()
      }]);
    }

    setLoading(false);
  };

  const handleSuggestionClick = (prompt) => {
    handleSend(prompt);
  };

  const clearHistory = () => {
    const greeting = getPersonalizedGreeting(memory);
    setMessages([{ role: "assistant", text: greeting, timestamp: Date.now() }]);
    saveChatHistory(sessionId, []);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[99999] w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white shadow-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        style={{ 
          boxShadow: '0 0 30px rgba(37, 99, 235, 0.6), 0 0 60px rgba(37, 99, 235, 0.3)',
          pointerEvents: 'auto',
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
          display: 'flex',
          visibility: 'visible',
          minWidth: '64px',
          minHeight: '64px'
        }}
        aria-label="Open GlyphBot Junior"
      >
        <Sparkles className="w-8 h-8" />
      </button>
    );
  }

  return (
    <div 
      className="fixed bottom-6 right-6 z-[99999] flex flex-col overflow-hidden rounded-2xl shadow-2xl border glyph-glass-dark"
      style={{ 
        borderColor: 'rgba(37, 99, 235, 0.3)',
        width: '400px',
        height: '600px',
        maxWidth: 'calc(100vw - 48px)',
        maxHeight: 'calc(100vh - 100px)',
        boxShadow: '0 0 40px rgba(37, 99, 235, 0.5), 0 0 80px rgba(37, 99, 235, 0.2)',
        pointerEvents: 'auto',
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'transparent',
        display: 'flex',
        visibility: 'visible',
        isolation: 'isolate'
      }}
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2YTAwZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20 pointer-events-none"></div>
      
      <header className="glyph-glass-dark border-b border-blue-400/20 shadow-lg relative z-10 glyph-glow">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-lg" style={{ boxShadow: '0 0 20px rgba(37, 99, 235, 0.5)' }}>
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">GlyphBot Jr</h1>
                <p className="text-xs text-blue-200">
                  {memory?.interaction_count > 0 ? `${memory.interaction_count} chats 💠` : '24/7 Helper 💠'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearHistory}
                className="w-8 h-8 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                title="Clear chat"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 flex items-center justify-center text-white transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-4 relative z-10">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-5 py-3 shadow-lg ${
                msg.role === "user"
                  ? "bg-gradient-to-br from-blue-600 to-blue-800 text-white"
                  : "bg-blue-950/80 backdrop-blur text-white border border-blue-400/30"
              }`}
              style={msg.role === "assistant" ? { boxShadow: '0 0 20px rgba(37, 99, 235, 0.3)' } : {}}
            >
              <ReactMarkdown
                className="prose prose-invert prose-sm max-w-none"
                components={{
                  p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                  code: ({ inline, children }) =>
                    inline ? (
                      <code className="bg-gray-200 px-1.5 py-0.5 rounded text-sm">{children}</code>
                    ) : (
                      <code className="block bg-gray-100 p-3 rounded-lg text-sm overflow-x-auto">{children}</code>
                    )
                }}
              >
                {msg.text}
              </ReactMarkdown>
              
              {msg.role === "assistant" && (
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <ListenButton text={msg.text} />
                  <FeedbackButtons 
                    messageText={msg.text} 
                    userQuery={msg.userQuery}
                    sessionId={sessionId}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
        
        {/* Suggestion chips after last assistant message */}
        {!loading && messages.length > 0 && messages[messages.length - 1]?.role === "assistant" && (
          <SuggestionChips 
            lastTopic={lastTopic} 
            onSuggestionClick={handleSuggestionClick}
          />
        )}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-blue-950/80 backdrop-blur rounded-2xl px-5 py-3 shadow-lg flex items-center gap-2 border border-blue-400/30" style={{ boxShadow: '0 0 20px rgba(37, 99, 235, 0.3)' }}>
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
              <span className="text-blue-200 text-sm">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      <footer className="glyph-glass-dark border-t border-blue-400/20 px-4 py-4 relative z-10">
        <div className="flex items-center gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask me anything! 💠"
            disabled={loading}
            rows={1}
            className="flex-1 bg-blue-950/50 border-2 border-blue-400/30 rounded-xl px-4 py-3 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent min-h-[52px] resize-none"
            style={{ fontSize: "16px", maxHeight: "120px" }}
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white rounded-xl px-6 py-3 font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all min-h-[52px] min-w-[80px] flex items-center justify-center"
            style={{ boxShadow: '0 0 20px rgba(37, 99, 235, 0.4)' }}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-center text-blue-300 text-xs mt-2">Enter to send • Shift+Enter for new line</p>
      </footer>
    </div>
  );
}