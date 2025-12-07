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
    if (!currentUser?.email) {
      console.warn('[Persistence] Cannot load chats - no user email');
      return;
    }

    console.log('[Persistence] Loading chats for user:', currentUser.email);
    setIsLoading(true);
    
    try {
      const response = await base44.functions.invoke('loadGlyphBotChats', {
        includeArchived: false
      });

      console.log('[Persistence] Load response:', response.data);

      if (!response.data?.success) {
        throw new Error(response.data?.error || 'Load failed');
      }

      const chats = response.data.chats || [];
      console.log('[Persistence] Loaded chats:', chats.length);
      
      setSavedChats(chats);
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

    console.log('[Persistence] Calling backend function saveGlyphBotChat');

    try {
      const response = await base44.functions.invoke('saveGlyphBotChat', {
        chatId: currentChatId,
        messages: historyToSave,
        title: title || generateChatTitle(historyToSave),
        provider: provider || 'AUTO',
        persona: persona || 'GENERAL'
      });

      if (!response.data?.success) {
        throw new Error(response.data?.error || 'Save failed');
      }

      const savedChat = response.data.chat;
      const newId = response.data.chatId || savedChat.id || savedChat._id || savedChat.entity_id;
      
      console.log('[Persistence] Chat saved successfully:', newId);
      
      setCurrentChatId(newId);
      localStorage.setItem(STORAGE_KEYS.CURRENT_CHAT_ID, newId);
      
      await loadSavedChats();
      return savedChat;
    } catch (e) {
      console.error('[Persistence] Failed to save chat:', e);
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

    console.log('[Persistence] Calling backend function archiveGlyphBotChat');

    try {
      const response = await base44.functions.invoke('archiveGlyphBotChat', {
        chatId
      });

      if (!response.data?.success) {
        throw new Error(response.data?.error || 'Archive failed');
      }

      if (chatId === currentChatId) startNewChat();
      await loadSavedChats();
      return true;
    } catch (e) {
      console.error('[Persistence] Archive failed:', e);
      return false;
    }
  }, [currentChatId, loadSavedChats, startNewChat]);

  const unarchiveChat = useCallback(async (chatId) => {
    if (!chatId) return false;

    console.log('[Persistence] Calling backend function unarchiveGlyphBotChat');

    try {
      const response = await base44.functions.invoke('unarchiveGlyphBotChat', {
        chatId
      });

      if (!response.data?.success) {
        throw new Error(response.data?.error || 'Unarchive failed');
      }

      await loadSavedChats();
      return true;
    } catch (e) {
      console.error('[Persistence] Unarchive failed:', e);
      return false;
    }
  }, [loadSavedChats]);

  const deleteChat = useCallback(async (chatId) => {
    if (!chatId) return false;

    console.log('[Persistence] Calling backend function deleteGlyphBotChat');

    try {
      const response = await base44.functions.invoke('deleteGlyphBotChat', {
        chatId
      });

      if (!response.data?.success) {
        throw new Error(response.data?.error || 'Delete failed');
      }

      if (chatId === currentChatId) startNewChat();
      await loadSavedChats();
      return true;
    } catch (e) {
      console.error('[Persistence] Delete failed:', e);
      return false;
    }
  }, [currentChatId, loadSavedChats, startNewChat]);

  const getArchivedChats = useCallback(async () => {
    if (!currentUser?.email) return [];

    try {
      const response = await base44.functions.invoke('loadGlyphBotChats', {
        includeArchived: true
      });

      if (!response.data?.success) {
        throw new Error(response.data?.error || 'Load failed');
      }

      const allChats = response.data.chats || [];
      return allChats.filter(c => c.isArchived === true);
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