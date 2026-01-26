import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Share2, Users, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function AuditSharePanel({ auditId, auditTitle }) {
  const [sharedWith, setSharedWith] = useState('');
  const [role, setRole] = useState('commenter');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async (e) => {
    e.preventDefault();
    if (!sharedWith.trim()) {
      toast.error('Enter at least one email');
      return;
    }

    const emails = sharedWith.split(',').map(e => e.trim()).filter(e => e);
    setLoading(true);

    try {
      const response = await base44.functions.invoke('auditShareAndCollaborate', {
        action: 'share',
        auditId,
        sharedWith: emails,
        role
      });

      setSharedWith('');
      toast.success(response.data.message);
    } catch (e) {
      console.error('[Share] Failed:', e);
      toast.error('Failed to share audit');
    } finally {
      setLoading(false);
    }
  };

  const copyShareLink = () => {
    const link = `${window.location.origin}/audit/${auditId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Link copied');
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <Share2 className="w-5 h-5 text-cyan-400" />
        <h3 className="font-semibold text-white">Share Audit</h3>
      </div>

      <form onSubmit={handleShare} className="space-y-3">
        <div>
          <label className="text-xs text-slate-400 uppercase tracking-wider">Team Members (comma-separated)</label>
          <input
            type="text"
            value={sharedWith}
            onChange={(e) => setSharedWith(e.target.value)}
            placeholder="user@example.com, another@example.com"
            className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs text-slate-400 uppercase tracking-wider">Access Level</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
          >
            <option value="viewer">Viewer - Read Only</option>
            <option value="commenter">Commenter - Add Comments</option>
            <option value="editor">Editor - Full Edit</option>
            <option value="admin">Admin - Manage Access</option>
          </select>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/30"
        >
          <Users className="w-4 h-4 mr-2" />
          {loading ? 'Sharing...' : 'Share Audit'}
        </Button>
      </form>

      <div className="mt-4 pt-4 border-t border-slate-700">
        <p className="text-xs text-slate-400 mb-2">Or copy share link:</p>
        <button
          onClick={copyShareLink}
          className="w-full flex items-center justify-between bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 hover:border-cyan-500 transition-colors"
        >
          <span className="truncate">{window.location.origin}/audit/{auditId.slice(0, 8)}...</span>
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}