import React, { useState } from 'react';
import { Clock, Shield, AlertTriangle, CheckCircle, XCircle, Loader2, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

/**
 * Phase 6: Audit History Panel
 * Displays list of past security audits
 */
export default function AuditHistoryPanel({ audits = [], isLoading, onViewAudit, onDeleteAudit }) {
  const [filter, setFilter] = useState('ALL');

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETE': return <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />;
      case 'IN_PROGRESS': return <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />;
      case 'FAILED': return <XCircle className="w-3.5 h-3.5 text-red-400" />;
      default: return <Clock className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const getGradeColor = (grade) => {
    if (!grade) return 'text-slate-400';
    const letter = grade.charAt(0);
    if (letter === 'A') return 'text-emerald-400';
    if (letter === 'B') return 'text-cyan-400';
    if (letter === 'C') return 'text-yellow-400';
    if (letter === 'D') return 'text-orange-400';
    return 'text-red-400';
  };

  const filteredAudits = filter === 'ALL' 
    ? audits 
    : audits.filter(a => a.status === filter);

  const handleDelete = async (e, auditId) => {
    e.stopPropagation();
    if (!confirm('Delete this audit permanently?')) return;
    
    const success = await onDeleteAudit(auditId);
    if (success) {
      toast.success('Audit deleted');
    } else {
      toast.error('Failed to delete audit');
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/80 border-l border-purple-500/30">
      {/* Header */}
      <div className="px-4 py-3 border-b border-purple-500/30 bg-purple-500/10">
        <div className="flex items-center gap-2 text-xs">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span className="uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-bold">
            Audit History
          </span>
        </div>
      </div>

      {/* Filter */}
      <div className="px-3 py-2 border-b border-slate-800/50 flex gap-1">
        {['ALL', 'COMPLETE', 'FAILED'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-2 py-1 rounded text-[10px] uppercase tracking-wider transition-all ${
              filter === f
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                : 'bg-slate-900/40 text-slate-500 hover:text-slate-300'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className="text-xs text-slate-500 text-center py-4">Loading...</div>
        ) : filteredAudits.length === 0 ? (
          <div className="text-xs text-slate-500 text-center py-4">
            {filter === 'ALL' ? 'No audits yet' : `No ${filter.toLowerCase()} audits`}
          </div>
        ) : (
          <div className="space-y-1">
            {filteredAudits.map(audit => {
              const realId = audit.id || audit._id || audit.entity_id;
              if (!realId) return null;

              return (
                <div
                  key={realId}
                  className="p-2 rounded-lg bg-slate-900/40 border border-slate-700/50 hover:border-cyan-500/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      {getStatusIcon(audit.status)}
                      <span className="text-xs text-slate-300 truncate font-medium">
                        {audit.targetUrl?.replace(/^https?:\/\//, '')}
                      </span>
                    </div>
                    {audit.overallGrade && (
                      <span className={`text-xs font-bold ${getGradeColor(audit.overallGrade)}`}>
                        {audit.overallGrade}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(audit.created_date).toLocaleDateString()}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400">
                      {audit.auditType}
                    </span>
                  </div>

                  {audit.summary && (
                    <p className="text-[10px] text-slate-400 line-clamp-2 mb-2">
                      {audit.summary}
                    </p>
                  )}

                  <div className="flex items-center gap-1">
                    <Button
                      onClick={() => onViewAudit(audit)}
                      size="sm"
                      variant="outline"
                      className="flex-1 h-7 text-[10px] bg-cyan-500/20 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button
                      onClick={(e) => handleDelete(e, realId)}
                      size="sm"
                      variant="outline"
                      className="h-7 px-2 text-[10px] bg-red-500/20 border-red-500/40 text-red-300 hover:bg-red-500/30"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}