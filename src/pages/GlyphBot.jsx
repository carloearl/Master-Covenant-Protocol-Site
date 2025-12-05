import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import glyphbotClient from '@/components/glyphbot/glyphbotClient';
import SEOHead from '@/components/SEOHead';
import { base44 } from '@/api/base44Client';
import { Activity, Zap, Shield, Bot, AlertTriangle, X, PanelRightOpen, PanelRightClose } from 'lucide-react';
import GlyphProviderChain from '@/components/provider/GlyphProviderChain';
import ProviderStatusPanel from '@/components/glyphbot/ProviderStatusPanel';
import ChatMessage from '@/components/glyphbot/ChatMessage';
import ChatInput from '@/components/glyphbot/ChatInput';
import ControlBar from '@/components/glyphbot/ControlBar';
import ChatHistoryPanel from '@/components/glyphbot/ChatHistoryPanel';
import { useGlyphBotPersistence } from '@/components/glyphbot/useGlyphBotPersistence';
import useTTS from '@/components/glyphbot/useTTS';
import { createPageUrl } from '@/utils';

// Storage keys
const STORAGE_KEYS = {
  MESSAGES: 'glyphbot_messages',
  SETTINGS: 'glyphbot_settings',
  CHAT_COUNT: 'glyphbot_chat_count'
};

// Limits
const MAX_MESSAGES = 10; // Trim messages beyond this
const SAVE_SETTINGS_THRESHOLD = 20; // Save settings after this many chats

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
  const [chatCount, setChatCount] = useState(0);
  const [showTrimWarning, setShowTrimWarning] = useState(false);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

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
  
  // TTS settings state
  const [voiceSettings, setVoiceSettings] = useState({
    voice: null,
    speed: 0.95,
    pitch: 1.0,
    volume: 1.0,
    bass: 0,
    mid: 0,
    treble: 0
  });

  // TTS Hook with dynamic settings
  const { speak, stop: stopTTS, isSpeaking } = useTTS(voiceSettings);

  // Persistence hook - Phase 5
  const {
    currentChatId,
    savedChats,
    isLoading: persistenceLoading,
    fullHistory,
    trackMessage,
    initializeHistory,
    saveChat,
    archiveChat,
    loadChat,
    startNewChat,
    loadSavedChats,
    getArchivedChats,
    unarchiveChat,
    deleteChat
  } = useGlyphBotPersistence(currentUser);

  // Load current user
  useEffect(() => {
    (async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (isAuth) {
          const user = await base44.auth.me();
          console.log('[GlyphBot] Current user loaded:', user?.email || 'no email');
          setCurrentUser(user);
        } else {
          console.warn('[GlyphBot] User not authenticated');
        }
      } catch (e) {
        console.error('[GlyphBot] Auth check failed:', e);
      }
    })();
  }, []);

  // Load saved settings and messages on mount + auto-resume last session
  useEffect(() => {
    (async () => {
      try {
        const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          if (parsed.persona) setPersona(parsed.persona);
          if (parsed.provider) setProvider(parsed.provider);
          if (parsed.modes) setModes(prev => ({ ...prev, ...parsed.modes }));
          if (parsed.voiceSettings) setVoiceSettings(prev => ({ ...prev, ...parsed.voiceSettings }));
        }

        const savedCount = localStorage.getItem(STORAGE_KEYS.CHAT_COUNT);
        if (savedCount) setChatCount(parseInt(savedCount, 10) || 0);

        // Auto-resume: check if currentChatId exists and load that chat
        if (currentChatId && currentUser?.email) {
          console.log('[GlyphBot] Auto-resuming chat:', currentChatId);
          const result = await loadChat(currentChatId);
          if (result?.messages) {
            // Use visibleMessages if available, else full messages
            const messagesToDisplay = result.visibleMessages || result.messages.slice(-10);
            setMessages([WELCOME_MESSAGE, ...messagesToDisplay.filter(m => m.id !== 'welcome-1')]);
            
            // Restore state
            if (result.persona) setPersona(result.persona);
            if (result.provider) setProvider(result.provider);
            
            console.log('[GlyphBot] Auto-resume complete:', {
              chatId: currentChatId,
              messageCount: result.messages.length,
              visibleCount: messagesToDisplay.length
            });
            
            return; // Skip session storage load if we loaded from entity
          }
        }

        // Fallback: load from session storage if no auto-resume
        const savedMessages = sessionStorage.getItem(STORAGE_KEYS.MESSAGES);
        if (savedMessages) {
          const parsed = JSON.parse(savedMessages);
          if (parsed.length > 0) {
            setMessages(parsed);
            initializeHistory(parsed);
          }
        }
      } catch (e) {
        console.warn('[GlyphBot] Failed to load settings or auto-resume:', e);
      }
    })();
  }, [currentChatId, currentUser?.email, loadChat, initializeHistory]);

  // Save messages to sessionStorage on change
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    } catch (e) {
      console.warn('Failed to save messages:', e);
    }
  }, [messages]);

  // Auto-trim messages when exceeding MAX_MESSAGES
  useEffect(() => {
    if (messages.length > MAX_MESSAGES + 1) { // +1 for welcome message
      const trimmedMessages = [
        WELCOME_MESSAGE,
        ...messages.slice(-MAX_MESSAGES)
      ];
      setMessages(trimmedMessages);
      setShowTrimWarning(true);
      setTimeout(() => setShowTrimWarning(false), 4000);
    }
  }, [messages]);

  // Save settings after SAVE_SETTINGS_THRESHOLD chats
  useEffect(() => {
    if (chatCount > 0 && chatCount % SAVE_SETTINGS_THRESHOLD === 0) {
      try {
        const settingsToSave = {
          persona,
          provider,
          modes: { voice: modes.voice, live: modes.live, audit: modes.audit },
          voiceSettings: {
            speed: voiceSettings.speed,
            pitch: voiceSettings.pitch,
            volume: voiceSettings.volume,
            bass: voiceSettings.bass,
            mid: voiceSettings.mid,
            treble: voiceSettings.treble
          }
        };
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settingsToSave));
        localStorage.setItem(STORAGE_KEYS.CHAT_COUNT, chatCount.toString());
        console.log(`[GlyphBot] Settings saved after ${chatCount} chats`);
      } catch (e) {
        console.warn('Failed to save settings:', e);
      }
    }
  }, [chatCount, persona, provider, modes, voiceSettings]);

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
    
    // Track user message for full history persistence
    trackMessage(newUserMsg);

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

      const botMsg = { 
        id: `bot-${Date.now()}`,
        role: 'assistant', 
        content: botText,
        audit: response.audit || null,
        providerId: response.providerUsed,
        latencyMs: response.meta?.providerStats?.[response.providerUsed]?.lastLatencyMs
      };
      
      setMessages(prev => [...prev, botMsg]);
      
      // Track for full history persistence
      trackMessage(botMsg);

      // Increment chat count
      setChatCount(prev => {
        const newCount = prev + 1;
        localStorage.setItem(STORAGE_KEYS.CHAT_COUNT, newCount.toString());
        return newCount;
      });

      setLastMeta({
        model: response.model,
        providerUsed: response.providerUsed,
        providerLabel: response.providerLabel,
        realTimeUsed: response.realTimeUsed,
        shouldSpeak: response.shouldSpeak
      });

      // Auto-speak if voice mode is on
      if (modes.voice && botText) {
        speak(botText);
      }

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
    sessionStorage.removeItem(STORAGE_KEYS.MESSAGES);
    startNewChat(); // Clear persistence state
  };

  // Handle save chat
  const handleSaveChat = useCallback(async () => {
    return await saveChat(messages, { provider, persona });
  }, [messages, saveChat, provider, persona]);

  // Handle load chat from history
  const handleLoadChat = useCallback(async (chatId) => {
    const result = await loadChat(chatId);
    if (result?.messages) {
      setMessages([WELCOME_MESSAGE, ...result.messages.filter(m => m.id !== 'welcome-1')]);
      if (result.persona) setPersona(result.persona);
      if (result.provider) setProvider(result.provider);
    }
  }, [loadChat]);

  // Handle new chat
  const handleNewChat = useCallback(() => {
    handleClear();
  }, []);

  const handleToggleMode = (key) => {
    setModes(prev => ({ ...prev, [key]: !prev[key] }));
    // Stop TTS if voice mode is turned off
    if (key === 'voice' && modes.voice) {
      stopTTS();
    }
  };

  // Manual TTS trigger for individual messages
  const handlePlayTTS = (messageId) => {
    const msg = messages.find(m => m.id === messageId);
    if (msg?.content) {
      speak(msg.content);
    }
  };

  // Build providers for display
  const providers = providerMeta?.availableProviders?.map(p => ({
    id: p.id,
    label: p.label,
    active: p.enabled,
    error: p.stats?.failureCount > 0 && p.stats?.successCount === 0
  })) || [];

  const currentProviderLabel = providers.find(p => p.id === (lastMeta?.providerUsed || provider))?.label || 'Gemini (Primary)';

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#030712] via-purple-950/20 to-[#030712] text-slate-50 flex flex-col pt-16 pb-0">
      <SEOHead 
        title="GlyphBot - Elite AI Security Assistant | GlyphLock"
        description="Chat with GlyphBot, your elite AI security assistant for code auditing, blockchain analysis, threat detection, and debugging."
      />
      
      <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full">
        {/* Main Console Container */}
        <div className="flex-1 flex flex-col bg-[#0a0a12]/95 border-x-2 border-purple-500/30 shadow-[0_0_60px_rgba(168,85,247,0.15)] overflow-hidden">
          
          {/* Header */}
          <header className="flex items-center justify-between px-5 py-4 border-b-2 border-purple-500/40 bg-gradient-to-r from-slate-950 via-purple-950/30 to-slate-950 backdrop-blur-xl shadow-[0_4px_30px_rgba(168,85,247,0.2)]">
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/30 to-purple-500/30 border-2 border-cyan-400/60 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.5),inset_0_0_15px_rgba(168,85,247,0.3)]">
                <Bot className="w-6 h-6 text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950 shadow-[0_0_12px_rgba(52,211,153,0.9)] animate-pulse" />
              </div>
              <div>
                <h1 className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 tracking-wide drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">GlyphBot</h1>
                <p className="text-[10px] text-purple-400/80 uppercase tracking-[0.3em] font-semibold">Elite AI Security</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 text-xs px-3 py-2 rounded-xl bg-slate-900/60 border border-purple-500/30">
                    <span className="flex items-center gap-1.5 text-cyan-300">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,1)]" />
                      Online
                    </span>
                    <span className="text-purple-500/60">|</span>
                    <span className="text-purple-300 font-medium">{currentProviderLabel || 'Gemini (Primary)'}</span>
                  </div>
              {currentUser && (
                <button
                  onClick={() => setShowHistoryPanel(!showHistoryPanel)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500/20 border-2 border-emerald-500/50 text-emerald-300 hover:border-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/20 transition-all duration-300"
                  title={showHistoryPanel ? 'Hide History' : 'Show History'}
                >
                  {showHistoryPanel ? <PanelRightClose className="w-3.5 h-3.5" /> : <PanelRightOpen className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">History</span>
                </button>
              )}
              <Link
                to={createPageUrl('ProviderConsole')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-purple-500/20 border-2 border-purple-500/50 text-purple-300 hover:border-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/20 transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]"
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
            onVoiceSettingsChange={setVoiceSettings}
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

          {/* Trim Warning */}
          {showTrimWarning && (
            <div className="mx-4 mt-3 p-3 rounded-xl bg-amber-500/15 border-2 border-amber-400/50 flex items-center justify-between shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              <div className="flex items-center gap-2 text-xs text-amber-300 font-medium">
                <AlertTriangle className="w-4 h-4 drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
                <span>Older messages trimmed to optimize memory (keeping last {MAX_MESSAGES})</span>
              </div>
              <button onClick={() => setShowTrimWarning(false)} className="text-amber-400 hover:text-amber-200 transition-colors p-1 rounded-lg hover:bg-amber-500/20">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Chat Area */}
          <div className="flex-1 flex min-h-0 overflow-hidden">
            {/* Messages */}
            <div 
              ref={chatContainerRef}
              className="flex-1 chat-scroll-container px-4 py-6 space-y-4"
            >
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  msg={msg}
                  isAssistant={msg.role === 'assistant'}
                  providerLabel={msg.providerId ? providers.find(p => p.id === msg.providerId)?.label : undefined}
                  ttsAvailable={true}
                  isSpeaking={isSpeaking}
                  onPlayTTS={handlePlayTTS}
                  showFeedback={msg.role === 'assistant' && msg.id !== 'welcome-1'}
                  persona={persona}
                />
              ))}

              {isSending && (
                <div className="flex items-center gap-3 text-sm text-cyan-300 animate-in fade-in p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 animate-bounce shadow-[0_0_8px_rgba(6,182,212,0.8)]" style={{ animationDelay: '0ms' }} />
                    <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 animate-bounce shadow-[0_0_8px_rgba(168,85,247,0.8)]" style={{ animationDelay: '150ms' }} />
                    <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 animate-bounce shadow-[0_0_8px_rgba(59,130,246,0.8)]" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="font-medium drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]">GlyphBot is thinking...</span>
                </div>
              )}
            </div>

            {/* Chat History Panel - Phase 5 */}
            {showHistoryPanel && currentUser && (
              <aside className="w-64 flex-col border-l-2 border-purple-500/30 bg-gradient-to-b from-slate-950/90 via-purple-950/10 to-slate-950/90 overflow-hidden hidden md:flex">
                <ChatHistoryPanel
                  currentChatId={currentChatId}
                  savedChats={savedChats}
                  isLoading={persistenceLoading}
                  onSave={handleSaveChat}
                  onArchive={archiveChat}
                  onLoadChat={handleLoadChat}
                  onNewChat={handleNewChat}
                  onGetArchived={getArchivedChats}
                  onUnarchive={unarchiveChat}
                  onDelete={deleteChat}
                  hasMessages={messages.length > 1}
                />
              </aside>
            )}

            {/* Telemetry Sidebar - Desktop */}
            <aside className="hidden xl:flex w-72 flex-col border-l-2 border-purple-500/30 bg-gradient-to-b from-slate-950/90 via-purple-950/10 to-slate-950/90 overflow-hidden">
              <div className="px-4 py-4 border-b-2 border-purple-500/30 bg-purple-500/10">
                <div className="flex items-center gap-2 text-xs">
                  <Zap className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                  <span className="uppercase tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-bold">Telemetry</span>
                </div>
              </div>

              <div className="flex-1 chat-scroll-container p-4 space-y-3">
                {messages.slice(-5).reverse().filter(m => m.role !== 'system').map((m) => (
                  <div key={m.id} className="rounded-xl border-2 border-purple-500/30 bg-slate-900/60 p-3 hover:border-cyan-400/50 transition-all duration-300 shadow-[0_0_10px_rgba(168,85,247,0.15)]">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-1 rounded-lg ${
                        m.role === 'assistant' 
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.3)]' 
                          : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      }`}>
                        {m.role === 'assistant' ? 'Bot' : 'You'}
                      </span>
                      {m.latencyMs && (
                        <span className="text-[9px] text-cyan-400/70 font-mono">{m.latencyMs}ms</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-300 line-clamp-2">{m.content}</p>
                  </div>
                ))}

                {lastMeta && (
                  <div className="mt-4 p-4 rounded-xl border-2 border-cyan-500/40 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                    <div className="text-[9px] uppercase tracking-[0.25em] text-cyan-400 font-bold mb-3">Last Response</div>
                    <div className="space-y-2 text-[11px]">
                      <div className="flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5 text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
                        <span className="text-cyan-200 font-medium">{lastMeta.providerLabel || lastMeta.model}</span>
                      </div>
                      {lastMeta.realTimeUsed && (
                        <div className="text-emerald-400 flex items-center gap-1">
                          <span className="drop-shadow-[0_0_4px_rgba(52,211,153,0.8)]">✓</span> Real-time web context
                        </div>
                      )}
                      {lastMeta.shouldSpeak && (
                        <div className="text-purple-400 flex items-center gap-1">
                          <span className="drop-shadow-[0_0_4px_rgba(168,85,247,0.8)]">✓</span> Voice synthesis ready
                        </div>
                      )}
                      {providerMeta?.jsonModeEnabled && (
                        <div className="text-amber-400 flex items-center gap-1">
                          <span className="drop-shadow-[0_0_4px_rgba(245,158,11,0.8)]">✓</span> Structured JSON output
                        </div>
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