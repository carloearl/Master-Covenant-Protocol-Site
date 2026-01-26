import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { MessageSquare, Send, AlertCircle, Users, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AuditCommentSection({ auditId, currentUser }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [severity, setSeverity] = useState('info');
  const [submitting, setSubmitting] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadComments();
  }, [auditId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const response = await base44.functions.invoke('auditShareAndCollaborate', {
        action: 'get_comments',
        auditId
      });
      setComments(response.data.comments || []);
    } catch (e) {
      console.error('[Comments] Load failed:', e);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    try {
      const response = await base44.functions.invoke('auditShareAndCollaborate', {
        action: 'add_comment',
        auditId,
        comment: {
          content,
          severity,
          findingId: null
        }
      });

      setComments([...comments, response.data.comment]);
      setContent('');
      setSeverity('info');
      toast.success('Comment added');
    } catch (e) {
      console.error('[Comment] Add failed:', e);
      toast.error('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const getSeverityColor = (sev) => {
    const colors = {
      critical: 'text-red-400 bg-red-500/20 border-red-500/50',
      high: 'text-orange-400 bg-orange-500/20 border-orange-500/50',
      medium: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50',
      low: 'text-cyan-400 bg-cyan-500/20 border-cyan-500/50',
      info: 'text-blue-400 bg-blue-500/20 border-blue-500/50'
    };
    return colors[sev] || colors.info;
  };

  return (
    <div className="mt-6 pt-6 border-t border-slate-700 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-5 h-5 text-purple-400" />
        <h3 className="font-semibold text-white">Team Comments ({comments.length})</h3>
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleAddComment} className="bg-slate-800/30 rounded-lg p-4 space-y-3 border border-slate-700">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a comment... Use @email to mention team members"
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none resize-none"
          rows={3}
        />

        <div className="flex items-center justify-between">
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className={`text-xs font-semibold px-3 py-1 rounded border ${getSeverityColor(severity)} bg-slate-900`}
          >
            <option value="info">Info</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>

          <Button
            type="submit"
            disabled={!content.trim() || submitting}
            className="bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/30"
            size="sm"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Send
          </Button>
        </div>
      </form>

      {/* Comments List */}
      {loading ? (
        <div className="flex items-center justify-center py-6 text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          Loading comments...
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-slate-400">No comments yet</div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-semibold text-white text-sm">{comment.authorName}</div>
                  <div className="text-xs text-slate-400">{comment.authorEmail}</div>
                </div>
                <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded border font-semibold ${getSeverityColor(comment.severity)}`}>
                  {comment.severity}
                </span>
              </div>

              <p className="text-sm text-slate-300 mb-3 whitespace-pre-wrap">{comment.content}</p>

              {comment.mention?.length > 0 && (
                <div className="text-xs text-purple-400 flex items-center gap-1 mb-2">
                  <Users className="w-3 h-3" />
                  Mentioned: {comment.mention.join(', ')}
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  {new Date(comment.created_date).toLocaleString()}
                </span>

                {comment.status && (
                  <span className={`text-xs px-2 py-1 rounded ${
                    comment.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-300' : 
                    comment.status === 'acknowledged' ? 'bg-blue-500/20 text-blue-300' :
                    'bg-slate-700/50 text-slate-400'
                  }`}>
                    {comment.status}
                  </span>
                )}
              </div>

              {comment.replies?.length > 0 && (
                <button
                  onClick={() => setExpandedId(expandedId === comment.id ? null : comment.id)}
                  className="mt-2 text-xs text-cyan-400 hover:text-cyan-300"
                >
                  {expandedId === comment.id ? '▼' : '▶'} {comment.replies.length} replies
                </button>
              )}

              {expandedId === comment.id && comment.replies && (
                <div className="mt-3 space-y-2 pl-4 border-l-2 border-slate-700">
                  {comment.replies.map((reply, idx) => (
                    <div key={idx} className="text-xs">
                      <div className="font-semibold text-cyan-300">{reply.authorName}</div>
                      <p className="text-slate-300 mt-1">{reply.content}</p>
                      <div className="text-slate-500 mt-1">{new Date(reply.createdAt).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}