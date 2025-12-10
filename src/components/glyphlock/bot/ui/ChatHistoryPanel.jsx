import React, { useState, useEffect } from 'react';
import { Save, Archive, Plus, Clock, MessageSquare, ArchiveRestore, Trash2, ChevronDown, ChevronUp, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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
  hasMessages = false,
  messages = [],
  onImportChat
}) {
  const [showArchived, setShowArchived] = useState(false);
  const [archivedChats, setArchivedChats] = useState([]);
  const [loadingArchived, setLoadingArchived] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const fileInputRef = React.useRef(null);

  useEffect(() => {
    if (showArchived && onGetArchived) {
      setLoadingArchived(true);
      onGetArchived().then(chats => {
        setArchivedChats(chats || []);
        setLoadingArchived(false);
      }).catch(err => {
        console.error('[ChatHistory] Failed to load archived:', err);
        setLoadingArchived(false);
      });
    }
  }, [showArchived, onGetArchived]);

  // Auto-refresh when panel opens
  useEffect(() => {
    if (savedChats.length === 0 && !isLoading) {
      console.log('[ChatHistory] Panel opened, no chats loaded - requesting refresh');
    }
  }, [savedChats, isLoading]);

  const handleSave = async () => {
    if (!onSave) {
      console.error('[ChatHistory] No onSave handler provided');
      return;
    }
    
    console.log('[ChatHistory] Save button clicked');
    setIsSaving(true);
    
    try {
      console.log('[ChatHistory] Calling onSave()...');
      const result = await onSave();
      console.log('[ChatHistory] Save result:', result);
      
      if (result) {
        toast.success('Chat saved successfully');
      } else {
        toast.error('Failed to save chat');
      }
    } catch (e) {
      console.error('[ChatHistory] Save error:', e);
      toast.error('Failed to save: ' + (e?.message || 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleArchive = async () => {
    if (!onArchive) {
      console.error('[ChatHistory] No onArchive handler');
      return;
    }
    if (!currentChatId) {
      console.warn('[ChatHistory] No currentChatId to archive');
      toast.error('No active chat to archive');
      return;
    }
    
    console.log('[ChatHistory] Archive button clicked, chatId:', currentChatId);
    setIsArchiving(true);
    
    try {
      const success = await onArchive();
      console.log('[ChatHistory] Archive result:', success);
      
      if (success) {
        toast.success('Chat archived');
      } else {
        toast.error('Failed to archive chat');
      }
    } catch (e) {
      console.error('[ChatHistory] Archive error:', e);
      toast.error('Failed to archive: ' + (e?.message || 'Unknown error'));
    } finally {
      setIsArchiving(false);
    }
  };

  const handleUnarchive = async (chatId) => {
    if (!onUnarchive) return;
    const success = await onUnarchive(chatId);
    if (success) {
      toast.success('Chat restored');
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
      if (showArchived && onGetArchived) {
        const chats = await onGetArchived();
        setArchivedChats(chats || []);
      }
    }
  };

  const handleExport = () => {
    if (!messages || messages.length === 0) {
      toast.error('No messages to export');
      return;
    }

    const exportData = {
      version: '1.0',
      exported: new Date().toISOString(),
      chatId: currentChatId,
      messages: messages.filter(m => m.id !== 'welcome-1'),
      metadata: {
        messageCount: messages.length - 1,
        provider: messages[messages.length - 1]?.providerId || 'unknown'
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `glyphbot_chat_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Chat exported successfully');
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (!data.messages || !Array.isArray(data.messages)) {
        throw new Error('Invalid chat file format');
      }

      if (onImportChat) {
        await onImportChat(data.messages);
        toast.success('Chat imported successfully');
      }
    } catch (err) {
      console.error('[Import]', err);
      toast.error('Failed to import: ' + (err.message || 'Invalid file'));
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/80 border-l border-purple-500/30">
      <div className="px-4 py-3 border-b border-purple-500/30 bg-purple-500/10">
        <div className="flex items-center gap-2 text-xs">
          <MessageSquare className="w-4 h-4 text-cyan-400" />
          <span className="uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-bold">
            Chat History
          </span>
        </div>
      </div>

      <div className="p-3 space-y-2 border-b border-slate-800/50">
        <Button
          onClick={onNewChat}
          variant="outline"
          size="sm"
          style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent', minHeight: '44px' }}
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
          style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent', minHeight: '44px' }}
          className="w-full justify-start gap-2 text-xs bg-slate-900/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-400 disabled:opacity-40"
        >
          <Save className="w-3.5 h-3.5" />
          {isSaving ? 'Saving...' : (currentChatId ? 'Update Save' : 'Save Chat')}
        </Button>
        
        <div className="grid grid-cols-2 gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImport}
          />
          <Button
            onClick={handleExport}
            disabled={!hasMessages}
            variant="outline"
            size="sm"
            style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent', minHeight: '44px' }}
            className="justify-start gap-2 text-xs bg-slate-900/60 border-blue-500/40 text-blue-300 hover:bg-blue-500/20 hover:border-blue-400 disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </Button>
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            size="sm"
            style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent', minHeight: '44px' }}
            className="justify-start gap-2 text-xs bg-slate-900/60 border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/20 hover:border-indigo-400"
          >
            <Upload className="w-3.5 h-3.5" />
            Import
          </Button>
        </div>
        
        <Button
          onClick={handleArchive}
          disabled={!currentChatId || isArchiving}
          variant="outline"
          size="sm"
          style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent', minHeight: '44px' }}
          className="w-full justify-start gap-2 text-xs bg-slate-900/60 border-amber-500/40 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400 disabled:opacity-40"
        >
          <Archive className="w-3.5 h-3.5" />
          {isArchiving ? 'Archiving...' : 'Archive Chat'}
        </Button>
      </div>

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
                const realId = chat.id || chat._id || chat.entity_id;
                if (!realId) return null;
                
                return (
                  <button
                    key={realId}
                    onClick={() => onLoadChat?.(realId)}
                    className={`w-full text-left p-2 rounded-lg transition-all text-xs ${
                      realId === currentChatId
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
                  const realId = chat.id || chat._id || chat.entity_id;
                  if (!realId) return null;
                  
                  return (
                    <div
                      key={realId}
                      className="p-2 rounded-lg bg-slate-900/40 border border-slate-700/50 text-xs"
                    >
                      <div className="font-medium truncate text-slate-400">{chat.title || 'Untitled'}</div>
                      <div className="flex items-center gap-1 mt-2">
                        <button
                          onClick={() => handleUnarchive(realId)}
                          className="flex items-center gap-1 px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-[10px]"
                        >
                          <ArchiveRestore className="w-3 h-3" />
                          Restore
                        </button>
                        <button
                          onClick={() => handleDelete(realId)}
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