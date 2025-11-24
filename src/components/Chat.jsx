import React, { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { MessageCircle, X, Save, FolderOpen, Plus, Settings, Volume2 } from "lucide-react";
import { generateAudio, applyAudioEffects } from "@/utils/ttsEngine";
import VoiceSettingsPanel from "@/components/chat/VoiceSettingsPanel";

export default function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "🦕 Roar! I'm DinoBot. How can I help?", timestamp: new Date().toISOString() }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [currentConvId, setCurrentConvId] = useState(null);
  const [showConvList, setShowConvList] = useState(false);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState({
    provider: 'openai',
    voice: 'alloy',
    speed: 1.0,
    pitch: 1.0,
    naturalness: 0.8,
    volume: 1.0,
    bass: 0,
    treble: 0,
    mid: 0,
    stability: 0.5,
    similarity: 0.75,
    style: 0.0,
    useSpeakerBoost: true
  });
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

  useEffect(() => {
    if (isOpen) {
      loadConversations();
      loadUserPreferences();
    }
  }, [isOpen]);

  const loadUserPreferences = async () => {
    try {
      const prefs = await base44.entities.UserPreferences.list();
      if (prefs.length > 0 && prefs[0].voiceSettings) {
        setVoiceSettings(prefs[0].voiceSettings);
      }
    } catch (e) {
      console.error("Failed to load preferences:", e);
    }
  };

  const saveVoiceSettings = async (newSettings) => {
    setVoiceSettings(newSettings);
    try {
      const prefs = await base44.entities.UserPreferences.list();
      if (prefs.length > 0) {
        await base44.entities.UserPreferences.update(prefs[0].id, {
          voiceSettings: newSettings
        });
      } else {
        await base44.entities.UserPreferences.create({
          voiceSettings: newSettings
        });
      }
    } catch (e) {
      console.error("Failed to save preferences:", e);
    }
  };

  const loadConversations = async () => {
    try {
      const convs = await base44.entities.Conversation.list('-last_message_at', 10);
      setConversations(convs);
    } catch (e) {
      console.error("Failed to load conversations:", e);
    }
  };

  const playVoice = async (text) => {
    try {
      const audioUrl = await generateAudio(
        voiceSettings.provider,
        voiceSettings.voice,
        text,
        voiceSettings
      );
      
      if (audioUrl) {
        const audio = audioRef.current;
        audio.pause();
        audio.currentTime = 0;
        audio.src = audioUrl;
        audio.playbackRate = voiceSettings.speed || 1.0;
        
        applyAudioEffects(audio, {
          bass: voiceSettings.bass || 0,
          treble: voiceSettings.treble || 0,
          mid: voiceSettings.mid || 0,
          volume: voiceSettings.volume || 1.0
        });
        
        audio.play().catch(() => {});
      }
    } catch (e) {
      console.error("Voice error:", e);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    const timestamp = new Date().toISOString();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMessage, timestamp }]);
    setLoading(true);

    try {
      const { QR_KNOWLEDGE_BASE } = await import('./qr/QrKnowledgeBase');
      const { IMAGE_LAB_KNOWLEDGE } = await import('./imageLab/ImageLabKnowledge');
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
      
      // Build conversation context from message history
      const conversationHistory = messages.slice(1).map(msg => 
        `${msg.role === 'user' ? 'User' : 'DinoBot'}: ${msg.text}`
      ).join('\n');

      const contextPrompt = conversationHistory 
        ? `Previous conversation:\n${conversationHistory}\n\nUser: ${userMessage}`
        : `User: ${userMessage}`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are DinoBot, a friendly AI assistant for GlyphLock Security. Be helpful and professional. Maintain context from the conversation history and reference previous messages when relevant.

QR Studio Knowledge Base:
${QR_KNOWLEDGE_BASE}

Image Lab Knowledge Base:
${JSON.stringify(IMAGE_LAB_KNOWLEDGE, null, 2)}

GlyphLock FAQ Knowledge Base (use this to answer common questions about pricing, features, security, etc.):
${faqContext}

${sitemapContext}

${contextPrompt}

When answering questions, check the FAQ knowledge base first for common questions. For QR or Image Lab specific questions, use those knowledge bases. If they ask about navigation or where to find pages, use the sitemap context. Be concise and accurate.`,
        add_context_from_internet: false
      });

      const assistantMsg = { role: "assistant", text: response, timestamp: new Date().toISOString() };
      setMessages(prev => [...prev, assistantMsg]);

      // Auto-save conversation if it has a saved ID
      if (currentConvId) {
        await saveCurrentConversation(currentConvId);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: "assistant",
        text: "🦕 Connection issue. Please try again!",
        timestamp: new Date().toISOString()
      }]);
    }

    setLoading(false);
  };

  const saveCurrentConversation = async (convId = null) => {
    try {
      const title = messages.find(m => m.role === 'user')?.text.slice(0, 50) || 'New Chat';
      const convData = {
        title,
        messages,
        last_message_at: new Date().toISOString()
      };

      if (convId) {
        await base44.entities.Conversation.update(convId, convData);
      } else {
        const newConv = await base44.entities.Conversation.create(convData);
        setCurrentConvId(newConv.id);
      }
      await loadConversations();
    } catch (e) {
      console.error("Failed to save conversation:", e);
    }
  };

  const loadConversation = async (conv) => {
    setMessages(conv.messages);
    setCurrentConvId(conv.id);
    setShowConvList(false);
  };

  const newConversation = () => {
    setMessages([{ role: "assistant", text: "🦕 Roar! I'm DinoBot. How can I help?", timestamp: new Date().toISOString() }]);
    setCurrentConvId(null);
    setShowConvList(false);
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
        <button onClick={() => setShowConvList(!showConvList)} className="dino-icon-btn" title="Conversations">
          <FolderOpen className="w-5 h-5" />
        </button>
        <div className="dino-title">GlyphBot • Dino Edition</div>
        <button onClick={() => setShowVoiceSettings(!showVoiceSettings)} className="dino-icon-btn" title="Voice Settings">
          <Volume2 className="w-5 h-5" />
        </button>
        <button onClick={() => saveCurrentConversation(currentConvId)} className="dino-icon-btn" title="Save">
          <Save className="w-5 h-5" />
        </button>
        <button onClick={() => setIsOpen(false)} className="dino-close-btn">
          <X className="w-5 h-5" />
        </button>
      </div>

      {showConvList && (
        <div className="dino-conv-list">
          <div className="dino-conv-header">
            <h3>Conversations</h3>
            <button onClick={newConversation} className="dino-new-conv">
              <Plus className="w-4 h-4" /> New
            </button>
          </div>
          <div className="dino-conv-items">
            {conversations.map(conv => (
              <div 
                key={conv.id} 
                className={`dino-conv-item ${currentConvId === conv.id ? 'active' : ''}`}
                onClick={() => loadConversation(conv)}
              >
                <div className="dino-conv-title">{conv.title}</div>
                <div className="dino-conv-date">
                  {new Date(conv.last_message_at).toLocaleDateString()}
                </div>
              </div>
            ))}
            {conversations.length === 0 && (
              <div className="dino-conv-empty">No saved conversations</div>
            )}
          </div>
        </div>
      )}

      {showVoiceSettings && (
        <div className="absolute top-0 left-0 right-0 bottom-0 z-20 overflow-y-auto bg-black/95 backdrop-blur-xl p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-cyan-400 text-lg font-bold">Voice Settings</h3>
            <button onClick={() => setShowVoiceSettings(false)} className="text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
          <VoiceSettingsPanel
            settings={voiceSettings}
            onChange={saveVoiceSettings}
          />
        </div>
      )}

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