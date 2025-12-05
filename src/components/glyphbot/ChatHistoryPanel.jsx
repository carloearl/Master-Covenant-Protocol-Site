import React, { useState, useEffect } from 'react';
import { Save, Archive, Plus, Clock, MessageSquare, ArchiveRestore, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

/**
 * ChatHistoryPanel - Phase 5 UI for Save/Archive/Load
 * Minimal sidebar component for GlyphBot chat persistence
 */
export default function ChatHistoryPanel({
  currentChatId,
  savedChats = [],
  isLoading,
  onSave,
  onArchive,
  onLoadChat,
  onNewChat,
  onGetArchived,
  onUnarchive,
  onDelete,
  hasMessages = false
}) {
  const [showArchived, setShowArchived] = useState(false);
  const [archivedChats, setArchivedChats] = useState([]);
  const [loadingArchived, setLoadingArchived] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);

  // Load archived chats when toggled
  useEffect(() => {
    if (showArchived && onGetArchived) {
      setLoadingArchived(true);
      onGetArchived().then(chats => {
        setArchivedChats(chats || []);
        setLoadingArchived(false);
      });
    }
  }, [showArchived, onGetArchived]);

  const handleSave = async () => {
    if (!onSave) return;
    setIsSaving(true);
    try {
      const result = await onSave();
      if (result) {
        toast.success('Chat saved successfully');
      } else {
        toast.error('Failed to save chat');
      }
    } catch (e) {
      toast.error('Failed to save chat');
    } finally {
      setIsSaving(false);
    }
  };

  const handleArchive = async () => {
    if (!onArchive || !currentChatId) return;
    setIsArchiving(true);
    try {
      const success = await onArchive();
      if (success) {
        toast.success('Chat archived');
      } else {
        toast.error('Failed to archive chat');
      }
    } catch (e) {
      toast.error('Failed to archive chat');
    } finally {
      setIsArchiving(false);
    }
  };

  const handleUnarchive = async (chatId) => {
    if (!onUnarchive) return;
    const success = await onUnarchive(chatId);
    if (success) {
      toast.success('Chat restored');
      // Refresh archived list
      if (onGetArchived) {
        const chats = await onGetArchived();
        setArchivedChats(chats || []);
      }
    }
  };

  const handleDelete = async (chatId) => {
    if (!onDelete) return;
    if (!confirm('Delete this chat permanently?')) return;
    
    const success = await onDelete(chatId);
    if (success) {
      toast.success('Chat deleted');
      // Refresh archived list if showing
      if (showArchived && onGetArchived) {
        const chats = await onGetArchived();
        setArchivedChats(chats || []);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/80 border-l border-purple-500/30">
      {/* Header */}
      <div className="px-4 py-3 border-b border-purple-500/30 bg-purple-500/10">
        <div className="flex items-center gap-2 text-xs">
          <MessageSquare className="w-4 h-4 text-cyan-400" />
          <span className="uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-bold">
            Chat History
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-3 space-y-2 border-b border-slate-800/50">
        <Button
          onClick={onNewChat}
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2 text-xs bg-slate-900/60 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400"
        >
          <Plus className="w-3.5 h-3.5" />
          New Chat
        </Button>
        
        <Button
          onClick={handleSave}
          disabled={!hasMessages || isSaving}
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2 text-xs bg-slate-900/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-400 disabled:opacity-40"
        >
          <Save className="w-3.5 h-3.5" />
          {isSaving ? 'Saving...' : (currentChatId ? 'Update Save' : 'Save Chat')}
        </Button>
        
        <Button
          onClick={handleArchive}
          disabled={!currentChatId || isArchiving}
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2 text-xs bg-slate-900/60 border-amber-500/40 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400 disabled:opacity-40"
        >
          <Archive className="w-3.5 h-3.5" />
          {isArchiving ? 'Archiving...' : 'Archive Chat'}
        </Button>
      </div>

      {/* Saved Chats List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          <div className="text-[10px] uppercase tracking-wider text-slate-500 px-2 py-1 mb-1">
            Recent Chats ({savedChats.length})
          </div>
          
          {isLoading ? (
            <div className="text-xs text-slate-500 text-center py-4">Loading...</div>
          ) : savedChats.length === 0 ? (
            <div className="text-xs text-slate-500 text-center py-4">No saved chats</div>
          ) : (
            <div className="space-y-1">
              {savedChats.map(chat => {
                // Defensive ID handling for Base44 variations
                const chatId = chat.id || chat._id || chat.entity_id;
                if (!chatId) {
                  console.warn('[ChatHistoryPanel] Chat missing ID:', chat);
                  return null;
                }
                
                return (
                  <button
                    key={chatId}
                    onClick={() => onLoadChat?.(chatId)}
                    className={`w-full text-left p-2 rounded-lg transition-all text-xs ${
                      chatId === currentChatId
                        ? 'bg-cyan-500/20 border border-cyan-400/50 text-cyan-200'
                        : 'bg-slate-900/40 border border-slate-700/50 text-slate-300 hover:bg-slate-800/60 hover:border-slate-600'
                    }`}
                  >
                    <div className="font-medium truncate">{chat.title || 'Untitled'}</div>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                      <Clock className="w-3 h-3" />
                      {new Date(chat.updated_date || chat.created_date).toLocaleDateString()}
                      <span className="ml-auto">{chat.messageCount || 0} msgs</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Archived Section */}
        <div className="border-t border-slate-800/50 mt-2">
          <button
            onClick={() => setShowArchived(!showArchived)}
            className="w-full flex items-center justify-between px-4 py-2 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Archive className="w-3.5 h-3.5" />
              Archived
            </span>
            {showArchived ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {showArchived && (
            <div className="p-2 space-y-1">
              {loadingArchived ? (
                <div className="text-xs text-slate-500 text-center py-2">Loading...</div>
              ) : archivedChats.length === 0 ? (
                <div className="text-xs text-slate-500 text-center py-2">No archived chats</div>
              ) : (
                archivedChats.map(chat => {
                  const chatId = chat.id || chat._id || chat.entity_id;
                  if (!chatId) return null;
                  
                  return (
                    <div
                      key={chatId}
                      className="p-2 rounded-lg bg-slate-900/40 border border-slate-700/50 text-xs"
                    >
                      <div className="font-medium truncate text-slate-400">{chat.title || 'Untitled'}</div>
                      <div className="flex items-center gap-1 mt-2">
                        <button
                          onClick={() => handleUnarchive(chatId)}
                          className="flex items-center gap-1 px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-[10px]"
                        >
                          <ArchiveRestore className="w-3 h-3" />
                          Restore
                        </button>
                        <button
                          onClick={() => handleDelete(chatId)}
                          className="flex items-center gap-1 px-2 py-1 rounded bg-red-500/20 text-red-300 hover:bg-red-500/30 text-[10px]"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}