import { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';

// Storage keys - extend existing pattern
const STORAGE_KEYS = {
  MESSAGES: 'glyphbot_messages',
  SETTINGS: 'glyphbot_settings',
  CHAT_COUNT: 'glyphbot_chat_count',
  CURRENT_CHAT_ID: 'glyphbot_current_chat_id',
  FULL_HISTORY: 'glyphbot_full_history'
};

/**
 * GlyphBot Persistence Hook - Phase 5
 * Handles local session storage + Base44 entity persistence
 */
export function useGlyphBotPersistence(currentUser) {
  const [currentChatId, setCurrentChatId] = useState(null);
  const [savedChats, setSavedChats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fullHistory, setFullHistory] = useState([]);

  // Load current chat ID from localStorage on mount
  useEffect(() => {
    try {
      const savedChatId = localStorage.getItem(STORAGE_KEYS.CURRENT_CHAT_ID);
      if (savedChatId) {
        setCurrentChatId(savedChatId);
      }
      
      // Load full history from localStorage
      const savedFullHistory = localStorage.getItem(STORAGE_KEYS.FULL_HISTORY);
      if (savedFullHistory) {
        setFullHistory(JSON.parse(savedFullHistory));
      }
    } catch (e) {
      console.warn('[GlyphBot Persistence] Failed to load local state:', e);
    }
  }, []);

  // Load saved chats from Base44 entity
  const loadSavedChats = useCallback(async () => {
    if (!currentUser?.email) return;
    
    setIsLoading(true);
    try {
      // Filter by userId to ensure user-scoped data
      const chats = await base44.entities.GlyphBotChat.filter(
        { userId: currentUser.email, isArchived: false },
        '-updated_date',
        50
      );
      setSavedChats(chats || []);
    } catch (e) {
      console.warn('[GlyphBot Persistence] Failed to load chats:', e);
      setSavedChats([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?.email]);

  // Load saved chats on mount when user is available
  useEffect(() => {
    if (currentUser?.email) {
      loadSavedChats();
    }
  }, [currentUser?.email, loadSavedChats]);

  // Track full history (called on every message add)
  const trackMessage = useCallback((message) => {
    setFullHistory(prev => {
      const updated = [...prev, message];
      try {
        localStorage.setItem(STORAGE_KEYS.FULL_HISTORY, JSON.stringify(updated));
      } catch (e) {
        console.warn('[GlyphBot Persistence] Failed to save full history:', e);
      }
      return updated;
    });
  }, []);

  // Initialize full history from trimmed messages (on first load)
  const initializeHistory = useCallback((messages) => {
    if (fullHistory.length === 0 && messages.length > 0) {
      setFullHistory(messages);
      try {
        localStorage.setItem(STORAGE_KEYS.FULL_HISTORY, JSON.stringify(messages));
      } catch (e) {
        console.warn('[GlyphBot Persistence] Failed to initialize full history:', e);
      }
    }
  }, [fullHistory.length]);

  // Save current chat to Base44 entity
  const saveChat = useCallback(async (messages, options = {}) => {
    if (!currentUser?.email) {
      console.warn('[GlyphBot Persistence] Cannot save: no authenticated user');
      return null;
    }

    const { title, provider, persona } = options;
    
    // Use full history if available, otherwise use provided messages
    const historyToSave = fullHistory.length > messages.length ? fullHistory : messages;
    
    // Generate title from first user message if not provided
    const chatTitle = title || generateChatTitle(historyToSave);
    
    const chatData = {
      userId: currentUser.email,
      title: chatTitle,
      fullHistory: JSON.stringify(historyToSave),
      messageCount: historyToSave.length,
      isArchived: false,
      provider: provider || 'AUTO',
      persona: persona || 'GENERAL'
    };

    try {
      let savedChat;
      
      if (currentChatId) {
        // Update existing chat
        savedChat = await base44.entities.GlyphBotChat.update(currentChatId, chatData);
        console.log('[GlyphBot Persistence] Chat updated:', currentChatId);
      } else {
        // Create new chat
        savedChat = await base44.entities.GlyphBotChat.create(chatData);
        setCurrentChatId(savedChat.id);
        localStorage.setItem(STORAGE_KEYS.CURRENT_CHAT_ID, savedChat.id);
        console.log('[GlyphBot Persistence] New chat created:', savedChat.id);
      }

      // Refresh saved chats list
      await loadSavedChats();
      
      return savedChat;
    } catch (e) {
      console.error('[GlyphBot Persistence] Failed to save chat:', e);
      return null;
    }
  }, [currentUser?.email, currentChatId, fullHistory, loadSavedChats]);

  // Archive a chat (set isArchived = true)
  const archiveChat = useCallback(async (chatId = currentChatId) => {
    if (!chatId) {
      console.warn('[GlyphBot Persistence] Cannot archive: no chat ID');
      return false;
    }

    try {
      await base44.entities.GlyphBotChat.update(chatId, { isArchived: true });
      console.log('[GlyphBot Persistence] Chat archived:', chatId);
      
      // Clear current chat if archiving active chat
      if (chatId === currentChatId) {
        setCurrentChatId(null);
        localStorage.removeItem(STORAGE_KEYS.CURRENT_CHAT_ID);
        localStorage.removeItem(STORAGE_KEYS.FULL_HISTORY);
        setFullHistory([]);
      }

      // Refresh saved chats list
      await loadSavedChats();
      
      return true;
    } catch (e) {
      console.error('[GlyphBot Persistence] Failed to archive chat:', e);
      return false;
    }
  }, [currentChatId, loadSavedChats]);

  // Load a specific chat from Base44
  const loadChat = useCallback(async (chatId) => {
    if (!chatId || !currentUser?.email) return null;

    try {
      // Filter by both id and userId for security
      const chats = await base44.entities.GlyphBotChat.filter(
        { id: chatId, userId: currentUser.email },
        undefined,
        1
      );
      const chat = chats?.[0];
      
      if (chat) {
        setCurrentChatId(chat.id);
        localStorage.setItem(STORAGE_KEYS.CURRENT_CHAT_ID, chat.id);
        
        // Parse and set full history
        const history = JSON.parse(chat.fullHistory || '[]');
        setFullHistory(history);
        localStorage.setItem(STORAGE_KEYS.FULL_HISTORY, JSON.stringify(history));
        
        console.log('[GlyphBot Persistence] Chat loaded:', chatId);
        return { ...chat, messages: history };
      }
      
      return null;
    } catch (e) {
      console.error('[GlyphBot Persistence] Failed to load chat:', e);
      return null;
    }
  }, [currentUser?.email]);

  // Start a new chat (clear current session)
  const startNewChat = useCallback(() => {
    setCurrentChatId(null);
    setFullHistory([]);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_CHAT_ID);
    localStorage.removeItem(STORAGE_KEYS.FULL_HISTORY);
    localStorage.removeItem(STORAGE_KEYS.MESSAGES);
    sessionStorage.removeItem(STORAGE_KEYS.MESSAGES);
    console.log('[GlyphBot Persistence] New chat started');
  }, []);

  // Get archived chats
  const getArchivedChats = useCallback(async () => {
    if (!currentUser?.email) return [];

    try {
      // Filter by userId for user-scoped archived chats
      const chats = await base44.entities.GlyphBotChat.filter(
        { userId: currentUser.email, isArchived: true },
        '-updated_date',
        50
      );
      return chats || [];
    } catch (e) {
      console.warn('[GlyphBot Persistence] Failed to load archived chats:', e);
      return [];
    }
  }, [currentUser?.email]);

  // Unarchive a chat
  const unarchiveChat = useCallback(async (chatId) => {
    if (!chatId) return false;

    try {
      await base44.entities.GlyphBotChat.update(chatId, { isArchived: false });
      console.log('[GlyphBot Persistence] Chat unarchived:', chatId);
      await loadSavedChats();
      return true;
    } catch (e) {
      console.error('[GlyphBot Persistence] Failed to unarchive chat:', e);
      return false;
    }
  }, [loadSavedChats]);

  // Delete a chat permanently
  const deleteChat = useCallback(async (chatId) => {
    if (!chatId) return false;

    try {
      await base44.entities.GlyphBotChat.delete(chatId);
      console.log('[GlyphBot Persistence] Chat deleted:', chatId);
      
      if (chatId === currentChatId) {
        startNewChat();
      }
      
      await loadSavedChats();
      return true;
    } catch (e) {
      console.error('[GlyphBot Persistence] Failed to delete chat:', e);
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
    getArchivedChats,
    unarchiveChat,
    deleteChat,
    STORAGE_KEYS
  };
}

// Helper: Generate chat title from first user message
function generateChatTitle(messages) {
  const firstUserMsg = messages.find(m => m.role === 'user');
  if (firstUserMsg?.content) {
    const content = firstUserMsg.content.trim();
    return content.length > 40 ? content.substring(0, 40) + '...' : content;
  }
  return `Chat ${new Date().toLocaleDateString()}`;
}

export default useGlyphBotPersistence;