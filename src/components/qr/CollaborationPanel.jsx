import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Users, Wifi } from 'lucide-react';

export default function CollaborationPanel({ activeUsers = [], isConnected }) {
  return (
    <Card className="bg-slate-900/80 border-purple-500/30 backdrop-blur-sm fixed bottom-4 right-4 z-50 w-auto min-w-[200px] shadow-2xl">
      <CardContent className="p-3 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-xs font-mono text-purple-300">
            {isConnected ? 'LIVE SYNC' : 'OFFLINE'}
          </span>
        </div>

        <div className="h-4 w-px bg-slate-700" />

        <div className="flex -space-x-2">
          <TooltipProvider>
            {activeUsers.map((email, i) => (
              <Tooltip key={i}>
                <TooltipTrigger>
                  <Avatar className="w-8 h-8 border-2 border-slate-900 ring-2 ring-purple-500/20">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`} />
                    <AvatarFallback className="bg-purple-900 text-purple-200 text-xs">
                      {email.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">{email}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
          
          {activeUsers.length === 0 && (
            <span className="text-xs text-slate-500 italic ml-2">No other users</span>
          )}
        </div>
        
        {activeUsers.length > 0 && (
           <Badge variant="outline" className="ml-auto border-purple-500/30 text-purple-400 text-[10px]">
             {activeUsers.length + 1} Editors
           </Badge>
        )}
      </CardContent>
    </Card>
  );
}