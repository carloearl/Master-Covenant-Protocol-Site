import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserPlus, X, Shield, Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function ShareDialog({ open, onOpenChange, assetName, sharedWith = [], onInvite, onRevoke }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('editor');

  const handleInvite = () => {
    if (!email) return;
    if (onInvite) onInvite(email, role);
    setEmail('');
    toast.success(`Invited ${email} as ${role}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-cyan-400" />
            Share Project
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Manage access for "{assetName}". Collaborators can edit in real-time.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-end gap-2">
            <div className="flex-1 space-y-2">
              <Label htmlFor="email">Add Collaborator</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  id="email"
                  placeholder="colleague@example.com"
                  className="bg-slate-800 border-slate-700 text-white pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
                />
              </div>
            </div>
            <Button onClick={handleInvite} className="bg-cyan-600 hover:bg-cyan-700">
              Invite
            </Button>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-slate-500 uppercase tracking-wider">Current Access</Label>
            <ScrollArea className="h-[200px] rounded-md border border-slate-800 bg-slate-900/50 p-4">
              {sharedWith.length === 0 ? (
                <div className="text-center text-slate-500 py-8 text-sm">
                  No collaborators yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {sharedWith.map((user, i) => (
                    <div key={i} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-xs font-bold">
                          {user.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-200">{user}</p>
                          <p className="text-xs text-slate-500">Editor</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => onRevoke && onRevoke(user)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 border-t border-slate-800 pt-4">
          <div className="flex-1 flex items-center gap-2 text-xs text-slate-500">
            <Shield className="w-3 h-3" />
            <span>End-to-end encrypted session</span>
          </div>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-slate-700 text-slate-300">
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}