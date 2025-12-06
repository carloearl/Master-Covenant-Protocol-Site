import { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';

const STORAGE_KEYS = {
  MESSAGES: 'glyphbot_messages',
  SETTINGS: 'glyphbot_settings',
  CHAT_COUNT: 'glyphbot_chat_count',
  CURRENT_CHAT_ID: 'glyphbot_current_chat_id',
  FULL_HISTORY: 'glyphbot_full_history'
};

export function useGlyphBotPersistence(currentUser) {
  const [currentChatId, setCurrentChatId] = useState(null);
  const [savedChats, setSavedChats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fullHistory, setFullHistory] = useState([]);

  // Load state
  useEffect(() => {
    try {
      const savedChatId = localStorage.getItem(STORAGE_KEYS.CURRENT_CHAT_ID);
      if (savedChatId) setCurrentChatId(savedChatId);

      const savedFullHistory = localStorage.getItem(STORAGE_KEYS.FULL_HISTORY);
      if (savedFullHistory) setFullHistory(JSON.parse(savedFullHistory));
    } catch (e) {
      console.warn('[Persistence] Failed to load local state:', e);
    }
  }, []);

  // Load user's saved chats
  const loadSavedChats = useCallback(async () => {
    if (!currentUser?.email) return;

    setIsLoading(true);
    try {
      const chats = await base44.entities.GlyphBotChat.filter(
        { userId: currentUser.email },
        '-updated_date',
        50
      );

      const normalized = (chats || []).map(c => ({
        ...c,
        id: c.id || c._id || c.entity_id
      }));

      setSavedChats(normalized);
    } catch (e) {
      console.error('[Persistence] Failed to load chats:', e);
      setSavedChats([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?.email]);

  useEffect(() => {
    if (currentUser?.email) loadSavedChats();
  }, [currentUser?.email, loadSavedChats]);

  // Track messages
  const trackMessage = useCallback((message) => {
    if (!message?.role) return;

    setFullHistory(prev => {
      const updated = [...prev, message];
      localStorage.setItem(STORAGE_KEYS.FULL_HISTORY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const initializeHistory = useCallback((messages) => {
    if (!Array.isArray(messages)) return;

    if (fullHistory.length === 0 && messages.length > 0) {
      setFullHistory(messages);
      localStorage.setItem(STORAGE_KEYS.FULL_HISTORY, JSON.stringify(messages));
    }
  }, [fullHistory.length]);

  // Save chat
  const saveChat = useCallback(async (messages, options = {}) => {
    if (!currentUser?.email) {
      setTimeout(() => saveChat(messages, options), 300);
      return null;
    }

    const { title, provider, persona } = options;
    const historyToSave = Array.isArray(fullHistory) && fullHistory.length > messages.length
      ? fullHistory
      : messages;

    const chatTitle = title || generateChatTitle(historyToSave);

    const chatData = {
      userId: currentUser.email,
      title: chatTitle,
      fullHistory: JSON.stringify(
        Array.isArray(historyToSave) ? historyToSave : []
      ),
      messageCount: historyToSave.length,
      isArchived: false,
      provider: provider || 'AUTO',
      persona: persona || 'GENERAL'
    };

    try {
      let savedChat;

      if (currentChatId) {
        savedChat = await base44.entities.GlyphBotChat.update(currentChatId, chatData);
      } else {
        savedChat = await base44.entities.GlyphBotChat.create(chatData);
        const newId = savedChat.id || savedChat._id || savedChat.entity_id;
        setCurrentChatId(newId);
        localStorage.setItem(STORAGE_KEYS.CURRENT_CHAT_ID, newId);
      }

      await loadSavedChats();
      return savedChat;
    } catch (e) {
      console.error('[Persistence] Failed to save chat:', e);
      return null;
    }
  }, [currentUser?.email, currentChatId, fullHistory, loadSavedChats]);

  // Load chat (OMEGA FIX)
  const loadChat = useCallback(async (chatId) => {
    if (!chatId || !currentUser?.email) return null;

    try {
      const chats = await base44.entities.GlyphBotChat.filter(
        { userId: currentUser.email },
        '-updated_date',
        200
      );

      const chat = chats.find(c => {
        const cid = c.id || c._id || c.entity_id;
        return cid === chatId;
      });

      if (!chat) return null;

      const resolvedId = chat.id || chat._id || chat.entity_id;
      setCurrentChatId(resolvedId);
      localStorage.setItem(STORAGE_KEYS.CURRENT_CHAT_ID, resolvedId);

      let history = [];
      try {
        history = JSON.parse(chat.fullHistory || '[]');
        if (typeof history === 'string') history = JSON.parse(history);
      } catch {
        history = [];
      }

      setFullHistory(history);
      localStorage.setItem(STORAGE_KEYS.FULL_HISTORY, JSON.stringify(history));

      const visibleMessages = history.slice(-10).filter(m => m.id !== 'welcome-1');

      return {
        ...chat,
        messages: history,
        visibleMessages
      };
    } catch (e) {
      console.error('[Persistence] Failed to load chat:', chatId, e);
      return null;
    }
  }, [currentUser?.email]);

  // New chat
  const startNewChat = useCallback(() => {
    setCurrentChatId(null);
    setFullHistory([]);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_CHAT_ID);
    localStorage.removeItem(STORAGE_KEYS.FULL_HISTORY);
    localStorage.removeItem(STORAGE_KEYS.MESSAGES);
    sessionStorage.removeItem(STORAGE_KEYS.MESSAGES);
  }, []);

  const archiveChat = useCallback(async (chatId) => {
    if (!chatId) return false;

    try {
      await base44.entities.GlyphBotChat.update(chatId, { isArchived: true });

      if (chatId === currentChatId) startNewChat();
      await loadSavedChats();
      return true;
    } catch (e) {
      return false;
    }
  }, [currentChatId, loadSavedChats, startNewChat]);

  const unarchiveChat = useCallback(async (chatId) => {
    if (!chatId) return false;

    try {
      await base44.entities.GlyphBotChat.update(chatId, { isArchived: false });
      await loadSavedChats();
      return true;
    } catch {
      return false;
    }
  }, [loadSavedChats]);

  const deleteChat = useCallback(async (chatId) => {
    if (!chatId) return false;

    try {
      await base44.entities.GlyphBotChat.delete(chatId);
      if (chatId === currentChatId) startNewChat();
      await loadSavedChats();
      return true;
    } catch {
      return false;
    }
  }, [currentChatId, loadSavedChats, startNewChat]);

  return {
    currentChatId,
    savedChats,
    isLoading,
    fullHistory,
    trackMessage,
    initializeHistory,
    saveChat,
    archiveChat,
    loadChat,
    startNewChat,
    loadSavedChats,
    unarchiveChat,
    deleteChat,
    STORAGE_KEYS
  };
}

function generateChatTitle(messages) {
  const first = messages.find(m => m.role === 'user');
  if (!first?.content) return `Chat ${new Date().toLocaleDateString()}`;
  return first.content.length > 40 ? first.content.slice(0, 40) + '...' : first.content;
}

export default useGlyphBotPersistence;