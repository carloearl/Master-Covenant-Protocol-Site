import { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { STORAGE_KEYS } from '../config';

export function useGlyphBotPersistence(currentUser) {
  const [currentChatId, setCurrentChatId] = useState(null);
  const [savedChats, setSavedChats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fullHistory, setFullHistory] = useState([]);

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

  const loadSavedChats = useCallback(async () => {
    if (!currentUser?.email) return;

    setIsLoading(true);
    try {
      const chats = await base44.entities.GlyphBotChat.filter(
        { userId: currentUser.email, isArchived: false },
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

  const saveChat = useCallback(async (messages, options = {}) => {
    if (!currentUser?.email) {
      console.error('[Persistence] Cannot save - no user email:', currentUser);
      throw new Error('User not authenticated - please log in');
    }

    const { title, provider, persona } = options;
    const historyToSave = Array.isArray(fullHistory) && fullHistory.length > messages.length
      ? fullHistory
      : messages;

    if (!historyToSave || historyToSave.length === 0) {
      console.warn('[Persistence] No messages to save');
      throw new Error('No messages to save');
    }

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

    console.log('[Persistence] Saving chat:', {
      chatId: currentChatId,
      title: chatTitle,
      messageCount: historyToSave.length,
      isUpdate: !!currentChatId,
      user: currentUser.email
    });

    try {
      let savedChat;

      if (currentChatId) {
        console.log('[Persistence] Updating existing chat:', currentChatId);
        savedChat = await base44.entities.GlyphBotChat.update(currentChatId, chatData);
      } else {
        console.log('[Persistence] Creating new chat');
        savedChat = await base44.entities.GlyphBotChat.create(chatData);
        const newId = savedChat.id || savedChat._id || savedChat.entity_id;
        console.log('[Persistence] New chat created with ID:', newId);
        setCurrentChatId(newId);
        localStorage.setItem(STORAGE_KEYS.CURRENT_CHAT_ID, newId);
      }

      console.log('[Persistence] Chat saved successfully:', savedChat);
      await loadSavedChats();
      return savedChat;
    } catch (e) {
      console.error('[Persistence] Failed to save chat:', e);
      console.error('[Persistence] Chat data:', chatData);
      console.error('[Persistence] Full error:', e?.message, e?.stack);
      throw e;
    }
  }, [currentUser?.email, currentChatId, fullHistory, loadSavedChats]);

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

      const visibleMessages = history.filter(m => m.id !== 'welcome-1');

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

  const getArchivedChats = useCallback(async () => {
    if (!currentUser?.email) return [];

    try {
      const chats = await base44.entities.GlyphBotChat.filter(
        { userId: currentUser.email, isArchived: true },
        '-updated_date',
        50
      );

      const normalized = (chats || []).map(c => ({
        ...c,
        id: c.id || c._id || c.entity_id
      }));

      return normalized;
    } catch (e) {
      console.error('[Persistence] Failed to load archived chats:', e);
      return [];
    }
  }, [currentUser?.email]);

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
    getArchivedChats,
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