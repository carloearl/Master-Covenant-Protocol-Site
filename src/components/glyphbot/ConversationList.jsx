import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function ConversationList({ conversations, currentConversation, onSelect, onDelete }) {
  if (!conversations || conversations.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No conversations yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-[500px] overflow-y-auto">
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          onClick={() => onSelect(conversation.id)}
          className={cn(
            "group p-3 rounded-lg cursor-pointer transition-all",
            currentConversation?.id === conversation.id
              ? "bg-cyan-500/20 border border-cyan-500/50"
              : "bg-gray-800 border border-gray-700 hover:border-cyan-500/30"
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                <h3 className="text-sm font-medium truncate">
                  {conversation.metadata?.name || 'Untitled Chat'}
                </h3>
              </div>
              <p className="text-xs text-gray-500">
                {format(new Date(conversation.created_date), "MMM d, h:mm a")}
              </p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => onDelete(conversation.id, e)}
              className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}